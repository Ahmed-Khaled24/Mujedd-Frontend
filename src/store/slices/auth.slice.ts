import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ReceivedUser } from '../../types/user';

type StoredCredentials = {
    token: string;
    user: Readonly<Partial<ReceivedUser>>;
    isAuthenticated?: boolean;
};

const initialState: StoredCredentials = {
    token: '',
    isAuthenticated: false,
    user: {},
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<StoredCredentials>) {
            const { user, token } = action.payload;
            state.token = token;
            state.user = user;
            state.isAuthenticated = true;
            window.localStorage.setItem('token', token);
            window.localStorage.setItem('user', JSON.stringify(user));
        },
        clearCredentials(state) {
            state.token = '';
            state.user = {};
            state.isAuthenticated = false;
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('user');
        },
        changeUserPlan(state, action: PayloadAction<'free' | 'pro'>) {
            const planMap = {
                free: 1,
                pro: 2,
            };
            state.user.SubscriptionsPlan = planMap[action.payload];
            window.localStorage.setItem('user', JSON.stringify(state.user));
        },
    },
});

export const authReducer = authSlice.reducer;
export const { setCredentials, clearCredentials, changeUserPlan } =
    authSlice.actions;
