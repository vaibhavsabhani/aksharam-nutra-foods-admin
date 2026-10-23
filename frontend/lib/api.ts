import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

export type Session = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  isEmailVerified: boolean;
  createdAt: string;
};

export type BlogPost = {
  id: number;
  title: string;
  content: string;
  isShow: boolean;
  authorId?: number | null;
  author?: {
    id: number;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  coverImageUrl?: string | null;
};

export type Testimonial = {
  id: number;
  quote: string;
  author: string;
  isShow: boolean;
  createdAt: string;
  updatedAt: string;
};

type MessageResponse = { message: string; resetToken?: string };

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api",
  prepareHeaders: (headers, { arg }) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);
    }
    const isFormData =
      typeof FormData !== "undefined" &&
      typeof arg !== "string" &&
      arg.body instanceof FormData;
    if (!isFormData) {
      headers.set("Content-Type", "application/json");
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (typeof window !== "undefined") {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        // Attempt to refresh the session token transparently
        const refreshResult = await rawBaseQuery(
          {
            url: "/auth/refresh",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const session = refreshResult.data as Session;
          localStorage.setItem("accessToken", session.accessToken);
          localStorage.setItem("refreshToken", session.refreshToken);

          // Retry the original query with the new access token
          result = await rawBaseQuery(args, api, extraOptions);
        } else {
          // Refresh token expired or revoked, clean up
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
      }
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Blog", "Testimonial"],
  endpoints: (builder) => ({
    login: builder.mutation<Session, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    forgotPassword: builder.mutation<MessageResponse, { email: string }>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),
    resetPassword: builder.mutation<MessageResponse, { token: string; password: string }>({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
    }),
    getMe: builder.query<User, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),
    logout: builder.mutation<MessageResponse, { refreshToken: string }>({
      query: (body) => ({ url: "/auth/logout", method: "POST", body }),
      invalidatesTags: ["User"],
    }),
    getBlogs: builder.query<BlogPost[], { onlyVisible?: boolean } | void>({
      query: (arg) => ({
        url: "/blogs",
        params: arg?.onlyVisible ? { onlyVisible: true } : undefined,
      }),
      providesTags: ["Blog"],
    }),
    uploadBlogImage: builder.mutation<{ url: string }, File>({
      query: (file) => {
        const body = new FormData();
        body.append("file", file);
        return { url: "/blogs/upload-image", method: "POST", body };
      },
    }),
    createBlog: builder.mutation<
      BlogPost,
      { title: string; content: string; coverImageUrl?: string; isShow?: boolean }
    >({
      query: (body) => ({ url: "/blogs", method: "POST", body }),
      invalidatesTags: ["Blog"],
    }),
    updateBlog: builder.mutation<
      BlogPost,
      { id: number; title?: string; content?: string; coverImageUrl?: string; isShow?: boolean }
    >({
      query: ({ id, ...body }) => ({ url: `/blogs/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Blog"],
    }),
    toggleBlogVisibility: builder.mutation<BlogPost, number>({
      query: (id) => ({ url: `/blogs/${id}/toggle-visibility`, method: "PATCH" }),
      invalidatesTags: ["Blog"],
    }),
    deleteBlog: builder.mutation<{ id?: number }, number>({
      query: (id) => ({ url: `/blogs/${id}`, method: "DELETE" }),
      invalidatesTags: ["Blog"],
    }),
    getTestimonials: builder.query<Testimonial[], { onlyVisible?: boolean } | void>({
      query: (arg) => ({
        url: "/testimonials",
        params: arg?.onlyVisible ? { onlyVisible: true } : undefined,
      }),
      providesTags: ["Testimonial"],
    }),
    createTestimonial: builder.mutation<Testimonial, { quote: string; author: string; isShow?: boolean }>({
      query: (body) => ({ url: "/testimonials", method: "POST", body }),
      invalidatesTags: ["Testimonial"],
    }),
    updateTestimonial: builder.mutation<Testimonial, { id: number; quote?: string; author?: string; isShow?: boolean }>({
      query: ({ id, ...body }) => ({ url: `/testimonials/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Testimonial"],
    }),
    toggleTestimonialVisibility: builder.mutation<Testimonial, number>({
      query: (id) => ({ url: `/testimonials/${id}/toggle-visibility`, method: "PATCH" }),
      invalidatesTags: ["Testimonial"],
    }),
    deleteTestimonial: builder.mutation<{ id?: number }, number>({
      query: (id) => ({ url: `/testimonials/${id}`, method: "DELETE" }),
      invalidatesTags: ["Testimonial"],
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMeQuery,
  useLogoutMutation,
  useGetBlogsQuery,
  useUploadBlogImageMutation,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useToggleBlogVisibilityMutation,
  useDeleteBlogMutation,
  useGetTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useToggleTestimonialVisibilityMutation,
  useDeleteTestimonialMutation,
} = authApi;