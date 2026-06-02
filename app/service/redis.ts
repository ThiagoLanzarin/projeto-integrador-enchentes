import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.KV_URL
});

redisClient.on('error', (err) => console.error('[Redis Service] Erro no cliente:', err));

async function connectToRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

// 1. SUA FUNÇÃO DE SALVAR ATUALIZADA E SEGURA
export async function savePulseToDB(sensorStatus: boolean) {
  try {
    await connectToRedis();
    
    const timestamp = Date.now();
    
    const pulseData = JSON.stringify({
      timestamp: timestamp,
      status: Boolean(sensorStatus),
    });

    await redisClient.lPush('pulses', pulseData);
    await redisClient.lTrim('pulses', 0, 99); 
    
    console.log("[Redis Service] Novo pulso gravado com sucesso no Upstash!");
    return true;
  } catch (error) {
    console.error("[Redis Service] Erro ao salvar pulso no Upstash:", error);
    return false;
  }
}

// 2. A FUNÇÃO QUE ESTAVA FALTANDO PARA O GRÁFICO LER OS DADOS
export async function getLatestPulses(limit = 50) {
  try {
    await connectToRedis();
    
    // Puxa o histórico do Redis
    const rawPulses = await redisClient.lRange('pulses', 0, limit - 1);
    
    // Converte de volta de texto para objeto JSON
    return rawPulses.map(pulse => JSON.parse(pulse));
  } catch (error) {
    console.error("[Redis Service] Erro ao buscar pulsos no Upstash:", error);
    return [];
  }
}