import { Product } from 'api/models/Product';
import { Store, Event, createStore, createEvent, Effect, createEffect } from 'effector';
import { ProductTypeLiteral } from 'api/models/ProductType';
import { ProductService, ProductSortLiteral, SortDirection } from 'api/services/ProductService';

type TypeFilterLiteral = ProductTypeLiteral | 'unset';
type SortOption = { sortBy: ProductSortLiteral; direction: SortDirection };

interface ProductStoreData {
  products: Product[]
  defaultProducts: Product[]
  nameFilter: string
  typeFilter: TypeFilterLiteral
}

interface ProductStore extends Store<ProductStoreData> {
  setProducts: Event<Product[]>
  setDefaultProducts: Event<Product[]>
  setNameFilter: Event<string>
  setTypeFilter: Event<TypeFilterLiteral>
  loadProducts: Effect<SortOption, Product[]>
}

export const ProductStore: ProductStore = (() => {
  const store = createStore<ProductStoreData>({
    products: [],
    defaultProducts: [],
    nameFilter: '',
    typeFilter: 'unset'
  }) as ProductStore;

  store.setProducts = createEvent<Product[]>();
  store.on(store.setProducts, (s, p) => ({ ...s, products: p }));

  store.setNameFilter = createEvent<string>();
  store.on(store.setNameFilter, (s, p) => ({
    ...s,
    nameFilter: p,
    products: p === '' ? s.defaultProducts : s.products?.filter(product =>
      product.name.toLowerCase().includes(p.toLowerCase()))
  }));

  store.setTypeFilter = createEvent<TypeFilterLiteral>();
  store.on(store.setTypeFilter, (s, p) => ({
    ...s,
    typeFilter: p,
    products: p === 'unset' ? s.defaultProducts : s.products?.filter(product =>
      product.name.toLowerCase().includes(p.toLowerCase()))
  }));

  store.setDefaultProducts = createEvent<Product[]>();
  store.on(store.setDefaultProducts, (s, p) => ({
    ...s,
    defaultProducts: p
  }));

  store.loadProducts = createEffect<SortOption, Product[]>(async ({ sortBy = 'isPopular', direction = 'asc' }) => {
    const products = await ProductService.getAllProducts(sortBy, direction);
    store.setProducts(products);
    store.setDefaultProducts(products);
    store.setTypeFilter(store.getState().typeFilter);
    store.setNameFilter(store.getState().nameFilter);

    return products;
  });

  store.watch(store.setProducts, (s, p) => console.log('sp', s, p));
  store.watch(store.setNameFilter, (s, p) => console.log('sp', s, p));

  return store;
})();