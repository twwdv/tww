let trendFlipElement = null;

async function A() {
  const B = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart';
  const C = Math.floor(Date.now() / 1e3);

  try {
    const E = await fetch(`${B}?vs_currency=usd&days=147&interval=daily`);
    if (!E.ok) throw new Error('Network response was not ok');

    const F = await E.json();
    const G = F.prices;

    const H = G.reduce((I, J) => I + J[1], 0) / G.length;

    const K = G[G.length - 1][1];
    const L = K > H;

    const M = document.getElementById('statusText');
    const N = document.createElement('p');
    const trendFlipPrice = H.toFixed(2);

    if (!trendFlipElement) {
      trendFlipElement = document.createElement('p');
      trendFlipElement.classList.add(L ? 'red-text' : 'green-text');
      M.parentNode.appendChild(trendFlipElement);
    }

    if (L) {
      M.textContent = `Current Bitcoin trend is: Bullish.`;
      M.classList.add('bullish');
      let O = null;
      for (let P = G.length - 1; P >= 0; P--) {
        if (G[P][1] < H) {
          O = new Date(G[P][0]);
          break;
        }
      }
      if (O) {
        N.textContent = `Last time Bitcoin trend was Bearish: ${O.toDateString()}.`;
        N.classList.add('red-text');
      } else {
        N.textContent = 'red';
        N.classList.add('red-text');
      }
    } else {
      M.textContent = `Current Bitcoin trend is: Bearish.`;
      M.classList.add('bearish');
      let Q = null;
      for (let R = G.length - 1; R >= 0; R--) {
        if (G[R][1] > H) {
          Q = new Date(G[R][0]);
          break;
        }
      }
      if (Q) {
        N.textContent = `Last time Bitcoin trend was Bullish: ${Q.toDateString()}.`;
        N.classList.add('green-text');
      } else {
        N.textContent = 'green';
        N.classList.add('green-text');
      }
    }

    const S = document.querySelector('.lastTimeElement');
    if (S) S.parentNode.removeChild(S);

    N.classList.add('lastTimeElement');
    M.parentNode.appendChild(N);

    const trendFlipText = L
      ? `A close below $${Math.floor(trendFlipPrice)} for Bitcoin might suggest a bearish trend reversal.`
      : `Bitcoin must settle above $${Math.floor(trendFlipPrice)} to signal a bullish trend reversal.`;

    trendFlipElement.textContent = trendFlipText;
  } catch (T) {
    console.error('Error fetching data:', T);
    const U = document.getElementById('statusText');
    U.textContent = 'Error fetching data';
    U.style.color = 'gray';
  }
}

async function V() {
  const W = document.getElementById('lastUpdated');

  try {
    const X = document.getElementById('statusText');
    X.textContent = 'Loading...';

    await A();

    const Y = new Date();
    const Z = `Last Updated: ${Y.toLocaleString()}`;
    W.textContent = Z;
  } catch (AA) {
    console.error('Error fetching data:', AA);
    const AB = document.getElementById('statusText');
    AB.textContent = 'Error fetching data';
    AB.style.color = 'gray';
  }

  setTimeout(V, 5 * 60 * 1e3);
}

V();