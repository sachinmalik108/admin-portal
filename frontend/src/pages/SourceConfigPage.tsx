import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface SourceConfig {
  id: number;
  tenant_id: number;
  db_host: string;
  port: number;
  username: string;
  password: string;
}

const SourceConfigPage: React.FC<{ role: "admin" | "viewer" }> = ({ role }) => {
  const [configs, setConfigs] = useState<SourceConfig[]>([]);
  const [form, setForm] = useState<Omit<SourceConfig, 'id'>>({
    tenant_id: 1,
    db_host: '',
    port: 5432,
    username: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const fetchConfigs = async () => {
    try {
      const res = await axios.get('https://adminportal.up.railway.app/source-configs/');
      setConfigs(res.data);
    } catch (err) {
      console.error('Failed to fetch source configs', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setShowMessage(true);
    try {
      await axios.post('https://adminportal.up.railway.app/source-configs/', form);
      setForm({ tenant_id: 1, db_host: '', port: 5432, username: '', password: '' });
      setMessage('Source config created successfully!');
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      fetchConfigs();
    } catch (err) {
      setMessage('Failed to create source config.');
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  return (
    <div
      className="container-fluid min-vh-100 d-flex flex-column align-items-center justify-content-center"
      data-bs-theme="dark"
      style={{
        padding: 0,
        background: 'linear-gradient(135deg, #232526 0%, #414345 40%, #6a82fb 70%, #00c6fb 100%)',
      }}
    >
      <div className="container py-5">
        <h2 className="mb-4 display-5 fw-bold text-primary" style={{ fontFamily: 'Poppins, Montserrat, Segoe UI, Arial, sans-serif', letterSpacing: '1px', textShadow: '0 2px 8px rgba(0,198,251,0.2)' }}>
          Source Configurations
        </h2>
        {role === "admin" && (
          <form onSubmit={handleSubmit} className="mb-5" style={{ maxWidth: 400 }}>
            <div className="mb-3">
              <input
                name="tenant_id"
                type="number"
                placeholder="Tenant ID"
                value={form.tenant_id}
                onChange={handleChange}
                required
                className="form-control form-control-lg"
              />
            </div>
            <div className="mb-3">
              <input
                name="db_host"
                placeholder="DB Host"
                value={form.db_host}
                onChange={handleChange}
                required
                className="form-control form-control-lg"
              />
            </div>
            <div className="mb-3">
              <input
                name="port"
                type="number"
                placeholder="Port"
                value={form.port}
                onChange={handleChange}
                required
                className="form-control form-control-lg"
              />
            </div>
            <div className="mb-3">
              <input
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
                className="form-control form-control-lg"
              />
            </div>
            <div className="mb-3">
              <input
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="form-control form-control-lg"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-100">Create Source Config</button>
          </form>
        )}
        {showMessage && message && (
          <p className={"fw-bold " + (message.includes('successfully') ? 'text-success' : 'text-danger')}>
            {message}
          </p>
        )}
        <div className="card shadow-lg rounded-4 p-4 mb-5" style={{ background: 'rgba(30, 34, 90, 0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="table-responsive">
            <table className="table table-dark table-striped table-bordered table-hover align-middle mb-0 rounded-3 overflow-hidden">
              <thead className="table-primary text-dark">
                <tr>
                  <th>DB Host</th>
                  <th>Port</th>
                  <th>Username</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                {configs.map(cfg => (
                  <tr key={cfg.id} className="source-row">
                    <td>{cfg.db_host}</td>
                    <td>{cfg.port}</td>
                    <td>{cfg.username}</td>
                    <td>{'•'.repeat(cfg.password.length)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourceConfigPage;
