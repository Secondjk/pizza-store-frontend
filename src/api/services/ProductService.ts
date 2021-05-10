import { Product } from 'api/models/Product';
import { http, validateObj } from 'api/http';
import { AxiosResponse } from 'axios';
import { array } from 'myzod';

export type ProductSortLiteral = 'isPopular' | 'newProduct' | 'price';
export type SortDirection = 'asc' | 'desc';

export const ProductService = {
  getAllProducts:
    (sortProperty: ProductSortLiteral = 'isPopular', direction: SortDirection = 'asc'): Promise<Product[]> =>
      http.get('/products/sorted', {
        params: {
          sort: `${sortProperty},${direction}`
        },
        headers: {
          'Cache-Control': 'max-age=86400'
        }
      })
        .then((response: AxiosResponse<Product[]>) => validateObj(response.data, array(Product)))
};