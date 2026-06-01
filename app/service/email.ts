import { Resend } from "resend";

// Deixamos a variável apenas declarada
let resend: Resend | null = null;

// Só criamos a instância se a chave de fato existir no ambiente
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn("[Email Service] Aviso: RESEND_API_KEY não encontrada no ambiente.");
}

const FROM_EMAIL = "onboarding@resend.dev";
const TO_EMAIL = "thiago.lanzarin2812@gmail.com"; 

export async function sendEmailAlert() {
  try {
    // Se o Resend não foi inicializado (chave vazia), cancelamos o envio sem quebrar a aplicação
    if (!resend) {
       console.error("[Email Service] Erro: Tentativa de envio sem API Key configurada.");
       return { success: false, error: "Chave não configurada." };
    }

    const now = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: `🚨 Alerta de Enchente: Pulso Detectado!`,
      html: `<h1>Alerta de Enchente</h1><p>Detectado em: ${now}</p>`,
    });

    if (error) throw new Error(error.message);
    return { success: true, data: data?.id };
  } catch (error) {
    console.error("[Email Service] Erro:", error);
    return { success: false, error: String(error) };
  }
}