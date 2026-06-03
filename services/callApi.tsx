import { handleLogout } from "@/utils/common";
import { getRuntimeConfig } from "@/utils/runtimeConfig";
import axios from "axios";

const getBaseUrl = (): string => {
    const runtime = getRuntimeConfig();

    return (
        runtime.BASE_URL ||
        process.env.NEXT_PUBLIC_BASE_URL ||
        ""
    );
};

export const callApi = async (
    endpoint = '',
    method = 'GET',
    body = {},
    version = '',
    token = '',
    isFormData = false
) => {
    try {
        const BASE_URL = getBaseUrl();
        const API_URL = `${BASE_URL}/api/${version || "v1"}`;
        const headers: any = {}
        if (!isFormData) {
            headers["Content-Type"] = "application/json";
        }
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        switch (method) {
            case 'POST':
                return (
                    await axios.post(
                        `${API_URL}/${endpoint}`,
                        body,
                        { headers }
                    )
                ).data;

            case 'PUT':
                return (
                    await axios.put(
                        `${API_URL}/${endpoint}`,
                        body,
                        { headers }
                    )
                ).data;

            default:
                return (
                    await axios.get(
                        `${API_URL}/${endpoint}`,
                        { headers }
                    )
                ).data;
        }
    } catch (error: any) {
        if (error.response?.status === 401) {
            const locale = window.location.pathname.split("/")[1] || "vi";
            console.log(locale)
            handleLogout(locale);
        }
        throw error;
    }
};