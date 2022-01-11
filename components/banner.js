import { useEffect, useState, useLayoutEffect } from 'react';
import { WolframAutomata } from '../lib/wolfram';
import { wait } from '../lib/util';

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

const StateLink = ({ setter, num }) => {
  return (
    <a href="" className="link" onClick={e => {
      e.preventDefault();
      setter(+num);
    }}>{num}</a>
  )
};

const ValueChanger = ({ name, value, setter, presets }) => {
  const presetLinks = presets.map((p, i) => {
    if (typeof p === 'number') {
      return (
        <span>
          <StateLink setter={setter} num={p} />
        </span>
      );
    } else if (typeof p === 'object') {

      return <a href="" className="link" onClick={e => {
        e.preventDefault();
        p.action();
      }}>{p.text}</a>
    }
  }).map((p, i) => {
    return (
      <span key={`preset-${i}`}>
        {p}{ i !== presets.length - 1 ? (<span className="text-stone-500">, </span>) : '' }
      </span>
    );
  })
  return (
    <p>
      {name}: <input key={`preset-${name}`} className="w-12" type="number" value={value} onChange={e => setter(+e.target.value)}/>
    <span> try </span>{presetLinks}
  </p>);
}

function colorMod(row, x) {
  const w = 155;
  return wrapMod(row, x) * (w / x);
}

function wrapMod(n, r) {
  let res = Math.abs(2 * n % (r * 2) - r);
  return res;
}

function cellColor(row, frameRatio) {
  const basis = 20 + 60 * frameRatio;
  const r = colorMod(row, 23) + basis;
  const g = colorMod(row, 37) + basis;
  const b = colorMod(row, 53) + basis;
  return `rgb(${r}, ${g}, ${b})`;
}

export default function Banner() {
  const [windowWidth, windowHeight] = useWindowSize();
  const [bs, setBs] = useState(2);
  if (bs < 1) {
    setBs(1);
  }
  const [windowSize, setWindowSize] = useState(51);
  const [rule, setRule] = useState(30);
  if (rule < 0) {
    return setRule(0);
  } else if (rule > 255) {
    return setRule(255);
  }
  const [showInfo, setShowInfo] = useState(false);
  const [seed, setSeed] = useState(123);
  const [color, setColor] = useState(false);
  const toggleColor = () => setColor(!color);
  const [animateSpeed, setAnimateSpeed] = useState(0);
  const height = bs * windowSize - 2;
  let interval;
  const randomizeSeed = () => {
    setSeed(Math.round(Math.random() * (500 + 2 * windowSize) + windowSize))
  };


  useEffect(async () => {
    const canvas = document.getElementById('banner');
    const ctx = canvas.getContext('2d');
    const dpi = window.devicePixelRatio;
    ctx.clearRect(0, 0, 9999, 9999);
    canvas.height = height * dpi;
    // https://medium.com/wdstack/fixing-html5-2d-canvas-blur-8ebe27db07da
    canvas.setAttribute('width', dpi * getComputedStyle(canvas).getPropertyValue('width').slice(0, -2));
    canvas.setAttribute('height', dpi * getComputedStyle(canvas).getPropertyValue('height').slice(0, -2));
    let automata = new WolframAutomata(rule, windowSize);
    if (seed > 0) {
      automata.randomSeed(seed);
    }
    let x = 0;
    const tooltip = document.querySelector('#banner-tooltip');

    ctx.fillStyle = 'black';
    ctx.imageSmoothingEnabled = false;
    const bsd = bs * dpi;

    let row = 0;
    let offset = 0;
    const renderAutomataRow = () => {
      const col = automata.nextState();
      for (let v = 0; v < col.length; v++) {
        if (col[v]) {
          if (color) {
            ctx.fillStyle = cellColor(row, v / col.length);
          }
          ctx.fillRect(bs * dpi * row - offset, bs * dpi * v, bs * dpi, bs * dpi);
        }
      }
      row++;
    }
    while (row < dpi * canvas.clientWidth / bs + 1) {
      renderAutomataRow();
    }
  });

  return (
    <>
      <canvas id="banner" className="border-b-2 border-stone-400 hover:cursor-help w-full" onClick={e => {
        window.scrollTo(0, 0);
        setShowInfo(!showInfo);
      }} height={height}>
      </canvas>
      <div id="banner-info" className="md:ml-20 ml-5 font-serif h-full" hidden={!showInfo}>
        <ValueChanger name="rule" value={rule} setter={setRule} presets={[30, 45, 90, 105, 110]} />
        <ValueChanger name="window size" value={windowSize} setter={setWindowSize} presets={[22, 51, 101, 251, 901]} />
        <ValueChanger name="cell size" value={bs} setter={setBs} presets={[1, 2, 4, 8]} />
        <ValueChanger name="seed" value={seed} setter={setSeed} presets={[0, windowSize + 42, { text: 'random', action: randomizeSeed }]} />
        <p><a href="" className="link" onClick={e => {
          e.preventDefault();
          toggleColor();
        }}>{color ? 'no' : ''} color</a></p>
        <p><a href="" className="link" onClick={e => {
          e.preventDefault();
          setShowInfo(false);
        }}>hide controls</a></p>
        <p><a href="/posts/banner" className="link">more info</a></p>
      </div>
    </>
  );
}
