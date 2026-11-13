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

export type CreateBlogPayload = {
  title: string;
  content: string;
  isShow?: boolean;
  coverImageUrl?: string | null;
};

export type UpdateBlogPayload = Partial<CreateBlogPayload>;

