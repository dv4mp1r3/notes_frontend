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

const faIcon = (props: any) => {
    return {
        element: h('div', [h(FontAwesomeIcon, { size: 'lg', ...props })]),
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


const iconMap = new Map<string, any>();
iconMap.set('fa-code', faIcon({ icon: 'fa-solid fa-code' }));
iconMap.set('fa-plus', faIcon({ icon: 'fa-solid fa-plus' }));
iconMap.set('fa-key', faIcon({ icon: 'fa-solid fa-key' }));

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
                icon: iconMap.get('fa-key'),
                resourceId: MENU_INDEX_ENCRYPTION_KEY,
                class: 'control-item'
            },
            {
                id: 'new-category',
                data: null,
                title: 'New Item',
                icon: iconMap.get('fa-plus'),
                resourceId: MENU_INDEX_NEW_ITEM,
                type: MenuType.CATEGORY,
                class: 'control-item control-item-last'
            }
        ]
    }

    static addMenuElementFromResource(res: Resource, idx: number, categoryId: number): MenuElement {
        if (!iconMap.has(res.icon)) {
            iconMap.set(res.icon, faIcon({ icon: `fa-solid ${res.icon}` }));
        }
        return <MenuElement>{
            id: `res-${categoryId}-${idx}`,
            data: res.data,
            title: res.name,
            icon: iconMap.get(res.icon),
            resourceId: idx,
            categoryId: categoryId,
            badge: {
                text: '❌',
            },
            type: MenuType.RESOURCE
        }
    }

    static addCategory(cat: Category, categoryId: number): MenuElement {
        if (!iconMap.has(cat.icon)) {
            iconMap.set(cat.icon, faIcon({ icon: `fa-solid ${cat.icon}` }));
        }
        const result = <MenuElement>{
            id: `cat-${categoryId}`,
            resourceId: -1,
            title: cat.name,
            icon: iconMap.get(cat.icon),
            isOpen: true,
            child: [
                <MenuElement>{
                    id: `add-res-${categoryId}`,
                    title: 'Add Resource',
                    icon: iconMap.get('fa-plus'),
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
        cat.Resources.forEach((value) =>  {
            result.child?.push(self.addMenuElementFromResource(value, value.id, categoryId));
        });
        return result;
    }

    static setIconByClassName(item: MenuElement, className: string): MenuElement {
        const result = {...item};
        result.icon = iconMap.get(className);
        return result;
    }
}
