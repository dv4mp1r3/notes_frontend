//@ts-ignore
import {Commit, createStore, Dispatch, Getters} from 'vuex'
import ApiClient from './models/apiClient';
import {AES, enc} from 'crypto-js';
import {Category, Resource, SetResourceCategory} from "./models/data/resource.ts";
import {User} from "./models/data/user.ts";
import Menu, {MenuElement, MenuType} from "./models/data/menu.ts";

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
    activeItem: MenuElement | undefined;
    categories: Map<number, Category>;
    isIconPickerVisible: boolean;
    iconPickerData: ResourceIndexes | undefined;
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
        categories: new Map<number, Category>(),
        isIconPickerVisible: false,
        iconPickerData: undefined,
    },
    mutations: {
        setUser(state: State, user: User) {
            state.user = user;
        },
        addCategory(state: State) {
          //todo: implement
        },
        addResource(state: State) {            

            const category = state.categories.get(state.activeItem?.categoryId);
            //@ts-ignore
            const resourceKeys = new Array(category.Resources.keys());
            const lastResourceKey = Number.parseInt(resourceKeys.sort()[resourceKeys.length - 1].toString()) + 1;
            const res: Resource = {
                id: lastResourceKey,
                name: `Resource №${lastResourceKey}`,
                data: '',
                icon: 'fa-code'
            };
            category?.Resources.set(lastResourceKey, res);

            state.activeItem = Menu.addMenuElementFromResource(res, lastResourceKey, category?.id);
        },
        saveCurrentResource(state: State, resource: Resource) {
            state.categories.get(state.activeItem?.categoryId).Resources.set(state.activeItem?.resourceId, resource);
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
            state.activeItem = item;
        },
        setCurrentResourceData(state: State, data: string) {
            state.categories!.get(state.activeItem?.categoryId)!.Resources.get(state.activeItem?.resourceId)!.data = data;
        },
        setCurrentResourceName(state: State, name: string) {
            state.categories!.get(state.activeItem?.categoryId)!.Resources.get(state.activeItem?.resourceId)!.name = name;
        },
        setIconPickerVisible(state: State, visible: boolean) {
            state.isIconPickerVisible = visible;
        },
        setResourceIcon(state: State, resourceIcon: ResourceIcon) {
            console.log('setResourceIcon', resourceIcon);
            const resource = { ...state.categories!.get(state.activeItem?.categoryId)!.Resources.get(state.activeItem?.resourceId)};
            if (resource.icon) {
                resource.icon = resourceIcon.iconClass;
                state.categories!.get(state.activeItem?.categoryId)!.Resources.set(state.activeItem?.resourceId, resource as Resource);
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
            if (item.resourceId >= 0 || item.categoryId >= 0) {
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
            await dispatch('saveCurrentResource', state.categories?.get(state.activeItem?.categoryId)?.Resources.get(state.activeItem?.idx));
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
        getActiveResourceIndex(state: State): number|undefined {
            return state.activeItem?.resourceId;
        },
        getActiveResourceData(state: State): string {
            return state.categories?.get(state?.activeItem?.categoryId)?.Resources?.get(state?.activeItem?.resourceId)?.data ?? '';
        },
        getActiveResourceName(state: State): string {
            if (state.activeItem?.type === MenuType.CATEGORY) {
                return state.categories?.get(state?.activeItem?.categoryId)?.name ?? '';
            } else {
                return state.categories?.get(state?.activeItem?.categoryId)?.Resources?.get(state?.activeItem?.resourceId)?.name ?? '';
            }

        },
        getActiveResource(state: State): Resource|undefined {
            return state.categories?.get(state?.activeItem?.categoryId)?.Resources?.get(state?.activeItem?.resourceId);
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
            return state.categories?.get(state?.activeItem?.categoryId)?.Resources?.get(state?.activeItem?.resourceId)?.icon || '';
        },
        getIconPickerIndex(state: State): ResourceIndexes|undefined
        {
            return state.iconPickerData;
        },
        isActiveElementCategory(state: State): boolean
        {
            return state?.activeItem?.type === MenuType.CATEGORY ?? false;
        },
        isActiveElementResource(state: State): boolean
        {
            return state?.activeItem?.type === MenuType.RESOURCE ?? false;
        }
    },
});

export default store;