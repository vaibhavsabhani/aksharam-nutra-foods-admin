import { baseApi } from './base-api';
import type { BlogPost, CreateBlogPayload, UpdateBlogPayload } from '@/types';

export const blogEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<BlogPost[], { onlyVisible?: boolean } | void>({
      query: (arg) => ({
        url: '/blogs',
        params: arg?.onlyVisible ? { onlyVisible: true } : undefined,
      }),
      providesTags: ['Blog'],
    }),
    uploadBlogImage: builder.mutation<{ url: string }, File>({
      query: (file) => {
        const body = new FormData();
        body.append('file', file);
        return { url: '/blogs/upload-image', method: 'POST', body };
      },
    }),
    createBlog: builder.mutation<BlogPost, CreateBlogPayload>({
      query: (body) => ({ url: '/blogs', method: 'POST', body }),
      invalidatesTags: ['Blog'],
    }),
    updateBlog: builder.mutation<BlogPost, { id: number } & UpdateBlogPayload>({
      query: ({ id, ...body }) => ({ url: `/blogs/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Blog'],
    }),
    toggleBlogVisibility: builder.mutation<BlogPost, number>({
      query: (id) => ({ url: `/blogs/${id}/toggle-visibility`, method: 'PATCH' }),
      invalidatesTags: ['Blog'],
    }),
    deleteBlog: builder.mutation<{ id?: number }, number>({
      query: (id) => ({ url: `/blogs/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Blog'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBlogsQuery,
  useUploadBlogImageMutation,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useToggleBlogVisibilityMutation,
  useDeleteBlogMutation,
} = blogEndpoints;

