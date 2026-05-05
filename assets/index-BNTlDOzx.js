(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function t(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(o){if(o.ep)return;o.ep=!0;const n=t(o);fetch(o.href,n)}})();const u={idle:"idle",playing:"playing",won:"won",lost:"lost"},c={hidden:"hidden",opened:"opened",flagged:"flagged"},_={easy:{label:"Easy",summary:"10 × 10 · 10 mines",short:"10×10",rows:10,columns:10,mines:10},medium:{label:"Medium",summary:"15 × 15 · 40 mines",short:"15×15",rows:15,columns:15,mines:40},hard:{label:"Hard",summary:"25 × 25 · 99 mines",short:"25×25",rows:25,columns:25,mines:99}},y=["easy","medium","hard"],K="easy",f={save:"rss-minesweeper-save",autosave:"rss-minesweeper-autosave",scores:"rss-minesweeper-scores",theme:"rss-minesweeper-theme",sound:"rss-minesweeper-sound"},v={light:"light",dark:"dark"},oe=10,le=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];function ie(e,s){return{row:e,column:s,status:c.hidden,hasMine:!1,adjacentMines:0}}function re(e,s){return Array.from({length:e},(t,a)=>Array.from({length:s},(o,n)=>ie(a,n)))}function de(e,s,t){return s>=0&&s<e.length&&t>=0&&t<e[0].length}function U(e,s,t){return le.map(([a,o])=>({row:s+a,column:t+o})).filter(a=>de(e,a.row,a.column)).map(a=>e[a.row][a.column])}function ce(e,s,t,a){const o=e.flat().filter(r=>r.row!==t||r.column!==a);ue(o).slice(0,s).forEach(r=>{r.hasMine=!0})}function ue(e){const s=[...e];for(let t=s.length-1;t>0;t-=1){const a=Math.floor(Math.random()*(t+1));[s[t],s[a]]=[s[a],s[t]]}return s}function pe(e){e.flat().forEach(s=>{s.adjacentMines=U(e,s.row,s.column).filter(t=>t.hasMine).length})}function fe(e,s,t,a){ce(e,s,t,a),pe(e)}function me(e,s){const t=[s],a=[];let o=0;for(;t.length>0;){const n=t.pop();n.status!==c.opened&&(n.status===c.flagged&&(o+=1),n.status=c.opened,a.push(n),!(n.hasMine||n.adjacentMines>0)&&U(e,n.row,n.column).filter(r=>r.status!==c.opened).forEach(r=>t.push(r)))}return{openedCells:a,removedFlags:o}}function ge(e){return e.status===c.opened?0:e.status===c.flagged?(e.status=c.hidden,1):(e.status=c.flagged,-1)}function he(e){return e.flat().filter(s=>!s.hasMine&&s.status!==c.opened).length}function ve(e){localStorage.setItem(f.save,JSON.stringify(e))}function O(e){localStorage.setItem(f.autosave,JSON.stringify(e))}function ye(){const e=A(f.save,null);return e!==null?e:A(f.autosave,null)}function E(){localStorage.removeItem(f.save),localStorage.removeItem(f.autosave)}function J(){const e=A(f.scores,[]);return Array.isArray(e)?e:[]}function be(e){const t=[{...e,savedAt:Date.now()},...J()].sort((a,o)=>a.seconds-o.seconds).slice(0,oe);return localStorage.setItem(f.scores,JSON.stringify(t)),t}function _e(){localStorage.removeItem(f.scores)}function Me(){const e=localStorage.getItem(f.theme);return e===v.light||e===v.dark?e:v.dark}function Se(e){localStorage.setItem(f.theme,e)}function we(){const e=localStorage.getItem(f.sound);return e===null?!0:e==="on"}function Le(e){localStorage.setItem(f.sound,e?"on":"off")}function A(e,s){const t=localStorage.getItem(e);if(t===null)return s;try{return JSON.parse(t)}catch{return localStorage.removeItem(e),s}}let w=null,L=we();const B={reveal:{frequency:540,duration:.06,type:"sine",gain:.07},flag:{frequency:380,duration:.06,type:"square",gain:.06},unflag:{frequency:280,duration:.05,type:"square",gain:.05},win:{frequency:760,duration:.18,type:"triangle",gain:.09},lose:{frequency:110,duration:.32,type:"sawtooth",gain:.09}};function $e(){return L=!L,Le(L),L}function Te(){return L}function N(e){if(!L||!B[e])return;w===null&&(w=new AudioContext);const{frequency:s,duration:t,type:a,gain:o}=B[e],n=w.createOscillator(),r=w.createGain();n.type=a,n.frequency.value=s,r.gain.value=o,n.connect(r),r.connect(w.destination),n.start(),n.stop(w.currentTime+t)}let k=null;function Y(e){M(),k=setInterval(e,1e3)}function M(){k!==null&&(clearInterval(k),k=null)}function F(e){const s=Math.max(0,Math.floor(e)),t=Math.floor(s/60),a=s%60;return`${D(t)}:${D(a)}`}function D(e){return String(e).padStart(2,"0")}const ze={bomb:'<circle cx="11" cy="13" r="6"/><path d="M14.5 8 17 5.5"/><path d="M17 5h2v2"/><path d="M16.5 8.5 18 7"/><circle cx="6" cy="14" r="0.6" fill="currentColor"/>',flag:'<path d="M4 21v-7"/><path d="M4 4h11l-1.5 4L15 12H4"/>',play:'<polygon points="6 4 20 12 6 20 6 4"/>',refresh:'<path d="M3 12a9 9 0 1 0 3-6.7"/><polyline points="3 4 3 9 8 9"/>',save:'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',resume:'<polygon points="5 3 19 12 5 21 5 3"/>',shuffle:'<path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/>',bulb:'<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c1 .9 1 1.8 1 3.3h6c0-1.5 0-2.4 1-3.3A7 7 0 0 0 12 2z"/>',trophy:'<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 4H4v3a4 4 0 0 0 4 4"/><path d="M17 4h3v3a4 4 0 0 1-4 4"/>',moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.9 4.9l1.4 1.4"/><path d="M17.7 17.7l1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.9 19.1l1.4-1.4"/><path d="M17.7 6.3l1.4-1.4"/>',volume:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M19 6a8 8 0 0 1 0 12"/>',mute:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/>',close:'<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',chevron:'<polyline points="6 9 12 15 18 9"/>',check:'<polyline points="4 12 10 18 20 6"/>',clock:'<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/>',move:'<polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>',spark:'<path d="M12 2v4"/><path d="M12 18v4"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M5 5l3 3"/><path d="M16 16l3 3"/><path d="M5 19l3-3"/><path d="M16 8l3-3"/>',medal:'<circle cx="12" cy="14" r="6"/><path d="M8 14l-3-9h14l-3 9"/>',shield:'<path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z"/>'};function d(e,s={}){const t=ze[e];if(t===void 0)return"";const a=s.size||18,o=s.stroke||2;return`<svg${s.className?` class="${s.className}"`:""} width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${o}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${t}</svg>`}const i={},q=new Map;let p={trigger:null},b={closeHandler:null};function Ee(){document.body.innerHTML="";const e=document.createElement("main");e.className="app",e.innerHTML=`
    <header class="brand">
      <div class="brand__mark" aria-hidden="true">
        ${d("shield",{size:22})}
      </div>
      <div class="brand__text">
        <span class="brand__eyebrow">RSS / Vanilla JS</span>
        <span class="brand__title">Minesweeper</span>
      </div>
    </header>

    <section class="hero">
      <div class="hero__head">
        <span class="hero__label">${d("spark",{size:12})} <span>Mission status</span></span>
      </div>
      <div class="hero__hud">
        <div class="hud-card hud-card--time">
          <span class="hud-card__label">${d("clock",{size:12})} Time</span>
          <strong class="hud-card__value mono" data-stat="time">00:00</strong>
          <span class="hud-card__pulse" aria-hidden="true"></span>
        </div>
        <div class="hud-card">
          <span class="hud-card__label">${d("move",{size:12})} Moves</span>
          <strong class="hud-card__value" data-stat="moves">0</strong>
        </div>
        <div class="hud-card">
          <span class="hud-card__label">${d("flag",{size:12})} Flags</span>
          <strong class="hud-card__value"><span data-stat="flags">0</span><small>/<span data-stat="mines">0</span></small></strong>
        </div>
      </div>
    </section>

    <section class="toolbar" data-toolbar>
      <div class="toolbar__group" data-group="puzzle">
        <span class="toolbar__label">${d("spark",{size:12})} Mission</span>
        <div class="toolbar__row" data-difficulty></div>
        <button class="pill" data-action="random" type="button">
          ${d("shuffle",{size:16})}
          <span>Random</span>
        </button>
      </div>
      <div class="toolbar__group" data-group="game">
        <span class="toolbar__label">${d("play",{size:12})} Match</span>
        <div class="toolbar__row">
          <button class="pill" data-action="new-game" type="button">
            ${d("refresh",{size:16})}
            <span>New game</span>
          </button>
          <button class="pill" data-action="save-game" type="button">
            ${d("save",{size:16})}
            <span>Save</span>
          </button>
          <button class="pill" data-action="continue-game" type="button">
            ${d("resume",{size:16})}
            <span>Continue</span>
          </button>
        </div>
      </div>
      <div class="toolbar__group" data-group="more">
        <span class="toolbar__label">${d("trophy",{size:12})} More</span>
        <div class="toolbar__row">
          <button class="pill" data-action="open-scores" type="button">
            ${d("trophy",{size:16})}
            <span>Top 10</span>
          </button>
          <button class="pill pill--icon" data-action="toggle-theme" type="button" aria-label="Toggle theme" data-theme-button>
            ${d("moon",{size:16})}
          </button>
          <button class="pill pill--icon" data-action="toggle-sound" type="button" aria-label="Toggle sound" data-sound-button>
            ${d("volume",{size:16})}
          </button>
        </div>
      </div>
    </section>

    <section class="board-wrap">
      <div class="board-aura" aria-hidden="true"></div>
      <div class="board-frame">
        <div class="board" data-board></div>
      </div>
      <p class="message" data-message>Open any cell to start.</p>
    </section>

    <footer class="appfoot">
      <span class="appfoot__legend">
        <span class="dot dot--safe"></span> safe tile
        <span class="dot dot--flag"></span> flag (RMB)
        <span class="dot dot--mine"></span> mine
      </span>
      <span class="appfoot__credit">
        <span data-cheat-trigger>SkorbezhArtem</span> · <a href="https://github.com/SkorbezhArtem/minesweeper" target="_blank" rel="noreferrer">source</a>
      </span>
    </footer>
  `,document.body.append(e),i.app=e,i.toolbar=e.querySelector("[data-toolbar]"),i.board=e.querySelector("[data-board]"),i.boardWrap=e.querySelector(".board-wrap"),i.message=e.querySelector("[data-message]"),i.timeStat=e.querySelector('[data-stat="time"]'),i.movesStat=e.querySelector('[data-stat="moves"]'),i.flagsStat=e.querySelector('[data-stat="flags"]'),i.minesStat=e.querySelector('[data-stat="mines"]'),i.themeButton=e.querySelector("[data-theme-button]"),i.soundButton=e.querySelector("[data-sound-button]"),i.difficultyHost=e.querySelector("[data-difficulty]")}function Ce(e){i.board.addEventListener("click",t=>{const a=t.target.closest("[data-cell]");a!==null&&e.onCellOpen(Number(a.dataset.row),Number(a.dataset.column))}),i.board.addEventListener("contextmenu",t=>{const a=t.target.closest("[data-cell]");a!==null&&(t.preventDefault(),e.onCellFlag(Number(a.dataset.row),Number(a.dataset.column)))}),i.app.addEventListener("click",t=>{const a=t.target.closest("[data-action]");if(a===null)return;const n={"new-game":e.onNewGame,"continue-game":e.onContinueGame,"save-game":e.onSaveGame,random:e.onRandomGame,"open-scores":e.onOpenScores,"toggle-theme":e.onToggleTheme,"toggle-sound":e.onToggleSound}[a.dataset.action];typeof n=="function"&&n()});const s=i.app.querySelector("[data-cheat-trigger]");s!==null&&s.addEventListener("dblclick",t=>{t.preventDefault(),i.board.classList.toggle("board--cheat")}),He(e.onDifficultyChange)}function h(e,s={}){s.fresh!==!1&&i.board.dataset.signature!==ee(e)&&ke(e),e.board.flat().forEach(t=>xe(t,e.status)),V(e),Ne(e),Ie(e.difficulty)}function V(e){i.timeStat.textContent=F(e.elapsedSeconds),i.movesStat.textContent=e.moves,i.flagsStat.textContent=e.flagsLeft,i.minesStat.textContent=e.settings.mines,i.timeStat.parentElement.classList.toggle("hud-card--running",e.status===u.playing)}function Q(e){document.documentElement.dataset.theme=e,i.themeButton.innerHTML=e===v.dark?d("sun",{size:16}):d("moon",{size:16}),i.themeButton.setAttribute("aria-label",e===v.dark?"Switch to light theme":"Switch to dark theme")}function X(){const e=Te();i.soundButton.innerHTML=e?d("volume",{size:16}):d("mute",{size:16}),i.soundButton.setAttribute("aria-label",e?"Mute sound":"Enable sound"),i.soundButton.classList.toggle("pill--muted",!e)}function g(e,s="info"){const t=i.message;t.textContent=e,t.dataset.tone=s,t.classList.remove("message--in"),t.offsetWidth,t.classList.add("message--in")}function R(e){i.boardWrap.classList.toggle("board-wrap--win",e)}function j(e){i.boardWrap.classList.toggle("board-wrap--lose",e)}function Z({title:e,eyebrow:s,body:t,footer:a,onClose:o}){x();const n=document.createElement("div");n.className="modal",n.dataset.modal="",n.innerHTML=`
    <div class="modal__panel" role="dialog" aria-modal="true">
      <button class="modal__close" data-modal-close type="button" aria-label="Close">
        ${d("close",{size:18})}
      </button>
      <div class="modal__head">
        ${s?`<p class="modal__eyebrow">${s}</p>`:""}
        <h2 class="modal__title">${e}</h2>
      </div>
      <div class="modal__body" data-modal-body></div>
      ${a?'<div class="modal__footer" data-modal-footer></div>':""}
    </div>
  `;const r=n.querySelector("[data-modal-body]"),m=n.querySelector("[data-modal-footer]");t instanceof Node?r.append(t):typeof t=="string"&&(r.innerHTML=t),a instanceof Node&&m?m.append(a):typeof a=="string"&&m&&(m.innerHTML=a),document.body.append(n),document.body.classList.add("has-modal"),requestAnimationFrame(()=>n.classList.add("modal--open"));const S=()=>x();n.addEventListener("click",C=>{(C.target===n||C.target.closest("[data-modal-close]"))&&S()});const G=C=>{C.key==="Escape"&&S()};return document.addEventListener("keydown",G),b={overlay:n,closeHandler:()=>{document.removeEventListener("keydown",G),typeof o=="function"&&o()}},n}function x(){var s;if(!b.overlay)return;const e=b.overlay;(s=b.closeHandler)==null||s.call(b),e.classList.remove("modal--open"),setTimeout(()=>{e.remove(),document.body.classList.remove("has-modal")},180),b={closeHandler:null}}function ke(e){q.clear(),i.board.innerHTML="",i.board.style.setProperty("--columns",e.settings.columns),i.board.dataset.size=e.difficulty,i.board.dataset.signature=ee(e),e.board.flat().forEach(s=>{const t=document.createElement("button");t.className="cell",t.type="button",t.dataset.cell="",t.dataset.row=s.row,t.dataset.column=s.column,t.setAttribute("aria-label",`Cell ${s.row+1}, ${s.column+1}`),i.board.append(t),q.set(te(s.row,s.column),t)})}function xe(e,s){const t=q.get(te(e.row,e.column));if(t===void 0)return;t.disabled=s===u.won||s===u.lost;const a=t.dataset.status,o=t.dataset.mines||"",n=t.classList.contains("cell--mine");let r="",m="",S=!1;e.status===c.flagged?m=qe():e.status===c.opened&&(e.hasMine?(m=Oe(),S=!0):e.adjacentMines>0&&(m=String(e.adjacentMines),r=String(e.adjacentMines))),(a!==e.status||o!==r||n!==S)&&(t.dataset.status=e.status,r?t.dataset.mines=r:delete t.dataset.mines,t.innerHTML=m,t.classList.toggle("cell--hidden",e.status===c.hidden),t.classList.toggle("cell--opened",e.status===c.opened&&!e.hasMine),t.classList.toggle("cell--flagged",e.status===c.flagged),t.classList.toggle("cell--mine",S),t.classList.toggle("cell--zero",e.status===c.opened&&!e.hasMine&&e.adjacentMines===0)),e.hasMine?t.dataset.hasMine="true":delete t.dataset.hasMine}function Ne(e){e.status===u.idle?g("Open any cell to start.","info"):e.status===u.playing?g("Game in progress.","info"):e.status===u.won?g(`Hooray! You found all mines in ${e.elapsedSeconds} seconds and ${e.moves} moves!`,"win"):e.status===u.lost&&g("Game over. Try again.","lose")}function He(e){const s=i.difficultyHost;s.classList.add("select"),s.innerHTML=`
    <button class="select__trigger" type="button" data-select-trigger>
      ${d("shield",{size:16})}
      <span class="select__value" data-select-value>Easy</span>
      <span class="select__chevron" aria-hidden="true">${d("chevron",{size:14})}</span>
    </button>
  `;const t=s.querySelector("[data-select-trigger]");t.addEventListener("click",a=>{if(a.stopPropagation(),p.popover&&p.trigger===t){T();return}Ae({trigger:t,options:y.map(o=>({value:o,label:_[o].label,summary:_[o].summary})),selected:s.dataset.value||"easy",onSelect:o=>e(o)})})}function Ie(e){const s=i.difficultyHost;s.dataset.value=e,s.querySelector("[data-select-value]").textContent=_[e].label}function Ae({trigger:e,options:s,selected:t,onSelect:a}){T();const o=document.createElement("div");o.className="popover",o.dataset.popover="",o.innerHTML=s.map(n=>`
    <button class="popover__option ${n.value===t?"popover__option--active":""}" type="button" data-option="${n.value}">
      <span class="popover__check" aria-hidden="true">${d("check",{size:14})}</span>
      <span class="popover__copy">
        <strong>${n.label}</strong>
        <small>${n.summary||""}</small>
      </span>
    </button>
  `).join(""),document.body.append(o),document.body.classList.add("has-popover"),P(o,e),p={trigger:e,onSelect:a,popover:o,onResize:()=>P(o,e),onDocClick:n=>{!o.contains(n.target)&&!e.contains(n.target)&&T()},onKey:n=>{n.key==="Escape"&&T()}},o.addEventListener("click",n=>{const r=n.target.closest("[data-option]");if(r===null)return;const m=r.dataset.option;T(),a(m)}),window.addEventListener("resize",p.onResize),window.addEventListener("scroll",p.onResize,!0),document.addEventListener("click",p.onDocClick),document.addEventListener("keydown",p.onKey),e.setAttribute("aria-expanded","true"),requestAnimationFrame(()=>o.classList.add("popover--open"))}function T(){if(!p.popover)return;const{popover:e,trigger:s}=p;e.classList.remove("popover--open"),s.setAttribute("aria-expanded","false"),window.removeEventListener("resize",p.onResize),window.removeEventListener("scroll",p.onResize,!0),document.removeEventListener("click",p.onDocClick),document.removeEventListener("keydown",p.onKey),setTimeout(()=>{e.remove(),document.body.classList.remove("has-popover")},160),p={trigger:null,onSelect:null}}function P(e,s){const t=s.getBoundingClientRect(),a=8;e.style.minWidth=`${Math.max(220,t.width)}px`,e.style.visibility="hidden",e.style.left="0",e.style.top="0";const o=e.getBoundingClientRect();let n=t.bottom+a,r=t.left;n+o.height>window.innerHeight-8&&(n=t.top-a-o.height),r+o.width>window.innerWidth-8&&(r=window.innerWidth-8-o.width),r<8&&(r=8),e.style.left=`${Math.max(8,r)}px`,e.style.top=`${Math.max(8,n)}px`,e.style.visibility="visible"}function qe(){return`<span class="cell__icon cell__icon--flag">${d("flag",{size:16,stroke:2.4})}</span>`}function Oe(){return`<span class="cell__icon cell__icon--mine">${d("bomb",{size:16,stroke:2.4})}</span>`}function ee(e){return`${e.difficulty}-${e.settings.rows}x${e.settings.columns}`}function te(e,s){return`${e}:${s}`}function H(e=K){const s=_[e];return{difficulty:e,settings:s,board:re(s.rows,s.columns),status:u.idle,isFirstMove:!0,moves:0,flagsLeft:s.mines,elapsedSeconds:0}}let l=H(),z=Me(),$=null;function Fe(){Ee(),Ce({onCellOpen:Ge,onCellFlag:Be,onNewGame:se,onContinueGame:De,onSaveGame:Re,onRandomGame:je,onOpenScores:Ue,onToggleTheme:We,onToggleSound:Ke,onDifficultyChange:Pe}),Q(z),X(),h(l)}function Ge(e,s){if(l.status===u.won||l.status===u.lost)return;const t=l.board[e][s];if(t.status===c.flagged||t.status===c.opened)return;Je(e,s),l.moves+=1;const a=me(l.board,t);if(l.flagsLeft+=a.removedFlags,t.hasMine){Ve();return}if(he(l.board)===0){Ye();return}N("reveal"),O(l),h(l,{fresh:!1})}function Be(e,s){if(l.status===u.won||l.status===u.lost)return;const t=l.board[e][s];if(t.status===c.opened)return;if(t.status===c.hidden&&l.flagsLeft===0){g("No flags left.","warn");return}const a=t.status===c.flagged,o=ge(t);l.flagsLeft+=o,N(a?"unflag":"flag"),O(l),h(l,{fresh:!1})}function se(){M(),E(),$=null,l=H(l.difficulty),h(l)}function De(){const e=ye();if(e===null){g("Nothing to continue yet.","warn");return}if(typeof e.savedAt=="number"&&e.savedAt===$&&l.status===e.status&&l.moves===e.moves){g("Already at the saved checkpoint.","info");return}M(),l=e,$=typeof e.savedAt=="number"?e.savedAt:null,l.status===u.playing&&Y(ae),h(l),g("Saved game restored.","info")}function Re(){if(l.status===u.idle){g("Open at least one cell before saving.","warn");return}l.savedAt=Date.now(),$=l.savedAt,ve(l),g("Game saved.","info")}function je(){M(),E(),$=null;let e=y[Math.floor(Math.random()*y.length)];e===l.difficulty&&y.length>1&&(e=y[(y.indexOf(e)+1)%y.length]),l=H(e),h(l)}function Pe(e){e===l.difficulty&&l.status===u.idle||(M(),E(),$=null,l=H(e||K),h(l))}function We(){z=z===v.dark?v.light:v.dark,Se(z),Q(z)}function Ke(){$e(),X()}function Ue(){Qe()}function Je(e,s){l.isFirstMove&&(fe(l.board,l.settings.mines,e,s),l.isFirstMove=!1,l.status=u.playing,Y(ae))}function ae(){l.elapsedSeconds+=1,O(l),V(l)}function Ye(){l.status=u.won,M(),E(),be({difficulty:l.difficulty,seconds:l.elapsedSeconds,moves:l.moves}),N("win"),R(!0),h(l,{fresh:!1}),setTimeout(()=>R(!1),1400),setTimeout(()=>ne("won"),220)}function Ve(){l.status=u.lost,M(),E(),l.board.flat().forEach(e=>{e.hasMine&&(e.status=c.opened)}),N("lose"),j(!0),h(l,{fresh:!1}),setTimeout(()=>j(!1),600),setTimeout(()=>ne("lost"),220)}function ne(e){const s=e==="won",t=s?"Mission complete":"Mission failed",a=s?"Field cleared.":"Boom — wrong tile.",o=document.createElement("div");o.className="result",o.innerHTML=`
    <div class="result__hero ${s?"result__hero--win":"result__hero--lose"}">
      <span class="result__icon">${d(s?"trophy":"bomb",{size:26})}</span>
      <span class="result__time mono">${F(l.elapsedSeconds)}</span>
    </div>
    <p class="result__copy">${s?`You found all mines in <strong>${l.elapsedSeconds} seconds</strong> and <strong>${l.moves} moves</strong>.`:"You stepped on a mine. Try the same field again or pick a new mission."}</p>
    <div class="result__meta">
      <div><span>${d("shield",{size:12})} Mission</span><strong>${_[l.difficulty].label}</strong></div>
      <div><span>${d("move",{size:12})} Moves</span><strong>${l.moves}</strong></div>
      <div><span>${d("flag",{size:12})} Flags left</span><strong>${l.flagsLeft}</strong></div>
    </div>
  `;const n=document.createElement("div");n.className="result__actions",n.innerHTML=`
    <button class="pill pill--ghost" data-modal-close type="button">Close</button>
    <button class="pill pill--primary" data-result-newgame type="button">${d("refresh",{size:16})}<span>New game</span></button>
  `,Z({title:a,eyebrow:t,body:o,footer:n}).querySelector("[data-result-newgame]").addEventListener("click",()=>{x(),se()})}function Qe(){const e=J(),s=document.createElement("div");s.className="scoreboard",e.length===0?s.innerHTML=`
      <div class="scoreboard__empty">
        <span class="scoreboard__icon">${d("trophy",{size:28})}</span>
        <p>No wins yet — your fastest defuses will live here.</p>
      </div>
    `:s.innerHTML=`
      <div class="scoreboard__head">
        <span>#</span><span>Mission</span><span>Time</span><span>Moves</span>
      </div>
      <ul class="scoreboard__list">
        ${e.map((a,o)=>{var n,r;return`
          <li class="scoreboard__row scoreboard__row--rank-${o+1}">
            <span class="scoreboard__rank">${Xe(o+1)}</span>
            <span class="scoreboard__mission">
              <span class="dot dot--${a.difficulty}" aria-hidden="true"></span>
              ${((n=_[a.difficulty])==null?void 0:n.label)||a.difficulty}
              <small>${((r=_[a.difficulty])==null?void 0:r.short)||""}</small>
            </span>
            <span class="scoreboard__time mono">${F(a.seconds)}</span>
            <span class="scoreboard__moves">${a.moves}</span>
          </li>
        `}).join("")}
      </ul>
    `;const t=document.createElement("div");t.className="scoreboard__actions",t.innerHTML=`
    <button class="pill pill--ghost" data-clear-scores type="button">Clear scores</button>
    <button class="pill pill--primary" data-modal-close type="button">Done</button>
  `,Z({eyebrow:`${d("trophy",{size:12})} High scores`,title:"Top 10 fastest defuses",body:s,footer:t}),t.querySelector("[data-clear-scores]").addEventListener("click",()=>{_e(),x(),g("High scores cleared.","info")})}function Xe(e){return e===1?"🥇":e===2?"🥈":e===3?"🥉":e}Fe();let I=0,W=0;window.addEventListener("resize",()=>{I===0&&(I=requestAnimationFrame(()=>{I=0,document.body.classList.add("is-resizing")})),clearTimeout(W),W=setTimeout(()=>{document.body.classList.remove("is-resizing")},160)},{passive:!0});
