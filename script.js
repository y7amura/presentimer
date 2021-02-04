// components
const clock = document.getElementById("time");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const lapButton = document.getElementById("lapButton");
const stopButton = document.getElementById("stopButton");
const resetButton = document.getElementById("resetButton");
const saveButton = document.getElementById("saveButton");
const lapField = document.getElementById("lapField");
const alarmEnablers = [
  document.getElementById("alarm-enabler-1"),
  document.getElementById("alarm-enabler-2"),
  document.getElementById("alarm-enabler-3"),
];
const alarmMins = [
  document.getElementById("alarm-min-1"),
  document.getElementById("alarm-min-2"),
  document.getElementById("alarm-min-3"),
];
const alarmSecs = [
  document.getElementById("alarm-sec-1"),
  document.getElementById("alarm-sec-2"),
  document.getElementById("alarm-sec-3"),
];
const alarmColors = [
  document.getElementById("alarm-color-1"),
  document.getElementById("alarm-color-2"),
  document.getElementById("alarm-color-3"),
];


const parseTime = (time) => {
  return {
    min: Math.floor(time / 60000),
    sec: Math.floor(time / 1000) % 60,
    // ms: time % 1000,
  };
};

const format = (time) => {
  const t = parseTime(time);
  const min = t.min.toString().padStart(2, "0");
  const sec = t.sec.toString().padStart(2, "0");
  return `${min}:${sec}`;
};

const updateDisplay = (time) => {
  clock.innerHTML = format(time);
};


// Timer
let timer;
let elapsedTime = 0;
let lastLap = [];

const startTimer = () => {
  const startAt = Date.now() - elapsedTime;
  timer = setInterval(() => {
    elapsedTime = Date.now() - startAt;
    checkAlarm(elapsedTime);
    updateDisplay(elapsedTime);
  }, 1000);
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


// Alarms
let alarms = [];
let alarmInitialized = false;

const initializeAlarm = () => {
  if(alarmInitialized) return;
  [0, 1, 2].filter(idx => { return alarmEnablers[idx].checked; }).forEach(idx => {
    const t = (parseInt(alarmMins[idx].value, 10) * 60 + parseInt(alarmSecs[idx].value, 10)) * 1000;
    alarms.push({
      time: t,
      color: alarmColors[idx].value,
    });
  });
  alarms.sort((a, b) => {
    if(a.time < b.time) return -1;
    if(a.time > b.time) return 1;
    return 0;
  });
  alarmInitialized = true;
};

const checkAlarm = (time) => {
  alarms.forEach(alarm => {
    if(time >= alarm.time) {
      clock.style.color = alarm.color;
    }
  });
};

const resetAlarms = () => {
  alarmInitialized = false;
  alarms = [];
  clock.style.color = "#fafafa";
};

const toggleAlarm = (idx) => {
  return () => {
    const flag = !alarmEnablers[idx].checked;
    alarmMins[idx].disabled = flag;
    alarmSecs[idx].disabled = flag;
    alarmColors[idx].disabled = flag;
  };
};


// Actions
const start = () => {
  startTimer();
  initializeAlarm();
  startButton.style.display = "none";
  pauseButton.style.display = "inline";
  lapButton.disabled = false;
  stopButton.style.display = "inline";
  resetButton.style.display = "none";
  stopButton.disabled = false;
  alarmEnablers.forEach(enabler => { enabler.disabled = true; });
  alarmMins.forEach(alarmMin => { alarmMin.disabled = true; });
  alarmSecs.forEach(alarmSec => { alarmSec.disabled = true; });
  alarmColors.forEach(alarmColor => {alarmColor.disabled = true; });
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
  resetAlarms();
  startButton.disabled = false;
  resetButton.disabled = true;
  lapField.value = "";
  alarmEnablers.forEach(enabler => { enabler.disabled = false; });
  alarmMins.forEach(alarmMin => { alarmMin.disabled = false; });
  alarmSecs.forEach(alarmSec => { alarmSec.disabled = false; });
  alarmColors.forEach(alarmColor => {alarmColor.disabled = false; });
};

const save = () => {
  if(lapField.value.length == 0) return alert("Nothing to copy");
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
alarmEnablers.forEach((alarmEnabler, idx) => {
  alarmEnabler.addEventListener("click", toggleAlarm(idx));
});

const alarmTab = document.getElementById("alarm-tab");
const alarmPanel = document.getElementById("alarm-panel");
const lapfieldTab = document.getElementById("lapfield-tab");
const lapfieldPanel = document.getElementById("lapfield-panel");

alarmTab.addEventListener("click", () => {
  alarmTab.classList.add("w3-green");
  alarmTab.classList.remove("w3-gray");
  alarmPanel.classList.remove("w3-hide-small");
  lapfieldTab.classList.remove("w3-green");
  lapfieldTab.classList.add("w3-gray");
  lapfieldPanel.classList.add("w3-hide-small");
});
lapfieldTab.addEventListener("click", () => {
  lapfieldTab.classList.add("w3-green");
  lapfieldTab.classList.remove("w3-gray");
  lapfieldPanel.classList.remove("w3-hide-small");
  alarmTab.classList.remove("w3-green");
  alarmTab.classList.add("w3-gray");
  alarmPanel.classList.add("w3-hide-small");
});
