import { Infer, literals, number, object, string } from 'myzod';

const City = literals(
  'MOSCOW',
  'ST_PETERSBURG',
  'KRASNODAR'
);

export const User = object({
  id: number().optional(),
  username: string().optional(),
  email: string().nullable(),
  firstName: string().nullable(),
  lastName: string().nullable(),
  city: City.nullable(),
  deliveryAddress: string().nullable(),
  entrance: string().nullable(),
  floor: string().nullable(),
  intercom: string().nullable(),
  tel: string().nullable(),
}, { allowUnknown: true, collectErrors: true });

export type User = Infer<typeof User>;
export type City = Infer<typeof City>;