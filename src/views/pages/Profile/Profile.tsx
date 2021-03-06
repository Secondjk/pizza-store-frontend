import React, { FormEvent, useEffect, useState } from 'react';
import { City, User } from 'api/models/User';
import { mapStringToCity, UserStore } from 'stores/UserStore';
import { CheckCircleIcon } from '@heroicons/react/outline';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { Spinner } from 'components';
import { c } from 'utils/classNames';
import { useStore } from 'effector-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const Profile: React.FC = () => {
  const [userData, setUserData] = useState<User>({} as User);
  const [successfulSave, setSuccessfulSaveState] = useState<boolean>(false);
  const [allowSave, setAllowSave] = useState<boolean>(false);
  const changeValue = (key: keyof User, value: User[keyof User]) => {
    setAllowSave(true);
    setUserData({ ...userData, [key]: value });
  };

  const userStore = useStore(UserStore);

  const { promiseInProgress } = usePromiseTracker({ area: 'profile', delay: 200 });

  useEffect(() => {
    (async () => {
      const user = userStore.user
        ?? await UserStore.loadUser({});

      setUserData(user);
    })();
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    const updatedUser = await trackPromise(UserStore.updateUser(userData), 'profile');
    setUserData(updatedUser);
    setSuccessfulSaveState(true);
  };

  return (
    userData &&
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Информация о пользователе</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="mt-10 sm:mt-0">
                <div className="lg:grid lg:grid-cols-3 lg:gap-6 lg:grid-rows-1 lg:auto-rows-min">
                  <div className="mt-5 md:mt-0 md:col-span-2 md:row-col-1">
                    <form onSubmit={handleSave}>
                      <div className="shadow overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 bg-white sm:p-6">
                          <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
                              <label htmlFor="first_name"
                                     className="block text-sm font-medium text-gray-700">
                                Имя
                              </label>
                              <input type="text"
                                     name="first_name"
                                     id="first_name"
                                     value={userData.firstName ?? ''}
                                     onChange={e => changeValue('firstName', e.target.value)}
                                     autoComplete="given-name"
                                     className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                              <label htmlFor="last_name"
                                     className="block text-sm font-medium text-gray-700">
                                Фамилия
                              </label>
                              <input type="text"
                                     name="last_name"
                                     id="last_name"
                                     value={userData.lastName ?? ''}
                                     onChange={e => changeValue('lastName', e.target.value)}
                                     autoComplete="family-name"
                                     className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                            <div className="col-span-6 sm:col-span-4">
                              <label htmlFor="email_address"
                                     className="block text-sm font-medium text-gray-700">
                                E-mail
                              </label>
                              <input type="text"
                                     name="email_address"
                                     id="email_address"
                                     value={userData.email ?? ''}
                                     onChange={e => changeValue('email', e.target.value)}
                                     autoComplete="email"
                                     className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                            <div className="col-span-3">
                              <label htmlFor="country"
                                     className="block text-sm font-medium text-gray-700">
                                Город
                              </label>
                              <select id="country"
                                      name="country"
                                      value={mapStringToCity[userData.city as City] ?? 'MOSCOW'}
                                      onChange={e => changeValue('city', mapStringToCity[e.target.value])}
                                      autoComplete="country"
                                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option>Москва</option>
                                <option>Санкт-Петербург</option>
                                <option>Краснодар</option>
                              </select>
                            </div>
                            <div className="col-span-3">
                              <label htmlFor="phone_number"
                                     className="block text-sm font-medium text-gray-700 mb-1">
                                Номер телефона
                              </label>
                              <input type="tel"
                                     name="phone_number"
                                     id="phone_number"
                                     value={userData.tel ?? ''}
                                     onChange={e => changeValue('tel', e.target.value)}
                                     pattern="^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$"
                                     className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                     placeholder="+7 (900) 123-45-67" />
                            </div>
                            <div className="col-span-6">
                              <label htmlFor="street_address"
                                     className="block text-sm font-medium text-gray-700">
                                Стандартный адрес доставки
                              </label>
                              <input type="text"
                                     name="street_address"
                                     id="street_address"
                                     value={userData.deliveryAddress ?? ''}
                                     onChange={e => changeValue('deliveryAddress', e.target.value)}
                                     autoComplete="street-address"
                                     className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                            <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                              <label htmlFor="city"
                                     className="block text-sm font-medium text-gray-700">
                                Подъезд
                              </label>
                              <input type="text"
                                     name="city"
                                     id="city"
                                     value={userData.entrance ?? ''}
                                     onChange={e => changeValue('entrance', e.target.value)}
                                     className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                              <label htmlFor="state"
                                     className="block text-sm font-medium text-gray-700">
                                Этаж
                              </label>
                              <input type="text"
                                     name="state"
                                     id="state"
                                     value={userData.floor ?? ''}
                                     onChange={e => changeValue('floor', e.target.value)}
                                     className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                              <label htmlFor="postal_code"
                                     className="block text-sm font-medium text-gray-700">
                                Домофон
                              </label>
                              <input type="text"
                                     name="postal_code"
                                     id="postal_code"
                                     value={userData.intercom ?? ''}
                                     onChange={e => changeValue('intercom', e.target.value)}
                                     autoComplete="postal-code"
                                     className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                          </div>
                        </div>
                        <div className="inline-flex align-middle justify-end px-4 py-3 w-full bg-gray-50 text-right sm:px-6">
                          { successfulSave && <span className="inline-flex items-center px-4 py-0.5 mr-5 rounded-md bg-green-100 text-green-800">
                            <CheckCircleIcon className="h-5 w-5 text-green-400" />
                            <span className="ml-3">Обновление данных профиля прошло успешно</span>
                          </span> }
                          <button type="submit"
                                  disabled={!allowSave}
                                  className={c('inline-flex disabled:opacity-20 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                                    promiseInProgress ? 'bg-indigo-300 hover:bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700',
                                    !allowSave && 'cursor-default')}>
                            { promiseInProgress && <Spinner className="h-5 w-5 mr-3 text-indigo-400" /> }
                            Сохранить
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="md:mt-5 lg:mt-0 md:col-span-1 shadow lg:overflow-y-auto rounded-md bg-white sm:p-6 md:row-span-1">
                    <h1 className="text-lg font-semibold pb-3">Последние покупки</h1>
                    <div className="bg-white pr-4 sm:pr-6 overflow-y-auto lg:pr-8 lg:flex-shrink-0 xl:pr-0">
                      <div className="lg:w-80">
                        <div>
                          <ul className="divide-y divide-gray-200 overflow-y-auto">
                            { userStore.orders?.map(order => <li key={order.id} className="py-4">
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-sm font-medium">Заказ #{ order.id }</h3>
                                  <p className="text-sm text-gray-500">
                                    { format(order.date, 'dd MMMM yyyy', { locale: ru }) }
                                  </p>
                                </div>
                                <p className="text-sm text-gray-500">
                                  Сумма: { order.totalPrice } рублей
                                </p>
                              </div>
                            </li>) ?? <div>История пуста</div> }
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
};