import { IUserRepository } from '../../domain/contracts/IUserRepository';
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { UserState } from '../states/userState';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

const initialState: UserState = {
    users: [],
    loading: false,
    error: null
};

const userRepository: IUserRepository = new UserRepository();

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await userRepository.getAllUsers();
    return response;
});

export const addUser = createAsyncThunk('users/addUser', async (user: User) => {
    await userRepository.addUser(user);
    return user;
});

export const updateUser = createAsyncThunk('users/updateUser', async (user: User) => {
    await userRepository.updateUser(user);
    return user;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id: number) => {
    await userRepository.deleteUser(id);
    return id;
});

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(fetchUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
            state.users = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Error al cargar usuarios';
        });


        builder.addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
            state.users.push(action.payload);
        });
        builder.addCase(addUser.rejected, (state, action) => {
            state.error = action.error.message || 'Error al agregar usuario';
        });


        builder.addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
            const index = state.users.findIndex(user => user.id === action.payload.id);
            if (index !== -1) {
                state.users[index] = action.payload;
            }
        });
        builder.addCase(updateUser.rejected, (state, action) => {
            state.error = action.error.message || 'Error al actualizar usuario';
        });


        builder.addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
            state.users = state.users.filter(user => user.id !== action.payload);
        });
        builder.addCase(deleteUser.rejected, (state, action) => {
            state.error = action.error.message || 'Error al eliminar usuario';
        });
    },
});

export default userSlice.reducer;