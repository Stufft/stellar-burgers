import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type'; // проверь путь к типам
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../services/store';
import {
  removeIngredient,
  moveIngredient
} from '../../services/slices/constructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleClose = () => {
      dispatch(removeIngredient(ingredient.id));
    };

    const handleMoveUp = () => {
      dispatch(moveIngredient({ index, step: -1 }));
    };

    const handleMoveDown = () => {
      dispatch(moveIngredient({ index, step: 1 }));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
