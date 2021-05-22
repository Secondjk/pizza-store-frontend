import { createRouter, defineRoute, param } from 'type-route';
import { ModalStore } from 'stores';

const order = defineRoute('/order');

export const { RouteProvider, useRoute, routes, session } = createRouter({
  home: defineRoute('/'),
  all: defineRoute({
    type: param.query.optional.string,
    page: param.query.optional.number
  },
  () => '/all'
  ),
  profile: defineRoute('/user'),
  order,
  orderFinished: order.extend('/finished')
});

session.listen(() => ModalStore.setModal('unset'));