import { rootReducer } from '../store';
import { initialState as constructorInitialState } from './constructorSlice';
import { initialState as feedInitialState } from './feedSlice';
import { initialState as ingredientsInitialState } from './ingredientsSlice';
import { initialState as orderInitialState } from './orderSlice';
import { initialState as userOrdersInitialState } from './userOrdersSlice';
import { initialState as userInitialState } from './userSlice';

describe('rootReducer', () => {
  it('initializes the store with all slice initial states', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: ingredientsInitialState,
      burgerConstructor: constructorInitialState,
      user: userInitialState,
      order: orderInitialState,
      feed: feedInitialState,
      userOrders: userOrdersInitialState
    });
  });
});
