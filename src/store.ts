//@ts-ignore
import {createStore, Commit, Getters, Dispatch} from 'vuex'
import ApiClient from './models/apiClient';
import {AES, enc} from 'crypto-js';
import {Resource} from "./models/data/resource.ts";
import {User} from "./models/data/user.ts";

export interface CommitFunction {
    commit: Commit;
}

export interface CommitStateFunction<T> extends CommitFunction {
    state: T;
}

export interface CommitStateDispatchFunction<T, M> extends CommitFunction {
    state: T;
    dispatch: M;
}

export interface CommitGettersFunction<T> extends CommitFunction {
    getters: T;
}

export type State = {
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

export type SetResourceData = {
    resources: Array<Resource>;
    pwd: string;
}

const store = createStore({
    state: <State>{
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
            state.activeResourceIndex = idx;
        },
        saveCurrentResource(state: State, resource: Resource) {           
            const idx = state.resources.findIndex(el => el.id === resource.id);
            state.resources[idx] = resource;
        },
        setResources(state: State, data: SetResourceData) {
            state.resources = data.resources.map(res =>  {
                const resourceData = AES.decrypt(res.data, data.pwd).toString(enc.Utf8);
                console.log('setResources', resourceData);
                res.data = resourceData || res.data;
                return res;
            });
        },
        deleteResource(state: State, resource: Resource) {
            state.resources = state.resources.filter(el => el.id !== resource.id);
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
        updateUser({ commit }: CommitFunction, user: User) {
            commit('setUser', user);
        },
        setResources({commit}: CommitFunction, data: SetResourceData) {
            commit('setResources', data);
        },
        addResource({commit}: CommitFunction) {
            commit('addResource');
        },
        setActiveResource({commit}: CommitFunction, idx: number) {
            if (idx >= 0) {
                commit('setActiveResource', idx);
            }
        },
        async saveCurrentResource({commit, getters}: CommitGettersFunction<Getters>, resource: Resource) {
            const client = new ApiClient();
            const encrDataResource = {...resource};
            encrDataResource.data = AES.encrypt(resource.data, getters.getEncryptionKey).toString();
            const res = await client.resource(encrDataResource);
            if (res.id === resource.id) {
                commit('saveCurrentResource', res);
            }
        },
        setCurrentResourceData({commit} : CommitFunction, data: string) {
            commit('setCurrentResourceData', data);
        },
        setCurrentResourceName({commit}: CommitFunction, name: string) {
            commit('setCurrentResourceName', name);
        },
        //@ts-ignore
        setEncryptionKey({commit}: CommitFunction, data: string) {
            localStorage.setItem("key", data);
        },
        setIconPickerVisible({commit}: CommitFunction, visible: boolean) {
            commit('setIconPickerVisible', visible);
        },
        async setResourceIcon({commit, dispatch, state} : CommitStateDispatchFunction<State, Dispatch> , resourceIcon : ResourceIcon) {
            commit('setResourceIcon', resourceIcon);
            await dispatch('saveCurrentResource', state.resources[resourceIcon.resourceIndex]);
        },
        setIconPickerIndex({commit} : CommitFunction, idx: number) {
            commit('setIconPickerIndex', idx);
        },
        async deleteResource({commit, state} : CommitStateFunction<State>, idx: number) {
            const resource = state.resources[idx];
            if (resource.id <= 0) {
                return;
            }
                        
            const client = new ApiClient();
            const isDeleted = await client.deleteResource(resource);  
            if (isDeleted) {
                commit('deleteResource', resource);
            }            
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
        //@ts-ignore
        getEncryptionKey(state: State): string
        {
            const val = localStorage.getItem("key");
            return val ?? 'INSERT KEY HERE';
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