import PublicLayout from "@/components/PublicLayout";

export default function ExchangePolicy() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Política de Trocas
            </h1>
            <p className="text-gray-600">
              Conheça as regras e condições para trocas na Moda AUREA
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8 text-gray-700">
            {/* Main Policy */}
            <section className="bg-pink-50 p-8 rounded-lg border-l-4 border-[#D61C5C]">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ✓ Troca em até 7 dias
              </h2>
              <p className="text-lg leading-relaxed">
                Você pode trocar seu produto em até <strong>7 dias após o recebimento</strong>, 
                sem custos adicionais. A troca é válida para produtos que não foram utilizados 
                e que estejam em perfeito estado de conservação, com a embalagem original intacta.
              </p>
            </section>

            {/* Conditions */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Condições para Troca
              </h2>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-[#D61C5C] font-bold">✓</span>
                  <span>Produto não pode ter sido utilizado ou lavado</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#D61C5C] font-bold">✓</span>
                  <span>Embalagem original deve estar intacta e sem danos</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#D61C5C] font-bold">✓</span>
                  <span>Etiquetas e aviamentos devem estar intactos</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#D61C5C] font-bold">✓</span>
                  <span>Prazo máximo de 7 dias após o recebimento</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#D61C5C] font-bold">✓</span>
                  <span>Troca é válida para tamanho, cor ou modelo diferente</span>
                </li>
              </ul>
            </section>

            {/* How to Exchange */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Como Solicitar uma Troca
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#D61C5C] text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Entre em Contato</h3>
                    <p className="text-gray-600">
                      Envie um e-mail para <strong>contato@modaaurea.com.br</strong> ou 
                      entre em contato pelo WhatsApp <strong>(21) 2342-7064</strong>
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#D61C5C] text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Informe os Dados</h3>
                    <p className="text-gray-600">
                      Forneça o número do pedido, o produto que deseja trocar e o motivo da troca
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#D61C5C] text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Envie o Produto</h3>
                    <p className="text-gray-600">
                      Envie o produto de volta com frete pago (você pode usar qualquer transportadora)
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#D61C5C] text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Receba a Troca</h3>
                    <p className="text-gray-600">
                      Após recebermos e verificarmos o produto, enviaremos o novo item com frete grátis
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Exclusions */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Casos Não Permitidos para Troca
              </h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex gap-2">
                  <span>✗</span>
                  <span>Produtos com sinais de uso ou lavagem</span>
                </li>
                <li className="flex gap-2">
                  <span>✗</span>
                  <span>Embalagem danificada ou aberta</span>
                </li>
                <li className="flex gap-2">
                  <span>✗</span>
                  <span>Produtos fora do prazo de 7 dias</span>
                </li>
                <li className="flex gap-2">
                  <span>✗</span>
                  <span>Etiquetas removidas ou danificadas</span>
                </li>
                <li className="flex gap-2">
                  <span>✗</span>
                  <span>Produtos com defeito de fabricação (sujeito a análise)</span>
                </li>
              </ul>
            </section>

            {/* Contact */}
            <section className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Dúvidas?
              </h2>
              <p className="text-gray-600 mb-4">
                Entre em contato conosco para esclarecimentos sobre nossa política de trocas:
              </p>
              <div className="space-y-2 text-gray-700">
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
      </div>
    </PublicLayout>
  );
}
