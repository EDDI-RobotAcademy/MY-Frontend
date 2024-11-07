<template>
    <div class="free-community-content">
        <!-- 게시글 목록 -->
        <table v-if="paginatedContents.length > 0" class="free-community-table">
            <thead>
                <tr>
                    <th class="no-column">No</th>
                    <th class="category-column">카테고리</th>
                    <th class="title-column">제목</th>
                    <th class="author-column">글쓴이</th>
                    <th class="date-column">작성일</th>
                    <th class="views-column">조회수</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(content, index) in paginatedContents"
                    :key="content.free_communityId"
                    @click="goToFreeCommunityDetail(content.free_communityId)"
                    :class="{'notice-row': content.is_notice}"
                    class="free-community-row"
                >
                    <!-- 공지글이 아닐 때만 No 표시 -->
                    <td v-if="!content.is_notice">{{ getTotalIndex(index) }}</td>
                    <td v-else></td> <!-- 공지글일 경우 No 컬럼 비우기 -->
                    <td>{{ content.category_name }}</td>
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

        <!-- 페이지 네비게이션 -->
        <div class="pagination">
            <button 
                :disabled="currentPage === 1" 
                @click="currentPage--"
                class="pagination-button"
            >
                이전
            </button>
            <span v-for="page in totalPages" :key="page">
                <button 
                    @click="currentPage = page"
                    :class="['page-number', { active: currentPage === page }]"
                >
                    {{ page }}
                </button>
            </span>
            <button 
                :disabled="currentPage === totalPages" 
                @click="currentPage++"
                class="pagination-button"
            >
                다음
            </button>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useFreeCommunityStore } from '../../stores/freeCommunityStore';
import { useRouter, useRoute } from 'vue-router';
import { useViewCountStore } from '~/viewCount/stores/viewCountStore';
import { useFreeCommunityCommentStore } from '~/freeCommunityComment/stores/freeCommunityCommentStore';
import '@fortawesome/fontawesome-free/css/all.css';

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
const currentSort = ref('date');
const commentStore = useFreeCommunityCommentStore();
const commentCounts = ref<{ [key: number]: number }>({});

const currentPage = ref(1);
const itemsPerPage = 10;

const resetData = () => {
    freeCommunityContents.value = [];
    commentCounts.value = {};
    viewCounts.value = {};
    currentPage.value = 1;
};

// 공지사항을 항상 상단에 두고, 최신순/인기순으로 정렬
const sortedContents = computed(() => {
    return [...freeCommunityContents.value].sort((a, b) => {
        if (a.is_notice && !b.is_notice) return -1;
        if (!a.is_notice && b.is_notice) return 1;
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

const paginatedContents = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedContents.value.slice(start, end);
});

const totalPages = computed(() => {
    return Math.ceil(sortedContents.value.length / itemsPerPage);
});

const getTotalIndex = (index: number) => {
    return sortedContents.value.length - ((currentPage.value - 1) * itemsPerPage + index);
};

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
        // 데이터 초기화
        freeCommunityContents.value = [];
        errorMessage.value = '';
        
        let response;
        if (searchQuery) {
            response = await freeCommunityStore.searchFreeCommunity(searchQuery, searchType);
        } else if (categoryId !== null) {
            response = await freeCommunityStore.getCategoriesContent(categoryId);
        } else {
            response = await freeCommunityStore.getFreeCommunityContent();       
        }

        // 응답 데이터 설정
        freeCommunityContents.value = Array.isArray(response) ? response : (response?.data ? response.data : []);

        // 추가 데이터 fetch
        await Promise.all([
            fetchGetViewCount(),
            fetchCommentCounts()
        ]);

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
        () => props.searchQuery,
        () => props.searchType
    ],
    async ([newCategoryId, newSearchQuery, newSearchType]) => {
        currentPage.value = 1;
        await fetchFreeCommunityContents(newCategoryId, newSearchQuery, newSearchType);
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

.category-column {
    width: 20%;
    white-space: nowrap;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    gap: 10px;
}

.pagination-button {
    padding: 5px 10px;
    border: 1px solid #ddd;
    background-color: white;
    cursor: pointer;
    border-radius: 4px;
}

.pagination-button:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
}

.page-number {
    padding: 5px 10px;
    border: 1px solid #ddd;
    background-color: white;
    cursor: pointer;
    border-radius: 4px;
}

.page-number.active {
    background-color: #ff9033;
    color: white;
    border-color: #ff9033;
}

.pagination button:hover:not(:disabled) {
    background-color: #f5f5f5;
}

.page-number.active:hover {
    background-color: #ff9033;
}

.notice-row {
    background-color: #fff8d4;
}
</style>