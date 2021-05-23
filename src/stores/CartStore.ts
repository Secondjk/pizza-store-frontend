import { Product } from 'api/models/Product';
import { Store, Event, createStore, createEvent } from 'effector';

export type ProductWithCount = { product: Product; count: number };

interface CartStoreData {
  productsById: { [key: string]: ProductWithCount }
  size: number
}

interface CartStore extends Store<CartStoreData> {
  editProductCount: Event<ProductWithCount>
  deleteProduct: Event<number>
  clearCart: Event<unknown>
}

export const CartStore: CartStore = (() => {
  const store = createStore<CartStoreData>({
    productsById: {},
    size: 0
  }) as CartStore;

  store.editProductCount = createEvent<ProductWithCount>();
  store.on(store.editProductCount, (s, p) => ({
    ...s,
    productsById: {
      ...s.productsById,
      [p.product.id]: {
        product: p.product,
        count: (s.productsById?.[p.product.id]?.count ?? 0) + p.count
      }
    },
    size: s.size + p.count
  }));

  store.deleteProduct = createEvent<number>();
  store.on(store.deleteProduct, (s, p) => {
    const countOfDeletedProduct = s.productsById[p].count;

    delete s.productsById[p];
    return {
      ...s,
      size: s.size - countOfDeletedProduct
    };
  });

  store.clearCart = createEvent<unknown>();
  store.on(store.clearCart, s => ({
    ...s,
    productsById: {},
    size: 0
  }));

  store.watch(store.editProductCount, s =>
    Object.keys(s.productsById)
      .filter(sp => s.productsById[sp].count === 0)
      .forEach(dp => store.deleteProduct(s.productsById[dp].product.id))
  );

  return store;
})();