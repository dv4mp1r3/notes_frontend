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

export type MenuElement = {
    data: string,
    title: string,
    icon: any,
    idx: number
};

export const MENU_INDEX_ENCRYPTION_KEY = -2;
export const MENU_INDEX_NEW_ITEM = -1;

const iconKey = faIcon({ icon: 'fa-solid fa-key' });
const iconPlus = faIcon({ icon: 'fa-solid fa-plus' });
const iconCode = faIcon({ icon: 'fa-solid fa-code' });

export default class Menu {

    static getDefaultMenu(): Array<Object> {
        return [
            {
                hiddenOnCollapse: true,
            },
            {
                data: null,
                title: 'Encryption key',
                icon: iconKey,
                idx: MENU_INDEX_ENCRYPTION_KEY,
                class: 'control-item'
            },
            {
                data: null,
                title: 'New Item',
                icon: iconPlus,
                idx: MENU_INDEX_NEW_ITEM,
                class: 'control-item control-item-last'
            }
        ]
    }

    static addMenuElementFromResource(res: Resource, idx: number): MenuElement {
        return {
            data: res.data,
            title: res.name,
            icon: iconCode,
            idx: idx
        }
    }
}
