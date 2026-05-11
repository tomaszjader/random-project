const starters = [
  "aplikacja webowa",
  "bot konsolowy",
  "panel admina",
  "sztuczna madrosc",
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
  "dla lodowki na websocketach",
  "dla bossa od taskow",
  "dla kolegi co zna regex",
  "dla robota z piwnicy",
  "dla zespolu na standupie",
  "dla czlowieka od excela",
  "dla testera smutnego",
  "dla chmury co pada"
];

const endings = [
  "ktory sortuje kanapki po humorze",
  "ktory zamienia bugi w tapete",
  "ktory robi deploy tylko jak mu ladnie poprosisz",
  "ktory przewiduje czy commit byl pisany w panice",
  "ktory wykrywa spaghetti zanim sie ugotuje",
  "ktory losuje framework i od razu zaluje",
  "ktory tlumaczy stack trace na poezje",
  "ktory liczy czas do kolejnej zmiany wymagan",
  "ktory udaje blockchain bez lancucha",
  "ktory wysyla pull request do samego siebie",
  "ktory robi refaktor przez potrzasanie monitorem",
  "ktory zamienia TODO w motywacyjne plakaty"
];

const owners = [
  "programisty po kawie",
  "architekta w polarze",
  "juniora od odwagi",
  "seniora od westchniec",
  "scrum mastera z dzwonkiem",
  "backendu w kapciach",
  "frontendu z brokatem",
  "devopsa bez snu"
];

const moods = [
  "mieli pomysl",
  "trwa losowanko",
  "maszyna mysli bardzo",
  "komputer robi brrr",
  "framework sie wybiera",
  "deploy patrzy z oddali"
];

const finalMessages = [
  "losowanko zakonczone, jeszcze raz?",
  "projekt gotowy, inwestor placze ze szczescia",
  "mozna robic repo i udawac roadmap",
  "maszyna powiedziala i juz tego nie cofnie"
];

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
const owner = document.querySelector("#owner");
const progress = document.querySelector("#progress");
const result = document.querySelector("#result");
const stats = document.querySelector("#stats");

let busy = false;
let drawCount = Number(localStorage.getItem("programiaste-losowania") || "0");

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
  if (drawCount < 4) return "masz juz kilka podejrzanych pomyslow";
  if (drawCount < 9) return "portfolio zaczyna pachniec przygoda";
  return "to juz wyglada jak agencja kreatywna po awarii";
}

function setBars(a, b, c) {
  bars.a.style.width = a + "%";
  bars.b.style.width = b + "%";
  bars.c.style.width = c + "%";
}

function tick(slot, source) {
  parts[slot].textContent = pick(source);
  fitText(parts[slot]);
}

function finish() {
  const idea = `${parts.a.textContent} ${parts.b.textContent}, ${parts.c.textContent}`;
  result.textContent = idea;
  progress.textContent = pick(finalMessages);
  drawCount += 1;
  localStorage.setItem("programiaste-losowania", String(drawCount));
  stats.textContent = describeStats();
  drawButton.disabled = false;
  busy = false;
}

function draw() {
  if (busy) return;

  busy = true;
  drawButton.disabled = true;
  result.textContent = "czekaj bo sie renderuje w glowie";
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
