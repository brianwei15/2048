import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
}

export interface Score {
  id: string;
  user_id: string;
  score: number;
  created_at: string;
  profiles?: {
    email: string;
  };
}

export const auth = {
  async signUpWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  },

  async signInWithPassword(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signInWithEmail(email: string) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  onAuthStateChange(callback: (user: { id: string; email: string } | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user ? { id: session.user.id, email: session.user.email || '' } : null);
    });
  }
};

export const scores = {
  async saveScore(score: number, gameData?: unknown) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('scores')
      .insert([
        {
          user_id: user.id,
          score,
          game_data: gameData,
        },
      ])
      .select()
      .single();

    return { data, error };
  },

  async getUserBestScore(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { data } = await supabase
      .from('scores')
      .select('score')
      .eq('user_id', user.id)
      .order('score', { ascending: false })
      .limit(1)
      .single();

    return data?.score || 0;
  },

  async getTopScores(limit: number = 10): Promise<Score[]> {
    const { data, error } = await supabase
      .from('scores')
      .select(`
        id,
        user_id,
        score,
        created_at,
        profiles!inner(email)
      `)
      .order('score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    // Transform the data to match our Score interface
    return (data || []).map((item: { id: string; user_id: string; score: number; created_at: string; profiles: { email: string }[] | { email: string } }) => ({
      id: item.id,
      user_id: item.user_id,
      score: item.score,
      created_at: item.created_at,
      profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
    }));
  }
};
