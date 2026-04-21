import { SERVICE_CODE } from "@/constants";
import { callApi } from "./callApi";

export const loadMedicals = (params: any, token: string) => {
    let url = 'dvc/orders'
    const queryParams: string[] = [];
    queryParams.push(`service_code=${SERVICE_CODE.BHYT}`)
    queryParams.push(`limit=${params.limit}`)
    queryParams.push(`page=${params.page}`)
    queryParams.push(`status=${params.status}`)
    queryParams.push(`from_date=${params.fromDate}`)
    queryParams.push(`to_date=${params.toDate}`)
    if (params.medicalCode) {
        queryParams.push(`ld_maso_bhxh=${params.medicalCode}`)
    }
    if (params.customerName) {
        queryParams.push(`ld_name=${params.customerName}`)
    }
    if (params.plan) {
        queryParams.push(`ld_pa=${params.plan}`)
    }

    if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`
    }

    const resp = callApi(url, 'GET', {}, 'v1', token);
    return resp;
}