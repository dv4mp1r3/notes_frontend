import {createStore} from 'vuex'
import ApiClient from './models/apiClient';

type State = {
    user: User | null;
    resources: Array<Resource>;
    activeResourceIndex: number;
    isIconPickerVisible: boolean;
    iconPickerIndex: number|undefined;
}


export type ResourceIcon = {
    resourceIndex: number;
    iconClass: string;
}

const store = createStore({
    state: {
        user: null,
        activeResourceIndex: -1,
        resources: [],
        isIconPickerVisible: false,
        iconPickerIndex: undefined
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
                icon: 'fa-code'
            };
            const idx = state.resources.push(res) - 1;
            state.resources[idx].name = `Resource №${idx}`;
            this.commit('setActiveResource', idx);
        },
        saveCurrentResource(state: State, resource: Resource) {           
            const idx = state.resources.findIndex(el => el.id === resource.id);
            state.resources[idx] = resource;
        },
        setResources(state: State, resources: Array<Resource>) {
            state.resources = resources;
        },
        deleteResource(state: State, resource: Resource) {
            state.resources.filter(el => el.id !== resource.id);

        },
        setActiveResource(state: State, idx: number) {
            console.log('setActiveResource', idx);
            //todo: decrypt data
            state.activeResourceIndex = idx;
        },
        setCurrentResourceData(state: State, data: string) {
            state.resources[state.activeResourceIndex].data = data;
        },
        setCurrentResourceName(state: State, name: string) {
            state.resources[state.activeResourceIndex].name = name;
        },
        setIconPickerVisible(state: State, visible: boolean) {
            state.isIconPickerVisible = visible;
        },
        setResourceIcon(state: State, resourceIcon: ResourceIcon) {
            console.log('setResourceIcon', resourceIcon);
            state.resources[resourceIcon.resourceIndex].icon = resourceIcon.iconClass;
        },
        setIconPickerIndex(state: State, idx: number) {
            state.iconPickerIndex = idx;
        }
    },
    actions: {
        updateUser({ commit }, user: User) {
            commit('setUser', user);
        },
        setResources({commit}, resources: Array<Resource>) {
            commit('setResources', resources);
        },
        addResource({commit}) {
            commit('addResource');
        },
        setActiveResource({commit}, idx: number) {
            if (idx >= 0) {
                commit('setActiveResource', idx);
                return;
            }
        },
        async saveCurrentResource({commit}, resource: Resource) {
            const client = new ApiClient();
            //todo: encrypt data
            const res = await client.resource(resource);
            if (res.id === resource.id) {
                commit('saveCurrentResource', res);
            }
        },
        setCurrentResourceData({commit}, data: string) {
            commit('setCurrentResourceData', data);
        },
        setCurrentResourceName({commit}, name: string) {
            commit('setCurrentResourceName', name);
        },
        setEncryptionKey({commit}, data: string) {
            localStorage.setItem("key", data);
        },
        setIconPickerVisible({commit}, visible: boolean) {
            commit('setIconPickerVisible', visible);
        },
        setResourceIcon({commit}, resourceIcon : ResourceIcon) {
            commit('setResourceIcon', resourceIcon);
        },
        setIconPickerIndex({commit}, idx: number) {
            commit('setIconPickerIndex', idx);
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
        },
        getEncryptionKey(state: State): string
        {
            const val = localStorage.getItem("key");
            return val === null ? 'INSERT KEY HERE': val;
        },
        isIconPickerVisible(state: State): boolean
        {
            return state.isIconPickerVisible;
        },
        getActiveResourceIcon(state: State): string
        {
            return state.resources[state.activeResourceIndex].icon;
        },
        getIconPickerIndex(state: State): number|undefined
        {
            return state.iconPickerIndex;
        }
    },
});

export default store;