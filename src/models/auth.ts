import axios from "axios";

export default class Auth {
    async authenticate(username: string, password: string) : Promise<boolean> {
        const {data, status} = await axios.post('http://localhost:8080/login', { username, password });
        console.log('authenticate', data, status);
        return status === 200;
    }

    isAuthorized(): boolean {
        return false;
    }
}