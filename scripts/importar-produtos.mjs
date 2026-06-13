import mysql from "mysql2/promise";
import puppeteer from "puppeteer";

const DATABASE_URL = "mysql://2LTxkZMyA6PKrZW.root:z2gfB3MC1z788crOhPAv@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/W5GexGrbSmFCRbkxkWArkd?ssl=%7B%22rejectUnauthorized%22%3Atrue%7D";

// ── 97 LINKS ──────────────────────────────────────────────
const LINKS = [
  "https://www.livianaatacado.com.br/body-liz-gola-alta-costas-nua-/prod-10647491/",
  "https://www.livianaatacado.com.br/calca-courino-wide-leg-/prod-10820847/",
  "https://www.livianaatacado.com.br/blusinha-brasil-/prod-10762323/",
  "https://www.livianaatacado.com.br/saia-brilho-clara/prod-10769409/",
  "https://www.livianaatacado.com.br/vestido-talia-em-ribaninha-premiumalca-regulavel/prod-10709642/",
  "https://www.livianaatacado.com.br/body-decote-cavado-/prod-10597836/",
  "https://www.livianaatacado.com.br/brasil-blusa-alcinha-/prod-10769410/",
  "https://www.livianaatacado.com.br/body-brasil-cavadao-/prod-10761068/",
  "https://www.livianaatacado.com.br/body-gola-alta-manga-longa-anarruga/prod-10295818/",
  "https://www.livianaatacado.com.br/vestido-marmorizado-ester/prod-10764383/",
  "https://www.livianaatacado.com.br/calca-jeans-flare-premium/prod-10771012/",
  "https://www.livianaatacado.com.br/cores-inverno-body-basico-alcinha-anaruga/prod-10293933/",
  "https://www.livianaatacado.com.br/saia-courino/prod-9839715/",
  "https://www.livianaatacado.com.br/cropped-no-ribaninha-/prod-10629540/",
  "https://www.livianaatacado.com.br/vestido-lud-midi-alca-grossa-anarruga/prod-10383349/",
  "https://www.livianaatacado.com.br/top-faixa-recortes-/prod-10466673/",
  "https://www.livianaatacado.com.br/body-suplex-gola-redonda-manga-longa/prod-10391016/",
  "https://www.livianaatacado.com.br/tube-top-unico-suplex-/prod-10435810/",
  "https://www.livianaatacado.com.br/body-manga-longa-decote-quadrado/prod-10778700/",
  "https://www.livianaatacado.com.br/vestido-maya-gola-alta-/prod-10669408/",
  "https://www.livianaatacado.com.br/plus-body-manga-longa-decote-quadrado/prod-10636134/",
  "https://www.livianaatacado.com.br/calca-montaria-suplex-flanelado/prod-10662807/",
  "https://www.livianaatacado.com.br/macacao-decote-quadrado-manga-longa/prod-10654764/",
  "https://www.livianaatacado.com.br/plus-macacao-decote-quadrado-manga-longa/prod-10820858/",
  "https://www.livianaatacado.com.br/plus-vestido-lud-midi/prod-10595766/",
  "https://www.livianaatacado.com.br/shorts-zara-com-cinto-alfaiataria-/prod-10529564/",
  "https://www.livianaatacado.com.br/macacao-plus-alcinha-anarruga/prod-10697207/",
  "https://www.livianaatacado.com.br/plus-bata-blusa-bia-/prod-10756389/",
  "https://www.livianaatacado.com.br/conjunto-new-york/prod-10811404/",
  "https://www.livianaatacado.com.br/body-renda-transparencia-/prod-10828787/",
  "https://www.livianaatacado.com.br/cropped-zuri-suplex-decotado/prod-10662805/",
  "https://www.livianaatacado.com.br/blusa-gola-redonda-peluciada-/prod-10798185/",
  "https://www.livianaatacado.com.br/blusa-gola-alta-peluciada/prod-10810189/",
  "https://www.livianaatacado.com.br/vestidoestampadovirginia/prod-10713478/",
  "https://www.livianaatacado.com.br/body-milao-mula-costas-nua/prod-10828781/",
  "https://www.livianaatacado.com.br/vestido-babi-costas-nua-com-bojo/prod-10794122/",
  "https://www.livianaatacado.com.br/vestidocoralestampado/prod-10771824/",
  "https://www.livianaatacado.com.br/meia-calca-peluciada-/prod-10667744/",
  "https://www.livianaatacado.com.br/topfaixasuplex/prod-9837372/",
  "https://www.livianaatacado.com.br/body-anita-aberto-nas-laterais/prod-10263407/",
  "https://www.livianaatacado.com.br/blusa-manguinha-decote-quadrado/prod-10450559/",
  "https://www.livianaatacado.com.br/mula-regata-suplex-body/prod-10489640/",
  "https://www.livianaatacado.com.br/plus-blusa-zafira-assimetrica-/prod-10595658/",
  "https://www.livianaatacado.com.br/-body-bianca-suplex/prod-10619814/",
  "https://www.livianaatacado.com.br/calca-cargo-jeans-/prod-10711323/",
  "https://www.livianaatacado.com.br/body-plus-isis-bicolor-alcinha/prod-10708789/",
  "https://www.livianaatacado.com.br/blusa-alcinha-basica/prod-10718374/",
  "https://www.livianaatacado.com.br/vestido-tati-drapeado/prod-10752507/",
  "https://www.livianaatacado.com.br/top-fadinha-com-tule/prod-10753125/",
  "https://www.livianaatacado.com.br/vestido-julia-ziper-costas-/prod-10765496/",
  "https://www.livianaatacado.com.br/vestido-marimar-coracao/prod-10762982/",
  "https://www.livianaatacado.com.br/saia-jade-estampada-/prod-10764666/",
  "https://www.livianaatacado.com.br/vestido-karina-costa-nua-/prod-10680832/",
  "https://www.livianaatacado.com.br/conjunto-dakota-saia-fendatop-amarrar-/prod-10035630/",
  "https://www.livianaatacado.com.br/vestido-reto-suplex/prod-9837358/",
  "https://www.livianaatacado.com.br/vestido-fivela-mariah/prod-10639305/",
  "https://www.livianaatacado.com.br/saia-jeans-bolso-chapado/prod-10753991/",
  "https://www.livianaatacado.com.br/shorts-saia-courino/prod-10786930/",
  "https://www.livianaatacado.com.br/vestido-romantic-fendas-laterais-/prod-9970349/",
  "https://www.livianaatacado.com.br/kimono-listrado-somente-kimono/prod-10761069/",
  "https://www.livianaatacado.com.br/shortsbolsochapado/prod-10762324/",
  "https://www.livianaatacado.com.br/body-bali-suplex/prod-9900278/",
  "https://www.livianaatacado.com.br/plus-blusa-gola-redonda-peluciada-/prod-10819985/",
  "https://www.livianaatacado.com.br/corselet-samy-cirre-meia-taca-/prod-10465099/",
  "https://www.livianaatacado.com.br/body-ziper-golinha-/prod-10820848/",
  "https://www.livianaatacado.com.br/plus-blusa-gola-alta-peluciada/prod-10819984/",
  "https://www.livianaatacado.com.br/shorts-saia-detalhes-basica-bengaline/prod-9839719/",
  "https://www.livianaatacado.com.br/vestido-curto-julia-sem-ziper-/prod-10770205/",
  "https://www.livianaatacado.com.br/biquini-de-fita-suplex/prod-10597829/",
  "https://www.livianaatacado.com.br/top-gringa-amarracao-/prod-10728563/",
  "https://www.livianaatacado.com.br/calca-wide-leg-jeans/prod-10756850/",
  "https://www.livianaatacado.com.br/shorts-listrado-/prod-10723928/",
  "https://www.livianaatacado.com.br/cropped-costas-nua-/prod-10613675/",
  "https://www.livianaatacado.com.br/macacao-alcinha-anarruga/prod-10338594/",
  "https://www.livianaatacado.com.br/vestido-serena-suplex-/prod-10544863/",
  "https://www.livianaatacado.com.br/vestido-basico-anarruga-curto/prod-10173320/",
  "https://www.livianaatacado.com.br/saia-longa-fenda-suplex-/prod-10437559/",
  "https://www.livianaatacado.com.br/plus-blusa-manguinha-decote-quadrado/prod-10611964/",
  "https://www.livianaatacado.com.br/vestido-tais-ribaninha-abertura-laterais-/prod-10460918/",
  "https://www.livianaatacado.com.br/blusa-zafira-assimetrica-/prod-10053915/",
  "https://www.livianaatacado.com.br/body-tomara-que-caia-liso-anarruga/prod-9995663/",
  "https://www.livianaatacado.com.br/body-decote-quadrado-suplex/prod-10435814/",
  "https://www.livianaatacado.com.br/vestido-coqueiro-alca-elastico/prod-10601390/",
  "https://www.livianaatacado.com.br/vestido-caribe-costas-nua-curto/prod-10006253/",
  "https://www.livianaatacado.com.br/vestido-jasmin-estampado/prod-10757744/",
  "https://www.livianaatacado.com.br/plus-body-bali-suplex/prod-10524089/",
  "https://www.livianaatacado.com.br/body-basico-alcinha-anaruga/prod-9945704/",
  "https://www.livianaatacado.com.br/body-nadador-cavado-costas-anarruga-/prod-10155138/",
  "https://www.livianaatacado.com.br/top-retro-meia-taca-ribaninha/prod-10305204/",
  "https://www.livianaatacado.com.br/cropped-ribaninha-alca-grossa/prod-10172539/",
  "https://www.livianaatacado.com.br/vestido-canelado-gola-alta/prod-9837363/",
  "https://www.livianaatacado.com.br/vestido-recorte-gola-canelado/prod-9837361/",
  "https://www.livianaatacado.com.br/plus-cropped-bali-suplex/prod-10529563/",
  "https://www.livianaatacado.com.br/vestido-sereia-drapeado/prod-10730284/",
  "https://www.livianaatacado.com.br/vestido-virginia-suplex/prod-10613676/",
  "https://www.livianaatacado.com.br/TOPRECORTESNEON/prod-10762980/",
  "https://www.livianaatacado.com.br/body-basico-cores-candy/prod-10456615/",
];

// ── TAMANHOS ──────────────────────────────────────────────
const TAMANHOS = ["P", "M", "G", "GG", "XG", "G1", "G2"];

// ── CATEGORIAS ────────────────────────────────────────────
const REGRAS_CATEGORIA = [
  { palavras: ["vestido"],                                               categoria: "Vestidos" },
  { palavras: ["conjunto"],                                              categoria: "Conjuntos" },
  { palavras: ["short", "bermuda", "saia"],                             categoria: "Saias e Shorts" },
  { palavras: ["calça", "calca", "legging", "meia-calca", "meia calca"], categoria: "Calças" },
  { palavras: ["casaco", "jaqueta", "blazer", "cardigan", "kimono"],    categoria: "Casacos" },
  { palavras: ["tricô", "trico"],                                        categoria: "Tricô" },
  { palavras: ["macacao", "macacão"],                                    categoria: "Conjuntos" },
  { palavras: ["body", "blusa", "blusinha", "camisa", "camiseta",
               "regata", "cropped", "top", "bata", "corselet",
               "tube", "t-shirt", "tshirt", "biquini"],                 categoria: "Blusas" },
];

// ── CORES ─────────────────────────────────────────────────
const MAPA_CORES = {
  "PRETO": "#000000", "BRANCO": "#FFFFFF", "OFF WHITE": "#F5F5F0",
  "AZUL": "#4A90D9", "AZUL BB": "#4A90D9", "AZUL MARINHO": "#00008B", "MARINHO": "#00008B",
  "VERDE": "#008000", "VERDE BANDEIRA": "#009739", "VERDE MILITAR": "#4B5320",
  "VERMELHO": "#FF0000", "VINHO": "#8B0000", "BORDÔ": "#8B0000", "BORDO": "#8B0000",
  "ROSA": "#FFC0CB", "PINK": "#FF69B4", "ROSA CHICLETE": "#FF69B4", "ROSA BB": "#F4C2C2",
  "LARANJA": "#FF6600",
  "AMARELO": "#FFD700", "MOSTARDA": "#C8A832",
  "ROXO": "#800080", "LILÁS": "#C8A2C8", "LILAS": "#C8A2C8",
  "BEGE": "#D2B48C", "NUDE": "#E3BC9A",
  "MARROM": "#A52A2A", "CAFÉ": "#6F4E37", "CAFE": "#6F4E37", "CHOCOLATE": "#7B3F00",
  "TERRACOTA": "#E2725B", "CINZA": "#808080",
};
const CORES_PADRAO = ["#000000", "#FFFFFF", "#FFC0CB", "#808080"];

function detectarCategoria(nome) {
  const n = nome.toLowerCase();
  for (const r of REGRAS_CATEGORIA) {
    if (r.palavras.some(p => n.includes(p))) return r.categoria;
  }
  return "Blusas";
}

function corParaHex(nomeCor) {
  const k = nomeCor.toUpperCase().trim();
  if (MAPA_CORES[k]) return MAPA_CORES[k];
  for (const chave of Object.keys(MAPA_CORES)) {
    if (k.includes(chave)) return MAPA_CORES[chave];
  }
  return null;
}

function slugify(str) {
  return str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    + "-" + Date.now() + "-" + Math.floor(Math.random() * 9999);
}

// ── SCRAPER DE PRODUTO ─────────────────────────────────────
async function fetchProduto(page, url) {
  await page.goto(url, { waitUntil: "networkidle2", timeout: 40000 });

  return await page.evaluate(() => {
    // NOME
    const h1 = document.querySelector("h1");
    const nome = h1 ? h1.textContent.trim() : null;

    // DESCRIÇÃO
    const descEl = document.querySelector(".description, .produto-descricao, [class*='descri']");
    const descricao = descEl ? descEl.textContent.trim() : "";

    // ✅ PREÇO — busca pelo span específico do site
    let preco = null;
    const spanPreco = document.querySelector("#vr_preco_principal_produto");
    if (spanPreco) {
      preco = spanPreco.textContent.trim();
    }
    // fallback: busca por "por: R$ XX,XX"
    if (!preco) {
      const allEls = [...document.querySelectorAll("*")];
      for (const el of allEls) {
        if (el.children.length > 0) continue;
        const txt = el.textContent.trim();
        const m = txt.match(/por\s*:\s*R\$\s*([\d.,]+)/i);
        if (m) { preco = m[1]; break; }
      }
    }
    // fallback 2: primeiro R$ encontrado
    if (!preco) {
      const allEls = [...document.querySelectorAll("*")];
      for (const el of allEls) {
        if (el.children.length > 0) continue;
        const txt = el.textContent.trim();
        const m = txt.match(/R\$\s*([\d.,]+)/);
        if (m && txt.length < 20) { preco = m[1]; break; }
      }
    }

    // FOTOS — imagens do cloudfront com /G/ (tamanho grande)
    const fotos = [...new Set(
      [...document.querySelectorAll("img")]
        .map(i => i.src)
        .filter(s =>
          s.includes("cloudfront.net") &&
          /\/G\//i.test(s) &&
          /\.(jpe?g|png|webp)/i.test(s)
        )
    )].slice(0, 6);

    // CORES — botões/spans com nomes de cor em maiúsculo
    const NOMES = ["AZUL","VERDE","VERMELHO","VINHO","CAFE","CAFÉ","CHOCOLATE",
                   "ROSA","LARANJA","TERRACOTA","PRETO","BRANCO","AMARELO",
                   "CINZA","ROXO","LILAS","LILÁS","BEGE","MARROM","NUDE",
                   "OFF WHITE","MOSTARDA","PINK","MARINHO","BORDÔ","BORDO",
                   "FUSCHIA","FUCHSIA"];
    const coresNomes = [...new Set(
      [...document.querySelectorAll("button, span, div, li, a")]
        .map(el => el.textContent.trim())
        .filter(t =>
          t.length > 0 && t.length < 30 &&
          t === t.toUpperCase() &&
          NOMES.some(c => t.includes(c))
        )
    )];

    return { nome, descricao, preco, fotos, coresNomes };
  });
}

// ── MAIN ──────────────────────────────────────────────────
async function main() {
  if (!DATABASE_URL) {
    console.error("DATABASE_URL nao definida!");
    process.exit(1);
  }

  console.log("Conectando ao banco...");
  const conn = await mysql.createConnection(DATABASE_URL);
  console.log("Banco conectado!\n");

  // carrega categorias existentes
  const [cats] = await conn.execute("SELECT id, name FROM categories");
  const catMap = {};
  for (const c of cats) catMap[c.name] = c.id;

  // garante que todas as categorias necessarias existem
  const todasCats = ["Blusas","Tricô","Vestidos","Conjuntos","Calças","Saias e Shorts","Casacos"];
  for (const nome of todasCats) {
    if (!catMap[nome]) {
      const slug = slugify(nome);
      await conn.execute("INSERT IGNORE INTO categories (name, slug) VALUES (?, ?)", [nome, slug]);
      const [rows] = await conn.execute("SELECT id FROM categories WHERE name = ? LIMIT 1", [nome]);
      if (rows[0]) catMap[nome] = rows[0].id;
    }
  }

  console.log("Abrindo browser...\n");
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36");

  await page.setRequestInterception(true);
  page.on("request", req => {
    if (["font", "stylesheet", "media"].includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });

  let ok = 0, pulados = 0, erros = 0;
  const total = LINKS.length;

  for (let i = 0; i < LINKS.length; i++) {
    const url = LINKS[i];
    console.log(`\n[${i + 1}/${total}] ${url}`);

    try {
      const d = await fetchProduto(page, url);

      if (!d.nome) {
        console.log("   Nome nao encontrado - pulado");
        pulados++; continue;
      }
      if (!d.preco) {
        console.log(`   Preco nao encontrado para "${d.nome}" - pulado`);
        pulados++; continue;
      }

      const precoNum = d.preco.replace(/\./g, "").replace(",", ".");
      if (isNaN(parseFloat(precoNum))) {
        console.log(`   Preco invalido "${d.preco}" - pulado`);
        pulados++; continue;
      }

      const categoria = detectarCategoria(d.nome);
      const catId = catMap[categoria];

      let coresHex = d.coresNomes.map(corParaHex).filter(Boolean);
      coresHex = [...new Set(coresHex)];
      if (coresHex.length === 0) coresHex = CORES_PADRAO;

      const slug      = slugify(d.nome);
      const imageUrls = JSON.stringify(d.fotos);
      const tamanhos  = JSON.stringify(TAMANHOS);
      const cores     = JSON.stringify(coresHex);
      const descFinal = d.descricao || `${d.nome} - peca de alta qualidade com acabamento premium.`;
      const stock     = Math.floor(20 + Math.random() * 80);
      const isFeatured = ok < 8 ? 1 : 0;

      await conn.execute(
        `INSERT INTO products
           (categoryId, name, slug, description, price, costPrice, stock, imageUrls, sizes, colors, isFeatured, isPromotion)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [catId, d.nome, slug, descFinal, precoNum, null, stock, imageUrls, tamanhos, cores, isFeatured, 0]
      );

      ok++;
      console.log(`   OK [${categoria}] ${d.nome}`);
      console.log(`      R$ ${precoNum}  |  ${d.fotos.length} foto(s)  |  ${coresHex.length} cor(es)`);

    } catch (e) {
      console.log(`   ERRO: ${e.message}`);
      erros++;
    }

    await new Promise(r => setTimeout(r, 800));
  }

  await browser.close();
  await conn.end();

  console.log("\n==========================================");
  console.log("Importacao concluida!");
  console.log(`   Importados : ${ok}`);
  console.log(`   Pulados    : ${pulados}`);
  console.log(`   Erros      : ${erros}`);
  console.log("==========================================");
}

main().catch(console.error);
