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
    iconPickerItem: MenuElement | undefined;
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

function getActiveResource(state: State): Resource|undefined {
    if (state.activeItem?.categoryId === undefined || state.activeItem?.resourceId === undefined) {
        return undefined;
    }
    return state.categories!.get(state.activeItem?.categoryId)!.Resources.get(state.activeItem?.resourceId);
}

const store = createStore({
    state: <State>{
        user: null,
        categories: new Map<number, Category>(),
        isIconPickerVisible: false,
        iconPickerItem: undefined,
    },
    mutations: {
        setUser(state: State, user: User) {
            state.user = user;
        },
        addCategory(state: State, category: Category) {
            state.categories.set(category.id, category);
            state.activeItem = {
                categoryId: category.id,
                resourceId: -1,
                title: category.name,
                icon: category.icon,
                type: MenuType.CATEGORY
            };
        },
        addResource(state: State) {
            if (state!.activeItem?.categoryId === undefined) {
                return;
            }
            const category = state.categories.get(state.activeItem?.categoryId);
            if (!category) {
                return;
            }
            const resourceKeys = Array.from(category.Resources.keys());
            const minKey = resourceKeys.length > 0 ? Math.min(...resourceKeys) : 0;
            const tempId = minKey <= 0 ? minKey - 1 : -1;

            const res: Resource = {
                id: 0,
                categoryId: state.activeItem.categoryId,
                name: 'New Resource',
                data: '',
                icon: 'fa-code'
            };
            category.Resources.set(tempId, res);

            state.activeItem = Menu.addMenuElementFromResource(res, tempId, state.activeItem.categoryId);
        },
        saveCurrentResource(state: State, { oldResourceId, resource }: { oldResourceId: number, resource: Resource }) {
            if (state!.activeItem?.categoryId === undefined) {
                return;
            }
            const category = state.categories.get(state.activeItem?.categoryId);
            if (!category) {
                return;
            }
            if (oldResourceId !== resource.id) {
                category.Resources.delete(oldResourceId);
            }
            category.Resources.set(resource.id, resource);
            if (state.activeItem) {
                state.activeItem.resourceId = resource.id;
            }
        },
        saveCurrentCategory(state: State, category: Category) {
            if (state!.activeItem?.categoryId === undefined) {
                return;
            }
            const oldCategory = state.categories.get(state.activeItem?.categoryId);
            oldCategory!.id = category.id;
            state.categories.set(state.activeItem?.categoryId, {...oldCategory} as Category);
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
        deleteCategory(state: State, categoryId: number) {
            state.categories.delete(categoryId);
        },
        setActiveResource(state: State, item: MenuElement) {
            console.log('setActiveResource', item);
            state.activeItem = item;
        },
        setCurrentResourceData(state: State, data: string) {
            getActiveResource(state)!.data = data;
        },
        setCurrentResourceName(state: State, name: string) {
            const resource = getActiveResource(state);
            if (resource) {
                resource.name = name;
            }
        },
        setCurrentCategoryName(state: State, name: string) {
            if (state!.activeItem?.categoryId === undefined) {
                return;
            }
            const category = state.categories!.get(state!.activeItem?.categoryId);
            if (category) {
                category.name = name;
            }
        },
        setIconPickerVisible(state: State, visible: boolean) {
            state.isIconPickerVisible = visible;
        },
        setResourceIcon(state: State, item: MenuElement) {
            console.log('setResourceIcon mutation - resourceId:', item.resourceId, 'categoryId:', item.categoryId, 'icon:', item.icon);
            const category = state.categories!.get(item.categoryId);
            if (!category) {
                console.error('Category not found:', item.categoryId);
                return;
            }
            const existingResource = category.Resources.get(item.resourceId);
            if (!existingResource) {
                console.error('Resource not found:', item.resourceId, 'available keys:', Array.from(category.Resources.keys()));
                return;
            }
            const resource = { ...existingResource };
            resource.icon = item.icon;
            category.Resources.set(item.resourceId, resource as Resource);
            state.categories = new Map(state.categories);
        },
        setCategoryIcon(state: State, item: MenuElement) {
            console.log('setCategoryIcon', item);
            const existingCategory = state.categories!.get(item.categoryId);
            if (!existingCategory) {
                console.error('Category not found:', item.categoryId);
                return;
            }
            const category = { ...existingCategory };
            category.icon = item.icon;
            state.categories!.set(item.categoryId, category as Category);
            state.categories = new Map(state.categories);
        },
        setIconPickerIndex(state: State, data: MenuElement) {
            state.iconPickerItem = data;
        }
    },
    actions: {
        updateUser({ commit }: CommitFunction, user: User) {
            commit('setUser', user);
        },
        setResources({commit}: CommitFunction, data: SetResourceData) {
            commit('setResources', data);
        },
        async addCategory({commit}: CommitFunction) {
            const client = new ApiClient();
            const newCategory: Category = {
                id: 0,
                name: 'New Category',
                icon: 'fa-code',
                userId: 0,
                Resources: new Map<number, Resource>()
            };
            const res = await client.category(newCategory);
            if (res.id > 0) {
                newCategory.id = res.id;
                commit('addCategory', newCategory);
            }
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
        async saveCurrentResource({commit, getters, state}: CommitGettersFunction<Getters> & { state: State }, resource: Resource) {
            const client = new ApiClient();
            const encrDataResource = {...resource};
            encrDataResource.data = AES.encrypt(resource.data, getters.getEncryptionKey).toString();
            const res = await client.resource(encrDataResource);
            if (res.id > 0) {
                const savedResource = {...resource, id: res.id};
                const oldMapKey = state.activeItem?.resourceId ?? resource.id;
                commit('saveCurrentResource', { oldResourceId: oldMapKey, resource: savedResource });
            }
        },
        async saveCurrentCategory({commit, state}: CommitStateFunction<State>, category: Category) {
            const client = new ApiClient();
            const res = await client.category(category);
            if (res.id === category.id) {
                const oldCategory = state.categories.get(category.id);
                if (oldCategory) {
                    state.categories.set(category.id, {...oldCategory, name: res.name, icon: res.icon});
                }
            }
        },
        setCurrentResourceData({commit} : CommitFunction, data: string) {
            commit('setCurrentResourceData', data);
        },
        setCurrentResourceName({commit}: CommitFunction, name: string) {
            commit('setCurrentResourceName', name);
        },
        setCurrentCategoryName({commit}: CommitFunction, name: string) {
            commit('setCurrentCategoryName', name);
        },
        //@ts-ignore
        setEncryptionKey({commit}: CommitFunction, data: string) {
            localStorage.setItem("key", data);
        },
        setIconPickerVisible({commit}: CommitFunction, visible: boolean) {
            commit('setIconPickerVisible', visible);
        },
        async setResourceIcon({commit, dispatch, state} : CommitStateDispatchFunction<State, Dispatch> , item : MenuElement) {
            commit('setResourceIcon', item);
            await dispatch('saveCurrentResource', state.categories?.get(item.categoryId)?.Resources.get(item.resourceId));
        },
        async setCategoryIcon({commit, dispatch, state} : CommitStateDispatchFunction<State, Dispatch> , item : MenuElement) {
            console.log('setCategoryIcon action', 'categoryId:', item.categoryId, 'categories keys:', Array.from(state.categories.keys()));
            commit('setCategoryIcon', item);
            const category = state.categories?.get(item.categoryId);
            console.log('setCategoryIcon category to save:', category);
            if (category) {
                await dispatch('saveCurrentCategory', category);
            }
        },
        setIconPickerIndex({commit, state} : CommitStateFunction<State>, data: MenuElement) {
            commit('setIconPickerIndex', data);
        },
        async deleteResource({commit, state} : CommitStateFunction<State>, data: ResourceIndexes) {
            const resource = state.categories?.get(data.categoryId)?.Resources.get(data.resourceId);
            if (resource === undefined) {
                return;
            }

            if (resource.id <= 0) {
                commit('deleteResource', data);
                return;
            }

            const client = new ApiClient();
            const isDeleted = await client.deleteResource(resource);
            if (isDeleted) {
                commit('deleteResource', data);
            }
        },
        async deleteCategory({commit, state} : CommitStateFunction<State>, categoryId: number) {
            const category = state.categories?.get(categoryId);
            if (category === undefined || category.id <= 0) {
                return;
            }

            const client = new ApiClient();
            const isDeleted = await client.deleteCategory(category);
            if (isDeleted) {
                commit('deleteCategory', categoryId);
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
            return getActiveResource(state)?.data ?? '';
        },
        getActiveResourceName(state: State): string {
            if (state.activeItem?.type === MenuType.CATEGORY) {
                return state.categories?.get(state?.activeItem?.categoryId)?.name ?? '';
            } else {
                return getActiveResource(state)?.name ?? '';
            }

        },
        getActiveResource(state: State): Resource|undefined {
            return getActiveResource(state);
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
            return getActiveResource(state)?.icon || '';
        },
        getIconPickerIndex(state: State): ResourceIndexes|undefined
        {
            return state.iconPickerItem;
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