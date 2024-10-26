<!-- PostList.vue -->
<template>
    <div class="post-list">
        <NavHeader class="nav" />
        <div class="post-filter">
            <div class="filter-tabs">
                <a href="#" class="tab active">트렌딩</a>
                <a href="#" class="tab">최신</a>
                <a href="#" class="tab">피드</a>
            </div>
            <div class="filter-right">
                <button class="period-button">이번 주 <span class="arrow">▼</span></button>
                <button class="more-button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="post-grid">
            <article v-for="post in posts" :key="post.id" class="post-card">
                <img :src="post.thumbnail" :alt="post.title" class="post-thumbnail">
                <div class="post-content">
                    <h2 class="post-title">{{ post.title }}</h2>
                    <p class="post-excerpt">{{ post.excerpt }}</p>
                    <div class="post-meta">
                        <span class="post-date">{{ post.date }} · {{ post.comments }}개의 댓글</span>
                        <div class="author">
                            <img :src="post.authorAvatar" :alt="post.author" class="author-avatar">
                            <span>by {{ post.author }}</span>
                            <div class="likes">
                                <span>♥</span>
                                <span>{{ post.likes }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    </div>
</template>

<script>
import NavHeader from '../../ui/navigation/navigation.vue'
export default {
    name: 'PostList',
    components: {
        NavHeader
    },
    data() {
        return {
            posts: [
                {
                    id: 1,
                    thumbnail: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/javascript/javascript.png',
                    title: '서류 탈락을 거듭한 끝에 깨달은 신입 ...',
                    excerpt: '23년도 3월부터 서류지원을 시작했습니다. 약 1년 반동안 500개 이상의 서류를 넣었던 것 같습니다. 정말 서류 난사였죠. 하지만 그 결...',
                    date: '2024년 10월 13일',
                    comments: 4,
                    author: 'junhyeong',
                    authorAvatar: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/vue/vue.png',
                    likes: 189
                },
                {
                    id: 2,
                    thumbnail: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png',
                    title: '에어비앤비는 어떻게 리액트를 점진적...',
                    excerpt: '에어비앤비는 최근 리액트 16에서 리액트 18로 업그레이드 하는 대규모 프로젝트를 진행했습니다. 이 과정에서의 고충과 해결법, 결...',
                    date: '5월 전',
                    comments: 27,
                    author: 'Saetbyeol',
                    authorAvatar: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nodejs/nodejs.png',
                    likes: 22
                },
                {
                    id: 3,
                    thumbnail: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/python/python.png',
                    title: '제 사이트 프로젝트 홍보 방법이요? 어...',
                    excerpt: '열심히 서비스를 만들었는데... 왜 아무도 안들어오죠?',
                    date: '7일 전',
                    comments: 8,
                    author: '혜율이',
                    authorAvatar: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png',
                    likes: 69
                },
                {
                    id: 4,
                    thumbnail: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/docker/docker.png',
                    title: '프론트엔드 개발자의 하루',
                    excerpt: '실제 프론트엔드 개발자의 일상을 공유합니다...',
                    date: '3일 전',
                    comments: 15,
                    author: 'frontend_dev',
                    authorAvatar: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/git/git.png',
                    likes: 156
                },
                {
                    id: 5,
                    thumbnail: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/angular/angular.png',
                    title: 'Vue.js vs React 현직자가 비교해봤습니다',
                    excerpt: '실제 프로젝트에서 겪은 두 프레임워크의 차이점을 설명합니다...',
                    date: '1일 전',
                    comments: 42,
                    author: 'tech_reviewer',
                    authorAvatar: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/vue/vue.png',
                    likes: 234
                },
                {
                    id: 6,
                    thumbnail: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/kubernetes/kubernetes.png',
                    title: '주니어 개발자의 첫 이직 이야기',
                    excerpt: '2년차 개발자의 이직 과정과 면접 경험을 공유합니다...',
                    date: '2일 전',
                    comments: 31,
                    author: 'junior_dev',
                    authorAvatar: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nodejs/nodejs.png',
                    likes: 178
                }
            ]
        }
    }
}
</script>

<style scoped>
.nav {
    margin-top: 70px;
}
.post-list {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.post-filter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    border-bottom: 1px solid #e9ecef;
    padding-bottom: 12px;
}

.filter-tabs {
    display: flex;
    gap: 24px;
}

.tab {
    text-decoration: none;
    color: #868e96;
    font-size: 16px;
    padding: 8px 0;
    position: relative;
}

.tab.active {
    color: #212529;
    font-weight: 500;
}

.tab.active::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    right: 0;
    height: 2px;
    background: #212529;
}

.filter-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

.period-button {
    border: none;
    background: none;
    font-size: 14px;
    color: #495057;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
}

.more-button {
    border: none;
    background: none;
    color: #868e96;
    cursor: pointer;
    padding: 4px;
}

.post-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* 3열로 수정 */
    gap: 24px;
}

.post-card {
    border: 1px solid #e9ecef;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s;
}

.post-card:hover {
    transform: translateY(-4px);
}

.post-thumbnail {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.post-content {
    padding: 16px;
}

.post-title {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 8px;
    color: #212529;
}

.post-excerpt {
    font-size: 14px;
    color: #495057;
    line-height: 1.5;
    margin-bottom: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.post-meta {
    font-size: 12px;
    color: #868e96;
}

.post-date {
    display: block;
    margin-bottom: 8px;
}

.author {
    display: flex;
    align-items: center;
    gap: 8px;
}

.author-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
}

.likes {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 4px;
}

@media (max-width: 1024px) {
    .post-grid {
        grid-template-columns: repeat(2, 1fr);
        /* 태블릿에서는 2열 */
    }
}

@media (max-width: 768px) {
    .post-grid {
        grid-template-columns: 1fr;
        /* 모바일에서는 1열 */
    }

    .filter-tabs {
        gap: 16px;
    }
}
</style>