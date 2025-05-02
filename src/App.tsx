import { JSX } from 'react';
import './App.css';
import Map from './feature/map/Map';
import { WindowStateProvider } from './feature/map/context/WindowState';

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