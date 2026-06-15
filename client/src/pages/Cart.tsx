import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import PublicLayout from "@/components/PublicLayout";
import { toast } from "sonner";
import { ShoppingCart, Trash2, Tag, ShieldCheck, Truck, RefreshCw, Zap, ChevronRight, Plus } from "lucide-react";
import { Link } from "wouter";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface CartItem {
  id: number;
  name: string;
  price: string;
  costPrice?: string;
  quantity: number;
  imageUrls?: string;
  size?: string;
  color?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getFirstImage(imageUrls: string | null | undefined): string {
  try {
    const parsed = JSON.parse(imageUrls || "[]");
    return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : "";
  } catch { return ""; }
}

const COR_NOMES: Record<string, string> = {
  "#000000": "Preto", "#FFFFFF": "Branco", "#FFC0CB": "Rosa Claro",
  "#FF69B4": "Rosa Pink", "#8B0000": "Vermelho Escuro", "#D2B48C": "Caramelo",
  "#F5F5DC": "Bege", "#808080": "Cinza", "#FF0000": "Vermelho",
  "#0000FF": "Azul", "#008000": "Verde", "#FFFF00": "Amarelo",
  "#800080": "Roxo", "#FFA500": "Laranja", "#A52A2A": "Marrom",
};
function getNomeCor(cor: string): string {
  if (!cor) return "";
  const upper = cor.toUpperCase();
  if (COR_NOMES[upper]) return COR_NOMES[upper];
  if (!cor.startsWith("#")) return cor;
  return "Colorido";
}

// ─── Timer de urgência ────────────────────────────────────────────────────────
function UrgencyTimer() {
  const [seconds, setSeconds] = useState(599);
  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s > 0 ? s - 1 : 599), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
      <span className="text-xl">⏱️</span>
      <div>
        <p className="text-xs font-bold text-amber-800">Seu carrinho está reservado por:</p>
        <p className="text-lg font-black text-amber-700 tabular-nums">{mm}:{ss}</p>
      </div>
    </div>
  );
}

// ─── Barra de benefícios ──────────────────────────────────────────────────────
function BenefitBar() {
  const items = [
    { icon: <Truck size={20} className="text-[#D61C5C]" />, label: "Frete Grátis", sub: "Para todo Brasil" },
    { icon: <ShieldCheck size={20} className="text-[#D61C5C]" />, label: "Compra Segura", sub: "SSL 256-bit" },
    { icon: <RefreshCw size={20} className="text-[#D61C5C]" />, label: "Troca Grátis", sub: "Sem burocracia" },
    { icon: <Zap size={20} className="text-[#D61C5C]" />, label: "PIX Instantâneo", sub: "Aprovação na hora" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {items.map((b, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-3 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
            {b.icon}
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">{b.label}</p>
            <p className="text-xs text-gray-400">{b.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Bloco PIX ────────────────────────────────────────────────────────────────
function BlocoPix({ total }: { total: number }) {
  return (
    <div className="rounded-2xl overflow-hidden border-2 border-[#32BCAD]">
      <div className="bg-gradient-to-r from-[#32BCAD] to-[#1a9e90] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L13.5 5.5L10 9L6.5 5.5L10 2Z" fill="white"/>
              <path d="M18 10L14.5 13.5L11 10L14.5 6.5L18 10Z" fill="white"/>
              <path d="M10 18L6.5 14.5L10 11L13.5 14.5L10 18Z" fill="white"/>
              <path d="M2 10L5.5 6.5L9 10L5.5 13.5L2 10Z" fill="white"/>
            </svg>
          </div>
          <div>
            <p className="font-black text-white text-sm">PIX — Banco Central do Brasil</p>
            <p className="text-white/70 text-xs">Pagamento instantâneo</p>
          </div>
        </div>
        <span className="bg-white text-[#32BCAD] text-xs font-black px-3 py-1 rounded-full">✓ ATIVO</span>
      </div>
      <div className="bg-white p-5 space-y-3">
        <div className="grid grid-cols-3 gap-3">
          {[
            { emoji: "⚡", label: "Aprovação", sub: "Instantânea" },
            { emoji: "🔒", label: "100%", sub: "Seguro" },
            { emoji: "💸", label: "Sem taxas", sub: "adicionais" },
          ].map((x, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{x.emoji}</div>
              <p className="text-xs font-bold text-gray-800">{x.label}</p>
              <p className="text-xs text-gray-500">{x.sub}</p>
            </div>
          ))}
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
          <span className="text-green-600 font-bold text-sm">✓</span>
          <span className="text-green-800 text-xs font-semibold">Pague com qualquer banco com PIX habilitado</span>
        </div>
      </div>
    </div>
  );
}

// ─── Depoimento rotativo ──────────────────────────────────────────────────────
const DEPOIMENTOS = [
  { nome: "Melissa Silva",   cidade: "São Paulo, SP",      texto: "Amei! Chegou super rápido e a qualidade é incrível.",        estrelas: 5 },
  { nome: "Fernanda Lima",   cidade: "Rio de Janeiro, RJ", texto: "Qualidade incrível pelo preço! Já é meu segundo pedido.",    estrelas: 5 },
  { nome: "Camila Rocha",    cidade: "Belo Horizonte, MG", texto: "Tecido excelente e entrega super rápida. Recomendo demais!", estrelas: 5 },
  { nome: "Juliana Costa",   cidade: "Fortaleza, CE",      texto: "Amei o vestido! Ficou perfeito e o frete realmente é grátis.", estrelas: 5 },
  { nome: "Patrícia Souza",  cidade: "Curitiba, PR",       texto: "Atendimento ótimo e produto chegou bem embalado. Voltarei!", estrelas: 5 },
];

function DepoimentoRotativo() {
  const [atual, setAtual] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setAtual(p => (p + 1) % DEPOIMENTOS.length), 4000);
    return () => clearInterval(t);
  }, []);
  const d = DEPOIMENTOS[atual];
  return (
    <div className="bg-white rounded-2xl border border-pink-100 p-4 shadow-sm">
      <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 text-center">💬 O que dizem nossas clientes</p>
      <div key={atual} className="transition-all duration-500">
        <div className="flex gap-0.5 mb-2">
          {"★★★★★".split("").map((s, i) => <span key={i} className="text-amber-400 text-sm">{s}</span>)}
        </div>
        <p className="text-sm text-gray-600 italic leading-relaxed mb-3">"{d.texto}"</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-gray-900">{d.nome}</p>
            <p className="text-xs text-gray-400">{d.cidade}</p>
          </div>
          <div className="flex gap-1.5">
            {DEPOIMENTOS.map((_, i) => (
              <button key={i} onClick={() => setAtual(i)}
                className={`rounded-full transition-all duration-300 ${i === atual ? "bg-[#D61C5C] w-4 h-2" : "bg-gray-200 w-2 h-2"}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [document, setDocument] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [complement, setComplement] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkoutMutation = trpc.orders.checkout.useMutation();
  const { data: suggestedProducts } = trpc.products.list.useQuery({ limit: 3 });

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(items);
  }, []);

  const totalPrice = cartItems.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
  const totalItems  = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const removeItem = (index: number) => {
    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const addSuggestedToCart = (prod: any) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const sizes = prod.sizes ? JSON.parse(prod.sizes) : [];
    const colors = prod.colors ? JSON.parse(prod.colors) : [];
    cart.push({ ...prod, size: sizes[0] || "", color: colors[0] || "", quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    setCartItems(cart);
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${prod.name} adicionado! 🛍️`);
  };

  const handleCepChange = async (cep: string) => {
    const cleaned = cep.replace(/\D/g, "");
    const formatted = cleaned.length > 5 ? cleaned.slice(0, 5) + "-" + cleaned.slice(5, 8) : cleaned;
    setZipCode(formatted);
    if (cleaned.length === 8) {
      setLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setAddress(data.logradouro || "");
          setNeighborhood(data.bairro || "");
          setCity(data.localidade || "");
          setState(data.uf || "");
          toast.success("Endereço preenchido! ✅");
        } else toast.error("CEP não encontrado.");
      } catch { toast.error("Erro ao buscar CEP."); }
      finally { setLoadingCep(false); }
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) { toast.error("Seu carrinho está vazio!"); return; }
    setIsSubmitting(true);

    // ─── Meta Pixel - InitiateCheckout ────────────────────────────────────
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        value: totalPrice,
        currency: 'BRL',
        num_items: totalItems,
      });
    }

    try {
      const fullAddress = `${address}${complement ? ", " + complement : ""}, ${neighborhood}, ${city} - ${state}, CEP: ${zipCode}`;

      // ─── Coleta UTMs do sessionStorage ───────────────────────────────────
      const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "sck", "src"];
      const utmParams = new URLSearchParams();
      utmKeys.forEach(k => {
        const v = sessionStorage.getItem(k);
        if (v) utmParams.set(k, v);
      });
      // Fallback: tenta window.utmify
      if (typeof (window as any).utmify?.getParam === "function") {
        utmKeys.forEach(k => {
          const v = (window as any).utmify.getParam(k);
          if (v && !utmParams.has(k)) utmParams.set(k, v);
        });
      }

      const checkoutUrl = await checkoutMutation.mutateAsync({
        customerName,
        customerEmail,
        customerPhone,
        document,
        address: fullAddress,
        city,
        state,
        zipCode,
        totalPrice: totalPrice.toFixed(2),
        paymentMethod: "pix",
        items: JSON.stringify(cartItems),
        utmParams: utmParams.toString(),
      });

      if (checkoutUrl) window.location.href = checkoutUrl;

    } catch {
      toast.error("Erro ao processar pagamento.");
      setIsSubmitting(false);
    }
  };

  const cartIds = cartItems.map(i => i.id);
  const upsellProducts = (suggestedProducts?.products || []).filter((p: any) => !cartIds.includes(p.id)).slice(0, 3);

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">

        <div className="flex items-center gap-3 mb-6">
          <ShoppingCart className="w-7 h-7 text-[#D61C5C]" />
          <h1 className="text-2xl font-extrabold text-gray-900">Finalizar Pedido</h1>
          {totalItems > 0 && (
            <span className="bg-[#D61C5C] text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {totalItems} {totalItems === 1 ? "item" : "itens"}
            </span>
          )}
        </div>

        <BenefitBar />

        {cartItems.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <ShoppingCart size={64} className="mx-auto mb-4 text-gray-200" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">Seu carrinho está vazio</h2>
            <p className="text-gray-400 mb-6">Que tal adicionar algumas peças incríveis?</p>
            <Link href="/catalog">
              <a className="inline-flex items-center gap-2 bg-[#D61C5C] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#B01246] transition">
                Ver produtos <ChevronRight size={16} />
              </a>
            </Link>
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── COLUNA ESQUERDA: formulário ── */}
            <div className="lg:col-span-2 space-y-5">

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h2 className="font-extrabold text-base text-gray-800 flex items-center gap-2">
                  <span className="w-7 h-7 bg-pink-50 rounded-lg flex items-center justify-center text-sm">👤</span>
                  Dados do Cliente
                </h2>
                <Input placeholder="Nome Completo *" value={customerName} onChange={e => setCustomerName(e.target.value)} required />
                <div className="grid grid-cols-2 gap-3">
                  <Input type="email" placeholder="E-mail *" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} required />
                  <Input placeholder="WhatsApp *" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} required />
                </div>
                <Input placeholder="CPF ou CNPJ *" value={document} onChange={e => setDocument(e.target.value)} required />
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h2 className="font-extrabold text-base text-gray-800 flex items-center gap-2">
                  <span className="w-7 h-7 bg-pink-50 rounded-lg flex items-center justify-center text-sm">📦</span>
                  Endereço de Entrega
                </h2>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block uppercase tracking-wide">CEP *</label>
                  <div className="relative">
                    <Input placeholder="00000-000" value={zipCode}
                      onChange={e => handleCepChange(e.target.value)}
                      maxLength={9} required
                      className="text-base font-bold border-[#D61C5C] focus:border-[#D61C5C]" />
                    {loadingCep && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#D61C5C] font-semibold animate-pulse">
                        Buscando...
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Digite o CEP para preencher automaticamente</p>
                </div>
                <Input placeholder="Rua / Avenida *" value={address} onChange={e => setAddress(e.target.value)} required />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Número e Complemento" value={complement} onChange={e => setComplement(e.target.value)} />
                  <Input placeholder="Bairro" value={neighborhood} onChange={e => setNeighborhood(e.target.value)} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Input placeholder="Cidade *" value={city} onChange={e => setCity(e.target.value)} className="col-span-2" required />
                  <Input placeholder="UF *" value={state} onChange={e => setState(e.target.value)} maxLength={2} required />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h2 className="font-extrabold text-base text-gray-800 flex items-center gap-2">
                  <span className="w-7 h-7 bg-pink-50 rounded-lg flex items-center justify-center text-sm">💳</span>
                  Forma de Pagamento
                </h2>
                <BlocoPix total={totalPrice} />
              </div>

              <form onSubmit={handleCheckout}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 rounded-2xl font-black text-lg text-white shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
                  style={{
                    background: isSubmitting
                      ? "#e5e7eb"
                      : "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
                    color: isSubmitting ? "#9ca3af" : "white",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M11 2L14 5L11 8L8 5L11 2Z" fill="#32BCAD"/>
                    <path d="M20 11L17 14L14 11L17 8L20 11Z" fill="#32BCAD"/>
                    <path d="M11 20L8 17L11 14L14 17L11 20Z" fill="#32BCAD"/>
                    <path d="M2 11L5 8L8 11L5 14L2 11Z" fill="#32BCAD"/>
                  </svg>
                  {isSubmitting ? "Processando..." : `PAGAR COM PIX — ${fmt(totalPrice)}`}
                  {!isSubmitting && <ChevronRight size={20} />}
                </button>
                <p className="text-center text-xs text-gray-400 mt-2">
                  🔒 Ambiente seguro — seus dados são criptografados
                </p>
              </form>
            </div>

            {/* ── COLUNA DIREITA: resumo ── */}
            <div className="space-y-4">

              <UrgencyTimer />

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="font-extrabold text-sm text-gray-700 mb-4 uppercase tracking-wide">
                  🛍️ Seu pedido ({totalItems} {totalItems === 1 ? "item" : "itens"})
                </h2>
                <div className="space-y-4">
                  {cartItems.map((item, index) => {
                    const img = getFirstImage(item.imageUrls);
                    const preco = parseFloat(item.price);
                    const precoOriginal = item.costPrice ? parseFloat(item.costPrice) : null;
                    const desconto = precoOriginal && precoOriginal > preco
                      ? Math.round(((precoOriginal - preco) / precoOriginal) * 100) : null;
                    return (
                      <div key={index} className="flex gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {img
                            ? <img src={img} alt={item.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-2xl">👗</div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-800 line-clamp-2">{item.name}</p>
                          {(item.size || item.color) && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {item.size && `Tam: ${item.size}`}
                              {item.size && item.color && " · "}
                              {item.color && `Cor: ${getNomeCor(item.color)}`}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-sm font-black text-[#D61C5C]">{fmt(preco)}</span>
                            {precoOriginal && precoOriginal > preco && (
                              <span className="text-xs text-gray-400 line-through">{fmt(precoOriginal)}</span>
                            )}
                            {desconto && (
                              <span className="text-xs bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                <Tag size={9} /> -{desconto}%
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">Qtd: {item.quantity} · Subtotal: {fmt(preco * item.quantity)}</p>
                        </div>
                        <button onClick={() => removeItem(index)} className="text-gray-300 hover:text-red-400 transition flex-shrink-0 mt-1">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2.5">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span><span>{fmt(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-green-600">
                  <span>🚚 Frete</span><span>GRÁTIS</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-extrabold text-lg">
                  <span>Total</span>
                  <span className="text-[#D61C5C]">{fmt(totalPrice)}</span>
                </div>
              </div>

              {upsellProducts.length > 0 && (
                <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-4">
                  <p className="text-xs font-black text-amber-700 uppercase tracking-wide mb-3 flex items-center gap-1">
                    🎁 Complete seu look — frete já incluso!
                  </p>
                  <div className="space-y-3">
                    {upsellProducts.map((prod: any) => {
                      const img = getFirstImage(prod.imageUrls);
                      const preco = parseFloat(prod.price);
                      return (
                        <div key={prod.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            {img
                              ? <img src={img} alt={prod.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-xl">👗</div>
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-800 line-clamp-1">{prod.name}</p>
                            <p className="text-sm font-black text-[#D61C5C]">{fmt(preco)}</p>
                          </div>
                          <button
                            onClick={() => addSuggestedToCart(prod)}
                            className="w-8 h-8 rounded-xl bg-[#D61C5C] text-white flex items-center justify-center hover:bg-[#B01246] transition flex-shrink-0"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <DepoimentoRotativo />

            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
