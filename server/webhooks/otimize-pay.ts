import { Request, Response } from "express";
import { getDb } from "../db";
import { orders } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Webhook para processar eventos de pagamento da Otimize Pay
 * POST /api/webhooks/otimize-pay
 */
export async function handleOtimizePayWebhook(req: Request, res: Response) {
  try {
    const payload = req.body;

    console.log("[Webhook] Received Otimize Pay event:", {
      type: payload.type,
      objectId: payload.objectId,
      status: payload.data?.status,
    });

    // Validar tipo de evento
    if (payload.type !== "transaction") {
      console.log("[Webhook] Ignoring non-transaction event");
      return res.json({ received: true });
    }

    const transaction = payload.data;
    const transactionId = transaction.id;
    const status = transaction.status;

    // Mapear status da Otimize Pay para status interno
    let orderStatus = "pending";
    if (status === "paid") {
      orderStatus = "confirmed";
    } else if (status === "refused") {
      orderStatus = "cancelled";
    } else if (status === "refunded") {
      orderStatus = "cancelled";
    }

    // Buscar pedido pelo ID da transação (armazenado em metadata ou externalRef)
    const db = await getDb();
    if (!db) {
      console.error("[Webhook] Database not available");
      return res.status(500).json({ error: "Database not available" });
    }

    // Atualizar status do pedido
    // Nota: Você pode armazenar o transactionId em um campo adicional da tabela de pedidos
    // Por enquanto, vamos apenas registrar o evento
    console.log("[Webhook] Transaction processed:", {
      transactionId,
      status,
      orderStatus,
      customer: transaction.customer?.email,
      amount: transaction.amount,
    });

    // Aqui você poderia:
    // 1. Enviar e-mail de confirmação ao cliente
    // 2. Atualizar o status do pedido no banco de dados
    // 3. Disparar notificações para o admin
    // 4. Integrar com sistema de logística

    return res.json({ received: true, processed: true });
  } catch (error) {
    console.error("[Webhook] Error processing event:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Webhook para processar eventos de checkout
 * POST /api/webhooks/otimize-pay-checkout
 */
export async function handleOtimizePayCheckoutWebhook(req: Request, res: Response) {
  try {
    const payload = req.body;

    console.log("[Webhook] Received Otimize Pay checkout event:", {
      type: payload.type,
      objectId: payload.objectId,
    });

    if (payload.type !== "checkout") {
      console.log("[Webhook] Ignoring non-checkout event");
      return res.json({ received: true });
    }

    const checkout = payload.data;

    console.log("[Webhook] Checkout processed:", {
      checkoutId: checkout.id,
      status: checkout.status,
      amount: checkout.amount,
    });

    return res.json({ received: true, processed: true });
  } catch (error) {
    console.error("[Webhook] Error processing checkout event:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
