import Account from '../models/Account.js';
import sequelize from '../db/conection.js';

export const transferMoney = async (req, res) => {
  // 1. Recibimos el PIN desde el body
  const { fromId, toId, amount, pin } = req.body;
  
  const t = await sequelize.transaction();

  try {
    console.log(`[Transacción ${fromId}] Intentando acceder...`);

    // Bloqueo Pesimista
    const accountFrom = await Account.findByPk(fromId, { 
      transaction: t, 
      lock: t.LOCK.UPDATE 
    });

    // --- CAPA DE SEGURIDAD Y CONTROL DE ACCESO ---
    
    if (!accountFrom) {
      throw new Error('La cuenta de origen no existe');
    }

    // A. Control de Acceso: Verificar si la cuenta está habilitada
    if (!accountFrom.is_active) {
      throw new Error('Acceso Denegado: Esta cuenta se encuentra bloqueada.');
    }

    // B. Autenticación: Verificar el PIN
    if (accountFrom.pin !== pin) {
      throw new Error('Seguridad: El PIN ingresado es incorrecto.');
    }

    // ----------------------------------------------

    if (parseFloat(accountFrom.balance) < amount) {
      throw new Error('Fondos insuficientes');
    }

    console.log(`[Transacción ${fromId}] PIN validado. Procesando con retardo...`);
    await new Promise(resolve => setTimeout(resolve, 10000));

    const accountTo = await Account.findByPk(toId, { 
      transaction: t, 
      lock: t.LOCK.UPDATE 
    });

    if (!accountTo) throw new Error('La cuenta de destino no existe');

    // Operaciones
    await accountFrom.update({ 
        balance: parseFloat(accountFrom.balance) - parseFloat(amount) 
    }, { transaction: t });

    await accountTo.update({ 
        balance: parseFloat(accountTo.balance) + parseFloat(amount) 
    }, { transaction: t });

    await t.commit();
    res.json({ message: 'Transferencia exitosa autorizada' });

  } catch (error) {
    await t.rollback();
    console.log(`[Transacción ${fromId}] ✘ Error de seguridad/proceso: ${error.message}`);
    
    // Diferenciamos el código de error para el frontend
    const statusCode = error.message.includes('Seguridad') ? 401 : 400;
    res.status(statusCode).json({ error: error.message });
  }
};