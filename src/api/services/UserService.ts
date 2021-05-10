import { User } from 'api/models/User';
import { http, validateObj } from 'api/http';
import { AxiosResponse } from 'axios';
import { Auth } from 'utils/Auth';

export const UserService = {
  getCurrentUser: async (): Promise<User> =>
    http.get('/user', {
      headers: {
        Authorization: Auth.getIsAuthorized() ? `Bearer ${Auth.getToken()}` : undefined,
      }
    })
      .then((response: AxiosResponse<User>) => validateObj<User>(response.data, User)),
  updateCurrentUser: async (user: User): Promise<User> =>
    http.put('/user', user)
      .then((response: AxiosResponse<User>) => validateObj<User>(response.data, User))
};