import Dashboard from './components/Dashboard/Dashboard';
import EventList from './components/Events/EventList';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Customer Integration Simulator
          </h1>
          <p className="text-sm text-gray-500">Real-time webhook processing dashboard</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6">
        <Dashboard />
        <EventList />
      </main>
    </div>
  );
}

export default App;
