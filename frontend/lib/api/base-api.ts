import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type { Session } from "@/types";

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

export const baseApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Blog", "Testimonial", "Contact"],
  endpoints: () => ({}),
});

