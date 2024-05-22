import axios from "axios";

const host = 'http://localhost:8080'

export default class ApiClient {
    public async login(username: string, password: string) : Promise<boolean> {
        const {data, status} = await axios.post(ApiClient.getMethod('login'), { username, password });
        console.log('authenticate', data, status);
        return status === 200;
    }

    public async resources(limit: number = -1, offset: number = -1) : Promise<Array<Resource>> {
        if (limit !== -1 && offset !== -1) {
            const {data, status} = await axios.get(ApiClient.getMethod(`resources?limit=${limit}&offset=${offset}`));
            if (status !== 200) {
                throw new Error(`api error ${status}`);
            }
            return data;
        }   
        const {data, status } = await axios.get(ApiClient.getMethod('resources'));
        if (status !== 200) {
            throw new Error(`api error ${status}`);
        }
        return data;
    }

    public async resource(res: Resource) : Promise<boolean> {
        const endpoint = ApiClient.getMethod('resource');
        if (res.id !== 0) {
            const {data, status} = await axios.put(`${endpoint}/${res.id}`, res);
            console.log('resource put', data, status);
            return status === 200;
        }

        const {data, status} = await axios.post(endpoint, res);
        console.log('resource post (new)', data, status);
        return status === 200;
    }

    public static getMethod(name: string) : string {
        return `${host}/${name}`;
    }
}