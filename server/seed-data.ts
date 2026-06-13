import { getDb, upsertUser } from "./db";
import { categories, products } from "../drizzle/schema";

async function seedData() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return;
  }

  try {
    // Create admin user
    await upsertUser({
      openId: `admin-${process.env.ADMIN_EMAIL}`,
      email: process.env.ADMIN_EMAIL,
      name: "Admin Moda Aurea",
      loginMethod: "admin",
      role: "admin",
    });
    console.log("✓ Admin user created");

    // Create categories
    const categoryData = [
      { name: "Blusas", slug: "blusas", description: "Coleção de blusas femininas" },
      { name: "Tricô", slug: "trico", description: "Peças em tricô e malha" },
      { name: "Vestidos", slug: "vestidos", description: "Vestidos para todas as ocasiões" },
      { name: "Conjuntos", slug: "conjuntos", description: "Conjuntos coordenados" },
      { name: "Calças", slug: "calcas", description: "Calças em diversos modelos" },
      { name: "Promoções", slug: "promocoes", description: "Itens em promoção" },
    ];

    for (const cat of categoryData) {
      await db.insert(categories).values(cat).catch(() => {
        // Ignore duplicates
      });
    }
    console.log("✓ Categories created");

    // Get category IDs
    const allCategories = await db.select().from(categories);
    const categoryMap: Record<string, number> = {};
    allCategories.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });

    // Create sample products
    const productData = [
      {
        categoryId: categoryMap["blusas"],
        name: "Blusa Tricot Manga Bufante",
        slug: "blusa-tricot-manga-bufante",
        description: "Blusa em tricot com manga bufante, perfeita para o dia a dia",
        price: "49.90",
        stock: 50,
        sizes: JSON.stringify(["P", "M", "G", "GG"]),
        isFeatured: true,
      },
      {
        categoryId: categoryMap["blusas"],
        name: "Blusa Social Branca",
        slug: "blusa-social-branca",
        description: "Blusa social em algodão branco, elegante e versátil",
        price: "59.90",
        stock: 40,
        sizes: JSON.stringify(["P", "M", "G", "GG"]),
        isFeatured: true,
      },
      {
        categoryId: categoryMap["trico"],
        name: "Cardigan Tricô Perolas",
        slug: "cardigan-trico-perolas",
        description: "Cardigan em tricô com detalhes em pérolas",
        price: "69.90",
        stock: 30,
        sizes: JSON.stringify(["P", "M", "G", "GG"]),
        isFeatured: true,
      },
      {
        categoryId: categoryMap["vestidos"],
        name: "Vestido Canelado Midi",
        slug: "vestido-canelado-midi",
        description: "Vestido canelado midi, confortável e elegante",
        price: "89.90",
        stock: 25,
        sizes: JSON.stringify(["P", "M", "G", "GG"]),
        isFeatured: true,
      },
      {
        categoryId: categoryMap["conjuntos"],
        name: "Conjunto Tricô Modal",
        slug: "conjunto-trico-modal",
        description: "Conjunto em tricô modal, super confortável",
        price: "99.90",
        stock: 20,
        sizes: JSON.stringify(["P", "M", "G", "GG"]),
        isFeatured: true,
      },
      {
        categoryId: categoryMap["calcas"],
        name: "Calça Jeans Premium",
        slug: "calca-jeans-premium",
        description: "Calça jeans premium com acabamento perfeito",
        price: "79.90",
        stock: 35,
        sizes: JSON.stringify(["P", "M", "G", "GG"]),
        isFeatured: false,
      },
      {
        categoryId: categoryMap["promocoes"],
        name: "Blusa Tricô Gola Alta",
        slug: "blusa-trico-gola-alta",
        description: "Blusa em promoção com gola alta",
        price: "39.90",
        stock: 60,
        sizes: JSON.stringify(["P", "M", "G", "GG"]),
        isFeatured: false,
        isPromotion: true,
      },
    ];

    for (const prod of productData) {
      await db.insert(products).values(prod as any).catch(() => {
        // Ignore duplicates
      });
    }
    console.log("✓ Products created");
    console.log("✓ Seed data completed successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

seedData();
