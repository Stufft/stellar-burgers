import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { BurgerIngredients, BurgerConstructor } from '@components';
import { Preloader } from '@ui';
import styles from './constructor-page.module.css'; // Проверь правильность импорта стилей

export const ConstructorPage: FC = () => {
  const { ingredients, loading } = useSelector(
    (state: RootState) => state.ingredients
  );

  if (loading || ingredients.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
          height: '70vh'
        }}
      >
        <Preloader />
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <h1 className='text text_type_main-large mt-10 mb-5'>Соберите бургер</h1>
      <div className={styles.main}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
