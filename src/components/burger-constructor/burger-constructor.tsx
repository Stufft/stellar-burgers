import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../services/store';

import { placeOrder, clearOrderData } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // 1. Достаем данные конструктора из стора
  const { bun, ingredients } = useSelector(
    (state: RootState) => state.burgerConstructor
  );

  // 2. Достаем статус заказа и пользователя
  const { orderData, orderRequest } = useSelector(
    (state: RootState) => state.order
  );
  const { user } = useSelector((state: RootState) => state.user);

  // Формируем объект пропсов для UI-компонента
  const constructorItems = {
    bun: bun,
    ingredients: ingredients
  };

  const onOrderClick = () => {
    // Если не залогинен - кидаем на логин
    if (!user) {
      navigate('/login');
      return;
    }
    // Если нет булки или запрос уже летит - ждем
    if (!bun || orderRequest) return;

    // Собираем ID: булка, все начинки, булка
    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    dispatch(placeOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    // При закрытии модалки очищаем данные заказа и саму корзину
    dispatch(clearOrderData());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
