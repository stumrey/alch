// ---- INITIAL DATA ----
const initialElements = ['person','money','idea'];
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

// ---- SOUNDS ----
const clearSound = new Audio('clear.wav');
const matchSound = new Audio('match.wav');

// ---- STATE & REFS ----
let inventory = [...initialElements];
let discovered = new Set(initialElements);
let dragSourceName = null;
let dragSourceEl = null;

const invEl = document.getElementById('inventory-items');
const workEl = document.getElementById('workspace');
const clearBtn = document.getElementById('clear-btn');
const notifyParent = document.getElementById('notification-container');

// ---- RENDER INVENTORY ----
function renderInventory() {
  invEl.innerHTML = '';
  inventory.forEach(name => {
    const d = document.createElement('div');
    d.className = 'element';
    d.textContent = name;
    d.dataset.name = name;
    d.draggable = true;
    d.addEventListener('dragstart', () => {
      dragSourceName = name;
      dragSourceEl = null;
    });
    invEl.appendChild(d);
  });
}
renderInventory();

// ---- MAKE AND APPEND A WORKSPACE TILE ----
function makeWorkspaceTile(name, x, y) {
  const d = document.createElement('div');
  d.className = 'element';
  d.textContent = name;
  d.dataset.name = name;
  d.style.position = 'absolute';
  d.style.left = x + 'px';
  d.style.top  = y + 'px';
  d.draggable = true;

  d.addEventListener('dragstart', e => {
    dragSourceName = name;
    dragSourceEl = d;
    e.dataTransfer.setData('text/plain', '');
  });

  d.addEventListener('dragover', e => e.preventDefault());
  d.addEventListener('drop', e => {
    e.preventDefault();
    combine(d.dataset.name, dragSourceName);
  });

  workEl.appendChild(d);
  return d;
}

// ---- COMBINE TWO ELEMENTS ----
function combine(a, b) {
  const res = recipes[`${a}+${b}`] || recipes[`${b}+${a}`];
  if (res && !discovered.has(res)) {
    discovered.add(res);
    inventory.push(res);
    matchSound.play();
    showNotification(`Discovered: ${res}`);
    renderInventory();
  }
}

// ---- POPUP ----
function showNotification(txt) {
  const n = document.createElement('div');
  n.className = 'notification';
  n.textContent = txt;
  notifyParent.appendChild(n);
  n.addEventListener('animationend', () => n.remove());
}

// ---- WORKSPACE DROP: SPAWN / MOVE / COMBINE ----
workEl.addEventListener('dragover', e => e.preventDefault());
workEl.addEventListener('drop', e => {
  e.preventDefault();
  if (!dragSourceName) return;

  const rect = workEl.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const el = document.elementFromPoint(e.clientX, e.clientY);
  const target = el && el.closest('.element') && workEl.contains(el.closest('.element'))
    ? el.closest('.element')
    : null;

  if (target) {
    combine(target.dataset.name, dragSourceName);
  } else if (dragSourceEl) {
    // move existing
    dragSourceEl.style.left = x + 'px';
    dragSourceEl.style.top  = y + 'px';
  } else {
    // spawn new
    makeWorkspaceTile(dragSourceName, x, y);
  }

  dragSourceName = null;
  dragSourceEl = null;
});

// ---- CLEAR CANVAS ----
clearBtn.addEventListener('click', () => {
  workEl.querySelectorAll('.element').forEach(el => el.remove());
  clearSound.play();
  showNotification('Canvas Cleared');
  if (!workEl.querySelector('.hint')) {
    const p = document.createElement('p');
    p.className = 'hint';
    p.textContent = 'Drag items here';
    workEl.prepend(p);
  }
});
