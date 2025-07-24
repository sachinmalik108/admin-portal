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

  const fetchConfigs = async () => {
    try {
      const res = await axios.get('adminportal.up.railway.app/source-configs/');
      setConfigs(res.data);
    } catch (err) {
      console.error('Failed to fetch source configs', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('adminportal.up.railway.app/source-configs/', form);
      setForm({ tenant_id: 1, db_host: '', port: 5432, username: '', password: '' });
      fetchConfigs();
    } catch (err) {
      console.error('Failed to create source config', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Source Configurations</h2>

      
      {role === "admin" && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 400 }}>
          <input
            name="tenant_id"
            type="number"
            placeholder="Tenant ID"
            value={form.tenant_id}
            onChange={handleChange}
            required
          />
          <input
            name="db_host"
            placeholder="DB Host"
            value={form.db_host}
            onChange={handleChange}
            required
          />
          <input
            name="port"
            type="number"
            placeholder="Port"
            value={form.port}
            onChange={handleChange}
            required
          />
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Create Source Config</button>
        </form>
      )}


      <table border={1} cellPadding={8} style={{ marginTop: '1rem' }}>
        <thead>
          <tr>
            
            
            <th>DB Host</th>
            <th>Port</th>
            <th>Username</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {configs.map(cfg => (
            <tr key={cfg.id}>
              
              <td>{cfg.db_host}</td>
              <td>{cfg.port}</td>
              <td>{cfg.username}</td>
              <td>{'•'.repeat(cfg.password.length)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SourceConfigPage;
