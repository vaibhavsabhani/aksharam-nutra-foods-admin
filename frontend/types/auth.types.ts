export type Session = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  isEmailVerified: boolean;
  createdAt: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type MessageResponse = {
  message: string;
  resetToken?: string;
};

