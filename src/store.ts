import {Vuex} from 'vuex'

type State = {
    user: User | null;
    resources: Array<Resource> | null;

}

const store = new Vuex.Store({
    state: {
        user: null,
    },
    mutations: {
        setUser(state: State, user: User) {
            state.user = user;
        },
    },
    actions: {
        updateUser({ commit }, user: User) {
            commit('setUser', user);
        },

    },
    getters: {
        getUser(state: State): User | null {
            return state.user;
        },
        isLoggedIn(state: State): boolean {
            return state.user !== null;
        }
    },
});

export default store;