import { Resend } from "resend";

// O "|| ''" é fundamental para que a Vercel consiga completar o Build sem erros
const resend = new Resend(process.env.RESEND_API_KEY || '');

const FROM_EMAIL = "onboarding@resend.dev";
const TO_EMAIL = "thiago.lanzarin2812@gmail.com";

/**
 * Envia um alerta de e-mail de pulso detectado.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function sendEmailAlert() {
  try {
    // Verifica se a chave existe antes de tentar o envio
    if (!process.env.RESEND_API_KEY) {
       console.error("[Email Service] Erro: RESEND_API_KEY não encontrada no ambiente.");
       return { success: false, error: "Chave de API não configurada." };
    }

    const now = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: `🚨 Alerta de Enchente: Pulso Detectado!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                    <tr>
                      <td style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 30px 40px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                          Alerta de Enchente
                        </h1>
                        <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
                          ATENÇÃO IMEDIATA NECESSÁRIA
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px;">
                        <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; border-radius: 4px; margin-bottom: 30px;">
                          <p style="margin: 0; color: #1f2937; font-size: 16px; line-height: 1.6;">
                            <strong>Um novo pulso do sensor foi detectado.</strong> Esta área está sujeita a enchentes e requer atenção imediata.
                          </p>
                        </div>
                        <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                          <tr>
                            <td style="padding: 15px; background-color: #f9fafb; border-radius: 4px;">
                              <p style="color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase;">🕐 Horário do Alerta</p>
                              <p style="color: #1f2937; font-size: 18px; font-weight: 700;">${now}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
                        <p style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 600;">Flood Monitor</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log("[Email Service] Alerta de email enviado com sucesso:", data?.id);
    return { success: true, data: data?.id };
  } catch (error) {
    console.error("[Email Service] Erro ao enviar email:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
}