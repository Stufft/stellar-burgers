import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';

export const AppHeader: FC = () => {
  const { user } = useSelector((state: RootState) => state.user);

  return <AppHeaderUI userName={user?.name || ''} />;
};
