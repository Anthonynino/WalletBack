import app from './src/app.js';
import sequelize from "./src/db/conection.js"
import Account from './src/models/Account.js';

const PORT = 3000;

async function main() {
    try {
        // force: true reinicia las tablas cada vez que guardas (ideal para pruebas)
        await sequelize.sync({ force: true });
        
        // Insertamos datos semilla con PIN y Estado de Acceso
        await Account.bulkCreate([
            { 
                owner: 'Juan', 
                balance: 100, 
                pin: '1234',      // Credencial de seguridad
                is_active: true   // Control de acceso habilitado
            },
            { 
                owner: 'Maria', 
                balance: 50, 
                pin: '5678', 
                is_active: true 
            },
            { 
                owner: 'Cuenta Bloqueada', 
                balance: 1000, 
                pin: '0000', 
                is_active: false  // Esto sirve para demostrar el "Acceso Denegado" de inmediato
            }
        ]);

        app.listen(PORT, () => {
            console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
            console.log('--- Datos de prueba cargados ---');
            console.log('Juan (ID: 1) - PIN: 1234');
            console.log('Maria (ID: 2) - PIN: 5678');
            console.log('Bloqueada (ID: 3) - PIN: 0000 (is_active: false)');
        });
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
}

main();