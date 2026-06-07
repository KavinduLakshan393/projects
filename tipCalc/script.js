const billInput = document.getElementById('bill');
const tipInput = document.getElementById('tip');
const peopleInput = document.getElementById('people');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');
const resultDiv = document.getElementById('result');
const tipQuickBtns = document.querySelectorAll('.tip-quick');

// Quick tip buttons
tipQuickBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tipValue = btn.getAttribute('data-tip');
    tipInput.value = tipValue;
    // Auto-calculate for better UX
    if (billInput.value && peopleInput.value) calculateTip();
  });
});

function calculateTip() {
  const bill = parseFloat(billInput.value);
  const tipPercent = parseFloat(tipInput.value);
  const people = parseInt(peopleInput.value);

  // Validation
  if (isNaN(bill) || isNaN(tipPercent) || isNaN(people)) {
    showError('❌ Please fill bill, tip % and number of people');
    return;
  }
  if (bill <= 0) {
    showError('❌ Bill amount must be greater than 0');
    return;
  }
  if (tipPercent < 0) {
    showError('❌ Tip percentage cannot be negative');
    return;
  }
  if (people < 1) {
    showError('❌ Number of people must be at least 1');
    return;
  }

  const totalTip = (bill * tipPercent) / 100;
  const totalBill = bill + totalTip;
  const tipPerPerson = totalTip / people;
  const totalPerPerson = totalBill / people;

  resultDiv.classList.remove('error');
  resultDiv.innerHTML = `
    <strong>💰 Tip per person:</strong> $${tipPerPerson.toFixed(2)}<br>
    <strong>🍽️ Total per person:</strong> $${totalPerPerson.toFixed(2)}<br>
    <small>Total tip: $${totalTip.toFixed(2)} | Total bill: $${totalBill.toFixed(2)}</small>
  `;
}

function showError(message) {
  resultDiv.classList.add('error');
  resultDiv.innerHTML = message;
}

function resetForm() {
  billInput.value = '';
  tipInput.value = '';
  peopleInput.value = '';
  resultDiv.innerHTML = '';
  resultDiv.classList.remove('error');
}

calculateBtn.addEventListener('click', calculateTip);
resetBtn.addEventListener('click', resetForm);

// Optional: real-time validation hints
[billInput, peopleInput, tipInput].forEach(input => {
  input.addEventListener('input', () => {
    if (resultDiv.innerHTML && !resultDiv.classList.contains('error')) {
      calculateTip();
    }
  });
});