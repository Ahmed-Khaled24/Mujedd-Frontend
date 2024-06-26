import { appApi } from '.';
import { GenericResponse } from '../../types/response';

export const tagsApi = appApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllTags: builder.query<GenericResponse<string[]>, void>({
            query: () => ({
                url: `/tags?limit=1000&offset=0`,
                method: 'GET',
            }),
        }),
        getSuggestedTags: builder.query<GenericResponse<string[]>, number>({
            query: (limit: number) => ({
                url: '/tags/suggested',
                method: 'GET',
                params: { limit },
            }),
        }),
    }),
});

export const { useGetAllTagsQuery, useGetSuggestedTagsQuery } = tagsApi;
