<template>
  <div class="navigation-menu-bar-container" ref="navbarContainer">
    <div class="navigation-menu-bar-background" ref="navbarBackground"></div>
    <div class="navigation-menu-bar-content">
      <button @click="goToHomePage" class="logo" :style="{ color: currentColor }">COOING</button>
      <div class="center-menu-container" ref="centerMenuContainer">
        <div class="center-menu" ref="centerMenu">
          <button class="menu-item button" data-text="성향 분석하기" @click="goToUserAnalysisPage">
            <span>성향 분석하기</span>
          </button>
        </div>
      </div>
      <div class="right-menu">
        <div class="feedback-container" ref="feedbackContainer">
          <button class="menu-item button" data-text="피드백" @click="goToSurveyPage">
            <span>피드백</span>
          </button>
        </div>
        <!-- 관리자만 볼 수 있는 버튼 -->
        <div class="admin-menu-container" v-if="isAdmin" ref="adminMenuContainer">
          <button @click="toggleAdminMenu" class="admin-button">
            관리자 메뉴
          </button>

          <!-- 관리자 드롭다운 메뉴 -->
          <div v-if="isAdminMenuOpen" class="admin-dropdown-menu">
            <ul>
              <li @click="goToSurveyDashboard">피드백 답변목록</li>
              <li @click="goToSurveyVisualization">피드백 답변 시각화</li>
              <li @click="goToUserAnalysisDashboard">성향분석 답변목록</li>
              <li @click="goToUserAnalysisVisualization">성향분석 답변 시각화</li>
              
            </ul>
          </div>
        </div>
        <div class="auth-buttons">
          <button v-if="!isAuthenticated" @click="goToLoginPage" class="login" :style="{ color: currentColor }">
            LOGIN
          </button>
          <button v-if="isAuthenticated" @click="logOut" class="logout" :style="{ color: currentColor }">
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from "@/router";
import { mapState, mapActions } from "vuex";
import anime from 'animejs/lib/anime.es.js';

const authenticationModule = "authenticationModule";

export default {
  computed: {
    ...mapState(authenticationModule, ["isAuthenticated", "isAdmin"]),
    isHomePage() {
      return this.$route.path === '/';
    }
  },
  data() {
    return {
      lastScrollTop: 0,
      isNavbarVisible: true,
      currentColor: 'rgb(255, 255, 255)',
      isScrollingUp: false,
      colorRegions: [
        { threshold: 0, color: 'rgb(255, 255, 255)' },
        { threshold: 1500, color: 'rgb(0, 0, 0)' },
        { threshold: 2260, color: 'rgb(255, 255, 255)' },
      ],
      isAdmin: true,
      isAdminMenuOpen: false,
    };
  },
  methods: {
    ...mapActions(authenticationModule, [
      "requestLogoutToDjango",
      "checkAndSetAuthStatus"
    ]),
    toggleAdminMenu() {
      this.isAdminMenuOpen = !this.isAdminMenuOpen;
    },
    goToHomePage() {
      router.push("/");
    },
    goToLoginPage() {
      router.push("/login");
    },
    goToSurveyPage() {
      router.push("/survey");
    },
    goToUserAnalysisPage() {
      router.push("/user-analysis");
    },
    goToSurveyDashboard() {
      this.isAdminMenuOpen = false;
      router.push("/survey/dashboard");
    },
    goToUserAnalysisDashboard() {
      this.isAdminMenuOpen = false;
      router.push("/user-analysis/dashboard");
    },
    goToSurveyVisualization() {
      this.isAdminMenuOpen = false;
      router.push("/survey/Visualization");
    },
    goToUserAnalysisVisualization() {
      this.isAdminMenuOpen = false;
      router.push("/user-analysis/Visualization");
    },
    async logOut() {
      await this.requestLogoutToDjango();
      this.$router.push("/");
    },
    handleScroll() {
      if (!this.isHomePage) {
        this.currentColor = 'rgb(255, 255, 255)';
        return;
      }

      const st = window.pageYOffset || document.documentElement.scrollTop;

      this.isScrollingUp = st < this.lastScrollTop;

      // 색상 변경 로직
      this.updateColor(st);

      if (st > this.lastScrollTop && this.isNavbarVisible) {
        // Scrolling down
        this.animateNavbar(false);
      } else if (st < this.lastScrollTop && !this.isNavbarVisible) {
        // Scrolling up
        this.animateNavbar(true);
      }
      this.lastScrollTop = st <= 0 ? 0 : st;
    },
    updateColor(scrollTop) {
      if (this.isScrollingUp) {
        this.currentColor = 'rgb(255, 255, 255)';
      } else {
        for (let i = this.colorRegions.length - 1; i >= 0; i--) {
          if (scrollTop >= this.colorRegions[i].threshold) {
            this.currentColor = this.colorRegions[i].color;
            break;
          }
        }
      }
    },
    animateNavbar(show) {
      if (!this.isHomePage) return;

      const duration = 300;
      const easing = 'easeInOutQuad';

      if (show) {
        anime({
          targets: [this.$refs.navbarBackground, this.$refs.feedbackContainer],
          scaleY: [0, 1],
          duration: duration,
          easing: easing
        });
        anime({
          targets: this.$refs.centerMenuContainer,
          scaleY: [0, 1],
          translateY: ['-50%', '0%'],
          duration: duration,
          easing: easing
        });
      } else {
        anime({
          targets: [this.$refs.navbarBackground, this.$refs.feedbackContainer],
          scaleY: [1, 0],
          duration: duration,
          easing: easing
        });
        anime({
          targets: this.$refs.centerMenuContainer,
          scaleY: [1, 0],
          translateY: ['0%', '-50%'],
          duration: duration,
          easing: easing
        });
      }
      this.isNavbarVisible = show;
    },
  },
  watch: {
    $route(to, from) {
      if (to.path !== '/') {
        this.currentColor = 'rgb(255, 255, 255)';
        this.isNavbarVisible = true;
        if (this.$refs.navbarBackground) {
          this.$refs.navbarBackground.style.transform = 'scaleY(1)';
        }
        if (this.$refs.centerMenuContainer) {
          this.$refs.centerMenuContainer.style.transform = 'scaleY(1) translateY(0%)';
        }
        if (this.$refs.feedbackContainer) {
          this.$refs.feedbackContainer.style.transform = 'scaleY(1)';
        }
      }
    }
  },
  mounted() {
    console.log("navigation bar mounted()");
    this.checkAndSetAuthStatus();
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');

* {
  font-family: 'Noto Sans KR', sans-serif;
}

.navigation-menu-bar-container {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 98%;
  height: 53px;
  z-index: 1000;
}

.navigation-menu-bar-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 1);
  border-radius: 10px;
  transform-origin: top;
}

.navigation-menu-bar-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.logo {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: color 0.3s ease;
}

.center-menu-container {
  height: 100%;
  display: flex;
  align-items: center;
  transform-origin: top;
  overflow: hidden;
}

.center-menu {
  display: flex;
  gap: 20px;
}

.right-menu {
  display: flex;
  align-items: center;
}

.feedback-container {
  margin-right: 20px;
  transform-origin: top;
  overflow: hidden;
}

.menu-item {
  background: none;
  border: none;
  color: rgb(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 12px;
  overflow: hidden;
  padding: 0;
  position: relative;
  transition: color 0.3s;
  transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
}

.menu-item::after {
  content: attr(data-text);
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  color: rgb(255, 255, 255, 1);
  transform: translate3d(0, 25%, 0);
}

.menu-item>span {
  display: block;
}

.menu-item::after,
.menu-item>span {
  padding: 0.5em 1em;
  transition: transform 0.6s, opacity 0.6s;
  transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
}

.menu-item:hover {
  color: rgb(255, 255, 255, 1);
}

.menu-item:hover::after {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.menu-item:hover>span {
  opacity: 0;
  transform: translate3d(0, -25%, 0);
}

.login,
.logout {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: color 0.3s ease;
}

.login:hover,
.logout:hover {
  opacity: 0.8;
}

.auth-buttons {
  display: flex;
  align-items: center;
}

/* 관리자 메뉴 컨테이너 */
.admin-menu-container {
  position: relative; /* 부모 요소에 대해 절대 위치 지정 */
  margin-right: 40px;        /* 오른쪽에서 20px 떨어짐 */
  margin-left: 20px;
  margin-bottom: 5px;
  display: inline-block;
  z-index: 1001;   
}

/* 관리자 버튼 스타일 */
.admin-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: color 0.3s ease;
}

.admin-button:hover {
  color: rgba(255, 255, 255, 1);
}

/* 드롭다운 메뉴 스타일 */
.admin-dropdown-menu {
  position: absolute;
  top: 100%;
  left: -75%;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 5px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  width: max-content;
  padding: 10px 0;
}

.admin-dropdown-menu ul {
  list-style-type: none;
  padding: 10px 0;
  margin: 0;
}

.admin-dropdown-menu li {
  padding: 10px 20px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.admin-dropdown-menu li:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 1);
}
</style>