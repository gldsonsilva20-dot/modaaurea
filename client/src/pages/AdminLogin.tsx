import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simple validation - in production, this should be a real API call
    const adminEmail = "wallassouzapereira@gmail.com";
    const adminPassword = "02129356";

    if (email === adminEmail && password === adminPassword) {
      // Store login in localStorage (in production, use secure session/JWT)
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminEmail", email);
      window.location.href = "/admin";
    } else {
      setError("E-mail ou senha incorretos");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl font-serif font-bold mb-2">
            <span className="text-[#D4AF37]">A</span>
            <span className="text-[#D61C5C]">UREA</span>
            <span className="text-[#D4AF37]">A</span>
          </div>
          <p className="text-[#D61C5C] font-bold tracking-widest uppercase text-sm">
            Painel Administrativo
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            Acesso Restrito
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                E-mail
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Senha
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#D61C5C] hover:bg-[#B01246] text-white py-3 font-bold uppercase tracking-widest"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="border-t border-gray-200 pt-4">
            <Link href="/">
              <a className="text-center text-sm text-gray-600 hover:text-[#D61C5C] transition">
                ← Voltar para a loja
              </a>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>&copy; 2026 Moda AUREA. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}
