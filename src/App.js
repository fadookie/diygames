import React, {
  useState,
} from 'react';
import logo from './logo.svg';
import './App.css';
import { GameProvider } from './state/GameContext';
import Editor from './components/Editor';
import GamePlayer from './components/GamePlayer';

const App = () => {
  const [activeComponent, setActiveComponent] = useState('Editor');
  return (
    <GameProvider>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <button onClick={() => setActiveComponent('Editor')}>Editor</button>
        <button onClick={() => setActiveComponent('Player')}>Player</button>
        <hr/>
        <div className="body">
          {(() => {
            switch (activeComponent) {
              case 'Editor':
                return <Editor />;
              case 'Player':
                return <GamePlayer playing={true} />;
              default:
                return `Unknown component ${activeComponent}`;
            }
          })()}
        </div>
      </div>
    </GameProvider>
  );
};

export default App;
