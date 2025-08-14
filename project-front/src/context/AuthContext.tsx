// src/context/AuthContext.tsx
import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  // cualquier otro campo que devuelva tu API
}

interface Role {
  id: number;
  nombre: string;
  descripcion: string;
}

interface AuthContextProps {
  user: User | null;
  roles: Role[];
  login: (email: string, contrasenia: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  roles: [],
  login: async () => {},
  logout: () => {}
});

const API_BASE = "http://localhost:3000";
const buildUrl = (path: string) => `${API_BASE}${path}`;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  const login = async (email: string, contrasenia: string) => {
    // 1) Llamada al endpoint de login
    const res = await fetch(buildUrl('/api/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        contrasenia
      })
    });

    if (!res.ok) {
      throw new Error('Credenciales inválidas');
    }

    const userData: User = await res.json();

    console.log(userData);
    setUser(userData);

    // 2) Obtener roles del usuario logueado
    const rolesRes = await fetch(buildUrl(`/api/usuario/${userData.id}/roles`), {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!rolesRes.ok) {
      console.error('Error al obtener roles:', rolesRes.status, rolesRes.statusText);
      throw new Error('No se pudieron obtener los roles');
    }

    const rolesData: Role[] = await rolesRes.json();
    console.log('Roles obtenidos:', rolesData);
    console.log('Tipo de datos:', typeof rolesData, Array.isArray(rolesData));
    
    // Asegurar que rolesData es un array
    if (Array.isArray(rolesData)) {
      setRoles(rolesData);
    } else {
      console.error('Los roles no son un array:', rolesData);
      setRoles([]); // Establecer array vacío por seguridad
    }
  };

  const logout = () => {
    setUser(null);
    setRoles([]);
  };

  return (
    <AuthContext.Provider value={{ user, roles, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
