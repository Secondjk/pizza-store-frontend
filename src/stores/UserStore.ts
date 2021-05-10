import { City, User } from 'api/models/User';
import { Store, Event, createStore, createEvent, createEffect, Effect } from 'effector';
import { Auth } from 'utils/Auth';
import { UserService } from 'api/services/UserService';

interface UserStoreData {
  user?: User
  isAuthorized?: boolean
}

interface UserStore extends Store<UserStoreData> {
  setUser: Event<User>
  setAuthorized: Event<boolean>
  loadUser: Effect<never, User> // TODO: WTF PARAMS
  updateUser: Effect<User, User>
}

export const mapStringToCity: { [key: string]: City } = {
  'Москва': 'MOSCOW',
  'Санкт-Петербург': 'ST_PETERSBURG',
  'Краснодар': 'KRASNODAR'
};

export const UserStore: UserStore = (() => {
  const store = createStore<UserStoreData>({
    isAuthorized: Auth.getIsAuthorized()
  }) as UserStore;

  store.setUser = createEvent<User>();
  store.on(store.setUser, (s, p) => ({ ...s, user: p, isAuthorized: true }));

  store.setAuthorized = createEvent<boolean>();
  store.on(store.setAuthorized, (s, p) => {
    !p && Auth.removeToken();

    return {
      ...s,
      isAuthorized: p
    };
  });

  store.loadUser = createEffect<never, User>(async () => {
    const user = await UserService.getCurrentUser();
    store.setUser(user);

    return user;
  });

  store.updateUser = createEffect<User, User>(async (user: User) => {
    const updatedUser = await UserService.updateCurrentUser(user);
    store.setUser(updatedUser);

    return updatedUser;
  });

  // const route = useRoute();
  // store.watch(route);

  return store;
})();