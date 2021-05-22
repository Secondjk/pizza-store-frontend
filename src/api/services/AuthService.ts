import { http, validateObj } from 'api/http';
import { AccessToken } from 'api/models/AccessToken';
import { AxiosResponse } from 'axios';
import { Auth } from 'utils/Auth';
import { UserStore } from 'stores/UserStore';

export type MessageResponse = { message?: string };

interface SignupData {
  username: string
  password: string
  email: string
  firstName: string
  lastName: string
}

export const AuthService = {
  login: async (username: string, password: string): Promise<AccessToken> =>
    http.post('/auth/sign-in', {
      username,
      password
    })
      .then((response: AxiosResponse<AccessToken>) => validateObj<AccessToken>(response.data, AccessToken))
      .then(data => {
        data.token && Auth.setToken(data.token as string);
        data.token && UserStore.setAuthorized(true);

        return data;
      }),
  register: async (signupData: SignupData): Promise<MessageResponse & { successful?: boolean }> =>
    http.post('/auth/sign-up', signupData)
      .then((response: AxiosResponse<MessageResponse>) => {
        const isSuccessful = response.status >= 200 && response.status < 300;

        return { message: response.data.message, successful: isSuccessful };
      })
};

console.log(AuthService);