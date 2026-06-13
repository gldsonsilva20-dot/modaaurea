import { Router } from "express";
import fs from "fs";
import path from "path";

export function registerUploadRoute(app: Router) {
  // Garante que a pasta existe
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  app.post("/api/upload", (req, res) => {
    try {
      const { base64, filename } = req.body;
      if (!base64 || !filename) {
        return res.status(400).json({ error: "base64 e filename são obrigatórios" });
      }

      // Remove o prefixo "data:image/...;base64,"
      const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // Nome único para evitar conflito
      const ext = path.extname(filename) || ".jpg";
      const uniqueName = Date.now() + "-" + Math.random().toString(36).slice(2) + ext;
      const filePath = path.join(uploadsDir, uniqueName);

      fs.writeFileSync(filePath, buffer);

      // Retorna o caminho público
      res.json({ url: "/uploads/" + uniqueName });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Serve os arquivos da pasta public/uploads
  app.use("/uploads", (req, res, next) => {
    const filePath = path.join(process.cwd(), "public", "uploads", req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      next();
    }
  });
}
