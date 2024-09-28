import GoogleRedirection from "@/googleAuthentication/redirection/GoogleRedirection.vue"
const GoogleAuthenticationRoutes = [
    {
        path: '/google_oauth/google-access-token',
        name: 'GoogleRedirection',
        component: GoogleRedirection
    },
]
export default GoogleAuthenticationRoutes