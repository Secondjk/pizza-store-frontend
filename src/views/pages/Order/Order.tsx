import React, { Fragment, useEffect, useState } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import { useStore } from 'effector-react';
import { CartStore } from 'stores/CartStore';
import { MinusIcon, PlusIcon } from '@heroicons/react/solid';
import { UserStore } from 'stores/UserStore';
import { routes } from 'router';
import { Auth } from 'utils/Auth';
import { UserService } from 'api/services/UserService';

export interface Address {
  deliveryAddress: string
  entrance: string
  floor: string
  intercom: string
}

export const Order: React.FC = () => {
  const userStore = useStore(UserStore);
  const [address, setAddress] = useState<'standard' | 'new'>(
    userStore.user?.deliveryAddress ? 'standard' : 'new'
  );

  const [newAddress, setNewAddress] = useState<Address>({
    deliveryAddress: '',
    entrance: '',
    floor: '',
    intercom: ''
  } as Address);
  const changeValue = (key: keyof Address, value: Address[keyof Address]) => {
    setNewAddress({ ...newAddress, [key]: value });
  };

  const cartStore = useStore(CartStore);
  const totalPrice = Object.keys(cartStore.productsById)
    .reduce((sum, k) => {
      console.log('reduce', cartStore.productsById[k]?.product.price, cartStore.productsById[k]?.count);
      return sum + (cartStore.productsById[k]?.product.price * cartStore.productsById[k]?.count);
    },
    0);

  useEffect(() => {
    (async () => {
      userStore.user ?? await UserStore.loadUser({});
    })();
  }, []);

  return (
    <div className="py-10">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Оформление заказа</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 pt-8 pb-4 sm:px-0">
            <div className="mt-10 sm:mt-0">
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <Disclosure>
                    { ({ open }) => (
                      <>
                        <div className="flex items-center justify-between">
                          <Disclosure.Button className="flex items-center justify-center px-4 py-2 font-medium text-left focus:outline-none">
                            Ваша корзина
                            { !open
                              ? <ChevronDownIcon className="h-5 w-5 ml-4" />
                              : <ChevronUpIcon className="h-5 w-5 ml-4" /> }
                          </Disclosure.Button>
                          <div>Итого: <span className="font-bold pr-4">{ totalPrice || 0 } рублей</span></div>
                        </div>
                        <Transition show={open}
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95">
                          <Disclosure.Panel static className="divide-y divide-gray-200 flex flex-col">
                            { cartStore.size > 0 ?
                              Object.keys(cartStore.productsById).map(k =>
                                <div className="flex py-2 last:mb-0 first:pt-0" key={`${cartStore.productsById[k].product.name}-${cartStore.productsById[k].count}`}>
                                  <img className="h-10 w-10 rounded-full" src="https://allopizza.su/storage/products/May2021/YbpXAH7TrUEmCblscUyP-medium.jpg" alt="" />
                                  <div className="ml-3 w-72">
                                    <p className="text-sm font-medium text-gray-900">{ cartStore.productsById[k].product.name } (x{ cartStore.productsById[k].count })</p>
                                    <p className="text-sm text-gray-500">
                                      { cartStore.productsById[k].product.price * cartStore.productsById[k].count } руб.</p>
                                  </div>
                                  <span className="relative z-0 inline-flex shadow-sm h-8 self-center rounded-md ml-auto">
                                    <button type="button"
                                            disabled={cartStore.productsById[k].count === 1}
                                            onClick={() => CartStore.editProductCount({
                                              product: cartStore.productsById[k].product,
                                              count: -1
                                            })}
                                            className="relative inline-flex items-center px-1 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-20">
                                      <MinusIcon className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                    <button type="button"
                                            onClick={() => CartStore.editProductCount({
                                              product: cartStore.productsById[k].product,
                                              count: 1
                                            })}
                                            className="-ml-px relative inline-flex items-center px-1 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                                      <PlusIcon className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                  </span>
                                </div>)
                              : <div className="p-2 w-72">Корзина пуста</div> }
                          </Disclosure.Panel>
                        </Transition>
                      </>
                    ) }
                  </Disclosure>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={async e => {
          e.preventDefault();
          UserService.order({ totalPrice });
          await UserStore.loadUser({});
          CartStore.clearCart({});
          routes.orderFinished().push(); }}>
          <div className="grid grid-cols-5">
            <div className="w-full sm:px-6 lg:px-8 col-span-3">
              <div className="px-4 sm:px-0">
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <h3 className="text-2xl text-center font-bold leading-tight text-gray-900">Контактная информация</h3>
                    <div className="flex flex-col">
                      <fieldset className="mt-6 bg-white">
                        <legend className="block text-sm font-medium text-gray-700">Адрес доставки</legend>
                        <div className="mt-1 rounded-md shadow-sm">
                          <div>
                            <select id="address"
                                    value={address}
                                    onChange={e => setAddress(e.target.value as 'standard' | 'new')}
                                    name="address"
                                    className="focus:ring-indigo-500 focus:border-indigo-500 relative block w-full rounded-none rounded-t-md bg-transparent focus:z-10 sm:text-sm border-gray-300">
                              <option value="standard" disabled={!Auth.getIsAuthorized()}>Стандартный адрес доставки</option>
                              <option value="new">Новый адрес</option>
                            </select>
                          </div>
                          <div>
                            <input type="text"
                                   required
                                   disabled={address === 'standard'}
                                   onChange={e => changeValue('deliveryAddress', e.target.value)}
                                   value={address === 'standard' ? userStore.user?.deliveryAddress ?? '' : newAddress.deliveryAddress}
                                   className="focus:ring-indigo-500 disabled:bg-gray-100 focus:border-indigo-500 relative block w-full rounded-none rounded-b-md bg-transparent focus:z-10 sm:text-sm border-gray-300"
                                   placeholder="Адрес доставки" />
                          </div>
                          <div className="grid grid-cols-3 gap-8 mt-3">
                            <div className="col-span-1">
                              <label htmlFor="city"
                                     className="block text-sm font-medium text-gray-700">
                                Подъезд
                              </label>
                              <input type="text"
                                     disabled={address === 'standard'}
                                     onChange={e => changeValue('entrance', e.target.value)}
                                     value={address === 'standard' ? userStore.user?.entrance ?? '' : newAddress.entrance}
                                     name="city"
                                     id="city"
                                     className="mt-1 disabled:bg-gray-100 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                            <div className="col-span-1">
                              <label htmlFor="state"
                                     className="block text-sm font-medium text-gray-700">
                                Этаж
                              </label>
                              <input type="text"
                                     disabled={address === 'standard'}
                                     onChange={e => changeValue('floor', e.target.value)}
                                     value={address === 'standard' ? userStore.user?.floor ?? '' : newAddress.floor}
                                     name="state"
                                     id="state"
                                     className="mt-1 disabled:bg-gray-100 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                            <div className="col-span-1">
                              <label htmlFor="postal_code"
                                     className="block text-sm font-medium text-gray-700">
                                Домофон
                              </label>
                              <input type="text"
                                     disabled={address === 'standard'}
                                     onChange={e => changeValue('intercom', e.target.value)}
                                     value={address === 'standard' ? userStore.user?.intercom ?? '' : newAddress.intercom}
                                     name="postal_code"
                                     id="postal_code"
                                     autoComplete="postal-code"
                                     className="mt-1 disabled:bg-gray-100 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full sm:px-6 lg:px-8 col-span-2">
              <div className="px-4 sm:px-0 h-full">
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white sm:p-6 h-full">
                    <h3 className="text-2xl text-center font-bold leading-tight text-gray-900 mb-3">Оплата</h3>
                    <div className="flex flex-col">
                      <fieldset>
                        <legend className="block text-sm font-medium text-gray-700">Данные карты</legend>
                        <div className="mt-1 bg-white rounded-md shadow-sm">
                          <div>
                            <input type="text"
                                   required
                                   name="card-number"
                                   id="card-number"
                                   className="focus:ring-indigo-500 focus:border-indigo-500 relative block w-full rounded-none rounded-t-md bg-transparent focus:z-10 sm:text-sm border-gray-300"
                                   placeholder="Номер карты" />
                          </div>
                          <div className="flex -space-x-px">
                            <div className="w-1/2 flex-1 min-w-0">
                              <input type="text"
                                     required
                                     name="card-expiration-date"
                                     id="card-expiration-date"
                                     className="focus:ring-indigo-500 focus:border-indigo-500 relative block w-full rounded-none rounded-bl-md bg-transparent focus:z-10 sm:text-sm border-gray-300"
                                     placeholder="ММ / ГГ" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <input type="text"
                                     required
                                     name="card-cvc"
                                     id="card-cvc"
                                     className="focus:ring-indigo-500 focus:border-indigo-500 relative block w-full rounded-none rounded-br-md bg-transparent focus:z-10 sm:text-sm border-gray-300"
                                     placeholder="CVC" />
                            </div>
                          </div>
                        </div>
                      </fieldset>
                      <button type="submit"
                              disabled={totalPrice === 0}
                              className="flex mt-6 items-center justify-center  self-end w-full px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Оплатить заказ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
