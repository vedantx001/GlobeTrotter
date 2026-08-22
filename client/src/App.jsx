import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'var(--color-obsidian)',
            color: 'var(--color-warm-white)',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-body-sm)'
          }
        }}
      />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
