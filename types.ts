import { type Database } from './supabase.types';

export type Project = Database['public']['Tables']['projects']['Row'];