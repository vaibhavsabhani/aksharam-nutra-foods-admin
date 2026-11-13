import { baseApi } from './base-api';
import type { Testimonial, CreateTestimonialPayload, UpdateTestimonialPayload } from '@/types';

export const testimonialEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestimonials: builder.query<Testimonial[], { onlyVisible?: boolean } | void>({
      query: (arg) => ({
        url: '/testimonials',
        params: arg?.onlyVisible ? { onlyVisible: true } : undefined,
      }),
      providesTags: ['Testimonial'],
    }),
    createTestimonial: builder.mutation<Testimonial, CreateTestimonialPayload>({
      query: (body) => ({ url: '/testimonials', method: 'POST', body }),
      invalidatesTags: ['Testimonial'],
    }),
    updateTestimonial: builder.mutation<Testimonial, { id: number } & UpdateTestimonialPayload>({
      query: ({ id, ...body }) => ({ url: `/testimonials/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Testimonial'],
    }),
    toggleTestimonialVisibility: builder.mutation<Testimonial, number>({
      query: (id) => ({ url: `/testimonials/${id}/toggle-visibility`, method: 'PATCH' }),
      invalidatesTags: ['Testimonial'],
    }),
    deleteTestimonial: builder.mutation<{ id?: number }, number>({
      query: (id) => ({ url: `/testimonials/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Testimonial'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useToggleTestimonialVisibilityMutation,
  useDeleteTestimonialMutation,
} = testimonialEndpoints;

