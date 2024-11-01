<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <div class="dashboard-grid">
                    <template v-if="!isLoggedIn">
                        <v-card class="dashboard-card">
                            <v-card-text>
                                <div class="login-container">
                                    <LoginButton :is-loading="isLoading" :is-logged-in="isLoggedIn"
                                        @login="handleLogin" />
                                </div>
                            </v-card-text>
                        </v-card>
                    </template>

                    <template v-else>
                        <ChannelInfo :channel-data="channelData" />


                        <DateRangePicker v-model:start-date="startDate" v-model:end-date="endDate"
                            :is-loading="isLoading" @fetch="fetchAnalyticsData" />

                        <template v-if="analyticsData">
                            <v-card class="dashboard-card full-width">
                                <v-card-title>분석 차트</v-card-title>
                                <v-card-text>
                                    <YouTubeCharts :analytics-data="analyticsData" />
                                </v-card-text>
                            </v-card>

                            <v-card class="dashboard-card full-width">
                                <v-card-title>상세 분석</v-card-title>
                                <v-card-text>
                                    <AnalyticsGrid :analytics-data="analyticsData" />
                                </v-card-text>
                            </v-card>
                        </template>
                    </template>
                </div>

                <v-alert v-if="error" type="error" class="error-alert">
                    {{ error }}
                </v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>


<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import ChannelInfo from '../ui/ChannelInfo.vue'
import DateRangePicker from '../ui/DateRangePicker.vue'
import AnalyticsGrid from '../ui/AnalyticsGrid.vue'
import LoginButton from '../ui/LoginButton.vue'
import YouTubeCharts from '../ui/YouTubeCharts.vue'

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
        const url = `${baseUrl}?dimensions=channel&metrics=${metrics}&startDate=${startDate.value}&endDate=${endDate.value}&ids=channel==${channelId}`

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
.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    margin: 48px 0;
    padding-top: 24px;
}


.dashboard-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-top: 16px;
}

.v-container {
    padding-top: 24px;
}

.dashboard-card .v-card-title {
    font-size: 18px;
    font-weight: 500;
    padding: 16px 20px;
    border-bottom: 1px solid #eee;
}

.full-width {
    grid-column: 1 / -1;
}

.login-container {
    display: flex;
    justify-content: center;
    padding: 24px;
}

.date-range-card {
    min-height: auto;
}

.date-range-wrapper {
    padding: 16px;
    width: 100%;
}

.date-picker-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
}


.error-alert {
    margin-top: 16px;
}

@media (min-width: 768px) {
    .date-picker-container {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
    }

    .date-picker-container>div {
        width: 32%;
    }
}

.date-picker-container input[type="date"] {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
}
</style>