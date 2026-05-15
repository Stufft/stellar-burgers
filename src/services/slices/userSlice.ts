import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TRegisterData,
  TLoginData
} from '../../utils/burger-api';

// Регистрация
export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    return res.user;
  }
);

// Логин
export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);
    return res.user;
  }
);

// Проверка пользователя (нужна при обновлении страницы)
export const checkUserAuth = createAsyncThunk('user/checkAuth', async () => {
  const res = await getUserApi();
  return res.user;
});

// Обновление данных в профиле
export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

// Выход из аккаунта
export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
});

interface UserState {
  user: TUser | null;
  isAuthChecked: boolean; // Флаг: проверили ли мы токен
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Обработка проверки авторизации
      .addCase(checkUserAuth.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true; // Проверка прошла, но юзер не найден (например, нет токена)
      })
      // Обработка логина
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка входа';
      })
      // Обработка регистрации
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      // Обработка обновления юзера
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload; // Записываем новые данные
      })
      // Обработка выхода
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null; // Очищаем юзера при выходе
      });
  }
});

export default userSlice.reducer;
