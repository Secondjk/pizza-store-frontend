import { boolean, Infer, number, object, string } from 'myzod';
import { ProductType } from 'api/models/ProductType';

export const Product = object({
  id: number(),
  name: string(),
  newProduct: boolean().optional(),
  isPopular: boolean().optional(),
  price: number(),
  initialPrice: number(),
  image: string(),
  productType: ProductType
}, { allowUnknown: true, collectErrors: true });

export type Product = Infer<typeof Product>;