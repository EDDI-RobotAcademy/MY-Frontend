<template>
    <div class="container">
        <input type="file" @change="onFileChange" />
        <div class="button-container">
            <button @click="uploadFile">Upload</button>
            <button @click="listFiles">List Files</button>
        </div>
        <div v-if="uploading">Uploading...</div>
        <div v-if="uploadSuccess">Upload Success! URL: {{ uploadedFileURL }}</div>
        <div v-if="uploadError">Upload Error: {{ uploadError }}</div>
        <ul v-if="fileList.length">
            <li v-for="file in fileList" :key="file.Key">{{ file.Key }}</li>
        </ul>
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

const { s3Client } = useAwsS3Config()
const config = useRuntimeConfig()

// 상태 정의
const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const uploadSuccess = ref(false)
const uploadError = ref<string | null>(null)
const uploadedFileURL = ref('')
const fileList = ref<Array<{ Key: string }>>([])
const fileKey = ref('')

// 환경 변수
const BUCKET_NAME = config.public.BUCKET_NAME
const AWS_REGION = config.public.AWS_REGION

// 파일 선택 핸들러
const onFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
        selectedFile.value = input.files[0]
    }
}

// 파일 업로드
const uploadFile = async () => {
    if (!selectedFile.value) {
        alert('Please select a file first.')
        return
    }

    uploading.value = true
    uploadSuccess.value = false
    uploadError.value = null

    const params = {
        Bucket: BUCKET_NAME,
        Key: selectedFile.value.name,
        Body: selectedFile.value,
        ACL: 'private' as ObjectCannedACL
    }

    try {
        
        const data = await s3Client.send(new PutObjectCommand(params))
        uploading.value = false
        uploadSuccess.value = true
        uploadedFileURL.value = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params.Key}`
        fileKey.value = params.Key
        
    } catch (err) {
        uploading.value = false
        uploadError.value = (err as Error).message
        console.error('Error uploading file:', err)
    }
}

// 파일 목록 조회
const listFiles = async () => {
    const params = {
        Bucket: BUCKET_NAME
    }

    try {
        const data = await s3Client.send(new ListObjectsCommand(params))
        fileList.value = data.Contents as Array<{ Key: string }>
        
    } catch (err) {
        console.error('Error listing files:', err)
    }
}

// 파일 삭제
const deleteFile = async (key: string) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: key
    }

    try {
        const data = await s3Client.send(new DeleteObjectCommand(params))
        
        // 파일 목록 새로고침
        await listFiles()
    } catch (err) {
        console.error('Error deleting file:', err)
    }
}

// 파일 조회
const getFile = async (key: string) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: key
    }

    try {
        const data = await s3Client.send(new GetObjectCommand(params))
        
        return data
    } catch (err) {
        console.error('Error getting file:', err)
        return null
    }
}

// ACL 설정
const setFileAcl = async () => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileKey.value,
        ACL: 'public-read' as ObjectCannedACL
    }

    try {
        const data = await s3Client.send(new PutObjectAclCommand(params))
        
    } catch (err) {
        console.error('Error setting ACL:', err)
    }
}
</script>

<style scoped>


.container {
    display: flex;
    flex-direction: column; /* 세로 방향으로 정렬 */
    justify-content: flex-end; /* 아래쪽으로 정렬 */
    height: 50vh; /* 전체 화면 높이 사용 */
    padding: 20px; /* 여백 추가 */
}

.button-container {
    margin-top: 20px; /* 버튼들 위쪽에 여백 추가 */
}

button {
    margin-right: 10px; /* 버튼들 사이에 여백 추가 */
}
</style>
