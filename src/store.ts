//@ts-ignore
import {Commit, createStore, Dispatch, Getters} from 'vuex'
import ApiClient from './models/apiClient';
import {AES, enc} from 'crypto-js';
import {Category, Resource, SetResourceCategory} from "./models/data/resource.ts";
import {User} from "./models/data/user.ts";
import {MenuElement, MenuType} from "./models/data/menu.ts";

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
    activeResourceKey: number;
    activeCategoryKey: number;
    isIconPickerVisible: boolean;
    iconPickerData: ResourceIndexes | undefined;
    isActiveElementCategory: boolean;
}


export type ResourceIcon = {
    resourceKey: number;
    categoryKey: number;
    iconClass: string;
}

export type SetResourceData = {
    categories: Array<SetResourceCategory>;
    pwd: string;
}

export type ResourceIndexes = {
    resourceId: number,
    categoryId: number,
}

const store = createStore({
    state: <State>{
        user: null,
        activeResourceKey: -1,
        activeCategoryKey: -1,
        categories: new Map<number, Category>(),
        isIconPickerVisible: false,
        iconPickerData: undefined,
        isActiveElementCategory: false,
    },
    mutations: {
        setUser(state: State, user: User) {
            state.user = user;
        },
        addCategory(state: State) {
          //todo: implement
        },
        addResource(state: State) {            
            const res: Resource = {
                id: 0,
                name: '',
                data: '',
                icon: 'fa-code'
            };
            if (!state.categories.has(state.activeCategoryKey)) {
                console.error('addResource index error', state.activeCategoryKey)
                return;
            }
            const category = state.categories.get(state.activeCategoryKey);
            if (category === undefined) {
                return;
            }
            //@ts-ignore
            const resourceKeys = new Array(state.categories.get(state.activeCategoryKey).Resources.keys());
            const lastResourceKey = Number.parseInt(resourceKeys.sort()[resourceKeys.length - 1].toString()) + 1;
            res.name = `Resource №${lastResourceKey}`;
            category.Resources.set(lastResourceKey, res);
            state.activeResourceKey = lastResourceKey;
        },
        saveCurrentResource(state: State, resource: Resource) {
            if (!state.categories.has(state.activeCategoryKey)) {
                console.error('saveCurrentResource index error', state.activeCategoryKey)
                return;
            }
            const category = state.categories.get(state.activeCategoryKey);
            if (category === undefined) {
                return;
            }
            //@ts-ignore
            state.categories.get(state.activeCategoryKey).Resources.set(state.activeResourceKey, resource);
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
        deleteResource(state: State, data: ResourceIndexes) {
            //@ts-ignore
            state.categories.get(data.categoryId).Resources.delete(data.resourceId);
        },
        setActiveResource(state: State, item: MenuElement) {
            console.log('setActiveResource', item);
            state.activeResourceKey = item.idx;
            if (item.type === MenuType.CATEGORY) {
                state.isActiveElementCategory = true;
                state.activeCategoryKey = -1;
            } else {
                state.isActiveElementCategory = false;
                state.activeCategoryKey = item.categoryIdx;
            }
        },
        setCurrentResourceData(state: State, data: string) {
            state.categories!.get(state.activeCategoryKey)!.Resources.get(state.activeResourceKey)!.data = data;
        },
        setCurrentResourceName(state: State, name: string) {
            state.categories!.get(state.activeCategoryKey)!.Resources.get(state.activeResourceKey)!.name = name;
        },
        setIconPickerVisible(state: State, visible: boolean) {
            state.isIconPickerVisible = visible;
        },
        setResourceIcon(state: State, resourceIcon: ResourceIcon) {
            console.log('setResourceIcon', resourceIcon);
            const resource = { ...state.categories!.get(state.activeCategoryKey)!.Resources.get(state.activeResourceKey)};
            if (resource.icon) {
                resource.icon = resourceIcon.iconClass;
                state.categories!.get(state.activeCategoryKey)!.Resources.set(state.activeResourceKey, resource as Resource);
            }
        },
        setIconPickerIndex(state: State, data: ResourceIndexes) {
            state.iconPickerData = data;
        }
    },
    actions: {
        updateUser({ commit }: CommitFunction, user: User) {
            commit('setUser', user);
        },
        setResources({commit}: CommitFunction, data: SetResourceData) {
            commit('setResources', data);
        },
        addCategory({commit}: CommitFunction) {
            commit('addCategory');
        },
        addResource({commit}: CommitFunction) {
            commit('addResource');
        },
        setActiveResource({commit}: CommitFunction, item: MenuElement) {
            console.log('setActiveResource', item);
            if (item.idx >= 0) {
                commit('setActiveResource', item);
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
            await dispatch('saveCurrentResource', state.categories?.get(state.activeCategoryKey)?.Resources.get(state.activeResourceKey));
        },
        setIconPickerIndex({commit} : CommitFunction, data: ResourceIndexes) {
            commit('setIconPickerIndex', data);
        },
        async deleteResource({commit, state} : CommitStateFunction<State>, data: ResourceIndexes) {
            const resource = state.categories?.get(data.categoryId)?.Resources.get(data.resourceId);
            if (resource === undefined || resource.id <= 0) {
                return;
            }
                        
            const client = new ApiClient();
            const isDeleted = await client.deleteResource(resource);
            if (isDeleted) {
                commit('deleteResource', data);
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
            return state.activeResourceKey;
        },
        getActiveResourceData(state: State): string {
            if (!state.categories.has(state.activeCategoryKey)) {
                return '';
            }
            const resources = state.categories.get(state.activeCategoryKey)?.Resources;
            if (!resources || !resources.has(state.activeResourceKey)) {
                return '';
            }
            const resource = resources.get(state.activeResourceKey);
            console.log('getActiveResourceData', resource);
            return resource?.data ?? '';
        },
        getActiveResourceName(state: State): string {
            if (state.isActiveElementCategory) {
                return state.categories?.get(state.activeResourceKey)?.name ?? '';
            } else {
                if (!state.categories.has(state.activeCategoryKey)) {
                    return '';
                }
                const resources = state.categories.get(state.activeCategoryKey)?.Resources;
                if (!resources || !resources.has(state.activeResourceKey)) {
                    return '';
                }
                const resource = resources.get(state.activeResourceKey);
                return resource?.name ?? '';
            }

        },
        getActiveResource(state: State): Resource|undefined {
            if (!state.categories.has(state.activeCategoryKey)) {
                return undefined;
            }
            const resources = state.categories.get(state.activeCategoryKey)?.Resources;
            if (!resources || !resources.has(state.activeResourceKey)) {
                return undefined;
            }
            return resources.get(state.activeResourceKey);
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
            return state.categories?.get(state.activeCategoryKey)?.Resources?.get(state.activeResourceKey)?.icon || '';
        },
        getIconPickerIndex(state: State): ResourceIndexes|undefined
        {
            return state.iconPickerData;
        },
        isActiveElementCategory(state: State): boolean
        {
            return state.isActiveElementCategory;
        },
        isActiveElementResource(state: State): boolean
        {
            return !state.isActiveElementCategory;
        }
    },
});

export default store;