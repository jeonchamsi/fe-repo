// src/GameEngine.jsx
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

export default function GameEngine() {
  const gameRef = useRef(null);

  useEffect(() => {
    class MainScene extends Phaser.Scene {
      constructor() {
        super({ key: 'MainScene' });
        this.cursors = null;
        this.player = null;
        this.npcSprites = {};
      }

      preload() {
        this.load.image('background', 'assets/map04.png');
        this.load.image('player',     'assets/npc03_front_upscaled_4x.png');
        this.load.image('npc1',       'assets/npc01_right_8x.png');
        this.load.image('npc2',       'assets/npc02_left_8x.png');
        this.load.image('npc3',       'assets/npc03_back.png');
      }

      create() {
        const worldWidth = 1920;
        const worldHeight = 1152;
        this.add.image(0, 0, 'background')
          .setOrigin(0, 0)
          .setDisplaySize(worldWidth, worldHeight);

        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
        this.player = this.physics.add
          .sprite(worldWidth/2, worldHeight/2, 'player')
          .setCollideWorldBounds(true);

        this.bubbles = this.add.group();

        const npcData = [
          { key:'npc1', x:1000, y:800,  name:'성재', age:14, info:'구름중학교 1학년 3반', characters:['#책임감','#완벽주의','#리더','#단호함'], happiness:2 },
          { key:'npc2', x:1200, y:800,  name:'현민', age:14, info:'구름중학교 1학년 3반', characters:['#장난끼','#속은 숨김','#방어적','#눈치없음'], happiness:5 },
          { key:'npc3', x:1100, y:900,  name:'소은', age:14, info:'구름중학교 1학년 3반', characters:['#조용함','#눈치빠름','#관찰자','#무심'], happiness:2 },
        ];

        npcData.forEach(data => {
          const npc = this.add.sprite(data.x, data.y, data.key)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => npc.setTint(0xaaaaaa))
            .on('pointerout',  () => npc.clearTint())
            .on('pointerdown', () => {
              window.dispatchEvent(new CustomEvent('npc-click', { detail: data }));
            });
          this.npcSprites[data.name] = npc;
        });

        this.input.on('pointerdown', (pointer, gameObjects) => {
          if (gameObjects.length === 0) {
            window.dispatchEvent(new CustomEvent('npc-click', { detail: null }));
          }
        });

        this.cameras.main
          .setBounds(0, 0, worldWidth, worldHeight)
          .startFollow(this.player, true, 0.1, 0.1);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
          up:    Phaser.Input.Keyboard.KeyCodes.W,
          down:  Phaser.Input.Keyboard.KeyCodes.S,
          left:  Phaser.Input.Keyboard.KeyCodes.A,
          right: Phaser.Input.Keyboard.KeyCodes.D
        });
      }

      update() {
        const speed = 400;
        this.player.body.setVelocity(0);
        if (this.keys.left.isDown || this.cursors.left.isDown) this.player.body.setVelocityX(-speed);
        else if (this.keys.right.isDown || this.cursors.right.isDown) this.player.body.setVelocityX(speed);
        if (this.keys.up.isDown   || this.cursors.up.isDown)   this.player.body.setVelocityY(-speed);
        else if (this.keys.down.isDown|| this.cursors.down.isDown) this.player.body.setVelocityY(speed);
      }

      showBubble(message, targetName) {
        if (!message) return;
        const x = (targetName && this.npcSprites[targetName]) ? this.npcSprites[targetName].x : this.player.x;
        const y = (targetName && this.npcSprites[targetName]) ? this.npcSprites[targetName].y - 50 : this.player.y - 50;
        const bubble = this.add.text(x, y, message, {
          fontSize: '16px', color: '#000', backgroundColor: '#fff', padding: { x:8, y:4 }, wordWrap: { width: 200 }
        }).setOrigin(0.5);
        this.bubbles.add(bubble);
        this.time.delayedCall(3000, () => bubble.destroy());
      }
    }

    const config = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      scale: { mode: Phaser.Scale.RESIZE },
      physics: { default: 'arcade', arcade: { debug: false } },
      scene: [MainScene],
    };

    const game = new Phaser.Game(config);
    // 채팅 메시지 이벤트 수신
    window.addEventListener('chat-message', (e) => {
      const scene = game.scene.keys['MainScene'];
      scene.showBubble(e.detail.text, e.detail.targetName);
    });

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={gameRef} style={{ width:'100%', height:'100%', overflow:'hidden' }} />;
}
