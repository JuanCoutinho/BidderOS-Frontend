import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/v1',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as { auth: { token: string | null } }).auth.token;
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, { email: string; password: string }>({
            query: (body) => ({ url: '/auth/login', method: 'POST', body }),
        }),
        register: builder.mutation<AuthResponse, { name: string; email: string; password: string; password_confirmation: string }>({
            query: (body) => ({ url: '/auth/register', method: 'POST', body }),
        }),
        me: builder.query<{ user: User }, void>({
            query: () => '/auth/me',
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useMeQuery } = authApi;
