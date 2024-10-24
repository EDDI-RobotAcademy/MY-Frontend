<template>
    <div class="free_community-content">
        <table v-if="free_communityContents.length > 0" class="free_community-table">
            <thead>
                <tr>
                    <th class="no-column">No</th>
                    <th class="title-column">제목</th>
                    <th class="author-column">글쓴이</th>
                    <th class="date-column">작성시간</th>
                    <th class="views-column">조회수</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(content, index) in free_communityContents" :key="content.free_communityId"
                    @click="goToFreeCommunityDetail(content.free_communityId)" class="free_community-row">
                    <td>{{ index + 1 }}</td>
                    <td class="title-cell">{{ content.title }}</td>
                    <td>{{ content.profile_nickname }}</td>
                    <td>{{ formatDate(content.regDate) }}</td>
                    <td>{{ getViewCount(content.free_communityId) }}</td>
                </tr>
            </tbody>
        </table>
        <p v-else>{{ errorMessage || '게시글이 없습니다.' }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useFreeCommunityStore } from '../../stores/free_communityStore';
import { useRouter } from 'vue-router';
import { useViewCountStore } from '~/viewCount/stores/viewCountStore';

const viewCountStore = useViewCountStore();
const router = useRouter();
const props = defineProps<{
    selectedCategoryId: number | null
}>();

const free_communityStore = useFreeCommunityStore();
const free_communityContents = ref([]);
const errorMessage = ref('');
const viewCounts = ref<{ [key: number]: number }>({});

const goToFreeCommunityDetail = (free_communityId: number) => {
    router.push(`/free_community/read/${free_communityId}`);
};

const getViewCount = (communityId: number) => {
    return viewCounts.value[communityId] || 0;
};

const fetchFreeCommunityContents = async (categoryId: number | null) => {
    try {
        let response;
        if (categoryId === null) {
            response = await free_communityStore.getFreeCommunityContent();
        } else {
            response = await free_communityStore.getCategoriesContent(categoryId);
        }

        if (Array.isArray(response)) {
            free_communityContents.value = response.slice(0, 20).reverse();
        } else if (response && Array.isArray(response.data)) {
            free_communityContents.value = response.data.slice(0, 20).reverse();
        } else {
            throw new Error('Unexpected response format');
        }

        errorMessage.value = '';
    } catch (error) {
        console.error('게시글을 가져오는 중 오류 발생:', error);
        free_communityContents.value = [];
        errorMessage.value = '게시글을 불러오는 데 실패했습니다. 다시 시도해 주세요.';
    }
};

const fetchGetViewCount = async () => {
    try {
        const response = await viewCountStore.requestGetViewCount();
        if (response && Array.isArray(response)) {
            // viewCounts 객체 초기화
            const counts: { [key: number]: number } = {};
            response.forEach(item => {
                if (item.community_id && item.count !== undefined) {
                    counts[item.community_id] = item.count;
                }
            });
            viewCounts.value = counts;
        }
    } catch (err) {
        console.error('Error fetchGetViewCount:', err);
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

watch(() => props.selectedCategoryId, (newCategoryId) => {
    fetchFreeCommunityContents(newCategoryId);
}, { immediate: true });

onMounted(async () => {
    if (props.selectedCategoryId === null) {
        await fetchFreeCommunityContents(null);
    }
    await fetchGetViewCount();
});
</script>

<style scoped>
.free_community-content {
    padding: 20px;
    width: 100%;
}

.free_community-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}

.free_community-table th,
.free_community-table td {
    padding: 12px 8px;
    text-align: center;
    border-bottom: 1px solid #e0e0e0;
}

.free_community-table th {
    background-color: white;
    font-weight: normal;
    color: #333;
    border-top: 1px solid #e0e0e0;
}

.no-column {
    width: 8%;
}

.title-column {
    width: 50%;
}

.title-cell {
    text-align: left;
    padding-left: 20px;
}

.author-column {
    width: 15%;
}

.date-column {
    width: 15%;
}

.views-column {
    width: 12%;
}

.free_community-row {
    cursor: pointer;
}

.free_community-row:hover {
    background-color: #f5f5f5;
}

td {
    color: #666;
    font-size: 0.9em;
}

.title-cell {
    color: #333;
    font-size: 1em;
}
</style>
