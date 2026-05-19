import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient
} from './constructorSlice';

const mockBun = {
  _id: '1',
  name: 'Булка',
  type: 'bun',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 10,
  price: 10,
  image: '',
  image_mobile: '',
  image_large: '',
  id: 'bun-1'
};

const mockSauce = {
  _id: '2',
  name: 'Соус',
  type: 'sauce',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 10,
  price: 10,
  image: '',
  image_mobile: '',
  image_large: '',
  id: 'sauce-1'
};

describe('Тестирование constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  it('должен обрабатывать addIngredient для булки', () => {
    const nextState = constructorReducer(initialState, addIngredient(mockBun));
    // Говорим Jest: "Ожидаем объект mockBun, но поле id может быть ЛЮБОЙ строкой"
    expect(nextState.bun).toEqual({ ...mockBun, id: expect.any(String) });
    expect(nextState.ingredients).toHaveLength(0);
  });

  it('должен обрабатывать addIngredient для начинки', () => {
    const nextState = constructorReducer(
      initialState,
      addIngredient(mockSauce)
    );
    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0]).toEqual({
      ...mockSauce,
      id: expect.any(String)
    });
  });

  it('должен обрабатывать removeIngredient', () => {
    const stateWithIngredient = { bun: null, ingredients: [mockSauce] };
    const nextState = constructorReducer(
      stateWithIngredient,
      removeIngredient('sauce-1')
    );
    expect(nextState.ingredients).toHaveLength(0);
  });

  it('должен обрабатывать moveIngredient (изменение порядка)', () => {
    const mockMeat = { ...mockSauce, id: 'meat-1', name: 'Мясо' };
    const stateWithIngredients = {
      bun: null,
      ingredients: [mockSauce, mockMeat]
    };

    const nextState = constructorReducer(
      stateWithIngredients,
      moveIngredient({ index: 0, step: 1 })
    );

    expect(nextState.ingredients[0].name).toBe('Мясо');
    expect(nextState.ingredients[1].name).toBe('Соус');
  });
});
