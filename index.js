import app from "./src/app.js";
import sequelize from "./src/db/conection.js";
import Account from "./src/models/Account.js";

const PORT = 3000;

async function main() {
  try {
    // force: true reinicia las tablas cada vez que guardas (ideal para pruebas)
    await sequelize.sync({ force: true });

    // Insertamos datos semilla
    await Account.bulkCreate([
      { owner: "Juan", balance: 100 },
      { owner: "Maria", balance: 50 },
    ]);

    app.listen(PORT, () => {
      console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
  }
}

main();
