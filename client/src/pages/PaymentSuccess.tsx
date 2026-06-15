import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/PublicLayout";

export default function PaymentSuccess() {
  const [, params] = useRoute("/payment-success/:transactionId");
  const [, navigate] = useLocation();
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    if (params?.transactionId) {
      setOrderDetails({
        transactionId: params.transactionId,
        createdAt: new Date().toLocaleDateString("pt-BR"),
      });

      // ─── Meta Pixel - Purchase ──────────────────────────────────────────
      if (typeof window !== "undefined" && (window as any).fbq) {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const total = cart.reduce((sum: number, item: any) => sum + parseFloat(item.price) * item.quantity, 0);
        (window as any).fbq('track', 'Purchase', {
          value: total || 0,
          currency: 'BRL',
        });
        // Limpa o carrinho após compra confirmada
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
      }
    }
  }, [params]);

  return (
    <PublicLayout>
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #fff5f8 0%, #fff 60%)", paddingTop: 48, paddingBottom: 64 }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>

          {/* ÍCONE */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg, #D61C5C, #9b1a42)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 12px 40px rgba(214,28,92,0.35)" }}>
              <span style={{ fontSize: 48 }}>✓</span>
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: "#111", marginBottom: 8 }}>Pedido Confirmado! 🎉</h1>
            <p style={{ fontSize: 16, color: "#6b7280", lineHeight: 1.6 }}>
              Seu pagamento foi aprovado. <br />Em breve entraremos em contato pelo WhatsApp.
            </p>
          </div>

          {/* CARD DETALHES */}
          <div style={{ background: "white", borderRadius: 20, border: "2px solid #ffd6e7", padding: 32, marginBottom: 20, boxShadow: "0 4px 24px rgba(214,28,92,0.08)" }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#374151", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>📋 Detalhes do Pedido</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: "1px solid #f5f5f5" }}>
                <span style={{ color: "#6b7280", fontSize: 14 }}>ID da Transação</span>
                <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#D61C5C", fontSize: 13 }}>{orderDetails?.transactionId}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: "1px solid #f5f5f5" }}>
                <span style={{ color: "#6b7280", fontSize: 14 }}>Status</span>
                <span style={{ background: "#dcfce7", color: "#16a34a", fontWeight: 800, fontSize: 13, padding: "4px 14px", borderRadius: 20 }}>✓ Pago</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#6b7280", fontSize: 14 }}>Data</span>
                <span style={{ fontWeight: 700, color: "#111", fontSize: 14 }}>{orderDetails?.createdAt}</span>
              </div>
            </div>
          </div>

          {/* PRÓXIMOS PASSOS */}
          <div style={{ background: "white", borderRadius: 20, border: "1px solid #f0f0f0", padding: 32, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#374151", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>🚀 Próximos Passos</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { icon: "📦", title: "Preparação", desc: "Seu pedido será separado e embalado em até 2 dias úteis." },
                { icon: "🚚", title: "Envio", desc: "Você receberá o código de rastreamento via WhatsApp." },
                { icon: "🏠", title: "Entrega", desc: "Entrega para todo o Brasil com frete grátis." },
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fff5f8", border: "1.5px solid #ffd6e7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                    {step.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "#111", marginBottom: 2 }}>{step.title}</div>
                    <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DÚVIDAS */}
          <div style={{ background: "#fff5f8", borderRadius: 20, border: "1.5px solid #ffd6e7", padding: 24, marginBottom: 28, textAlign: "center" }}>
            <p style={{ fontWeight: 700, color: "#374151", marginBottom: 12, fontSize: 15 }}>💬 Dúvidas? Fale conosco!</p>
            <a href="https://wa.me/552123427064" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-block", background: "#25d366", color: "white", fontWeight: 800, fontSize: 15, padding: "12px 28px", borderRadius: 12, textDecoration: "none", boxShadow: "0 4px 16px rgba(37,211,102,0.3)" }}>
              📱 Abrir WhatsApp
            </a>
          </div>

          {/* BOTÕES */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button onClick={() => navigate("/catalog")}
              style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #D61C5C 0%, #9b1a42 100%)", color: "white", fontWeight: 900, fontSize: 16, cursor: "pointer", boxShadow: "0 8px 24px rgba(214,28,92,0.3)" }}>
              🛍️ Continuar Comprando
            </button>
            <button onClick={() => navigate("/")}
              style={{ width: "100%", padding: "14px", borderRadius: 14, border: "2px solid #e5e7eb", background: "white", color: "#374151", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
              Voltar à Página Inicial
            </button>
          </div>

          <div style={{ marginTop: 32, textAlign: "center", fontSize: 13, color: "#9ca3af" }}>
            <a href="/exchange-policy" style={{ color: "#D61C5C", fontWeight: 600, textDecoration: "none" }}>Política de Trocas</a>
            {" · "}
            <a href="/secure-shopping" style={{ color: "#D61C5C", fontWeight: 600, textDecoration: "none" }}>Compra Segura</a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
