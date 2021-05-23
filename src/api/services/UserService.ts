import { User } from 'api/models/User';
import { http, validateObj } from 'api/http';
import { AxiosResponse } from 'axios';
import { Auth } from 'utils/Auth';
import { Order, OrderRequest } from 'api/models/Order';

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
      .then((response: AxiosResponse<User>) => validateObj<User>(response.data, User)),
  order: async (order: OrderRequest): Promise<Order> =>
    http.post('/user/addOrder', order)
      .then((response: AxiosResponse<Order>) => validateObj<Order>(response.data, Order)),
  getOrders: async (): Promise<Order[]> =>
    http.get('/user/orders')
      .then((response: AxiosResponse<Order[]>) => response.data.map(v => validateObj(v, Order)))
};