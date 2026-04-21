import { toast } from "react-toastify";

export const handleApiError = (err: any, t: any) => {
    const status = err.response?.status || err.status;
    const serverMessage = err.response?.data?.message;
    switch (status) {
        case 400:
            toast.error(t('err_bad_request'));
            break;
        case 401:
            toast.error(t('err_unauthorized'));
            break;
        case 403:
            toast.error(t('err_forbidden'));
            break;
        case 404:
            toast.error(t('err_not_found'));
            break;
        case 500:
            toast.error(t('err_server_maintenance'));
            break;
        default:
            toast.error(serverMessage || t('err_unknown'));
            break;
    }
};