// ---- Data ----
const initial = ['person','money','idea'];
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

// ---- Sounds ----
const clearSound = new Audio('clear.wav');
const matchSound = new Audio('match.wav');

// ---- State ----
let inventory = [...initial];
let discovered = new Set(initial);
let dragSourceName = null;
let dragSourceEl = null;

// ---- DOM Refs ----
const invEl = document.getElementById('inventory-items');
const workEl = document.getElementById('workspace');
const clearBtn = document.getElementById('clear-btn');
const notifyParent = document.getElementById('notification-container');

// ---- Create Inventory Tile ----
function makeInventoryTile(name) {
  const d = document.createElement('div');
  d.className = 'element';
  d.textContent = name;
  d.dataset.name = name;
  d.draggable = true;
  d.addEventListener('dragstart', () => {
    dragSourceName = name;
    dragSourceEl = null;
  });
  return d;
}

// ---- Create Workspace Tile ----
function makeWorkspaceTile(name, x, y) {
  const d = document.createElement('div');
  d.className = 'element';
  d.textContent = name;
  d.dataset.name = name;
  d.style.left = x + 'px';
  d.style.top = y + 'px';
  d.style.position = 'absolute';

  // dragstart for combine/move
  d.draggable = true;
  d.addEventListener('dragstart', e => {
    dragSourceName = name;
    dragSourceEl = d;
    e.dataTransfer.setData('text/plain', '');
  });

  // combine: drop onto another tile
  d.addEventListener('dragover', e => e.preventDefault());
  d.addEventListener('drop', e => {
    e.preventDefault();
    if (!dragSourceName) return;
    combine(d.dataset.name, dragSourceName);
  });

  // cleanup drag state on end
  d.addEventListener('dragend', () => {
    dragSourceName = null;
    dragSourceEl = null;
  });

  return d;
}

// ---- Combine Logic ----
function combine(target, source) {
  const result = recipes[`${target}+${source}`] || recipes[`${source}+${target}`];
  if (result && !discovered.has(result)) {
    discovered.add(result);
    inventory.push(result);
    matchSound.play();
    showNotification(`Discovered: ${result}`);
    renderInventory();
  }
}

// ---- Show Popup ----
function showNotification(txt) {
  const n = document.createElement('div');
  n.className = 'notification';
  n.textContent = txt;
  notifyParent.appendChild(n);
  n.addEventListener('animationend', () => n.remove());
}

// ---- Render Inventory ----
function renderInventory() {
  invEl.innerHTML = '';
  inventory.forEach(name => {
    invEl.appendChild(makeInventoryTile(name));
  });
}

// ---- Workspace Drop (spawn or move) ----
workEl.addEventListener('dragover', e => e.preventDefault());
workEl.addEventListener('drop', e => {
  e.preventDefault();
  if (!dragSourceName) return;
  const rect = workEl.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (!dragSourceEl) {
    // Spawn new tile
    workEl.appendChild(makeWorkspaceTile(dragSourceName, x, y));
  } else {
    // Move existing tile
    dragSourceEl.style.left = x + 'px';
    dragSourceEl.style.top = y + 'px';
  }

  dragSourceName = null;
  dragSourceEl = null;
});

// ---- Clear Canvas ----
clearBtn.addEventListener('click', () => {
  workEl.querySelectorAll('.element').forEach(el => el.remove());
  clearSound.play();
  showNotification('Canvas Cleared');
  if (!workEl.querySelector('.hint')) {
    const h = document.createElement('p');
    h.className = 'hint';
    h.textContent = 'Drag items here';
    workEl.prepend(h);
  }
});

// ---- Init ----
renderInventory();
