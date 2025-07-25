import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import {store} from './Store/Store.tsx'


createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
  <BrowserRouter>
    <App />
    </BrowserRouter>
</Provider>
)
