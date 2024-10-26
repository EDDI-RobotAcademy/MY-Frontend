<template>
    <div class="editor-container">
        <input type="text" 
               v-model="title" 
               placeholder="제목을 입력하세요" 
               class="title-input" />
        
        <input type="hidden" v-model="contentType" />
        
        <!-- 에디터 영역 -->
        <div class="editor-area">
            <div v-for="(block, index) in contentBlocks" 
                 :key="index" 
                 class="content-block"
                 draggable="true"
                 @dragstart="startDrag(index)"
                 @dragover.prevent
                 @drop="onDrop(index)">
                
                <!-- 텍스트 에디터 -->
                <textarea v-if="block.type === 'text'"
                         v-model="block.content"
                         class="text-editor"
                         :style="{ height: block.height + 'px' }"
                         @input="autoResize($event, index)"
                         placeholder="내용을 입력하세요..."></textarea>
                
                <!-- 이미지 영역 -->
                <div v-else-if="block.type === 'image'" 
                     class="image-block">
                    <img v-if="block.image_url" 
                         :src="block.image_url" 
                         :alt="block.alt || ''"
                         class="uploaded-image" />
                    <input v-else 
                           type="file" 
                           @change="(e) => handleImageUpload(e, index)"
                           accept="image/*" />
                </div>

                <!-- 블록 제어 버튼 -->
                <div class="block-controls">
                    <button @click="moveBlockUp(index)" 
                            :disabled="index === 0"
                            class="control-button">↑</button>
                    <button @click="moveBlockDown(index)" 
                            :disabled="index === contentBlocks.length - 1"
                            class="control-button">↓</button>
                    <button @click="removeBlock(index)"
                            class="control-button delete">삭제</button>
                </div>
            </div>
        </div>

        <!-- 새 블록 추가 버튼 -->
        <div class="add-block-menu">
            <button @click="addTextBlock" 
                    class="add-button">+ 텍스트</button>
            <button @click="addImageBlock" 
                    class="add-button">+ 이미지</button>
        </div>

        <!-- 저장 버튼 -->
        <button @click="saveContent" 
                class="save-button">저장</button>
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
}

const { s3Client } = useAwsS3Config()
const config = useRuntimeConfig()
const smartContentStore = useSmartContentStore()

// 기본 상태 관리
const title = ref('')
const contentBlocks = ref<ContentBlock[]>([])
const contentType = ref('')
const uploading = ref(false)
const uploadSuccess = ref(false)
const uploadError = ref<string | null>(null)
const uploadedFileURL = ref('')
const fileList = ref<Array<{ Key: string }>>([])
const fileKey = ref('')

// 환경 변수
const BUCKET_NAME = config.public.BUCKET_NAME
const AWS_REGION = config.public.AWS_REGION

// 블록 관리 함수들
const addTextBlock = () => {
    contentBlocks.value.push({
        type: 'text',
        content: '',
        height: 100
    })
}

const addImageBlock = () => {
    contentBlocks.value.push({
        type: 'image',
        image_url: '',
        alt: ''
    })
}

const removeBlock = (index: number) => {
    contentBlocks.value.splice(index, 1)
}

// 블록 이동 함수들
const moveBlockUp = (index: number) => {
    if (index > 0) {
        const temp = contentBlocks.value[index]
        contentBlocks.value[index] = contentBlocks.value[index - 1]
        contentBlocks.value[index - 1] = temp
    }
}

const moveBlockDown = (index: number) => {
    if (index < contentBlocks.value.length - 1) {
        const temp = contentBlocks.value[index]
        contentBlocks.value[index] = contentBlocks.value[index + 1]
        contentBlocks.value[index + 1] = temp
    }
}

// 드래그 앤 드롭 기능
const startDrag = (index: number) => {
    event?.dataTransfer?.setData('blockIndex', index.toString())
}

const onDrop = (dropIndex: number) => {
    const dragIndex = parseInt(event?.dataTransfer?.getData('blockIndex') || '-1')
    if (dragIndex >= 0) {
        const temp = contentBlocks.value[dragIndex]
        contentBlocks.value.splice(dragIndex, 1)
        contentBlocks.value.splice(dropIndex, 0, temp)
    }
}

// 텍스트 에디터 자동 크기 조절
const autoResize = (event: Event, index: number) => {
    const textarea = event.target as HTMLTextAreaElement
    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'
    contentBlocks.value[index].height = textarea.scrollHeight
}

// 이미지 업로드 처리
const handleImageUpload = async (event: Event, index: number) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    
    if (!file) {
        alert('파일을 선택해주세요!')
        return
    }

    uploading.value = true
    uploadSuccess.value = false
    uploadError.value = null


    const params = {
        Bucket: BUCKET_NAME,
        Key: `${Date.now()}-${file.name}`,
        Body: file,
        ACL: 'private' as ObjectCannedACL
    }

    try {
        console.log('Uploading file with params:', params)
        const data = await s3Client.send(new PutObjectCommand(params)) // 파일 업로드
        uploading.value = false // 업로드 상태 해제
        uploadSuccess.value = true // 업로드 성공 상태 설정
        const imageUrl = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params.Key}` // 이미지 URL 생성
        contentBlocks.value[index].image_url = imageUrl // 이미지 URL 저장
        console.log('File uploaded successfully:', data)
        
    } catch (error) {
        uploading.value = false // 업로드 상태 해제
        uploadError.value = (error as Error).message // 오류 메시지 저장
        console.error('이미지 업로드 실패:', error)
        alert('이미지 업로드에 실패했습니다.') // 오류 알림
    }
}

// 컨텐츠 저장
const saveContent = async () => {
    try {
        // 제목 값 확인
        console.log('제목:', title.value); // 제목 값 출력

        // 기본 유효성 검사
        if (!title.value || !title.value.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }

        // 저장할 데이터 구성
        const smartContentData = {
            title: title.value.trim(), // 제목의 공백 제거
            content_type: contentType.value || null,
            userToken: localStorage.getItem('userToken'),
            items: contentBlocks.value.map((block, index) => ({
                type: block.type,
                content: block.type === 'text' ? block.content : undefined,
                image_url: block.type === 'image' ? block.image_url : undefined,
                sequence_number: index + 1
            }))
        };

        console.log('저장할 데이터:', smartContentData); // 데이터 출력

        // Store를 통한 저장 요청
        const result = await smartContentStore.requestCreateSmartContentToDjango(smartContentData);
        console.log('API 응답:', result); // API 응답 출력
        
        if (result) {
            alert('저장되었습니다');
            // 저장 성공 후 추가 작업 (예: 목록 페이지로 이동)
            // router.push('/list')
        } else {
            throw new Error('저장 실패');
        }
        
    } catch (error) {
        console.error('저장 실패:', error);
        alert('저장에 실패했습니다');
    }
}
</script>

<style scoped>
.editor-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
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

.content-block {
    position: relative;
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #fff;
}

.text-editor {
    width: 100%;
    min-height: 100px;
    padding: 10px;
    border: none;
    resize: none;
    font-family: inherit;
    line-height: 1.5;
}

.image-block {
    text-align: center;
    padding: 10px;
}

.uploaded-image {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
}

.block-controls {
    position: absolute;
    right: 10px;
    top: 10px;
    display: flex;
    gap: 5px;
}

.control-button {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    background: #f0f0f0;
    cursor: pointer;
}

.control-button:hover {
    background: #e0e0e0;
}

.control-button.delete {
    background: #ff4444;
    color: white;
}

.control-button.delete:hover {
    background: #cc0000;
}

.add-block-menu {
    margin: 20px 0;
    display: flex;
    gap: 10px;
}

.add-button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    background: #eee;
    color: black;
    cursor: pointer;
}

.add-button:hover {
    background: #ccc;
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
