// Catch the Moose - simple clicker game
const startBtn = document.getElementById('startBtn');
const scoreEl = document.getElementById('score');
const timeEl  = document.getElementById('time');
const arena   = document.getElementById('arena');
const message = document.getElementById('message');
const durationSelect = document.getElementById('duration');
const sizeSelect = document.getElementById('size');

let score = 0;
let timeLeft = Number(durationSelect.value);
let timerInterval = null;
let mooseInterval = null;
let gameRunning = false;

const MOOSE_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <g fill="none" stroke="#2b2b2b" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
    <path d="M14 30c0-6 6-10 10-10s10 4 10 10-6 16-10 16-10-10-10-16z" fill="#b46a44"/>
    <circle cx="30" cy="28" r="2" fill="#000"/>
    <path d="M10 18c2-3 6-6 8-4s2 4 1 6" stroke="#6b3a2a" />
    <path d="M54 18c-2-3-6-6-8-4s-2 4-1 6" stroke="#6b3a2a" />
    <path d="M22 12c3-4 7-4 10-3" stroke="#6b3a2a" />
  </g>
</svg>`);

// Helpers
function rand(min, max){ return Math.random() * (max-min) + min; }

function spawnMoose(){
  // create moose element
  const moose = document.createElement('div');
  moose.className = 'moose';
  const size = Number(sizeSelect.value);
  moose.style.width = size + 'px';
  moose.style.height = size + 'px';

  // random pos inside arena
  const rect = arena.getBoundingClientRect();
  const maxX = Math.max(0, rect.width - size);
  const maxY = Math.max(0, rect.height - size);

  const x = Math.floor(rand(0, maxX));
  const y = Math.floor(rand(0, maxY));
  moose.style.left = x + 'px';
  moose.style.top  = y + 'px';

  // image
  const img = document.createElement('img');
  img.src = MOOSE_IMG;
  img.alt = 'moose';
  moose.appendChild(img);

  // click behavior
  const popSound = new Audio(); // optional: you can set src to a small sound if you like
  moose.addEventListener('click', (e) => {
    if (!gameRunning) return;
    score += 1;
    scoreEl.textContent = score;
    moose.style.transform = 'scale(0.6)';
    setTimeout(()=>{ moose.remove(); }, 80);
  });

  // small wobble
  moose.style.transform = `rotate(${rand(-10,10)}deg)`;

  arena.appendChild(moose);

  // remove after some time if not clicked
  setTimeout(()=> { if (moose.parentNode) moose.remove(); }, 1200 + Math.random()*900);
}

function startGame(){
  if (gameRunning) return;
  score = 0;
  scoreEl.textContent = score;
  timeLeft = Number(durationSelect.value);
  timeEl.textContent = timeLeft;
  gameRunning = true;
  message.classList.add('hidden');

  // spawn moose every 700ms (adjust speed by modifying)
  mooseInterval = setInterval(spawnMoose, 650);

  // immediate first spawn
  spawnMoose();

  // timer
  timerInterval = setInterval(()=>{
    timeLeft -= 1;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0){
      endGame();
    }
  }, 1000);
}

function endGame(){
  gameRunning = false;
  clearInterval(timerInterval);
  clearInterval(mooseInterval);
  timerInterval = mooseInterval = null;

  // remove leftover moose
  const leftovers = Array.from(arena.querySelectorAll('.moose'));
  leftovers.forEach(n => n.remove());

  message.textContent = `Time's up! Your score: ${score}`;
  message.classList.remove('hidden');
}

// events
startBtn.addEventListener('click', startGame);

// allow keyboard: space to spawn a moose (for testing)
document.addEventListener('keydown', e=>{
  if(e.code === 'Space') spawnMoose();
});
