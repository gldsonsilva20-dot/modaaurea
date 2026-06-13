import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getAllProducts, getProductsByCategory, getProductBySlug, getFeaturedProducts } from "../db";
import { getDb } from "../db";
import { products } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const productsRouter = router({
  list: publicProcedure.query(async () => {
    return getAllProducts();
  }),

  featured: publicProcedure.query(async () => {
    return getFeaturedProducts();
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return getProductBySlug(input.slug);
    }),

  byCategory: publicProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(async ({ input }) => {
      return getProductsByCategory(input.categoryId);
    }),

  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const allProducts = await getAllProducts();
      return allProducts.filter(p =>
        p.name.toLowerCase().includes(input.query.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(input.query.toLowerCase()))
      );
    }),

  create: protectedProcedure
    .input(z.object({
      categoryId: z.number(),
      name: z.string(),
      slug: z.string(),
      description: z.string().optional(),
      price: z.string(),
      costPrice: z.string().optional(),
      stock: z.number().default(0),
      imageUrls: z.string().optional(),
      sizes: z.string().optional(),
      colors: z.string().optional(),
      isFeatured: z.boolean().default(false),
      isPromotion: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(products).values({
        categoryId: input.categoryId,
        name: input.name,
        slug: input.slug,
        description: input.description,
        price: input.price as any,
        costPrice: input.costPrice as any,
        stock: input.stock,
        imageUrls: input.imageUrls,
        sizes: input.sizes,
        colors: input.colors,
        isFeatured: input.isFeatured,
        isPromotion: input.isPromotion,
      });

      return { success: true };
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      categoryId: z.number().optional(),
      name: z.string().optional(),
      slug: z.string().optional(),
      description: z.string().optional(),
      price: z.string().optional(),
      costPrice: z.string().optional(),
      stock: z.number().optional(),
      imageUrls: z.string().optional(),
      sizes: z.string().optional(),
      isFeatured: z.boolean().optional(),
      isPromotion: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const updateData: any = {};
      if (input.categoryId !== undefined) updateData.categoryId = input.categoryId;
      if (input.name !== undefined) updateData.name = input.name;
      if (input.slug !== undefined) updateData.slug = input.slug;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.price !== undefined) updateData.price = input.price;
      if (input.costPrice !== undefined) updateData.costPrice = input.costPrice;
      if (input.stock !== undefined) updateData.stock = input.stock;
      if (input.imageUrls !== undefined) updateData.imageUrls = input.imageUrls;
      if (input.sizes !== undefined) updateData.sizes = input.sizes;
      if (input.isFeatured !== undefined) updateData.isFeatured = input.isFeatured;
      if (input.isPromotion !== undefined) updateData.isPromotion = input.isPromotion;

      await db.update(products).set(updateData).where(eq(products.id, input.id));
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(products).where(eq(products.id, input.id));
      return { success: true };
    }),
});
