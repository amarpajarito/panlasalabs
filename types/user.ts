export interface User {
  id: string;
  email: string;
  name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
  provider?: string | null;
  auth_provider?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileUpdatePayload {
  name?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}
