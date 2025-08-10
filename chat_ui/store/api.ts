import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/' }),
  tagTypes: ['Chats'],
  endpoints: (builder) => ({
    sendMessage: builder.mutation<{response: {content: string, type: string, status?: string}, chat_id: string}, {message: string, chat_id?: string}>({
      query: (body) => ({
        url: 'chat',
        method: 'POST',
        body,
      }),
      async onQueryStarted({ chat_id, message }, { dispatch, queryFulfilled }) {
        if (!chat_id) {
          try {
            const { data: { chat_id: newChatId } } = await queryFulfilled;
            dispatch(
              api.util.updateQueryData('getAllChats', undefined, (draft) => {
                draft.chats.unshift({ chat_id: newChatId, title: message });
              })
            );
          } catch {
            // handle error
          }
        }
      },
    }),
    getChatHistory: builder.query<{messages: Array<{content: string, type: string, status?: string}>}, string>({
      query: (chat_id) => `chat/${chat_id}`,
    }),
    getAllChats: builder.query<{chats: Array<{chat_id: string, title: string}>}, void>({
      query: () => 'chat',
      providesTags: (result) =>
        result
          ? [...result.chats.map(({ chat_id }) => ({ type: 'Chats' as const, id: chat_id })), { type: 'Chats', id: 'LIST' }]
          : [{ type: 'Chats', id: 'LIST' }],
    }),
  }),
});

export const { useSendMessageMutation, useGetChatHistoryQuery, useGetAllChatsQuery } = api;
