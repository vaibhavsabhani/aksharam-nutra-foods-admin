import { baseApi } from './base-api';
import type {
  Contact,
  ContactQueryParams,
  ContactsResponse,
  ContactStats,
  CreateContactPayload,
  UpdateContactStatusPayload,
} from '@/types';

export const contactEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query<ContactsResponse, ContactQueryParams | void>({
      query: (arg) => ({
        url: '/contacts',
        params: {
          ...(arg?.search ? { search: arg.search } : {}),
          ...(arg?.status && arg.status !== 'ALL' ? { status: arg.status } : {}),
          ...(arg?.page ? { page: arg.page } : {}),
          ...(arg?.limit ? { limit: arg.limit } : {}),
        },
      }),
      providesTags: ['Contact'],
    }),

    getContactStats: builder.query<ContactStats, void>({
      query: () => ({
        url: '/contacts/stats',
      }),
      providesTags: ['Contact'],
    }),

    getContactById: builder.query<Contact, number>({
      query: (id) => ({
        url: `/contacts/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: 'Contact', id }],
    }),

    createContact: builder.mutation<
      { success: boolean; message: string; data: Contact },
      CreateContactPayload
    >({
      query: (body) => ({
        url: '/contacts',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Contact'],
    }),

    updateContactStatus: builder.mutation<
      Contact,
      { id: number } & UpdateContactStatusPayload
    >({
      query: ({ id, ...body }) => ({
        url: `/contacts/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Contact'],
    }),

    deleteContact: builder.mutation<{ id?: number }, number>({
      query: (id) => ({
        url: `/contacts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Contact'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetContactsQuery,
  useGetContactStatsQuery,
  useGetContactByIdQuery,
  useCreateContactMutation,
  useUpdateContactStatusMutation,
  useDeleteContactMutation,
} = contactEndpoints;
