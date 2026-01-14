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
    data?: string,
    title: string,
    icon: any,
    idx: number,
    type: MenuType,
    categoryIdx: number,
    badge?: Badge
    child?: Array<MenuElement>,
};

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
                data: null,
                title: 'Encryption key',
                icon: iconMap.get('fa-key'),
                idx: MENU_INDEX_ENCRYPTION_KEY,
                class: 'control-item'
            },
            {
                data: null,
                title: 'New Item',
                icon: iconMap.get('fa-plus'),
                idx: MENU_INDEX_NEW_ITEM,
                class: 'control-item control-item-last'
            }
        ]
    }

    static addMenuElementFromResource(res: Resource, idx: number, categoryIdx: number): MenuElement {
        if (!iconMap.has(res.icon)) {
            iconMap.set(res.icon, faIcon({ icon: `fa-solid ${res.icon}` }));
        }
        return {
            data: res.data,
            title: res.name,
            icon: iconMap.get(res.icon),
            idx: idx,
            categoryIdx: categoryIdx,
            badge: {
                text: '❌',
            },
            type: MenuType.RESOURCE
        }
    }

    static addCategory(cat: Category, idx: number): MenuElement {
        const result = <MenuElement>{
            idx: idx,
            title: cat.name,
            icon: iconMap.get(cat.icon),
            child: [],
            badge: {
                text: '❌',
            },
            type: MenuType.CATEGORY,
            categoryIdx: -1,
        };
        const self = this;
        cat.Resources.forEach((value) =>  {
            result.child?.push(self.addMenuElementFromResource(value, value.id, idx));
        });
        return result;
    }
}
