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
// import { getDeviceStatus } from './services/deviceApi';


function App() {
  const [selectedNpc, setSelectedNpc] = useState(null);
  const [deviceStatus, setDeviceStatus] = useState(null); // 응답 저장용

  // 1) npc-click 이벤트로 상태 업데이트
  useEffect(() => {
    const handler = (e) => {
      setSelectedNpc(e.detail);
    };
    window.addEventListener('npc-click', handler);
    return () => window.removeEventListener('npc-click', handler);
  }, []);

  // selectedNpc 변경 시 fetch → deviceStatus 업데이트
  useEffect(() => {
    if (!selectedNpc) return;

    const deviceIp = '172.16.24.219';    // 예: '192.168.0.42'
    const port     = 8080;  // 예: 8080
    const url      = `http://${deviceIp}:${port}/chat/npc/1`;

    // async/await 버전
    (async () => {
      try {
        const res = await fetch(url,
          {
            method : "POST",          //메소드 지정
            headers : {               //데이터 타입 지정
                "Content-Type":"application/json; charset=utf-8"
            },
            body: JSON.stringify(data)   //실제 데이터 파싱하여 body에 저장
          });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log('장치 응답 데이터:', data);
        setDeviceStatus(data);
      } catch (err) {
        console.error('장치 통신 에러:', err);
        setDeviceStatus({ error: err.message });
      }
    })();
  }, [selectedNpc]);

  return (
    <div className="app">
      <div className="main-content">
        <GameLayout selectedNpc={selectedNpc}/>
      </div>
    </div>
  );
}

export default App;
