import React, { Fragment } from 'react';
import { MenuIcon, UserIcon, XIcon } from '@heroicons/react/outline';
import { LogoIcon } from 'assets/icons';
import { Menu, Transition } from '@headlessui/react';
import { Disclosure } from '@headlessui/react';
import { SearchIcon } from '@heroicons/react/solid';
import { c } from 'utils/classNames';
import { routes, useRoute } from 'router';
import { Link } from 'type-route';
import { isPathContained } from 'utils/isPathContained';
import { setModal } from 'stores/ModalStore';
import { useStore } from 'effector-react';
import { UserStore } from 'stores/UserStore';
import { ProductStore } from 'stores/ProductStore';

export const Navbar: React.FC = () => {
  const { isAuthorized } = useStore(UserStore);
  const { params, name } = useRoute();

  const links: { title: string; href: Link; type: string }[] = [
    {
      title: 'Пицца',
      href: routes.all({
        type: 'pizza'
      }).link,
      type: 'pizza'
    },
    {
      title: 'Салаты',
      href: routes.all({
        type: 'salads'
      }).link,
      type: 'salads'
    }
  ];

  const handleLogout = () => {
    UserStore.setAuthorized(false);

    location.reload();
  };

  return (
    <Disclosure as="nav" className="bg-white shadow">
      { ({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex px-2 lg:px-0">
                <div className="flex-shrink-0 flex items-center cursor-pointer"
                     onClick={routes.home().push}>
                  <img className="block h-8 w-auto"
                       src={LogoIcon}
                       alt="Pizzeria" />
                </div>
                <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
                  { links.map(link =>
                    <a key={link.title} {...link.href}
                       className={c((params as { type: string; page?: number }).type === link.type
                         || (name === 'home' && link.type === 'pizza'
                         && (params as { type: string; page?: number }).type === undefined)
                         ? 'border-indigo-500' : 'border-transparent',
                       'text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium')}>
                      { link.title }
                    </a>
                  ) }
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
                <div className="max-w-lg w-full lg:max-w-xs">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input id="search"
                           name="search"
                           onChange={e => ProductStore.setNameFilter(e.target.value)}
                           className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                           placeholder="Поиск по имени товара"
                           type="search" />
                  </div>
                </div>
              </div>
              <div className="flex items-center lg:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  { open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  ) }
                </Disclosure.Button>
              </div>
              <div className="hidden lg:flex lg:items-center">
                <Menu as="div" className="ml-4 relative flex-shrink-0">
                  { ({ open }) => (
                    <>
                      <div>
                        <Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <UserIcon className="h-8 w-8 rounded-full text-gray-400" aria-hidden="true" />
                        </Menu.Button>
                      </div>
                      <Transition show={open}
                                  as={Fragment}
                                  enter="transition ease-out duration-100"
                                  enterFrom="transform opacity-0 scale-95"
                                  enterTo="transform opacity-100 scale-100"
                                  leave="transition ease-in duration-75"
                                  leaveFrom="transform opacity-100 scale-100"
                                  leaveTo="transform opacity-0 scale-95">
                        <Menu.Items static
                                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          { isAuthorized
                            ? <>
                              <Menu.Item>
                                { ({ active }) => (
                                  <a {...routes.profile().link}
                                     className={c(
                                       active ? 'bg-gray-100' : '',
                                       'block px-4 py-2 text-sm text-gray-700'
                                     )}>
                                    Профиль
                                  </a>
                                ) }
                              </Menu.Item>
                              <Menu.Item>
                                { ({ active }) => (
                                  <a href="#"
                                     className={c(
                                       active ? 'bg-gray-100' : '',
                                       'block px-4 py-2 text-sm text-gray-700'
                                     )}>
                                    Настройки
                                  </a>
                                ) }
                              </Menu.Item>
                              <Menu.Item>
                                { ({ active }) => (
                                  <button type="button"
                                          onClick={handleLogout}
                                          className={c(
                                            active ? 'bg-gray-100' : '',
                                            'block px-4 py-2 text-sm text-gray-700 w-full text-left'
                                          )}>
                                    Выйти
                                  </button>
                                ) }
                              </Menu.Item>
                            </>
                            : <Menu.Item>
                              { ({ active }) => (
                                <div className={c(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700 cursor-pointer'
                                )} onClick={() => setModal('AuthModal')}>
                                  Войти
                                </div>
                              ) }
                            </Menu.Item> }
                        </Menu.Items>
                      </Transition>
                    </>
                  ) }
                </Menu>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="lg:hidden">
            <div className="pt-2 pb-3 space-y-1">
              { links.map(link =>
                <a key={link.title} {...link.href}
                   className={c(isPathContained(link.href.href.slice(1))
                     ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                     : 'border-transparent',
                   'block pl-3 pr-4 py-2 border-l-4 text-base font-medium')}>
                  { link.title }
                </a>) }
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <UserIcon className="h-10 w-10 rounded-full text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">Tom Cook</div>
                  <div className="text-sm font-medium text-gray-500">tom@example.com</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <a href="#"
                   className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                  Профиль
                </a>
                <a href="#"
                   className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                  Настройки
                </a>
                <button type="button"
                        onClick={handleLogout}
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                  Выйти
                </button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      ) }
    </Disclosure>
  );
};
