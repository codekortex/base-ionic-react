import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';

export const selectUserState = (state: RootState) => state.users;

export const selectAllUsers = createSelector(
  selectUserState,
  (userState) => userState.users
);

export const selectUsersLoading = createSelector(
  selectUserState,
  (userState) => userState.loading
);

export const selectUsersError = createSelector(
  selectUserState,
  (userState) => userState.error
);
