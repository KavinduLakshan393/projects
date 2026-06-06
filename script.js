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
// (This will be replaced in commit 8)

// ---------- Indications Fetching ----------

async function fetchIndication(identifier) {
  // identifier example: aspirin-oral -> drug name aspirin
  const generic = identifier.split('-')[0];
  const url = `https://www.drugs.com/${generic}.html`;
  const html = await fetch(PROXY_BASE + encodeURIComponent(url)).then(r => r.text());
  return parseIndication(html, generic);
}

function parseIndication(html, generic) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  // Look for the "What is ...?" section
  const heading = doc.querySelector('.contentBox h2');
  if (heading && heading.textContent.toLowerCase().includes('what is')) {
    const nextP = heading.nextElementSibling;
    if (nextP && nextP.tagName === 'P') {
      return { drug: generic, indication: nextP.textContent.trim() };
    }
  }
  // fallback: try any paragraph after "Uses" heading
  const usesHeading = Array.from(doc.querySelectorAll('h2, h3')).find(h => h.textContent.toLowerCase().includes('uses'));
  if (usesHeading) {
    const nextP = usesHeading.nextElementSibling;
    if (nextP && nextP.tagName === 'P') {
      return { drug: generic, indication: nextP.textContent.trim() };
    }
  }
  return { drug: generic, indication: 'Indication information not available.' };
}

// ---------- Results Rendering ----------

function renderResults(drugs, interactions, indications, duration) {
  let html = '';

  // Prescription summary
  html += '<div class="section"><h2>Your Prescription</h2><ul>';
  drugs.forEach(d => {
    html += `<li><strong>${d.route}</strong> – ${d.name} ${d.dosage} (${d.freq})</li>`;
  });
  html += `</ul><p><strong>Duration:</strong> ${duration}</p></div>`;

  // Interactions
  html += '<div class="section"><h2>Interactions</h2>';
  if (interactions.length === 0) {
    html += '<p>No interactions found.</p>';
  } else {
    interactions.forEach(i => {
      const severityClass = i.severity.toLowerCase();
      html += `
        <div class="interaction-card severity-${severityClass}">
          <h3>${i.drugPair} <span class="badge ${severityClass}">${i.severity}</span></h3>
          <p>${i.description}</p>
        </div>
      `;
    });
  }
  html += '</div>';

  // Indications
  html += '<div class="section"><h2>Indications (Why these medicines are used)</h2>';
  indications.forEach(ind => {
    html += `
      <div class="indication-card">
        <h3>${ind.drug}</h3>
        <p>${ind.indication}</p>
      </div>
    `;
  });
  html += '</div>';

  resultsDiv.innerHTML = html;
  resultsDiv.classList.remove('hidden');
}

// ---------- Loading State Management ----------

function setLoading(isLoading) {
  checkInteractionsBtn.disabled = isLoading;
  checkInteractionsBtn.textContent = isLoading ? 'Checking...' : 'Check Interactions';
  if (isLoading) {
    resultsDiv.innerHTML = '<p>Loading, please wait…</p>';
    resultsDiv.classList.remove('hidden');
  }
}

// ---------- Event Handlers ----------
checkInteractionsBtn.addEventListener('click', async () => {
  setLoading(true);
  try {
    const drugs = getSelectedDrugs();
    if (drugs.length < 2) {
      alert('Please select at least two medicines.');
      return;
    }
    const identifiers = drugs.map(d => d.identifier);
    const duration = durationInput.value.trim() || '(not specified)';
    
    const [interactions, indicationsArr] = await Promise.all([
      fetchInteractions(identifiers),
      Promise.all(identifiers.map(id => fetchIndication(id).catch(e => ({ drug: id.split('-')[0], indication: 'Error fetching indication.' }))))
    ]);
    renderResults(drugs, interactions, indicationsArr, duration);
  } catch (err) {
    console.error(err);
    resultsDiv.innerHTML = '<p>Something went wrong. Please try again later.</p>';
    resultsDiv.classList.remove('hidden');
  } finally {
    setLoading(false);
  }
});
