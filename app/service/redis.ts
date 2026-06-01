import { createClient } from 'redis';

// 1. Buscamos a URL do banco que veio do seu Upstash na Vercel.
// Se não encontrar, ele tenta usar o local (fallback) para não quebrar o código.
const redisUrl = process.env.KV_URL || 'redis://127.0.0.1:6379';

const redisClient = createClient({
  url: redisUrl
});

let isConnected = false;

export async function connectToRedis() {
  // 2. PROTEÇÃO: Se já estiver conectado, não tenta rodar o .connect() de novo!
  if (isConnected || redisClient.isOpen) {
    return;
  }

  try {
    await redisClient.connect();
    isConnected = true;
    console.log("[Redis Service] Conectado com sucesso ao Upstash Redis!");
  } catch (err) {
    console.error("[Redis Service] FALHA AO CONECTAR no Redis:", err);
    isConnected = false;
  }
}

// Mantenha o restante das funções (savePulseToDB, getLatestPulses, etc.) exatamente como estão abaixo...