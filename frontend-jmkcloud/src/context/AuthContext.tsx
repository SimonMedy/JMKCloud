import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContextType, AuthState, User } from "../types/auth";

const AuthContext = createContext<AuthContextType | null>(null);
const LOCAL_STORAGE_TOKEN_KEY = "auth_token";
const API_BASE_URL = "https://api-jmkcloud.vercel.app/apiv1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY),
    loading: true,
  });

  const fetchUser = async () => {
    try {
      const response = await axios.get<User>(`${API_BASE_URL}/user/profile`);
      setState((prev) => ({
        ...prev,
        user: response.data,
        loading: false,
      }));
    } catch (err) {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
      setState({
        user: null,
        token: null,
        loading: false,
      });
    }
  };

  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
      fetchUser();
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [state.token]);

  const register = async (
    email: string,
    username: string,
    password: string
  ) => {
    try {
      await axios.post<{ email: string }>(`${API_BASE_URL}/register`, {
        email,
        username,
        password,
      });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      throw new Error(
        error.response?.data?.message || "Une erreur est survenue"
      );
    }
  };

  const confirmEmail = async (token: string) => {
    try {
      const url = `${API_BASE_URL}/confirm-email`;
      const data = { token };

      console.log("Request URL:", url);
      console.log("Request Data:", data);

      const response = await axios.post<{ payment_url: string }>(url, data);

      console.log("Response:", response.data);
      return response.data.payment_url;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("Error Status:", err.response?.status);
        console.log("Error Data:", err.response?.data);
        console.log("Error Config:", err.config);
      }
      throw err;
    }
  };

  const confirmRegistration = async (session_id: string) => {
    try {
      const response = await axios.post<{ token: string }>(
        `${API_BASE_URL}/confirm-registration`,
        {
          session_id,
        }
      );

      const token = response.data.token;
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);

      setState((prev) => ({
        ...prev,
        token,
      }));

      console.log("Token enregistré :", token);

      return true;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        return true;
      }
      const error = err as AxiosError<{ message: string }>;
      throw new Error(
        error.response?.data?.message || "Une erreur est survenue"
      );
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post<{ token: string }>(
        `${API_BASE_URL}/login`,
        { email, password }
      );

      const token = response.data.token;
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
      setState((prev) => ({
        ...prev,
        token,
      }));

      navigate("/dashboard");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      throw new Error(
        error.response?.data?.message || "Une erreur est survenue"
      );
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    setState({
      user: null,
      token: null,
      loading: false,
    });
    navigate("/login");
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
        confirmEmail,
        confirmRegistration,
      }}
    >
      {!state.loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
