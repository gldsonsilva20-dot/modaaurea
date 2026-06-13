import mysql from "mysql2/promise";

const DATABASE_URL = "mysql://2LTxkZMyA6PKrZW.root:z2gfB3MC1z788crOhPAv@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/W5GexGrbSmFCRbkxkWArkd?ssl=%7B%22rejectUnauthorized%22%3Atrue%7D";

const NEW_SIZES = JSON.stringify(["P", "M", "G", "GG", "G1", "G2", "G3", "G4"]);

async function main() {
  console.log("Conectando ao banco...");
  const conn = await mysql.createConnection(DATABASE_URL);
  console.log("Banco conectado!\n");

  const [result]: any = await conn.execute(
    "UPDATE products SET sizes = ?",
    [NEW_SIZES]
  );

  console.log(`✅ ${result.affectedRows} produtos atualizados com: P, M, G, GG, G1, G2, G3, G4`);

  await conn.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erro ao atualizar:", err);
  process.exit(1);
});
