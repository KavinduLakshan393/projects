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
    <input type="text" class="drug-name" placeholder="Medicine name" autocomplete="off">
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
