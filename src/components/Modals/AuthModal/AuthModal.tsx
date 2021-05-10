import React, { FormEvent, useRef, useState } from 'react';
import { ModalFC } from 'stores/ModalStore';
import { LogoIcon } from 'assets/icons';
import { c } from 'utils/classNames';
import { Dialog } from '@headlessui/react';
import { AuthService } from 'api/services/AuthService';
import { routes } from 'router';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { Spinner } from 'components/common';
import { LockClosedIcon } from '@heroicons/react/solid';

export const AuthModal: ModalFC = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  const [isRegistration, setRegistrationState] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');

  const usernameRef = useRef<HTMLInputElement>(null);

  const [successfulLogin, setSuccessfulLoginState] = useState<boolean>(false);
  const [unsuccessfulLogin, setUnsuccessfulLoginState] = useState<boolean>(false);

  const { promiseInProgress: isLoading } = usePromiseTracker({ area: 'login' });

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (username && password && !isRegistration) {
      const accessData = await trackPromise(AuthService.login(username, password), 'login');

      if (!accessData.token) {
        setUnsuccessfulLoginState(true);
        return;
      }

      setSuccessfulLoginState(true);

      return setTimeout(routes.home().push, 600);
    }

    if (username && password && email && firstName && lastName && isRegistration) {
      const response = await trackPromise(AuthService.register({
        username,
        password,
        email,
        firstName,
        lastName
      }));

      if (!response.successful) {
        setUnsuccessfulLoginState(true);
        return;
      }

      setSuccessfulLoginState(true);

      return setTimeout(routes.home().push, 600);
    }
  };

  return (
    <Dialog as="div"
            open={isOpen}
            onClose={onClose}
            className="fixed inset-0 overflow-y-auto">
      <Dialog.Overlay className="fixed inset-0 bg-gray-200 opacity-50" />
      <div className="flex items-center justify-center min-h-screen">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md align-middle z-0">
          <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
            <div>
              <img className="mx-auto h-12 w-auto"
                   src={LogoIcon}
                   alt="Pizzeria" />
            </div>
            <form className="mt-8 space-y-6"
                  onSubmit={handleLogin}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <input id="username"
                         name="username"
                         type="text"
                         autoComplete="nickname"
                         required
                         value={username}
                         onChange={e => setUsername(e.target.value)}
                         ref={usernameRef}
                         className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                         placeholder="Имя пользователя" />
                </div>
                <div>
                  <input id="password"
                         name="password"
                         type="password"
                         autoComplete="current-password"
                         required
                         value={password}
                         onChange={e => setPassword(e.target.value)}
                         className={c(!isRegistration && 'rounded-b-md',
                           'appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm')}
                         placeholder="Пароль" />
                </div>
                { isRegistration && <>
                  <div>
                    <input id="email-address"
                           name="email"
                           type="email"
                           autoComplete="email"
                           value={email}
                           onChange={e => setEmail(e.target.value)}
                           required
                           className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                           placeholder="E-mail адрес" />
                  </div>
                  <div>
                    <input id="firstName"
                           name="firstName"
                           type="text"
                           autoComplete="name"
                           required
                           value={firstName}
                           onChange={e => setFirstName(e.target.value)}
                           className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                           placeholder="Имя" />
                  </div>
                  <div>
                    <input id="lastName"
                           name="lastName"
                           type="text"
                           autoComplete="family-name"
                           required
                           value={lastName}
                           onChange={e => setLastName(e.target.value)}
                           className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                           placeholder="Фамилия" />
                  </div>
                </> }
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember_me"
                         name="remember_me"
                         type="checkbox"
                         disabled={isRegistration}
                         checked={rememberMe || isRegistration}
                         onChange={e => setRememberMe(e.target.checked)}
                         className={c(isRegistration
                           ? 'text-indigo-200 border-gray-100'
                           : 'text-indigo-600 border-gray-300', 'h-4 w-4 focus:ring-indigo-500 rounded')} />
                  <label htmlFor="remember_me" className={c(isRegistration
                    ? 'text-gray-400'
                    : 'text-gray-900', 'ml-2 block text-sm')}>
                    Запомнить меня
                  </label>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                       onClick={() => setRegistrationState(!isRegistration)}>
                    { isRegistration ? 'Авторизоваться' : 'Зарегистрироваться' }
                  </div>
                </div>
              </div>
              <div>
                <button type="submit"
                        disabled={isLoading}
                        className={c('group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                          isLoading && 'cursor-not-allowed',
                          unsuccessfulLogin ? 'bg-red-600 hover:bg-red-700'
                            : successfulLogin ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700')}>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    { isLoading
                      ? <Spinner className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                      : <LockClosedIcon className={c(unsuccessfulLogin
                        ? 'group-hover:text-red-400 text-red-500' :
                        successfulLogin ? 'group-hover:text-green-400 text-green-500' : 'group-hover:text-indigo-400 text-indigo-500',
                      'h-5 w-5')} aria-hidden="true" /> }
                  </span>
                  { isRegistration
                    ? unsuccessfulLogin
                      ? 'Неуспешная регистрация'
                      : successfulLogin
                        ? 'Успешная регистрация' : 'Зарегистрироваться'
                    : unsuccessfulLogin
                      ? 'Неуспешный вход' :
                      successfulLogin
                        ? 'Успешный вход' : 'Войти' }
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Dialog>
  );
};