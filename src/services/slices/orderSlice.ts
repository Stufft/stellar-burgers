import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi } from '../../utils/burger-api';
import { getOrderByNumberApi } from '../../utils/burger-api';

export const getOrderByNumber = createAsyncThunk<TOrder, number>(
  'order/getOrderByNumber',
  async (number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  }
);

export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (ingredientIds: string[]) => {
    const response = await orderBurgerApi(ingredientIds);
    return {
      ...response.order,
      ingredients: ingredientIds
    };
  }
);

interface OrderState {
  orderData: TOrder | null;
  orderRequest: boolean;
  orderError: string | null;
  orderByNumber: TOrder | null;
}

const initialState: OrderState = {
  orderData: null,
  orderRequest: false,
  orderError: null,
  orderByNumber: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderData: (state) => {
      state.orderData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderData = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error.message || 'Ошибка при создании заказа';
      });
    builder.addCase(getOrderByNumber.fulfilled, (state, action) => {
      state.orderByNumber = action.payload;
    });
  }
});

export const { clearOrderData } = orderSlice.actions;
export default orderSlice.reducer;
