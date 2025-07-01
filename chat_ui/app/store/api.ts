import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/' }),
  endpoints: (builder) => ({
    sendMessage: builder.mutation<any, any>({
      query: (body) => ({
        url: 'chat',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSendMessageMutation } = api;
