document.addEventListener("DOMContentLoaded", () => {

  
   
    // Task 1: Form Validation (Contact Form)
    // ==========================================
    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const messageInput = document.getElementById("message");

            let isValid = true;
            

            // Очистка предыдущих ошибок
            document.querySelectorAll(".error-text").forEach(el => el.remove());

            // Валидация Имени
            if (!nameInput.value.trim()) {
                showError(nameInput, "Please enter your name.");
                isValid = false;
            }

            
            const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/i;
            if (!emailInput.value.trim()) {
                showError(emailInput, "Please enter your email.");
                isValid = false;
            } else if (!emailInput.value.match(emailPattern)) {
                showError(emailInput, "Please enter a valid email address.");
                isValid = false;
            }

            
            if (messageInput.value.trim().length < 10) {
                showError(messageInput, "Message must be at least 10 characters long.");
                isValid = false;
            }

            if (isValid) {
                alert("Thank you! Your message has been sent successfully.");
                contactForm.reset();
            }
        });
    }

    function showError(inputElement, message) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "error-text text-danger small mt-1";
        errorDiv.textContent = message;
        inputElement.closest(".mb-3").appendChild(errorDiv);
    }


    // ==========================================
    // Task 2: Accordion for FAQs / Rules
    // ==========================================
    const accordionHeaders = document.querySelectorAll(".custom-accordion-header");

    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const content = header.nextElementSibling;

            
            document.querySelectorAll(".custom-accordion-content").forEach(item => {
                if (item !== content) {
                    item.classList.remove("active");
                    item.style.maxHeight = null;
                }
            });

            
            content.classList.toggle("active");
            if (content.classList.contains("active")) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });


    
    // Task 3: Modal Popup Window
    
    const openModalBtn = document.getElementById("open-modal-btn");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const modalOverlay = document.getElementById("modal-overlay");

    if (openModalBtn && modalOverlay) {
        openModalBtn.addEventListener("click", () => {
            modalOverlay.classList.remove("d-none");
        });
    }

    if (closeModalBtn && modalOverlay) {
        closeModalBtn.addEventListener("click", () => {
            modalOverlay.classList.add("d-none");
        });
    }

    if (modalOverlay) {
        window.addEventListener("click", (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.add("d-none");
            }
        });
    }


    
    // Task 4: Change Background Color
    
    const bgToggleBtn = document.getElementById("bg-toggle-btn");
    const colors = ["#ffffff", "#f8f9fa", "#e8f5e9", "#e3f2fd", "#fff3e0","green"];
    let colorIndex = 0;

    if (bgToggleBtn) {
        bgToggleBtn.addEventListener("click", () => {
            colorIndex = (colorIndex + 1) % colors.length;
            document.body.style.backgroundColor = colors[colorIndex];
        });
    }


    
    // Task 5: Live Date & Time Display
    
    const clockElement = document.getElementById("live-clock");

    function updateClock() {
        if (!clockElement) return;
        const now = new Date();
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        clockElement.textContent = now.toLocaleDateString("en-US", options);
    }

    if (clockElement) {
        updateClock();
        setInterval(updateClock, 1000);
    }
});
/* =====================================================================
   ASSIGNMENT 5 — Advanced JavaScript & DOM Manipulation
   SAN Football Hub (Group SAN, SE-2511)

   WHERE TO PUT IT: paste this whole block at the very TOP of script.js,
   above your old code. Everything is wrapped in an IIFE, so names
   (players, SoundFX, ...) can never clash with your existing code.
   ===================================================================== */
(function () {
  'use strict';

  // Some pages link script.js twice — make sure this block runs only once.
  if (window.__sanAssignment5) return;
  window.__sanAssignment5 = true;

  /* ===================================================================
     1. SOUND EFFECTS  (Part 1 → 3. Play Sounds)
     Sounds are generated with the Web Audio API, so no .mp3 file is needed.
     SoundFX.stop() runs before every new sound → sounds never overlap.
     =================================================================== */
  const SOUND_PRESETS = {
    click:   [{ freq: 520, start: 0, dur: 0.08 }],
    star:    [{ freq: 660, start: 0, dur: 0.09 }, { freq: 880, start: 0.09, dur: 0.14 }],
    success: [{ freq: 523, start: 0, dur: 0.12 }, { freq: 659, start: 0.12, dur: 0.12 }, { freq: 784, start: 0.24, dur: 0.22 }],
    error:   [{ freq: 220, start: 0, dur: 0.12 }, { freq: 180, start: 0.12, dur: 0.2 }],
    goal:    [{ freq: 392, start: 0, dur: 0.1 }, { freq: 523, start: 0.1, dur: 0.1 }, { freq: 659, start: 0.2, dur: 0.1 }, { freq: 784, start: 0.3, dur: 0.35 }]
  };

  const SoundFX = {
    ctx: null,
    active: [],

    play(type) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      try {
        if (!this.ctx) this.ctx = new AudioCtx();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        this.stop(); // stop the previous sound first (no overlapping)

        const now = this.ctx.currentTime;
        const notes = SOUND_PRESETS[type] || SOUND_PRESETS.click;

        notes.forEach(note => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = note.freq;
          gain.gain.setValueAtTime(0.0001, now + note.start);
          gain.gain.exponentialRampToValueAtTime(0.25, now + note.start + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + note.start + note.dur);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + note.start);
          osc.stop(now + note.start + note.dur + 0.02);
          this.active.push(osc);
        });
      } catch (err) {
        console.warn('Sound could not be played:', err);
      }
    },

    stop() {
      this.active.forEach(osc => {
        try { osc.stop(); } catch (err) { /* already stopped */ }
      });
      this.active = [];
    }
  };

  /* ===================================================================
     2. HIGHER-ORDER FUNCTION  (Part 1 → 3. Higher-Order Functions)
     withSound() takes a function as an argument and returns a NEW function
     that plays a sound and then calls the original one.
     =================================================================== */
  function withSound(soundType, handler) {
    return function (...args) {
      SoundFX.play(soundType);
      return handler.apply(this, args);
    };
  }

  /* ===================================================================
     3. DAY / NIGHT THEME SWITCH  (Part 1 → 1. Dynamic Style Changes)
     The button is created by JS and placed next to your 🎨 button,
     so you do not need to edit the navbar on every page.
     =================================================================== */
  function initThemeToggle() {
    const anchor = document.querySelector('#bg-toggle-btn');
    if (!anchor || document.getElementById('theme-toggle-btn')) return;

    const themeBtn = document.createElement('button');
    themeBtn.id = 'theme-toggle-btn';
    themeBtn.type = 'button';
    themeBtn.className = 'btn btn-outline-warning btn-sm ms-2';
    themeBtn.title = 'Switch Day / Night theme';
    anchor.insertAdjacentElement('afterend', themeBtn);

    function applyTheme(isNight) {
      document.body.classList.toggle('night-mode', isNight);
      document.documentElement.setAttribute('data-bs-theme', isNight ? 'dark' : 'light');
      themeBtn.textContent = isNight ? '☀️ Day' : '🌙 Night';
      try { localStorage.setItem('san-theme', isNight ? 'night' : 'day'); } catch (err) { /* storage blocked */ }
    }

    let saved = 'day';
    try { saved = localStorage.getItem('san-theme') || 'day'; } catch (err) { /* ignore */ }
    applyTheme(saved === 'night');

    themeBtn.addEventListener('click', withSound('click', () => {
      applyTheme(!document.body.classList.contains('night-mode'));
    }));
  }

  /* ===================================================================
     4. KEYBOARD NAVIGATION  (Part 1 → 2. Keyboard Event Handling + Switch)
     Press Tab to focus a menu link, then use the arrow keys.
     =================================================================== */
  function initKeyboardNav() {
    const links = Array.from(document.querySelectorAll('#navbarNav .nav-link'));
    if (links.length === 0) return;

    document.addEventListener('keydown', (event) => {
      const current = links.indexOf(document.activeElement);
      if (current === -1) return; // focus is not inside the menu

      let next = current;
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          next = (current + 1) % links.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          next = (current - 1 + links.length) % links.length;
          break;
        case 'Home':
          next = 0;
          break;
        case 'End':
          next = links.length - 1;
          break;
        default:
          return; // any other key: do nothing
      }
      event.preventDefault();
      links[next].focus();
      SoundFX.play('click');
    });
  }

  /* ===================================================================
     5. TIME-OF-DAY GREETING  (Part 1 → 2. Switch Statements)   [index.html]
     =================================================================== */
  function getPartOfDay(hour) {
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  function initGreeting() {
    const greeting = document.getElementById('greeting');
    if (!greeting) return;

    let text;
    switch (getPartOfDay(new Date().getHours())) {
      case 'morning':
        text = '☀️ Good morning, football fan! Check today\'s headlines.';
        break;
      case 'afternoon':
        text = '⚽ Good afternoon! Matchday is getting closer.';
        break;
      default:
        text = '🌙 Good evening! Time for some tactical analysis.';
    }
    greeting.textContent = text;
  }

  /* ===================================================================
     6. GOAL COUNTER — fun + animation + sound + event listener  [index.html]
     =================================================================== */
  function initGoalCounter() {
    const button = document.getElementById('goal-btn');
    const countEl = document.getElementById('goal-count');
    const messageEl = document.getElementById('goal-message');
    const ball = document.getElementById('goal-ball');
    if (!button || !countEl || !messageEl || !ball) return;

    let goals = 0;

    function scoreGoal() {
      goals++;
      countEl.textContent = goals;

      switch (goals) {
        case 1:  messageEl.textContent = 'First goal! 🎉'; break;
        case 3:  messageEl.textContent = 'Hat-trick! 🎩'; break;
        case 5:  messageEl.textContent = 'Five goals — what a match! 🔥'; break;
        case 10: messageEl.textContent = 'Legend status! 🏆'; break;
        default: messageEl.textContent = 'GOAL! ⚽';
      }

      // restart the CSS animation every click
      ball.classList.remove('ball-kick');
      void ball.offsetWidth; // forces the browser to reset the animation
      ball.classList.add('ball-kick');
    }

    button.addEventListener('click', withSound('goal', scoreGoal));
  }

  /* ===================================================================
     7. PLAYERS PAGE — objects, arrays, loops, filter/map/reduce,
        star rating (querySelectorAll), switch-based filter   [players.html]
     =================================================================== */

  // --- Objects and methods ---
  class Player {
    constructor(data) {
      this.id = data.id;
      this.name = data.name;
      this.position = data.position;   // forward | midfielder | defender | goalkeeper
      this.role = data.role;
      this.badge = data.badge;         // Bootstrap badge colour class
      this.img = data.img || null;     // optional photo
      this.description = data.description;
      this.rating = 0;                 // 0 = not rated yet
    }
    getInitials() {
      return this.name.split(' ').map(word => word[0]).join('').slice(0, 2);
    }
    setRating(value) {
      this.rating = value;
    }
    getRatingText() {
      return this.rating > 0 ? `Your rating: ${this.rating}/5` : 'Not rated yet';
    }
  }

  // --- Arrays ---
  const players = [
    new Player({ id: 1, name: 'Lionel Messi', position: 'forward', role: 'Right Winger', badge: 'bg-success', img: 'img/messi.jpg',
      description: 'Known for dribbling, vision, and extraordinary goalscoring consistency.' }),
    new Player({ id: 2, name: 'Cristiano Ronaldo', position: 'forward', role: 'Striker', badge: 'bg-primary', img: 'img/cristiano.jpg',
      description: 'Famous for athleticism, aerial dominance, and clutch match performances.' }),
    new Player({ id: 3, name: 'Kevin De Bruyne', position: 'midfielder', role: 'Midfielder', badge: 'bg-info', img: 'img/kdb.jpg',
      description: 'Master of key passes, crossing accuracy, and tactical intelligence.' }),
    new Player({ id: 4, name: 'Erling Haaland', position: 'forward', role: 'Striker', badge: 'bg-primary',
      description: 'Powerful runner and clinical finisher who lives in the penalty box.' }),
    new Player({ id: 5, name: 'Rodri', position: 'midfielder', role: 'Defensive Midfielder', badge: 'bg-info',
      description: 'Controls the tempo of the game and shields the back line.' }),
    new Player({ id: 6, name: 'Virgil van Dijk', position: 'defender', role: 'Centre Back', badge: 'bg-danger',
      description: 'Commanding defender, strong in the air and calm on the ball.' }),
    new Player({ id: 7, name: 'Thibaut Courtois', position: 'goalkeeper', role: 'Goalkeeper', badge: 'bg-warning text-dark',
      description: 'Tall shot-stopper with great reflexes in one-on-one situations.' })
  ];

  const RATINGS_KEY = 'san-player-ratings';

  function loadRatings() {
    try {
      const saved = JSON.parse(localStorage.getItem(RATINGS_KEY)) || {};
      players.forEach(player => { player.rating = saved[player.id] || 0; });
    } catch (err) { /* storage blocked — start from 0 */ }
  }

  function saveRatings() {
    try {
      const data = {};
      players.forEach(player => { data[player.id] = player.rating; });
      localStorage.setItem(RATINGS_KEY, JSON.stringify(data));
    } catch (err) { /* ignore */ }
  }

  // --- Create card HTML for one player (loop builds the 5 stars) ---
  function createPlayerCard(player) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
      starsHtml += `<span class="star" data-value="${i}" role="button" tabindex="0" aria-label="${i} star${i > 1 ? 's' : ''}">★</span>`;
    }

    const avatarHtml = player.img
      ? `<img src="${player.img}" class="player-avatar mx-auto d-block mt-3" alt="${player.name}">`
      : `<div class="player-avatar player-avatar-fallback mx-auto mt-3">${player.getInitials()}</div>`;

    const col = document.createElement('div');
    col.className = 'col player-item fade-in-up';
    col.innerHTML = `
      <div class="card h-100 shadow-sm text-center player-card">
        ${avatarHtml}
        <div class="card-body">
          <h5 class="card-title">${player.name}</h5>
          <p class="badge ${player.badge} mb-2">${player.role}</p>
          <p class="card-text small">${player.description}</p>
          <div class="star-rating" data-player-id="${player.id}" aria-label="Rate ${player.name}">${starsHtml}</div>
          <p class="small text-muted mb-0 rating-label">${player.getRatingText()}</p>
        </div>
      </div>`;
    return col;
  }

  function renderPlayers(list) {
    const container = document.querySelector('#players-container');
    container.innerHTML = '';
    list.forEach(player => container.appendChild(createPlayerCard(player)));

    // colour the stars that were already rated, then attach the listeners
    document.querySelectorAll('.star-rating').forEach(box => {
      const player = players.find(p => p.id === Number(box.dataset.playerId));
      paintStars(box, player.rating);
    });
    bindStars();
    updateRatingSummary();
  }

  // --- Switch statement: filter players by the clicked button ---
  function filterPlayers(category) {
    let result;
    switch (category) {
      case 'forward':
        result = players.filter(p => p.position === 'forward');
        break;
      case 'midfielder':
        result = players.filter(p => p.position === 'midfielder');
        break;
      case 'defender':
        result = players.filter(p => p.position === 'defender');
        break;
      case 'goalkeeper':
        result = players.filter(p => p.position === 'goalkeeper');
        break;
      default: // 'all'
        result = players;
    }
    renderPlayers(result);
  }

  // --- Star rating: select ALL stars with querySelectorAll ---
  function paintStars(box, value) {
    box.querySelectorAll('.star').forEach(star => {
      star.classList.toggle('selected', Number(star.dataset.value) <= value);
    });
  }

  function previewStars(star, isOn) {
    const box = star.closest('.star-rating');
    const value = Number(star.dataset.value);
    box.querySelectorAll('.star').forEach(s => {
      s.classList.toggle('hovered', isOn && Number(s.dataset.value) <= value);
    });
    star.style.transform = isOn ? 'scale(1.3)' : 'scale(1)'; // style.transform
  }

  function handleStarClick(star) {
    const box = star.closest('.star-rating');
    const player = players.find(p => p.id === Number(box.dataset.playerId));
    const value = Number(star.dataset.value);

    player.setRating(value);
    paintStars(box, value);

    // change text content dynamically
    box.parentElement.querySelector('.rating-label').textContent = player.getRatingText();
    document.querySelector('#rating-message').textContent = `You rated ${player.name}: ${'★'.repeat(value)} (${value}/5)`;

    // animation triggered by the click
    star.classList.add('star-pop');
    star.addEventListener('animationend', () => star.classList.remove('star-pop'), { once: true });

    SoundFX.play('star');
    saveRatings();
    updateRatingSummary();
  }

  function bindStars() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
      star.addEventListener('click', () => handleStarClick(star));
      star.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleStarClick(star);
        }
      });
      star.addEventListener('mouseenter', () => previewStars(star, true));
      star.addEventListener('mouseleave', () => previewStars(star, false));
    });
  }

  // --- filter + reduce: average rating of rated players ---
  function updateRatingSummary() {
    const summary = document.querySelector('#rating-summary');
    if (!summary) return;
    const rated = players.filter(p => p.rating > 0);
    if (rated.length === 0) {
      summary.textContent = 'No ratings yet.';
      return;
    }
    const total = rated.reduce((sum, p) => sum + p.rating, 0);
    summary.innerHTML = `Average rating: <strong>${(total / rated.length).toFixed(1)}</strong> from ${rated.length} player(s)`;
  }

  function initPlayers() {
    const container = document.querySelector('#players-container');
    if (!container) return;

    loadRatings();
    renderPlayers(players);

    document.querySelectorAll('#player-filters button').forEach(button => {
      button.addEventListener('click', withSound('click', () => {
        document.querySelectorAll('#player-filters button').forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        filterPlayers(button.dataset.filter);
      }));
    });
  }

  
  const NEWS_PER_CLICK = 3;
  let newsCache = null;  // the JSON is downloaded only once
  let newsShown = 0;

  function createNewsCard(item) {
    const col = document.createElement('div');
    col.className = 'col news-item fade-in-up';
    col.innerHTML = `
      <div class="card h-100 shadow-sm news-card">
        <div class="card-body">
          <span class="badge bg-success mb-2">${item.tag}</span>
          <h5 class="card-title">${item.title}</h5>
          <p class="card-text">${item.text}</p>
        </div>
      </div>`;
    return col;
  }

  async function loadMoreNews() {
    const container = document.getElementById('news-container');
    const button = document.getElementById('load-more-btn');
    const status = document.getElementById('load-status');

    button.disabled = true;
    status.textContent = 'Loading...';

    try {
      if (!newsCache) {
        const response = await fetch('data/news.json');
        if (!response.ok) throw new Error('HTTP ' + response.status);
        newsCache = await response.json();
      }

      const nextItems = newsCache.slice(newsShown, newsShown + NEWS_PER_CLICK);
      nextItems.forEach(item => container.appendChild(createNewsCard(item)));
      newsShown += nextItems.length;

      status.textContent = `Showing ${newsShown} of ${newsCache.length} extra stories`;
      SoundFX.play('success');

      if (newsShown >= newsCache.length) {
        button.textContent = 'No more news';  
      } else {
        button.disabled = false;
      }
    } catch (error) {
      status.textContent = 'Could not load news: ' + error.message + ' (open the site with Live Server or GitHub Pages)';
      SoundFX.play('error');
      button.disabled = false;
    }
  }

  function initNews() {
    const button = document.getElementById('load-more-btn');
    if (!button || !document.getElementById('news-container')) return;
    button.addEventListener('click', loadMoreNews);
  }

  

  function showFormResult(error, result, name) {
    const feedback = document.getElementById('form-feedback');
    const submitBtn = document.querySelector('#contact-form button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';

    if (!feedback) { 
      alert(error ? 'Sorry, the message was not sent.' : 'Thank you! Your message has been sent successfully.');
      if (!error) document.getElementById('contact-form').reset();
      return;
    }

    feedback.classList.remove('fade-in-up', 'shake');
    void feedback.offsetWidth; 

    if (error) {
      feedback.className = 'alert alert-danger mt-3 shake';
      feedback.textContent = 'Sorry, the message was not sent: ' + error.message;
      SoundFX.play('error');
    } else {
      feedback.className = 'alert alert-success mt-3 fade-in-up';
      feedback.textContent = `Thanks, ${name}! Your message was sent successfully (ticket #${result.id}).`;
      SoundFX.play('success');
      document.getElementById('contact-form').reset();
    }
  }

  function submitContactForm(data, callback) {
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({ title: data.name, body: data.message, email: data.email })
    })
      .then(response => {
        if (!response.ok) throw new Error('Server answered ' + response.status);
        return response.json();
      })
      .then(result => callback(null, result, data.name))
      .catch(error => callback(error, null, data.name));
  }

  
  function sendContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const data = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      message: document.getElementById('message').value.trim()
    };
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    submitContactForm(data, showFormResult);
  }
  window.SANHub = { sendContactForm: sendContactForm };

  function initContactForm() {
    // Reset button: clears every input with querySelectorAll + forEach
    const resetBtn = document.getElementById('reset-form-btn');
    if (!resetBtn) return;

    resetBtn.addEventListener('click', withSound('click', () => {
      document.querySelectorAll('#contact-form input, #contact-form textarea')
        .forEach(field => { field.value = ''; });
      document.querySelectorAll('.error-text').forEach(el => el.remove());
      const feedback = document.getElementById('form-feedback');
      if (feedback) {
        feedback.textContent = '';
        feedback.className = '';
      }
    }));
  }

  function safeInit(initFunction) {
    try {
      initFunction();
    } catch (err) {
      console.error('[Assignment 5] ' + initFunction.name + ' failed:', err);
    }
  }

  function runAll() {
    [initThemeToggle, initKeyboardNav, initGreeting, initGoalCounter, initPlayers, initNews, initContactForm]
      .forEach(safeInit);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAll);
  } else {
    runAll();
  }
})();

