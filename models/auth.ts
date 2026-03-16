export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  image?: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}