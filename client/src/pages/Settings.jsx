import { useState } from 'react';

const Settings = () => {
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Your Company Name',
    email: 'hr@company.com',
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Company Information</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Company Name</label>
            <input
              type="text"
              value={companyInfo.name}
              onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="label">Company Email</label>
            <input
              type="email"
              value={companyInfo.email}
              onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
              className="input"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Email Configuration</h2>
        <p className="text-gray-600 mb-4">
          Email settings are configured through environment variables. Check your .env file.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-mono text-gray-700">SMTP_HOST=smtp.gmail.com</p>
          <p className="text-sm font-mono text-gray-700">SMTP_PORT=587</p>
          <p className="text-sm font-mono text-gray-700">SMTP_USER=your_email@gmail.com</p>
          <p className="text-sm font-mono text-gray-700">SMTP_PASSWORD=your_app_password</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">API Documentation</h2>
        <p className="text-gray-600 mb-4">
          Access the API documentation to integrate with external systems.
        </p>
        <a href="/api" className="btn btn-secondary">
          View API Docs
        </a>
      </div>
    </div>
  );
};

export default Settings;
