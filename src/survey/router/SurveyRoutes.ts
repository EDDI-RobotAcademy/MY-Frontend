import SurveyPage from "@/survey/pages/SurveyPage.vue"
import SurveyRegisterPage from "@/survey/pages/register/SurveyRegisterPage.vue"
import SurveyDashboardPage from "@/survey/pages/dashboard/SurveyDashboardPage.vue"

const SurveyRoutes = [
    {
        path: '/survey',
        name: 'SurveyPage',
        component: SurveyPage
    },
    {

        path: '/survey/register',
        name: 'SurveyRegisterPage',
        component: SurveyRegisterPage
    },
    {
        path: '/survey/dashboard',
        name: 'SurveyDashboardPage',
        component: SurveyDashboardPage
    }
]

export default SurveyRoutes
