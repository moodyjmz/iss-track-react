import { JSX } from 'react';
import './App.css';
import Map from './feature/map/Map';

function App(): JSX.Element {
  return (
    <div className="app-wrapper">
      <Map />
    </div>
  );
}

export default App;