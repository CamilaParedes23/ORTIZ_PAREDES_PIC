import { query } from '../config/db.js';

// ==================
// 1. LOGIN
// ==================
export async function login(req, res) {
    const { email, contrasenia } = req.body;
    try {
        const result = await query(
            'SELECT verificacion_credenciales($1, $2) AS valido',
            [email, contrasenia]
        );

        if (!result.rows[0].valido) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const userResult = await query(
            'SELECT * FROM usuario WHERE email = $1',
            [email]
        );

        res.json(userResult.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// ==================
// 2. OBTENER ROLES DE UN USUARIO
// ==================
export async function getRolesByUserId(req, res) {
  const { id } = req.params;
  console.log('Buscando roles para usuario:', id); // <-- agrega esto
  try {
    const result = await query(
      'SELECT * FROM obtener_roles_usuario($1)',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No se encontraron roles para este usuario' });
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Error en getRolesByUserId:', error);
    res.status(500).json({ error: error.message });
  }
}



// ==================
// 3. ACTUALIZAR CONTRASEÑA
// ==================
export async function updatePassword(req, res) {
    const { id } = req.params;
    const { nuevaContrasenia } = req.body;

    try {
        const result = await query(
            'SELECT actualizar_contrasenia($1, $2) AS actualizado',
            [id, nuevaContrasenia]
        );

        if (!result.rows[0].actualizado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// ==================
// 4. OBTENER TODOS LOS ROLES
// ==================
export async function getAllRoles(req, res) {
    try {
        if (req.params.id) {
            // Si hay id, devuelve los roles de ese usuario
            const result = await query('SELECT * FROM obtener_roles_usuario($1)', [req.params.id]);
            res.json(result.rows);
        } else {
            // Si no hay id, devuelve todos los roles
            const result = await query('SELECT * FROM obtener_roles()');
            res.json(result.rows);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
