interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
  };
  token: string;
  message: string;
}

export const authService = {
  setToken: (token: string) => {
    localStorage.setItem('authToken', token);
  },

  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  removeToken: () => {
    localStorage.removeItem('authToken');
  },

  isAuthenticated: (): boolean => {
    const token = authService.getToken();
    return !!token;
  },

  getAuthHeaders: () => {
    const token = authService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
