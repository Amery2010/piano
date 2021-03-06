import PIANO_KEYS from './constants';

class Audio {
  constructor () {
    // 创建音频上下文  
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  listen () {
    const pianoKeys = [...document.querySelectorAll('.piano-key')];
    const play = ev => {
      if (this.findTarget(pianoKeys, ev.target)) {
        this.pianoKeyDown(ev.target);
      }
    };
    const stop = ev => {
      if (this.findTarget(pianoKeys, ev.target)) {
        this.pianoKeyUp(ev.target);
      }
    };
    const EVENT_DOWN = /Mobile/i.test(navigator.userAgent) ? 'touchstart' : 'mousedown';
    const EVENT_UP = /Mobile/i.test(navigator.userAgent) ? 'touchend' : 'mouseup';

    document.addEventListener(EVENT_DOWN, play, false);
    document.addEventListener(EVENT_UP, stop, false);
    document.addEventListener(EVENT_UP, () => {
      [...document.querySelectorAll('.active')].forEach(item => {
        item.classList.remove('active');
      });
    }, false);
  }
  findTarget (group, target) {
    return group.indexOf(target) !== -1;
  }
  findKeyMeta (pos) {
    for (let idx = 0; idx < PIANO_KEYS.length; idx++) {
      if (PIANO_KEYS[idx].pos === pos) {
        return PIANO_KEYS[idx];
      }
    }
  }
  pianoKeyDown (target) {
    const pos = parseInt(target.dataset['pos']);
    const meta = this.findKeyMeta(pos);
    target.classList.add('active');
    return meta ? this.playVoice(meta.hz) : null;
  }
  pianoKeyUp (target) {
    target.classList.remove('active');
  }
  playVoice (hz) {
    // 创建音调控制对象  
    const oscillator = this.audioCtx.createOscillator();
    // 创建音量控制对象  
    const gainNode = this.audioCtx.createGain();
    // 音调音量关联  
    oscillator.connect(gainNode);
    // 音量和设备关联  
    gainNode.connect(this.audioCtx.destination);
    // 音调类型指定为正弦波  
    oscillator.type = 'sine';
    // 设置音调频率  
    oscillator.frequency.value = hz;
    // 先把当前音量设为0  
    gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
    // 0.01秒时间内音量从刚刚的0变成1，线性变化 
    gainNode.gain.linearRampToValueAtTime(1, this.audioCtx.currentTime + 0.02);
    // 声音走起 
    oscillator.start(this.audioCtx.currentTime);
    // 1秒时间内音量从刚刚的1变成0.001，指数变化 
    gainNode.gain.exponentialRampToValueAtTime(0.002, this.audioCtx.currentTime + 1.2);
    // 1秒后停止声音 
    oscillator.stop(this.audioCtx.currentTime + 1.2);
  }
}

export default Audio;
