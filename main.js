let value = new ExpantaNum(2);
let rebirths = new ExpantaNum(0);
let amountupg1 = new ExpantaNum(0);
let amountupg2 = new ExpantaNum(0);
let exponent = new ExpantaNum(2);
let upg1Cost = new ExpantaNum(1);
let upg2Cost = new ExpantaNum(10);

const rebirthThreshold = new ExpantaNum("ee50");
function updateValue() {
  value = value.pow(exponent);
  document.getElementById("value").innerText = format(value, 2);
}
function obfuscateData(str) {
    const shift = Math.floor(Math.random() * 256);
    let obfuscated = '';
    for (let i = 0; i < str.length; i++) {
        obfuscated += String.fromCharCode(str.charCodeAt(i) + shift);
    }
    return { obfuscatedData: obfuscated, shift: shift };
}

function deobfuscateData(obfuscatedData, shift) {
    let deobfuscated = '';
    for (let i = 0; i < obfuscatedData.length; i++) {
        deobfuscated += String.fromCharCode(obfuscatedData.charCodeAt(i) - shift);
    }
    return deobfuscated;
}

function toBase64(str) {
    try {
        const uint8Array = new TextEncoder().encode(str);
        let base64String = '';
        for (let i = 0; i < uint8Array.length; i++) {
            base64String += String.fromCharCode(uint8Array[i]);
        }
        return btoa(base64String);
    } catch (error) {
        console.error("Error during Base64 encoding:", error);
        return null;
    }
}

function fromBase64(base64) {
    try {
        const decodedData = atob(base64);
        const uint8Array = new Uint8Array(decodedData.length);
        for (let i = 0; i < decodedData.length; i++) {
            uint8Array[i] = decodedData.charCodeAt(i);
        }
        return new TextDecoder().decode(uint8Array);
    } catch (error) {
        console.error("Error during Base64 decoding:", error);
        return null;
    }
}

function saveGame() {
    const saveData = JSON.stringify({
        value: value.toString(),
        rebirths: rebirths.toString(),
        exponent: exponent.toString(),
        upg1Cost: upg1Cost.toString(),
        upg2Cost: upg2Cost.toString(),
        amountupg1: amountupg1.toString(),
        amountupg2: amountupg2.toString()
    });
    const { obfuscatedData, shift } = obfuscateData(saveData);
    const encodedData = toBase64(obfuscatedData);
    localStorage.setItem("afksave", JSON.stringify({ data: encodedData, shift: shift }));
}

function loadGame() {
    const savedData = localStorage.getItem("afksave");
    if (savedData) {
        const parsed = JSON.parse(savedData);
        const decodedData = fromBase64(parsed.data);

        if (decodedData) {
            const deobfuscatedData = deobfuscateData(decodedData, parsed.shift);
            const gameData = JSON.parse(deobfuscatedData);
            value = new ExpantaNum(gameData.value);
            rebirths = new ExpantaNum(gameData.rebirths);
            exponent = new ExpantaNum(gameData.exponent);
            upg1Cost = new ExpantaNum(gameData.upg1Cost);
            upg2Cost = new ExpantaNum(gameData.upg2Cost);
            amountupg1 = new ExpantaNum(gameData.amountupg1);
            amountupg2 = new ExpantaNum(gameData.amountupg2);
            updateDisplay();
        }
    }
}

function rebirth() {
  if (value.gte(rebirthThreshold)) {
    const earnedRebirths = value.log10().log10().log10();
    rebirths = rebirths.add(earnedRebirths);
    value = new ExpantaNum(2);
    updateDisplay();
  }
}

function buyUpgrade1() {
  if (rebirths.gte(upg1Cost)) {
    rebirths = rebirths.sub(upg1Cost);
    amountupg1 = amountupg1.add(1);
    upg1Cost = upg1Cost.add(1);
    updateDisplay();
  }
}
function buyUpgrade2() {
  if (rebirths.gte(upg2Cost)) {
    rebirths = rebirths.sub(upg2Cost);
    upg2Cost = upg2Cost.mul(1.3);
    amountupg2 = amountupg2.add(1.5);
    updateDisplay();
  }
}

function resetGame() {
  value = new ExpantaNum(2);
  rebirths = new ExpantaNum(0);
  exponent = new ExpantaNum(2);
  upg1Cost = new ExpantaNum(1);
  upg2Cost = new ExpantaNum(10);
  amountupg1 = new ExpantaNum(0);
  amountupg2 = new ExpantaNum(0);
  localStorage.removeItem("afksave");
  saveGame();
  updateDisplay();
}

function recalcExponent() {
  let base = new ExpantaNum(2);
  let withUpg1 = base.add(amountupg1);
  let factor = amountupg2.eq(0) ? new ExpantaNum(1) : amountupg2;
  exponent = withUpg1.mul(factor);
}

function updateDisplay() {
  recalcExponent();
  document.getElementById("value").innerText    = format(value, 2);
  document.getElementById("rebirths").innerText = `Rebirths: ${format(rebirths, 2)}`;
  document.getElementById("upg1Cost").innerText = format(upg1Cost, 2);
  document.getElementById("upg2Cost").innerText = format(upg2Cost, 2);
  document.getElementById("Exponent").innerText = `Exponent: ${format(exponent, 2)}`;
}


setInterval(() => {
  updateValue();
}, 1000);
setInterval(() => {
    saveGame();
  }, 500);
window.onload = loadGame;
