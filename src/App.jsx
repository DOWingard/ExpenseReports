import React, { useEffect, useState } from 'react';
import useStore from './store';
import Setup from './components/Setup';
import Dashboard from './components/Dashboard';
import { checkAndAutoGenerateReport } from './utils/autoReport';
import { seedDatabase } from './testing/seedData';
import { Beaker } from 'lucide-react';

function App() {
  const { settings, isLoading, init, expenses, reports, addReport } = useStore();
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
    await seedDatabase();
    window.location.reload(); // Refresh to see new data
  };

  if (isLoading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '20vh' }}>
      <div className="card">Loading Finance Dashboard...</div>
    </div>;
  }

  return (
    <div className="App">
      {!settings ? (
        <Setup />
      ) : (
        <>
          <Dashboard />
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
                onClick={handleSeed}
                style={{ width: '100%', fontSize: '0.8rem' }}
              >
                Seed Sample Data
              </button>
              <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '10px' }}>
                Note: Seeding will clear existing data.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
