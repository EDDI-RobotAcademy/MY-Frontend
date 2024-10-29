<template>
    <div class="free-community-content">
        <table v-if="sortedContents.length > 0" class="free-community-table">
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
                <tr v-for="(content, index) in sortedContents" :key="content.free_communityId"
                    @click="goToFreeCommunityDetail(content.free_communityId)" class="free-community-row">
                    <td>{{ sortedContents.length - index }}</td>
                    <td class="title-cell">
                        {{ content.title }}
                        <span v-if="getCommentCount(content.free_communityId) > 0" class="comment-count">
                            <i class="fas fa-comment"></i> {{ getCommentCount(content.free_communityId) }}
                        </span>
                    </td>
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
import { ref, onMounted, watch, computed } from 'vue';
import { useFreeCommunityStore } from '../../stores/freeCommunityStore';
import { useRouter, useRoute } from 'vue-router';
import { useViewCountStore } from '~/viewCount/stores/viewCountStore';
import { useFreeCommunityCommentStore } from '~/freeCommunityComment/stores/freeCommunityCommentStore';
import '@fortawesome/fontawesome-free/css/all.css'

const viewCountStore = useViewCountStore();
const router = useRouter();
const route = useRoute();
const props = defineProps<{
    selectedCategoryId: number | null,
    searchQuery: string,
    searchType: string
}>();

const freeCommunityStore = useFreeCommunityStore();
const freeCommunityContents = ref([]);
const errorMessage = ref('');
const viewCounts = ref<{ [key: number]: number }>({});
const currentSort = ref('date'); // 현재 정렬 방식을 저장
const commentStore = useFreeCommunityCommentStore();
const commentCounts = ref<{ [key: number]: number }>({});

// 정렬된 컨텐츠를 반환하는 computed 속성
const sortedContents = computed(() => {
    return [...freeCommunityContents.value].sort((a, b) => {
        if (currentSort.value === 'date') {
            return new Date(b.regDate).getTime() - new Date(a.regDate).getTime();
        } else if (currentSort.value === 'views') {
            const viewsA = getViewCount(a.free_communityId);
            const viewsB = getViewCount(b.free_communityId);
            return viewsB - viewsA;
        }
        return 0;
    });
});

// 외부에서 호출할 수 있는 정렬 메소드
const sortBy = (sortType: string) => {
    currentSort.value = sortType;
};

const goToFreeCommunityDetail = (free_communityId: number) => {
    router.push(`/free-community/read/${free_communityId}`);
};

const getViewCount = (communityId: number) => {
    return viewCounts.value[communityId] || 0;
};

const fetchFreeCommunityContents = async (categoryId: number | null, searchQuery: string = '', searchType: string = 'title') => {
    try {
        let response;

        if (searchQuery) {
            response = await freeCommunityStore.searchFreeCommunity(searchQuery, searchType);
        } else if (categoryId !== null) {
            response = await freeCommunityStore.getCategoriesContent(categoryId);
        } else {
            response = await freeCommunityStore.getFreeCommunityContent();       
        }

        if (Array.isArray(response)) {
            freeCommunityContents.value = response.slice(0, 30);
        } else if (response && Array.isArray(response.data)) {
            freeCommunityContents.value = response.data.slice(0, 30);
        } else {
            throw new Error('Unexpected response format');
        }

        errorMessage.value = '';
    } catch (error) {
        console.error('게시글을 가져오는 중 오류 발생:', error);
        freeCommunityContents.value = [];
        errorMessage.value = '게시글을 불러오는 데 실패했습니다. 다시 시도해 주세요.';
    }
};

const fetchGetViewCount = async () => {
    try {
        const response = await viewCountStore.requestGetViewCount();
        if (response && Array.isArray(response)) {
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

const getCommentCount = (communityId: number) => {
    return commentCounts.value[communityId] || 0;
};

const fetchCommentCounts = async () => {
    for (const content of freeCommunityContents.value) {
        try {
            const comments = await commentStore.getFreeCommunityComments(content.free_communityId);
            commentCounts.value[content.free_communityId] = comments.length;
        } catch (error) {
            console.error('댓글 수를 가져오는 중 오류 발생:', error);
            commentCounts.value[content.free_communityId] = 0;
        }
    }
};

onMounted(async () => {
    const categoryFromQuery = route.query.category ? Number(route.query.category) : null;
    if (categoryFromQuery) {
        await fetchFreeCommunityContents(categoryFromQuery);
    } else if (props.selectedCategoryId === null) {
        await fetchFreeCommunityContents(null);
    }
    await fetchGetViewCount();
    await fetchCommentCounts();
});

watch(
    [
        () => props.selectedCategoryId,
        () => route.query.category,
        () => props.searchQuery,
        () => props.searchType
    ],
    async ([newCategoryId, queryCategory, newSearchQuery, newSearchType]) => {
        const categoryToUse = queryCategory ? Number(queryCategory) : newCategoryId;
        await fetchFreeCommunityContents(categoryToUse, newSearchQuery, newSearchType);
        await fetchCommentCounts();
    },
    { immediate: true }
);

defineExpose({
    sortBy
});
</script>

<style scoped>
.free-community-content {
    position: relative;
    padding: 20px;
    width: 100%;
}

.free-community-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}

.free-community-table th,
.free-community-table td {
    padding: 8px 6px;
    text-align: center;
    border-bottom: 1px solid #e0e0e0;
    font-size: 0.85em;
    line-height: 1.2;
}

.free-community-table th {
    background-color: white;
    font-weight: normal;
    color: #333;
    border-top: 1px solid #e0e0e0;
    padding: 6px;
}

.no-column {
    width: 8%;
}

.title-column {
    width: 50%;
}

.title-cell {
    color: #333;
    font-size: 0.9em;
    padding-left: 15px;
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

.free-community-row {
    cursor: pointer;
}

.free-community-row:hover {
    background-color: #f5f5f5;
}

td {
    color: #666;
    font-size: 0.85em;
}

.title-cell {
    color: #333;
    font-size: 1em;
}

.comment-count {
    display: inline-block;
    margin-left: 8px;
    color: #666;
    font-size: 0.9em;
    font-weight: bold;
}

.comment-count i {
    color: #ff9033;
    margin-right: 2px;
}
</style>