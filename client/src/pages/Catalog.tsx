import { useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import PublicLayout from "@/components/PublicLayout";
import { Filter } from "lucide-react";

function getFirstImage(imageUrls: string | null | undefined): string {
  try {
    const parsed = JSON.parse(imageUrls || "[]");
    return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : "";
  } catch {
    return "";
  }
}

export default function Catalog() {
  const [, navigate] = useLocation();
  const search = useSearch(); // ✅ reativo no wouter
  const [sortBy, setSortBy] = useState<string>("newest");
  const [showFilters, setShowFilters] = useState(false);

  const params = new URLSearchParams(search);
  const selectedCategory = params.get("category") || "";
  const searchQuery = params.get("search") || "";

  const { data: categories } = trpc.categories.list.useQuery();
  const { data: allProducts } = trpc.products.list.useQuery();

  const resolvedCategoryId: string | null | undefined = (() => {
    if (!selectedCategory) return null;
    if (!categories) return undefined;
    const found = categories.find(
      (c) => c.slug === selectedCategory || c.id.toString() === selectedCategory
    );
    return found ? found.id.toString() : "NOT_FOUND";
  })();

  const filteredProducts = (() => {
    if (!allProducts) return [];
    if (resolvedCategoryId === undefined) return [];
    return allProducts.filter((p) => {
      if (resolvedCategoryId === "NOT_FOUND") return false;
      const matchCategory =
        resolvedCategoryId === null || p.categoryId.toString() === resolvedCategoryId;
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  })();

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc": return parseFloat(a.price) - parseFloat(b.price);
      case "price-desc": return parseFloat(b.price) - parseFloat(a.price);
      case "name": return a.name.localeCompare(b.name);
      default: return b.id - a.id;
    }
  });

  const handleCategoryChange = (catId: string) => {
    const cat = categories?.find((c) => c.id.toString() === catId);
    const slug = cat?.slug || catId;
    const isActive = resolvedCategoryId === catId;
    const newParams = new URLSearchParams(search);
    if (isActive) {
      newParams.delete("category");
    } else {
      newParams.set("category", slug);
    }
    navigate(`/catalog${newParams.toString() ? "?" + newParams.toString() : ""}`);
  };

  const handleClearFilters = () => {
    navigate("/catalog");
    setSortBy("newest");
  };

  const activeCategory = categories?.find(
    (c) => c.slug === selectedCategory || c.id.toString() === selectedCategory
  );

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-64 flex-shrink-0`}>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Filtros</h3>
                {(selectedCategory || searchQuery) && (
                  <button onClick={handleClearFilters} className="text-xs text-[#D61C5C] hover:underline">
                    Limpar
                  </button>
                )}
              </div>
              <div className="mb-6">
                <h4 className="font-bold text-sm mb-3 uppercase">Categorias</h4>
                <div className="space-y-2">
                  {categories?.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={resolvedCategoryId === cat.id.toString()}
                        onChange={() => handleCategoryChange(cat.id.toString())}
                        className="w-4 h-4 accent-[#D61C5C]"
                      />
                      <span className="text-sm">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-3 uppercase">Ordenar por</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  <option value="newest">Mais Recentes</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="name">Nome (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden mb-4 flex items-center gap-2 px-4 py-2 border border-gray-300 rounded"
            >
              <Filter size={18} /> Filtros
            </button>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {activeCategory
                  ? activeCategory.name
                  : selectedCategory
                  ? "Carregando..."
                  : "Todos os Produtos"}
              </h1>
              <p className="text-gray-600">
                {resolvedCategoryId === undefined
                  ? "Carregando..."
                  : `${sortedProducts.length} produto${sortedProducts.length !== 1 ? "s" : ""} encontrado${sortedProducts.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sortedProducts.map((product) => {
                  const imgUrl = getFirstImage(product.imageUrls);
                  return (
                    <Link key={product.id} href={`/product/${product.slug}`}>
                      <a className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100">
                        <div className="aspect-square overflow-hidden bg-gray-100 relative">
                          {imgUrl ? (
                            <img src={imgUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">👕</div>
                          )}
                          {product.isPromotion && (
                            <span className="absolute top-2 left-2 bg-[#D61C5C] text-white text-xs font-bold px-2 py-1 rounded-full">
                              PROMOÇÃO
                            </span>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">{product.name}</p>
                          <p className="text-base text-[#D61C5C] font-bold">R$ {parseFloat(product.price).toFixed(2)}</p>
                          <p className="text-xs text-gray-400 mt-0.5">A partir de 1 peça</p>
                        </div>
                      </a>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">
                  {resolvedCategoryId === undefined
                    ? "Carregando produtos..."
                    : resolvedCategoryId === "NOT_FOUND"
                    ? "Categoria não encontrada."
                    : "Nenhum produto encontrado."}
                </p>
                <Link href="/catalog">
                  <a>
                    <Button className="bg-[#D61C5C] hover:bg-[#B01246] text-white">Ver Todos os Produtos</Button>
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}