import { callApi } from "./callApi";

export const loadDistributors = (params: any, token: string) => {
    let url = 'distributors';
    let queryParams: string[] = [];
    if (params.limit) {
        queryParams.push(`limit=${params.limit}`)
    }
    if (params.page) {
        queryParams.push(`page=${params.page}`)
    }
    if (params.status) {
        queryParams.push(`status=${params.status}`)
    }
    if (params.distributorCode) {
        queryParams.push(`code=${params.distributorCode}`);
    }
    if (params.distributorName) {
        queryParams.push(`name=${params.distributorName}`)

    }

    if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`
    }

    const resp = callApi(url, 'GET', {}, 'v1', token);
    return resp;
}

export const createDistributor = (data: any, token: string) => {
    const url = 'distributor/create';
    const resp = callApi(url, 'POST', data, 'v1', token);
    return resp;
}

export const loadDistributorById = (id: string, token: string) => {
    const url = `distributor?id=${id}`;
    const resp = callApi(url, 'GET', {}, 'v1', token);
    return resp;
}

export const updateDistributor = (data: any, token: string) => {
    const url = 'distributor/update';
    const resp = callApi(url, 'POST', data, 'v1', token);
    return resp;
}

export const disableDistributor = (id: string, token: string) => {
    const url = 'distributor/disable';
    const resp = callApi(url, 'POST', {id: id}, 'v1', token);
    return resp;
}