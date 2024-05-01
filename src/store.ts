import {createStore} from 'vuex'

type State = {
    user: User | null;
    resources: Array<Resource> | null;
    activeResourceIndex: number;
}

const store = createStore({
    state: {
        user: null,
        activeResourceIndex: -1,
        resources: []
    },
    mutations: {
        setUser(state: State, user: User) {
            state.user = user;
        },
        setResource(state: State, resource: Resource) {
            if (state.resources === null) {
                state.resources = [resource];
                return;
            }
            const idx = state.resources?.findIndex(el => el.id === resource.id);
            state.resources[idx] = resource;
        },
        setResources(state: State, resources: Array<Resource>) {
            state.resources = resources;
        },
        deleteResource(state: State, resource: Resource) {
            if (state.resources === null) {
                return;
            }
            state.resources.filter(el => el.id !== resource.id);

        },
        setActiveResource(state: State, idx: number) {
            state.activeResourceIndex = idx;
        }
    },
    actions: {
        updateUser({ commit }, user: User) {
            commit('setUser', user);
        },
        udpateResource({commit}, resource: Resource) {
            commit('setResource', resource);
        },
        setResources({commit}, resources: Array<Resource>) {
            commit('setResources', resources);
        },
        setActiveResource({commit}, idx: number) {
            commit('setActiveResource', idx);
        }
    },
    getters: {
        getUser(state: State): User | null {
            return state.user;
        },
        getResources(state: State): Array<Resource> {
            if (state.resources === null) {
                return [];
            }
            return state.resources;
        },
        isLoggedIn(state: State): boolean {
            return state.user !== null;
        },
        getActiveResourceIndex(state: State): number {
            return state.activeResourceIndex;
        },
        getActiveResourceData(state: State): string {
            if (state.resources === null || state.activeResourceIndex === -1) {
                return '';
            }
            return state.resources[state.activeResourceIndex].data;
        }
    },
});

export default store;