import { callApi } from "./callApi";

export const loadCollections = (distributorId: string, token: string) => {
    let url = `distributor/collectors?distributor_id=${distributorId}`;
    const resp = callApi(url, 'GET', {}, 'v1', token);
    return resp;
}

export const createCollection = (data: any, token: string) => {
    const url = "collector/create";
    const resp = callApi(url, 'POST', data, 'v1', token);
    return resp;
}

export const disableCollection = (data: any, token: string) => {
    const url = "collector/disable";
    const resp = callApi(url, 'POST', data, 'v1', token);
    return resp;
}