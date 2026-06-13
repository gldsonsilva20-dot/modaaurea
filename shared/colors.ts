/**
 * Portfólio completo de cores para produtos da Moda Aurea
 * Use este arquivo para gerenciar cores disponíveis
 */

export interface Color {
  name: string;
  hex: string;
  category?: string;
}

export const COLOR_PALETTE: Color[] = [
  // Cores Neutras
  { name: "Branco", hex: "#FFFFFF", category: "Neutras" },
  { name: "Preto", hex: "#000000", category: "Neutras" },
  { name: "Cinza Claro", hex: "#E8E8E8", category: "Neutras" },
  { name: "Cinza Médio", hex: "#A9A9A9", category: "Neutras" },
  { name: "Cinza Escuro", hex: "#505050", category: "Neutras" },
  { name: "Bege", hex: "#D4AF37", category: "Neutras" },
  { name: "Cáqui", hex: "#9B8B5C", category: "Neutras" },
  { name: "Marrom Claro", hex: "#D2B48C", category: "Neutras" },
  { name: "Marrom Médio", hex: "#8B6F47", category: "Neutras" },
  { name: "Marrom Escuro", hex: "#3E2723", category: "Neutras" },

  // Tons de Rosa e Vermelho
  { name: "Rosa Aurea", hex: "#D61C5C", category: "Rosa/Vermelho" },
  { name: "Rosa Claro", hex: "#FFB6C1", category: "Rosa/Vermelho" },
  { name: "Rosa Pastel", hex: "#FFC0CB", category: "Rosa/Vermelho" },
  { name: "Rosa Quente", hex: "#FF69B4", category: "Rosa/Vermelho" },
  { name: "Rosa Choque", hex: "#FF1493", category: "Rosa/Vermelho" },
  { name: "Rosa Pêssego", hex: "#FFDAB9", category: "Rosa/Vermelho" },
  { name: "Rosa Coral", hex: "#FF7F50", category: "Rosa/Vermelho" },
  { name: "Vermelho Vivo", hex: "#FF0000", category: "Rosa/Vermelho" },
  { name: "Vermelho Escuro", hex: "#8B0000", category: "Rosa/Vermelho" },
  { name: "Vermelho Vinho", hex: "#722F37", category: "Rosa/Vermelho" },
  { name: "Salmão", hex: "#FA8072", category: "Rosa/Vermelho" },
  { name: "Terracota", hex: "#E2725B", category: "Rosa/Vermelho" },

  // Tons de Azul
  { name: "Azul Claro", hex: "#ADD8E6", category: "Azul" },
  { name: "Azul Céu", hex: "#87CEEB", category: "Azul" },
  { name: "Azul Pastel", hex: "#B0E0E6", category: "Azul" },
  { name: "Azul Royal", hex: "#4169E1", category: "Azul" },
  { name: "Azul Médio", hex: "#0047AB", category: "Azul" },
  { name: "Azul Marinho", hex: "#000080", category: "Azul" },
  { name: "Azul Petróleo", hex: "#003D5C", category: "Azul" },
  { name: "Azul Tiffany", hex: "#0ABAB5", category: "Azul" },
  { name: "Azul Turquesa", hex: "#40E0D0", category: "Azul" },
  { name: "Azul Índigo", hex: "#4B0082", category: "Azul" },

  // Tons de Verde
  { name: "Verde Claro", hex: "#90EE90", category: "Verde" },
  { name: "Verde Pastel", hex: "#98FF98", category: "Verde" },
  { name: "Verde Menta", hex: "#98FF98", category: "Verde" },
  { name: "Verde Água", hex: "#AFEEEE", category: "Verde" },
  { name: "Verde Folha", hex: "#228B22", category: "Verde" },
  { name: "Verde Floresta", hex: "#014421", category: "Verde" },
  { name: "Verde Oliva", hex: "#6B8E23", category: "Verde" },
  { name: "Verde Musgo", hex: "#4A5D23", category: "Verde" },
  { name: "Verde Escuro", hex: "#013220", category: "Verde" },
  { name: "Verde Esmeralda", hex: "#50C878", category: "Verde" },

  // Tons de Amarelo e Ouro
  { name: "Amarelo Claro", hex: "#FFFF99", category: "Amarelo/Ouro" },
  { name: "Amarelo Pastel", hex: "#FFFFE0", category: "Amarelo/Ouro" },
  { name: "Amarelo Ouro", hex: "#FFD700", category: "Amarelo/Ouro" },
  { name: "Amarelo Vivo", hex: "#FFFF00", category: "Amarelo/Ouro" },
  { name: "Amarelo Mostarda", hex: "#FFDB58", category: "Amarelo/Ouro" },
  { name: "Ouro Antigo", hex: "#CFB53B", category: "Amarelo/Ouro" },
  { name: "Ouro Escuro", hex: "#AA8C2C", category: "Amarelo/Ouro" },
  { name: "Dourado", hex: "#DAA520", category: "Amarelo/Ouro" },

  // Tons de Laranja
  { name: "Laranja Claro", hex: "#FFD580", category: "Laranja" },
  { name: "Laranja Pastel", hex: "#FFDAB9", category: "Laranja" },
  { name: "Laranja Queimado", hex: "#FF8C00", category: "Laranja" },
  { name: "Laranja Vivo", hex: "#FF8000", category: "Laranja" },
  { name: "Laranja Escuro", hex: "#FF6347", category: "Laranja" },
  { name: "Cobre", hex: "#B87333", category: "Laranja" },
  { name: "Ferrugem", hex: "#B7410E", category: "Laranja" },

  // Tons de Roxo
  { name: "Roxo Claro", hex: "#E6D7FF", category: "Roxo" },
  { name: "Roxo Pastel", hex: "#DDA0DD", category: "Roxo" },
  { name: "Roxo Médio", hex: "#9370DB", category: "Roxo" },
  { name: "Roxo Vivo", hex: "#9933FF", category: "Roxo" },
  { name: "Roxo Escuro", hex: "#4B0082", category: "Roxo" },
  { name: "Lavanda", hex: "#E6E6FA", category: "Roxo" },
  { name: "Lilás", hex: "#C8A2C8", category: "Roxo" },
  { name: "Magenta", hex: "#FF00FF", category: "Roxo" },

  // Tons de Pele
  { name: "Pele Claro", hex: "#FDBCB4", category: "Pele" },
  { name: "Pele Médio", hex: "#FDBCB4", category: "Pele" },
  { name: "Pele Escuro", hex: "#D4A574", category: "Pele" },
  { name: "Nude Claro", hex: "#F5DEB3", category: "Pele" },
  { name: "Nude Médio", hex: "#DEB887", category: "Pele" },
  { name: "Nude Escuro", hex: "#CD853F", category: "Pele" },

  // Cores Especiais
  { name: "Holográfico", hex: "#E0FFFF", category: "Especial" },
  { name: "Metalizado", hex: "#C0C0C0", category: "Especial" },
  { name: "Neon Rosa", hex: "#FF10F0", category: "Especial" },
  { name: "Neon Verde", hex: "#39FF14", category: "Especial" },
  { name: "Neon Azul", hex: "#0FFF50", category: "Especial" },
];

/**
 * Função para obter cores por categoria
 */
export function getColorsByCategory(category: string): Color[] {
  return COLOR_PALETTE.filter((color) => color.category === category);
}

/**
 * Função para obter todas as categorias
 */
export function getColorCategories(): string[] {
  const categories = new Set(COLOR_PALETTE.map((color) => color.category || "Outras"));
  return Array.from(categories).sort();
}

/**
 * Função para validar cor hex
 */
export function isValidHexColor(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

/**
 * Função para criar cor customizada
 */
export function createCustomColor(name: string, hex: string): Color | null {
  if (!isValidHexColor(hex)) {
    console.error("Cor hex inválida:", hex);
    return null;
  }
  return { name, hex, category: "Customizada" };
}
