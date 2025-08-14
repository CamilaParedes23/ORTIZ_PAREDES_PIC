import React, { useState, useContext } from 'react';
import type { RefObject } from 'react';         // tipo-only import
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { AuthContext } from '../../context/AuthContext';
import './Login.css';

interface Props {
  // RefObject que puede contener Toast o null
  toast: RefObject<Toast | null>;
}

const Login: React.FC<Props> = ({ toast }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(username, password);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Login correcto',
        life: 2000
      });
      navigate('/roles');
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message,
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <Card className="login-card">
          <div className="login-header">
            <i className="pi pi-lock login-icon"></i>
            <h1>Bienvenido</h1>
            <p>Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="username">Correo Electrónico</label>
              <div className="input-wrapper">
                <i className="pi pi-envelope input-icon"></i>
                <InputText
                  id="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  disabled={loading}
                  className="custom-input"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <div className="input-wrapper">
                <i className="pi pi-lock input-icon"></i>
                <InputText
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="custom-input"
                />
              </div>
            </div>

            <Button
              type="submit"
              label={loading ? "Iniciando..." : "Iniciar Sesión"}
              icon={loading ? "pi pi-spinner pi-spin" : "pi pi-sign-in"}
              className="login-button"
              disabled={loading}
              loading={loading}
            />
          </form>

          <div className="login-footer">
            <p>Sistema de Gestión Integral</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
