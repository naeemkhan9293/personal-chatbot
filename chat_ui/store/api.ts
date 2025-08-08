import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/' }),
  endpoints: (builder) => ({
    sendMessage: builder.mutation<{response: Array<{content: string, type: string}>, chat_id: string}, {message: string, chat_id?: string}>({
      query: (body) => ({
        url: 'chat',
        method: 'POST',
        body,
      }),
    }),
    getChatHistory: builder.query<{messages: Array<{content: string, type: string}>}, string>({
      query: (chat_id) => `chat/${chat_id}`,
    }),
    getAllChats: builder.query<{chats: Array<{chat_id: string, title: string}>}, void>({
      query: () => 'chat',
    }),
  }),
});

export const { useSendMessageMutation, useGetChatHistoryQuery, useGetAllChatsQuery } = api;
