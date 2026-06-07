const billInput = document.getElementById('bill');
const tipInput = document.getElementById('tip');
const peopleInput = document.getElementById('people');
const calculateBtn = document.getElementById('calculateBtn');
const resultDiv = document.getElementById('result');

function calculateTip() {
  const bill = parseFloat(billInput.value);
  const tipPercent = parseFloat(tipInput.value);
  const people = parseInt(peopleInput.value);

  if (isNaN(bill) || isNaN(tipPercent) || isNaN(people)) {
    resultDiv.innerHTML = '⚠️ Please fill all fields';
    return;
  }

  const totalTip = (bill * tipPercent) / 100;
  const totalBill = bill + totalTip;
  const tipPerPerson = totalTip / people;
  const totalPerPerson = totalBill / people;

  resultDiv.innerHTML = `
    <strong>💰 Tip per person:</strong> $${tipPerPerson.toFixed(2)}<br>
    <strong>🍽️ Total per person:</strong> $${totalPerPerson.toFixed(2)}<br>
    <small>Total tip: $${totalTip.toFixed(2)} | Total bill: $${totalBill.toFixed(2)}</small>
  `;
}

calculateBtn.addEventListener('click', calculateTip);