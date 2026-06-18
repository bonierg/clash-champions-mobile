const tabs = [
  { id: "episode", label: "Episode", icon: "play" },
  { id: "special", label: "Special\nContent", icon: "ticket" },
  { id: "champions", label: "Champions", icon: "users" },
  { id: "games", label: "Games", icon: "gamepad" },
  { id: "collectibles", label: "Collectibles", icon: "image" },
];

const episodes = [
  { number: "3", points: "+400", title: "Title Episode" },
  { number: "2", points: "+400", title: "Title Episode" },
  { number: "1", points: "+400", title: "Title Episode" },
];

const games = [
  {
    id: "extreme-addition",
    title: "Extreme Addition",
    image: "assets/game-extreme.png",
    description: "Jumlahkan semua bilangan yang ada secepat mungkin!",
  },
  {
    id: "number-chains",
    title: "Number Chains",
    image: "assets/game-number.png",
    description: "Jumlahkan semua bilangan yang ada secepat mungkin!",
  },
];

const rounds = [
  {
    numbers: [
      [3, 8, 2, 7, 5, 6, 9, 8, 3, 4],
      [5, 4, 8, 4, 7, 9, 0, 6, 5, 7],
      [9, 7, 3, 8, 7, 2, 2, 2, 5, 8],
      [3, 3, 6, 4, 0, 6, 3, 8, 6, 3],
      [0, 2, 9, 0, 6, 2, 3, 1, 3, 6],
    ],
  },
  {
    numbers: [
      [4, 6, 1, 8, 2, 9, 7, 5, 3, 2],
      [7, 0, 5, 4, 8, 1, 6, 9, 2, 8],
      [3, 9, 2, 5, 7, 4, 6, 0, 1, 5],
      [8, 3, 6, 2, 9, 7, 4, 5, 8, 1],
      [2, 5, 7, 3, 1, 8, 9, 4, 6, 0],
    ],
  },
  {
    numbers: [
      [9, 1, 6, 3, 8, 2, 5, 7, 4, 0],
      [2, 8, 4, 9, 6, 3, 1, 5, 7, 8],
      [5, 7, 0, 2, 4, 8, 9, 6, 3, 1],
      [6, 3, 8, 7, 5, 1, 2, 4, 0, 9],
      [4, 9, 2, 5, 7, 6, 8, 3, 1, 2],
    ],
  },
].map((round) => ({
  ...round,
  answer: round.numbers.flat().reduce((total, number) => total + number, 0),
}));

let activeTab = "episode";
let activeScreen = "tabs";
let gameState = freshGameState();

const app = document.querySelector("#app");
const highScoreKey = "extremeAdditionHighScore";
const championScores = [
  ["VANNES", 170],
  ["DEO", 160],
];
const dummyScores = [
  ["ALYA", 145],
  ["BIMA", 132],
  ["CITRA", 121],
  ["DANU", 118],
  ["ELSA", 109],
  ["FARIS", 98],
  ["GITA", 92],
  ["HANA", 87],
];
let instructionLoading = 0;
let instructionReady = false;
let loadingTimer = null;

function icon(name) {
  const icons = {
    play: `<svg viewBox="0 0 24 24"><path d="M8 5.4v13.2L18.6 12 8 5.4Z" /></svg>`,
    ticket: `<svg viewBox="0 0 24 24"><path d="M4 8.2 20 5l.8 4.1a2.2 2.2 0 0 0 .7 4.3l.8 4.1-16 3.2-.8-4.1a2.2 2.2 0 0 0-.7-4.3L4 8.2Zm7.2 1.1.4 2m.5 2.7.4 2" /></svg>`,
    users: `<svg viewBox="0 0 24 24"><path d="M16 10a4 4 0 1 0-3.3-6.2M7.5 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-5 8.2c.8-3.1 2.8-4.7 5-4.7s4.2 1.6 5 4.7M13 18.4c.8-1.9 2.3-2.9 4-2.9 2.1 0 3.8 1.4 4.5 4.3" /></svg>`,
    gamepad: `<svg viewBox="0 0 24 24"><path d="M7.3 9h9.4a4.2 4.2 0 0 1 4 3.1l.8 3.1a2.7 2.7 0 0 1-4.6 2.5l-1.7-1.9H8.8l-1.7 1.9a2.7 2.7 0 0 1-4.6-2.5l.8-3.1a4.2 4.2 0 0 1 4-3.1Zm.2 2.8v3.4m-1.7-1.7h3.4M16 12.3h.1m2.1 2h.1" /></svg>`,
    image: `<svg viewBox="0 0 24 24"><path d="m4 5 14-2 2 14-14 2L4 5Zm2.6 10.1 3-4.3 3.1 2.6 1.5-2.1 3.5 3.4M14.5 7.5h.1" /></svg>`,
    gift: `<svg viewBox="0 0 24 24"><path d="M4 10h16v10H4V10Zm8 0v10M3 6h18v4H3V6Zm6 0c-1.8 0-3-1-3-2.2C6 2.8 6.8 2 7.8 2 9.5 2 11 6 11 6H9Zm6 0c1.8 0 3-1 3-2.2 0-1-.8-1.8-1.8-1.8C14.5 2 13 6 13 6h2Z" /></svg>`,
    mail: `<svg viewBox="0 0 24 24"><path d="M4 6h16v12H4V6Zm1.4 1.4 6.6 5 6.6-5" /></svg>`,
    chevron: `<svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" /></svg>`,
    clock: `<svg viewBox="0 0 24 24"><path d="M12 7v5l3 1.8M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`,
    back: `<svg viewBox="0 0 24 24"><path d="M19 12H5m7-7-7 7 7 7" /></svg>`,
  };

  return icons[name] || "";
}

function render() {
  const detailScreen = activeScreen !== "tabs";
  app.className = `app-shell ${detailScreen ? "landscape-shell" : ""}`;
  app.innerHTML = `
    <section class="phone-frame ${detailScreen ? "detail-frame" : ""}">
      <div class="screen-content ${screenClass()}">
        ${renderScreen()}
      </div>
      ${detailScreen ? "" : renderTabbar()}
    </section>
  `;

  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      window.clearInterval(loadingTimer);
      activeTab = button.dataset.tab;
      activeScreen = "tabs";
      render();
    });
  });

  document.querySelectorAll("[data-open-game]").forEach((button) => {
    button.addEventListener("click", () => {
      activeScreen = "extreme-start";
      render();
    });
  });

  document.querySelectorAll("[data-instructions]").forEach((button) => {
    button.addEventListener("click", () => {
      beginInstructionLoading();
      activeScreen = "extreme-instructions";
      render();
    });
  });

  document.querySelectorAll("[data-back]").forEach((button) => {
    button.addEventListener("click", () => {
      window.clearInterval(loadingTimer);
      activeScreen = "tabs";
      activeTab = "games";
      render();
    });
  });

  document.querySelectorAll("[data-ready]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!instructionReady) return;
      gameState = freshGameState();
      activeScreen = "extreme-game";
      render();
    });
  });

  document.querySelectorAll("[data-show-answer]").forEach((button) => {
    button.addEventListener("click", () => {
      gameState.mode = "answer";
      gameState.feedback = "";
      render();
    });
  });

  document.querySelectorAll("[data-show-question]").forEach((button) => {
    button.addEventListener("click", () => {
      gameState.mode = "question";
      gameState.feedback = "";
      render();
    });
  });

  document.querySelectorAll("[data-key]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.key;
      if (value === "clear") {
        gameState.input = "";
        gameState.feedback = "";
      } else if (value === "submit") {
        submitAnswer();
        return;
      } else if (gameState.input.length < 4) {
        gameState.input += value;
        gameState.feedback = "";
      }
      render();
    });
  });

  document.querySelectorAll("[data-restart-game]").forEach((button) => {
    button.addEventListener("click", () => {
      gameState = freshGameState();
      activeScreen = "extreme-game";
      render();
    });
  });

  document.querySelectorAll("[data-surrender-open]").forEach((button) => {
    button.addEventListener("click", () => {
      gameState.confirmSurrender = true;
      render();
    });
  });

  document.querySelectorAll("[data-surrender-cancel]").forEach((button) => {
    button.addEventListener("click", () => {
      gameState.confirmSurrender = false;
      render();
    });
  });

  document.querySelectorAll("[data-surrender-confirm]").forEach((button) => {
    button.addEventListener("click", () => {
      gameState.surrendered = true;
      gameState.confirmSurrender = false;
      finishExtremeGame();
    });
  });
}

function screenClass() {
  if (activeScreen === "extreme-start") return "extreme-screen extreme-start-screen";
  if (activeScreen === "extreme-instructions") return "extreme-screen extreme-instruction-screen";
  if (activeScreen === "extreme-game") return "extreme-screen extreme-play-screen";
  if (activeScreen === "extreme-result") return "extreme-screen extreme-result-screen";
  return activeTab === "games" ? "games-screen" : "";
}

function renderScreen() {
  if (activeScreen === "extreme-start") return renderExtremeStart();
  if (activeScreen === "extreme-instructions") return renderExtremeInstructions();
  if (activeScreen === "extreme-game") return renderExtremeGame();
  if (activeScreen === "extreme-result") return renderExtremeResult();
  if (activeTab === "episode") return renderEpisodePage();
  if (activeTab === "games") return renderGamesPage();
  return renderEmptyState();
}

function freshGameState() {
  return {
    roundIndex: 0,
    mode: "question",
    input: "",
    score: 0,
    mistakes: 0,
    feedback: "",
    completed: [],
    confirmSurrender: false,
    surrendered: false,
  };
}

function getHighScore() {
  const saved = Number(window.localStorage.getItem(highScoreKey));
  return Number.isFinite(saved) && saved > 0 ? saved : null;
}

function saveHighScore(score) {
  const current = getHighScore() || 0;
  if (score > current) window.localStorage.setItem(highScoreKey, String(score));
}

function beginInstructionLoading() {
  window.clearInterval(loadingTimer);
  instructionLoading = 0;
  instructionReady = false;
  loadingTimer = window.setInterval(() => {
    instructionLoading = Math.min(100, instructionLoading + 4);
    const bar = document.querySelector("[data-loading-bar]");
    const label = document.querySelector("[data-loading-label]");
    const button = document.querySelector("[data-ready]");
    if (bar) bar.style.setProperty("--progress", `${instructionLoading}%`);
    if (label) label.textContent = instructionLoading >= 100 ? "I'M READY" : `LOADING ${instructionLoading}%`;
    if (instructionLoading >= 100) {
      instructionReady = true;
      window.clearInterval(loadingTimer);
      loadingTimer = null;
      if (button) button.removeAttribute("aria-disabled");
    }
  }, 90);
}

function renderEpisodePage() {
  return `
    <div class="hero-area">
      <button class="back-button" type="button" aria-label="Kembali">${icon("back")}</button>
    </div>

    <section class="reward-card" aria-label="Cashback">
      <div class="cashback">DISKON S.D.<strong>57%</strong><span>CASHBACK</span></div>
      <div class="reward-copy">
        <h2>Dapatkan Kejutan Ekstra</h2>
        <p>Habis dalam <span class="timer-badge">${icon("clock")} 02:32:40</span></p>
      </div>
      <button class="claim-button" type="button">Klaim</button>
    </section>

    <section class="episode-panel">
      <div class="segment-control" role="tablist" aria-label="Filter episode">
        <button class="active" type="button">Semua Episode</button>
        <button type="button">${icon("gift")} Spesial Untukmu</button>
      </div>

      <button class="message-card" type="button">
        <span>${icon("mail")}</span>
        <strong>Baca surat dari Champions yang sudah pulang dari Clash of Champions S3</strong>
        <i>${icon("chevron")}</i>
      </button>

      <div class="episode-list">
        ${episodes.map((episode) => renderEpisode(episode)).join("")}
      </div>
    </section>
  `;
}

function renderEpisode(episode) {
  return `
    <article class="episode-card">
      <img src="assets/episode-thumb.png" alt="" />
      <div class="episode-meta">
        <div class="badges">
          <span class="episode-badge">Eps.${episode.number}</span>
          <span class="point-badge">${episode.points} <b>★</b></span>
        </div>
        <h3>${episode.title}</h3>
      </div>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud</p>
    </article>
  `;
}

function renderGamesPage() {
  return `
    <header class="games-header">
      <h1>Games</h1>
      <div class="partner-lockup">
        <span>ADAPTO<b>X</b></span>
        <i>X</i>
        <strong>CLASH OF<br />CHAMPIONS</strong>
      </div>
      <h2>Rasakan serunya tantangan yang dihadapi Champions!</h2>
    </header>

    <section class="game-list">
      ${games.map((game) => renderGameCard(game)).join("")}
    </section>
  `;
}

function renderGameCard(game) {
  const isExtreme = game.id === "extreme-addition";
  return `
    <article class="game-card" ${isExtreme ? 'data-open-game role="button" tabindex="0"' : ""}>
      <img src="${game.image}" alt="${game.title}" />
      <div class="game-body">
        <p>${game.description}</p>
        <button class="play-button" type="button" ${isExtreme ? "data-open-game" : ""}>PLAY</button>
      </div>
    </article>
  `;
}

function renderExtremeStart() {
  const highScore = getHighScore();
  return `
    <section class="figma-game-frame" aria-label="Extreme Addition start screen">
      <img src="assets/extreme-game-figma.png" alt="Extreme Addition game start screen" />
      <button class="visible-landscape-back" type="button" data-back aria-label="Kembali ke Games">${icon("back")}</button>
      <div class="start-high-score" aria-label="High score kamu">
        <span>HIGH SCORE-MU:</span>
        <strong>${highScore ?? "-"}</strong>
      </div>
      <button class="figma-hit figma-back-hit" type="button" data-back aria-label="Kembali ke Games"></button>
      <button class="figma-hit figma-play-hit" type="button" data-instructions aria-label="Play Extreme Addition"></button>
    </section>
  `;
}

function renderExtremeInstructions() {
  const leaderboard = [...championScores, ...dummyScores];
  return `
    <section class="figma-game-frame" aria-label="Extreme Addition instruction screen">
      <img src="assets/extreme-instruction-figma.png" alt="Extreme Addition instructions and high score" />
      <button class="figma-hit figma-back-hit" type="button" data-back aria-label="Kembali ke Games"></button>
      <div class="instruction-leaderboard" aria-label="Leaderboard">
        <h2>HIGH SCORE</h2>
        ${leaderboard
          .map(
            ([name, score], index) => `
              <div class="instruction-row ${index < 2 ? "champion" : ""}">
                <span>${index + 1}${rankSuffix(index + 1)}</span>
                <strong>${name}</strong>
                <b>${score}</b>
              </div>
            `,
          )
          .join("")}
      </div>
      <button class="loading-ready ${instructionReady ? "ready" : ""}" type="button" data-ready aria-disabled="${instructionReady ? "false" : "true"}">
        <span data-loading-bar style="--progress:${instructionLoading}%"></span>
        <b data-loading-label>${instructionReady ? "I'M READY" : `LOADING ${instructionLoading}%`}</b>
      </button>
    </section>
  `;
}

function rankSuffix(rank) {
  if (rank === 1) return "st";
  if (rank === 2) return "nd";
  if (rank === 3) return "rd";
  return "th";
}

function renderExtremeGame() {
  const round = rounds[gameState.roundIndex];
  if (gameState.mode === "answer") return renderAnswerScreen(round);
  return renderQuestionScreen(round);
}

function renderQuestionScreen(round) {
  return `
    <section class="gameplay-frame question-mode">
      <button class="close-game-button" type="button" data-surrender-open aria-label="Surrender">×</button>
      <div class="gameplay-panel">
        <div class="crest" aria-hidden="true"></div>
        <div class="gameplay-topline">
          <h1>Jumlahkan bilangan-bilangan berikut!</h1>
          <button class="mode-toggle question-toggle" type="button" data-show-answer>
            <span></span>
            <b>Klik untuk input jawaban</b>
          </button>
        </div>
        <div class="number-grid" aria-label="Daftar angka ronde ${gameState.roundIndex + 1}">
          ${round.numbers.flat().map((number) => `<span>${number}</span>`).join("")}
        </div>
      </div>
      ${renderSurrenderDialog()}
    </section>
  `;
}

function renderAnswerScreen() {
  return `
    <section class="gameplay-frame answer-mode">
      <button class="close-game-button" type="button" data-surrender-open aria-label="Surrender">×</button>
      <div class="gameplay-panel">
        <div class="crest" aria-hidden="true"></div>
        <header class="answer-header">
          <div class="adaptox-small">ADAPTO<b>X</b><span>On Ruangguru App</span></div>
          <button class="mode-toggle answer-toggle" type="button" data-show-question>
            <span></span>
            <b>Klik untuk lihat soal</b>
          </button>
        </header>
        <div class="answer-content">
          <div class="answer-main">
            <h1>RONDE ${gameState.roundIndex + 1}</h1>
            <div class="answer-display ${gameState.feedback ? "has-feedback" : ""}">
              <strong>${gameState.input || "JAWABAN KAMU"}</strong>
            </div>
            <p class="feedback ${gameState.feedback.includes("Benar") ? "correct" : "wrong"}">${gameState.feedback}</p>
            <p class="score-text">SCORE: ${gameState.score}</p>
          </div>
          <div class="keypad" aria-label="Input angka">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => `<button type="button" data-key="${number}">${number}</button>`).join("")}
            <button class="clear-key" type="button" data-key="clear">×</button>
            <button type="button" data-key="0">0</button>
            <button class="submit-key" type="button" data-key="submit">➜</button>
          </div>
        </div>
      </div>
      ${renderSurrenderDialog()}
    </section>
  `;
}

function renderExtremeResult() {
  const maxScore = rounds.length * 100;
  const perfect = gameState.score >= maxScore;
  return `
    <section class="gameplay-frame result-mode">
      <div class="gameplay-panel">
        <div class="crest" aria-hidden="true"></div>
        <div class="result-card">
          <p>EXTREME ADDITION</p>
          <h1>${perfect ? "CHAMPION!" : "SELESAI!"}</h1>
          <strong>${gameState.score}</strong>
          <span>Final Score</span>
          ${gameState.surrendered ? `<em>Kamu surrender di ronde ${gameState.roundIndex + 1}.</em>` : ""}
          <div class="result-stats">
            <div><b>${gameState.completed.length}</b><small>Ronde selesai</small></div>
            <div><b>${gameState.mistakes}</b><small>Jawaban salah</small></div>
          </div>
          <div class="result-actions">
            <button class="extreme-button" type="button" data-restart-game>Main Lagi</button>
            <button class="extreme-button ghost-result-button" type="button" data-back>Games</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderSurrenderDialog() {
  if (!gameState.confirmSurrender) return "";
  return `
    <div class="surrender-backdrop" role="dialog" aria-modal="true" aria-label="Konfirmasi surrender">
      <div class="surrender-dialog">
        <h2>Surrender?</h2>
        <p>Progress akan dihentikan dan kamu langsung masuk ke result page.</p>
        <div>
          <button type="button" data-surrender-cancel>Lanjut Main</button>
          <button type="button" data-surrender-confirm>Ya, Surrender</button>
        </div>
      </div>
    </div>
  `;
}

function finishExtremeGame() {
  saveHighScore(gameState.score);
  activeScreen = "extreme-result";
  render();
}

function submitAnswer() {
  const round = rounds[gameState.roundIndex];
  const guess = Number(gameState.input);

  if (!gameState.input) {
    gameState.feedback = "Masukkan jawaban dulu.";
    render();
    return;
  }

  if (guess === round.answer) {
    gameState.score += 100;
    gameState.completed.push({ round: gameState.roundIndex + 1, score: gameState.score });
    gameState.feedback = "Benar! Lanjut ronde berikutnya.";
    gameState.input = "";

    if (gameState.roundIndex >= rounds.length - 1) {
      finishExtremeGame();
      return;
    } else {
      gameState.roundIndex += 1;
      gameState.mode = "question";
    }
  } else {
    gameState.score = Math.max(0, gameState.score - 25);
    gameState.mistakes += 1;
    gameState.feedback = "Jawaban salah. Coba hitung lagi!";
    gameState.input = "";
  }

  render();
}

function renderEmptyState() {
  const current = tabs.find((tab) => tab.id === activeTab);
  return `
    <div class="simple-top">
      <button class="back-button" type="button" aria-label="Kembali">${icon("back")}</button>
      <h1>${current.label.replace("\n", " ")}</h1>
    </div>
    <section class="empty-state">
      <div class="empty-icon">${icon(current.icon)}</div>
      <h2>Belum ada konten</h2>
      <p>Halaman ini sedang disiapkan. Untuk sekarang, Episode dan Games sudah bisa dibuka.</p>
    </section>
  `;
}

function renderTabbar() {
  return `
    <nav class="tabbar" aria-label="Navigasi utama">
      ${tabs
        .map(
          (tab) => `
            <button class="tab-item ${tab.id === activeTab ? "active" : ""}" type="button" data-tab="${tab.id}" aria-label="${tab.label.replace("\n", " ")}">
              <span>${icon(tab.icon)}</span>
              <small>${tab.label.replace("\n", "<br />")}</small>
            </button>
          `,
        )
        .join("")}
    </nav>
  `;
}

render();
