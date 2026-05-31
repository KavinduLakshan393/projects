const passwordInput = document.getElementById('password');

const AMBIGUOUS = '1lI0Oo';

const charSets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
};

function getOptions() {
  return {
    length: +document.getElementById('length').value,
    uppercase: document.getElementById('uppercase').checked,
    lowercase: document.getElementById('lowercase').checked,
    numbers: document.getElementById('numbers').checked,
    symbols: document.getElementById('symbols').checked,
    avoidAmbiguous: document.getElementById('ambiguous').checked
  };
}

function generatePassword() {
  const opts = getOptions();
  let charset = '';
  if (opts.uppercase) charset += charSets.uppercase;
  if (opts.lowercase) charset += charSets.lowercase;
  if (opts.numbers) charset += charSets.numbers;
  if (opts.symbols) charset += charSets.symbols;

  // If nothing selected, force lowercase
  if (charset === '') {
    charset = charSets.lowercase;
  }

  if (opts.avoidAmbiguous) {
    charset = charset.split('').filter(ch => !AMBIGUOUS.includes(ch)).join('');
    // Edge case: if all chars are ambiguous, revert to original charset
    if (charset === '') charset = charSets.lowercase;
  }

  let password = '';
  for (let i = 0; i < opts.length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

function updateStrength(password) {
  const opts = getOptions();
  let charset = '';
  if (opts.uppercase) charset += charSets.uppercase;
  if (opts.lowercase) charset += charSets.lowercase;
  if (opts.numbers) charset += charSets.numbers;
  if (opts.symbols) charset += charSets.symbols;
  if (charset === '') charset = charSets.lowercase;
  if (opts.avoidAmbiguous) {
    charset = charset.split('').filter(ch => !AMBIGUOUS.includes(ch)).join('');
    if (charset === '') charset = charSets.lowercase;
  }

  const poolSize = charset.length;
  const entropy = password.length * Math.log2(poolSize);
  const meterFill = document.getElementById('meter-fill');
  const strengthText = document.getElementById('strength-text');

  meterFill.style.width = Math.min(100, (entropy / 100) * 100) + '%';

  let color, label;
  if (entropy < 40) { color = '#e74c3c'; label = 'Weak'; }
  else if (entropy < 60) { color = '#f1c40f'; label = 'Medium'; }
  else { color = '#2ecc71'; label = 'Strong'; }

  meterFill.style.background = color;
  strengthText.textContent = label + ` (${entropy.toFixed(1)} bits)`;
}

function updatePassword() {
  const pwd = generatePassword();
  passwordInput.value = pwd;
  updateStrength(pwd);
}


updatePassword();

// Attach listeners
document.getElementById('length').addEventListener('input', (e) => {
  document.getElementById('length-value').textContent = e.target.value;
  updatePassword();
});

document.querySelectorAll('.options input[type="checkbox"]').forEach(cb => {
  cb.addEventListener('change', updatePassword);
});