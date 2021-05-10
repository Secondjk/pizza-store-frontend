import axios from 'axios';
import { Auth } from 'utils/Auth';
import { Type, ValidationError } from 'myzod';

const API_URL = 'http://localhost:8080/api/'; // TODO: USE ENV VAR

export const http = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: Auth.getIsAuthorized() ? `Bearer ${Auth.getToken()}` : undefined,
    'Content-Type': 'application/json'
  },
  validateStatus: status => (status >= 200 && status < 300) || status === 400
});

export const validateObj = <T, >(obj: T, type: Type<T>): T => {
  const parsed = type.try(obj);

  if (parsed instanceof ValidationError) {
    throw parsed;
  }

  return parsed;
};
