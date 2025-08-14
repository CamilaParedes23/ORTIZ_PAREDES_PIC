import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { AuthContext } from '../../context/AuthContext';
import './Panel.css';

interface LocationState {
  roleName: string;
  roleDescription: string;
}

const Panel: React.FC = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBackToRoles = () => {
    navigate('/roles');
  };

  return (
    <div className="panel-container">
      <div className="panel-content">
        <Card className="panel-card">
          {/* Header */}
          <div className="panel-header">
            <div className="welcome-section">
              <i className="pi pi-crown panel-icon"></i>
              <h1>¡Bienvenido al Panel de {state?.roleName || 'Usuario'}!</h1>
              <p className="user-info">
                Hola, <strong>{user?.nombres} {user?.apellidos}</strong>
              </p>
              {state?.roleDescription && (
                <p className="role-description">{state.roleDescription}</p>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="panel-body">
            <div className="dashboard-grid">
              {/* Info Cards */}
              <Card className="info-card">
                <div className="info-card-content">
                  <i className="pi pi-user info-icon"></i>
                  <div>
                    <h3>Perfil</h3>
                    <p>Gestiona tu información personal</p>
                  </div>
                </div>
              </Card>

              <Card className="info-card">
                <div className="info-card-content">
                  <i className="pi pi-cog info-icon"></i>
                  <div>
                    <h3>Configuración</h3>
                    <p>Ajusta las preferencias del sistema</p>
                  </div>
                </div>
              </Card>

              <Card className="info-card">
                <div className="info-card-content">
                  <i className="pi pi-chart-line info-icon"></i>
                  <div>
                    <h3>Estadísticas</h3>
                    <p>Visualiza métricas y reportes</p>
                  </div>
                </div>
              </Card>

              <Card className="info-card">
                <div className="info-card-content">
                  <i className="pi pi-shield info-icon"></i>
                  <div>
                    <h3>Seguridad</h3>
                    <p>Controla la seguridad de tu cuenta</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Role specific message */}
            <div className="role-message">
              <i className="pi pi-info-circle"></i>
              <p>
                Estás accediendo con el rol de <strong>{state?.roleName}</strong>. 
                Desde aquí puedes gestionar todas las funciones disponibles para tu nivel de acceso.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="panel-footer">
            <Button
              label="Cambiar Rol"
              icon="pi pi-refresh"
              className="p-button-outlined change-role-button"
              onClick={handleBackToRoles}
            />
            <Button
              label="Cerrar Sesión"
              icon="pi pi-sign-out"
              className="p-button-outlined p-button-danger logout-button"
              onClick={handleLogout}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Panel;
