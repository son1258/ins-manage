import { callApi } from "./callApi";

export const loadProviders = (token: string) => {
    const url = 'providers';
    const resp = callApi(url, 'GET', {}, 'v1', token);
    return resp;
}