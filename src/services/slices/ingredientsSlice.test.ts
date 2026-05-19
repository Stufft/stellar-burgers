import ingredientsReducer from './ingredientsSlice';
import { fetchIngredients } from './ingredientsSlice';

describe('Тестирование асинхронных экшенов ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  it('должен менять состояние загрузки при отправке запроса (pending)', () => {
    const action = { type: fetchIngredients.pending.type };
    const nextState = ingredientsReducer(initialState, action);

    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('должен сохранять данные и выключать загрузку при успехе (fulfilled)', () => {
    const mockData = [{ _id: '1', name: 'Булка', type: 'bun', price: 100 }];

    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockData
    };

    const nextState = ingredientsReducer(
      { ...initialState, loading: true },
      action
    );

    expect(nextState.loading).toBe(false);
    expect(nextState.ingredients).toEqual(mockData);
  });

  it('должен сохранять ошибку и выключать загрузку при провале (rejected)', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка сервера 500' }
    };

    const nextState = ingredientsReducer(
      { ...initialState, loading: true },
      action
    );

    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe('Ошибка сервера 500');
  });
});
