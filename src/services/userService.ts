import { supabase, TABLES } from '@/lib/supabase';
import { UserProfile, UserLevel } from '@/types/database';

class UserService {
  async getUserProfile(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data as UserProfile;
  }

  async updateUserObjective(level: UserLevel): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from(TABLES.PROFILES)
      .update({ objective: level })
      .eq('id', user.id);

    if (error) throw error;
  }

  async getUserStats(): Promise<{
    totalExams: number;
    passedExams: number;
    averageScore: number;
    bestScore: number;
  }> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from(TABLES.EXAM_RESULTS)
      .select('score, percentage, passed')
      .eq('user_id', user.id);

    if (error) throw error;

    const results = data || [];
    const totalExams = results.length;
    const passedExams = results.filter((r) => r.passed).length;
    const totalScore = results.reduce((sum, r) => sum + r.percentage, 0);
    const averageScore = totalExams > 0 ? Math.round(totalScore / totalExams) : 0;
    const bestScore = results.length > 0 ? Math.max(...results.map((r) => r.percentage)) : 0;

    return {
      totalExams,
      passedExams,
      averageScore,
      bestScore,
    };
  }
}

export const userService = new UserService();
