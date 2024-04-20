import { defineStore } from 'pinia'
import { useSupabase } from '~/composables/useSupabase';

export const useAuthStore = defineStore('Auth', () => {
  const user = useSupabaseUser();
  const supabase = useSupabase();

  return {}
})
