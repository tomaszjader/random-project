const starters = [
  "aplikacja webowa",
  "bot konsolowy",
  "panel admina",
  "sztuczna mądrość",
  "mikroserwisik",
  "edytor pikseli",
  "terminalowy kombajn",
  "plugin do niczego",
  "dashboard od czapy",
  "simulator sprintu",
  "kompilator wymowek",
  "generator README",
  "inteligentna spłuczka",
  "wyszukiwarka wymówek",
  "generator fuszery",
  "arkusz kalkulacyjny",
  "system lojalnościowy",
  "wirtualny kumpel",
  "nakładka na windowsa",
  "koparka smutku",
  "antywirus w htmlu",
  "kalkulator kredytowy"
];

const audiences = [
  "dla seniora bez myszy",
  "dla juniora po deployu",
  "dla avatara z githuba",
  "dla pani z dziekanatu",
  "dla lodówki na websocketach",
  "dla bossa od tasków",
  "dla kolegi co zna regex",
  "dla robota z piwnicy",
  "dla zespołu na standupie",
  "dla człowieka od excela",
  "dla testera smutnego",
  "dla chmury co pada",
  "dla managera bez empatii",
  "dla kota co chodzi po klawiaturze",
  "dla bazy danych bez indeksów",
  "dla stażysty w pierwszym dniu",
  "dla gitlaba co ciągle leży",
  "dla teściowej programisty",
  "dla programisty php",
  "dla sztucznej inteligencji",
  "dla krowy na wypasie"
];

const endings = [
  "który sortuje kanapki po humorze",
  "który zamienia bugi w tapetę",
  "który robi deploy tylko jak go ładnie poprosisz",
  "który przewiduje czy commit był pisany w panice",
  "który wykrywa spaghetti zanim się ugotuje",
  "który losuje framework i od razu żałuje",
  "który tłumaczy stack trace na poezję",
  "który liczy czas do kolejnej zmiany wymagań",
  "który udaje blockchain bez łańcucha",
  "który wysyła pull request do samego siebie",
  "który robi refaktor przez potrząsanie monitorem",
  "który zamienia TODO w motywacyjne plakaty",
  "który kasuje kod przy każdym ostrzeżeniu lintera",
  "który mierzy poziom stresu po sile uderzania w enter",
  "który wysyła powiadomienia push o trzeciej w nocy",
  "który uczy kłamać na rozmowie rekrutacyjnej",
  "który zamienia spacje na tabulacje losowo przed commitem",
  "który dodaje losowe średniki w plikach Pythona",
  "który puszcza dźwięk bębna przy udanej kompilacji",
  "który wysyła maile z przeprosinami do bazy danych",
  "który działa tylko na komputerze dewelopera",
  "który automatycznie pisze wypowiedzenie po piątym zebraniu"
];

const owners = [
  "programisty po kawie",
  "architekta w polarze",
  "juniora od odwagi",
  "seniora od westchnięć",
  "scrum mastera z dzwonkiem",
  "backendu w kapciach",
  "frontendu z brokatem",
  "devopsa bez snu",
  "managera w koszuli",
  "testera z lupą",
  "stażysty z gaśnicą",
  "sysadmina od restartu",
  "analityka z excelem"
];

const moods = [
  "mieli pomysł",
  "trwa losowanko",
  "maszyna myśli bardzo",
  "komputer robi brrr",
  "framework się wybiera",
  "deploy patrzy z oddali",
  "szukanie wolnego portu",
  "czyszczenie cache",
  "linter płacze cicho",
  "stack overflow odpytywany",
  "kawa się parzy",
  "sprint się pali"
];

const finalMessages = [
  "losowanko zakończone, jeszcze raz?",
  "projekt gotowy, inwestor płacze ze szczęścia",
  "można robić repo i udawać roadmap",
  "maszyna powiedziała i już tego nie cofnie",
  "sukces! teraz tylko 3 miesiące debugowania",
  "gotowe! wystaw fakturę i uciekaj do lasu",
  "napisane w 5 sekund, wdrażane przez rok",
  "można dodawać do CV jako AI Specialist"
];

const storageKey = "programiaste-losowania";

const parts = {
  a: document.querySelector("#part-a"),
  b: document.querySelector("#part-b"),
  c: document.querySelector("#part-c")
};

const strips = {
  a: document.querySelector("#part-a-strip"),
  b: document.querySelector("#part-b-strip"),
  c: document.querySelector("#part-c-strip")
};

const bars = {
  a: document.querySelector("#bar-a"),
  b: document.querySelector("#bar-b"),
  c: document.querySelector("#bar-c")
};

const drawButton = document.querySelector("#draw");
const saveButton = document.querySelector("#save");
const owner = document.querySelector("#owner");
const progress = document.querySelector("#progress");
const result = document.querySelector("#result");
const stats = document.querySelector("#stats");

let busy = false;
let drawCount = readDrawCount();
let latestIdea = "";

// --- Web Audio API retro syntezator ---
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playBeep(freq, duration, type = 'square', volume = 0.08) {
  try {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.error("Audio error", e);
  }
}

function playSpinSound() {
  const freq = 250 + Math.random() * 150;
  playBeep(freq, 0.05, 'square', 0.03);
}

function playStopSound() {
  playBeep(180, 0.12, 'triangle', 0.12);
  setTimeout(() => {
    playBeep(140, 0.15, 'triangle', 0.08);
  }, 35);
}

function playWinSound() {
  const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playBeep(freq, 0.3, 'square', 0.04);
    }, idx * 80);
  });
}

// --- Logika pomocnicza ---

function readDrawCount() {
  try {
    const storedValue = Number(window.localStorage.getItem(storageKey) || "0");
    return Number.isFinite(storedValue) ? storedValue : 0;
  } catch {
    return 0;
  }
}

function saveDrawCount() {
  try {
    window.localStorage.setItem(storageKey, String(drawCount));
    return true;
  } catch {
    return false;
  }
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function fitText(element) {
  const viewport = element.closest(".reel-viewport") || element.parentElement;
  if (!viewport) return;
  const maxHeight = viewport.clientHeight || 200;

  const isMobile = window.innerWidth <= 680;
  let size = isMobile ? 48 : 68;
  const minSize = isMobile ? 26 : 36;

  element.style.fontSize = size + "px";
  element.style.lineHeight = "0.95";
  
  while (element.scrollHeight > maxHeight - 4 && size > minSize) {
    size -= 1;
    element.style.fontSize = size + "px";
  }
}

function fitAllParts() {
  Object.values(parts).forEach(fitText);
}

function describeStats() {
  if (drawCount === 0) return "masz jeszcze czyste sumienie";
  if (drawCount < 4) return "masz już kilka podejrzanych pomysłów";
  if (drawCount < 9) return "portfolio zaczyna pachnieć przygodą";
  return "to już wygląda jak agencja kreatywna po awarii";
}

function setBars(a, b, c) {
  bars.a.style.width = a + "%";
  bars.b.style.width = b + "%";
  bars.c.style.width = c + "%";
}

function wrapCanvasText(context, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const nextLine = line ? `${line} ${word}` : word;

    if (context.measureText(nextLine).width <= maxWidth) {
      line = nextLine;
      return;
    }

    if (line) lines.push(line);
    line = word;
  });

  if (line) lines.push(line);
  return lines;
}

function fitCanvasText(context, text, maxWidth, maxHeight) {
  const maxFontSize = 52;
  const minFontSize = 28;

  for (let fontSize = maxFontSize; fontSize >= minFontSize; fontSize -= 2) {
    context.font = `700 ${fontSize}px 'VT323', monospace`;

    const lines = wrapCanvasText(context, text, maxWidth);
    const lineHeight = Math.round(fontSize * .92);

    if (lines.length * lineHeight <= maxHeight) {
      return { fontSize, lineHeight, lines };
    }
  }

  context.font = `700 ${minFontSize}px 'VT323', monospace`;
  return {
    fontSize: minFontSize,
    lineHeight: Math.round(minFontSize * .92),
    lines: wrapCanvasText(context, text, maxWidth)
  };
}

function drawCenteredLines(context, lines, x, y, lineHeight) {
  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight);
  });
}

function drawRoundRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function drawShadowText(context, text, x, y, fill, shadow, offset) {
  context.fillStyle = shadow;
  context.fillText(text, x + offset, y + offset);
  context.fillStyle = fill;
  context.fillText(text, x, y);
}

function drawCrtOverlay(context, width, height) {
  context.save();

  context.fillStyle = "rgba(0, 0, 0, .18)";
  for (let y = 0; y < height; y += 6) {
    context.fillRect(0, y, width, 3);
  }

  const rgbGlow = context.createLinearGradient(0, 0, width, 0);
  rgbGlow.addColorStop(0, "rgba(255, 0, 0, .08)");
  rgbGlow.addColorStop(.5, "rgba(0, 255, 0, .03)");
  rgbGlow.addColorStop(1, "rgba(0, 0, 255, .08)");
  context.fillStyle = rgbGlow;
  context.fillRect(0, 0, width, height);

  const vignette = context.createRadialGradient(
    width / 2,
    height / 2,
    height * .18,
    width / 2,
    height / 2,
    width * .7
  );
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(1, "rgba(0, 0, 0, .24)");
  context.fillStyle = vignette;
  context.fillRect(0, 0, width, height);

  context.restore();
}

function drawIdeaCard(context, label, value, x, y, width, height) {
  context.save();
  context.shadowColor = "rgba(0, 0, 0, .65)";
  context.shadowBlur = 22;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 8;
  drawRoundRect(context, x, y, width, height, 26);
  const cardFill = context.createLinearGradient(0, y, 0, y + height);
  cardFill.addColorStop(0, "#f7f7f7");
  cardFill.addColorStop(.5, "#bdbdbd");
  cardFill.addColorStop(1, "#ffffff");
  context.fillStyle = cardFill;
  context.fill();
  context.restore();

  context.textAlign = "center";
  context.textBaseline = "top";
  context.fillStyle = "#111111";
  context.font = "400 24px 'VT323', monospace";
  context.fillText(label.toUpperCase(), x + width / 2, y + 54);

  context.fillStyle = "#000098";
  const valueTop = y + 104;
  const valueHeight = height - 132;
  const fittedValue = fitCanvasText(context, value, width - 48, valueHeight);
  const textHeight = fittedValue.lines.length * fittedValue.lineHeight;
  const centeredValueTop = valueTop + Math.max(0, (valueHeight - textHeight) / 2);

  context.font = `700 ${fittedValue.fontSize}px 'VT323', monospace`;
  drawCenteredLines(context, fittedValue.lines, x + width / 2, centeredValueTop, fittedValue.lineHeight);
}

function saveImage() {
  if (!latestIdea) return;

  const canvas = document.createElement("canvas");
  const width = 1200;
  const height = 900;
  const context = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  const background = context.createLinearGradient(0, 0, 0, height);
  background.addColorStop(0, "#b90000");
  background.addColorStop(.45, "#990000");
  background.addColorStop(1, "#650000");
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "#00ff00";
  context.lineWidth = 7;
  context.setLineDash([10, 9]);
  context.strokeRect(28, 12, width - 56, height - 24);
  context.setLineDash([]);

  context.textAlign = "center";
  context.textBaseline = "top";
  context.font = "400 130px 'VT323', monospace";
  drawShadowText(context, "losowanie projektów", width / 2, 78, "#ffffff", "#000000", 5);
  drawShadowText(context, "programiaste", width / 2, 216, "#ffffff", "#000000", 5);

  const cardY = 410;
  const cardWidth = 356;
  const cardHeight = 300;
  const gap = 24;
  const firstCardX = (width - cardWidth * 3 - gap * 2) / 2;

  drawIdeaCard(context, "typ", parts.a.textContent, firstCardX, cardY, cardWidth, cardHeight);
  drawIdeaCard(context, "dla kogo", parts.b.textContent, firstCardX + cardWidth + gap, cardY, cardWidth, cardHeight);
  drawIdeaCard(context, "po co", parts.c.textContent, firstCardX + (cardWidth + gap) * 2, cardY, cardWidth, cardHeight);

  context.fillStyle = "#ffffff";
  context.font = "400 46px 'VT323', monospace";
  drawShadowText(context, `pomyślik dla: ${owner.textContent}`, width / 2, 760, "#ffffff", "#000000", 3);

  drawCrtOverlay(context, width, height);

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `pomysl-programiasty-${Date.now()}.png`;
  link.click();
}

function finish() {
  const idea = `${parts.a.textContent} ${parts.b.textContent}, ${parts.c.textContent}`;
  latestIdea = idea;
  result.textContent = idea;
  progress.textContent = pick(finalMessages);
  drawCount += 1;
  const wasSaved = saveDrawCount();
  stats.textContent = wasSaved ? describeStats() : `${describeStats()} (bez zapisu w przeglądarce)`;
  drawButton.disabled = false;
  saveButton.disabled = false;
  busy = false;
}

function draw() {
  if (busy) return;

  // Aktywuj / wznów Audio Context
  initAudio();

  busy = true;
  drawButton.disabled = true;
  saveButton.disabled = true;
  latestIdea = "";
  result.textContent = "czekaj, bo się renderuje w głowie";
  progress.textContent = "start maszynki";
  owner.textContent = pick(owners);
  setBars(0, 0, 0);

  const targetA = pick(starters);
  const targetB = pick(audiences);
  const targetC = pick(endings);

  const durationA = 1800;
  const durationB = 2600;
  const durationC = 3400;

  const setupReel = (slotKey, sourceArray, targetValue, duration) => {
    const strip = strips[slotKey];
    const viewport = strip.parentElement;
    const itemHeight = viewport.clientHeight || 200;

    // Resetuj stan paska
    strip.style.transition = "none";
    strip.style.transform = "translateY(0px)";
    strip.classList.add("blur-spinning");

    // Zostaw tylko pierwszy element
    const currentSpan = strip.querySelector("span");
    strip.innerHTML = "";
    strip.appendChild(currentSpan);
    fitText(currentSpan);

    const numItems = 20;
    
    // Dodaj losowe opcje i na końcu właściwą wartość
    for (let i = 1; i < numItems; i++) {
      const span = document.createElement("span");
      span.textContent = i === numItems - 1 ? targetValue : pick(sourceArray);
      strip.appendChild(span);
      fitText(span);
    }

    // Wymuś przeliczenie styli
    strip.offsetHeight;

    // Uruchom przejście
    strip.style.transition = `transform ${duration}ms cubic-bezier(0.1, 0.8, 0.15, 1)`;
    const offset = -(numItems - 1) * itemHeight;
    strip.style.transform = `translateY(${offset}px)`;

    // Pętla dźwięków kręcenia
    let nextBeepTime = 40;
    const startBeeps = (currentDelay) => {
      if (!busy) return;
      if (currentDelay > duration - 200) return;
      
      playSpinSound();
      
      const nextDelay = currentDelay + 8 + (currentDelay / duration) * 120;
      setTimeout(() => startBeeps(nextDelay), nextDelay);
    };
    
    setTimeout(() => startBeeps(nextBeepTime), nextBeepTime);

    // Koniec kręcenia bębna
    setTimeout(() => {
      playStopSound();

      // Zastąp pasek pojedynczym stałym elementem
      strip.style.transition = "none";
      strip.style.transform = "translateY(0px)";

      const targetSpan = document.createElement("span");
      targetSpan.id = "part-" + slotKey;
      targetSpan.textContent = targetValue;
      strip.innerHTML = "";
      strip.appendChild(targetSpan);
      fitText(targetSpan);

      parts[slotKey] = targetSpan;
      strip.classList.remove("blur-spinning");

      // Paski postępu pod bębnami
      if (slotKey === "a") setBars(100, 20, 10);
      if (slotKey === "b") setBars(100, 100, 40);
      if (slotKey === "c") {
        setBars(100, 100, 100);
        playWinSound();
        finish();
      }
    }, duration);
  };

  setupReel("a", starters, targetA, durationA);
  setupReel("b", audiences, targetB, durationB);
  setupReel("c", endings, targetC, durationC);

  // Zmiana napisów w tle podczas losowania
  const infoTimer = setInterval(() => {
    if (!busy) {
      clearInterval(infoTimer);
      return;
    }
    progress.textContent = pick(moods);
    owner.textContent = pick(owners);
  }, 250);
}

stats.textContent = describeStats();
fitAllParts();
window.addEventListener("resize", fitAllParts);
drawButton.addEventListener("click", draw);
saveButton.addEventListener("click", saveImage);
