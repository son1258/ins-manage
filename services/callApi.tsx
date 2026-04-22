import axios from "axios";

export const callApi = async function (endpoint = '', method = 'GET', body = {}, version = '', token = '', isFormData = false) {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "");
    const API_URL = `${BASE_URL}/api/${version || "v1"}`;

    let headers: any = {
        "Content-Type": 'application/json',
    }

    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    const callApiData = async () => {
        switch(method) {
            case 'POST': 
                const postPromise = await axios.post(`${API_URL}/${endpoint}`, body, {headers: headers})
                return postPromise;
            case 'PUT':
                const putPromise = await axios.put(`${API_URL}/${endpoint}`, body, {headers: headers})
                return putPromise;
            default: 
                const promise = axios.get(`${API_URL}/${endpoint}`, {headers: headers})
                return promise;
        }
    }

    let res = callApiData().then((response) => response.data);
    return res;
}