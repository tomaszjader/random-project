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
  "symulator sprintu",
  "kompilator wymowek",
  "generator README"
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
  "dla chmury co pada"
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
  "który zamienia TODO w motywacyjne plakaty"
];

const owners = [
  "programisty po kawie",
  "architekta w polarze",
  "juniora od odwagi",
  "seniora od westchnięć",
  "scrum mastera z dzwonkiem",
  "backendu w kapciach",
  "frontendu z brokatem",
  "devopsa bez snu"
];

const moods = [
  "mieli pomysł",
  "trwa losowanko",
  "maszyna myśli bardzo",
  "komputer robi brrr",
  "framework się wybiera",
  "deploy patrzy z oddali"
];

const finalMessages = [
  "losowanko zakończone, jeszcze raz?",
  "projekt gotowy, inwestor płacze ze szczęścia",
  "można robić repo i udawać roadmap",
  "maszyna powiedziała i już tego nie cofnie"
];

const storageKey = "programiaste-losowania";

const parts = {
  a: document.querySelector("#part-a"),
  b: document.querySelector("#part-b"),
  c: document.querySelector("#part-c")
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
  const box = element.parentElement;
  let size = 38;

  element.style.fontSize = size + "px";
  while ((element.scrollWidth > element.clientWidth || element.scrollHeight > box.clientHeight - 54) && size > 20) {
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
  context.font = "400 20px Arial, Helvetica, sans-serif";
  context.fillText(label.toUpperCase(), x + width / 2, y + 54);

  context.fillStyle = "#000098";
  context.font = "700 44px Arial, Helvetica, sans-serif";
  const lines = wrapCanvasText(context, value, width - 48);
  const lineHeight = 52;
  const valueTop = y + 116 - Math.max(0, lines.length - 2) * 18;
  drawCenteredLines(context, lines, x + width / 2, valueTop, lineHeight);
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
  context.font = "400 104px Arial, Helvetica, sans-serif";
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
  context.font = "400 34px Arial, Helvetica, sans-serif";
  drawShadowText(context, `pomyślik dla: ${owner.textContent}`, width / 2, 760, "#ffffff", "#000000", 3);

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `pomysl-programiasty-${Date.now()}.png`;
  link.click();
}

function tick(slot, source) {
  parts[slot].textContent = pick(source);
  fitText(parts[slot]);
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

  busy = true;
  drawButton.disabled = true;
  saveButton.disabled = true;
  latestIdea = "";
  result.textContent = "czekaj, bo się renderuje w głowie";
  progress.textContent = "start maszynki";
  owner.textContent = pick(owners);
  setBars(0, 0, 0);

  let step = 0;
  const timer = window.setInterval(() => {
    step += 1;

    if (step < 34) tick("a", starters);
    if (step < 46) tick("b", audiences);
    if (step < 58) tick("c", endings);

    setBars(Math.min(step * 3, 100), Math.max(0, Math.min((step - 22) * 5, 100)), Math.max(0, Math.min((step - 38) * 5, 100)));
    progress.textContent = pick(moods);
    owner.textContent = pick(owners);

    if (step >= 58) {
      window.clearInterval(timer);
      setBars(100, 100, 100);
      finish();
    }
  }, 55);
}

stats.textContent = describeStats();
fitAllParts();
window.addEventListener("resize", fitAllParts);
drawButton.addEventListener("click", draw);
saveButton.addEventListener("click", saveImage);
