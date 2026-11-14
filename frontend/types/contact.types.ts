export type ContactStatus = 'PENDING' | 'CONTACTED' | 'RESOLVED' | 'ARCHIVED';

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  ipAddress?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  countryCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status: ContactStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactStats {
  total: number;
  pending: number;
  contacted: number;
  resolved: number;
  archived: number;
}

export interface ContactsResponse {
  contacts: Contact[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  city?: string;
  country?: string;
  ipAddress?: string;
}

export interface UpdateContactStatusPayload {
  status: ContactStatus;
  notes?: string;
}

export interface ContactQueryParams {
  search?: string;
  status?: ContactStatus | 'ALL';
  page?: number;
  limit?: number;
}
