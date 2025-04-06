import { ErrorBoundary } from 'react-error-boundary';
import './App.css';
import Map from './feature/map/Map';
// import AutoPollingComponent from './feature/map/PollTest';

function App() {

  return (
    <div className='app-wrapper'>
        <Map />

    </div>
  );
}

export default App;
