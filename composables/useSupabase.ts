import { type Database } from "~/supabase.types";

export const useSupabase = () => useSupabaseClient<Database>();