import actions, { AuthenticationActions } from "./actions"


export interface AuthenticationModule {
    namespaced: true
    actions: AuthenticationActions
}

const authenticationModule: AuthenticationModule = {
    namespaced: true,
    actions,
}

export default authenticationModule