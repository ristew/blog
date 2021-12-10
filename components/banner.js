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

export default function Banner() {
  const [windowWidth, windowHeight] = useWindowSize();
  const [bs, setBs] = useState(2);
  const [breadth, setBreadth] = useState(32);
  const height = bs * breadth;
  let interval;
  useEffect(async () => {
    const canvas = document.getElementById('banner');
    const ctx = canvas.getContext('2d');
    const dpi = window.devicePixelRatio;
    ctx.clearRect(0, 0, 9999, 9999);
    canvas.height = height * dpi;
    canvas.setAttribute('width', dpi * getComputedStyle(canvas).getPropertyValue('width').slice(0, -2));
    canvas.setAttribute('height', dpi * getComputedStyle(canvas).getPropertyValue('height').slice(0, -2));
    let automata = new WolframAutomata(30, breadth);
    let x = 0;
    const tooltip = document.querySelector('#banner-tooltip');

    ctx.fillStyle = 'black';
    ctx.imageSmoothingEnabled = false;
    const bsd = bs * dpi;

    console.log(canvas.clientWidth, dpi);
    for (let x = 0; x < dpi * canvas.clientWidth / bs; x++) {
      const col = automata.nextState();
      for (let v = 0; v < col.length; v++) {
        if (col[v]) {
          ctx.fillRect(bs * dpi * x, bs * dpi * v, bs * dpi, bs * dpi);
        }
      }
    }
  });

  return (
    <>
      <canvas id="banner" className="w-full" height={height}>
      </canvas>
    {/* <div id="banner-tooltip" style={{ position: 'absolute', top: height + 4, left: windowWidth - 32, }}>ⓘ</div> */}
    </>
  );
}
