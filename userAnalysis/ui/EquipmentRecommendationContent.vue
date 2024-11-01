<template>
    <div class="equipment-content" ref="container">
        <div class="content-wrapper">
            <h2 class="main-title" ref="mainTitle">
                5. 예산별 장비 및 툴 추천<br><br>
            </h2>
            <div class="equipment-list" ref="equipmentList">
                <div v-for="(item, index) in data" :key="index" class="equipment-item"
                    :style="{ animationDelay: `${index * 0.2}s` }">
                    <div class="equipment-icon">
                        <svg viewBox="0 0 24 24" class="equipment-svg">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div class="equipment-details">
                        <div class="equipment-header">
                            <h3 class="equipment-name">{{ item.equipment }}</h3>
                            <span v-if="item.price" class="equipment-price">{{ item.price }}</span>
                        </div>
                        <p class="equipment-description">{{ item.details }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import anime from 'animejs'

export default {
    name: 'EquipmentRecommendationContent',
    props: {
        data: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    mounted() {
        this.setupIntersectionObserver()
    },
    methods: {
        setupIntersectionObserver() {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            this.animateContent()
                            observer.disconnect()
                        }
                    })
                },
                { threshold: 0.1 }
            )

            observer.observe(this.$refs.container)
        },
        animateContent() {
            anime.timeline({
                easing: 'easeOutExpo'
            })
                .add({
                    targets: this.$refs.mainTitle,
                    opacity: [0, 1],
                    translateY: ['-30px', '0px'],
                    duration: 500
                })
                .add({
                    targets: this.$refs.equipmentList,
                    opacity: [0, 1],
                    translateY: ['-20px', '0px'],
                    duration: 1000,
                    delay: 0
                })
        }
    }
}
</script>

<style scoped>
.equipment-content {
    background-color: #000000;
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 80px 0;
}

.content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    width: 100%;
}

.main-title {
    font-size: 32px;
    color: #ffffff;
    margin-bottom: 40px;
    text-align: center;
    opacity: 0;
}

.equipment-list {
    opacity: 0;
}

.equipment-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 30px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 30px;
    opacity: 0;
    animation: fadeIn 0.5s ease-out forwards;
}

.equipment-icon {
    background: #ffffff;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    flex-shrink: 0;
}

.equipment-svg {
    width: 24px;
    height: 24px;
    color: #000000;
}

.equipment-details {
    flex-grow: 1;
}

.equipment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.equipment-name {
    color: #ffffff;
    font-size: 24px;
    font-weight: 500;
    margin: 0;
}

.equipment-price {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.2);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 14px;
}

.equipment-description {
    color: #ffffff;
    font-size: 18px;
    line-height: 1.6;
    opacity: 0.9;
    margin: 0;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .main-title {
        font-size: 28px;
    }

    .equipment-item {
        padding: 20px;
    }

    .equipment-icon {
        width: 40px;
        height: 40px;
    }

    .equipment-name {
        font-size: 20px;
    }

    .equipment-description {
        font-size: 16px;
    }
}
</style>