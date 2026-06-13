import { useState } from "react";
import { COLOR_PALETTE, Color, isValidHexColor } from "@shared/colors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface ColorSelectorProps {
  selectedColors: Color[];
  onColorsChange: (colors: Color[]) => void;
}

export default function ColorSelector({ selectedColors, onColorsChange }: ColorSelectorProps) {
  const [showPalette, setShowPalette] = useState(false);
  const [customColorName, setCustomColorName] = useState("");
  const [customColorHex, setCustomColorHex] = useState("#000000");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(COLOR_PALETTE.map((c: Color) => c.category || "Outras"))).sort() as string[];
  const filteredColors = filterCategory
    ? COLOR_PALETTE.filter((c: Color) => (c.category || "Outras") === filterCategory)
    : COLOR_PALETTE;

  const handleAddColor = (color: Color) => {
    if (!selectedColors.find((c) => c.hex === color.hex)) {
      onColorsChange([...selectedColors, color]);
    }
  };

  const handleRemoveColor = (hex: string) => {
    onColorsChange(selectedColors.filter((c) => c.hex !== hex));
  };

  const handleAddCustomColor = () => {
    if (!customColorName.trim()) {
      alert("Digite um nome para a cor");
      return;
    }
    if (!isValidHexColor(customColorHex)) {
      alert("Código de cor inválido. Use formato #RRGGBB");
      return;
    }
    const customColor: Color = {
      name: customColorName,
      hex: customColorHex,
      category: "Customizada",
    };
    handleAddColor(customColor);
    setCustomColorName("");
    setCustomColorHex("#000000");
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold mb-2">Cores do Produto</label>

        {/* Cores Selecionadas */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          {selectedColors.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhuma cor selecionada</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {selectedColors.map((color) => (
                <div
                  key={color.hex}
                  className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-300"
                >
                  <div
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-sm font-medium">{color.name}</span>
                  <button
                    onClick={() => handleRemoveColor(color.hex)}
                    className="text-red-600 hover:text-red-700 ml-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botão para abrir paleta */}
        <Button
          type="button"
          onClick={() => setShowPalette(!showPalette)}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 mb-4"
        >
          {showPalette ? "Fechar Paleta de Cores" : "Abrir Paleta de Cores"}
        </Button>

        {/* Paleta de Cores */}
        {showPalette && (
          <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-4">
            {/* Filtro por Categoria */}
            <div>
              <label className="block text-xs font-bold mb-2">Filtrar por Categoria</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterCategory(null)}
                  className={`px-3 py-1 text-xs rounded transition ${
                    filterCategory === null
                      ? "bg-[#D61C5C] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Todas
                </button>
                {categories.map((cat: string) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1 text-xs rounded transition ${
                      filterCategory === cat
                        ? "bg-[#D61C5C] text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de Cores */}
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {filteredColors.map((color: Color) => (
                <button
                  key={color.hex}
                  onClick={() => handleAddColor(color)}
                  title={color.name}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <div
                    className="w-12 h-12 rounded border-2 border-gray-300 hover:border-[#D61C5C] transition"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-xs text-center font-medium text-gray-700 line-clamp-2">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Cor Customizada */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <h4 className="text-sm font-bold">Adicionar Cor Customizada</h4>
              <div className="grid md:grid-cols-3 gap-2">
                <Input
                  placeholder="Nome da cor"
                  value={customColorName}
                  onChange={(e) => setCustomColorName(e.target.value)}
                  className="text-sm"
                />
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={customColorHex}
                    onChange={(e) => setCustomColorHex(e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    placeholder="#000000"
                    value={customColorHex}
                    onChange={(e) => setCustomColorHex(e.target.value)}
                    className="text-sm flex-1"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAddCustomColor}
                  className="bg-[#D61C5C] hover:bg-[#B01246] text-white"
                >
                  Adicionar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
