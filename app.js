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
    title: "Extreme Addition",
    image: "assets/game-extreme.png",
    description: "Jumlahkan semua bilangan yang ada secepat mungkin!",
  },
  {
    title: "Number Chains",
    image: "assets/game-number.png",
    description: "Jumlahkan semua bilangan yang ada secepat mungkin!",
  },
];

let activeTab = "episode";

const app = document.querySelector("#app");

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
  app.innerHTML = `
    <section class="phone-frame">
      <div class="screen-content ${activeTab === "games" ? "games-screen" : ""}">
        ${renderPage()}
      </div>
      ${renderTabbar()}
    </section>
  `;

  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      activeTab = button.dataset.tab;
      render();
    });
  });

  document.querySelectorAll("[data-play]").forEach((button) => {
    button.addEventListener("click", () => {
      button.textContent = "COMING SOON";
      window.setTimeout(() => {
        button.textContent = "PLAY";
      }, 1200);
    });
  });
}

function renderPage() {
  if (activeTab === "episode") return renderEpisodePage();
  if (activeTab === "games") return renderGamesPage();
  return renderEmptyState();
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
  return `
    <article class="game-card">
      <img src="${game.image}" alt="${game.title}" />
      <div class="game-body">
        <p>${game.description}</p>
        <button class="play-button" type="button" data-play>PLAY</button>
      </div>
    </article>
  `;
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
