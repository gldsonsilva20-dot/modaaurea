import PublicLayout from "@/components/PublicLayout";
import { Shield, Lock, CheckCircle, Truck, CreditCard, AlertCircle } from "lucide-react";

export default function SecureShopping() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Shield size={48} className="text-[#D61C5C]" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Compra Segura
            </h1>
            <p className="text-gray-600 text-lg">
              Sua segurança e confiança são nossas prioridades
            </p>
          </div>

          {/* Main Message */}
          <section className="bg-green-50 border-l-4 border-green-500 p-8 rounded-lg mb-12">
            <div className="flex gap-3">
              <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  100% Seguro e Confiável
                </h2>
                <p className="text-gray-700">
                  Todos os produtos da Moda AUREA são 100% originais e passam por rigoroso 
                  controle de qualidade. Compre com confiança!
                </p>
              </div>
            </div>
          </section>

          {/* Security Features */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Por que Comprar com a Gente?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex gap-4 mb-4">
                  <Lock className="text-[#D61C5C] flex-shrink-0" size={28} />
                  <h3 className="text-lg font-bold text-gray-900">Dados Protegidos</h3>
                </div>
                <p className="text-gray-600">
                  Seus dados pessoais e de pagamento são criptografados e protegidos com 
                  os mais altos padrões de segurança da internet.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex gap-4 mb-4">
                  <CreditCard className="text-[#D61C5C] flex-shrink-0" size={28} />
                  <h3 className="text-lg font-bold text-gray-900">Pagamento Seguro</h3>
                </div>
                <p className="text-gray-600">
                  Aceitamos PIX e Cartão de Crédito com segurança garantida. Suas transações 
                  são protegidas contra fraudes.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex gap-4 mb-4">
                  <Truck className="text-[#D61C5C] flex-shrink-0" size={28} />
                  <h3 className="text-lg font-bold text-gray-900">Frete Rastreável</h3>
                </div>
                <p className="text-gray-600">
                  Todos os pedidos são enviados com frete rastreável. Você acompanha o 
                  envio em tempo real.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex gap-4 mb-4">
                  <CheckCircle className="text-[#D61C5C] flex-shrink-0" size={28} />
                  <h3 className="text-lg font-bold text-gray-900">Produtos Originais</h3>
                </div>
                <p className="text-gray-600">
                  Todos os produtos são 100% originais e passam por rigoroso controle de 
                  qualidade antes do envio.
                </p>
              </div>
            </div>
          </section>

          {/* Guarantees */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Nossas Garantias
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-pink-50 rounded-lg">
                <CheckCircle className="text-[#D61C5C] flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Garantia de Qualidade</h3>
                  <p className="text-gray-600 text-sm">
                    Se o produto chegar com defeito de fabricação, faremos a troca sem custos adicionais.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-pink-50 rounded-lg">
                <CheckCircle className="text-[#D61C5C] flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Política de Trocas</h3>
                  <p className="text-gray-600 text-sm">
                    Você pode trocar seu produto em até 7 dias após o recebimento, sem custos adicionais.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-pink-50 rounded-lg">
                <CheckCircle className="text-[#D61C5C] flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Frete Grátis</h3>
                  <p className="text-gray-600 text-sm">
                    Frete grátis para todo o Brasil em todas as compras, sem valor mínimo.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-pink-50 rounded-lg">
                <CheckCircle className="text-[#D61C5C] flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Atendimento Rápido</h3>
                  <p className="text-gray-600 text-sm">
                    Dúvidas? Entre em contato pelo WhatsApp (21) 2342-7064. Respondemos rapidamente!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Methods */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Formas de Pagamento
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-3">PIX</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Pagamento instantâneo e seguro. Receba confirmação em segundos.
                </p>
                <p className="text-[#D61C5C] font-bold">Sem juros</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-3">Cartão de Crédito</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Parcelado em até 12 vezes. Segurança garantida em todas as transações.
                </p>
                <p className="text-[#D61C5C] font-bold">Até 12x</p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Perguntas Frequentes
            </h2>
            <div className="space-y-4">
              <details className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                <summary className="font-bold text-gray-900 flex gap-2">
                  <AlertCircle size={20} className="text-[#D61C5C] flex-shrink-0" />
                  Meus dados estão seguros?
                </summary>
                <p className="text-gray-600 mt-3 ml-6">
                  Sim! Utilizamos criptografia SSL de 256 bits, o padrão mais alto de segurança. 
                  Seus dados nunca são armazenados em nossos servidores.
                </p>
              </details>
              <details className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                <summary className="font-bold text-gray-900 flex gap-2">
                  <AlertCircle size={20} className="text-[#D61C5C] flex-shrink-0" />
                  Como rastrear meu pedido?
                </summary>
                <p className="text-gray-600 mt-3 ml-6">
                  Você receberá um código de rastreamento por e-mail assim que seu pedido for enviado. 
                  Poderá acompanhar em tempo real no site da transportadora.
                </p>
              </details>
              <details className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                <summary className="font-bold text-gray-900 flex gap-2">
                  <AlertCircle size={20} className="text-[#D61C5C] flex-shrink-0" />
                  E se o produto chegar danificado?
                </summary>
                <p className="text-gray-600 mt-3 ml-6">
                  Faremos a troca imediatamente sem custos adicionais. Basta entrar em contato 
                  com nossa equipe e enviar fotos do produto.
                </p>
              </details>
              <details className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                <summary className="font-bold text-gray-900 flex gap-2">
                  <AlertCircle size={20} className="text-[#D61C5C] flex-shrink-0" />
                  Vocês vendem produtos falsificados?
                </summary>
                <p className="text-gray-600 mt-3 ml-6">
                  Não! Todos os nossos produtos são 100% originais. Cada item passa por rigoroso 
                  controle de qualidade antes de ser enviado.
                </p>
              </details>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-gradient-to-r from-[#D61C5C] to-[#D4AF37] text-white p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ainda tem dúvidas?
            </h2>
            <p className="mb-6">
              Entre em contato conosco! Estamos aqui para ajudar.
            </p>
            <div className="space-y-2">
              <p>
                <strong>E-mail:</strong> contato@modaaurea.com.br
              </p>
              <p>
                <strong>WhatsApp:</strong> (21) 2342-7064
              </p>
              <p>
                <strong>Horário:</strong> Segunda a Sexta, 9h às 18h
              </p>
            </div>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
