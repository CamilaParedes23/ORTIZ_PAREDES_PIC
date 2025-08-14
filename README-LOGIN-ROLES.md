# Solución de Problemas: Sistema de Login con Roles

## 📋 Descripción del Problema

Al implementar el sistema de autenticación con roles múltiples, se presentaron varios errores que impedían que los roles del usuario se mostraran correctamente después del login.

## 🐛 Errores Identificados

### 1. **Error Principal: `roles.map is not a function`**
```
Roles.tsx:14 Uncaught TypeError: roles.map is not a function
```

**Causa:** El componente `Roles.tsx` esperaba recibir un array de roles, pero estaba recibiendo un objeto o valor undefined.

### 2. **Conflicto de Rutas en el Backend**
El endpoint `/api/roles/1` estaba siendo interceptado por la ruta incorrecta debido al orden de las rutas en `app.js`.

**Rutas en conflicto:**
- `rolRoutes.js`: `router.get('/roles/:id', getRolById)` 
- `loginRoutes.js`: `router.get('/roles/:id', getRolesByUserId)`

### 3. **Función de Base de Datos Faltante**
La función `obtener_roles_usuario()` no existía en PostgreSQL, causando errores en el backend.

### 4. **Tipos de Datos Incorrectos en el Frontend**
El `AuthContext` esperaba `string[]` pero el backend devolvía objetos de tipo `Role[]`.

## 🛠️ Solución Implementada

### **Paso 1: Creación de la Función SQL**

Se creó la función `obtener_roles_usuario` en PostgreSQL:

```sql
CREATE OR REPLACE FUNCTION obtener_roles_usuario(p_usuario_id INT)
RETURNS SETOF rol AS
$$
BEGIN
  RETURN QUERY 
  SELECT r.* 
  FROM rol r
  INNER JOIN rol_usuario ru ON r.id = ru.id_rol
  WHERE ru.id_usuario = p_usuario_id 
    AND ru.activo = TRUE 
    AND r.activo = TRUE
  ORDER BY r.id;
END;
$$ LANGUAGE plpgsql;
```

**¿Qué hace?**
- Obtiene todos los roles asignados a un usuario específico
- Filtra solo roles y asignaciones activas
- Hace JOIN entre las tablas `rol` y `rol_usuario`

### **Paso 2: Corrección de Tipos en el Frontend**

Se actualizó el `AuthContext.tsx` para manejar correctamente los tipos de datos:

```typescript
// ANTES - Incorrecto
interface AuthContextProps {
  user: User | null;
  roles: string[];  // ❌ Esperaba strings
  // ...
}

// DESPUÉS - Correcto
interface Role {
  id: number;
  nombre: string;
  descripcion: string;
}

interface AuthContextProps {
  user: User | null;
  roles: Role[];  // ✅ Ahora maneja objetos Role
  // ...
}
```

### **Paso 3: Resolución del Conflicto de Rutas**

Se cambió la URL del frontend para evitar conflictos:

```typescript
// ANTES - Conflicto con rolRoutes
const rolesRes = await fetch(buildUrl(`/api/roles/${userData.id}`));

// DESPUÉS - Ruta específica sin conflicto
const rolesRes = await fetch(buildUrl(`/api/usuario/${userData.id}/roles`));
```

### **Paso 4: Validación y Manejo de Errores**

Se agregó validación en el componente `Roles.tsx`:

```typescript
// Validación para asegurar que roles es un array
if (!Array.isArray(roles)) {
  return (
    <div className="p-d-flex p-flex-column p-ai-center p-mt-6">
      <h2>Cargando roles...</h2>
    </div>
  );
}

// Uso correcto de los datos del rol
{roles.map(role => (
  <Button
    key={role.id}        // ✅ Usa role.id
    label={role.nombre}  // ✅ Usa role.nombre
    onClick={() => navigate(`/${role.nombre.toLowerCase()}`)}
  />
))}
```

### **Paso 5: Debugging Mejorado**

Se agregaron console.logs para identificar problemas:

```typescript
const rolesData: Role[] = await rolesRes.json();
console.log('Roles obtenidos:', rolesData);
console.log('Tipo de datos:', typeof rolesData, Array.isArray(rolesData));

if (Array.isArray(rolesData)) {
  setRoles(rolesData);
} else {
  console.error('Los roles no son un array:', rolesData);
  setRoles([]); // Fallback seguro
}
```

## 🔧 Archivos Modificados

### Backend:
- `project-back/sql/paredes-ortiz/login_01.sql` - Nueva función SQL
- `project-back/controllers/loginController.js` - Sin cambios (ya estaba correcto)
- `project-back/routes/loginRoutes.js` - Sin cambios (ya tenía la ruta correcta)

### Frontend:
- `project-front/src/context/AuthContext.tsx` - Corrección de tipos y URL
- `project-front/src/components/Roles/Roles.tsx` - Validación y manejo correcto de datos

## ✅ Resultado Final

Después de implementar estas soluciones:

1. **✅ Login funciona correctamente** - Autentica al usuario
2. **✅ Roles se cargan correctamente** - Obtiene roles desde la base de datos
3. **✅ Interfaz muestra roles** - Lista los roles disponibles para el usuario
4. **✅ Sin errores en consola** - Manejo adecuado de tipos y errores
5. **✅ Funcionalidad completa** - Usuario puede seleccionar su rol

## 🎯 Lecciones Aprendidas

1. **Orden de rutas importante:** Express ejecuta las rutas en el orden que se definen
2. **Consistencia de tipos:** Frontend y backend deben manejar los mismos tipos de datos
3. **Validación esencial:** Siempre validar que los datos sean del tipo esperado
4. **Funciones SQL necesarias:** Todas las funciones usadas en el backend deben existir en la DB
5. **Debugging efectivo:** Los console.logs ayudan a identificar problemas rápidamente

## 🚀 Próximos Pasos

- Implementar navegación basada en roles seleccionados
- Agregar persistencia de sesión
- Implementar logout funcional
- Mejorar manejo de errores de red

---
*Documento creado por: Bryan Ortiz & Camila Paredes*  
*Fecha: Agosto 2025*
