import Account from '../models/Account.js';
import sequelize from '../db/conection.js';

export const transferMoney = async (req, res) => {
  const { fromId, toId, amount } = req.body;
  
  // Iniciamos la transacción gestionada
  const t = await sequelize.transaction();

  try {
    console.log(`[Transacción ${fromId}] Iniciando y bloqueando fila...`);

    // Bloqueo Pesimista (FOR UPDATE)
    const accountFrom = await Account.findByPk(fromId, { 
      transaction: t, 
      lock: t.LOCK.UPDATE 
    });

    if (!accountFrom || accountFrom.balance < amount) {
      throw new Error('Fondos insuficientes');
    }

    // SIMULACIÓN DE CONCURRENCIA
    console.log(`[Transacción ${fromId}] Durmiendo 10 segundos...`);
    await new Promise(resolve => setTimeout(resolve, 10000));

    const accountTo = await Account.findByPk(toId, { 
      transaction: t, 
      lock: t.LOCK.UPDATE 
    });

    // Operaciones matemáticas
    await accountFrom.update({ 
        balance: parseFloat(accountFrom.balance) - amount 
    }, { transaction: t });

    await accountTo.update({ 
        balance: parseFloat(accountTo.balance) + amount 
    }, { transaction: t });

    // Guardar cambios
    await t.commit();
    console.log(`[Transacción ${fromId}] ✔ Completada.`);
    res.json({ message: 'Transferencia exitosa' });

  } catch (error) {
    // Revertir en caso de error o fondos insuficientes
    await t.rollback();
    console.log(`[Transacción ${fromId}] ✘ Error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

export const getAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findByPk(id);

    if (!account) {
      return res.status(404).json({ error: 'Cuenta no encontrada' });
    }

    res.json(account);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la cuenta' });
  }
};