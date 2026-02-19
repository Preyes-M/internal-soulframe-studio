import { supabase } from '../lib/supabase';
import { toCamelCase } from './supabaseService';

let cachedProfile: any | null = null;
let loadingPromise: Promise<any> | null = null;

async function loadProfile() {
  if (cachedProfile) return cachedProfile;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Profile fetch error:', error.message);
      return null;
    }

    cachedProfile = toCamelCase(data);
    return cachedProfile;
  })();

  return loadingPromise;
}

export const userService = {
  async getProfile() {
    return loadProfile();
  },

  async getName() {
    const profile = await loadProfile();
    return profile?.fullName ?? null;
  },

  async isAdmin() {
    const profile = await loadProfile();
    return profile?.isAdmin === true;
  },

  clearCache() {
    cachedProfile = null;
    loadingPromise = null;
  }
};
