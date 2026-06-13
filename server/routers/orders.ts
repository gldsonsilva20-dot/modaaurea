import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getAllOrders, getOrderByNumber, getDb } from "../db";
import { orders } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { createTransaction, CreateTransactionPayload } from "../otimize-pay";

export const ordersRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
    return getAllOrders();
  }),

  getByNumber: publicProcedure
    .input(z.object({ orderNumber: z.string() }))
    .query(async ({ input }) => getOrderByNumber(input.orderNumber)),

  checkout: publicProcedure
    .input(
      z.object({
        customerName: z.string(),
        customerEmail: z.string().email(),
        customerPhone: z.string(),
        document: z.string(),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        totalPrice: z.string(),
        paymentMethod: z.enum(["pix", "credit_card"]),
        items: z.string(),
        utmParams: z.string().optional(), // ← UTMs vindos do frontend
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const cartItems = JSON.parse(input.items);
        const totalInCents = Math.round(parseFloat(input.totalPrice) * 100);

        const docClean = input.document.replace(/\D/g, "");
        const docType = docClean.length > 11 ? "cnpj" : "cpf";

        const items = cartItems.map((item: any) => ({
          title: item.name,
          unitPrice: Math.round(parseFloat(item.price) * 100),
          quantity: item.quantity,
          tangible: true,
        }));

        const payload: any = {
          amount: totalInCents,
          paymentMethod: input.paymentMethod,
          customer: {
            name: input.customerName,
            email: input.customerEmail,
            phone: input.customerPhone,
            document: {
              number: docClean,
              type: docType,
            },
            address: {
              street: input.address,
              streetNumber: "0",
              zipCode: input.zipCode.replace(/\D/g, "").substring(0, 8),
              neighborhood: input.city,
              city: input.city,
              state: input.state,
              country: "BR",
            },
          },
          items,
        };

        const transaction = await createTransaction(payload);

        const baseUrl = transaction.secureUrl || null;
        if (!baseUrl) return null;

        // Adiciona UTMs na URL do checkout se existirem
        const utms = input.utmParams ? `?${input.utmParams}` : "";
        return `${baseUrl}${utms}`;

      } catch (error) {
        console.error("[Checkout] Error creating transaction:", error);
        throw new Error(
          `Erro ao processar pagamento: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        );
      }
    }),
});