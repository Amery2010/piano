import PIANO_KEYS from './constants';

const COLORS = {
  EBONY: 'ebony',
  IVORY: 'ivory',
};
const SHIFTS = {
  LEFT: 'LEFT',
  MIDDLE: 'MIDDLE',
  RIGHT: 'RIGHT',
};

class Piano {
  constructor ({ pianoEl, mode = 'pro' }) {
    this.pianoEl = pianoEl;
    this.mode = mode;
    this.keys = [...PIANO_KEYS];
  }
  getKeyDeets (keyPos) {
    const key = keyPos % 12;
    let shift;
    let color;

    if (key === 2 || key === 7) {
      shift = SHIFTS.RIGHT;
      color = COLORS.EBONY;
    } else if (key === 5 || key === 10) {
      shift = SHIFTS.LEFT;
      color = COLORS.EBONY;
    } else if (key === 0) {
      shift = SHIFTS.MIDDLE;
      color = COLORS.EBONY;
    } else {
      shift = null;
      color = COLORS.IVORY;
    }
    return {shift, color};
  }
  render () {
    // key dimensions from http://www.rwgiangiulio.com/construction/manual/
    let left = 0;
    const blackKeyGroup = document.createElement('div');
    const whiteKeyGroup = document.createElement('div');

    if (this.mode === 'normal') {
      this.keys = this.keys.splice(27, 36);
    }
    this.keys.forEach(key => {
      const keyRect = document.createElement('span');
      const keyDeets = this.getKeyDeets(key.pos);
      let x = left;
      let height = 250;
      let width = 44;

      if (keyDeets.color === COLORS.EBONY) {
        height -= 90;
        width = 22;

        if (keyDeets.shift === SHIFTS.LEFT) {
          x = left - 14;
        } else if (keyDeets.shift === SHIFTS.MIDDLE) {
          x = left - 10;
        } else if (keyDeets.shift === SHIFTS.RIGHT) {
          x = left - 6;
        } else {
          console.warn('SHIFT was not set');
        }
      } else {
        left += 44;
        /* const keyText = document.createElementNS(ns, 'text');
        keyText.textContent = key.pos;

        keyText.setAttribute('x', x + width / 2);
        keyText.setAttribute('y', 10);
        keyText.setAttribute('text-anchor', 'middle');
        whiteKeyGroup.appendChild(keyText);*/
      }

      keyRect.style.borderRadius = 4 + 'px';
      keyRect.style.left = x + 'px';
      keyRect.style.top = 28 + 'px';
      keyRect.style.width = width + 'px';
      keyRect.style.height = height + 'px';
      keyRect.setAttribute('data-pos', key.pos);
      keyRect.setAttribute('piano-key', true);
      keyRect.classList.add('piano-key');
      keyRect.classList.add(`piano-key--${keyDeets.color}`);

      if (keyDeets.color === COLORS.EBONY) {
        blackKeyGroup.appendChild(keyRect);
      } else {
        whiteKeyGroup.appendChild(keyRect);
      }
    });

    this.pianoEl.appendChild(whiteKeyGroup);
    this.pianoEl.appendChild(blackKeyGroup);
  }
}

export default Piano;
