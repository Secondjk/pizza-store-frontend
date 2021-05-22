import React, { useEffect, useState } from 'react';
import { MinusIcon, PlusIcon, XIcon } from '@heroicons/react/solid';
import { Product } from 'api/models/Product';
import { ProductStore } from 'stores/ProductStore';
import { ProductTypeLiteral } from 'api/models/ProductType';
import { useStore } from 'effector-react';
import { CartStore } from 'stores/CartStore';

export type CounterWithId = { id: number; count: number };

export const Products: React.FC = () => {
  const [productsCounts, setProductsCounts] = useState<CounterWithId[]>([]);
  const getCountById = (id: number) => productsCounts.find(o => o.id === id)?.count;
  const doCount = (id: number, plus = true) => setProductsCounts(
    s => {
      const index = s.findIndex(o => o.id === id);

      const newProducts = s.slice();
      productsCounts[index].count = plus
        ? productsCounts[index].count + 1
        : Math.max(productsCounts[index].count - 1, 1);

      return newProducts;
    }
  );

  const productStore = useStore(ProductStore);

  const mapTypeToProducts: { [key in ProductTypeLiteral]: Product[] } = {
    PIZZA: productStore.products.filter(({ productType }) => productType.name === 'PIZZA'),
    SALADS: productStore.products.filter(({ productType }) => productType.name === 'SALADS'),
    BEVERAGES: productStore.products.filter(({ productType }) => productType.name === 'BEVERAGES')
  };

  const mapTypeToName: { [key in ProductTypeLiteral]: string } = {
    PIZZA: 'Пицца',
    SALADS: 'Салаты',
    BEVERAGES: 'Напитки'
  };

  useEffect(() => {
    (async () => {
      const products = await ProductStore.loadProducts({ sortBy: 'isPopular', direction: 'asc' });

      setProductsCounts(products.map(p => ({ id: p.id, count: 1 })));
    })();
  }, []);

  return (
    <>
      { Object.keys(mapTypeToProducts).map(k =>
        mapTypeToProducts[k as ProductTypeLiteral].length > 0 && <div key={k} className="pt-7">
          <header className="mb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold leading-tight text-gray-900">
                { mapTypeToName[k as ProductTypeLiteral] }
              </h1>
            </div>
          </header>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            { mapTypeToProducts[k as ProductTypeLiteral].map(product => (
              <li key={product.name}
                  className="col-span-1 flex flex-col bg-white rounded-lg xl:shadow-md">
                <div className="flex-1 flex flex-col p-6 pb-0">
                  <img className="w-54 h-54 flex-shrink-0 mx-auto bg-black"
                       src="https://allopizza.su/storage/products/May2021/YbpXAH7TrUEmCblscUyP-medium.jpg" alt="" />
                  <h3 className="mt-6 text-gray-900 text-md text-center font-medium">{ product.name }</h3>
                </div>
                <div>
                  <div className="flex align-middle px-4 py-4">
                    <div className="w-0 flex-1 flex justify-center flex-col">
                      <div className="flex justify-around justify-items-center mb-2 px-8">
                        <button type="button"
                                onClick={() => doCount(product.id, false)}
                                className="inline-flex justify-center items-center p-1 border border-transparent rounded-full xl:shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <MinusIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                        <div className="inline-flex items-center">
                          <span className="text-gray-400 mr-1 mb-0.5 font-semibold text-xl">{ getCountById(product.id) }</span>
                          <XIcon className="h-4 w-4 text-gray-400 mr-1 mb-0.5" />
                          <span className="text-2xl">{ product.price.toFixed(0) }</span>
                        </div>
                        <button type="button"
                                onClick={() => doCount(product.id)}
                                className="inline-flex justify-center items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <PlusIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                      <button type="button"
                              onClick={() => CartStore.editProductCount({ product, count: getCountById(product.id) ?? 1 })}
                              className="inline-flex w-full items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <span className="text-center w-full">Добавить в корзину</span>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            )) }
          </ul>
        </div>) }
    </>
  );
};