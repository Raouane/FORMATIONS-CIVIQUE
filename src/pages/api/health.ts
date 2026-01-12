import type { NextApiRequest, NextApiResponse } from 'next';
import { createServiceRoleClient } from '@/lib/supabase';

type HealthResponse = {
  status: string;
  timestamp: string;
  uptime: number;
  database?: {
    status: 'ok' | 'error';
    message?: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  // Vérifier que c'est une requête GET
  if (req.method !== 'GET') {
    return res.status(405).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  }

  const healthResponse: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };

  // Vérifier la connexion à la base de données
  try {
    const supabase = createServiceRoleClient();
    // Test simple : vérifier que la connexion fonctionne
    const { error } = await supabase.from('fc_profiles').select('count').limit(1);
    
    if (error) {
      healthResponse.database = {
        status: 'error',
        message: error.message,
      };
      healthResponse.status = 'degraded';
    } else {
      healthResponse.database = {
        status: 'ok',
      };
    }
  } catch (error) {
    healthResponse.database = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
    healthResponse.status = 'degraded';
  }

  // Retourner 200 même si la DB a un problème (le serveur fonctionne)
  // Mais le status indiquera si tout est ok ou dégradé
  const statusCode = healthResponse.status === 'ok' ? 200 : 200;
  res.status(statusCode).json(healthResponse);
}
