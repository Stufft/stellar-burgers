import { rootReducer } from '../store';

describe('rootReducer', () => {
  it('initializes the store with all slice initial states', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: {
        ingredients: [],
        loading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      user: {
        user: null,
        isAuthChecked: false,
        error: null
      },
      order: {
        orderData: null,
        orderRequest: false,
        orderError: null,
        orderByNumber: null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null
      },
      userOrders: {
        orders: [],
        loading: false,
        error: null
      }
    });
  });
});
