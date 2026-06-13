import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getAllCategories, getCategoryBySlug } from "../db";
import { getDb } from "../db";
import { categories } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const categoriesRouter = router({
  // Listar todas as categorias
  list: publicProcedure.query(async () => {
    return getAllCategories();
  }),

  // Obter categoria por slug
  getBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return getCategoryBySlug(input.slug);
    }),

  // Criar categoria
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(categories).values({
        name: input.name,
        slug: input.slug,
        description: input.description,
        imageUrl: input.imageUrl,
      });

      return {
        success: true,
      };
    }),

  // Atualizar categoria
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const updateData: any = {};

      if (input.name !== undefined) updateData.name = input.name;
      if (input.slug !== undefined) updateData.slug = input.slug;
      if (input.description !== undefined)
        updateData.description = input.description;
      if (input.imageUrl !== undefined)
        updateData.imageUrl = input.imageUrl;

      await db
        .update(categories)
        .set(updateData)
        .where(eq(categories.id, input.id));

      return {
        success: true,
      };
    }),

  // Deletar categoria
  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(categories).where(eq(categories.id, input.id));

      return {
        success: true,
      };
    }),
});