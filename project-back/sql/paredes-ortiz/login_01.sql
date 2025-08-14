-- =========================
-- 1. Verificar credenciales
CREATE OR REPLACE FUNCTION verificacion_credenciales(p_usuario VARCHAR, p_contrasenia VARCHAR)
RETURNS BOOLEAN AS
$$
DECLARE
  existe BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM usuario
    WHERE email = p_usuario
      AND contrasenia = p_contrasenia
      AND activo = TRUE
  ) INTO existe;

  RETURN existe;
END;
$$ LANGUAGE plpgsql;


-- =========================
-- 2. Obtener usuario por ID
-- =========================
CREATE OR REPLACE FUNCTION obtener_usuario(p_id INT)
RETURNS usuario AS
$$
DECLARE
  u usuario;
BEGIN
  SELECT *
    INTO u
    FROM usuario
   WHERE id = p_id;

  RETURN u;
END;
$$
LANGUAGE plpgsql;

-- =========================
-- 3. Obtener todos los roles
-- =========================
CREATE OR REPLACE FUNCTION obtener_roles()
RETURNS SETOF rol AS 
$$
BEGIN
  RETURN QUERY 
  SELECT * FROM rol 
  WHERE activo = TRUE
  ORDER BY id;
END;  
$$
LANGUAGE plpgsql;

-- =========================
-- 4. Obtener roles de un usuario
-- =========================
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

-- =========================
-- 5. Obtener rol por ID (función auxiliar)
-- =========================
CREATE OR REPLACE FUNCTION obtener_rol_por_id(p_id INT)
RETURNS rol AS
$$
DECLARE
  r rol;
BEGIN
  SELECT * INTO r FROM rol WHERE id = p_id;
  RETURN r;
END;
$$ LANGUAGE plpgsql;


-- =========================
-- 6. Actualizar contraseña
-- =========================
CREATE OR REPLACE FUNCTION actualizar_contrasenia(p_id INT, p_nueva_contrasenia VARCHAR)
RETURNS BOOLEAN AS
$$
BEGIN
  UPDATE usuario
  SET contrasenia = p_nueva_contrasenia
  WHERE id = p_id;

  IF FOUND THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;


-- =========================
-- Función para obtener roles de un usuario
-- =========================
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