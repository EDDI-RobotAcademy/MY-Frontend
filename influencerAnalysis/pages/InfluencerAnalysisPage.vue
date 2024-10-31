<template>
    <v-container>
        <v-row justify="center" align="center" style="min-height: 100vh;">
            <v-col cols="12" class="text-center">
                <h2 class="text-h5 mb-6">내 채널 분석</h2>

                <div v-if="!isLoggedIn">
                    <v-btn color="red" @click="handleLogin" :loading="isLoading" class="youtube-login-btn">
                        <v-icon left>mdi-youtube</v-icon>
                        YouTube 로그인
                    </v-btn>
                </div>

                <template v-if="isLoggedIn">
                    <!-- 채널 기본 정보 -->
                    <v-card v-if="channelData" class="mb-6 channel-card">
                        <v-card-item>
                            <template v-slot:prepend>
                                <v-avatar size="large" rounded="0">
                                    <v-img :src="channelData.snippet?.thumbnails?.default?.url"
                                        :alt="channelData.snippet?.title" />
                                </v-avatar>
                            </template>
                            <v-card-title>{{ channelData.snippet?.title }}</v-card-title>
                            <v-card-subtitle>{{ channelData.snippet?.description }}</v-card-subtitle>
                        </v-card-item>
                        <v-card-text v-if="channelData.statistics">
                            <v-row>
                                <v-col cols="12" sm="4">
                                    <div class="stat-box">
                                        <div class="stat-label">구독자</div>
                                        <div class="stat-value">{{ formatNumber(channelData.statistics.subscriberCount)
                                            }}
                                        </div>
                                    </div>
                                </v-col>
                                <v-col cols="12" sm="4">
                                    <div class="stat-box">
                                        <div class="stat-label">총 조회수</div>
                                        <div class="stat-value">{{ formatNumber(channelData.statistics.viewCount) }}
                                        </div>
                                    </div>
                                </v-col>
                                <v-col cols="12" sm="4">
                                    <div class="stat-box">
                                        <div class="stat-label">동영상 수</div>
                                        <div class="stat-value">{{ formatNumber(channelData.statistics.videoCount) }}
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>

                    <!-- 기간 설정 -->
                    <v-card class="mb-6">
                        <v-card-title>기간 설정</v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" sm="5">
                                    <v-text-field v-model="startDate" label="시작일" type="date"
                                        prepend-icon="mdi-calendar" />
                                </v-col>
                                <v-col cols="12" sm="5">
                                    <v-text-field v-model="endDate" label="종료일" type="date"
                                        prepend-icon="mdi-calendar" />
                                </v-col>
                                <v-col cols="12" sm="2">
                                    <v-btn color="primary" @click="fetchAnalyticsData" :loading="isLoading"
                                        :disabled="!startDate || !endDate">
                                        데이터 조회
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>

                    <template v-if="analyticsData">
                        <!-- 차트 컴포넌트 -->
                        <YouTubeCharts :analytics-data="analyticsData" class="mb-6" />

                        <v-row class="analytics-grid">
                            <v-col cols="12" md="6">
                                <v-card class="stats-card">
                                    <v-card-title>시청 관련</v-card-title>
                                    <v-card-text>
                                        <v-list>
                                            <v-list-item>
                                                <template v-slot:prepend>
                                                    <v-icon>mdi-eye</v-icon>
                                                </template>
                                                <v-list-item-title>조회수</v-list-item-title>
                                                <v-list-item-subtitle>
                                                    {{ formatNumber(analyticsData.views) }}회
                                                </v-list-item-subtitle>
                                            </v-list-item>
                                            <v-list-item>
                                                <template v-slot:prepend>
                                                    <v-icon>mdi-clock-outline</v-icon>
                                                </template>
                                                <v-list-item-title>총 시청 시간</v-list-item-title>
                                                <v-list-item-subtitle>
                                                    {{ analyticsData.watchTime }}
                                                </v-list-item-subtitle>
                                            </v-list-item>
                                            <v-list-item>
                                                <template v-slot:prepend>
                                                    <v-icon>mdi-timer</v-icon>
                                                </template>
                                                <v-list-item-title>평균 시청 시간</v-list-item-title>
                                                <v-list-item-subtitle>
                                                    {{ analyticsData.avgViewDuration }}
                                                </v-list-item-subtitle>
                                            </v-list-item>
                                        </v-list>
                                    </v-card-text>
                                </v-card>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-card class="stats-card">
                                    <v-card-title>상호작용</v-card-title>
                                    <v-card-text>
                                        <v-list>
                                            <v-list-item>
                                                <template v-slot:prepend>
                                                    <v-icon>mdi-thumb-up</v-icon>
                                                </template>
                                                <v-list-item-title>좋아요</v-list-item-title>
                                                <v-list-item-subtitle>
                                                    {{ formatNumber(analyticsData.likes) }}개
                                                </v-list-item-subtitle>
                                            </v-list-item>
                                            <v-list-item>
                                                <template v-slot:prepend>
                                                    <v-icon>mdi-comment</v-icon>
                                                </template>
                                                <v-list-item-title>댓글</v-list-item-title>
                                                <v-list-item-subtitle>
                                                    {{ formatNumber(analyticsData.comments) }}개
                                                </v-list-item-subtitle>
                                            </v-list-item>
                                            <v-list-item>
                                                <template v-slot:prepend>
                                                    <v-icon>mdi-share</v-icon>
                                                </template>
                                                <v-list-item-title>공유</v-list-item-title>
                                                <v-list-item-subtitle>
                                                    {{ formatNumber(analyticsData.shares) }}회
                                                </v-list-item-subtitle>
                                            </v-list-item>
                                        </v-list>
                                    </v-card-text>
                                </v-card>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-card class="stats-card">
                                    <v-card-title>구독자</v-card-title>
                                    <v-card-text>
                                        <v-list>
                                            <v-list-item>
                                                <template v-slot:prepend>
                                                    <v-icon>mdi-account-plus</v-icon>
                                                </template>
                                                <v-list-item-title>새 구독자</v-list-item-title>
                                                <v-list-item-subtitle>
                                                    {{ formatNumber(analyticsData.subscribersGained) }}명
                                                </v-list-item-subtitle>
                                            </v-list-item>
                                            <v-list-item>
                                                <template v-slot:prepend>
                                                    <v-icon>mdi-account-minus</v-icon>
                                                </template>
                                                <v-list-item-title>구독 취소</v-list-item-title>
                                                <v-list-item-subtitle>
                                                    {{ formatNumber(analyticsData.subscribersLost) }}명
                                                </v-list-item-subtitle>
                                            </v-list-item>
                                        </v-list>
                                    </v-card-text>
                                </v-card>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-card class="stats-card">
                                    <v-card-title>카드/주석</v-card-title>
                                    <v-card-text>
                                        <v-list>
                                            <v-list-item>
                                                <template v-slot:prepend>
                                                    <v-icon>mdi-card-text</v-icon>
                                                </template>
                                                <v-list-item-title>카드 클릭률</v-list-item-title>
                                                <v-list-item-subtitle>
                                                    {{ analyticsData.cardClickRate }}
                                                </v-list-item-subtitle>
                                            </v-list-item>
                                            <v-list-item>
                                                <template v-slot:prepend>
                                                    <v-icon>mdi-eye-outline</v-icon>
                                                </template>
                                                <v-list-item-title>카드 노출수</v-list-item-title>
                                                <v-list-item-subtitle>
                                                    {{ formatNumber(analyticsData.cardImpressions) }}회
                                                </v-list-item-subtitle>
                                            </v-list-item>
                                            <v-list-item>
                                                <template v-slot:prepend>
                                                    <v-icon>mdi-cursor-pointer</v-icon>
                                                </template>
                                                <v-list-item-title>카드 클릭수</v-list-item-title>
                                                <v-list-item-subtitle>
                                                    {{ formatNumber(analyticsData.cardClicks) }}회
                                                </v-list-item-subtitle>
                                            </v-list-item>
                                        </v-list>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </template>

                    <v-btn color="grey" @click="handleLogout" class="mt-6">
                        로그아웃
                    </v-btn>
                </template>

                <v-alert v-if="error" type="error" class="mt-4">
                    {{ error }}
                </v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import YouTubeCharts from '../../growthHistory/ui/YouTubeCharts.vue'
const config = useRuntimeConfig()
const client = ref<any>(null)
const isLoggedIn = ref(false)
const accessToken = ref('')
const channelData = ref<any>(null)
const analyticsData = ref<any>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

// 날짜 관련 (현재 날짜 기준으로 설정)
const currentDate = new Date()
const endDate = ref(currentDate.toISOString().split('T')[0])
const startDate = ref(new Date(currentDate.setMonth(currentDate.getMonth() - 1)).toISOString().split('T')[0])

const initializeGoogleAuth = async () => {
    return new Promise((resolve) => {
        const { google } = window as any
        if (!google) return

        client.value = google.accounts.oauth2.initTokenClient({
            client_id: config.public.GOOGLE_CLIENT_ID,
            scope: [
                'https://www.googleapis.com/auth/youtube.readonly',
                'https://www.googleapis.com/auth/yt-analytics.readonly',
                'https://www.googleapis.com/auth/yt-analytics-monetary.readonly',
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
                'openid'
            ].join(' '),
            callback: async (response: any) => {
                if (response.access_token) {
                    accessToken.value = response.access_token
                    isLoggedIn.value = true
                    await fetchChannelInfo(response.access_token)
                    await fetchAnalyticsData()
                }
            }
        })
        resolve(true)
    })
}

const fetchChannelInfo = async (token: string) => {
    try {
        isLoading.value = true
        const response = await fetch(
            'https://youtube.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&mine=true',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            }
        )

        if (!response.ok) {
            const errorData = await response.json()
            console.error('YouTube API Error:', errorData)
            throw new Error('채널 정보를 가져오는데 실패했습니다.')
        }

        const data = await response.json()
        console.log('Channel Data:', data)
        if (data.items && data.items.length > 0) {
            channelData.value = data.items[0]
        }
    } catch (err: any) {
        error.value = err.message
        console.error('Error details:', err)
    } finally {
        isLoading.value = false
    }
}

const fetchAnalyticsData = async () => {
    try {
        if (!accessToken.value || !channelData.value) return

        isLoading.value = true
        const baseUrl = 'https://youtubeanalytics.googleapis.com/v2/reports'
        const metrics = [
            'views',
            'estimatedMinutesWatched',
            'averageViewDuration',
            'likes',
            'comments',
            'shares',
            'subscribersGained',
            'subscribersLost',
            'cardClickRate',
            'cardImpressions',
            'cardClicks'
        ].join(',')

        const channelId = channelData.value.id
        console.log('Channel ID:', channelId)

        const url = `${baseUrl}?dimensions=channel&metrics=${metrics}&startDate=${startDate.value}&endDate=${endDate.value}&ids=channel==${channelId}`

        console.log('Fetching analytics with URL:', url)
        console.log('Using token:', accessToken.value.substring(0, 10) + '...')

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${accessToken.value}`,
                'Accept': 'application/json'
            }
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error('Analytics API Error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorData
            })
            throw new Error('분석 데이터를 가져오는데 실패했습니다.')
        }

        const data = await response.json()
        console.log('Analytics Response:', data)

        if (data.rows && data.rows.length > 0) {
            const [row] = data.rows
            analyticsData.value = {
                views: row[0] || 0,
                watchTime: `${Math.round((row[1] || 0) / 60)} 시간`,
                avgViewDuration: `${Math.round(row[2] || 0)} 초`,
                likes: row[3] || 0,
                comments: row[4] || 0,
                shares: row[5] || 0,
                subscribersGained: row[6] || 0,
                subscribersLost: row[7] || 0,
                cardClickRate: `${((row[8] || 0) * 100).toFixed(1)}%`,
                cardImpressions: row[9] || 0,
                cardClicks: row[10] || 0
            }
        } else {
            analyticsData.value = {
                views: 0,
                watchTime: '0 시간',
                avgViewDuration: '0 초',
                likes: 0,
                comments: 0,
                shares: 0,
                subscribersGained: 0,
                subscribersLost: 0,
                cardClickRate: '0%',
                cardImpressions: 0,
                cardClicks: 0
            }
            console.log('No analytics data found for the specified period')
        }
    } catch (err: any) {
        error.value = err.message
        console.error('Analytics Error:', err)
    } finally {
        isLoading.value = false
    }
}

const handleLogin = () => {
    if (client.value) {
        client.value.requestAccessToken()
    }
}

const handleLogout = () => {
    const { google } = window as any
    if (google && accessToken.value) {
        google.accounts.oauth2.revoke(accessToken.value)
        isLoggedIn.value = false
        accessToken.value = ''
        channelData.value = null
        analyticsData.value = null
    }
}

const formatNumber = (num: string | number) => {
    return new Intl.NumberFormat('ko-KR').format(Number(num))
}

onMounted(async () => {
    await initializeGoogleAuth()
})

watch([startDate, endDate], async () => {
    if (isLoggedIn.value && channelData.value) {
        await fetchAnalyticsData()
    }
})
</script>

<style scoped>
.youtube-analytics {
    min-height: 100vh;
    background-color: #f5f5f5;
}

.stats-card {
    height: 100%;
}

.stats-card .v-card-title {
    color: #1a73e8;
    font-size: 1.1rem;
    font-weight: 500;
    padding: 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.stats-card .v-list-item {
    padding: 12px 16px;
}

.stats-card .v-list-item-title {
    font-size: 0.9rem;
    color: rgba(0, 0, 0, 0.87);
}

.stats-card .v-list-item-subtitle {
    font-size: 1.2rem;
    font-weight: 600;
    color: #1a73e8;
    margin-top: 4px;
}

.stat-box {
    text-align: center;
    padding: 12px;
}

.stat-label {
    font-size: 0.9rem;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 4px;
}

.stat-value {
    font-size: 1.4rem;
    font-weight: 600;
    color: #1a73e8;
}

.youtube-login-btn {
    align-self: center;
    background-color: #ff0000 !important;
    color: white !important;
}

.youtube-login-btn:hover {
    background-color: #cc0000 !important;
}

.channel-card {
    background: white;
}

.analytics-grid {
    gap: 24px;
}
</style>