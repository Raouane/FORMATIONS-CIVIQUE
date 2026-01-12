/**
 * Service pour gérer les chapitres de révision depuis la base de données
 * Contenu multilingue stocké en JSONB (FR, EN, AR)
 */

import { supabase, TABLES } from '@/lib/supabase';
import { SupportedLocale } from '@/lib/localization';
import { QuestionTheme, UserLevel } from '@/types/database';

export interface RevisionChapter {
  id: string;
  theme: QuestionTheme;
  level: UserLevel;
  title: string;
  content: string; // Markdown
  order: number;
}

export interface RevisionChapterRaw {
  id: string;
  theme: QuestionTheme;
  level: UserLevel;
  title: Record<string, string>; // JSONB
  content: Record<string, string>; // JSONB
  order_index: number;
}

// Cache en mémoire pour améliorer les performances
const chapterCache = new Map<string, { data: RevisionChapter[]; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Récupère tous les chapitres de révision
 */
export async function getRevisionChapters(
  locale: SupportedLocale = 'fr',
  theme?: QuestionTheme,
  level?: UserLevel
): Promise<RevisionChapter[]> {
  const cacheKey = `chapters.${locale}.${theme || 'all'}.${level || 'all'}`;
  const cached = chapterCache.get(cacheKey);
  
  // Vérifier le cache
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    let query = supabase
      .from(TABLES.REVISION_CHAPTERS)
      .select('*')
      .order('order_index', { ascending: true });

    if (theme) {
      query = query.eq('theme', theme);
    }

    if (level) {
      query = query.eq('level', level);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    // Extraire les traductions selon la locale
    const chapters: RevisionChapter[] = data.map((row: RevisionChapterRaw) => {
      const titles = row.title as Record<string, string>;
      const contents = row.content as Record<string, string>;

      return {
        id: row.id,
        theme: row.theme as QuestionTheme,
        level: row.level as UserLevel,
        title: titles[locale] || titles.fr || row.id,
        content: contents[locale] || contents.fr || '',
        order: row.order_index,
      };
    });

    // Mettre en cache
    chapterCache.set(cacheKey, { data: chapters, timestamp: Date.now() });

    return chapters;
  } catch (error) {
    console.error(`[RevisionChapter] Erreur chargement:`, error);
    return [];
  }
}

/**
 * Récupère un chapitre spécifique par ID
 */
export async function getRevisionChapterById(
  id: string,
  locale: SupportedLocale = 'fr'
): Promise<RevisionChapter | null> {
  try {
    const { data, error } = await supabase
      .from(TABLES.REVISION_CHAPTERS)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    const row = data as RevisionChapterRaw;
    const titles = row.title as Record<string, string>;
    const contents = row.content as Record<string, string>;

    return {
      id: row.id,
      theme: row.theme as QuestionTheme,
      level: row.level as UserLevel,
      title: titles[locale] || titles.fr || row.id,
      content: contents[locale] || contents.fr || '',
      order: row.order_index,
    };
  } catch (error) {
    console.error(`[RevisionChapter] Erreur pour ${id}:`, error);
    return null;
  }
}

/**
 * Vide le cache des chapitres
 */
export function clearRevisionChapterCache(): void {
  chapterCache.clear();
}
