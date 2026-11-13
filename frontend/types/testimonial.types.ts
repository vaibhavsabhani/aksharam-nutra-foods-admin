export type Testimonial = {
  id: number;
  quote: string;
  author: string;
  isShow: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateTestimonialPayload = {
  quote: string;
  author: string;
  isShow?: boolean;
};

export type UpdateTestimonialPayload = Partial<CreateTestimonialPayload>;

