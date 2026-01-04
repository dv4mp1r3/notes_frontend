//@ts-ignore
import {createStore, Commit, Getters, Dispatch} from 'vuex'
import ApiClient from './models/apiClient';
import {AES, enc} from 'crypto-js';
import {Category, Resource, SetResourceCategory} from "./models/data/resource.ts";
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
    categories: Map<number, Category>;
    activeResourceIndex: number;
    activeCategoryIndex: number;
    isIconPickerVisible: boolean;
    iconPickerIndex: number|undefined;
}


export type ResourceIcon = {
    resourceIndex: number;
    iconClass: string;
}

export type SetResourceData = {
    categories: Array<SetResourceCategory>;
    pwd: string;
}

export type ResourceIndexes = {
    categoryIdx: number,
    resourceIdx: number,
}

const store = createStore({
    state: <State>{
        user: null,
        activeResourceIndex: -1,
        activeCategoryIndex: -1,
        categories: new Map<number, Category>(),
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
            const idx = state.categories.push(res) - 1;
            state.categories[idx].name = `Resource №${idx}`;
            state.activeResourceIndex = idx;
        },
        saveCurrentResource(state: State, resource: Resource) {           
            const idx = state.categories.findIndex(el => el.id === resource.id);
            state.categories[idx] = resource;
        },
        setResources(state: State, data: SetResourceData) {
            data.categories.forEach(c => {
                const resources = new Map<number, Resource>;
                c.Resources.forEach(r => {
                    r.data = AES.decrypt(r.data, data.pwd).toString(enc.Utf8);
                    resources.set(r.id, r);
                });
                state.categories.set(c.id, {Resources: resources, id: c.id, name: c.name, icon: c.icon, userId: c.userId});
            });
            console.log('setResources', state.categories);
        },
        deleteResource(state: State, resource: Resource) {
            state.categories = state.categories.filter(el => el.id !== resource.id);
        },
        setActiveResource(state: State, resIdx: ResourceIndexes) {
            console.log('setActiveResource', resIdx);
            state.activeCategoryIndex = resIdx.categoryIdx;
            state.activeResourceIndex = resIdx.resourceIdx;
        },
        setCurrentResourceData(state: State, data: string) {
            state.categories[state.activeResourceIndex].data = data;
        },
        setCurrentResourceName(state: State, name: string) {
            state.categories[state.activeResourceIndex].name = name;
        },
        setIconPickerVisible(state: State, visible: boolean) {
            state.isIconPickerVisible = visible;
        },
        setResourceIcon(state: State, resourceIcon: ResourceIcon) {
            console.log('setResourceIcon', resourceIcon);
            state.categories[resourceIcon.resourceIndex].icon = resourceIcon.iconClass;
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
        setActiveResource({commit}: CommitFunction, resIdx: ResourceIndexes) {
            console.log('setActiveResource', resIdx);
            if (resIdx.resourceIdx >= 0 && resIdx.categoryIdx >= 0) {
                commit('setActiveResource', resIdx);
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
            await dispatch('saveCurrentResource', state.categories[resourceIcon.resourceIndex]);
        },
        setIconPickerIndex({commit} : CommitFunction, idx: number) {
            commit('setIconPickerIndex', idx);
        },
        async deleteResource({commit, state} : CommitStateFunction<State>, idx: number) {
            const resource = state.categories[idx];
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
        getResources(state: State): Map<number, Category> {
            return state.categories;
        },
        isLoggedIn(state: State): boolean {
            return state.user !== null;
        },
        getActiveResourceIndex(state: State): number {
            return state.activeResourceIndex;
        },
        getActiveResourceData(state: State): string {
            if (!state.categories.has(state.activeCategoryIndex)) {
                return '';
            }
            const resources = state.categories.get(state.activeCategoryIndex)?.Resources;
            if (!resources || !resources.has(state.activeResourceIndex)) {
                return '';
            }
            const resource = resources.get(state.activeResourceIndex);
            console.log('getActiveResourceData', resource);
            return resource?.data ?? '';
        },
        getActiveResourceName(state: State): string {
            if (!state.categories.has(state.activeCategoryIndex)) {
                return '';
            }
            const resources = state.categories.get(state.activeCategoryIndex)?.Resources;
            if (!resources || !resources.has(state.activeResourceIndex)) {
                return '';
            }
            const resource = resources.get(state.activeResourceIndex);
            return resource?.name ?? '';
        },
        getActiveResource(state: State): Resource|undefined {
            if (!state.categories.has(state.activeCategoryIndex)) {
                return undefined;
            }
            const resources = state.categories.get(state.activeCategoryIndex)?.Resources;
            if (!resources || !resources.has(state.activeResourceIndex)) {
                return undefined;
            }
            return resources.get(state.activeResourceIndex);
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
            return state.categories[state.activeResourceIndex].icon;
        },
        getIconPickerIndex(state: State): number|undefined
        {
            return state.iconPickerIndex;
        }
    },
});

export default store;