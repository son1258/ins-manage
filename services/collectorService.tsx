import { callApi } from "./callApi";

export const loadCollectors = (params: any, token: string) => {
    let url = `collectors`;
    console.log(params)
    let queryParams: string[] = [];
    if (params.limit) {
        queryParams.push(`limit=${params.limit}`);
    }
    if (params.page) {
        queryParams.push(`page=${params.page}`);
    }
    if (params.status != "" && params.status != null) {
        queryParams.push(`status=${params.status}`);
    }
    if (params.collectorCode) {
        queryParams.push(`code=${params.collectorCode}`)
    }
    if (params.collectorName) {
        queryParams.push(`name=${params.collectorName}`);
    }
    if (params.distributorId) {
        queryParams.push(`distributor_id=${params.distributorId}`);
    }

    if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`
    }

    const resp = callApi(url, 'GET', {}, 'v1', token);
    return resp;
}

export const createCollector = (data: any, token: string) => {
    const url = "collector/create";
    const resp = callApi(url, 'POST', data, 'v1', token);
    return resp;
}

export const disableCollector = (data: any, token: string) => {
    const url = "collector/disable";
    const resp = callApi(url, 'POST', data, 'v1', token);
    return resp;
}

export const loadCollectorById = (id: string, token: string) => {
    const url = `collector?id=${id}`;
    const resp = callApi(url, 'GET', {}, 'v1', token);
    return resp;
}

export const updateCollector = (data: any, token: string) => {
    const url = "collector/update";
    const resp = callApi(url, 'POST', data, 'v1', token);
    return resp;
}