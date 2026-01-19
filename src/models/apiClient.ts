import axios from "axios";
import {Category, Resource} from "./data/resource.ts";

const host = import.meta.env.VITE_BACKEND_URL;

export default class ApiClient {
    public async login(username: string, password: string): Promise<boolean> {
        const { data, status } = await axios.post(ApiClient.getMethod('login'), { username, password });
        console.log('authenticate', data, status);
        return status === 200;
    }

    public async resources(limit: number = -1, offset: number = -1): Promise<Array<Resource>> {
        if (limit !== -1 && offset !== -1) {
            const { data, status } = await axios.get(ApiClient.getMethod(`resources?limit=${limit}&offset=${offset}`));
            if (status !== 200) {
                throw new Error(`api error ${status}`);
            }
            return data;
        }
        const { data, status } = await axios.get(ApiClient.getMethod('resources'));
        if (status !== 200) {
            throw new Error(`api error ${status}`);
        }
        return data;
    }

    public async resource(res: Resource): Promise<Resource> {
        const endpoint = ApiClient.getMethod('resource', res.id);
        const { data, status } = await axios.post(
            endpoint,
            res
        );
        console.log(endpoint, data, status);
        return data;
    }

    public async category(cat: Category): Promise<Category> {
        const endpoint = ApiClient.getMethod('category', cat.id);
        const { data, status } = await axios.post(
            endpoint,
            { id: cat.id, name: cat.name, icon: cat.icon, userId: cat.userId }
        );
        console.log(endpoint, data, status);
        return data;
    }

    public async deleteCategory(cat: Category): Promise<boolean> {
        if (cat.id > 0) {
            const { status } = await axios.delete(ApiClient.getMethod('category', cat.id));
            return status === 200;
        }
        return false;
    }

    public async deleteResource(res: Resource): Promise<boolean> {
        if (res.id > 0) {
            const { status } = await axios.delete(ApiClient.getMethod('resource', res.id));
            return status === 200;
        }
        return false;
    }

    public static getMethod(name: string, id: number = 0): string {
        return id !== 0 ? `${host}/${name}/${id}` : `${host}/${name}`;
    }
}