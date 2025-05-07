let currentPage = 1;
const ITEMS_PER_PAGE = 24;

// ---- SOUNDS ----
const clearSound = new Audio('clear.ogg');
const matchSound = new Audio('match.ogg');
const azSound = new Audio('az.ogg');
const termSound = new Audio('term.ogg');
const pageSound = new Audio('page.ogg');
const wilhelmSound = new Audio('wilhelm.ogg');

document.body.addEventListener('click', () => {
  matchSound.play().then(() => matchSound.pause()).catch(() => {});
}, { once: true });


// Detects if the device is on iOS 
const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

// Detects if device is in standalone mode
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

// Show the banner if needed
const hasSeenInstallPopup = localStorage.getItem("hasSeenInstallPopup");
if (!hasSeenInstallPopup && isIos() && !isInStandaloneMode()) {
  document.getElementById('ios-install-banner').classList.remove('hidden');
  localStorage.setItem("hasSeenInstallPopup", true);
}

// Close handler
document.getElementById('close-ios-banner').addEventListener('click', () => {
  document.getElementById('ios-install-banner').classList.add('hidden');
});

// ---- INITIAL DATA & RECIPES ----
const initialElements = ['person','money','idea'];
let showTerminals = true;
let sortAsc = true;

const elementIcons = {
  person: "👤",
  money: "💰",
  idea: "💡",
  actor: "🎭",
  cast: "🎞️",
  writer: "✍️",
  script: "📜",
  director: "🎬",
  producer: "💼",
  audition: "🎙️",
  conflict: "💢",
  chemistry: "⚗️",
  footage: "📹",
  blooper: "😅",
  comedy: "😂",
  slapstick: "🤪",
  scene: "🎦",
  drama: "🎭",
  action: "💥",
  stuntman: "🧗",
  performance: "🎤",
  movie: "🎥",
  "action movie": "🎬",
  fight: "🥊",
  violence: "🩸",
  horror: "👻",
  thriller: "🧠",
  marketing: "📢",
  trailer: "📽️",
  hype: "📈",
  celebrity: "🌟",
  cut: "✂️",
  release: "📅",
  blockbuster: "💣",
  sequel: "🔁",
  trilogy: "3️⃣",
  franchise: "🧩",
  "spin-off": "🌀",
  award: "🏆",
  Razzie: "🍅",
  Oscar: "🏅",
  "special effects": "✨",
  "found footage": "🔍",
  romcom: "💘",
  superhero: "🦸",
  Marvel: "🧬",
  "war movie": "⚔️",
  "slasher movie": "🔪",
  scream: "😱",
  "sci fi": "🛸",
  alien: "👽",
  parasite: "🦠",
  "chest burster": "💥",
  closet: "🚪",
  cornetto: "🍦",
  speech: "🗣️",
  ensemble: "👥",
  "Shaun of the dead": "🧟",
  "Bill and Ted": "🎸",
  "The Matrix": "🕶️",
  "Good Will Hunting": "📚",
  "Ben Affleck": "🧔",
  Batman: "🦇",
  "Chris Nolan": "🎞️",
  "Dark Knight Rises": "🌃",
  "Heath Ledger": "🃏",
  "Christian Bale": "🧍",
  "Robin Williams": "🎤",
  "Robert Downey Jr": "🧲",
  "Michael Caine": "🎩",
  "Peter Jackson": "🧙",
  Godfather: "🕴️",
  "Marlon Brando": "🍷",
  "Jackie Chan": "🥋",
  "bruce lee": "🐉",
  OUATIH: "🎞️",
  "Bad Taste": "🧠",
  "video nasty": "📼",
  "Blair Witch": "🌲",
  flop: "📉",
  "Park Chan-wook": "🎬",
  "the ring": "📺",
  Kurosawa: "📽️",
  "star wars": "🌌",
  Tarrantino: "🩸",
  "stephen King": "📖",
  Shawshank: "🔐",
  "inglorius bastards": "💣",
  "simon pegg": "😄",
  "mission impossible": "💼",
  "tom cruise": "✈️"
};




const recipes = {
  'person+money':'producer',
  'person+person':'actor',
  'idea+person':'writer',
  'writer+idea':'script',
  'actor+person':'cast',
  'writer+producer':'director',
  'producer+actor':'audition',
  'producer+director':'conflict',
  'actor+actor':'chemistry',
  'director+script':'footage',
  'footage+conflict':'blooper',
  'blooper+script':'comedy',
  'comedy+fight':'slapstick',
  'cast+script':'scene',
  'conflict+script':'drama',
  'scene+conflict':'action',
  'action+person':'stuntman',
  'stuntman+director':'Chad Stahelski',
  'actor+script':'performance',
  'footage+money':'movie',
  'movie+action':'action movie',
  'stuntman+conflict':'fight',
  'fight+fight':'violence',
  'violence+movie':'horror',
  'horror+drama':'thriller',
  'producer+money':'marketing',
  'marketing+footage':'trailer',
  'trailer+chemistry':'hype',
  'actor+hype':'celebrity',
  'director+movie':'cut',
  'cut+money':'release',
  'hype+release':'blockbuster',
  'blockbuster+cast':'sequel',
  'sequel+sequel':'trilogy',
  'trilogy+money':'franchise',
  'trilogy+director':'Peter Jackson',
  'franchise+actor':'spin-off',
  'Chad Stahelski+actor':'Keanu Reeves',
  'Keanu Reeves+trilogy':'The Matrix',
  'Keanu Reeves+comedy':'Bill and Ted',
  'performance+hype':'award',
  'award+flop':'Razzie',
  'award+money':'Oscar',
  'chemistry+money':'special effects',
  'Peter Jackson+horror':'Bad Taste',
  'Bad Taste+horror':'video nasty',
  'sequel+Oscar':'Godfather',
  'Godfather+actor':'Marlon Brando',
  'comedy+chemistry':'romcom',
  'horror+footage':'found footage',
  'found footage+hype':'Blair Witch',
  'Blair Witch+sequel':'flop',
  'cast+chemistry':'ensemble',
  'special effects+action':'superhero',
  'superhero+franchise':'Marvel',
  'Marvel+actor':'Robert Downey Jr',
  'comedy+actor':'Robin Williams',
  'money+Razzie':'bomb',
  'bomb+action movie':'war movie',
  'Robin Williams+drama':'Good Will Hunting',
  'Good Will Hunting+writer':'Ben Affleck',
  'Ben Affleck+superhero':'Batman',
  'Batman+director':'Chris Nolan',
  'Batman+sequel':'Dark Knight Rises',
  'Dark Knight Rises+Oscar':'Heath Ledger',
  'Chris Nolan+actor':'Michael Caine',
  'Batman+actor':'Christian Bale',
  'slapstick+actor':'Charlie Chaplin',
  'celebrity+award':'speech',
  'horror+romcom':'Shaun of the dead',
  'writer+director':'Tarrantino',
  'horror+writer':'stephen King',
  'stephen King+drama':'Shawshank',
  'tarantino+war movie':'inglorius bastards',
  'horror+cut':'slasher movie',
  'slasher movie+franchise':'scream',
  'shaun of the dead+actor':'simon pegg',
  'simon pegg+franchise':'mission impossible',
  'mission impossible+actor':'tom cruise',
  'stuntman+actor':'Jackie Chan',
  'jackie Chan+fight':'martial arts',
  'martial arts+celebrity':'bruce lee',
  'bruce lee+tarantino':'OUATIH',
  'martial arts+sctipy':'asian cinema',
  'asian cinema+oscar':'parasite',
  'asian cinema+director':'Kurosawa',
  'asian cinema+trilogy':'Park Chan-wook',
  'asian cinema+franchise':'the ring',
  'kurosawa+sfx':'star wars',
  'star wars+script':'sci fi',
  'sci fi+horror':'alien',
  'alien+parasite':'chest burster',
  'tom cruise+the ring':'closet',
  'Shaun of the dead+trillogy':'cornetto'
};

// ---- TERMINAL DETECTION ----
const inputs = new Set();
Object.keys(recipes).forEach(key => {
  key.split('+').forEach(part => inputs.add(part));
});
function isTerminalElement(name) {
  return !inputs.has(name);
}



// ---- STATE & REFS ----
let inventory = [...initialElements];
let discovered = new Set(initialElements);
const invEl = document.getElementById('inventory-items');
const workEl = document.getElementById('workspace');
const clearEl = document.getElementById('clear-btn');
const notifyParent = document.getElementById('notification-container');
const saveEl = document.getElementById('save-btn');
const loadEl = document.getElementById('load-btn');
const trashEl = document.getElementById('trash-btn');
const progressEl = document.getElementById('progress-tracker');
const totalUniqueElements = new Set(Object.values(recipes)).size;

// ---- HELPERS ----
function showNotification(txt) {
  const n = document.createElement('div');
  n.className = 'notification';
  n.textContent = txt;
  notifyParent.appendChild(n);
  n.addEventListener('animationend', ()=>n.remove());
}
function updateProgressTracker() {
  progressEl.textContent = `Discovered ${discovered.size} of ${totalUniqueElements}`;
}
function renderInventory() {
  invEl.innerHTML = '';

  let sorted = [...inventory];
  sorted = sorted.filter(name => showTerminals || !isTerminalElement(name));
  sorted.sort((a, b) => sortAsc ? a.localeCompare(b) : b.localeCompare(a));

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  if (currentPage > totalPages) currentPage = totalPages || 1;

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = sorted.slice(start, start + ITEMS_PER_PAGE);

  pageItems.forEach(name => {
    const d = document.createElement('div');
    d.className = 'element';
    const icon = elementIcons[name] || "?";
    d.innerHTML = `<div class="emoji">${icon}</div><div class="label">${name}</div>`;
    d.dataset.name = name;
    if (isTerminalElement(name)) d.classList.add('terminal');
    d.draggable = true;
    d.addEventListener('dragstart', () => {
      dragSourceName = name;
      dragSourceEl = null;
    });
    d.addEventListener('touchstart', onTouchStart, { passive: false });
    invEl.appendChild(d);
  });

  document.getElementById('page-indicator').textContent = `Page ${currentPage} of ${totalPages}`;
  updateProgressTracker();
}


function makeWorkspaceTile(name,x,y) {
  const d = document.createElement('div');
  d.className = 'element';
  const icon = elementIcons[name] || "?";
d.innerHTML = `<div class="emoji">${icon}</div><div class="label">${name}</div>`;
  d.dataset.name = name;
  if (isTerminalElement(name)) d.classList.add('terminal');
  d.style.left = x+'px';
  d.style.top  = y+'px';
  d.draggable = true;
  d.addEventListener('dragstart', e => {
    dragSourceName = name;
    dragSourceEl = d;
    e.dataTransfer.setData('text/plain','');
  });
  d.addEventListener('dragover', e => e.preventDefault());
  d.addEventListener('drop', e => {
    e.preventDefault();
    if (combine(d.dataset.name, dragSourceName)) matchSound.play();
  });
  d.addEventListener('touchstart', onTouchStart, {passive:false});
  workEl.appendChild(d);
  return d;
}
function combine(a,b) {
  const res = recipes[a+'+'+b]||recipes[b+'+'+a];
  if(res && !discovered.has(res)) {
    discovered.add(res);
    inventory.push(res);
    showNotification('Discovered: '+res);
    renderInventory();
    saveGame();
    return true;
  }
  return false;
}

// ---- DRAG & DROP ----
let dragSourceName = null, dragSourceEl = null;
workEl.addEventListener('dragover', e=>e.preventDefault());
workEl.addEventListener('drop', e=>{
  e.preventDefault();
  if(!dragSourceName) return;
  const r = workEl.getBoundingClientRect();
  const x = e.clientX - r.left, y = e.clientY - r.top;
  const el = document.elementFromPoint(e.clientX,e.clientY);
  if (el === trashEl || trashEl.contains(el)) {
    if (dragSourceEl && workEl.contains(dragSourceEl)) {
      dragSourceEl.remove();
      showNotification('Element Deleted');
    }
    dragSourceName = dragSourceEl = null;
    return;
  }
  const target = el?.closest('.element') && workEl.contains(el.closest('.element'))
                 ? el.closest('.element') : null;
  if(target) {
    if (combine(target.dataset.name, dragSourceName)) matchSound.play();
  } else if(dragSourceEl){
    dragSourceEl.style.left = x+'px';
    dragSourceEl.style.top  = y+'px';
  } else {
    //makeWorkspaceTile(dragSourceName,x,y);
  const tile = makeWorkspaceTile(dragSourceName, x, y);
  tile.style.left = x + 'px';
  tile.style.top = y + 'px';
  }
  dragSourceName = dragSourceEl = null;
});

// ---- TOUCH SUPPORT ----
const touchData = {};
function onTouchStart(e) {
  e.preventDefault();
  const el = e.currentTarget;
  const fromWorkspace = workEl.contains(el);
  touchData.name = el.dataset.name;
  touchData.sourceEl = fromWorkspace ? el : null;
  touchData.fromInventory = !fromWorkspace;

  touchData.ghost = el.cloneNode(true);
  touchData.ghost.classList.add('drag-ghost');
  document.body.appendChild(touchData.ghost);

  const t = e.changedTouches[0];
  const r = el.getBoundingClientRect();
  touchData.offsetX = t.clientX - r.left;
  touchData.offsetY = t.clientY - r.top;
  moveGhost(t);

  document.addEventListener('touchmove', onTouchMove, { passive: false });
  document.addEventListener('touchend', onTouchEnd);
}
function onTouchMove(e) {
  e.preventDefault();
  moveGhost(e.changedTouches[0]);
}
function moveGhost(t) {
  touchData.ghost.style.left = (t.clientX-touchData.offsetX)+'px';
  touchData.ghost.style.top  = (t.clientY-touchData.offsetY)+'px';
}
function onTouchEnd(e) {
  document.removeEventListener('touchmove', onTouchMove);
  document.removeEventListener('touchend', onTouchEnd);
  const t = e.changedTouches[0];
  const dropX = t.clientX;
  const dropY = t.clientY;
  const wsR = workEl.getBoundingClientRect();
  const inside = dropX >= wsR.left && dropX <= wsR.right && dropY >= wsR.top && dropY <= wsR.bottom;
  const el = document.elementFromPoint(dropX, dropY);
  const targetEl = el?.closest('.element');
  const target = inside && targetEl && workEl.contains(targetEl) ? targetEl : null;
  const trashRect = trashEl.getBoundingClientRect();
  const overTrash = dropX >= trashRect.left && dropX <= trashRect.right &&
                    dropY >= trashRect.top && dropY <= trashRect.bottom;
  if (touchData.sourceEl) {
    if (overTrash) {
      touchData.sourceEl.remove();
      showNotification('Element Deleted');
    } else if (target && target !== touchData.sourceEl) {
      if (combine(target.dataset.name, touchData.name)) matchSound.play();
    } else if (inside) {
      const x = dropX - wsR.left - touchData.offsetX;
      const y = dropY - wsR.top - touchData.offsetY;
      touchData.sourceEl.style.left = x + 'px';
      touchData.sourceEl.style.top = y + 'px';
    }
  } else {
    const x = dropX - wsR.left - touchData.offsetX;
    const y = dropY - wsR.top - touchData.offsetY;
    const newTile = makeWorkspaceTile(touchData.name, x, y);
    if (target && target !== newTile) {
      if (combine(target.dataset.name, touchData.name)) matchSound.play();
    }
  }
  touchData.ghost.remove();
}

// ---- SAVE / LOAD ----
function saveGame() {
  localStorage.setItem('movieAlchemyInventory', JSON.stringify(inventory));
  localStorage.setItem('movieAlchemyDiscovered', JSON.stringify([...discovered]));
  showNotification('Game Saved');
}
function loadGame() {
  const inv = localStorage.getItem('movieAlchemyInventory');
  const disc = localStorage.getItem('movieAlchemyDiscovered');
  if (inv && disc) {
    inventory = JSON.parse(inv);
    discovered = new Set(JSON.parse(disc));
    renderInventory();
    showNotification('Game Loaded');
  }
}



// ---- INIT ----
saveEl.addEventListener('click', saveGame);
loadEl.addEventListener('click', loadGame);
clearEl.addEventListener('click',() => {
  workEl.querySelectorAll('.element').forEach(el=>el.remove());
  clearSound.play();
  showNotification('Canvas Cleared');
  if(!workEl.querySelector('.hint')){
    const p = document.createElement('p');
    p.className='hint';
    p.textContent='';
    workEl.prepend(p);
  }
});
loadGame();
renderInventory();

const toggleTerminalBtn = document.getElementById('toggle-terminal');
const toggleSortBtn = document.getElementById('toggle-sort');

toggleTerminalBtn.addEventListener('click', () => {
  showTerminals = !showTerminals;
  termSound.play();
  renderInventory();
});

toggleSortBtn.addEventListener('click', () => {
  sortAsc = !sortAsc;
  azSound.play();
  renderInventory();
});

const infoBtn = document.getElementById('info-btn');
const infoModal = document.getElementById('info-modal');
const closeInfoBtn = document.getElementById('close-info');
const resetBtn = document.getElementById('reset-btn');
const confirmModal = document.getElementById('confirm-modal');
const confirmDelete = document.getElementById('confirm-delete');
const cancelDelete = document.getElementById('cancel-delete');

infoBtn.addEventListener('click', () => {
  infoModal.classList.remove('hidden');
});

closeInfoBtn.addEventListener('click', () => {
  infoModal.classList.add('hidden');
});

resetBtn.addEventListener('click', () => {
  confirmModal.classList.remove('hidden');
});

confirmDelete.addEventListener('click', () => {
  localStorage.removeItem('movieAlchemyInventory');
  localStorage.removeItem('movieAlchemyDiscovered');
  inventory = [...initialElements];
  discovered = new Set(initialElements);
  renderInventory();
  workEl.querySelectorAll('.element').forEach(el => el.remove());
  showNotification("Saved data deleted. Game reset.");
  confirmModal.classList.add('hidden');
});

cancelDelete.addEventListener('click', () => {
  confirmModal.classList.add('hidden');
});


infoBtn.addEventListener('click', () => {
  infoModal.classList.remove('hidden');
  wilhelmSound.play();
});


closeInfoBtn.addEventListener('click', () => {
  infoModal.classList.add('hidden');
});

document.getElementById('prev-page').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    pageSound.play();
    renderInventory();
  }
});

document.getElementById('next-page').addEventListener('click', () => {
  const visibleCount = inventory.filter(n => showTerminals || !isTerminalElement(n)).length;
  const totalPages = Math.ceil(visibleCount / ITEMS_PER_PAGE);
  if (currentPage < totalPages) {
    currentPage++;
    pageSound.play();
    renderInventory();
  }
});

