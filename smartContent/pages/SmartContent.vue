<template>
    <div class="editor-container">
        <input type="text" v-model="title" placeholder="제목을 입력하세요" class="title-input" />
        <input type="hidden" v-model="contentType" />
        <div class="editor-area" @dragover.prevent @drop.prevent="handleEditorDrop"
            :class="{ 'is-dragging': isDragging }" @dragenter="isDragging = true" @dragleave="isDragging = false">
            <div class="content-editor" contenteditable="true" ref="editorRef" @input="handleInput" @paste="handlePaste"
                :class="{ 'drag-over': isDragging }" placeholder="내용을 입력하세요...">
            </div>
        </div>
        <button @click="saveContent" class="save-button">저장</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAwsS3Config } from '@/utility/awsFileS3Config'
import {
    PutObjectCommand,
    ListObjectsCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectAclCommand,
    ObjectCannedACL
} from '@aws-sdk/client-s3'
import { useSmartContentStore } from '@/smartContent/stores/smartContentStore'

interface ContentBlock {
    type: 'text' | 'image'
    content?: string
    image_url?: string
    alt?: string
    height?: number
    sequence_number: number
}

const resizeImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
        const MAX_WIDTH = 600

        const img = new Image()
        img.src = URL.createObjectURL(file)

        img.onload = () => {
            const canvas = document.createElement('canvas')
            let width = img.width
            let height = img.height

            if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width)
                width = MAX_WIDTH
            }

            canvas.width = width
            canvas.height = height

            const ctx = canvas.getContext('2d')
            ctx?.drawImage(img, 0, 0, width, height)

            canvas.toBlob((blob) => {
                if (blob) {
                    const resizedFile = new File([blob], file.name, {
                        type: file.type,
                        lastModified: Date.now(),
                    })
                    resolve(resizedFile)
                } else {
                    reject(new Error('이미지 변환 실패'))
                }
            }, file.type)
        }

        img.onerror = () => reject(new Error('이미지 로드 실패'))
    })
}

const { s3Client } = useAwsS3Config()
const config = useRuntimeConfig()
const smartContentStore = useSmartContentStore()

const title = ref('')
const editorRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const contentBlocks = ref<ContentBlock[]>([])
const uploading = ref(false)
const uploadSuccess = ref(false)
const uploadError = ref<string | null>(null)
let currentSequenceNumber = 1

const BUCKET_NAME = config.public.BUCKET_NAME
const AWS_REGION = config.public.AWS_REGION

const handleEditorDrop = async (event: DragEvent) => {
    event.preventDefault()
    isDragging.value = false

    const files = event.dataTransfer?.files
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.')
        return
    }

    try {
        if (!editorRef.value) return

        if (!editorRef.value.innerHTML.trim()) {
            editorRef.value.innerHTML = '<div class="loading-placeholder">이미지 업로드 중...</div>'
        } else {
            const selection = window.getSelection()
            const range = selection?.getRangeAt(0)
            if (range) {
                const loadingPlaceholder = document.createElement('div')
                loadingPlaceholder.className = 'loading-placeholder'
                loadingPlaceholder.textContent = '이미지 업로드 중...'
                range.insertNode(loadingPlaceholder)
                range.setStartAfter(loadingPlaceholder)
                range.collapse(true)
            }
        }

        const resizedFile = await resizeImage(file)

        const params = {
            Bucket: BUCKET_NAME,
            Key: `${Date.now()}-${file.name}`,
            Body: resizedFile,
        }

        uploading.value = true
        const data = await s3Client.send(new PutObjectCommand(params))
        const imageUrl = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params.Key}`

        uploading.value = false
        uploadSuccess.value = true

        const loadingPlaceholder = editorRef.value.querySelector('.loading-placeholder')
        if (loadingPlaceholder) {
            const imgElement = document.createElement('img')
            imgElement.src = imageUrl
            imgElement.className = 'inline-image'
            imgElement.alt = file.name

            const newImageBlock = {
                type: 'image' as const,
                image_url: imageUrl,
                alt: file.name,
                sequence_number: contentBlocks.value.length + 1
            }

            contentBlocks.value = [...contentBlocks.value, newImageBlock]
            imgElement.dataset.sequenceNumber = newImageBlock.sequence_number.toString()

            loadingPlaceholder.parentNode?.replaceChild(imgElement, loadingPlaceholder)

            const selection = window.getSelection()
            const range = document.createRange()
            range.setStartAfter(imgElement)
            range.collapse(true)
            selection?.removeAllRanges()
            selection?.addRange(range)

            const br = document.createElement('br')
            imgElement.after(br)
        }
    } catch (error) {
        uploading.value = false
        uploadError.value = (error as Error).message
        console.error('이미지 업로드 실패:', error)
        alert('이미지 업로드에 실패했습니다.')
        const loadingPlaceholder = editorRef.value?.querySelector('.loading-placeholder')
        if (loadingPlaceholder) {
            loadingPlaceholder.remove()
        }
    }
}

const handlePaste = async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items
    if (!items) return

    for (const item of items) {
        if (item.type.startsWith('image/')) {
            event.preventDefault()
            const file = item.getAsFile()
            if (file) {
                try {
                    const resizedFile = await resizeImage(file)

                    const params = {
                        Bucket: BUCKET_NAME,
                        Key: `${Date.now()}-pasted-image`,
                        Body: resizedFile,
                    }

                    uploading.value = true
                    const data = await s3Client.send(new PutObjectCommand(params))
                    const imageUrl = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params.Key}`

                    uploading.value = false
                    uploadSuccess.value = true

                    const imgElement = document.createElement('img')
                    imgElement.src = imageUrl
                    imgElement.className = 'inline-image'
                    imgElement.alt = 'Pasted image'

                    const newImageBlock = {
                        type: 'image' as const,
                        image_url: imageUrl,
                        alt: 'Pasted image',
                        sequence_number: contentBlocks.value.length + 1
                    }

                    contentBlocks.value = [...contentBlocks.value, newImageBlock]
                    imgElement.dataset.sequenceNumber = newImageBlock.sequence_number.toString()

                    const selection = window.getSelection()
                    const range = selection?.getRangeAt(0)
                    range?.insertNode(imgElement)

                    const newRange = document.createRange()
                    newRange.setStartAfter(imgElement)
                    newRange.collapse(true)
                    selection?.removeAllRanges()
                    selection?.addRange(newRange)

                } catch (error) {
                    console.error('이미지 업로드 실패:', error)
                    alert('이미지 업로드에 실패했습니다.')
                }
            }
            return
        }
    }
}

const handleInput = () => {
    if (!editorRef.value) return

    const content = editorRef.value.innerHTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = content

    contentBlocks.value = []
    currentSequenceNumber = 1

    const processNodes = (nodes: NodeListOf<ChildNode> | Array<ChildNode>) => {
        let currentTextContent = ''

        Array.from(nodes).forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent?.trim() || ''
                if (text) {
                    currentTextContent += text + ' '
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as HTMLElement

                if (currentTextContent.trim()) {
                    contentBlocks.value.push({
                        type: 'text',
                        content: currentTextContent.trim(),
                        sequence_number: currentSequenceNumber++
                    })
                    currentTextContent = ''
                }

                if (element.tagName === 'IMG') {
                    contentBlocks.value.push({
                        type: 'image',
                        image_url: element.src,
                        alt: element.alt || '',
                        sequence_number: currentSequenceNumber++
                    })
                } else if (element.tagName !== 'BR') {
                    const text = element.textContent?.trim() || ''
                    if (text) {
                        currentTextContent += text + ' '
                    }
                }
            }
        })

        if (currentTextContent.trim()) {
            contentBlocks.value.push({
                type: 'text',
                content: currentTextContent.trim(),
                sequence_number: currentSequenceNumber++
            })
        }
    }

    processNodes(tempDiv.childNodes)
}

const saveContent = async () => {
    try {
        if (!title.value.trim()) {
            alert('제목을 입력해주세요.')
            return
        }

        const smartContentData = {
            title: title.value.trim(),
            content_type: 'blog',
            userToken: localStorage.getItem('userToken'),
            items: contentBlocks.value.map((block, index) => ({
                type: block.type,
                content: block.type === 'text' ? block.content : undefined,
                image_url: block.type === 'image' ? block.image_url : undefined,
                sequence_number: index + 1
            }))
        }

        

        const result = await smartContentStore.requestCreateSmartContentToDjango(smartContentData)
        

        if (result) {
            alert('저장되었습니다.')
        } else {
            throw new Error('저장 실패')
        }
    } catch (error) {
        console.error('저장 실패:', error)
        alert('저장에 실패했습니다.')
    }
}
</script>

<style scoped>
.editor-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    overflow-x: hidden;
}

.title-input {
    width: 100%;
    font-size: 24px;
    margin-bottom: 20px;
    margin-top: 100px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.editor-area {
    margin: 20px 0;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #fff;
    min-height: 300px;
    position: relative;
    overflow: hidden;
}

.editor-area.is-dragging {
    border: 2px dashed #0078ff;
    background: rgba(0, 120, 255, 0.1);
}

.content-editor {
    width: 100%;
    min-height: 300px;
    padding: 20px;
    outline: none;
    line-height: 1.6;
    word-wrap: break-word;
    position: relative;
}

.content-editor[placeholder]:empty:before {
    content: attr(placeholder);
    color: #999;
}

.content-editor.drag-over {
    background: rgba(0, 120, 255, 0.1);
    border: 2px dashed #0078ff;
}

.inline-image {
    max-width: 600px;
    width: 100%;
    height: auto;
    margin: 10px auto;
    border-radius: 4px;
    display: block;
    object-fit: contain;
    position: relative;
}

.loading-placeholder {
    padding: 10px;
    margin: 10px 0;
    background: #f5f5f5;
    border-radius: 4px;
    text-align: center;
    color: #666;
    position: relative;
}

.save-button {
    width: 100%;
    padding: 15px;
    margin-top: 20px;
    border: none;
    border-radius: 4px;
    background: #ccc;
    color: black;
    font-size: 16px;
    cursor: pointer;
}

.save-button:hover {
    background: #ff9033;
}
</style>