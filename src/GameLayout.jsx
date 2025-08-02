// src/GameLayout.jsx
import React, { useState } from 'react';
import './GameLayout.css';
import GameEngine from './GameEngine';

export default function GameLayout({ selectedNpc, onNpcClick }) {
  const [chatText, setChatText] = useState('');

  const handleSend = () => {
    const message = chatText.trim();
    if (!message) return;  // 빈 문자열은 무시

    // 말풍선 띄우기용 이벤트 발송
    window.dispatchEvent(new CustomEvent('chat-message', {
        detail: {
        text: message,
        targetName: selectedNpc?.name
        }
    }));
    
    setChatText('');      // 입력창 비우기
    };


  
  return (
    <div className="game-container">
      <div className="map-area">
        {/* Canvas, img, 또는 게임 엔진(Phaser.js, PixiJS 등)을 여기에 넣으세요 */}
        <GameEngine onNpcClick={onNpcClick} />
      </div>

      <aside className="status-panel">
        <div className='info-section'>
            <h2>캐릭터 정보</h2>
            {selectedNpc ? (
            <>
                <p><strong>{selectedNpc.name}({selectedNpc.age})</strong></p>
                <p>{selectedNpc.info}</p>
                <p>
                    {selectedNpc.characters}
                </p>
                <p><strong>지금 기분은?</strong>(0~5) <strong>{selectedNpc.happiness}</strong></p>

                <footer className="chat-footer">
                    <textarea
                        className="chat-input"
                        value={chatText}
                        onChange={e => setChatText(e.target.value.slice(0, 100))}
                        maxLength={100}
                        placeholder="메시지를 입력하세요..."
                    />
                    {/* <button className="send-btn" onClick={handleSend}>전송</button> */}
                </footer>
                {selectedNpc.name != '성재' ?
                    <button onClick={handleSend}>성재에게</button> : <></>}
                {selectedNpc.name != '현민' ?
                    <button onClick={handleSend}>현민에게</button> : <></>}
                {selectedNpc.name != '소은' ?
                    <button onClick={handleSend}>소은에게</button> : <></>}
                <button onClick={handleSend}>모두에게</button>
            </>
            ) : (
            <p>NPC를 클릭하세요</p>
            )}
        </div>

        
      </aside>
    </div>
  );
}
