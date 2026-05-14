import { callApi } from "./callApi";

export const loadProvinces = (token: string) => {
    const url = 'provinces';
    const resp = callApi(url, 'GET', {}, 'v1', token);
    return resp;
}

export const loadEthinicities = (token: string) => {
    const url = 'ethnicities';
    const resp = callApi(url, 'GET', {}, 'v1', token);
    return resp; 
}

export const loadProducts = (token: string) => {
    const url = 'products';
    const resp = callApi(url, 'GET', {}, 'v1', token);
    return resp; 
}