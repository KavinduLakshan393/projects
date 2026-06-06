/*
 * Prescription Interaction Checker
 * Uses Drugs.com via CORS proxy to fetch drug interactions and indications.
 * All data is processed in the browser – no server needed.
 */

const medicineRowsContainer = document.getElementById('medicine-rows');
const addRowBtn = document.getElementById('add-row');
const checkInteractionsBtn = document.getElementById('check-interactions');
const durationInput = document.getElementById('duration');
const resultsDiv = document.getElementById('results');

const MIN_ROWS = 2;
let rowCount = 0;

function createRow() {
  const row = document.createElement('div');
  row.className = 'medicine-row';
  row.innerHTML = `
    <select class="route">
      <option value="Oral">Oral</option>
      <option value="Topical">Topical</option>
      <option value="Injection">Injection</option>
      <option value="Inhalation">Inhalation</option>
      <option value="Ophthalmic">Ophthalmic</option>
      <option value="Otic">Otic</option>
      <option value="Nasal">Nasal</option>
      <option value="Rectal">Rectal</option>
      <option value="Vaginal">Vaginal</option>
      <option value="Other">Other</option>
    </select>
    <span class="drug-name-wrapper">
      <input type="text" class="drug-name" placeholder="Medicine name" autocomplete="off">
    </span>
    <input type="text" class="dosage" placeholder="80 mg">
    <input type="text" class="frequency" placeholder="e.g., twice daily">
    <button type="button" class="remove-row" title="Remove">−</button>
  `;

  // Remove button event
  row.querySelector('.remove-row').addEventListener('click', () => {
    if (rowCount > MIN_ROWS) {
      row.remove();
      rowCount--;
      updateRemoveButtons();
    }
  });

  return row;
}

function updateRemoveButtons() {
  const removeButtons = document.querySelectorAll('.remove-row');
  const disableRemove = rowCount <= MIN_ROWS;
  removeButtons.forEach(btn => btn.disabled = disableRemove);
}

function addRow() {
  const row = createRow();
  medicineRowsContainer.appendChild(row);
  rowCount++;
  updateRemoveButtons();
}

// Initialize with two rows
for (let i = 0; i < MIN_ROWS; i++) {
  addRow();
}

addRowBtn.addEventListener('click', addRow);

// ---------- Autocomplete ----------
const AUTOCOMPLETE_DELAY = 300;
const PROXY_BASE = 'https://api.allorigins.win/raw?url=';

let activeDropdown = null;

function createDropdown(input) {
  const dropdown = document.createElement('div');
  dropdown.className = 'autocomplete-dropdown';
  input.parentNode.style.position = 'relative';
  input.parentNode.appendChild(dropdown);
  return dropdown;
}

function removeDropdown() {
  if (activeDropdown) {
    activeDropdown.remove();
    activeDropdown = null;
  }
}

function handleAutocomplete(e) {
  const input = e.target;
  if (!input.classList.contains('drug-name')) return;

  const query = input.value.trim();
  if (query.length < 2) {
    removeDropdown();
    return;
  }

  // Debounce the request
  clearTimeout(input._debounceTimer);
  input._debounceTimer = setTimeout(async () => {
    try {
      const url = `https://www.drugs.com/ajax/autocomplete-search.html?term=${encodeURIComponent(query)}&type=0`;
      const resp = await fetch(PROXY_BASE + encodeURIComponent(url));
      if (!resp.ok) throw new Error('Network error');
      const data = await resp.json();

      // data is an array of objects like { value: "Aspirin (oral)", link: "/mtm/aspirin-oral.html" }
      if (!Array.isArray(data) || data.length === 0) {
        removeDropdown();
        return;
      }

      let dropdown = activeDropdown;
      if (!dropdown) {
        dropdown = createDropdown(input);
      }
      activeDropdown = dropdown;

      dropdown.innerHTML = data.slice(0, 8).map(item => {
        const identifier = item.link.replace('/mtm/', '').replace('.html', '');
        return `<div class="autocomplete-item" data-identifier="${identifier}">${item.value}</div>`;
      }).join('');

      // Add click listener to items
      dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', () => {
          input.value = item.textContent;
          input.dataset.identifier = item.dataset.identifier;
          removeDropdown();
        });
      });

    } catch (err) {
      console.error('Autocomplete error:', err);
      removeDropdown();
    }
  }, AUTOCOMPLETE_DELAY);
}

// Global input listener (delegated)
document.addEventListener('input', handleAutocomplete);

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  if (activeDropdown && !e.target.classList.contains('drug-name')) {
    removeDropdown();
  }
});

// ---------- Drug Selection & Interactions Fetching ----------

function getSelectedDrugs() {
  const rows = document.querySelectorAll('.medicine-row');
  const drugs = [];
  rows.forEach(row => {
    const drugInput = row.querySelector('.drug-name');
    const route = row.querySelector('.route').value;
    const dosage = row.querySelector('.dosage').value.trim();
    const freq = row.querySelector('.frequency').value.trim();
    const name = drugInput.value.trim();
    const identifier = drugInput.dataset.identifier;
    if (name && identifier) {
      drugs.push({ route, name, identifier, dosage, freq });
    }
  });
  return drugs;
}

async function fetchInteractions(identifiers) {
  const list = identifiers.join(',');
  const url = `https://www.drugs.com/interactions-check.php?drug_list=${encodeURIComponent(list)}`;
  const html = await fetch(PROXY_BASE + encodeURIComponent(url)).then(r => r.text());
  return parseInteractions(html);
}

function parseInteractions(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const interactions = [];

  // Drugs.com interaction blocks – typical structure may change, we'll use generic selectors
  const interactionBlocks = doc.querySelectorAll('.interactions-container .interaction');
  // Fallback: if no .interaction, try broader selector
  const blocks = interactionBlocks.length ? interactionBlocks : doc.querySelectorAll('.ddc-mgb-2');

  blocks.forEach(block => {
    try {
      const drugNamesElem = block.querySelector('h3, .drug-names');
      if (!drugNamesElem) return;
      const drugText = drugNamesElem.textContent.trim(); // e.g., "aspirin + ibuprofen"
      const severityElem = block.querySelector('.intmajor, .intmoderate, .intminor');
      let severity = 'Unknown';
      if (severityElem) {
        if (severityElem.classList.contains('intmajor')) severity = 'Major';
        else if (severityElem.classList.contains('intmoderate')) severity = 'Moderate';
        else if (severityElem.classList.contains('intminor')) severity = 'Minor';
      }
      const descElem = block.querySelector('p');
      const description = descElem ? descElem.textContent.trim() : '';

      interactions.push({
        drugPair: drugText,
        severity,
        description
      });
    } catch (e) {
      // ignore malformed blocks
    }
  });
  return interactions;
}

// Temporary: on button click, test the pipeline
checkInteractionsBtn.addEventListener('click', async () => {
  const drugs = getSelectedDrugs();
  if (drugs.length < 2) {
    alert('Please select at least two medicines.');
    return;
  }
  const identifiers = drugs.map(d => d.identifier);
  try {
    const interactions = await fetchInteractions(identifiers);
    console.log('Interactions:', interactions);
  } catch (err) {
    console.error('Failed to fetch interactions:', err);
  }
});
