// ============================================
//  CALORIE TRACKER — app.js
//  Same food DB as Java backend (mirrored)
// ============================================

const foodDB = {
  "chicken breast":  { cal: 165, protein: 31.0, carbs: 0.0,  fat: 3.6  },
  "rice":            { cal: 130, protein: 2.7,  carbs: 28.2, fat: 0.3  },
  "egg":             { cal: 155, protein: 13.0, carbs: 1.1,  fat: 11.0 },
  "banana":          { cal: 89,  protein: 1.1,  carbs: 23.0, fat: 0.3  },
  "oats":            { cal: 389, protein: 17.0, carbs: 66.0, fat: 7.0  },
  "milk":            { cal: 61,  protein: 3.2,  carbs: 4.8,  fat: 3.3  },
  "bread":           { cal: 265, protein: 9.0,  carbs: 49.0, fat: 3.2  },
  "apple":           { cal: 52,  protein: 0.3,  carbs: 14.0, fat: 0.2  },
  "salmon":          { cal: 208, protein: 20.0, carbs: 0.0,  fat: 13.0 },
  "broccoli":        { cal: 34,  protein: 2.8,  carbs: 7.0,  fat: 0.4  },
  "paneer":          { cal: 265, protein: 18.3, carbs: 1.2,  fat: 20.8 },
  "dal":             { cal: 116, protein: 9.0,  carbs: 20.0, fat: 0.4  },
  "roti":            { cal: 297, protein: 9.0,  carbs: 55.0, fat: 4.0  },
  "potato":          { cal: 77,  protein: 2.0,  carbs: 17.0, fat: 0.1  },
  "peanut butter":   { cal: 588, protein: 25.0, carbs: 20.0, fat: 50.0 },
  "greek yogurt":    { cal: 59,  protein: 10.0, carbs: 3.6,  fat: 0.4  },
  "almonds":         { cal: 579, protein: 21.0, carbs: 22.0, fat: 50.0 },
  "curd":            { cal: 98,  protein: 11.0, carbs: 3.4,  fat: 4.3  },
  "white rice":      { cal: 130, protein: 2.7,  carbs: 28.2, fat: 0.3  },
  "brown rice":      { cal: 216, protein: 5.0,  carbs: 45.0, fat: 1.8  },
};

// State
let log = [];
let totals = { cal: 0, protein: 0, carbs: 0, fat: 0 };

// ---- Autocomplete ----
const foodInput   = document.getElementById('foodInput');
const suggestions = document.getElementById('suggestions');

foodInput.addEventListener('input', () => {
  const val = foodInput.value.trim().toLowerCase();
  suggestions.innerHTML = '';
  if (!val) { suggestions.classList.remove('open'); return; }

  const matches = Object.keys(foodDB).filter(f => f.includes(val)).slice(0, 6);
  if (!matches.length) { suggestions.classList.remove('open'); return; }

  matches.forEach(f => {
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    item.innerHTML = `<span>${capitalize(f)}</span><span class="cal-hint">${foodDB[f].cal} kcal/100g</span>`;
    item.addEventListener('mousedown', () => {
      foodInput.value = f;
      suggestions.classList.remove('open');
    });
    suggestions.appendChild(item);
  });
  suggestions.classList.add('open');
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.input-row')) suggestions.classList.remove('open');
});

// ---- Add Food ----
function addFood() {
  const food   = foodInput.value.trim().toLowerCase();
  const amount = parseFloat(document.getElementById('amountInput').value);
  const errEl  = document.getElementById('errorMsg');
  errEl.textContent = '';

  if (!food) { errEl.textContent = 'Please enter a food name.'; return; }
  if (!foodDB[food]) { errEl.textContent = `"${food}" not found. Try suggestions above.`; return; }
  if (!amount || amount <= 0) { errEl.textContent = 'Please enter a valid amount in grams.'; return; }

  const factor = amount / 100;
  const data   = foodDB[food];
  const entry  = {
    id:      Date.now(),
    food:    food,
    amount:  amount,
    cal:     +(data.cal     * factor).toFixed(1),
    protein: +(data.protein * factor).toFixed(1),
    carbs:   +(data.carbs   * factor).toFixed(1),
    fat:     +(data.fat     * factor).toFixed(1),
  };

  log.push(entry);
  totals.cal     += entry.cal;
  totals.protein += entry.protein;
  totals.carbs   += entry.carbs;
  totals.fat     += entry.fat;

  renderLog();
  updateTotals();
  updateMacroBar();

  foodInput.value = '';
  document.getElementById('amountInput').value = '';
  suggestions.classList.remove('open');
}

// Allow Enter key
document.getElementById('amountInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') addFood();
});
foodInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addFood();
});

// ---- Delete Entry ----
function deleteEntry(id) {
  const idx = log.findIndex(e => e.id === id);
  if (idx === -1) return;
  const e = log[idx];
  totals.cal     -= e.cal;
  totals.protein -= e.protein;
  totals.carbs   -= e.carbs;
  totals.fat     -= e.fat;
  log.splice(idx, 1);
  renderLog();
  updateTotals();
  updateMacroBar();
}

// ---- Clear All ----
function clearLog() {
  log = [];
  totals = { cal: 0, protein: 0, carbs: 0, fat: 0 };
  renderLog();
  updateTotals();
  updateMacroBar();
}

// ---- Render Log ----
function renderLog() {
  const list = document.getElementById('logList');
  if (!log.length) {
    list.innerHTML = '<p class="empty-state">No foods added yet. Start tracking above ↑</p>';
    return;
  }
  list.innerHTML = log.map(e => `
    <div class="log-entry">
      <div class="entry-left">
        <div class="food-name">${capitalize(e.food)}</div>
        <div class="food-amount">${e.amount}g</div>
      </div>
      <div class="entry-macros">
        <span class="macro-tag tag-cal">${e.cal} kcal</span>
        <span class="macro-tag tag-prot">${e.protein}g P</span>
        <span class="macro-tag tag-carb">${e.carbs}g C</span>
        <span class="macro-tag tag-fat">${e.fat}g F</span>
      </div>
      <button class="delete-btn" onclick="deleteEntry(${e.id})" title="Remove">✕</button>
    </div>
  `).join('');
}

// ---- Update Totals ----
function updateTotals() {
  setVal('totalCal',  totals.cal.toFixed(1));
  setVal('totalProt', totals.protein.toFixed(1));
  setVal('totalCarb', totals.carbs.toFixed(1));
  setVal('totalFat',  totals.fat.toFixed(1));
}

function setVal(id, val) {
  document.querySelector(`#${id} .val`).textContent = val;
}

// ---- Macro Bar ----
function updateMacroBar() {
  const totalMacros = totals.protein + totals.carbs + totals.fat;
  const pP = totalMacros ? (totals.protein / totalMacros * 100).toFixed(1) : 0;
  const pC = totalMacros ? (totals.carbs   / totalMacros * 100).toFixed(1) : 0;
  const pF = totalMacros ? (totals.fat     / totalMacros * 100).toFixed(1) : 0;

  document.getElementById('barProtein').style.width = pP + '%';
  document.getElementById('barCarbs').style.width   = pC + '%';
  document.getElementById('barFat').style.width     = pF + '%';

  document.getElementById('barProtein').textContent = pP > 8 ? `P ${pP}%` : '';
  document.getElementById('barCarbs').textContent   = pC > 8 ? `C ${pC}%` : '';
  document.getElementById('barFat').textContent     = pF > 8 ? `F ${pF}%` : '';
}

// ---- Utility ----
function capitalize(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}
