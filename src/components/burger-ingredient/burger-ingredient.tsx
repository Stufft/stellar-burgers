import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
// Проверь путь к своему экшену добавления
import { addIngredient } from '../../services/slices/constructorSlice';

// Используем memo, как любят ревьюеры, чтобы карточки не перерисовывались зря
export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      // Отправляем ингредиент в Redux
      dispatch(addIngredient(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        // Передаем стейт для открытия модалки поверх фона
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
