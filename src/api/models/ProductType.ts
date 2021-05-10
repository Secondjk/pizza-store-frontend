import { Infer, literals, number, object } from 'myzod';

const Type = literals(
  'PIZZA',
  'SALADS',
  'BEVERAGES'
);

export const ProductType = object({
  id: number(),
  name: Type
}, { allowUnknown: true, collectErrors: true });

export type ProductTypeLiteral = Infer<typeof Type>;
export type ProductType = Infer<typeof ProductType>;