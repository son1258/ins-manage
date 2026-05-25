import { getRuntimeConfig } from "@/utils/runtimeConfig";
import axios from "axios";

const getBaseUrl = (): string => {
    const runtime = getRuntimeConfig();
    return (
        runtime.BASE_URL || 
        process.env.NEXT_PUBLIC_BASE_URL || 
        ""
    );
}

export const callApi = async function (endpoint = '', method = 'GET', body = {}, version = '', token = '', isFormData = false) {
    const BASE_URL = getBaseUrl();
    const API_URL = `${BASE_URL}/api/${version || "v1"}`;
    let headers: any = {
        "Content-Type": isFormData ? 'multipart/form-data' : 'application/json',
    }

    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    const callApiData = async () => {
        switch(method) {
            case 'POST': 
                return await axios.post(`${API_URL}/${endpoint}`, body, {headers: headers});
            case 'PUT':
                return await axios.put(`${API_URL}/${endpoint}`, body, {headers: headers});
            default: 
                return axios.get(`${API_URL}/${endpoint}`, {headers: headers});
        }
    }
    return callApiData().then((response) => response.data);
}