import { ErrorBoundary } from 'react-error-boundary';
import Experience from './components/canvas/Experience';
import Overlay from './components/layout/Overlay';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Something went wrong</h1>
        <p className="text-sm text-gray-400">{error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-6 py-2 bg-cyan-500 rounded"
        >
          Reload
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="relative w-full h-screen bg-black">
        <Overlay />
        <div className="absolute inset-0 z-0">
          <Experience />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;