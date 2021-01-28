// variables
let timer;
let elapsedTime = 0;
let lastLap = [];

// elements
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const lapButton = document.getElementById("lapButton");
const stopButton = document.getElementById("stopButton");
const resetButton = document.getElementById("resetButton");
const saveButton = document.getElementById("saveButton");
const lapField = document.getElementById("lapField");


const format = (time) => {
  let diffInHrs = time / 3600000;
  let hh = Math.floor(diffInHrs);

  let diffInMin = (diffInHrs - hh) * 60;
  let mm = Math.floor(diffInMin);

  let diffInSec = (diffInMin - mm) * 60;
  let ss = Math.floor(diffInSec);

  let diffInMsec = (diffInSec - ss) * 100;
  let ms = Math.floor(diffInMsec);

  let formattedMM = mm.toString().padStart(2, "0");
  let formattedSS = ss.toString().padStart(2, "0");
  let formattedMS = ms.toString().padStart(2, "0");

  return `${formattedMM}:${formattedSS}:${formattedMS}`;
};

const updateDisplay = (time) => {
  document.getElementById("time").innerHTML = format(time);
};

// Timer controllers
const startTimer = () => {
  const startAt = Date.now() - elapsedTime;
  timer = setInterval(() => {
    elapsedTime = Date.now() - startAt;
    updateDisplay(elapsedTime);
  }, 10);
};

const pauseTimer = () => {
  clearInterval(timer);
  updateDisplay(elapsedTime);
};


const resetTimer = () => {
  elapsedTime = 0;
  lastLap = [];
  updateDisplay(elapsedTime);
};

// Actions
const start = () => {
  startTimer();
  startButton.style.display = "none";
  pauseButton.style.display = "inline";
  lapButton.disabled = false;
  stopButton.style.display = "inline";
  resetButton.style.display = "none";
  stopButton.disabled = false;
};

const pause = () => {
  pauseTimer();
  pauseButton.style.display = "none";
  startButton.style.display = "inline";
  lapButton.disabled = true;
  stopButton.disabled = true;
};

const lap = () => {
  const t = elapsedTime;
  const d = (lastLap.length > 0) ? (t - lastLap[lastLap.length - 1]) : elapsedTime;
  lastLap.push(t);
  lapField.value += `${lastLap.length.toString()}\t${format(t)}\t${format(d)}\n`
  lapField.scrollTop = lapField.scrollHeight;
};

const stop = () => {
  pauseTimer();
  lap();
  startButton.style.display = "inline";
  startButton.disabled = true;
  pauseButton.style.display = "none";
  lapButton.disabled = true;
  stopButton.style.display = "none";
  resetButton.style.display = "inline";
  resetButton.disabled = false;
};

const reset = () => {
  if(!confirm("Lap record will be discarded. OK?")) return;
  resetTimer();
  startButton.disabled = false;
  resetButton.disabled = true;
  lapField.value = "";
};

const save = () => {
  lapField.select();
  if(document.execCommand("copy")) alert("Copied to clipboard");
  else alert("Not supported this feature");
};

// Register actions
startButton.addEventListener("click", start);
pauseButton.addEventListener("click", pause);
lapButton.addEventListener("click", lap);
stopButton.addEventListener("click", stop);
resetButton.addEventListener("click", reset);
saveButton.addEventListener("click", save);
