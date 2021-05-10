export const Auth = {
  setToken: (token: string) => localStorage.setItem('access_token', token),
  getToken: () => localStorage.getItem('access_token'),
  removeToken: () => localStorage.removeItem('access_token'),
  getIsAuthorized: () => Boolean(localStorage.getItem('access_token'))
};