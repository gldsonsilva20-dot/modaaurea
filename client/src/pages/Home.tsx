import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ShoppingCart, Search, Menu, X, ShieldCheck, Truck, CreditCard, RefreshCw, Star } from "lucide-react";

function getFirstImage(imageUrls: string | null | undefined): string {
  try {
    const parsed = JSON.parse(imageUrls || "[]");
    return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : "";
  } catch {
    return "";
  }
}

function OnlineCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(Math.floor(18 + Math.random() * 30));
    const interval = setInterval(() => {
      setCount((prev) => Math.max(12, Math.min(60, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  if (count === 0) return null;
  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mt-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span><strong className="text-gray-700">{count}</strong> pessoas visitando agora</span>
    </div>
  );
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const { data: categories } = trpc.categories.list.useQuery();
  const { data: featuredProducts } = trpc.products.featured.useQuery();
  const { data: allProducts } = trpc.products.list.useQuery();

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(count);
    };
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalog?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const showcaseProducts = (featuredProducts?.length ? featuredProducts : allProducts)?.slice(0, 8) || [];

  const categoryImageMap: Record<number, string> = {};
  if (allProducts && categories) {
    for (const cat of categories) {
      const produto = allProducts.find((p) => p.categoryId === cat.id);
      if (produto) {
        const img = getFirstImage(produto.imageUrls);
        if (img) categoryImageMap[cat.id] = img;
      }
    }
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── TOP BAR ── */}
      <div className="bg-[#D61C5C] text-white text-xs py-2.5 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-1 text-center">
          <span className="flex items-center gap-1.5">🚚 Frete Grátis para todo o Brasil</span>
          <span className="hidden md:flex items-center gap-1.5">📦 A partir de 1 peça</span>
          <span className="hidden md:flex items-center gap-1.5">💳 Parcele em até 12x</span>
        </div>
      </div>

      {/* ── HEADER ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/">
              <a className="flex flex-col items-center select-none cursor-pointer shrink-0">
                <div className="text-4xl font-serif font-bold leading-none">
                  <span className="text-[#D4AF37]">A</span>
                  <span className="text-[#D61C5C]">UREA</span>
                  <span className="text-[#D4AF37]">A</span>
                </div>
                <span className="text-[10px] text-[#D61C5C] font-bold tracking-[4px] mt-0.5">MODA FEMININA</span>
              </a>
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="flex w-full">
                <Input
                  type="text"
                  placeholder="Digite o que você procura..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-r-none border-gray-300 focus-visible:ring-[#D61C5C] focus-visible:border-[#D61C5C]"
                />
                <Button type="submit" className="bg-[#D61C5C] hover:bg-[#B01246] rounded-l-none px-4">
                  <Search size={18} />
                </Button>
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-5">
              <a
                href="https://wa.me/552123427064"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 text-sm hover:text-[#D61C5C] transition"
              >
                <span className="text-xl">💬</span>
                <div className="text-xs leading-tight">
                  <div className="text-gray-400">Atendimento</div>
                  <div className="font-bold text-gray-700">WhatsApp</div>
                </div>
              </a>
              <Link href="/cart">
                <a className="flex items-center gap-1.5 text-sm hover:text-[#D61C5C] transition relative">
                  <ShoppingCart size={20} className="text-gray-600" />
                  <span className="text-gray-600 font-medium">Carrinho</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 bg-[#D61C5C] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </a>
              </Link>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-700">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <form onSubmit={handleSearch} className="md:hidden mt-3">
            <div className="flex w-full">
              <Input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none border-gray-300"
              />
              <Button type="submit" className="bg-[#D61C5C] hover:bg-[#B01246] rounded-l-none">
                <Search size={18} />
              </Button>
            </div>
          </form>
        </div>

        {/* Nav */}
        <nav className={`border-t border-gray-100 ${isMenuOpen ? "block" : "hidden md:block"}`}>
          <div className="container mx-auto px-4 flex flex-col md:flex-row md:justify-center gap-0 md:gap-6 py-0">
            <Link href="/">
              <a className="block md:inline-block py-3 px-2 text-sm font-bold text-[#D61C5C] uppercase tracking-wider border-b-2 border-[#D61C5C] hover:text-[#B01246] transition">
                Início
              </a>
            </Link>
            {categories?.map((cat) => (
              <Link key={cat.id} href={`/catalog?category=${cat.slug}`}>
                <a className="block md:inline-block py-3 px-2 text-sm font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-transparent hover:text-[#D61C5C] hover:border-[#D61C5C] transition">
                  {cat.name}
                </a>
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* ── HERO BANNER — imagem completa clicável ── */}
      <section className="w-full cursor-pointer" onClick={() => (window.location.href = "/catalog")}>
        <img
          src="/banner-hero.png"
          alt="Moda Feminina com Frete Grátis — Comprar Agora"
          className="w-full h-auto block"
          style={{ maxHeight: "520px", objectFit: "cover", objectPosition: "center top" }}
        />
      </section>

      {/* ── INFO BAR ── */}
      <section className="bg-white border-y border-gray-100 py-7 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { Icon: ShoppingCart,  title: "Pedido Mínimo",    sub: "a partir de 1 peça" },
              { Icon: Truck,         title: "Frete Grátis",     sub: "para todo o Brasil" },
              { Icon: CreditCard,    title: "Pagamento via PIX", sub: "Aprovação imediata" },
              { Icon: ShieldCheck,   title: "Compra 100% Segura", sub: "Seus dados protegidos" },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center">
                  <item.Icon size={24} className="text-[#D61C5C]" strokeWidth={1.5} />
                </div>
                <p className="text-xs font-bold text-gray-900 leading-tight">{item.title}</p>
                <p className="text-xs text-gray-400 leading-tight">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOSSAS CATEGORIAS ── */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-widest">
              Nossas Categorias
            </h2>
            <div className="flex items-center justify-center gap-4 mt-3">
              <div className="w-12 h-px bg-gray-200"></div>
              <span className="text-[#D61C5C] text-lg">♥</span>
              <div className="w-12 h-px bg-gray-200"></div>
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
            {categories?.map((cat) => {
              const img = categoryImageMap[cat.id];
              return (
                <Link key={cat.id} href={`/catalog?category=${cat.slug}`}>
                  <a className="group text-center hover:opacity-90 transition cursor-pointer">
                    <div className="rounded-xl aspect-square mb-2 overflow-hidden relative shadow-sm border border-pink-50">
                      {img ? (
                        <>
                          <img
                            src={img}
                            alt={cat.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-pink-50 flex items-center justify-center">
                          <span className="text-4xl">👗</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">{cat.name}</p>
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BANNER CTA ROSA ── */}
      <section className="bg-[#D61C5C] py-10 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-white/20 rounded-full p-4 hidden md:flex items-center justify-center">
              <ShoppingCart size={32} className="text-white" strokeWidth={1.5} />
            </div>
            <div className="text-white text-center md:text-left">
              <p className="text-xl md:text-2xl font-bold">Qualidade Premium na Moda AUREA!</p>
              <p className="text-sm opacity-80 mt-1">Peças selecionadas para você se sentir incrível.</p>
            </div>
          </div>
          <Button
            onClick={() => (window.location.href = "/catalog?category=promocoes")}
            className="bg-white text-[#D61C5C] hover:bg-gray-100 font-bold uppercase tracking-wider px-8 py-5 text-sm shrink-0 shadow-md"
          >
            Ver Promoções →
          </Button>
        </div>
      </section>

      {/* ── MAIS VENDIDOS ── */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-widest">
              Mais Vendidos
            </h2>
            <div className="flex items-center justify-center gap-4 mt-3">
              <div className="w-12 h-px bg-gray-200"></div>
              <span className="text-[#D61C5C] text-lg">♥</span>
              <div className="w-12 h-px bg-gray-200"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {showcaseProducts.slice(0, 5).map((product) => {
              const img = getFirstImage(product.imageUrls);
              return (
                <Link key={product.id} href={`/product/${product.slug}`}>
                  <a className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 block">
                    <div className="aspect-square overflow-hidden bg-gray-100 relative">
                      {img ? (
                        <img
                          src={img}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl bg-pink-50">👗</div>
                      )}
                      <span className="absolute top-2 left-2 bg-[#D61C5C] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                        Mais Vendido
                      </span>
                      {product.isPromotion && (
                        <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">
                          Promoção
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 leading-tight">{product.name}</p>
                      <p className="text-base text-[#D61C5C] font-bold">
                        R$ {parseFloat(product.price).toFixed(2).replace(".", ",")}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-400">A partir de 1 peça</p>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = `/product/${product.slug}`;
                          }}
                          className="bg-[#D61C5C] hover:bg-[#B01246] text-white p-1.5 rounded-md transition"
                        >
                          <ShoppingCart size={14} />
                        </button>
                      </div>
                    </div>
                  </a>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Button
              onClick={() => (window.location.href = "/catalog")}
              className="bg-[#D61C5C] hover:bg-[#B01246] text-white px-10 py-5 font-bold uppercase tracking-wider"
            >
              Ver Coleção Completa →
            </Button>
          </div>
        </div>
      </section>

      {/* ── RODAPÉ TRUST ICONS ── */}
      <section className="bg-white border-t border-gray-100 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { Icon: ShieldCheck, title: "Compra Segura",        sub: "Seus dados protegidos" },
              { Icon: ShoppingCart, title: "Atendimento",          sub: "Via WhatsApp" },
              { Icon: RefreshCw,   title: "Trocas e Devoluções",  sub: "Até 7 dias após o recebimento" },
              { Icon: Star,        title: "Qualidade Premium",    sub: "Peças selecionadas" },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center">
                  <item.Icon size={24} className="text-[#D61C5C]" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-bold text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-400">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-3xl font-serif font-bold mb-2 leading-none">
                <span className="text-[#D4AF37]">A</span>
                <span className="text-[#D61C5C]">UREA</span>
                <span className="text-[#D4AF37]">A</span>
              </div>
              <p className="text-gray-400 text-sm mt-1">Moda Feminina com Frete Grátis</p>
              <p className="text-xs text-gray-600 mt-2">CNPJ: 62.582.053/0001-15</p>
            </div>
            <div>
              <h3 className="font-bold mb-4 uppercase text-sm tracking-wider">Contato</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📧 contato@modaaurea.com.br</li>
                <li>📱 (21) 2342-7064</li>
                <li>
                  <a href="https://wa.me/552123427064" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                    💬 WhatsApp
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 uppercase text-sm tracking-wider">Redes Sociais</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://instagram.com/aureabrasiloficial" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                    📸 @aureabrasiloficial
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
            <p>&copy; 2026 Moda AUREA. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
