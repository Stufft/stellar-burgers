import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '@ui';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();

  const { ingredients } = useSelector((state: RootState) => state.ingredients);

  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    const orderIngredients = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) {
          acc.push(ingredient);
        }
        return acc;
      },
      []
    );

    if (orderIngredients.length === 0) return null;

    const total = orderIngredients.reduce((acc, item) => acc + item.price, 0);

    return {
      ...order,
      ingredientsInfo: orderIngredients,
      ingredientsToShow: orderIngredients.slice(0, 6),
      remains: orderIngredients.length > 6 ? orderIngredients.length - 6 : 0,
      date: new Date(order.createdAt),
      total
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={6}
      locationState={{ background: location }}
    />
  );
});
