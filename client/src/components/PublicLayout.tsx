import { ReactNode, useState, useEffect } from "react";
import { Link } from "wouter";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

interface PublicLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function PublicLayout({ children, title }: PublicLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const { data: categories } = trpc.categories.list.useQuery();

  // Update cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    
    // Listen to custom cartUpdated event
    window.addEventListener("cartUpdated", updateCartCount);
    
    // Also listen to storage changes for cross-tab sync
    window.addEventListener("storage", updateCartCount);
    
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalog?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Info Bar */}
      <div className="bg-[#D61C5C] text-white text-xs py-2.5 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-center md:justify-between items-center gap-2 text-center md:text-left">
          <div className="flex items-center justify-center gap-2">
            <span>🚚 Frete grátis para todo Brasil</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span>📦 Pedido mínimo: 1 peça</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span>🏭 Preço de Atacado no Varejo</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/">
              <a className="flex flex-col items-center select-none cursor-pointer">
                <div className="text-4xl font-serif font-bold">
                  <span className="text-[#D4AF37]">A</span>
                  <span className="text-[#D61C5C]">UREA</span>
                  <span className="text-[#D4AF37]">A</span>
                </div>
                <span className="text-xs text-[#D61C5C] font-bold tracking-widest">MODA FEMININA</span>
              </a>
            </Link>

            {/* Search Bar - Hidden on mobile */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="flex w-full">
                <Input
                  type="text"
                  placeholder="Digite o que você procura..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-none border-[#D61C5C] focus:border-[#D61C5C]"
                />
                <Button
                  type="submit"
                  className="bg-[#D61C5C] hover:bg-[#B01246] rounded-none"
                >
                  <Search size={18} />
                </Button>
              </div>
            </form>

            {/* Right Menu */}
            <div className="flex items-center gap-4">
              {/* WhatsApp */}
              <a
                href="https://wa.me/552123427064"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 text-sm hover:text-[#D61C5C] transition"
              >
                <span className="text-[#D61C5C]">💬</span>
                <div className="text-xs">
                  <div className="text-gray-500">Atendimento</div>
                  <div className="font-bold">WhatsApp</div>
                </div>
              </a>

              {/* Cart */}
              <Link href="/cart">
                <a className="flex items-center gap-2 text-sm hover:text-[#D61C5C] transition relative">
                  <ShoppingCart size={18} className="text-gray-600" />
                  <span className="text-gray-600">Carrinho</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#D61C5C] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </a>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="md:hidden mt-4">
            <div className="flex w-full">
              <Input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-none border-[#D61C5C] focus:border-[#D61C5C]"
              />
              <Button
                type="submit"
                className="bg-[#D61C5C] hover:bg-[#B01246] rounded-none"
              >
                <Search size={18} />
              </Button>
            </div>
          </form>
        </div>

        {/* Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-50 border-t border-gray-100">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              <Link href="/">
                <a className="block py-2 text-gray-700 hover:text-[#D61C5C]">INÍCIO</a>
              </Link>
              {categories?.map((cat) => (
                <Link key={cat.id} href={`/catalog?category=${cat.slug}`}>
                  <a className="block py-2 text-gray-700 hover:text-[#D61C5C]">
                    {cat.name.toUpperCase()}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Navigation Bar - Desktop */}
      <nav className="hidden md:block bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-8 py-3">
            <Link href="/">
              <a className="text-sm font-bold text-gray-700 hover:text-[#D61C5C] transition uppercase">
                INÍCIO
              </a>
            </Link>
            {categories?.map((cat) => (
              <Link key={cat.id} href={`/catalog?category=${cat.slug}`}>
                <a className="text-sm font-bold text-gray-700 hover:text-[#D61C5C] transition uppercase">
                  {cat.name}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Sobre */}
            <div>
              <h3 className="font-bold mb-4 text-[#D4AF37]">Sobre Nós</h3>
              <p className="text-sm text-gray-400">
                Moda AUREA - Preço de Atacado no Varejo. Roupas de qualidade premium com os melhores preços.
              </p>
            </div>

            {/* Contato */}
            <div>
              <h3 className="font-bold mb-4 text-[#D4AF37]">Contato</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>
                  <a href="tel:+552123427064" className="hover:text-[#D61C5C]">
                    (21) 2342-7064
                  </a>
                </li>
                <li>
                  <a href="mailto:contato@modaaurea.com.br" className="hover:text-[#D61C5C]">
                    contato@modaaurea.com.br
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/552123427064" target="_blank" rel="noopener noreferrer" className="hover:text-[#D61C5C]">
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>

            {/* Endereço */}
            <div>
              <h3 className="font-bold mb-4 text-[#D4AF37]">Endereço</h3>
              <p className="text-sm text-gray-400">
                Av. Perimetral Brigadeiro Lima e Silva, 591<br />
                Duque de Caxias - RJ<br />
                CEP: 25085-131
              </p>
            </div>

            {/* Redes Sociais */}
            <div>
              <h3 className="font-bold mb-4 text-[#D4AF37]">Redes Sociais</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>
                  <a href="https://instagram.com/aureabrasiloficial" target="_blank" rel="noopener noreferrer" className="hover:text-[#D61C5C]">
                    Instagram @aureabrasiloficial
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Links */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/exchange-policy">
                <a className="text-gray-400 hover:text-[#D61C5C]">Política de Trocas</a>
              </Link>
              <Link href="/secure-shopping">
                <a className="text-gray-400 hover:text-[#D61C5C]">Compra Segura</a>
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>CNPJ: 62.582.053/0001-15</p>
            <p className="mt-2">© 2026 Moda AUREA. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
