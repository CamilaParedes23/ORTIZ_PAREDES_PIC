import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { AuthContext } from '../../context/AuthContext';

const Roles: React.FC = () => {
  const { roles, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Validación para asegurar que roles es un array
  if (!Array.isArray(roles)) {
    return (
      <div className="p-d-flex p-flex-column p-ai-center p-mt-6">
        <h2>Cargando roles...</h2>
      </div>
    );
  }

  return (
    <div className="p-d-flex p-flex-column p-ai-center p-mt-6">
      <h2>Selecciona tu rol</h2>
      <div className="p-d-flex p-flex-wrap p-jc-center p-mt-4" style={{ gap: '1rem' }}>
        {roles.map(role => (
          <Button
            key={role.id}
            label={role.nombre}
            icon={`pi pi-user-${role.nombre.toLowerCase()}`}
            onClick={() => navigate(`/${role.nombre.toLowerCase()}`)}
          />
        ))}
      </div>
      <Button
        label="Cerrar sesión"
        icon="pi pi-sign-out"
        className="p-button-text p-mt-5"
        onClick={() => {
          logout();
          navigate('/');
        }}
      />
    </div>
  );
};

export default Roles;
