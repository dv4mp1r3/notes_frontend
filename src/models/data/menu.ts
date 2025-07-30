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
import {Resource} from "./resource.ts";

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

export type MenuElement = {
    data: string,
    title: string,
    icon: any,
    idx: number
    badge?: Badge
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

    static addMenuElementFromResource(res: Resource, idx: number): MenuElement {
        if (!iconMap.has(res.icon)) {
            iconMap.set(res.icon, faIcon({ icon: `fa-solid ${res.icon}` }));
        }
        return {
            data: res.data,
            title: res.name,
            icon: iconMap.get(res.icon),
            idx: idx,
            badge: {
                text: '❌',
            }
        }
    }
}
