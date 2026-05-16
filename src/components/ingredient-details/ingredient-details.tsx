import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { IngredientDetailsUI } from '@ui';
import { Preloader } from '@ui';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  const { ingredients } = useSelector((state: RootState) => state.ingredients);

  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
