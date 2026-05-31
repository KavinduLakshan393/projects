const passwordInput = document.getElementById('password');

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

  let password = '';
  for (let i = 0; i < opts.length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

function updatePassword() {
  passwordInput.value = generatePassword();
  
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