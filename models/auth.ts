export interface User {
  id: string;
  email: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  image?: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}