import ApiClient from "./apiClient";

export default class Auth {
    async authenticate(username: string, password: string): Promise<boolean> {
        return await (new ApiClient()).login(username, password);
    }

    isAuthorized(): boolean {
        return false;
    }
}