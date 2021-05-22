import React from 'react';
import { useRoute } from 'router';
import { Order, OrderFinished, Products, Profile } from 'views/pages';

export const Main: React.FC = () => {
  const { name } = useRoute();

  return (
    <>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        { name === 'home' && <Products /> }
        { name === 'all' && <Products /> }
        { name === 'profile' && <Profile /> }
        { name === 'order' && <Order /> }
        { name === 'orderFinished' && <OrderFinished /> }
      </div>
    </>
  );
};