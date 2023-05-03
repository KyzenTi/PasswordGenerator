const form = document.querySelector('form');
const generateBtn = document.querySelector('#generate');

const MAX_REQUESTS = 10;
const REQUEST_RATE = 1; // 1 request per second
let tokens = MAX_REQUESTS;
let lastRequestTime = Date.now();

function getToken() {
  const now = Date.now();
  const timePassed = (now - lastRequestTime) / 1000; // in seconds
  lastRequestTime = now;
  tokens += timePassed * REQUEST_RATE;
  if (tokens > MAX_REQUESTS) {
    tokens = MAX_REQUESTS;
  }
  if (tokens < 1) {
    return false; // no token available
  }
  tokens--;
  return true; // token granted
}

generateBtn.addEventListener('click', function(e) {
  e.preventDefault();
  if (!getToken()) {
    alert('Quantidade de tentativas excedidas. Tente novamente em alguns instantes!');
    return;
  }
  const length = document.querySelector('#length').value;
  const uppercase = document.querySelector('#uppercase').checked;
  const lowercase = document.querySelector('#lowercase').checked;
  const numbers = document.querySelector('#numbers').checked;
  const symbols = document.querySelector('#symbols').checked;
  const password = generatePassword(length, uppercase, lowercase, numbers, symbols);
  if (password !== '') {
    document.querySelector('#password').value = password;
  }
  displayPassword(password)
});

function generatePassword(length, uppercase, lowercase, numbers, symbols) {
  let charset = '';
  if (!uppercase && !lowercase && !numbers && !symbols) {
    alert('Por favor, selecione ao menos uma opção!');
    return '';
  }
  if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (numbers) charset += '0123456789';
  if (symbols) charset += '!@#$%^&*()_+-={}[]|:;"<>,.?/~`';
  let password = '';
  const randomValues = new Uint32Array(length);
  window.crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    password += charset.charAt(randomValues[i] % charset.length);
  }
  return password;
}

function displayPassword(password) {
  const passwordContainer = document.querySelector('#password-container');
  const passwordEl = document.querySelector('#password');
  passwordEl.textContent = password;
  passwordContainer.style.display = 'block';
}

const copyBtn = document.querySelector('#copy');

copyBtn.addEventListener('click', function() {
  if (!getToken()) {
    alert('Quantidade de tentativas excedidas. Tente novamente em alguns instantes!');
    return;
  }
  const passwordEl = document.querySelector('#password');
  const textarea = document.createElement('textarea');
  textarea.value = passwordEl.textContent;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  alert('Senha copiada para área de transferência!');
});
