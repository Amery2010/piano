import Piano from './app/Piano';
import Audio from './app/Audio';

const piano = new Piano({
  mode: 'normal',
  pianoEl: document.getElementById('piano')
});
piano.render();

const audio = new Audio();
audio.listen();
