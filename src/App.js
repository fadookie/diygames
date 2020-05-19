import React, {
  useState,
} from 'react';
import logo from './logo.svg';
import './App.css';
import Gui from './components/Gui';

const App = () => {
  const [activeComponent, setActiveComponent] = useState('GuiTest');
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={() => setActiveComponent('GuiTest')}>GUI Test</button>
        {(() => {
          switch (activeComponent) {
            case 'GuiTest':
              return <Gui />;
            default:
              return `Unknown component ${activeComponent}`;
          }
        })()}
      </header>
    </div>
  );
};

export default App;
