import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoginUI } from '@ui-pages';
import { AppDispatch, RootState } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';

export const Login: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const error = useSelector((state: RootState) => state.user.error);

  // Локальный стейт для полей формы
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
