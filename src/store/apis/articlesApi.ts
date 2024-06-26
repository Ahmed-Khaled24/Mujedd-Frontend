import _ from 'lodash';

import { appApi } from '.';
import { ArticleToSend, ReceivedArticle } from '../../types/article.d';
import { PaginatedResult } from '../../types/pagination';
import { GenericResponse, Response } from '../../types/response';

type LikeCommentPayload = {
    articleID: number;
    commentID: number;
};

const articleApi = appApi.injectEndpoints({
    endpoints: (builder) => ({
        createArticle: builder.mutation<
            GenericResponse<ReceivedArticle>,
            ArticleToSend
        >({
            invalidatesTags: ['Article'],
            query: (article) => ({
                url: '/articles',
                method: 'POST',
                body: article,
            }),
        }),
        getArticles: builder.query<
            GenericResponse<ReceivedArticle[]>,
            { limit?: number; offset?: number }
        >({
            providesTags: (result) =>
                result?.data?.map(({ ID }) => ({
                    type: 'Article',
                    id: ID,
                })) ?? [],
            query: ({ limit = 15, offset = 0 }) => ({
                url: '/articles',
                method: 'GET',
                params: {
                    limit,
                    offset,
                },
            }),
        }),
        getArticle: builder.query<GenericResponse<ReceivedArticle>, number>({
            providesTags: (_result, _error, id) => [{ type: 'Article', id }],
            query: (id) => ({
                url: `/articles/${id}`,
                method: 'GET',
            }),
        }),
        getUserArticles: builder.query<
            GenericResponse<ReceivedArticle[]>,
            void
        >({
            providesTags: (result) =>
                result?.data?.map(({ ID }) => ({
                    type: 'Article',
                    id: ID,
                })) ?? [],
            query: () => ({
                url: '/articles/created',
                method: 'GET',
            }),
        }),
        updateArticle: builder.mutation<
            GenericResponse<ReceivedArticle>,
            Partial<ArticleToSend> & { id: number }
        >({
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Article', id },
            ],
            query: (update) => ({
                url: `/articles/${update.id}`,
                method: 'PATCH',
                body: _.omit(update, 'id'),
            }),
        }),
        deleteArticle: builder.mutation<Response, number>({
            invalidatesTags: ['Article'],
            query: (id) => ({
                url: `/articles/${id}`,
                method: 'DELETE',
            }),
        }),
        toggleLoveArticle: builder.mutation<
            GenericResponse<ReceivedArticle>,
            number
        >({
            invalidatesTags: (_result, _error, id) => [{ type: 'Article', id }],
            query: (id) => ({
                url: `/articles/${id}/toggle-like`,
                method: 'POST',
            }),
        }),
        commentOnArticle: builder.mutation<
            GenericResponse<ReceivedArticle>,
            { id: number; content: string }
        >({
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Article', id },
            ],
            query: ({ id, content }) => ({
                url: `/articles/${id}/comment`,
                method: 'POST',
                body: { Content: content },
            }),
        }),
        toggleLikeComment: builder.mutation<
            GenericResponse<ReceivedArticle>,
            LikeCommentPayload
        >({
            invalidatesTags: (_result, _error, { articleID }) => [
                { type: 'Article', id: articleID },
            ],
            query: ({ articleID, commentID }) => ({
                url: `/articles/${articleID}/comment/${commentID}/toggle-like`,
                method: 'POST',
            }),
        }),
        toggleBookmarkArticle: builder.mutation<
            GenericResponse<string>,
            number
        >({
            invalidatesTags: ['Bookmarks'],
            query: (id) => ({
                url: `/articles/${id}/bookmark`,
                method: 'POST',
            }),
        }),
        getBookmarkedArticles: builder.query<
            GenericResponse<PaginatedResult<ReceivedArticle>>,
            { limit?: number; offset?: number }
        >({
            providesTags: ['Bookmarks'],
            query: ({ limit = 15, offset = 0 }) => {
                return {
                    url: '/articles/bookmarked',
                    method: 'GET',
                    params: {
                        limit,
                        offset,
                    },
                };
            },
            keepUnusedDataFor: 0,
        }),
    }),
});

export const {
    useCreateArticleMutation,
    useGetArticlesQuery,
    useGetArticleQuery,
    useLazyGetArticleQuery,
    useUpdateArticleMutation,
    useDeleteArticleMutation,
    useGetUserArticlesQuery,
    useToggleLoveArticleMutation,
    useCommentOnArticleMutation,
    useToggleLikeCommentMutation,
    useToggleBookmarkArticleMutation,
    useGetBookmarkedArticlesQuery,
    usePrefetch,
} = articleApi;
