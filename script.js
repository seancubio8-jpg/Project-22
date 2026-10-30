let level = 70;
let dispensed = 0;
let running = false;
let timer = null;
let cycleCount = 0;

const $ = (id) => document.getElementById(id);
const CAPACITY_ML = 5000;
const AUTO_INTERVAL_MS = 1800;

function log(message) {
  const row = document.createElement("p");
  row.textContent = `${new Date().toLocaleTimeString()} — ${message}`;
  $("log").prepend(row);
}

function setStatus(message) {
  $("status").textContent = message;
}

function render() {
  const portion = Number($("portion").value);
  $("level").textContent = `${Math.round(level)}%`;
  $("tankLabel").textContent = `${Math.round(level)}%`;
  $("water").style.height = `${level}%`;
  $("bar").style.width = `${level}%`;
  $("dispensed").textContent = `${dispensed} mL`;
  $("portionDisplay").textContent = `${portion} mL`;

  const state = running ? "DISPENSING" : level <= 0 ? "EMPTY" : level <= 15 ? "LOW WATER" : "READY";
  $("state").textContent = state;
  $("sensor").textContent = level <= 15 ? "Sensor: low-level warning" : "Sensor: normal";
  $("screen").textContent = running ? `DISPENSING ${portion} mL` : level <= 0 ? "TANK EMPTY" : level <= 15 ? "LOW WATER" : "SYSTEM READY";

  $("dispense").disabled = running || level <= 0;
  $("start").disabled = running || level <= 0;
  $("stop").disabled = !running;
  $("portion").disabled = running;
  $("refill").disabled = running;
}

function stopAuto(message = "Automatic dispensing stopped.") {
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }
  running = false;
  render();
  setStatus(message);
}

function dispenseOnce() {
  if (running) {
    setStatus("Stop automatic mode before using manual dispense.");
    return false;
  }
  if (level <= 0) {
    setStatus("Tank is empty. Refill before dispensing.");
    return false;
  }

  const requested = Number($("portion").value);
  const available = Math.round((level / 100) * CAPACITY_ML);
  const actual = Math.min(requested, available);
  if (actual <= 0) {
    setStatus("Not enough water available. Please refill the tank.");
    return false;
  }

  level = Math.max(0, level - (actual / CAPACITY_ML) * 100);
  dispensed += actual;
  cycleCount += 1;
  render();
  log(`Manual dispense: ${actual} mL delivered. Tank remaining: ${Math.round(level)}%.`);
  setStatus(`Successfully dispensed ${actual} mL (simulation).`);

  if (level <= 0) {
    setStatus("Tank empty. Refill before the next dispense.");
    log("Low-water protection: tank is empty; dispensing disabled.");
  } else if (level <= 15) {
    log("Warning: water level is low.");
  }
  return true;
}

function startAuto() {
  if (running || level <= 0) return;
  running = true;
  render();
  setStatus("Automatic mode is running. Press Stop to end the simulation.");
  log("Automatic dispensing started.");

  timer = setInterval(() => {
    if (level <= 0) {
      stopAuto("Tank empty. Automatic dispensing stopped.");
      log("Automatic mode stopped because the tank is empty.");
      return;
    }

    const requested = Number($("portion").value);
    const available = Math.round((level / 100) * CAPACITY_ML);
    const actual = Math.min(requested, available);
    if (actual <= 0) {
      stopAuto("No water available. Refill the tank.");
      return;
    }

    level = Math.max(0, level - (actual / CAPACITY_ML) * 100);
    dispensed += actual;
    cycleCount += 1;
    render();
    log(`Automatic cycle ${cycleCount}: ${actual} mL dispensed. Tank remaining: ${Math.round(level)}%.`);

    if (level <= 0) {
      stopAuto("Tank empty. Automatic dispensing stopped.");
      log("Low-water protection: automatic mode stopped.");
    } else if (level <= 15) {
      setStatus("Warning: tank level is low. Refill soon.");
    }
  }, AUTO_INTERVAL_MS);
}

function refillTank() {
  if (running) stopAuto("Automatic mode stopped before refill.");
  level = 100;
  dispensed = 0;
  cycleCount = 0;
  render();
  setStatus("Tank refilled to 100%. Session counter reset.");
  log("Tank refilled. Session counter reset.");
}

function resetSimulation() {
  stopAuto("Simulation reset to its starting state.");
  level = 70;
  dispensed = 0;
  cycleCount = 0;
  render();
  setStatus("Simulation reset. Tank level is back to 70%.");
  log("Simulation reset to default values.");
}

function exportLog() {
  const entries = [...$("log").querySelectorAll("p")].map((p) => p.textContent);
  const content = ["SmartSip Simulator Event Log", ...entries].join("\n");
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "smartsip-event-log.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setStatus("Event log exported as a text file.");
}

$("dispense").addEventListener("click", dispenseOnce);
$("start").addEventListener("click", startAuto);
$("stop").addEventListener("click", () => {
  if (!running) return;
  stopAuto("Automatic dispensing stopped by user.");
  log("Automatic mode stopped by user.");
});
$("refill").addEventListener("click", refillTank);
$("reset").addEventListener("click", resetSimulation);
$("portion").addEventListener("change", () => {
  render();
  setStatus(`Portion size changed to ${$("portion").value} mL.`);
  log(`Portion size selected: ${$("portion").value} mL.`);
});
$("exportLog").addEventListener("click", exportLog);
$("clearLog").addEventListener("click", () => {
  $("log").replaceChildren();
  log("Event log cleared.");
  setStatus("Event log cleared.");
});

render();
log("Simulator initialized. Tank level: 70%.");
