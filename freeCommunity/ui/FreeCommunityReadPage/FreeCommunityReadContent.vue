<template>
    <div class="free-community-article-wrapper">
        <div v-if="freeCommunityContent" class="free-community-article">
            <div class="article-header">
                <h2 class="article-title">{{ freeCommunityContent.title }}</h2>
                <div class="article-meta">
                    <span class="author">
                        <router-link v-if="freeCommunityContent" :to="{
                            path: `/growth-blog/my-page/${freeCommunityContent.profile_nickname}`
                        }" class="author-link">
                            {{ freeCommunityContent.profile_nickname }}
                        </router-link>
                    </span>
                    <span class="date">{{ formatDate(freeCommunityContent.regDate) }}</span>
                    <span class="category">{{ freeCommunityContent.category_name }}</span>
                </div>
            </div>

            <div class="article-content">
                {{ freeCommunityContent.content }}
            </div>

            <div class="article-actions">
                <router-link :to="{ name: 'FreeCommunityListPage' }">
                    <button class="btn btn-back">목록으로</button>
                </router-link>
                <div v-if="checkMyFreeCommunity" class="author-actions">
                    <router-link :to="{ name: 'FreeCommunityModifyPage', params: { free_communityId } }">
                        <button class="btn btn-modify">수정</button>
                    </router-link>
                    <button class="btn btn-delete" @click="freeCommunityDelete">삭제</button>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFreeCommunityStore } from '../../stores/freeCommunityStore';
import { useViewCountStore } from '~/viewCount/stores/viewCountStore';
import { useAuthenticationStore } from '@/authentication/stores/authenticationStore'

const authenticationStore = useAuthenticationStore();
const isAuthenticated = computed(() => authenticationStore.isAuthenticated);

const route = useRoute();
const router = useRouter()
const viewCountStore = useViewCountStore();
const freeCommunityStore = useFreeCommunityStore();

const free_communityId = parseInt(route.params.free_communityId as string);
const freeCommunityContent = ref<any>(null);
const error = ref<string>('');
const checkMyFreeCommunity = ref(false)

const fetchFreeCommunityContent = async () => {
    try {
        const response = await freeCommunityStore.readFreeCommunityContent(free_communityId);

        freeCommunityContent.value = response;

    } catch (err) {
        error.value = '게시글을 불러오는데 실패했습니다.';
        console.error('Error fetching free-community content:', err);
    }
};

const fetchCheckAuthority = async () => {
    try {

        const response = await freeCommunityStore.checkAuthority(free_communityId);

        checkMyFreeCommunity.value = response.is_authorized

    } catch (err) {
        error.value = 'fetchCheckAuthority 에러';
        console.error('Error fetching free-community content:', err);
    }
};

const fetchIncrementCount = async () => {
    if (!isAuthenticated.value) return;

    try {
        await viewCountStore.requestIncrementViewCount(free_communityId);
    } catch (err) {
        error.value = 'fetchIncrementCount 에러';
        console.error('Error fetching free-community content:', err);
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const freeCommunityDelete = async () => {
    if (confirm('정말 삭제하시겠습니까?')) {
        try {
            await freeCommunityStore.deleteFreeCommunityContent(free_communityId);
            router.push("/free-community/list");
        } catch (err) {
            error.value = '게시글 삭제에 실패했습니다.';
            console.error('Error deleting free-community:', err);
        }
    }
};

onMounted(() => {
    fetchFreeCommunityContent();
    fetchCheckAuthority();
    if (isAuthenticated.value) {
        fetchIncrementCount();
    }
});
</script>

<style scoped>
.free-community-article-wrapper {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.free-community-article {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
}

.article-header {
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;
    margin-bottom: 20px;
}

.article-title {
    font-size: 1.5em;
    color: #333;
    margin-bottom: 10px;
}

.article-meta {
    display: flex;
    gap: 15px;
    color: #666;
    font-size: 0.9em;
}

.article-content {
    min-height: 200px;
    line-height: 1.6;
    color: #333;
    white-space: pre-wrap;
    margin-bottom: 20px;
}

.article-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

.article-actions a {
    text-decoration: none;
    color: inherit;
}

.author-actions {
    display: flex;
    gap: 10px;
}

.btn {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    border: none;
    font-weight: 500;
    transition: background-color 0.2s;
}

.btn:hover {
    opacity: 0.9;
}

.btn-back {
    background-color: #f0f0f0;
    color: #333;
}

.btn-modify {
    background-color: #f0f0f0;
    color: #333;
}

.btn-delete {
    background-color: #f0f0f0;
    color: #333;
}

.error-message {
    color: #f44336;
    text-align: center;
    padding: 20px;
}

.loading {
    text-align: center;
    padding: 20px;
    color: #666;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
    .free-community-article-wrapper {
        padding: 10px;
    }

    .free-community-article {
        padding: 15px;
    }

    .article-meta {
        flex-direction: column;
        gap: 5px;
    }

    .article-actions {
        flex-direction: column;
        gap: 10px;
    }

    .author-actions {
        width: 100%;
        justify-content: flex-end;
    }

    .btn {
        padding: 6px 12px;
        font-size: 0.9em;
    }
}

.author-link {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
}

.author-link:hover {
    text-decoration: underline;
}
</style>