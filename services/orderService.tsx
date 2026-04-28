import { callApi } from "./callApi";

export const loadOrders = (params: any, token: string) => {
    let url = 'dvc/orders'
    const queryParams: string[] = [];
    if (params.limit) {
        queryParams.push(`limit=${params.limit}`)
    }
    if (params.page) {
        queryParams.push(`page=${params.page}`)
    }
    if (params.status) {
        queryParams.push(`status=${params.status}`)
    }
    if (params.fromDate) {
        queryParams.push(`from_date=${params.fromDate}`)
    }
    if (params.toDate) {
        queryParams.push(`to_date=${params.toDate}`)
    }
    if (params.serviceCode) {
        queryParams.push(`service_code=${params.serviceCode}`)
    }
    if (params.medicalCode) {
        queryParams.push(`ld_maso_bhxh=${params.medicalCode}`)
    }
    if (params.customerName) {
        queryParams.push(`ld_name=${params.customerName}`)
    }
    if (params.customerPhone) {
        queryParams.push(`ld_phone=${params.customerPhone}`)
    }
    if (params.plan) {
        queryParams.push(`ld_pa=${params.plan}`)
    }
    if (params.orderNumber) {
        queryParams.push(`order_number=${params.orderNumber}`)
    }

    if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`
    }
    const resp = callApi(url, 'GET', {}, 'v1', token);
    return resp;
}

export const loadInfoFromSocialCode = (id: string, token: string) => {
    const url = 'bhxh/info/bhxhinfo';

}