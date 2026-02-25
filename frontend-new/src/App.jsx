import Dashboard from './components/Dashboard/Dashboard';
import EventList from './components/Events/EventList';
import SimulatorControls from './components/Simulator/SimulatorControls';

function App() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <h1 className='text-2xl font-bold text-gray-900'>Customer Integration Simulator</h1>
          <p className='mt-1 text-sm text-gray-500'>Webhook integration testing and debugging platform</p>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='space-y-8'>
          <Dashboard />
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-1'>
              <SimulatorControls />
            </div>
            <div className='lg:col-span-2'>
              <EventList />
            </div>
          </div>
        </div>
      </main>

      <footer className='bg-white border-t mt-12 py-6'>
        <p className='text-center text-sm text-gray-500'>Customer Integration Simulator © 2026</p>
      </footer>
    </div>
  );
}

export default App;
