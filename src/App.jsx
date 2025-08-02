/*
React Collaboration Simulation UI
설치: npx create-react-app jeonchamsi && cd jeonchamsi
       npm install
       npm start
*/

// src/App.jsx
import React, { useEffect, useState } from 'react';
import './App.css';
import GameLayout from './GameLayout';



function App() {
  const [selectedNpc, setSelectedNpc] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      setSelectedNpc(e.detail);
    };
    window.addEventListener('npc-click', handler);
    return () => window.removeEventListener('npc-click', handler);
  }, []);

  return (
    <div className="app">
      <div className="main-content">
        <GameLayout selectedNpc={selectedNpc}/>
      </div>
    </div>
  );
}

export default App;
