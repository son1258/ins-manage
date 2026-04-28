import { callApi } from "./callApi";

export const loadPayments = (params: any, token: string) => {
    let url = 'payment/list';
    let queryParams: string[] = [];
    if (params.limit) {
        queryParams.push(`limit=${params.limit}`)
    }
    if (params.page) {
        queryParams.push(`page=${params.page}`)
    }
    if (params.status != null || params.status != "") {
        queryParams.push(`status=${params.status}`)
    }
    if (params.fromDate) {
        queryParams.push(`from_date=${params.fromDate}`)
    }
    if (params.toDate) {
        queryParams.push(`to_date=${params.toDate}`)
    }

    if (queryParams.length > 0) {
            url += `?${queryParams.join("&")}`
        }
    
    const resp = callApi(url, 'GET', {}, 'v1', token);
    return resp;
}

export const createNewPayment = (data: any, token: string) => {
    const url = 'payment/create';
    const resp = callApi(url, 'POST', data, 'v1', token);
    return resp;
}

export const terminatePayment = (data: any, token: string) => {
    const url = 'payment/terminate';
    const resp = callApi(url, 'POST', data, 'v1', token);
    return resp;
}