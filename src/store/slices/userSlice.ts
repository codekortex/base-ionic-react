import { IUserRepository } from "../../domain/contracts/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { UserState } from "../states/userState";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState: UserState = {
    users: [],
    loading: false,
    error: null,
};

const userRepository: IUserRepository = new UserRepository();

export const fetchUsers = createAsyncThunk(
    "users/fetchUsers",
    async () => {
        return await userRepository.getAllUsers();
    }
);

export const addUser = createAsyncThunk(
    "users/addUser",
    async (user: User) => {
        return await userRepository.addUser(user);
    }
);

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async (user: User) => {
        await userRepository.updateUser(user);
        return user;
    }
);

export const deleteUser = createAsyncThunk(
    "users/deleteUser",
    async (id: number) => {
        await userRepository.deleteUser(id);
        return id;
    }
);

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Error fetching users";
            })

            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Error adding user";
            })

            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.users.findIndex((u) => u.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Error updating user";
            })

            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter((u) => u.id !== action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Error deleting user";
            });
    },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;