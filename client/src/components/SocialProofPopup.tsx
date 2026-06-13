import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

const NOMES = ["Ana", "Maria", "Juliana", "Fernanda", "Camila", "Beatriz", "Larissa", "Patrícia", "Gabriela", "Aline", "Renata", "Vanessa", "Letícia", "Mariana", "Tatiane", "Simone", "Cláudia", "Roberta", "Michele", "Priscila", "Sandra", "Débora", "Cristiane", "Andréa", "Fabiana"];

const PRODUTOS = [
  "Vestido Longo Bordado",
  "Conjunto Poá Saia Longa",
  "Blazer Tweed",
  "Vestido Estampado de Boho",
  "Conjunto de Linho",
  "Camisa M/L Laise",
  "Saia Longa Cetim",
  "Vestido Crochê com Forro",
  "Calça Pantalona Alfaiataria",
  "Vestido Laise Alcinha",
  "Bata Bordada",
  "Conjunto Saia e Cropped Laise",
  "Vestido Boho Chique",
  "Blazer Alfaiataria",
  "Cropped Crochê",
];

// Cidades próximas por estado
const CIDADES_POR_ESTADO: Record<string, string[]> = {
  BA: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Itabuna", "Ilhéus", "Lauro de Freitas", "Jequié", "Porto Seguro", "Barreiras"],
  RJ: ["Rio de Janeiro", "Niterói", "Duque de Caxias", "Nova Iguaçu", "São Gonçalo", "Belford Roxo", "Campos dos Goytacazes", "Petrópolis", "Volta Redonda", "Macaé"],
  SP: ["São Paulo", "Campinas", "Santos", "São Bernardo do Campo", "Guarulhos", "Osasco", "Sorocaba", "Ribeirão Preto", "Mauá", "Bauru"],
  MG: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros", "Ribeirão das Neves", "Uberaba", "Governador Valadares", "Ipatinga"],
  ES: ["Vitória", "Vila Velha", "Serra", "Cariacica", "Cachoeiro de Itapemirim", "Linhares", "São Mateus", "Colatina", "Guarapari", "Aracruz"],
  PE: ["Recife", "Caruaru", "Olinda", "Petrolina", "Paulista", "Jaboatão dos Guararapes", "Garanhuns", "Vitória de Santo Antão", "Cabo de Santo Agostinho", "Santa Cruz do Capibaribe"],
  CE: ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral", "Crato", "Iguatu", "Quixadá", "Canindé", "Aquiraz"],
  RS: ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria", "Gravataí", "Viamão", "Novo Hamburgo", "São Leopoldo", "Rio Grande"],
  PR: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel", "São José dos Pinhais", "Foz do Iguaçu", "Colombo", "Guarapuava", "Paranaguá"],
  SC: ["Florianópolis", "Joinville", "Blumenau", "São José", "Chapecó", "Criciúma", "Itajaí", "Lages", "Jaraguá do Sul", "Palhoça"],
  GO: ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia", "Águas Lindas de Goiás", "Valparaíso de Goiás", "Trindade", "Formosa", "Novo Gama"],
  DF: ["Brasília", "Ceilândia", "Taguatinga", "Samambaia", "Planaltina", "Águas Claras", "Gama", "Sobradinho", "Guará", "Santa Maria"],
  AM: ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari", "Tefé", "Tabatinga", "Maués", "Humaitá", "Eirunepé"],
  PA: ["Belém", "Ananindeua", "Santarém", "Marabá", "Parauapebas", "Castanhal", "Abaetetuba", "Cametá", "Marituba", "Barcarena"],
  MA: ["São Luís", "Imperatriz", "Timon", "Caxias", "Codó", "Paço do Lumiar", "Açailândia", "Bacabal", "Balsas", "Santa Inês"],
  PI: ["Teresina", "Parnaíba", "Picos", "Piripiri", "Floriano", "Campo Maior", "Barras", "Caxingó", "São Raimundo Nonato", "Oeiras"],
  AL: ["Maceió", "Arapiraca", "Rio Largo", "Palmeira dos Índios", "União dos Palmares", "Penedo", "São Miguel dos Campos", "Delmiro Gouveia", "Coruripe", "Marechal Deodoro"],
  SE: ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "São Cristóvão", "Estância", "Tobias Barreto", "Simão Dias", "Própria", "Barra dos Coqueiros"],
  RN: ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Macaíba", "Ceará-Mirim", "Caicó", "Assú", "Currais Novos", "Santa Cruz"],
  PB: ["João Pessoa", "Campina Grande", "Santa Rita", "Patos", "Bayeux", "Sousa", "Cajazeiras", "Cabedelo", "Guarabira", "Sapé"],
  MT: ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra", "Cáceres", "Sorriso", "Lucas do Rio Verde", "Primavera do Leste", "Alta Floresta"],
  MS: ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Grande Dourados", "Ponta Porã", "Naviraí", "Nova Andradina", "Aquidauana", "Paranaíba"],
  RO: ["Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal", "Rolim de Moura", "Guajará-Mirim", "Jaru", "Ouro Preto do Oeste", "Buritis"],
  TO: ["Palmas", "Araguaína", "Gurupi", "Porto Nacional", "Paraíso do Tocantins", "Colinas do Tocantins", "Guaraí", "Tocantinópolis", "Miracema do Tocantins", "Dianópolis"],
  AC: ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá", "Feijó", "Brasileia", "Epitaciolândia", "Xapuri", "Plácido de Castro", "Mâncio Lima"],
  AP: ["Macapá", "Santana", "Laranjal do Jari", "Oiapoque", "Mazagão", "Porto Grande", "Tartarugalzinho", "Pedra Branca do Amapari", "Ferreira Gomes", "Amapá"],
  RR: ["Boa Vista", "Rorainópolis", "Caracaraí", "Alto Alegre", "Mucajaí", "Cantá", "Bonfim", "Pacaraima", "Uiramutã", "São João da Baliza"],
};

// Cidades genéricas de fallback
const CIDADES_BRASIL = [
  "São Paulo/SP", "Rio de Janeiro/RJ", "Belo Horizonte/MG", "Salvador/BA",
  "Fortaleza/CE", "Curitiba/PR", "Manaus/AM", "Recife/PE", "Porto Alegre/RS",
  "Belém/PA", "Goiânia/GO", "Guarulhos/SP", "Campinas/SP", "São Luís/MA",
  "Maceió/AL", "Natal/RN", "Teresina/PI", "Campo Grande/MS", "João Pessoa/PB",
  "Aracaju/SE", "Florianópolis/SC", "Cuiabá/MT", "Vitória/ES", "Macapá/AP",
];

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function SocialProofPopup() {
  const [visible, setVisible] = useState(false);
  const [cidadeAtual, setCidadeAtual] = useState("");
  const [nome, setNome] = useState("");
  const [produto, setProduto] = useState("");
  
  const cidadesRef = useRef<string[]>([]);
  const indexRef = useRef(0);

  // Busca cidade real + monta lista de cidades próximas
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((data) => {
        const estado = data.region_code || "";
        const cidadeReal = data.city || "";
        
        // Pega cidades do mesmo estado
        const cidadesDoEstado = CIDADES_POR_ESTADO[estado] || [];
        
        // Monta lista: cidade real primeiro, depois outras do estado, depois Brasil
        const lista: string[] = [];
        
        // Adiciona cidade real algumas vezes (aparece mais)
        if (cidadeReal && estado) {
          lista.push(`${cidadeReal}/${estado}`);
          lista.push(`${cidadeReal}/${estado}`);
        }
        
        // Adiciona cidades do mesmo estado
        for (const c of cidadesDoEstado) {
          if (c !== cidadeReal) {
            lista.push(`${c}/${estado}`);
          }
        }
        
        // Completa com outras cidades do Brasil se precisar
        if (lista.length < 8) {
          for (const c of CIDADES_BRASIL) {
            if (!lista.includes(c)) lista.push(c);
            if (lista.length >= 15) break;
          }
        }
        
        // Embaralha (mantendo cidade real nas primeiras posições)
        const real = lista.slice(0, 2);
        const resto = lista.slice(2).sort(() => Math.random() - 0.5);
        cidadesRef.current = [...real, ...resto];
      })
      .catch(() => {
        // Fallback: cidades aleatórias do Brasil
        cidadesRef.current = [...CIDADES_BRASIL].sort(() => Math.random() - 0.5);
      });
  }, []);

  // Mostra popup a cada intervalo
  useEffect(() => {
    const show = () => {
      const cidades = cidadesRef.current;
      if (cidades.length === 0) return;

      // Pega próxima cidade da lista (rotaciona)
      const cidade = cidades[indexRef.current % cidades.length];
      indexRef.current++;

      setCidadeAtual(cidade);
      setNome(getRandom(NOMES));
      setProduto(getRandom(PRODUTOS));
      setVisible(true);

      setTimeout(() => setVisible(false), 5000);
    };

    const first = setTimeout(show, 8000);
    const interval = setInterval(show, 30000 + Math.random() * 10000);

    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, []);

  if (!visible || !cidadeAtual) return null;

  return (
    <div
      className="fixed bottom-20 left-4 z-50 max-w-xs bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-start gap-3"
      style={{ animation: "slideIn 0.4s ease" }}
    >
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 text-xl">
        🛍️
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">
          <span className="font-bold text-gray-800">{nome}</span>
          {" de "}
          <span className="font-bold text-[#D61C5C]">{cidadeAtual}</span>
        </p>
        <p className="text-xs text-gray-700 mt-0.5">
          acabou de comprar <span className="font-semibold">{produto}</span>
        </p>
        <p className="text-[10px] text-gray-400 mt-1">há poucos minutos</p>
      </div>

      <button onClick={() => setVisible(false)} className="text-gray-300 hover:text-gray-500 flex-shrink-0">
        <X size={14} />
      </button>
    </div>
  );
}
