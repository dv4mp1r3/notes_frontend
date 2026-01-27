import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { h } from 'vue'
import {
    faDownload,
    faCode,
    faCogs,
    faBell,
    faPalette,
    faCubes,
    faLock,
    faCog,
    faListUl,
    faFileAlt,
    faListAlt,
    faPlus,
    faKey
} from '@fortawesome/free-solid-svg-icons'
import {Category, Resource} from "./resource.ts";

library.add(
    faDownload,
    faCode,
    faCogs,
    faBell,
    faPalette,
    faCubes,
    faLock,
    faCog,
    faListUl,
    faFileAlt,
    faListAlt,
    faPlus,
    faKey
)

function createIconElement(iconClass: string): any {
    return {
        element: h('div', [h(FontAwesomeIcon, { size: 'lg', icon: `fa-solid ${iconClass}` })]),
    }
}

export type Badge = {
    text: string,
    class?: string
}

export enum MenuType {
    CATEGORY,
    RESOURCE,
}

export type MenuElement = {
    id?: string,
    data?: string,
    title: string,
    icon: any,
    resourceId: number,
    type: MenuType,
    categoryId: number,
    badge?: Badge,
    child?: Array<MenuElement>,
    isOpen?: boolean,
};

//todo: define default icon

export const MENU_INDEX_ENCRYPTION_KEY = -2;
export const MENU_INDEX_NEW_ITEM = -1;

export default class Menu {

    static getDefaultMenu(): Array<Object> {
        return [
            {
                hiddenOnCollapse: true,
            },
            {
                id: 'encryption-key',
                data: null,
                title: 'Encryption key',
                icon: createIconElement('fa-key'),
                resourceId: MENU_INDEX_ENCRYPTION_KEY,
                class: 'control-item'
            },
            {
                id: 'new-category',
                data: null,
                title: 'New Item',
                icon: createIconElement('fa-plus'),
                resourceId: MENU_INDEX_NEW_ITEM,
                type: MenuType.CATEGORY,
                class: 'control-item control-item-last'
            }
        ]
    }

    static addMenuElementFromResource(res: Resource, idx: number, categoryId: number): MenuElement {
        return <MenuElement>{
            id: `res-${categoryId}-${idx}`,
            data: res.data,
            title: res.name,
            icon: createIconElement(res.icon),
            resourceId: idx,
            categoryId: categoryId,
            badge: {
                text: '❌',
            },
            type: MenuType.RESOURCE
        }
    }

    static addCategory(cat: Category, categoryId: number): MenuElement {
        const result = <MenuElement>{
            id: `cat-${categoryId}`,
            resourceId: -1,
            title: cat.name,
            icon: createIconElement(cat.icon),
            isOpen: true,
            child: [
                <MenuElement>{
                    id: `add-res-${categoryId}`,
                    title: 'Add Resource',
                    icon: createIconElement('fa-plus'),
                    resourceId: MENU_INDEX_NEW_ITEM,
                    categoryId: categoryId,
                    type: MenuType.RESOURCE,
                }
            ],
            badge: {
                text: '❌',
            },
            type: MenuType.CATEGORY,
            categoryId: categoryId,
        };
        const self = this;
        const sortedResources = Array.from(cat.Resources.entries()).sort((a, b) => a[0] - b[0]);
        sortedResources.forEach(([key, value]) =>  {
            result.child?.push(self.addMenuElementFromResource(value, key, categoryId));
        });
        return result;
    }

    static setIconByClassName(item: MenuElement, className: string): MenuElement {
        const result = {...item};
        result.icon = createIconElement(className);
        return result;
    }
}
