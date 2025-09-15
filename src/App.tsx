import { JSX } from 'react';
import './App.css';
import Map from './features/iss-tracker/Map';
import { WindowStateProvider } from './context/WindowState';

function App(): JSX.Element {
  return (
    <WindowStateProvider>

    <div className="app-wrapper">
      <Map />
    </div>
    </WindowStateProvider>
  );
}

export default App;