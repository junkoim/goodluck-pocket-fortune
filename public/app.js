const form = document.querySelector('#fortuneForm');
const formPanel = document.querySelector('#formPanel');
const resultPanel = document.querySelector('#resultPanel');
const reading = document.querySelector('#reading');
const loading = document.querySelector('#loading');
const errorBox = document.querySelector('#formError');
const submitButton = form.querySelector('button[type="submit"]');
const tarotInner = document.querySelector('#tarotInner');
const tarotImage = document.querySelector('#tarotImage');
const tarotFallback = document.querySelector('#tarotFallback');
const tarotFlip = document.querySelector('#tarotFlip');
const flipHint = document.querySelector('#flipHint');

const BACK_IMAGE = '/cards/back.webp';
const readingSections = [
  ['fortune', 'TODAY', '今日の運勢'],
  ['trade', 'TRADE FORTUNE', 'トレード運'],
  ['goldFortune', 'GOLD', 'ゴールド運'],
  ['fxFortune', 'FX', 'FX運'],
  ['mountainFortune', 'MOUNTAIN', '登山の運'],
  ['action', 'ONE STEP', '今日の一歩'],
  ['poem', 'POEM', 'カードからのポエム'],
  ['todayMessage', 'MESSAGE', '今日の言葉']
];

let currentResult = null;
let frontImage = '';
let frontIsReversed = false;
let cardIsOpen = false;
let flipBusy = false;

form.addEventListener('submit', async event => {
  event.preventDefault();
  errorBox.textContent = '';
  if (!form.reportValidity()) return;

  loading.hidden = false;
  submitButton.disabled = true;

  try {
    const payload = Object.fromEntries(new FormData(form).entries());
    const response = await fetch('/api/fortune', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || '占い結果を生成できませんでした。');
    await render(result);
  } catch (error) {
    errorBox.textContent = error instanceof Error ? error.message : '通信に失敗しました。時間をおいて再度お試しください。';
  } finally {
    loading.hidden = true;
    submitButton.disabled = false;
  }
});

async function render(result) {
  currentResult = result;
  reading.hidden = true;
  resultPanel.hidden = false;
  resultPanel.dataset.share = JSON.stringify(result);
  document.querySelector('#resultDate').textContent = result.date.replaceAll('-', '.');

  frontImage = normalizeCardPath(result.tarot?.image);
  frontIsReversed = result.orientation === '逆位置';
  await prepareCard(frontImage, `${result.cardNumber} ${result.cardName}`, result.tarot?.keyword || '');

  document.querySelector('#tarotNumber').textContent = result.cardNumber;
  document.querySelector('#tarotName').textContent = result.cardName;
  document.querySelector('#tarotKeyword').textContent = result.tarot?.keyword || '';
  document.querySelector('#tarotOrientation').textContent = result.orientation;
  document.querySelector('#cardKeyword').textContent = result.keyword || result.tarot?.keyword || '';
  renderReadingSections(result);
  document.querySelector('#luckyColor').textContent = result.luckyColor;
  document.querySelector('#luckyNumber').textContent = result.luckyNumber;

  resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function normalizeCardPath(path) {
  const file = String(path || '').replace(/^\/+/, '').replace(/^cards\//, '');
  return file ? `/cards/${file}` : '';
}

function renderReadingSections(result) {
  const container = document.querySelector('#fortuneDetails');
  container.textContent = '';

  for (const [key, labelEn, label] of readingSections) {
    const section = document.createElement('section');
    section.className = `reading-block reading-${key}`;

    const heading = document.createElement('p');
    heading.className = 'reading-label';
    const small = document.createElement('span');
    small.textContent = labelEn;
    const strong = document.createElement('strong');
    strong.textContent = label;
    heading.append(small, strong);

    section.append(heading);
    if (key === 'trade') {
      section.append(renderTradeFortune(result));
    } else {
      const body = document.createElement(key === 'poem' ? 'blockquote' : 'div');
      body.className = 'fortune-text';
      body.textContent = result[key] || '';
      section.append(body);
    }
    container.append(section);
  }
}

function renderTradeFortune(result) {
  const wrapper = document.createElement('div');
  wrapper.className = 'trade-fortune';
  const tradeScore = clampTradeScore(result.tradeScore);

  const stars = document.createElement('div');
  stars.className = 'trade-stars';
  stars.textContent = '★'.repeat(tradeScore) + '☆'.repeat(5 - tradeScore);
  stars.setAttribute('aria-label', `トレード運 5段階中${tradeScore}`);

  const body = document.createElement('div');
  body.className = 'fortune-text trade-text';
  body.textContent = result.tradeFortune || '';

  wrapper.append(stars, body);
  if (tradeScore < 3 && result.lotManagementWarning) {
    const warning = document.createElement('div');
    warning.className = 'trade-warning';
    const warningLabel = document.createElement('p');
    warningLabel.textContent = 'LOT MANAGEMENT';
    const warningText = document.createElement('div');
    warningText.className = 'fortune-text warning-text';
    warningText.textContent = result.lotManagementWarning;
    warning.append(warningLabel, warningText);
    wrapper.append(warning);
  }
  return wrapper;
}

function clampTradeScore(value) {
  const numeric = Math.round(Number(value));
  return Math.max(1, Math.min(5, Number.isFinite(numeric) ? numeric : 3));
}

function loadImage(url) {
  return new Promise(resolve => {
    if (!url) return resolve(false);
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = url;
  });
}

async function prepareCard(url, name, keyword) {
  cardIsOpen = false;
  flipBusy = false;
  tarotInner.classList.remove('is-turning', 'is-open');
  tarotImage.classList.remove('is-reversed');
  tarotImage.hidden = false;
  tarotImage.src = BACK_IMAGE;
  tarotImage.alt = 'タロットカードの裏面';
  tarotFallback.hidden = true;
  tarotFallback.querySelector('b').textContent = name;
  const ok = await loadImage(url);
  if (!ok) frontImage = '';
  tarotImage.dataset.frontAlt = `今日のカード ${name}。${keyword}`;
  flipHint.textContent = 'カードをクリックすると表面が現れます';
  tarotFlip.setAttribute('aria-pressed', 'false');
}

function revealReading() {
  if (!currentResult || !reading.hidden) return;
  reading.hidden = false;
  reading.animate?.(
    [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }],
    { duration: 520, easing: 'ease-out' }
  );
}

function flipCard() {
  if (flipBusy || cardIsOpen) return;
  flipBusy = true;
  tarotInner.classList.remove('is-open');
  tarotInner.classList.add('is-turning');
  const half = matchMedia('(prefers-reduced-motion: reduce)').matches ? 5 : 420;

  window.setTimeout(() => {
    if (frontImage) {
      tarotFallback.hidden = true;
      tarotImage.hidden = false;
      tarotImage.src = frontImage;
      tarotImage.alt = tarotImage.dataset.frontAlt || '今日のタロットカード';
      tarotImage.classList.toggle('is-reversed', frontIsReversed);
    } else {
      tarotImage.hidden = true;
      tarotImage.classList.remove('is-reversed');
      tarotFallback.hidden = false;
    }

    tarotInner.classList.remove('is-turning');
    tarotInner.classList.add('is-open');
    cardIsOpen = true;
    tarotFlip.setAttribute('aria-pressed', 'true');
    flipHint.textContent = 'カードの表面が現れました';
    revealReading();
    window.setTimeout(() => { flipBusy = false; }, half);
  }, half);
}

tarotFlip.addEventListener('click', () => flipCard());

document.querySelector('#retryButton').addEventListener('click', () => {
  resultPanel.hidden = true;
  reading.hidden = true;
  formPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelector('#shareButton').addEventListener('click', () => {
  const result = JSON.parse(resultPanel.dataset.share || '{}');
  const text = `GoodLuck Pocket 今日のタロット\n${result.cardNumber || ''} ${result.cardName || ''}\n${result.orientation || ''}\nトレード運 ${'★'.repeat(clampTradeScore(result.tradeScore))}${'☆'.repeat(5 - clampTradeScore(result.tradeScore))}\n\n${String(result.fortune || '').split('\n').slice(0, 4).join('\n')}\n\n#GoodLuckPocket #タロット占い`;
  const url = new URL('https://twitter.com/intent/tweet');
  url.searchParams.set('text', text);
  url.searchParams.set('url', location.href);
  window.open(url, '_blank', 'noopener,noreferrer');
});
