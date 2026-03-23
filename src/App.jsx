import React, { useEffect, useState } from 'react';
import useStore from './store';
import Setup from './components/Setup';
import Dashboard from './components/Dashboard';
import OrgManager from './components/OrgManager';
import { checkAndAutoGenerateReport } from './utils/autoReport';
import { Beaker } from 'lucide-react';

function App() {
  const {
    settings,
    organizations,
    isLoading,
    init,
    expenses,
    reports,
    addReport,
    activeOrgId,
    setActiveOrg
  } = useStore();

  const [showSetup, setShowSetup] = useState(false);
  const [testMode, setTestMode] = useState(false);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (settings && expenses.length > 0 && !isLoading) {
      checkAndAutoGenerateReport(settings, expenses, reports, addReport);
    }
  }, [settings, expenses, reports, isLoading, addReport]);

  const handleSeed = async () => {
    const { seedDatabase } = await import('./testing/seedData');
    await seedDatabase(activeOrgId);
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '20vh' }}>
        <div className="card">Loading Organizations...</div>
      </div>
    );
  }

  // If we are showing the setup form for a new organization
  if (showSetup) {
    return <Setup onCancel={() => setShowSetup(false)} />;
  }

  // If no organization is selected, show the Manager
  if (!activeOrgId) {
    return <OrgManager onAddNew={() => setShowSetup(true)} />;
  }

  // Dashboard for the active organization
  return (
    <div className="App">
      <Dashboard onBackToOrgs={() => setActiveOrg(null)} />

      <button
        onClick={() => setTestMode(!testMode)}
        style={{
          position: 'fixed', bottom: '20px', right: '20px',
          padding: '10px', borderRadius: '50%', background: 'white',
          border: '1px solid #ddd', cursor: 'pointer', opacity: 0.6
        }}
        title="Test Utils"
      >
        <Beaker size={20} color="var(--primary)" />
      </button>

      {testMode && (
        <div style={{
          position: 'fixed', bottom: '70px', right: '20px',
          background: 'white', padding: '1rem', borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #ddd',
          zIndex: 2000
        }}>
          <h4 style={{ marginBottom: '10px', color: 'var(--primary)' }}>Testing Utility</h4>
          <button
            className="btn btn-secondary"
            onClick={async () => {
              // Dynamically import seedDatabase to ensure it's only loaded in test mode
              const { seedDatabase } = await import('./testing/seedData');
              await seedDatabase(activeOrgId); // Pass activeOrgId
              window.location.reload();
            }}
            style={{ width: '100%', fontSize: '0.8rem' }}
          >
            Seed Sample Data
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
