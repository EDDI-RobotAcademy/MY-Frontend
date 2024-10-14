import UserAnalysisPage from "@/userAnalysis/pages/UserAnalysisPage.vue"
import UserAnalysisResultPage from "@/userAnalysis/pages/UserAnalysisResultPage.vue"
import UserAnalysisRegisterPage from "../pages/register/UserAnalysisRegisterPage.vue"

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
    }
]

export default UserAnalysisRoutes
