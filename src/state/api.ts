import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { SessionUser } from "@/lib/auth";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
    credentials: "same-origin",
    cache: "no-store",
  }),
  reducerPath: "api",
  tagTypes: [],
  endpoints: (build) => ({
    getSession: build.query<{ user: SessionUser | null }, void>({
      query: () => "auth/session",
    }),
  }),
});
export const { useGetSessionQuery } = api;
