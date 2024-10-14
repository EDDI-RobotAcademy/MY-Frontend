import SurveyPage from "@/survey/pages/SurveyPage.vue"
import SurveyRegisterPage from "@/survey/pages/register/SurveyRegisterPage.vue"
import SurveyDashboardPage from "@/survey/pages/dashboard/SurveyDashboardPage.vue"
import SurveyVisualizationPage from "../pages/dashboard/SurveyVisualizationPage.vue"

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
    },
    {
        path: '/survey/visualization',
        name: 'SurveyVisualizationPage',
        component: SurveyVisualizationPage
    }
]

export default SurveyRoutes
