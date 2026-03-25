(() => {
  const VIEW = { w: 720, h: 1280 };

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;

  canvas.width = VIEW.w;
  canvas.height = VIEW.h;

  const overlay = document.getElementById("overlay");
  const hud = document.getElementById("hud");
  const pauseBtn = document.getElementById("pauseBtn");
  const hudScore = document.getElementById("hudScore");
  const hudLives = document.getElementById("hudLives");
  const hudTime = document.getElementById("hudTime");
  const hudLevel = document.getElementById("hudLevel");
  const modeGrid = document.getElementById("modeGrid");
  const levelGrid = document.getElementById("levelGrid");
  const levelModeText = document.getElementById("levelModeText");
  const highscoreTables = document.getElementById("highscoreTables");
  const introTitle = document.getElementById("introTitle");
  const introSubtitle = document.getElementById("introSubtitle");
  const introMode = document.getElementById("introMode");
  const introTarget = document.getElementById("introTarget");
  const finishTitle = document.getElementById("finishTitle");
  const finishText = document.getElementById("finishText");
  const nameForm = document.getElementById("nameForm");
  const nameInput = document.getElementById("nameInput");

  const music = new Audio("assets/audio/pixel-juice-power-up.mp3");
  music.loop = true;
  music.preload = "auto";
  music.volume = 0.55;

  const HIGHSCORE_KEY = "fruit-brick-breaker-highscores-v2";
  const PROGRESS_KEY = "fruit-brick-breaker-progress-v2";

  const FRUIT_CYCLE = [
    "apple",
    "orange",
    "lemon",
    "pear",
    "peach",
    "plum",
    "cherry",
    "grape",
    "kiwi",
    "banana",
    "pineapple",
    "watermelon",
    "melon",
    "strawberry",
    "berry",
  ];

  const FRUIT_POINTS = {
    apple: 85,
    orange: 80,
    lemon: 75,
    pear: 90,
    peach: 92,
    plum: 95,
    cherry: 98,
    grape: 88,
    kiwi: 82,
    banana: 105,
    pineapple: 112,
    watermelon: 118,
    melon: 110,
    strawberry: 96,
    berry: 84,
  };

  const FRUIT_BASE_SIZE = {
    apple: 52,
    orange: 52,
    lemon: 50,
    pear: 54,
    peach: 52,
    plum: 52,
    cherry: 48,
    grape: 50,
    kiwi: 50,
    banana: 56,
    pineapple: 58,
    watermelon: 56,
    melon: 54,
    strawberry: 52,
    berry: 48,
  };

  const MODES = {
    classic: {
      name: "Classic",
      description: "3 lives. Clear all five levels.",
      lives: 3,
      timeLimit: 0,
      scoreMultiplier: 1,
      speedMultiplier: 1,
    },
    timeAttack: {
      name: "Time Attack",
      description: "120 seconds. Bonus time for each clear.",
      lives: 2,
      timeLimit: 120,
      scoreMultiplier: 1.35,
      speedMultiplier: 1.08,
    },
    zen: {
      name: "Zen",
      description: "No fail state. Relaxed speed and steady flow.",
      lives: Number.POSITIVE_INFINITY,
      timeLimit: 0,
      scoreMultiplier: 0.9,
      speedMultiplier: 0.94,
    },
  };

  function row(y, x, items, spacing = 48, scale = 1) {
    return { y, x, items, spacing, scale };
  }

  function fruit(x, y, name, scale = 1) {
    return { x, y, name, scale };
  }

  const BASE_LAYOUT = {
    rows: [
      row(144, 18, [
        "pineapple",
        "pineapple",
        "pineapple",
        "apple",
        "apple",
        "apple",
        "pineapple",
        "pineapple",
        "pineapple",
        "orange",
        "orange",
        "orange",
        "lemon",
        "lemon",
        "lemon",
      ], 46, 1),
      row(232, 84, [
        "banana",
        "banana",
        "banana",
        "grape",
        "grape",
        "grape",
        "pear",
        "pear",
        "pear",
        "watermelon",
        "watermelon",
        "watermelon",
      ], 48, 1),
      row(314, 22, [
        "berry",
        "pear",
        "pear",
        "orange",
        "orange",
        "orange",
        "grape",
        "grape",
        "pear",
        "strawberry",
        "strawberry",
        "strawberry",
        "watermelon",
        "watermelon",
        "watermelon",
      ], 46, 1),
      row(396, 274, ["lemon", "lemon", "lemon"], 52, 1.06),
      row(492, 18, ["lemon", "lemon", "orange", "orange", "orange"], 48, 1),
      row(492, 348, ["orange", "orange", "orange"], 48, 1),
      row(492, 560, ["apple", "apple", "apple", "banana", "banana"], 46, 1),
      row(584, 188, ["plum", "plum", "plum"], 52, 1),
      row(584, 392, ["pear", "pear", "pear"], 52, 1),
      row(676, 92, ["strawberry", "strawberry", "orange"], 52, 1),
      row(676, 422, ["pineapple", "pineapple"], 54, 1),
    ],
    extras: [
      fruit(180, 790, "pineapple", 1),
      fruit(438, 894, "berry", 1),
      fruit(206, 956, "lemon", 1),
      fruit(638, 1006, "apple", 1),
      fruit(52, 1108, "pear", 0.95),
      fruit(320, 1172, "watermelon", 1.02),
      fruit(598, 1168, "plum", 1),
    ],
  };

  function shiftFruit(name, shift) {
    const index = FRUIT_CYCLE.indexOf(name);
    if (index === -1) {
      return name;
    }
    return FRUIT_CYCLE[(index + shift) % FRUIT_CYCLE.length];
  }

  function shiftedLayout(label, shift) {
    return {
      name: label,
      rows: BASE_LAYOUT.rows.map((line) => ({
        ...line,
        items: line.items.map((item) => (item ? shiftFruit(item, shift) : item)),
      })),
      extras: BASE_LAYOUT.extras.map((item) => ({
        ...item,
        name: shiftFruit(item.name, shift),
      })),
    };
  }

  const LEVELS = [
    shiftedLayout("Sky Parade", 0),
    shiftedLayout("Berry Breeze", 3),
    shiftedLayout("Sun Orchard", 6),
    shiftedLayout("Tropical Drift", 9),
    shiftedLayout("Final Orchard", 12),
  ];

  const fruitImages = Object.fromEntries(
    FRUIT_CYCLE.map((name) => {
      const img = new Image();
      img.src = `assets/fruits/${name}.svg`;
      return [name, img];
    })
  );

  const state = {
    phase: "menu",
    mode: "classic",
    levelIndex: 0,
    score: 0,
    lives: 3,
    timer: 0,
    unlockedClassic: 0,
    highscores: { classic: [], timeAttack: [], zen: [] },
    pendingResult: null,
    bricks: [],
    paddle: {
      x: VIEW.w / 2 - 86,
      y: VIEW.h - 92,
      w: 172,
      h: 30,
      speed: 780,
    },
    ball: {
      x: VIEW.w / 2,
      y: VIEW.h - 107,
      r: 12,
      vx: 0,
      vy: 0,
      attached: true,
    },
    keys: { left: false, right: false },
  };

  let lastFrame = performance.now();

  const screens = Array.from(document.querySelectorAll(".screen"));

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function playMusic() {
    if (!music.paused) {
      return;
    }

    music.play().catch(() => {
      // Browsers may block autoplay until the first user gesture.
    });
  }

  function pauseMusic(reset = false) {
    music.pause();
    if (reset) {
      music.currentTime = 0;
    }
  }

  function loadProgress() {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      if (Number.isInteger(parsed.unlockedClassic)) {
        state.unlockedClassic = clamp(parsed.unlockedClassic, 0, LEVELS.length - 1);
      }
    } catch (_error) {
      state.unlockedClassic = 0;
    }
  }

  function saveProgress() {
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({
        unlockedClassic: state.unlockedClassic,
      })
    );
  }

  function loadHighscores() {
    const raw = localStorage.getItem(HIGHSCORE_KEY);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      for (const key of Object.keys(state.highscores)) {
        if (Array.isArray(parsed[key])) {
          state.highscores[key] = parsed[key]
            .filter((entry) => entry && typeof entry.score === "number")
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
        }
      }
    } catch (_error) {
      state.highscores = { classic: [], timeAttack: [], zen: [] };
    }
  }

  function saveHighscores() {
    localStorage.setItem(HIGHSCORE_KEY, JSON.stringify(state.highscores));
  }

  function sizeForFruit(name, scale = 1) {
    const base = FRUIT_BASE_SIZE[name] ?? 52;
    return {
      w: base * scale,
      h: base * scale,
    };
  }

  function buildLevel(levelIndex) {
    const layout = LEVELS[levelIndex];
    const bricks = [];

    layout.rows.forEach((line, rowIndex) => {
      line.items.forEach((fruitName, itemIndex) => {
        if (!fruitName) {
          return;
        }
        const size = sizeForFruit(fruitName, line.scale);
        bricks.push({
          cx: line.x + itemIndex * line.spacing,
          cy: line.y + Math.sin((rowIndex + itemIndex) * 0.72) * 3,
          w: size.w,
          h: size.h,
          fruit: fruitName,
          scale: line.scale,
          phase: Math.random() * Math.PI * 2,
          points: FRUIT_POINTS[fruitName] ?? 80,
          alive: true,
        });
      });
    });

    layout.extras.forEach((item, index) => {
      const size = sizeForFruit(item.name, item.scale);
      bricks.push({
        cx: item.x,
        cy: item.y + Math.sin(index * 1.15) * 2,
        w: size.w,
        h: size.h,
        fruit: item.name,
        scale: item.scale,
        phase: Math.random() * Math.PI * 2,
        points: FRUIT_POINTS[item.name] ?? 80,
        alive: true,
      });
    });

    return bricks;
  }

  function renderModeCards() {
    modeGrid.innerHTML = "";
    for (const [modeId, mode] of Object.entries(MODES)) {
      const button = document.createElement("button");
      button.className = "mode-card";
      button.dataset.mode = modeId;
      button.innerHTML = `<h3>${mode.name}</h3><p>${mode.description}</p>`;
      modeGrid.appendChild(button);
    }
  }

  function renderLevelButtons() {
    levelGrid.innerHTML = "";
    levelModeText.textContent = `Mode: ${MODES[state.mode].name}`;

    for (let i = 0; i < LEVELS.length; i += 1) {
      const locked = state.mode === "classic" && i > state.unlockedClassic;
      const button = document.createElement("button");
      button.className = `level-btn${locked ? " locked" : ""}`;
      button.dataset.level = String(i);
      button.disabled = locked;
      button.innerHTML = `Level ${i + 1}<small>${LEVELS[i].name}</small>`;
      levelGrid.appendChild(button);
    }
  }

  function renderHighscores() {
    highscoreTables.innerHTML = "";
    const formatter = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" });

    for (const [modeId, mode] of Object.entries(MODES)) {
      const card = document.createElement("section");
      card.className = "hs-card";
      const rows = state.highscores[modeId]
        .map((entry) => {
          const date = entry.date ? formatter.format(new Date(entry.date)) : "-";
          return `<li>${escapeHtml(entry.name)} - ${Math.floor(entry.score)} (L${entry.level}, ${date})</li>`;
        })
        .join("");

      card.innerHTML = `
        <h3>${mode.name}</h3>
        <ol>${rows || "<li>No scores yet</li>"}</ol>
      `;
      highscoreTables.appendChild(card);
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function setScreen(screenId) {
    overlay.classList.add("visible");
    screens.forEach((screen) => {
      screen.classList.toggle("active", screen.id === screenId);
    });
  }

  function hideOverlay() {
    overlay.classList.remove("visible");
    screens.forEach((screen) => screen.classList.remove("active"));
  }

  function formatTime(seconds) {
    const value = Math.max(0, Math.ceil(seconds));
    const mm = String(Math.floor(value / 60)).padStart(2, "0");
    const ss = String(value % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  function renderLives() {
    hudLives.innerHTML = "";

    if (!Number.isFinite(state.lives)) {
      for (let i = 0; i < 3; i += 1) {
        const img = document.createElement("img");
        img.src = "assets/ui/heart.svg";
        img.alt = "";
        hudLives.appendChild(img);
      }

      const badge = document.createElement("span");
      badge.className = "life-infinity";
      badge.textContent = "INF";
      hudLives.appendChild(badge);
      return;
    }

    const count = clamp(Math.ceil(state.lives), 0, 5);
    for (let i = 0; i < count; i += 1) {
      const img = document.createElement("img");
      img.src = "assets/ui/heart.svg";
      img.alt = "";
      hudLives.appendChild(img);
    }
  }

  function updateHUD() {
    hudScore.textContent = String(Math.floor(state.score));
    renderLives();

    if (MODES[state.mode].timeLimit > 0) {
      hudTime.classList.remove("hidden");
      hudTime.textContent = formatTime(state.timer);
    } else {
      hudTime.classList.add("hidden");
    }

    hudLevel.classList.add("hidden");
    pauseBtn.disabled = !(state.phase === "playing" || state.phase === "paused");
  }

  function resetBallAndPaddle() {
    state.paddle.x = VIEW.w / 2 - state.paddle.w / 2;
    state.paddle.y = VIEW.h - 104;
    state.ball.attached = true;
    state.ball.vx = 0;
    state.ball.vy = 0;
    state.ball.x = state.paddle.x + state.paddle.w / 2;
    state.ball.y = state.paddle.y - state.ball.r - 3;
  }

  function launchBall() {
    if (state.phase !== "playing" || !state.ball.attached) {
      return;
    }

    const speed = (430 + state.levelIndex * 18) * MODES[state.mode].speedMultiplier;
    const angle = -Math.PI / 2 + (Math.random() * 0.62 - 0.31);
    state.ball.vx = Math.cos(angle) * speed;
    state.ball.vy = Math.sin(angle) * speed;
    state.ball.attached = false;
  }

  function beginRun(levelIndex) {
    state.pendingResult = null;
    state.score = 0;
    state.levelIndex = levelIndex;
    state.lives = MODES[state.mode].lives;
    state.timer = MODES[state.mode].timeLimit;
    state.bricks = buildLevel(levelIndex);
    resetBallAndPaddle();
    state.phase = "intro";

    introTitle.textContent = `Level ${levelIndex + 1}: ${LEVELS[levelIndex].name}`;
    introSubtitle.textContent = "Get ready for the next fruit wall.";
    introMode.textContent = `Mode: ${MODES[state.mode].name}`;
    introTarget.textContent =
      state.mode === "timeAttack"
        ? "Objective: Clear as fast as possible before time runs out"
        : "Objective: Clear every fruit";

    updateHUD();
    setScreen("screen-level-intro");
  }

  function startLevel() {
    state.phase = "playing";
    hideOverlay();
    hud.classList.remove("hidden");
    playMusic();
    updateHUD();
  }

  function pauseGame() {
    if (state.phase !== "playing") {
      return;
    }
    state.phase = "paused";
    hud.classList.remove("hidden");
    pauseMusic();
    setScreen("screen-pause");
    updateHUD();
  }

  function resumeGame() {
    if (state.phase !== "paused") {
      return;
    }
    state.phase = "playing";
    hideOverlay();
    playMusic();
    updateHUD();
  }

  function quitToMenu() {
    state.phase = "menu";
    state.pendingResult = null;
    state.bricks = [];
    hud.classList.add("hidden");
    pauseMusic(true);
    setScreen("screen-menu");
    updateHUD();
  }

  function qualifiesForHighscore() {
    const list = state.highscores[state.mode];
    if (list.length < 10) {
      return true;
    }
    return state.score > list[list.length - 1].score;
  }

  function addHighscore(name) {
    const list = state.highscores[state.mode];
    list.push({
      name: name.slice(0, 14).toUpperCase() || "PLAYER",
      score: Math.floor(state.score),
      level: state.levelIndex + 1,
      date: new Date().toISOString(),
    });
    list.sort((a, b) => b.score - a.score);
    state.highscores[state.mode] = list.slice(0, 10);
    saveHighscores();
    renderHighscores();
  }

  function showFinishScreen() {
    const result = state.pendingResult || { victory: false, reason: "Run ended" };
    finishTitle.textContent = result.victory ? "Victory" : "Run Over";
    finishText.textContent = `${result.reason}. Final score: ${Math.floor(state.score)}.`;
    setScreen("screen-finish");
  }

  function finishRun(victory, reason) {
    state.phase = "ended";
    state.pendingResult = { victory, reason };
    hud.classList.add("hidden");
    updateHUD();

    if (qualifiesForHighscore()) {
      setScreen("screen-name");
      nameInput.focus();
      nameInput.select();
      return;
    }

    showFinishScreen();
  }

  function clearLevelBonus() {
    state.score += 450 + state.levelIndex * 120;

    if (state.mode === "timeAttack") {
      state.timer = Math.min(state.timer + 6, MODES.timeAttack.timeLimit);
    }
  }

  function onLevelCleared() {
    clearLevelBonus();

    if (state.mode === "classic") {
      if (state.levelIndex === LEVELS.length - 1) {
        finishRun(true, "All levels completed");
        return;
      }

      state.levelIndex += 1;
      if (state.levelIndex > state.unlockedClassic) {
        state.unlockedClassic = state.levelIndex;
        saveProgress();
      }
      beginNextLevel(true);
      return;
    }

    state.levelIndex = (state.levelIndex + 1) % LEVELS.length;
    beginNextLevel(true);
  }

  function beginNextLevel(advanced) {
    state.bricks = buildLevel(state.levelIndex);
    resetBallAndPaddle();
    state.phase = "intro";

    introTitle.textContent = `Level ${state.levelIndex + 1}: ${LEVELS[state.levelIndex].name}`;
    introSubtitle.textContent = advanced ? "Fruit wall cleared. Next one is ready." : "Get ready for the next fruit wall.";
    introMode.textContent = `Mode: ${MODES[state.mode].name}`;
    introTarget.textContent =
      state.mode === "timeAttack"
        ? "Objective: Clear as fast as possible before time runs out"
        : "Objective: Clear every fruit";

    updateHUD();
    setScreen("screen-level-intro");
  }

  function movePaddleTo(clientX) {
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) * (VIEW.w / rect.width);
    state.paddle.x = clamp(x - state.paddle.w / 2, 0, VIEW.w - state.paddle.w);
  }

  function pointerDown(event) {
    if (state.phase !== "playing") {
      return;
    }
    movePaddleTo(event.clientX);
    launchBall();
  }

  function pointerMove(event) {
    if (state.phase !== "playing") {
      return;
    }
    if (event.buttons === 1 || event.pointerType !== "mouse") {
      movePaddleTo(event.clientX);
    }
  }

  function update(dt) {
    if (state.phase !== "playing") {
      return;
    }

    if (MODES[state.mode].timeLimit > 0) {
      state.timer -= dt;
      if (state.timer <= 0) {
        state.timer = 0;
        finishRun(false, "Time up");
        return;
      }
    }

    if (state.keys.left) {
      state.paddle.x -= state.paddle.speed * dt;
    }
    if (state.keys.right) {
      state.paddle.x += state.paddle.speed * dt;
    }
    state.paddle.x = clamp(state.paddle.x, 0, VIEW.w - state.paddle.w);

    if (state.ball.attached) {
      state.ball.x = state.paddle.x + state.paddle.w / 2;
      state.ball.y = state.paddle.y - state.ball.r - 3;
      updateHUD();
      return;
    }

    const ball = state.ball;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    if (ball.x - ball.r <= 0) {
      ball.x = ball.r;
      ball.vx *= -1;
    } else if (ball.x + ball.r >= VIEW.w) {
      ball.x = VIEW.w - ball.r;
      ball.vx *= -1;
    }

    if (ball.y - ball.r <= 0) {
      ball.y = ball.r;
      ball.vy *= -1;
    }

    if (ball.y - ball.r > VIEW.h) {
      if (state.mode === "zen") {
        state.score = Math.max(0, state.score - 60);
        resetBallAndPaddle();
        updateHUD();
        return;
      }

      state.lives -= 1;
      if (state.lives <= 0) {
        finishRun(false, "No lives left");
        return;
      }

      resetBallAndPaddle();
      updateHUD();
      return;
    }

    if (
      ball.vy > 0 &&
      ball.y + ball.r >= state.paddle.y &&
      ball.y - ball.r <= state.paddle.y + state.paddle.h &&
      ball.x >= state.paddle.x &&
      ball.x <= state.paddle.x + state.paddle.w
    ) {
      const offset = (ball.x - (state.paddle.x + state.paddle.w / 2)) / (state.paddle.w / 2);
      const speed = Math.max(420, Math.hypot(ball.vx, ball.vy) * 1.02);
      ball.vx = speed * offset * 0.95;
      ball.vy = -Math.sqrt(Math.max(90, speed * speed - ball.vx * ball.vx));
      ball.y = state.paddle.y - ball.r - 1;
    }

    for (const brick of state.bricks) {
      if (!brick.alive) {
        continue;
      }

      const left = brick.cx - brick.w / 2;
      const top = brick.cy - brick.h / 2;
      const closestX = clamp(ball.x, left, left + brick.w);
      const closestY = clamp(ball.y, top, top + brick.h);
      const dx = ball.x - closestX;
      const dy = ball.y - closestY;

      if (dx * dx + dy * dy > ball.r * ball.r) {
        continue;
      }

      if (Math.abs(dx) > Math.abs(dy)) {
        ball.vx *= -1;
      } else {
        ball.vy *= -1;
      }

      brick.alive = false;
      state.score += brick.points * MODES[state.mode].scoreMultiplier;
      break;
    }

    if (state.bricks.every((brick) => !brick.alive)) {
      onLevelCleared();
    }

    updateHUD();
  }

  function roundRect(x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function drawCloud(x, y, scale, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(255, 255, 255, 0.96)";
    const bumps = [
      [0, 0, 34],
      [28, -12, 28],
      [58, -2, 38],
      [92, 4, 28],
      [121, -8, 24],
    ];
    bumps.forEach(([bx, by, br]) => {
      ctx.beginPath();
      ctx.arc(x + bx * scale, y + by * scale, br * scale, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function drawMountains() {
    const hills = [
      {
        fill: "#b6f0d0",
        points: [
          [0, 1140],
          [96, 980],
          [196, 848],
          [296, 822],
          [402, 902],
          [518, 1038],
          [642, 1136],
          [720, 1120],
        ],
      },
      {
        fill: "#8ddbb9",
        points: [
          [0, 1250],
          [92, 1052],
          [180, 938],
          [268, 910],
          [392, 990],
          [494, 1114],
          [620, 1230],
          [720, 1216],
        ],
      },
      {
        fill: "#6dc49a",
        points: [
          [20, 1280],
          [110, 1108],
          [180, 1038],
          [262, 1032],
          [360, 1100],
          [460, 1218],
          [566, 1280],
          [720, 1280],
        ],
      },
    ];

    hills.forEach((hill) => {
      ctx.beginPath();
      ctx.moveTo(0, VIEW.h);
      hill.points.forEach(([x, y], index) => {
        if (index === 0) {
          ctx.lineTo(x, y);
        } else {
          ctx.quadraticCurveTo((hill.points[index - 1][0] + x) / 2, (hill.points[index - 1][1] + y) / 2, x, y);
        }
      });
      ctx.lineTo(VIEW.w, VIEW.h);
      ctx.closePath();
      ctx.fillStyle = hill.fill;
      ctx.fill();
    });

    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(240, 1028, 86, 42, -0.36, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(492, 1080, 104, 48, 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawFlowers() {
    const flowers = [
      [72, 1220, "#ff7ba0"],
      [118, 1234, "#fff3a3"],
      [202, 1218, "#ff8ac4"],
      [284, 1231, "#ffffff"],
      [348, 1222, "#ff91d0"],
      [442, 1235, "#ffffff"],
      [526, 1218, "#ff83a8"],
      [632, 1234, "#fff0ad"],
    ];

    flowers.forEach(([x, y, color]) => {
      ctx.save();
      ctx.fillStyle = "rgba(72, 130, 30, 0.8)";
      ctx.fillRect(x - 1, y + 8, 2, 11);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x - 4, y + 6, 3, 0, Math.PI * 2);
      ctx.arc(x + 4, y + 6, 3, 0, Math.PI * 2);
      ctx.arc(x, y + 2, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawBackground(time) {
    const sky = ctx.createLinearGradient(0, 0, 0, VIEW.h);
    sky.addColorStop(0, "#d6fbff");
    sky.addColorStop(0.28, "#a0edf9");
    sky.addColorStop(0.7, "#74d8ef");
    sky.addColorStop(1, "#59cbe4");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, VIEW.w, VIEW.h);

    const glow = ctx.createRadialGradient(360, 170, 16, 360, 170, 280);
    glow.addColorStop(0, "rgba(255,255,255,0.56)");
    glow.addColorStop(0.7, "rgba(255,255,255,0.12)");
    glow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, VIEW.w, VIEW.h);

    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 8; i += 1) {
      const y = 100 + i * 130;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.quadraticCurveTo(180, y + 16, 720, y + 28);
      ctx.lineWidth = 12;
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.stroke();
    }
    ctx.restore();

    drawCloud(58, 82, 1.18, 0.92);
    drawCloud(222, 72, 1.05, 0.72);
    drawCloud(424, 54, 1.3, 0.88);
    drawCloud(612, 94, 1.0, 0.74);
    drawCloud(102, 302, 1.12, 0.58);
    drawCloud(306, 270, 1.62, 0.7);
    drawCloud(548, 296, 1.28, 0.58);
    drawCloud(642, 528, 1.08, 0.5);
    drawCloud(356, 690, 1.0, 0.45);
    drawCloud(622, 816, 0.88, 0.42);

    drawMountains();

    ctx.save();
    ctx.globalAlpha = 0.23;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(208, 470, 168, 110, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(520, 470, 182, 116, 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(356, 380, 236, 140, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const groundTop = 1114;
    const grass = ctx.createLinearGradient(0, groundTop, 0, VIEW.h);
    grass.addColorStop(0, "#f2ff6a");
    grass.addColorStop(0.22, "#d7ef46");
    grass.addColorStop(0.8, "#8cc73d");
    grass.addColorStop(1, "#5e8f22");
    ctx.fillStyle = grass;
    ctx.fillRect(0, groundTop, VIEW.w, VIEW.h - groundTop);

    ctx.save();
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(136, 1128, 30, 8, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(574, 1122, 34, 8, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    drawFlowers();
  }

  function drawFruitBrick(brick, time) {
    if (!brick.alive) {
      return;
    }

    const img = fruitImages[brick.fruit];
    if (!img) {
      return;
    }

    const bob = Math.sin(time * 0.0034 + brick.phase) * 3;
    const sway = Math.sin(time * 0.0016 + brick.phase) * 0.045;
    const left = brick.cx - brick.w / 2;
    const top = brick.cy - brick.h / 2;

    ctx.save();
    ctx.translate(brick.cx, brick.cy + bob);
    ctx.rotate(sway);

    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#255d77";
    ctx.beginPath();
    ctx.ellipse(0, brick.h * 0.37, brick.w * 0.26, brick.h * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.drawImage(img, -brick.w / 2, -brick.h / 2, brick.w, brick.h);
    ctx.restore();
  }

  function drawPaddle() {
    const { x, y, w, h } = state.paddle;

    ctx.save();
    const outer = ctx.createLinearGradient(x, y, x, y + h);
    outer.addColorStop(0, "#d5dde4");
    outer.addColorStop(0.52, "#87929d");
    outer.addColorStop(1, "#53606d");
    roundRect(x, y, w, h, h / 2);
    ctx.fillStyle = outer;
    ctx.fill();

    const insetW = w - 28;
    const insetH = h - 10;
    roundRect(x + 14, y + 5, insetW, insetH, insetH / 2);
    ctx.fillStyle = "#171717";
    ctx.fill();

    const shine = ctx.createLinearGradient(x, y, x + w, y);
    shine.addColorStop(0, "rgba(255,255,255,0.18)");
    shine.addColorStop(0.5, "rgba(255,255,255,0.55)");
    shine.addColorStop(1, "rgba(255,255,255,0.12)");
    roundRect(x + 14, y + 5, insetW, insetH, insetH / 2);
    ctx.strokeStyle = shine;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  function drawBall() {
    const { x, y, r } = state.ball;

    ctx.save();
    const glow = ctx.createRadialGradient(x - 3, y - 4, 1, x, y, r * 1.6);
    glow.addColorStop(0, "#ffffff");
    glow.addColorStop(0.4, "#e7f8ff");
    glow.addColorStop(1, "#a9d6e9");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawScene(time) {
    drawBackground(time);

    for (const brick of state.bricks) {
      drawFruitBrick(brick, time);
    }

    drawPaddle();
    drawBall();
  }

  function drawFrame(time) {
    drawScene(time);
  }

  function updateFrame(time) {
    const dt = Math.min(0.033, (time - lastFrame) / 1000);
    lastFrame = time;
    update(dt);
    drawFrame(time);
    requestAnimationFrame(updateFrame);
  }

  function handleAction(action) {
    switch (action) {
      case "play":
      case "modes":
        renderLevelButtons();
        setScreen("screen-modes");
        break;
      case "highscores":
        renderHighscores();
        setScreen("screen-highscores");
        break;
      case "back-menu":
        quitToMenu();
        break;
      case "back-modes":
        renderLevelButtons();
        setScreen("screen-modes");
        break;
      case "back-levels":
        setScreen("screen-levels");
        break;
      case "start-level":
        startLevel();
        break;
      case "play-again":
        renderLevelButtons();
        setScreen("screen-modes");
        break;
      case "resume":
        resumeGame();
        break;
      case "menu-from-pause":
        quitToMenu();
        break;
      default:
        break;
    }
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target) {
      return;
    }

    if (target.dataset.action) {
      handleAction(target.dataset.action);
      return;
    }

    if (target.dataset.mode) {
      state.mode = target.dataset.mode;
      renderLevelButtons();
      setScreen("screen-levels");
      return;
    }

    if (target.dataset.level !== undefined) {
      const levelIndex = Number(target.dataset.level);
      if (Number.isNaN(levelIndex)) {
        return;
      }
      beginRun(levelIndex);
    }
  });

  pauseBtn.addEventListener("click", () => {
    if (state.phase === "playing") {
      pauseGame();
    } else if (state.phase === "paused") {
      resumeGame();
    }
  });

  nameForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addHighscore(nameInput.value.trim());
    nameInput.value = "PLAYER";
    showFinishScreen();
  });

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    if (key === "arrowleft" || key === "a") {
      state.keys.left = true;
    }
    if (key === "arrowright" || key === "d") {
      state.keys.right = true;
    }

    if (key === " " && state.phase === "playing") {
      event.preventDefault();
      launchBall();
    }

    if (key === "p" || key === "escape") {
      if (state.phase === "playing") {
        pauseGame();
      } else if (state.phase === "paused") {
        resumeGame();
      }
    }
  });

  document.addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();

    if (key === "arrowleft" || key === "a") {
      state.keys.left = false;
    }
    if (key === "arrowright" || key === "d") {
      state.keys.right = false;
    }
  });

  canvas.addEventListener("pointerdown", pointerDown);
  canvas.addEventListener("pointermove", pointerMove);
  canvas.addEventListener("click", () => {
    if (state.phase === "playing") {
      launchBall();
    }
  });

  function init() {
    loadProgress();
    loadHighscores();
    renderModeCards();
    renderLevelButtons();
    renderHighscores();
    resetBallAndPaddle();
    updateHUD();
    state.phase = "menu";
    hud.classList.add("hidden");
    setScreen("screen-menu");
    requestAnimationFrame(updateFrame);
  }

  init();
})();
