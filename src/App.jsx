// src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './router';

// Global styles
import './styles/reset.css';
import './styles/variables.css';
import './styles/common.css';
import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
