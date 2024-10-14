import UserAnalysisPage from "@/userAnalysis/pages/UserAnalysisPage.vue"
import UserAnalysisResultPage from "@/userAnalysis/pages/UserAnalysisResultPage.vue"
import UserAnalysisRegisterPage from "../pages/register/UserAnalysisRegisterPage.vue"
import UserAnalysisDashboardPage from "../pages/dashboard/UserAnalysisDashboardPage.vue"

const UserAnalysisRoutes = [
    {
        path: '/user-analysis',
        name: 'UserAnalysisPage',
        component: UserAnalysisPage
    },
    {
        path: '/user-analysis/result',
        name: 'UserAnalysisResultPage',
        component: UserAnalysisResultPage
    },
    {
        path: '/user-analysis/register',
        name: 'UserAnalysisRegisterPage',
        component: UserAnalysisRegisterPage
    },
    {
        path: '/user-analysis/dashboard',
        name: 'UserAnalysisDashboardPage',
        component: UserAnalysisDashboardPage
    },
]

export default UserAnalysisRoutes
