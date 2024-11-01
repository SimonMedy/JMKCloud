export interface User {
  id: string;
  email: string;
  username: string;
  storageLimit: number;
  roles: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

export interface AuthContextType extends AuthState {
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  confirmEmail: (token: string) => Promise<string>;
  confirmRegistration: (sessionId: string) => Promise<boolean>;
}
