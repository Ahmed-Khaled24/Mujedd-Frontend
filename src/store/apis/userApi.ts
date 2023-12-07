import { appApi } from './appApi';
import { User } from '../../types/user';

const userApi = appApi.injectEndpoints({
    endpoints: (builder) => ({
        fetchUser: builder.query<Response, number>({
            providesTags: (_result, _error, userId) => [
                { type: 'user', id: userId },
            ],
            query: (userId) => {
                return {
                    url: '/users',
                    method: 'GET',
                    params: {
                        userId,
                    },
                };
            },
        }),

        updateUser: builder.mutation<Response, Partial<User>>({
            invalidatesTags: (_result, _error, user) => {
                return [{ type: 'user', id: user.id }];
            },
            query: (user) => {
                return {
                    method: 'PATCH',
                    url: '/users',
                    body: user,
                    params: {
                        userId: user.id,
                    },
                };
            },
        }),
    }),
});

export const { useFetchUserQuery, useUpdateUserMutation } = userApi;
