import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { routes } from 'router';

export const OrderFinished: React.FC = () => {
  setTimeout(() => routes.all().push(), 2000);

  return (
    <div className="inline-flex items-center justify-center w-full h-full">
      <CheckCircleIcon className="w-24 h-24 text-green-500" />
      <span className="text-2xl ml-4">Спасибо за покупку!</span>
    </div>
  );
};