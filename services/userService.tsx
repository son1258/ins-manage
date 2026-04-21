import { callApi } from "./callApi"

export const loadCollectors = (params: any, token: string) => {
    let url = 'users';
    let queryParams: string[] = [];
    queryParams.push(`limit=${params.limit}`)
    queryParams.push(`page=${params.page}`)
    queryParams.push(`status=${params.status}`)
    if (params.collectorName) {
        queryParams.push(`fullname=${params.collectorName}`);
    }
    if (params.collectorCode) {
        queryParams.push(`collector_code=${params.collectorName}`);
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