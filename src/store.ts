import {createStore} from 'vuex'
import ApiClient from './models/apiClient';

type State = {
    user: User | null;
    resources: Array<Resource>;
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
        addResource(state: State) {            
            const res: Resource = {
                id: 0,
                name: '',
                data: '',
            };
            const idx = state.resources.push(res) - 1;
            state.resources[idx].name = `Resource №${idx}`;
            this.commit('setActiveResource', idx);
        },
        async saveCurrentResource(state: State, resource: Resource) {           
            const client = new ApiClient();
            const idx = state.resources.findIndex(el => el.id === resource.id);
            state.resources[idx] = await client.resource(resource);
        },
        setResources(state: State, resources: Array<Resource>) {
            state.resources = resources;
        },
        deleteResource(state: State, resource: Resource) {
            state.resources.filter(el => el.id !== resource.id);

        },
        setActiveResource(state: State, idx: number) {
            console.log('setActiveResource', idx);
            state.activeResourceIndex = idx;
        },
        setCurrentResourceData(state: State, data: string) {
            state.resources[state.activeResourceIndex].data = data;
        },
        setCurrentResourceName(state: State, name: string) {
            state.resources[state.activeResourceIndex].name = name;
        }
    },
    actions: {
        updateUser({ commit }, user: User) {
            commit('setUser', user);
        },
        setResources({commit}, resources: Array<Resource>) {
            commit('setResources', resources);
        },
        setActiveResource({commit}, idx: number) {
            if (idx >= 0) {
                commit('setActiveResource', idx);
                return;
            }

            if (idx === -1) {
                commit('addResource');
                return;
            }
        },
        saveCurrentResource({commit}, resource: Resource) {
            console.log('saveCurrentResource', resource);
            commit('saveCurrentResource', resource);
        },
        setCurrentResourceData({commit}, data: string) {
            commit('setCurrentResourceData', data);
        },
        setCurrentResourceName({commit}, name: string) {
            commit('setCurrentResourceName', name);
        }
    },
    getters: {
        getUser(state: State): User | null {
            return state.user;
        },
        getResources(state: State): Array<Resource> {
            return state.resources;
        },
        isLoggedIn(state: State): boolean {
            return state.user !== null;
        },
        getActiveResourceIndex(state: State): number {
            return state.activeResourceIndex;
        },
        getActiveResourceData(state: State): string {
            if (state.activeResourceIndex === -1) {
                return '';
            }
            return state.resources[state.activeResourceIndex].data;
        },
        getActiveResourceName(state: State): string {
            if (state.activeResourceIndex === -1) {
                return '';
            }
            return state.resources[state.activeResourceIndex].name;
        },
        getActiveResource(state: State): Resource|undefined {
            if (state.activeResourceIndex === -1) {
                return undefined;
            }
            return state.resources[state.activeResourceIndex];
        }
    },
});

export default store;