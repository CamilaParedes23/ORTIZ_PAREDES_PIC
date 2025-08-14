import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { AuthContext } from '../../context/AuthContext';
import './Roles.css';

const Roles: React.FC = () => {
  const { roles, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Validación para asegurar que roles es un array
  if (!Array.isArray(roles)) {
    return (
      <div className="roles-container">
        <div className="loading-container">
          <i className="pi pi-spinner pi-spin" style={{fontSize: '2rem'}}></i>
          <h2>Cargando roles...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="roles-container">
      <div className="roles-content">
        <Card className="roles-card">
          <div className="roles-header">
            <i className="pi pi-user-plus roles-icon"></i>
            <h1>¡Bienvenido, {user?.nombres}!</h1>
            <p>Selecciona tu rol para continuar</p>
          </div>
          
          <div className="roles-grid">
            {roles.map(role => (
              <Button
                key={role.id}
                label={role.nombre}
                icon="pi pi-shield"
                className="role-button"
                onClick={() => navigate(`/panel/${role.nombre.toLowerCase()}`, { 
                  state: { roleName: role.nombre, roleDescription: role.descripcion } 
                })}
                tooltip={role.descripcion}
                tooltipOptions={{ position: 'top' }}
              />
            ))}
          </div>

          <div className="roles-footer">
            <Button
              label="Cerrar sesión"
              icon="pi pi-sign-out"
              className="p-button-outlined p-button-secondary logout-button"
              onClick={() => {
                logout();
                navigate('/');
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Roles;
