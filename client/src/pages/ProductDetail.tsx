import { useState, useEffect, useRef } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import PublicLayout from "@/components/PublicLayout";
import { toast } from "sonner";
import { ShieldCheck, Truck, Star, X, ShoppingBag, ChevronRight, Plus } from "lucide-react";

const REVIEWS = [
  { name: "Melissa S.",   city: "São Paulo, SP",      text: "Amei! Chegou super rápido e a qualidade é incrível. Já quero mais peças!", stars: 5, time: "há 2 dias" },
  { name: "Carla R.",     city: "Rio de Janeiro, RJ", text: "Perfeito! O tecido é lindo e o tamanho ficou certinho. Recomendo demais!", stars: 5, time: "há 3 dias" },
  { name: "Fernanda C.",  city: "Belo Horizonte, MG", text: "Chegou em 3 dias, embalagem cuidadosa. A peça é ainda mais bonita!", stars: 5, time: "há 5 dias" },
  { name: "Juliana M.",   city: "Curitiba, PR",       text: "Frete grátis e qualidade premium. Comprei 3 peças, todas maravilhosas!", stars: 5, time: "há 1 semana" },
  { name: "Patrícia A.",  city: "Fortaleza, CE",       text: "Atendimento nota 10 e produto incrível. Indiquei para todas as amigas!", stars: 5, time: "há 1 semana" },
  { name: "Ana Paula L.", city: "Salvador, BA",        text: "Qualidade muito acima do esperado pelo preço. Comprarei sempre aqui.",   stars: 5, time: "há 2 semanas" },
];

function StarRating({ n }: { n: number }) {
  return <span className="text-yellow-400 text-sm">{"★".repeat(n)}{"☆".repeat(5 - n)}</span>;
}

// ─── Prova social na página ────────────────────────────────────────────────
function SocialProof() {
  const [idx, setIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timer.current = setInterval(() => setIdx(i => (i + 1) % REVIEWS.length), 3500);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, []);

  const r = REVIEWS[idx];

  return (
    <div className="bg-white border-t border-gray-100 py-10 mt-4">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-xl font-extrabold text-center mb-6 text-gray-800">⭐ O que nossas clientes dizem</h2>
        <div key={idx} className="bg-gradient-to-br from-pink-50 to-white rounded-2xl shadow p-6 border border-pink-100 transition-all duration-500">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#D61C5C] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              {r.name[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="font-bold text-gray-900">{r.name}</span>
                <span className="text-xs text-gray-400">{r.time}</span>
              </div>
              <div className="text-xs text-gray-500 mb-1">{r.city}</div>
              <StarRating n={r.stars} />
              <p className="text-gray-700 mt-2 text-sm leading-relaxed">"{r.text}"</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-4">
          {REVIEWS.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`h-2 rounded-full transition-all ${i === idx ? "bg-[#D61C5C] w-5" : "bg-gray-300 w-2"}`} />
          ))}
        </div>
        <div className="flex justify-center gap-6 mt-6 flex-wrap">
          <span className="text-sm text-gray-500">✅ <strong>+2.400</strong> clientes satisfeitas</span>
          <span className="text-sm text-gray-500">⭐ Avaliação <strong>4,9/5</strong></span>
          <span className="text-sm text-gray-500">🚚 <strong>98%</strong> entregas no prazo</span>
        </div>
      </div>
    </div>
  );
}

// ─── Mini prova social dentro do Drawer ───────────────────────────────────
function DrawerReview() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % REVIEWS.length), 4000);
    return () => clearInterval(t);
  }, []);
  const r = REVIEWS[idx];
  return (
    <div className="mx-4 mb-3 bg-gradient-to-br from-pink-50 to-white border border-pink-100 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-full bg-[#D61C5C] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
          {r.name[0]}
        </div>
        <div>
          <span className="font-bold text-xs text-gray-800">{r.name}</span>
          <span className="text-gray-400 text-xs"> · {r.city}</span>
        </div>
        <StarRating n={r.stars} />
      </div>
      <p className="text-xs text-gray-600 italic leading-relaxed">"{r.text}"</p>
      <p className="text-xs text-gray-400 mt-1">{r.time}</p>
    </div>
  );
}

// ─── Drawer de carrinho ────────────────────────────────────────────────────
interface DrawerProps {
  open: boolean;
  onClose: () => void;
  product: any;
  size: string;
  color: string;
  price: string;
}

function CartDrawer({ open, onClose, product, size, color, price }: DrawerProps) {
  const formattedPrice = parseFloat(price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-[#D61C5C] text-white flex-shrink-0">
          <div className="flex items-center gap-2 font-bold text-lg">
            <ShoppingBag size={20} /> Adicionado ao carrinho!
          </div>
          <button onClick={onClose} className="hover:opacity-75 transition"><X size={22} /></button>
        </div>

        {/* Produto */}
        <div className="p-4 flex gap-4 items-center border-b flex-shrink-0">
          {product?.imageUrls && (() => {
            try {
              const imgs = JSON.parse(product.imageUrls);
              return imgs[0] ? (
                <img src={imgs[0]} alt={product.name} className="w-20 h-20 object-cover rounded-xl border flex-shrink-0" />
              ) : null;
            } catch { return null; }
          })()}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 leading-tight truncate">{product?.name}</p>
            <p className="text-sm text-gray-500 mt-0.5">Tam: {size} &nbsp;|&nbsp; Cor selecionada</p>
            <p className="text-xl font-black text-[#D61C5C] mt-1">{formattedPrice}</p>
          </div>
        </div>

        {/* Incentivo upsell */}
        <div className="mx-4 mt-3 mb-2 bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center gap-3 flex-shrink-0">
          <span className="text-2xl flex-shrink-0">🎁</span>
          <div>
            <p className="text-sm font-bold text-yellow-800">Leve mais e economize!</p>
            <p className="text-xs text-yellow-700">Frete grátis para qualquer quantidade de peças.</p>
          </div>
        </div>

        {/* Frete grátis */}
        <div className="mx-4 mb-3 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 flex-shrink-0">
          <span className="text-green-600 text-lg flex-shrink-0">🚚</span>
          <p className="text-sm font-semibold text-green-800">Frete grátis para todo o Brasil!</p>
        </div>

        {/* ★ Prova social rotativa */}
        <DrawerReview />

        {/* Badges de confiança */}
        <div className="flex justify-around mx-4 mb-3 flex-shrink-0">
          <div className="text-center">
            <div className="text-base">🔒</div>
            <div className="text-[10px] text-gray-500 font-medium">Seguro</div>
          </div>
          <div className="text-center">
            <div className="text-base">💳</div>
            <div className="text-[10px] text-gray-500 font-medium">PIX</div>
          </div>
          <div className="text-center">
            <div className="text-base">🔄</div>
            <div className="text-[10px] text-gray-500 font-medium">Troca grátis</div>
          </div>
          <div className="text-center">
            <div className="text-base">⭐</div>
            <div className="text-[10px] text-gray-500 font-medium">4,9/5</div>
          </div>
        </div>

        {/* Botões */}
        <div className="p-4 pt-2 pb-6 border-t space-y-3 flex-shrink-0">
          <button
            onClick={() => { window.location.href = "/cart"; }}
            className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 shadow-lg"
            style={{ background: "linear-gradient(135deg, #D61C5C 0%, #9b1a42 100%)" }}
          >
            FINALIZAR COMPRA <ChevronRight size={18} />
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold border-2 border-gray-200 text-gray-700 text-sm hover:bg-gray-50 flex items-center justify-center gap-2 transition"
          >
            <Plus size={16} /> Continuar comprando
          </button>
        </div>

      </div>
    </>
  );
}

// ─── Banner de Medidas ─────────────────────────────────────────────────────
function SizeGuideBanner() {
  const sizes = [
    { size: "P",  peito: "88–96",   cintura: "72–80",   quadril: "90–98"  },
    { size: "M",  peito: "96–104",  cintura: "80–88",   quadril: "98–106" },
    { size: "G",  peito: "104–112", cintura: "88–96",   quadril: "106–114"},
    { size: "GG", peito: "112–120", cintura: "96–104",  quadril: "114–122"},
    { size: "G1", peito: "116–124", cintura: "100–108", quadril: "118–126"},
    { size: "G2", peito: "120–128", cintura: "104–112", quadril: "122–130"},
    { size: "G3", peito: "128–136", cintura: "112–120", quadril: "130–138"},
    { size: "G4", peito: "136–144", cintura: "120–128", quadril: "138–146"},
  ];

  return (
    <div className="bg-pink-50 border-t border-pink-200 py-10 mt-4">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-xl font-extrabold text-center mb-2 text-gray-800">📏 Guia de Medidas</h2>
        <p className="text-center text-sm text-gray-500 mb-6">Todas as medidas em centímetros (cm)</p>
        <div className="overflow-x-auto rounded-2xl shadow border border-pink-200">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#D61C5C" }} className="text-white">
                <th className="py-3 px-4 text-left font-bold">Tamanho</th>
                <th className="py-3 px-4 text-center font-bold">Peito</th>
                <th className="py-3 px-4 text-center font-bold">Cintura</th>
                <th className="py-3 px-4 text-center font-bold">Quadril</th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((row, i) => (
                <tr key={row.size} className={i % 2 === 0 ? "bg-white" : "bg-pink-50"}>
                  <td className="py-3 px-4 font-bold text-[#D61C5C]">{row.size}</td>
                  <td className="py-3 px-4 text-center text-gray-700">{row.peito} cm</td>
                  <td className="py-3 px-4 text-center text-gray-700">{row.cintura} cm</td>
                  <td className="py-3 px-4 text-center text-gray-700">{row.quadril} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          💡 Dica: meça seu corpo e compare com a tabela para escolher o tamanho ideal.
        </p>
      </div>
    </div>
  );
}

// ─── Página principal ──────────────────────────────────────────────────────
export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const slug = params?.slug as string;
  const { data: product, isLoading } = trpc.products.getBySlug.useQuery({ slug }, { enabled: !!slug });

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ─── Salva UTMs no sessionStorage ao entrar na página ───────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "sck", "src"];
    utmKeys.forEach(key => {
      const val = params.get(key);
      if (val) sessionStorage.setItem(key, val);
    });
  }, []);

  const handleBuyNow = () => {
    if (!selectedSize) return toast.error("Selecione um tamanho!");
    if (!selectedColor) return toast.error("Selecione uma cor!");
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({ ...product, size: selectedSize, color: selectedColor, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    // ─── Meta Pixel - AddToCart ───────────────────────────────────────────
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq('track', 'AddToCart', {
        content_name: product?.name,
        content_type: 'product',
        value: parseFloat(product?.price || "0"),
        currency: 'BRL',
      });
    }

    setDrawerOpen(true);
  };

  if (isLoading) return <PublicLayout><div className="p-8 text-center">Carregando produto...</div></PublicLayout>;
  if (!product) return <PublicLayout><div className="p-8 text-center">Produto não encontrado.</div></PublicLayout>;

  const sizes: string[] = product.sizes ? JSON.parse(product.sizes as string) : [];
  const colors: string[] = product.colors ? JSON.parse(product.colors as string) : [];

  const images: string[] = (() => {
    try {
      const parsed = JSON.parse(product.imageUrls as string || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  })();

  const mainImage = images[activeImg] || "";
  const cleanDescription = (product.description || "").split("\n\n__EXTRA__")[0].trim();
  const formattedPrice = parseFloat(product.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <PublicLayout>
      <CartDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        product={product}
        size={selectedSize}
        color={selectedColor}
        price={product.price}
      />

      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-start">

          {/* FOTOS */}
          <div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border mb-3">
              {mainImage
                ? <img src={mainImage} alt={product.name} className="w-full object-cover" style={{ maxHeight: 380, width: "100%" }} />
                : <div className="w-full flex items-center justify-center text-6xl" style={{ height: 300 }}>📸</div>
              }
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {images.map((img, i) => (
                  <div key={i} onClick={() => setActiveImg(i)}
                    style={{ width: 64, height: 64, borderRadius: 10, overflow: "hidden", border: activeImg === i ? "3px solid #D61C5C" : "2px solid #e5e7eb", cursor: "pointer", flexShrink: 0 }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DETALHES */}
          <div className="space-y-4">
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>
            <p className="text-4xl md:text-5xl font-black text-[#D61C5C]">{formattedPrice}</p>

            <div className="space-y-3 pt-2">
              {colors.length > 0 && (
                <div>
                  <label className="font-bold text-sm block mb-2">Cor:</label>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map((c: string) => (
                      <button key={c} onClick={() => setSelectedColor(c)}
                        style={{
                          width: 38, height: 38, borderRadius: "50%", backgroundColor: c,
                          border: selectedColor === c ? "3px solid #D61C5C" : "2px solid #e5e7eb",
                          outline: selectedColor === c ? "3px solid #ffd6e7" : "none",
                          cursor: "pointer",
                          boxShadow: c === "#FFFFFF" ? "inset 0 0 0 1px #ccc" : "none"
                        }} />
                    ))}
                  </div>
                </div>
              )}

              {sizes.length > 0 && (
                <div>
                  <label className="font-bold text-sm block mb-2">Tamanho:</label>
                  <div className="flex gap-2 flex-wrap">
                    {sizes.map((s: string) => (
                      <button key={s} onClick={() => setSelectedSize(s)}
                        className={`w-14 h-14 rounded-xl font-bold border-2 text-sm ${selectedSize === s ? "border-[#D61C5C] bg-pink-50 text-[#D61C5C]" : "border-gray-200 text-gray-700"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 pb-20 md:pb-0">
              <Button
                onClick={handleBuyNow}
                className="w-full h-14 text-lg font-bold uppercase shadow-xl"
                style={{ background: "linear-gradient(135deg, #D61C5C 0%, #9b1a42 100%)" }}
              >
                COMPRAR AGORA 🛍️
              </Button>

              <div className="flex justify-around pt-2">
                {[["🚚","Frete Grátis"],["🔒","Compra Segura"],["💸","Pague no PIX"],["🔄","Troca Grátis"]].map(([icon,label]) => (
                  <div key={label} className="text-center">
                    <div className="text-lg">{icon}</div>
                    <div className="text-xs text-gray-500 font-medium">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {cleanDescription && (
        <div className="bg-gray-50 py-10 mt-4">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-2xl font-bold mb-6">Por que escolher este produto?</h2>
            <p className="text-base text-gray-600 mb-8">{cleanDescription}</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center"><ShieldCheck size={32} className="text-[#D61C5C] mb-1" /><h4 className="font-bold text-sm">Compra Segura</h4></div>
              <div className="flex flex-col items-center"><Truck size={32} className="text-[#D61C5C] mb-1" /><h4 className="font-bold text-sm">Envio Rápido</h4></div>
              <div className="flex flex-col items-center"><Star size={32} className="text-[#D61C5C] mb-1" /><h4 className="font-bold text-sm">Qualidade Premium</h4></div>
            </div>
          </div>
        </div>
      )}

      <SizeGuideBanner />
      <SocialProof />
    </PublicLayout>
  );
}
