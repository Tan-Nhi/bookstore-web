import axios from "services/axios.customize";

export const loginApi = (username: string, password: string) => {
    const urlBackend = "/api/v1/auth/login";
    return axios.post<IBackendRes<ILogin>>(urlBackend, { username, password }, {
        headers: {
            delay: 2000
        }
    });
}

export const registerApi = (fullName: string, email: string, password: string, phone: string) => {
    const urlBackend = "/api/v1/user/register";
    return axios.post<IBackendRes<IRegister>>(urlBackend, { fullName, email, password, phone });
}


export const fetchAccountApi = () => {
    const urlBackend = "/api/v1/auth/account";
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend, {
        headers: {
            delay: 1000
        }
    });
}

export const logoutApi = () => {
    const urlBackend = "/api/v1/auth/logout";
    return axios.post<IBackendRes<IRegister>>(urlBackend);
}

export const getUserApi = (query: string) => {
    const urlBackend = `/api/v1/user?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend);
}

export const createUserApi = (fullName: string, email: string, password: string, phone: string) => {
    const urlBackend = "/api/v1/user";
    return axios.post<IBackendRes<IUserTable>>(urlBackend, { fullName, email, password, phone });
}

export const bulkCreateUserApi = (data: {
    fullName: string;
    password: string;
    email: string;
    phone: string;
}[]) => {
    const urlBackend = "/api/v1/user/bulk-create";
    return axios.post<IBackendRes<IResponseImport>>(urlBackend, data);
}

export const updateUserApi = (_id: string, fullName: string, phone: string) => {
    const urlBackend = "/api/v1/user";
    return axios.put<IBackendRes<IRegister>>(urlBackend, { _id, fullName, phone });
}


export const deleteUserApi = (id: string) => {
    const urlBackend = `/api/v1/user/${id}`;
    return axios.delete<IBackendRes<IRegister>>(urlBackend);
}