export const toggleAccountStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const account = await Account.findByPk(id);
    if (!account) return res.status(404).json({ error: 'Cuenta no encontrada' });

    // Cambiamos el estado al opuesto del actual
    account.is_active = !account.is_active;
    await account.save();

    res.json({ 
      message: `Cuenta de ${account.owner} ${account.is_active ? 'activada' : 'bloqueada'}`,
      is_active: account.is_active 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};