import { array, Infer, object, string } from 'myzod';

export const AccessToken = object({
  token: string().optional(),
  type: string().optional(),
  roles: array(string()).optional()
}, { allowUnknown: true });

export type AccessToken = Infer<typeof AccessToken>;