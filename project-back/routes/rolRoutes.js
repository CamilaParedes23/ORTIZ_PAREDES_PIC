import { Router } from 'express';
const router = Router();
import {
    getAllRoles,
    getRolById,
    createRol,
    updateRol,
    deleteRol,
    getModulosByRol,
    assignModuloToRol,
    removeModuloFromRol,
    getRolesByUserId
} from '../controllers/rolController.js';

// Rutas básicas CRUD
router.get('/roles', getAllRoles);
router.get('/roles/:id', getRolById);
router.post('/roles', createRol);
router.put('/roles/:id', updateRol);
router.delete('/roles/:id', deleteRol);
router.get('/roles/usuario/:id', getRolesByUserId);

// Rutas para gestión de módulos
router.get('/roles/:id/modulos', getModulosByRol);
router.post('/roles/:id/modulos', assignModuloToRol);
router.delete('/roles/:id/modulos', removeModuloFromRol);

export default router;