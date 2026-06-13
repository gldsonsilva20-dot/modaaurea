import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const COLORS = [
  { hex: "#000000", name: "Preto" },
  { hex: "#FFFFFF", name: "Branco" },
  { hex: "#FFC0CB", name: "Rosa Claro" },
  { hex: "#FF69B4", name: "Rosa Quente" },
  { hex: "#FF0000", name: "Vermelho" },
  { hex: "#8B0000", name: "Vinho" },
  { hex: "#FF6600", name: "Laranja" },
  { hex: "#FFD700", name: "Dourado" },
  { hex: "#FFFF00", name: "Amarelo" },
  { hex: "#ADFF2F", name: "Verde Lima" },
  { hex: "#008000", name: "Verde" },
  { hex: "#006400", name: "Verde Escuro" },
  { hex: "#87CEEB", name: "Azul Céu" },
  { hex: "#0000FF", name: "Azul" },
  { hex: "#00008B", name: "Azul Marinho" },
  { hex: "#800080", name: "Roxo" },
  { hex: "#D2B48C", name: "Bege" },
  { hex: "#F5F5DC", name: "Creme" },
  { hex: "#A52A2A", name: "Marrom" },
  { hex: "#808080", name: "Cinza" },
];

const SIZES = ["PP", "P", "M", "G", "GG", "G1", "G2", "G3", "G4"];
const BADGES = ["", "MAIS VENDIDO", "NOVO", "PROMOÇÃO", "EXCLUSIVO", "LIMITADO", "DESTAQUE"];

const defaultForm = {
  categoryId: "",
  name: "",
  shortDescription: "",
  description: "",
  price: "",
  originalPrice: "",
  badge: "",
  material: "",
  weight: "",
  dimensions: "",
  colors: [] as string[],
  sizes: [] as string[],
  rating: "4.8",
  reviewCount: "127",
  soldCount: "342",
  benefits: ["Frete grátis", "Troca e devolução grátis", "Pagamento seguro"],
  images: [] as { url: string; name: string }[],
  imageUrlManual: "" as string,
  isFeatured: false,
  isPromotion: false,
  stock: "",
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    + "-" + Date.now();
}

async function uploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const base64 = ev.target!.result as string;
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64, filename: file.name }),
        });
        const data = await res.json();
        if (data.url) resolve(data.url);
        else reject(new Error(data.error || "Erro no upload"));
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsDataURL(file);
  });
}

export default function Admin() {
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [catName, setCatName] = useState("");
  const [tab, setTab] = useState("product");
  const [newBenefit, setNewBenefit] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: categories = [], refetch: refetchCats } = trpc.categories.list.useQuery();
  const { data: products = [], refetch: refetchProds } = trpc.products.list.useQuery();

  const createProduct = trpc.products.create.useMutation({
    onSuccess: () => {
      refetchProds();
      setForm(defaultForm);
      setEditingId(null);
      toast.success("✅ Produto publicado no site!");
    },
    onError: (err) => toast.error("Erro: " + err.message),
  });

  const updateProduct = trpc.products.update.useMutation({
    onSuccess: () => {
      refetchProds();
      setForm(defaultForm);
      setEditingId(null);
      setTab("products");
      toast.success("✅ Produto atualizado!");
    },
    onError: (err) => toast.error("Erro: " + err.message),
  });

  const deleteProduct = trpc.products.delete.useMutation({
    onSuccess: () => { refetchProds(); toast.success("Produto removido!"); },
  });

  const createCat = trpc.categories.create.useMutation({
    onSuccess: () => { refetchCats(); setCatName(""); toast.success("Categoria criada!"); },
    onError: (err) => toast.error("Erro: " + err.message),
  });

  const deleteCat = trpc.categories.delete.useMutation({
    onSuccess: () => { refetchCats(); toast.success("Categoria removida!"); },
  });

  const set = (key: string, val: any) => setForm((f) => ({ ...f, [key]: val }));

  const toggleArr = (key: string, val: string) =>
    set(key, (form as any)[key].includes(val)
      ? (form as any)[key].filter((x: string) => x !== val)
      : [...(form as any)[key], val]);

  const handleImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    toast.info("⏳ Enviando fotos...");
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const url = await uploadImage(file);
          return { url, name: file.name };
        })
      );
      set("images", [...form.images, ...uploaded].slice(0, 10));
      toast.success(`✅ ${uploaded.length} foto(s) enviada(s)!`);
    } catch (err: any) {
      toast.error("Erro ao enviar foto: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (i: number) =>
    set("images", form.images.filter((_, idx) => idx !== i));

  const addBenefit = () => {
    if (newBenefit.trim()) { set("benefits", [...form.benefits, newBenefit.trim()]); setNewBenefit(""); }
  };

  const removeBenefit = (i: number) =>
    set("benefits", form.benefits.filter((_, idx) => idx !== i));

  const discountPct =
    form.originalPrice && form.price
      ? Math.round((1 - parseFloat(form.price) / parseFloat(form.originalPrice)) * 100)
      : 0;

  const startEdit = (p: any) => {
    const imgs = (() => { try { return JSON.parse(p.imageUrls || "[]"); } catch { return []; } })();
    const sizes = (() => { try { return JSON.parse(p.sizes || "[]"); } catch { return []; } })();
    const colors = (() => { try { return JSON.parse(p.colors || "[]"); } catch { return []; } })();
    const descParts = (p.description || "").split("\n\n__EXTRA__");
    let extra: any = {};
    try { extra = JSON.parse(descParts[1] || "{}"); } catch {}

    setForm({
      categoryId: p.categoryId?.toString() || "",
      name: p.name || "",
      shortDescription: extra.shortDescription || "",
      description: descParts[0] || "",
      price: p.price || "",
      originalPrice: p.costPrice || "",
      badge: extra.badge || "",
      material: extra.material || "",
      weight: extra.weight || "",
      dimensions: extra.dimensions || "",
      colors,
      sizes,
      rating: extra.rating || "4.8",
      reviewCount: extra.reviewCount || "127",
      soldCount: extra.soldCount || "342",
      benefits: extra.benefits || [],
      images: imgs.map((url: string) => ({ url, name: url })),
      imageUrlManual: "",
      isFeatured: p.isFeatured || false,
      isPromotion: p.isPromotion || false,
      stock: p.stock?.toString() || "",
    });
    setEditingId(p.id);
    setTab("product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setForm(defaultForm);
    setEditingId(null);
  };

  const saveProduct = () => {
    if (!form.name || !form.price) return toast.error("Preencha nome e preço!");
    if (!form.categoryId) return toast.error("Selecione uma categoria!");

    const extraData = {
      shortDescription: form.shortDescription,
      badge: form.badge,
      material: form.material,
      weight: form.weight,
      dimensions: form.dimensions,
      rating: form.rating,
      reviewCount: form.reviewCount,
      soldCount: form.soldCount,
      benefits: form.benefits,
    };

    const imageUrls = JSON.stringify(form.images.map((img) => img.url));
    const description = form.description + "\n\n__EXTRA__" + JSON.stringify(extraData);

    if (editingId) {
      updateProduct.mutate({
        id: editingId,
        categoryId: Number(form.categoryId),
        name: form.name,
        slug: slugify(form.name),
        description,
        price: parseFloat(form.price).toFixed(2),
        costPrice: form.originalPrice ? parseFloat(form.originalPrice).toFixed(2) : undefined,
        stock: Number(form.stock) || 10,
        imageUrls,
        sizes: JSON.stringify(form.sizes),
        isFeatured: form.isFeatured,
        isPromotion: form.isPromotion,
      });
    } else {
      createProduct.mutate({
        categoryId: Number(form.categoryId),
        name: form.name,
        slug: slugify(form.name),
        description,
        price: parseFloat(form.price).toFixed(2),
        costPrice: form.originalPrice ? parseFloat(form.originalPrice).toFixed(2) : undefined,
        stock: Number(form.stock) || 10,
        imageUrls,
        sizes: JSON.stringify(form.sizes),
        colors: JSON.stringify(form.colors),
        isFeatured: form.isFeatured,
        isPromotion: form.isPromotion,
      });
    }
  };

  const addCategory = () => {
    if (!catName.trim()) return;
    createCat.mutate({ name: catName.trim(), slug: slugify(catName.trim()) });
  };

  const card = { background: "white", borderRadius: 20, border: "1px solid #f0f0f0", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", overflow: "hidden" } as const;
  const cardHeader = { padding: "16px 24px", borderBottom: "1px solid #f5f5f5", display: "flex", alignItems: "center", gap: 8 } as const;
  const cardBody = { padding: 24 } as const;
  const label = { display: "block", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 };
  const input = { width: "100%", padding: "12px 16px", border: "1.5px solid #e5e7eb", borderRadius: 12, fontSize: 14, background: "#fafafa", outline: "none", boxSizing: "border-box" as const };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#F7F8FA" }}>
      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #D61C5C 0%, #9b1a42 100%)", padding: "0 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>🛍️</span>
            <span style={{ color: "white", fontWeight: 900, fontSize: 18 }}>Admin Panel</span>
            {editingId && <span style={{ background: "rgba(255,255,255,0.2)", color: "white", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>✏️ Editando produto</span>}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {["product", "categories", "products"].map((t) => (
              <button key={t} onClick={() => { setTab(t); if (t !== "product") cancelEdit(); }} style={{
                padding: "8px 18px", borderRadius: 12, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 700,
                background: tab === t ? "rgba(255,255,255,0.2)" : "transparent",
                color: "white",
              }}>
                {t === "product" ? (editingId ? "✏️ Editando" : "➕ Produto") : t === "categories" ? `📁 Categorias (${categories.length})` : `📦 Listados (${products.length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>

        {tab === "product" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* IDENTIDADE */}
              <div style={card}>
                <div style={cardHeader}><span>🏷️</span><span style={{ fontWeight: 900, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "#374151" }}>Identidade do Produto</span></div>
                <div style={{ ...cardBody, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={label}>Nome do Produto *</label>
                    <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ex: Conjunto Moletom Feminino Premium"
                      style={{ ...input, fontSize: 16, fontWeight: 700 }} />
                  </div>
                  <div>
                    <label style={label}>Categoria *</label>
                    <select value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} style={{ ...input }}>
                      <option value="">Selecione...</option>
                      {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={label}>Badge / Etiqueta</label>
                    <select value={form.badge} onChange={(e) => set("badge", e.target.value)} style={{ ...input }}>
                      {BADGES.map((b) => <option key={b} value={b}>{b || "Sem badge"}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={label}>Descrição Curta</label>
                    <input value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)}
                      placeholder="Ex: O conforto que você merecia." style={{ ...input }} />
                  </div>
                  <div style={{ gridColumn: "1 / -1", display: "flex", gap: 24 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                      <input type="checkbox" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} />
                      ⭐ Produto em Destaque
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                      <input type="checkbox" checked={form.isPromotion} onChange={(e) => set("isPromotion", e.target.checked)} />
                      🔥 É Promoção
                    </label>
                  </div>
                </div>
              </div>

              {/* FOTOS */}
              <div style={card}>
                <div style={cardHeader}>
                  <span>📸</span>
                  <span style={{ fontWeight: 900, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "#374151" }}>Fotos do Produto</span>
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "#9ca3af" }}>{form.images.length}/10 fotos</span>
                </div>
                <div style={cardBody}>
                  <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImages} style={{ display: "none" }} />
                  <button onClick={() => fileRef.current?.click()} disabled={uploading}
                    style={{ width: "100%", padding: "32px", border: "2px dashed #e5e7eb", borderRadius: 16, background: uploading ? "#f0f0f0" : "#fafafa", cursor: uploading ? "not-allowed" : "pointer", textAlign: "center" }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>{uploading ? "⏳" : "📁"}</div>
                    <div style={{ fontWeight: 700, color: "#374151", marginBottom: 4 }}>{uploading ? "Enviando fotos..." : "Clique para adicionar fotos do PC"}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>JPG, PNG, WEBP — até 10 fotos. A 1ª será a capa.</div>
                  </button>
                  <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center" }}>
                    <input value={(form as any).imageUrlManual || ""}
                      onChange={(e) => set("imageUrlManual", e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && (form as any).imageUrlManual) { set("images", [...form.images, { url: (form as any).imageUrlManual, name: (form as any).imageUrlManual }].slice(0, 10)); set("imageUrlManual", ""); } }}
                      placeholder="Ou cole aqui a URL de uma imagem e pressione Enter"
                      style={{ flex: 1, padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 13, outline: "none" }} />
                    <button onClick={() => { if ((form as any).imageUrlManual) { set("images", [...form.images, { url: (form as any).imageUrlManual, name: (form as any).imageUrlManual }].slice(0, 10)); set("imageUrlManual", ""); } }}
                      style={{ padding: "10px 18px", background: "#374151", color: "white", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>+ URL</button>
                  </div>
                  {form.images.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginTop: 16 }}>
                      {form.images.map((img, i) => (
                        <div key={i} style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: i === 0 ? "3px solid #D61C5C" : "2px solid #e5e7eb", aspectRatio: "1" }}>
                          <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          {i === 0 && <div style={{ position: "absolute", top: 4, left: 4, background: "#D61C5C", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 6 }}>CAPA</div>}
                          <button onClick={() => removeImage(i)} style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", color: "white", fontSize: 12, cursor: "pointer" }}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* PREÇOS */}
              <div style={card}>
                <div style={cardHeader}>
                  <span>💰</span>
                  <span style={{ fontWeight: 900, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "#374151" }}>Preços</span>
                  {discountPct > 0 && <span style={{ marginLeft: "auto", background: "#dcfce7", color: "#16a34a", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>-{discountPct}% calculado</span>}
                </div>
                <div style={{ ...cardBody, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={label}>Preço Por *</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontWeight: 700, color: "#D61C5C" }}>R$</span>
                      <input value={form.price} onChange={(e) => set("price", e.target.value)} type="number" placeholder="99,90"
                        style={{ ...input, paddingLeft: 42, fontSize: 18, fontWeight: 700, color: "#D61C5C", border: "1.5px solid #D61C5C", background: "#fff5f8" }} />
                    </div>
                  </div>
                  <div>
                    <label style={label}>Preço De (riscado)</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontWeight: 700, color: "#9ca3af" }}>R$</span>
                      <input value={form.originalPrice} onChange={(e) => set("originalPrice", e.target.value)} type="number" placeholder="149,90"
                        style={{ ...input, paddingLeft: 42, fontSize: 18, fontWeight: 700, color: "#9ca3af" }} />
                    </div>
                  </div>
                  <div>
                    <label style={label}>Estoque</label>
                    <input value={form.stock} onChange={(e) => set("stock", e.target.value)} type="number" placeholder="50" style={{ ...input, fontSize: 16, fontWeight: 700 }} />
                  </div>
                </div>
              </div>

              {/* CORES */}
              <div style={card}>
                <div style={cardHeader}>
                  <span>🎨</span>
                  <span style={{ fontWeight: 900, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "#374151" }}>Cores Disponíveis</span>
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "#9ca3af" }}>{form.colors.length} selecionadas</span>
                </div>
                <div style={cardBody}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {COLORS.map((c) => (
                      <div key={c.hex} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }} onClick={() => toggleArr("colors", c.hex)}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: c.hex, border: form.colors.includes(c.hex) ? "3px solid #D61C5C" : "2px solid #e5e7eb", outline: form.colors.includes(c.hex) ? "3px solid #ffd6e7" : "none", boxShadow: c.hex === "#FFFFFF" ? "inset 0 0 0 1px #ccc" : "none" }} />
                        <span style={{ fontSize: 9, color: "#6b7280", textAlign: "center", maxWidth: 44 }}>{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* TAMANHOS */}
              <div style={card}>
                <div style={cardHeader}><span>📐</span><span style={{ fontWeight: 900, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "#374151" }}>Tamanhos Disponíveis</span></div>
                <div style={cardBody}>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {SIZES.map((s) => (
                      <button key={s} onClick={() => toggleArr("sizes", s)} style={{ width: 56, height: 56, borderRadius: 12, border: form.sizes.includes(s) ? "2px solid #D61C5C" : "2px solid #e5e7eb", background: form.sizes.includes(s) ? "#D61C5C" : "#fafafa", color: form.sizes.includes(s) ? "white" : "#374151", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* DESCRIÇÃO */}
              <div style={card}>
                <div style={cardHeader}><span>📝</span><span style={{ fontWeight: 900, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "#374151" }}>Descrição Completa</span></div>
                <div style={cardBody}>
                  <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
                    placeholder="Escreva uma descrição detalhada do produto..."
                    rows={7} style={{ width: "100%", padding: "14px 16px", border: "1.5px solid #e5e7eb", borderRadius: 12, fontSize: 14, lineHeight: 1.7, background: "#fafafa", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
                </div>
              </div>

              {/* ESPECIFICAÇÕES */}
              <div style={card}>
                <div style={cardHeader}><span>🔬</span><span style={{ fontWeight: 900, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "#374151" }}>Especificações Técnicas</span></div>
                <div style={{ ...cardBody, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={label}>Material / Composição</label>
                    <input value={form.material} onChange={(e) => set("material", e.target.value)} placeholder="Ex: 80% Algodão, 20% Poliéster" style={input} />
                  </div>
                  <div>
                    <label style={label}>Peso aprox.</label>
                    <input value={form.weight} onChange={(e) => set("weight", e.target.value)} placeholder="Ex: 350g" style={input} />
                  </div>
                  <div>
                    <label style={label}>Info do Modelo</label>
                    <input value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} placeholder="Ex: Modelo usa M, altura 1,72m" style={input} />
                  </div>
                </div>
              </div>
            </div>

            {/* COLUNA LATERAL */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* PROVA SOCIAL */}
              <div style={card}>
                <div style={cardHeader}><span>⭐</span><span style={{ fontWeight: 900, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "#374151" }}>Prova Social</span></div>
                <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={label}>Nota média (0–5)</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input value={form.rating} onChange={(e) => set("rating", e.target.value)} type="number" min="0" max="5" step="0.1"
                        style={{ width: 80, padding: "10px 12px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 20, fontWeight: 900, color: "#f59e0b", textAlign: "center", outline: "none" }} />
                      <span style={{ fontSize: 22 }}>{"⭐".repeat(Math.round(parseFloat(form.rating) || 0))}</span>
                    </div>
                  </div>
                  <div>
                    <label style={label}>Nº de avaliações</label>
                    <input value={form.reviewCount} onChange={(e) => set("reviewCount", e.target.value)} placeholder="127" style={{ ...input, fontWeight: 700 }} />
                  </div>
                  <div>
                    <label style={label}>Unidades vendidas</label>
                    <input value={form.soldCount} onChange={(e) => set("soldCount", e.target.value)} placeholder="342" style={{ ...input, fontWeight: 700 }} />
                  </div>
                </div>
              </div>

              {/* BENEFÍCIOS */}
              <div style={card}>
                <div style={cardHeader}><span>✅</span><span style={{ fontWeight: 900, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "#374151" }}>Benefícios</span></div>
                <div style={{ padding: 20 }}>
                  {form.benefits.map((b, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid #f5f5f5" }}>
                      <span style={{ color: "#22c55e", fontSize: 14 }}>✓</span>
                      <span style={{ flex: 1, fontSize: 13 }}>{b}</span>
                      <button onClick={() => removeBenefit(i)} style={{ border: "none", background: "none", color: "#ef4444", cursor: "pointer", fontSize: 16 }}>✕</button>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <input value={newBenefit} onChange={(e) => setNewBenefit(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addBenefit()} placeholder="Adicionar benefício..."
                      style={{ flex: 1, padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 13, outline: "none" }} />
                    <button onClick={addBenefit} style={{ padding: "9px 16px", background: "#374151", color: "white", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>+</button>
                  </div>
                </div>
              </div>

              {/* PRÉVIA */}
              {form.name && (
                <div style={{ background: "linear-gradient(135deg, #fff5f8, #fff)", borderRadius: 20, border: "2px solid #ffd6e7", overflow: "hidden" }}>
                  <div style={{ padding: "12px 20px", borderBottom: "1px solid #ffd6e7" }}>
                    <span style={{ fontWeight: 900, fontSize: 12, textTransform: "uppercase", color: "#D61C5C" }}>👀 Prévia</span>
                  </div>
                  <div style={{ padding: 20 }}>
                    {form.images[0] && <img src={form.images[0].url} alt="" style={{ width: "100%", borderRadius: 12, aspectRatio: "1", objectFit: "cover", marginBottom: 12 }} />}
                    <div style={{ fontWeight: 800, fontSize: 15, color: "#111", marginBottom: 4 }}>{form.name}</div>
                    {form.shortDescription && <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>{form.shortDescription}</div>}
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      {form.originalPrice && <span style={{ textDecoration: "line-through", color: "#9ca3af", fontSize: 13 }}>R$ {parseFloat(form.originalPrice).toFixed(2)}</span>}
                      {form.price && <span style={{ color: "#D61C5C", fontWeight: 900, fontSize: 20 }}>R$ {parseFloat(form.price).toFixed(2)}</span>}
                      {discountPct > 0 && <span style={{ background: "#dcfce7", color: "#16a34a", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 12 }}>-{discountPct}%</span>}
                    </div>
                  </div>
                </div>
              )}

              {editingId && (
                <button onClick={cancelEdit}
                  style={{ width: "100%", padding: "14px", borderRadius: 16, border: "2px solid #e5e7eb", background: "white", color: "#374151", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                  ✕ Cancelar Edição
                </button>
              )}

              <button onClick={saveProduct} disabled={createProduct.isPending || updateProduct.isPending || uploading}
                style={{ width: "100%", padding: "18px", borderRadius: 16, border: "none", background: (createProduct.isPending || updateProduct.isPending || uploading) ? "#e5e7eb" : "linear-gradient(135deg, #D61C5C 0%, #9b1a42 100%)", color: (createProduct.isPending || updateProduct.isPending || uploading) ? "#9ca3af" : "white", fontWeight: 900, fontSize: 16, cursor: "pointer", boxShadow: "0 8px 24px rgba(214,28,92,0.35)" }}>
                {updateProduct.isPending ? "⏳ Salvando..." : createProduct.isPending ? "⏳ Publicando..." : uploading ? "⏳ Aguarde o upload..." : editingId ? "💾 SALVAR ALTERAÇÕES" : "💾 PUBLICAR PRODUTO"}
              </button>
            </div>
          </div>
        )}

        {/* CATEGORIAS */}
        {tab === "categories" && (
          <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={card}>
              <div style={{ ...cardHeader }}><span style={{ fontWeight: 900, fontSize: 15 }}>📁 Nova Categoria</span></div>
              <div style={{ padding: 24, display: "flex", gap: 12 }}>
                <input value={catName} onChange={(e) => setCatName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCategory()}
                  placeholder="Nome da categoria (ex: Vestidos, Blusas)"
                  style={{ flex: 1, padding: "14px 16px", border: "1.5px solid #e5e7eb", borderRadius: 12, fontSize: 15, outline: "none" }} />
                <button onClick={addCategory} disabled={createCat.isPending}
                  style={{ padding: "14px 28px", background: "#D61C5C", color: "white", border: "none", borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
                  {createCat.isPending ? "..." : "Criar"}
                </button>
              </div>
            </div>
            <div style={card}>
              <div style={{ ...cardHeader }}><span style={{ fontWeight: 900, fontSize: 15 }}>📋 Categorias Cadastradas ({categories.length})</span></div>
              <div style={{ padding: 16 }}>
                {categories.map((c: any) => (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 12px", borderRadius: 12, marginBottom: 4, background: "#fafafa" }}>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>📁 {c.name}</span>
                    <button onClick={() => deleteCat.mutate({ id: c.id })} style={{ border: "none", background: "#fee2e2", color: "#ef4444", padding: "6px 14px", borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Excluir</button>
                  </div>
                ))}
                {categories.length === 0 && <div style={{ textAlign: "center", color: "#9ca3af", padding: 32 }}>Nenhuma categoria cadastrada.</div>}
              </div>
            </div>
          </div>
        )}

        {/* PRODUTOS LISTADOS */}
        {tab === "products" && (
          <div style={card}>
            <div style={{ ...cardHeader }}><span style={{ fontWeight: 900, fontSize: 15 }}>📦 Produtos no Banco ({products.length})</span></div>
            {products.length === 0 ? (
              <div style={{ padding: 64, textAlign: "center", color: "#9ca3af" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                <div style={{ fontWeight: 700 }}>Nenhum produto cadastrado.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {products.map((p: any) => {
                  const imgs = (() => { try { return JSON.parse(p.imageUrls || "[]"); } catch { return []; } })();
                  return (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 24px", borderBottom: "1px solid #f5f5f5" }}>
                      <div style={{ width: 56, height: 56, borderRadius: 12, overflow: "hidden", flexShrink: 0, background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {imgs[0] ? <img src={imgs[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 24 }}>📸</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                        <div style={{ color: "#D61C5C", fontWeight: 700, fontSize: 13 }}>R$ {parseFloat(p.price).toFixed(2)}</div>
                      </div>
                      <button onClick={() => startEdit(p)}
                        style={{ border: "none", background: "#eff6ff", color: "#2563eb", cursor: "pointer", fontSize: 13, fontWeight: 700, padding: "8px 14px", borderRadius: 10, flexShrink: 0 }}>
                        ✏️ Editar
                      </button>
                      <button onClick={() => deleteProduct.mutate({ id: p.id })}
                        style={{ border: "none", background: "none", color: "#ef4444", cursor: "pointer", fontSize: 20, flexShrink: 0 }}>🗑</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}