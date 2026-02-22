const API_BASE = '/api/v1';

interface LoginResponse {
    token: string;
    user: User;
}

interface RegisterResponse {
    token: string;
    user: User;
}

interface MeResponse {
    user: User;
}

export interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

function getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    if (!response.ok) {
        const message = data.error || data.errors?.join(', ') || 'Request failed';
        throw new Error(message);
    }
    return data as T;
}

export const authService = {
    async register(name: string, email: string, password: string, password_confirmation: string): Promise<RegisterResponse> {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, password_confirmation }),
        });
        return handleResponse<RegisterResponse>(response);
    },

    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return handleResponse<LoginResponse>(response);
    },

    async me(): Promise<MeResponse> {
        const response = await fetch(`${API_BASE}/auth/me`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse<MeResponse>(response);
    },
};
