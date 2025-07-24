import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SourceConfig {
  id: number;
  tenant_id: number;
  db_host: string;
  port: number;
  username: string;
  password: string;
}

const SourceConfigPage: React.FC = () => {
  const [form, setForm] = useState({
    tenant_id: '',
    db_host: '',
    port: '',
    username: '',
    password: '',
  });
  const [configs, setConfigs] = useState<SourceConfig[]>([]);

  const fetchConfigs = async () => {
    const res = await axios.get('http://localhost:8000/source-configs/');
    setConfigs(res.data);
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('http://localhost:8000/source-configs/', {
      ...form,
      port: parseInt(form.port),
      tenant_id: parseInt(form.tenant_id),
    });
    setForm({
      tenant_id: '',
      db_host: '',
      port: '',
      username: '',
      password: '',
    });
    fetchConfigs();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Source Configuration</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input name="tenant_id" placeholder="Tenant ID" value={form.tenant_id} onChange={handleChange} required />
        <input name="db_host" placeholder="DB Host" value={form.db_host} onChange={handleChange} required />
        <input name="port" placeholder="Port" value={form.port} onChange={handleChange} required />
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} required />
        <button type="submit">Save</button>
      </form>

      <h3>All Configs</h3>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Tenant ID</th>
            <th>Host</th>
            <th>Port</th>
            <th>Username</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {configs.map(cfg => (
            <tr key={cfg.id}>
              <td>{cfg.tenant_id}</td>
              <td>{cfg.db_host}</td>
              <td>{cfg.port}</td>
              <td>{cfg.username}</td>
              <td>••••••••</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SourceConfigPage;
