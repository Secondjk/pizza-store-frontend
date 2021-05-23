import { date, Infer, number, object } from 'myzod';

export interface OrderRequest {
  totalPrice: number
}

export const Order = object({
  id: number(),
  totalPrice: number(),
  date: date()
});

export type Order = Infer<typeof Order>;