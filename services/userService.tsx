import { callApi } from "./callApi"

export const loadListUsers = (params: any, token: string) => {
    let url = 'users';
    let queryParams: string[] = [];
    queryParams.push(`limit=${params.limit}`)
    queryParams.push(`page=${params.page}`)
    queryParams.push(`status=${params.status}`)
    if (params.username) {
        queryParams.push(`username=${params.username}`);
    }
    if (params.fullname) {
        queryParams.push(`fullname=${params.fullname}`);
    }

    if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`
    }
    const resp = callApi(url, 'GET', {}, 'v1', token);
    return resp;
}

export const login = (data: any) => {
    const url = 'user/login';
    const resp = callApi(url, 'POST', data, 'v1');
    return resp;
}

export const loadUserById = (id: string, token: string) => {
    let url = `user?id=${id}`;
    const resp = callApi(url, 'GET', {}, 'v1', token);
    return resp;
}

export const createNewUser = (data: any, token: string) => {
    const url = 'user/register';
    const resp = callApi(url, 'POST', data, 'v1', token);
    return resp;
}

export const disableUser = (data: any, token: string) => {
    const url = 'user/disable';
    const resp = callApi(url, 'POST', data, 'v1', token);
    return resp;
}

export const updateUser = (data: any, token: string) => {
    const url = 'user/update';
    const resp = callApi(url, 'POST', data, 'v1', token);
    return resp;
}