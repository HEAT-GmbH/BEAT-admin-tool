export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  is_staff: boolean;
  is_superuser: boolean;
  role: string;
  image?: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}
