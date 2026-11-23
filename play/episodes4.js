/* Evan & Aama, Season 4: Frosty Moon, First Principles */
(function(){
  const EPISODES = window.EPISODES;

  /* ---------- helpers ---------- */
  function moveTo(E, id, dx, dy, ms, sc, rot){ const n = E.node(id); n.style.transformBox = 'fill-box'; n.style.transformOrigin = 'center'; n.style.transition = `transform ${ms||800}ms ease-in-out`; n.style.transform = `translate(${dx}px,${dy}px)` + (sc != null ? ` scale(${sc})` : '') + (rot ? ` rotate(${rot}deg)` : ''); return E.wait(ms || 800); }
  const hide = (E, id) => { E.node(id).style.display = 'none'; };
  const show = (E, id) => { E.node(id).style.display = ''; };
  const fill = (E, id, c) => { E.node(id).setAttribute('fill', c); };
  async function swap(E, markup, front){
    const sc = E.$('scene');
    await E.anim(sc, [{opacity:1},{opacity:0}], {duration:450, fill:'forwards'});
    sc.innerHTML = markup; E.$('front').innerHTML = front || '';
    await E.anim(sc, [{opacity:0},{opacity:1}], {duration:450, fill:'forwards'});
  }
  const txt = (x, y, s, size, color, weight) => `<text x="${x}" y="${y}" font-family="Fredoka,sans-serif" font-size="${size||28}" font-weight="${weight||600}" fill="${color||'#24324A'}" text-anchor="middle">${s}</text>`;
  function rng(seed){ let s = seed; return () => (s = (s * 9301 + 49297) % 233280) / 233280; }
  function stars(seed, n, y1){ const r = rng(seed); let o = ''; for(let i = 0; i < (n||90); i++){ const x = r()*900, y = r()*(y1||1000), z = r(); o += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(z*2.2+0.6).toFixed(1)}" fill="#fff" opacity="${(0.4+z*0.6).toFixed(2)}"/>`; } return o; }
  const sky = (seed) => `<rect width="900" height="1000" fill="#0B1030"/>` + stars(seed, 110, 560);
  const slot = (id, x, y, w, h, inner) => `<g id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="#F4F7FB"/><g transform="translate(${x} ${y})">${inner}</g></g>`;
  const three = (ids, inners, y, h) => ids.map((id, i) => slot(id, 392 + i*100, y || 816, 76, h || 128, inners[i])).join('');
  const two = (ids, inners, y, h) => ids.map((id, i) => slot(id, 395 + i*150, y || 816, 100, h || 130, inners[i])).join('');
  const tray = (id, x, y, w, h, inner) => `<g id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="#FFFFFF" opacity=".96" stroke="#C9D3E2" stroke-width="4"/>${inner}</g>`;
  function screen(id, x, y, w, h, faces, label){
    const fw = w / faces.length;
    let o = `<g id="${id}"><rect x="${x-8}" y="${y-8}" width="${w+16}" height="${h+40}" rx="14" fill="#1B2240" stroke="#9AA5B4" stroke-width="4"/><defs><clipPath id="${id}c"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/></clipPath></defs><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#BFE0F5"/><g clip-path="url(#${id}c)">`;
    faces.forEach(([k, ratio], i) => { const iw = fw * 1.1, ih = iw / ratio; o += `<image href="cast/${k}.webp" x="${x + i*fw - fw*.05}" y="${y + 6}" width="${iw}" height="${ih}"/>`; });
    return o + `</g>${txt(x + w/2, y + h + 24, label || 'Call from Earth', 18, '#BFE0F5', 700)}</g>`;
  }
  /* outpost room: metal wall, icy window, floor */
  function room(inner, opts){
    opts = opts || {};
    return `<defs><linearGradient id="owall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${opts.top||'#46557A'}"/><stop offset="1" stop-color="${opts.bot||'#2C3654'}"/></linearGradient></defs>` +
      `<rect width="900" height="1000" fill="url(#owall)"/>` +
      `<g stroke="#5B6B90" stroke-width="3" opacity=".6">${[150,300,450,600,750].map(x => `<path d="M${x} 260V790"/>`).join('')}<path d="M0 520H900"/></g>` +
      (opts.window === false ? '' : `<g><rect x="40" y="300" width="210" height="150" rx="24" fill="#0B1030" stroke="#9AA5B4" stroke-width="10"/><clipPath id="owin"><rect x="45" y="305" width="200" height="140" rx="20"/></clipPath><g clip-path="url(#owin)">${stars(41, 25, 450)}<path d="M40 420 Q110 395 170 410 T260 400 V460 H40Z" fill="#DDEBFA"/></g></g>`) +
      (inner || '') +
      `<rect y="790" width="900" height="210" fill="#5D6B80"/><path d="M0 790H900" stroke="#9AA5B4" stroke-width="8"/><g stroke="#4A5568" stroke-width="3">${[100,250,400,550,700,850].map(x => `<path d="M${x} 800V1000"/>`).join('')}</g>`;
  }
  /* icy moon outside */
  function ice(inner, opts){
    opts = opts || {};
    return sky(opts.seed || 44) + (opts.planet === false ? '' : `<circle cx="700" cy="340" r="50" fill="#8FB7E8"/><ellipse cx="700" cy="340" rx="86" ry="13" fill="none" stroke="#C9DDF5" stroke-width="5" opacity=".8"/>`) +
      `<path d="M0 560 Q220 520 460 550 T900 530 V1000 H0Z" fill="#C7DCF2"/><path d="M0 640 Q260 600 520 625 T900 610 V1000 H0Z" fill="#E4EFFA"/>` +
      `<path d="M130 600 l30 -40 l26 40z M690 590 l24 -34 l22 34z" fill="#B3CDEA"/>` + (inner || '');
  }
  /* Glimmer, the glowing friend */
  const glimmer = (x, y, s) => `<g id="glim" transform="translate(${x} ${y}) scale(${s||1})"><defs><radialGradient id="glimG"><stop offset="0" stop-color="#E9FFFE"/><stop offset=".55" stop-color="#5FF6FF"/><stop offset="1" stop-color="#5FF6FF" stop-opacity="0"/></radialGradient></defs>` +
    `<g id="glimGlow"><circle r="120" fill="url(#glimG)" opacity=".55"/></g>` +
    `<g id="glimBody"><path d="M-62 10 Q-62 -60 0 -62 Q62 -60 62 10 Q50 20 40 12 Q30 22 20 12 Q10 22 0 12 Q-10 22 -20 12 Q-30 22 -40 12 Q-50 20 -62 10Z" fill="#9AF4FF" stroke="#E9FFFE" stroke-width="4"/>` +
    `<path d="M-40 14 q-6 30 4 52 M-14 16 q-6 34 4 58 M14 16 q6 34 -4 58 M40 14 q6 30 -4 52" stroke="#9AF4FF" stroke-width="6" fill="none" stroke-linecap="round"/>` +
    `<circle cx="-20" cy="-20" r="9" fill="#1B2240"/><circle cx="20" cy="-20" r="9" fill="#1B2240"/><circle cx="-17" cy="-23" r="3" fill="#fff"/><circle cx="23" cy="-23" r="3" fill="#fff"/><path d="M-12 0 q12 10 24 0" stroke="#1B2240" stroke-width="4" fill="none" stroke-linecap="round"/></g></g>`;
  const glow = (E, n, on, off) => E.anim(E.node('glimGlow'), [{opacity:.3},{opacity:1},{opacity:.3}], {duration:(on||420)+(off||300), iterations:n});
  function crew(E, opts){
    opts = opts || {};
    E.evanSuit(true);
    E.evanSet(opts.ex || 275, opts.ey || 955);
    E.aamaSet(opts.ax || 790, opts.ay || 945);
    const helper = opts.helper === undefined ? 'shivu' : opts.helper;
    if(helper) E.person(helper, opts.hx || 95, 945, { img: helper + 'sp', scale: opts.hs || 1 });
  }
  const bubbles = (x, y, w, n) => Array.from({length:n||6}, (_, i) => `<circle class="bub" cx="${x + 10 + (i*37)%(w-20)}" cy="${y}" r="${4 + i%3*2}" fill="#E9FFF0" opacity=".85" style="animation:bubUp ${1.6 + (i%3)*.5}s ${i*.3}s infinite linear"/>`).join('');
  const style = `<style>@keyframes bubUp{0%{transform:translateY(0);opacity:0}15%{opacity:.9}100%{transform:translateY(-230px);opacity:0}} .blink{animation:blinkA .7s infinite steps(2)} @keyframes blinkA{to{opacity:.15}}</style>`;

  /* ================= EPISODE 37: The Green Bubbles ================= */
  const algaeRoom = () => room(style +
    `<g id="tanks">${[0,1].map(i => `<g><rect x="${400+i*150}" y="420" width="120" height="300" rx="16" fill="#E8F2FF" opacity=".35" stroke="#9AA5B4" stroke-width="6"/><rect id="tw${i}" x="${406+i*150}" y="470" width="108" height="244" rx="12" fill="#D9D27A"/><rect x="${396+i*150}" y="410" width="128" height="20" rx="8" fill="#9AA5B4"/><rect x="${396+i*150}" y="716" width="128" height="74" rx="8" fill="#7D8794"/></g>`).join('')}</g>` +
    `<g id="tankBub" style="display:none">${bubbles(410, 700, 100, 6)}${bubbles(560, 700, 100, 6)}</g>` +
    `<g id="lamp"><rect x="420" y="300" width="240" height="40" rx="14" fill="#5D6B80" stroke="#9AA5B4" stroke-width="4"/><rect id="lampGlow" x="434" y="330" width="212" height="18" rx="8" fill="#4A5568"/><path d="M540 300V262" stroke="#9AA5B4" stroke-width="6"/></g>` +
    `<g id="light" style="display:none"><path d="M430 348 L390 720 H690 L650 348Z" fill="#FFF3A3" opacity=".22"/></g>`);
  EPISODES.push({ n:37, season:4, title:'The Green Bubbles', icon:'🫧', setting:'Frosty Moon, the Algae Room',
    tip:'Open a window when a room feels stuffy. Fresh air helps everyone feel better.',
    grown:'Photosynthesis: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. Plants and algae use light to turn carbon dioxide and water into sugar, and give off oxygen.',
    scene: algaeRoom,
    async run(E){
      crew(E);
      await E.say('title');
      await E.say('e_moon');
      await E.say('a_outpost');
      await E.say('s_stuffy');
      await E.say('e_yellow');
      await E.say('a_know');
      await E.say('e_truth');
      await E.tap('aama', 'a_tapme');
      E.scan('lamp'); await E.say('a_scan'); E.scanOff();
      E.$('front').innerHTML = tray('jars', 380, 800, 280, 160, two(['jDark', 'jLight'], [
        `<rect width="100" height="130" rx="14" fill="#2C3654"/><rect x="22" y="34" width="56" height="84" rx="10" fill="#C9C46E"/>${txt(50, 26, 'dark', 20, '#BFE0F5', 700)}`,
        `<rect width="100" height="130" rx="14" fill="#FFF6D6"/><circle cx="50" cy="18" r="12" fill="#FFD43B"/><rect x="22" y="34" width="56" height="84" rx="10" fill="#5DBB63"/><g id="jBub" style="display:none">${bubbles(24, 112, 52, 4)}</g>`]));
      await E.say('a_jars');
      await E.choice(['jDark', 'jLight'], 'jLight', 'a_which');
      show(E, 'jBub');
      await E.say('e_bubbles');
      await E.say('a_light');
      E.$('front').innerHTML = '';
      await E.taps('lamp', 3, 'a_fix', async () => { E.sfx.click(); });
      fill(E, 'lampGlow', '#FFE066'); show(E, 'light'); E.sfx.bell();
      for(const c of ['#B9CF6E', '#8FC46A', '#4FAF5E']){ fill(E, 'tw0', c); fill(E, 'tw1', c); await E.wait(450); }
      show(E, 'tankBub');
      await E.say('e_green');
      await E.say('s_fresh');
      await E.say('a_truth');
    }
  });

  /* ================= EPISODE 38: Sour Water ================= */
  const sourRoom = () => room(style +
    `<g>${[0,1].map(i => `<g><rect x="${400+i*150}" y="420" width="120" height="300" rx="16" fill="#E8F2FF" opacity=".35" stroke="#9AA5B4" stroke-width="6"/><rect id="sw${i}" x="${406+i*150}" y="470" width="108" height="244" rx="12" fill="${i ? '#C8CC74' : '#4FAF5E'}"/><rect x="${396+i*150}" y="410" width="128" height="20" rx="8" fill="#9AA5B4"/><rect x="${396+i*150}" y="716" width="128" height="74" rx="8" fill="#7D8794"/></g>`).join('')}</g>` +
    `<g id="sBub0">${bubbles(410, 700, 100, 6)}</g><g id="sBub1" style="display:none">${bubbles(560, 700, 100, 6)}</g>` +
    `<g id="chart" transform="translate(400 300)"><rect width="270" height="64" rx="12" fill="#F4F7FB" stroke="#9AA5B4" stroke-width="3"/>${[['#F08C2B','sour'],['#F2D33B',''],['#4FAF5E','just right'],['#4C7BD9',''],['#7A4FC4','soapy']].map(([c,l],i) => `<rect x="${12+i*50}" y="10" width="46" height="26" rx="6" fill="${c}"/>`).join('')}${txt(37, 56, 'sour', 16, '#5A4A1A', 700)}${txt(137, 56, 'just right', 16, '#2E7D32', 700)}${txt(237, 56, 'soapy', 16, '#4A3A8A', 700)}</g>`);
  EPISODES.push({ n:38, season:4, title:'Sour Water', icon:'🧪', setting:'Frosty Moon, the Algae Room',
    tip:'Never taste anything from a lab or a cleaning cupboard. Grown-ups use tests to check, not tongues.',
    grown:'pH tells how acidic water is: 7 is neutral, below 7 is acidic. Extra CO₂ makes carbonic acid. Baking soda (NaHCO₃) is a base that brings the pH back up toward 7.',
    scene: sourRoom,
    async run(E){
      crew(E);
      await E.say('title');
      await E.say('e_one');
      await E.say('s_light');
      await E.say('a_know');
      await E.say('e_truth');
      await E.tap('aama', 'a_tapme');
      E.scan('sw1'); await E.say('a_scan'); E.scanOff();
      E.$('front').innerHTML = tray('kit', 380, 790, 280, 170,
        `<g id="strip"><rect x="410" y="812" width="26" height="128" rx="6" fill="#FFFFFF" stroke="#9AA5B4" stroke-width="3"/><rect id="stripTip" x="413" y="900" width="20" height="36" rx="4" fill="#EDEDED"/></g>` +
        `<g id="soda"><rect x="480" y="830" width="80" height="110" rx="12" fill="#E8F4FF" stroke="#2F6FD6" stroke-width="4"/>${txt(520, 880, 'baking', 15, '#2F6FD6', 700)}${txt(520, 900, 'soda', 15, '#2F6FD6', 700)}</g>` +
        `<g id="spoon"><ellipse cx="612" cy="842" rx="22" ry="14" fill="#C9D3E2"/><rect x="606" y="852" width="12" height="90" rx="6" fill="#C9D3E2"/></g>`);
      await E.tap('strip', 'a_dip');
      E.sfx.plop(); fill(E, 'stripTip', '#F08C2B');
      await E.say('e_orange');
      await E.say('a_sour');
      await E.say('e_taste');
      await E.say('a_never');
      const steps = ['#F2D33B', '#9CC54A', '#4FAF5E'];
      await E.taps('spoon', 3, 'a_spoon', async i => { E.sfx.plop(); fill(E, 'stripTip', steps[i-1]); fill(E, 'sw1', ['#AFC56E','#7CBB62','#4FAF5E'][i-1]); await E.wait(350); });
      E.$('front').innerHTML = '';
      show(E, 'sBub1'); E.sfx.bell();
      await E.say('e_right');
      await E.say('s_test');
      await E.say('a_truth');
    }
  });

  /* ================= EPISODE 39: Squeeze the Pipe ================= */
  const pipeRoom = () => room(style +
    `<g id="pump"><rect x="355" y="560" width="80" height="120" rx="14" fill="#7D8794" stroke="#9AA5B4" stroke-width="4"/><circle cx="395" cy="600" r="18" fill="#2F6FD6"/></g>` +
    `<path d="M435 620 H490" stroke="#3E4A5C" stroke-width="22" stroke-linecap="round"/>` +
    `<g id="nozzle"><rect id="nozz" x="488" y="606" width="30" height="28" rx="6" fill="#3E4A5C"/></g>` +
    `<g id="dribble"><path d="M518 622 q14 6 18 40 q4 40 4 120" stroke="#5FB8F2" stroke-width="14" fill="none" stroke-linecap="round" opacity=".9"/></g>` +
    `<g id="arc" style="display:none"><path d="M508 618 Q590 500 645 560" stroke="#5FB8F2" stroke-width="8" fill="none" stroke-linecap="round"/></g>` +
    `<g id="tank"><rect x="595" y="540" width="110" height="250" rx="14" fill="#E8F2FF" opacity=".45" stroke="#9AA5B4" stroke-width="6"/><rect id="tankWater" x="601" y="780" width="98" height="4" rx="6" fill="#5FB8F2"/></g>` +
    `<g id="puddle"><ellipse cx="545" cy="785" rx="50" ry="8" fill="#5FB8F2" opacity=".7"/></g>`);
  EPISODES.push({ n:39, season:4, title:'Squeeze the Pipe', icon:'🚿', setting:'Frosty Moon, the Pump Room',
    tip:'Turn the tap off when you finish. Every drop of water is precious, on the Moon and at home.',
    grown:'Flow rate Q = V / t. Filling 500 liters in 3,600 seconds needs about 0.14 liters per second. Through a narrower opening the same water must move faster: A₁v₁ = A₂v₂.',
    scene: pipeRoom,
    async run(E){
      crew(E, { ex:250, hx:80, ax:830 });
      await E.say('title');
      await E.say('s_empty');
      await E.say('e_drip');
      await E.say('a_know');
      await E.say('e_truth');
      await E.say('e_thumb');
      E.$('front').innerHTML = tray('noz', 380, 800, 300, 160, three(['nWide', 'nNarrow', 'nShut'], [
        `<rect x="18" y="24" width="40" height="60" rx="4" fill="#3E4A5C"/>${txt(38, 112, 'wide', 16, '#24324A', 700)}`,
        `<path d="M18 24 h40 l-13 60 h-14z" fill="#3E4A5C"/>${txt(38, 112, 'narrow', 16, '#24324A', 700)}`,
        `<rect x="18" y="24" width="40" height="60" rx="4" fill="#3E4A5C"/><path d="M14 54 h48" stroke="#E53935" stroke-width="7"/>${txt(38, 112, 'closed', 16, '#24324A', 700)}`]));
      await E.choice(['nWide', 'nNarrow', 'nShut'], 'nNarrow', 'a_which');
      E.$('front').innerHTML = '';
      E.sfx.snap(); E.node('nozz').setAttribute('width', 18);
      hide(E, 'dribble'); show(E, 'arc'); E.sfx.spray();
      await E.say('e_whoosh');
      const tw = E.node('tankWater');
      for(const [i, k] of [[1,'c1'],[2,'c2'],[3,'c3']]){ tw.setAttribute('y', 780 - i*75); tw.setAttribute('height', 4 + i*75); E.sfx.glug(); await E.say(k); }
      hide(E, 'arc'); hide(E, 'puddle');
      await E.say('s_full');
      await E.say('a_truth');
    }
  });

  /* ================= EPISODE 40: Share the Power ================= */
  const machines = [['mAir','#2FBF71','air','🌬️'],['mLamp','#FFD43B','algae lamp','💡'],['mFence','#FF7A45','fence light','🚨'],['mRadio','#9AA5B4','radio','📻']];
  const powerRoom = () => room(style +
    `<g id="battery"><rect x="30" y="560" width="150" height="200" rx="16" fill="#3E4A5C" stroke="#9AA5B4" stroke-width="5"/><rect x="75" y="540" width="60" height="24" rx="6" fill="#9AA5B4"/>${txt(105, 740, 'POWER', 22, '#BFE0F5', 700)}</g>` +
    `<g id="meter" transform="translate(390 300)"><rect width="290" height="74" rx="14" fill="#1B2240" stroke="#9AA5B4" stroke-width="4"/><rect x="14" y="16" width="262" height="42" rx="8" fill="#2C3654"/><rect id="meterBar" x="14" y="16" width="262" height="42" rx="8" fill="#E53935"/><path d="M210 10v56" stroke="#fff" stroke-width="4" stroke-dasharray="6 5"/></g>` +
    `<g>${machines.map(([id, c, label, ico], i) => `<g id="${id}"><rect x="${395 + (i%2)*140}" y="${415 + Math.floor(i/2)*165}" width="104" height="124" rx="16" fill="#F4F7FB" stroke="${c}" stroke-width="6"/><text x="${447 + (i%2)*140}" y="${482 + Math.floor(i/2)*165}" font-size="44" text-anchor="middle">${ico}</text>${txt(447 + (i%2)*140, 522 + Math.floor(i/2)*165, label, 16, '#24324A', 700)}<circle id="${id}On" cx="${484 + (i%2)*140}" cy="${430 + Math.floor(i/2)*165}" r="8" fill="#2FBF71"/></g>`).join('')}</g>`);
  EPISODES.push({ n:40, season:4, title:'Share the Power', icon:'🔋', setting:'Frosty Moon, the Power Room',
    tip:'Never touch plugs or sockets. Electricity is a grown-up job.',
    grown:'Power P = V × I, measured in watts. A light that is on only 10% of the time (a 10% duty cycle) uses about 10% of its power: 1,200 W becomes 120 W, saving 1,080 W.',
    scene: powerRoom,
    async run(E){
      crew(E, { helper:null, ex:290 });
      await E.say('title');
      E.anim(E.node('meterBar'), [{opacity:1},{opacity:.4},{opacity:1}], {duration:600, iterations:3});
      E.sfx.wrong();
      await E.say('e_red');
      await E.say('a_battery');
      await E.say('a_know');
      await E.say('e_truth');
      await E.choice(['mAir', 'mLamp', 'mFence', 'mRadio'], 'mRadio', 'a_off');
      fill(E, 'mRadioOn', '#E53935'); E.sfx.click();
      E.node('meterBar').setAttribute('width', 230);
      await E.say('e_still');
      await E.say('a_blink');
      await E.tap('mFence', 'a_tapfence');
      E.node('mFenceOn').classList.add('blink'); E.sfx.beep();
      const mb = E.node('meterBar'); mb.setAttribute('width', 170); fill(E, 'meterBar', '#2FBF71');
      await E.say('e_green');
      await E.say('a_truth');
    }
  });

  /* ================= EPISODE 41: The Bending Door ================= */
  const airlock = () => room(style +
    `<g id="door"><rect x="400" y="300" width="280" height="490" rx="30" fill="#9AA5B4" stroke="#C9D3E2" stroke-width="10"/><rect x="430" y="330" width="220" height="430" rx="20" fill="#B7C1CF"/><circle cx="540" cy="420" r="50" fill="#0B1030" stroke="#5D6B80" stroke-width="8"/>${txt(540, 560, 'AIRLOCK', 26, '#4A5568', 700)}</g>` +
    `<g id="crack"><path id="crackPath" d="M470 610 l24 18 l-10 22 l30 16 l-8 22" stroke="#24324A" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="140" stroke-dashoffset="70"/></g>` +
    `<g id="tip"><circle cx="507" cy="666" r="16" fill="transparent"/></g>` +
    `<g id="hole" style="display:none"><circle cx="507" cy="666" r="9" fill="#24324A" stroke="#E4EAF2" stroke-width="3"/></g>` +
    `<g id="vent"><rect x="720" y="300" width="110" height="70" rx="12" fill="#5D6B80" stroke="#9AA5B4" stroke-width="4"/><g stroke="#2C3654" stroke-width="5">${[0,1,2,3].map(i => `<path d="M${734+i*24} 314v42"/>`).join('')}</g></g>` +
    `<g id="warm" style="display:none"><path d="M720 340 Q660 330 690 400 Q640 400 680 470" stroke="#FF7A45" stroke-width="8" fill="none" stroke-linecap="round" opacity=".8"/><path d="M745 372 Q700 420 690 520" stroke="#FFB703" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/></g>`);
  EPISODES.push({ n:41, season:4, title:'The Bending Door', icon:'🚪', setting:'Frosty Moon, the Airlock',
    tip:'Drills and heaters are grown-up tools. Ask a grown-up to use them for you.',
    grown:'Stress σ = F / A. A sharp crack tip squeezes all the force into a tiny area, so the crack keeps growing. A small round hole at the tip spreads the force over a bigger area and stops it.',
    scene: airlock,
    async run(E){
      crew(E);
      await E.say('title');
      E.sfx.creak();
      await E.say('e_noise');
      E.node('crackPath').style.transition = 'stroke-dashoffset 1.5s'; E.node('crackPath').style.strokeDashoffset = 20;
      await E.say('s_crack');
      await E.say('a_know');
      await E.say('e_truth');
      await E.tap('aama', 'a_tapme');
      E.scan('crack'); await E.say('a_scan'); E.scanOff();
      await E.tap('tip', 'a_tip_tap');
      await E.say('s_drill');
      E.sfx.vroom(); await E.wait(700); show(E, 'hole'); E.sfx.snap();
      await E.say('e_stopped');
      E.sfx.whoosh();
      await E.say('a_hiss');
      await E.tap('vent', 'a_vent');
      show(E, 'warm'); E.sfx.whoosh();
      await E.say('a_grow');
      await E.say('e_quiet');
      await E.say('a_truth');
    }
  });

  /* ================= EPISODE 42: The Number Song ================= */
  const radioRoom = () => room(style +
    `<g id="radio"><rect x="390" y="300" width="300" height="230" rx="20" fill="#3E4A5C" stroke="#9AA5B4" stroke-width="6"/><rect x="410" y="320" width="260" height="130" rx="12" fill="#0E2A2E"/><g id="nums">${['1','1','2','3','5'].map((n, i) => `<text id="nn${i}" x="${432 + i*38}" y="402" font-family="Fredoka,sans-serif" font-size="44" font-weight="700" fill="#5FF6FF" text-anchor="middle" opacity="0">${n}</text>`).join('')}<text id="nq" x="636" y="402" font-family="Fredoka,sans-serif" font-size="44" font-weight="700" fill="#FFD43B" text-anchor="middle" opacity="0">?</text></g>` +
    `<circle cx="450" cy="490" r="18" fill="#9AA5B4"/><circle cx="510" cy="490" r="18" fill="#9AA5B4"/><rect x="560" y="478" width="110" height="24" rx="8" fill="#2C3654"/><path d="M640 300 L680 240" stroke="#9AA5B4" stroke-width="6"/><circle cx="682" cy="236" r="8" fill="#E53935"/></g>` +
    `<g id="mapArrow" style="display:none"><rect x="400" y="560" width="280" height="150" rx="16" fill="#DDEBFA" stroke="#9AA5B4" stroke-width="4"/><path d="M450 690 L630 590" stroke="#2F6FD6" stroke-width="10" stroke-dasharray="18 12"/><circle cx="630" cy="590" r="16" fill="#E53935"/>${txt(560, 690, 'Shattered Sea', 20, '#2F6FD6', 700)}</g>`);
  const numCard = (id, x, n) => `<g id="${id}"><rect x="${x}" y="820" width="76" height="110" rx="14" fill="#F4F7FB" stroke="#2F6FD6" stroke-width="4"/>${txt(x + 38, 892, n, 46, '#24324A', 700)}</g>`;
  const nums3 = (ids, ns) => ids.map((id, i) => numCard(id, 392 + i*100, ns[i])).join('');
  EPISODES.push({ n:42, season:4, title:'The Number Song', icon:'🔢', setting:'Frosty Moon, the Radio Room',
    tip:'Ask a grown-up before you answer a message or a call from someone you do not know.',
    grown:'The Fibonacci sequence: Fₙ = Fₙ₋₁ + Fₙ₋₂. Each number is the sum of the two before it: 1, 1, 2, 3, 5, 8, 13, 21. It shows up in pinecones, sunflowers and shells.',
    scene: radioRoom,
    async run(E){
      crew(E);
      await E.say('title');
      E.sfx.beep();
      await E.say('e_beep');
      for(let i = 0; i < 5; i++){ E.node('nn' + i).setAttribute('opacity', 1); E.sfx.boop(); await E.say('n' + i); }
      E.node('nq').setAttribute('opacity', 1);
      await E.say('s_stop');
      await E.say('a_know');
      await E.say('e_truth');
      await E.say('a_add');
      E.$('front').innerHTML = tray('cards', 380, 805, 300, 140, nums3(['c6', 'c8', 'c10'], ['6', '8', '10']));
      await E.choice(['c6', 'c8', 'c10'], 'c8', 'a_next');
      E.node('nq').textContent = '8'; E.sfx.bell();
      await E.say('e_eight');
      E.$('front').innerHTML = tray('cards', 380, 805, 300, 140, nums3(['c11', 'c13', 'c9'], ['11', '13', '9']));
      await E.choice(['c11', 'c13', 'c9'], 'c13', 'a_after');
      E.$('front').innerHTML = '';
      E.node('nq').textContent = '13'; E.sfx.cheer();
      show(E, 'mapArrow');
      await E.say('a_map');
      E.$('front').innerHTML = screen('call', 718, 262, 160, 160, [['orion', .3038], ['kestrel', .4486]]);
      E.sfx.bell();
      await E.say('o_hi');
      await E.say('k_come');
      await E.say('e_yes');
      await E.say('a_truth');
    }
  });

  /* ================= EPISODE 43: Sled-Bot, Low and Strong ================= */
  const pad = () => ice(`<g id="ship"><path d="M560 230 Q620 300 620 430 V560 H500 V430 Q500 300 560 230Z" fill="#EEF2F7" stroke="#9AA5B4" stroke-width="5"/><circle cx="560" cy="360" r="30" fill="#9FD3F2" stroke="#5D6B80" stroke-width="6"/><path d="M500 500 L460 580 H500Z M620 500 L660 580 H620Z" fill="#2F6FD6"/></g>`, { seed:43, planet:false });
  const hill = () => ice(`<path d="M380 790 L900 470 V1000 H380Z" fill="#D2E4F7"/><path d="M380 790 L900 470" stroke="#B3CDEA" stroke-width="10"/>` +
    `<g id="sled"><g id="sledBody"><rect x="440" y="680" width="150" height="50" rx="16" fill="#E9ECF2" stroke="#7D8794" stroke-width="4"/><circle cx="470" cy="738" r="16" fill="#3E4A5C"/><circle cx="560" cy="738" r="16" fill="#3E4A5C"/>` +
    `<g id="loadTop"><rect x="470" y="600" width="44" height="80" rx="10" fill="#E53935"/><rect x="520" y="600" width="44" height="80" rx="10" fill="#E53935"/><rect x="490" y="660" width="54" height="20" rx="4" fill="#FFD43B"/></g>` +
    `<g id="loadLow" style="display:none"><rect x="458" y="690" width="112" height="34" rx="8" fill="#E53935"/><rect x="480" y="650" width="70" height="40" rx="8" fill="#FFD43B"/></g>` +
    `<g id="gearSmall" style="display:none"><circle cx="604" cy="712" r="12" fill="#9AA5B4" stroke="#5D6B80" stroke-width="4"/><circle cx="628" cy="704" r="24" fill="none" stroke="#5D6B80" stroke-width="8" stroke-dasharray="6 6"/></g></g></g>`, { planet:false, seed:46 });
  EPISODES.push({ n:43, season:4, title:'Sled-Bot, Low and Strong', icon:'🛷', setting:'Frosty Moon, the Ice Plains',
    tip:'Do not climb shelves. Heavy things go on low shelves so nothing tips over.',
    grown:'Gear ratio R = N_out / N_in = 50 / 10 = 5. A small gear turning a big gear gives five times the turning force at one fifth the speed. Heavy loads kept low lower the center of gravity, so the sled does not tip.',
    scene: pad,
    async run(E){
      E.evanSuit(true); E.evanSet(395, 955); E.aamaSet(815, 945);
      E.person('kestrel', 65, 945, { img:'kestrelsp', scale:.9 }); E.person('orion', 225, 945, { img:'orionsp' });
      E.person('shivu', 595, 945, { img:'shivusp', fade:true });
      await E.say('title');
      await E.say('k_cold');
      await E.say('o_sea');
      await E.say('e_sled');
      await E.say('s_snacks');
      await Promise.all([E.personOut('kestrel'), E.personOut('shivu')]);
      await swap(E, hill());
      E.personDrop('orion'); E.person('orion', 95, 945, { img:'orionsp' }); E.evanSet(275, 955); E.aamaSet(800, 945);
      await moveTo(E, 'sled', 30, -30, 900, null, -12);
      await moveTo(E, 'sled', 0, 0, 500, null, 18);
      E.sfx.wrong();
      await E.say('o_tip');
      await E.say('a_know');
      await E.say('e_truth');
      E.$('front').innerHTML = tray('loads', 380, 800, 280, 160, two(['lTop', 'lLow'], [
        `<rect x="24" y="14" width="24" height="56" rx="6" fill="#E53935"/><rect x="52" y="14" width="24" height="56" rx="6" fill="#E53935"/><rect x="10" y="76" width="80" height="26" rx="8" fill="#9AA5B4"/><circle cx="24" cy="112" r="10" fill="#3E4A5C"/><circle cx="76" cy="112" r="10" fill="#3E4A5C"/>`,
        `<rect x="28" y="36" width="44" height="22" rx="6" fill="#FFD43B"/><rect x="10" y="58" width="80" height="20" rx="6" fill="#E53935"/><rect x="10" y="78" width="80" height="24" rx="8" fill="#9AA5B4"/><circle cx="24" cy="112" r="10" fill="#3E4A5C"/><circle cx="76" cy="112" r="10" fill="#3E4A5C"/>`]));
      await E.choice(['lTop', 'lLow'], 'lLow', 'a_load');
      E.$('front').innerHTML = '';
      hide(E, 'loadTop'); show(E, 'loadLow'); E.sfx.click();
      await moveTo(E, 'sled', 0, 0, 400, null, 0);
      await E.say('o_steady');
      await E.say('e_spin');
      E.$('front').innerHTML = tray('gears', 380, 800, 280, 160, two(['gBig', 'gSmall'], [
        `<circle cx="38" cy="58" r="28" fill="none" stroke="#2F6FD6" stroke-width="10" stroke-dasharray="8 6"/><circle cx="80" cy="58" r="11" fill="none" stroke="#5D6B80" stroke-width="7" stroke-dasharray="5 4"/>${txt(50, 112, 'big turns', 14, '#24324A', 700)}${txt(50, 126, 'small', 14, '#24324A', 700)}`,
        `<circle cx="20" cy="58" r="11" fill="none" stroke="#2F6FD6" stroke-width="7" stroke-dasharray="5 4"/><circle cx="62" cy="58" r="28" fill="none" stroke="#5D6B80" stroke-width="10" stroke-dasharray="8 6"/>${txt(50, 112, 'small turns', 14, '#24324A', 700)}${txt(50, 126, 'big', 14, '#24324A', 700)}`]));
      await E.choice(['gBig', 'gSmall'], 'gSmall', 'a_gear');
      E.$('front').innerHTML = '';
      show(E, 'gearSmall'); E.sfx.vroom();
      await moveTo(E, 'sled', 190, -125, 2400, null, -31);
      await E.say('e_climb');
      await E.say('o_slow');
      await E.say('a_truth');
    }
  });

  /* ================= EPISODE 44: Where the Lines Cross ================= */
  const fog = () => ice(`<g id="dome" style="opacity:0"><path d="M430 600 A110 110 0 0 1 650 600Z" fill="#BFF4FF" opacity=".7" stroke="#E9FFFE" stroke-width="5"/><path d="M460 600 L540 492 L620 600 M485 545 H595" stroke="#E9FFFE" stroke-width="3" fill="none"/></g>` +
    `<defs><filter id="fogBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="28"/></filter></defs><g id="fogL" filter="url(#fogBlur)"><ellipse cx="560" cy="500" rx="230" ry="130" fill="#F4F8FD" opacity=".95"/><ellipse cx="760" cy="420" rx="170" ry="110" fill="#F4F8FD" opacity=".9"/><ellipse cx="430" cy="560" rx="120" ry="80" fill="#F4F8FD" opacity=".85"/></g>` +
    `<g id="spotA"><circle cx="420" cy="760" r="26" fill="#FFFFFF" opacity=".6" stroke="#2F6FD6" stroke-width="4" stroke-dasharray="6 5"/></g>` +
    `<g id="spotB"><circle cx="650" cy="740" r="26" fill="#FFFFFF" opacity=".6" stroke="#2F6FD6" stroke-width="4" stroke-dasharray="6 5"/></g>` +
    `<g id="beaconA" style="display:none"><rect x="410" y="700" width="20" height="60" fill="#5D6B80"/><circle cx="420" cy="696" r="12" fill="#E53935"/></g>` +
    `<g id="beaconB" style="display:none"><rect x="640" y="680" width="20" height="60" fill="#5D6B80"/><circle cx="650" cy="676" r="12" fill="#E53935"/></g>` +
    `<path id="lineA" d="M420 696 L540 545" stroke="#E53935" stroke-width="6" stroke-dasharray="14 10" style="display:none"/>` +
    `<path id="lineB" d="M650 676 L540 545" stroke="#E53935" stroke-width="6" stroke-dasharray="14 10" style="display:none"/>` +
    `<g id="pick1" style="display:none"><circle cx="440" cy="480" r="22" fill="#FFD43B" opacity=".9"/></g><g id="pick2" style="display:none"><circle cx="540" cy="545" r="22" fill="#FFD43B" opacity=".9"/></g><g id="pick3" style="display:none"><circle cx="650" cy="470" r="22" fill="#FFD43B" opacity=".9"/></g>`, { seed:44 });
  EPISODES.push({ n:44, season:4, title:'Where the Lines Cross', icon:'📍', setting:'Frosty Moon, the foggy ice',
    tip:'If you ever get lost, stay where you are and call for your grown-up.',
    grown:'Triangulation: from two known places, measure the direction to a target and draw the two lines. They cross at the target. Surveyors use the Law of Sines, a / sin A = b / sin B = c / sin C, to get the distance.',
    scene: fog,
    async run(E){
      E.evanSuit(true); E.evanSet(275, 955); E.aamaSet(820, 945);
      E.person('kestrel', 95, 945, { img:'kestrelsp' });
      await E.say('title');
      await E.say('k_fog');
      await E.say('e_where');
      await E.say('a_know');
      await E.say('e_truth');
      await E.tap('spotA', 'a_beacon1');
      show(E, 'beaconA'); E.sfx.beep(); show(E, 'lineA');
      await E.say('e_one');
      await E.tap('spotB', 'a_beacon2');
      show(E, 'beaconB'); E.sfx.beep(); show(E, 'lineB');
      await E.say('k_two');
      ['pick1', 'pick2', 'pick3'].forEach(p => show(E, p));
      await E.choice(['pick1', 'pick2', 'pick3'], 'pick2', 'a_cross');
      ['pick1', 'pick2', 'pick3'].forEach(p => hide(E, p));
      await E.anim(E.node('fogL'), [{opacity:1},{opacity:0}], {duration:1200, fill:'forwards'});
      E.node('dome').style.opacity = 1; E.sfx.cheer();
      await E.say('e_dome');
      await E.say('k_sparkly');
      await E.say('a_truth');
    }
  });

  /* ================= EPISODE 45: Hello in Light ================= */
  const domeIn = () => sky(45) + `<path d="M0 1000 V420 A450 420 0 0 1 900 420 V1000Z" fill="#163A55" opacity=".9"/>` +
    `<g stroke="#5FF6FF" stroke-width="2" opacity=".35" fill="none"><path d="M0 420 A450 420 0 0 1 900 420"/><path d="M150 1000 L300 300 L450 120 L600 300 L750 1000 M60 600 H840 M200 360 H700"/></g>` +
    `<path d="M0 790 Q450 760 900 790 V1000 H0Z" fill="#BFE0F5"/>` + glimmer(540, 520, .9) +
    `<g id="torch"><rect x="380" y="690" width="70" height="32" rx="10" fill="#FFD43B" stroke="#5D6B80" stroke-width="4"/><path d="M450 692 l26 -10 v52 l-26 -10z" fill="#FFF3A3" stroke="#5D6B80" stroke-width="3"/></g>` +
    `<g id="beam" style="display:none"><path d="M476 690 L560 600 L600 640 L476 720Z" fill="#FFF3A3" opacity=".55"/></g>`;
  EPISODES.push({ n:45, season:4, title:'Hello in Light', icon:'✨', setting:'Frosty Moon, inside the Glimmer Dome',
    tip:'Look at bugs and animals gently. Watch them, never grab them.',
    grown:'Bioluminescence: some living things make light with a chemical called luciferin, oxygen and an enzyme called luciferase. Fireflies, jellyfish and deep sea fish do it. Prime numbers (2, 3, 5, 7, 11) can only be divided by 1 and themselves, so they make a clear signal.',
    scene: domeIn,
    async run(E){
      E.evanSuit(true); E.evanSet(275, 955); E.aamaSet(820, 945);
      E.person('orion', 95, 945, { img:'orionsp' });
      E.node('glim').style.opacity = .25;
      await E.say('title');
      await E.say('o_what');
      await E.say('e_hello');
      E.sfx.boop();
      await E.say('a_shy');
      await E.say('a_know');
      await E.say('e_truth');
      E.node('glim').style.opacity = .7;
      E.sfx.bell(); await glow(E, 2);
      await E.say('a_copy');
      await E.taps('torch', 2, 'a_torch', async () => { show(E, 'beam'); E.sfx.click(); await E.wait(300); hide(E, 'beam'); });
      E.sfx.bell(); await glow(E, 1);
      await E.say('o_more');
      for(const [n, k] of [[2,'n2'],[3,'n3'],[5,'n5']]){
        await E.tap('torch', k);
        for(let i = 0; i < n; i++){ show(E, 'beam'); E.sfx.click(); await E.wait(220); hide(E, 'beam'); await E.wait(160); }
      }
      E.node('glim').style.transition = 'opacity .8s'; E.node('glim').style.opacity = 1;
      E.sfx.cheer();
      await glow(E, 3, 300, 200);
      await E.say('e_friend');
      await E.say('a_glimmer');
      await E.say('o_name');
      await E.say('a_truth');
    }
  });

  /* ================= EPISODE 46: Too Cold for Rubber ================= */
  const domeCrack = () => domeIn() + `<g id="dcrack"><path d="M690 300 l18 30 l-12 24 l20 28" stroke="#E9FFFE" stroke-width="6" fill="none" stroke-linecap="round"/></g><g id="patch" style="display:none"><rect x="676" y="290" width="70" height="104" rx="14" fill="#F7F7F2" stroke="#C9D3E2" stroke-width="4"/></g>`;
  EPISODES.push({ n:46, season:4, title:'Too Cold for Rubber', icon:'🧊', setting:'Frosty Moon, inside the Glimmer Dome',
    tip:'Stay away from very hot steam and do not hold very cold ice packs on bare skin.',
    grown:'Matter is solid, liquid or gas. At its triple point a substance can be all three at once. Natural rubber turns stiff and glassy at about −70 °C, while PTFE (Teflon) stays flexible far colder, which is why it makes a good patch in deep cold.',
    scene: domeCrack,
    async run(E){
      E.evanSuit(true); E.evanSet(275, 955); E.aamaSet(820, 945);
      E.person('orion', 95, 945, { img:'orionsp' });
      E.node('glim').style.opacity = 1;
      await E.say('title');
      E.sfx.wrong(); await glow(E, 3, 200, 150);
      await E.say('o_crack');
      await E.say('a_cold');
      await E.say('a_know');
      await E.say('e_truth');
      E.$('front').innerHTML = tray('states', 380, 800, 300, 160, three(['sIce', 'sWater', 'sSteam'], [
        `<rect x="16" y="30" width="44" height="44" rx="8" fill="#BFE8FF" stroke="#7FB8E0" stroke-width="3"/>${txt(38, 112, 'ice', 18, '#24324A', 700)}`,
        `<path d="M38 24 q20 30 0 52 q-20 -22 0 -52z" fill="#5FB8F2"/>${txt(38, 112, 'water', 18, '#24324A', 700)}`,
        `<path d="M26 74 q-10 -20 6 -34 q12 -12 2 -26 M50 74 q-10 -20 6 -34" stroke="#9AA5B4" stroke-width="6" fill="none" stroke-linecap="round"/>${txt(38, 112, 'steam', 18, '#24324A', 700)}`]));
      await E.choice(['sIce', 'sWater', 'sSteam'], 'sIce', 'a_solid');
      await E.say('e_hard');
      E.$('front').innerHTML = tray('patches', 380, 800, 300, 160, three(['pRubber', 'pPaper', 'pSlip'], [
        `<rect x="12" y="24" width="52" height="52" rx="8" fill="#5B5B5B"/><path id="rubCrack" d="M18 34 l14 12 l-6 12 l18 12" stroke="#fff" stroke-width="3" fill="none" style="display:none"/>${txt(38, 112, 'rubber', 16, '#24324A', 700)}`,
        `<rect x="12" y="24" width="52" height="52" rx="4" fill="#F2E3C4"/>${txt(38, 112, 'paper', 16, '#24324A', 700)}`,
        `<rect x="12" y="24" width="52" height="52" rx="12" fill="#F7F7F2" stroke="#C9D3E2" stroke-width="3"/>${txt(38, 102, 'slippery', 14, '#24324A', 700)}${txt(38, 119, 'plastic', 14, '#24324A', 700)}`]));
      await E.say('a_test');
      show(E, 'rubCrack'); E.sfx.snap();
      await E.say('e_rubber');
      await E.choice(['pRubber', 'pPaper', 'pSlip'], 'pSlip', 'a_which');
      E.$('front').innerHTML = '';
      show(E, 'patch'); E.sfx.pop(); hide(E, 'dcrack');
      await E.say('o_bendy');
      E.sfx.cheer(); await glow(E, 3, 300, 200);
      await E.say('e_happy');
      await E.say('a_truth');
    }
  });

  /* ================= EPISODE 47: Bouncy Springs ================= */
  const bumpy = () => ice(`<path d="M380 760 q40 -30 80 0 q40 -30 80 0 q40 -30 80 0 q40 -30 80 0 q40 -30 80 0 V800 H380Z" fill="#B3CDEA"/>` +
    `<g id="vault"><rect x="630" y="460" width="150" height="100" rx="16" fill="#5D6B80" stroke="#9AA5B4" stroke-width="5"/>${txt(705, 520, 'SEED VAULT', 18, '#E4EFFA', 700)}</g>` +
    `<g id="cart"><g id="cartBody"><rect x="400" y="650" width="150" height="54" rx="14" fill="#E9ECF2" stroke="#7D8794" stroke-width="4"/>` +
    `<g id="pods">${[0,1,2].map(i => `<ellipse id="pod${i}" cx="${430 + i*45}" cy="636" rx="18" ry="24" fill="#FFF3D6" stroke="#E0B85A" stroke-width="3"/>`).join('')}</g>` +
    `<g id="hardWheels"><circle cx="430" cy="716" r="18" fill="#3E4A5C"/><circle cx="520" cy="716" r="18" fill="#3E4A5C"/></g>` +
    `<g id="springWheels" style="display:none"><path d="M430 704 l-8 6 l16 6 l-16 6 l8 6 M520 704 l-8 6 l16 6 l-16 6 l8 6" stroke="#2F6FD6" stroke-width="4" fill="none"/><circle cx="430" cy="738" r="18" fill="#3E4A5C"/><circle cx="520" cy="738" r="18" fill="#3E4A5C"/></g></g></g>`, { seed:47 });
  EPISODES.push({ n:47, season:4, title:'Bouncy Springs', icon:'🌀', setting:'Frosty Moon, the bumpy ice',
    tip:'Bend your knees when you jump down, and only jump from low places.',
    grown:'Hooke\'s law: F = k × x. A spring pushes back harder the more you squash it, so it soaks up a bump slowly instead of passing the whole jolt to the load. Car suspensions work the same way.',
    scene: bumpy,
    async run(E){
      E.evanSuit(true); E.evanSet(275, 955); E.aamaSet(820, 945);
      E.person('kestrel', 95, 945, { img:'kestrelsp' });
      await E.say('title');
      await E.say('e_vault');
      await E.say('a_pods');
      await E.anim(E.node('cartBody'), [{transform:'translate(0,0)'},{transform:'translate(0,-16px) rotate(-3deg)'},{transform:'translate(0,0)'},{transform:'translate(0,-14px) rotate(3deg)'},{transform:'translate(0,0)'}], {duration:900, iterations:2});
      E.sfx.creak();
      await E.say('k_shake');
      await E.say('a_know');
      await E.say('e_truth');
      E.$('front').innerHTML = tray('wheels', 380, 800, 300, 160, three(['wHard', 'wSquare', 'wSpring'], [
        `<circle cx="38" cy="54" r="24" fill="#3E4A5C"/>${txt(38, 112, 'hard', 16, '#24324A', 700)}`,
        `<rect x="16" y="32" width="44" height="44" rx="4" fill="#3E4A5C"/>${txt(38, 112, 'square', 16, '#24324A', 700)}`,
        `<path d="M38 18 l-12 6 l24 6 l-24 6 l12 6" stroke="#2F6FD6" stroke-width="4" fill="none"/><circle cx="38" cy="64" r="18" fill="#3E4A5C"/>${txt(38, 112, 'springy', 16, '#24324A', 700)}`]));
      await E.choice(['wHard', 'wSquare', 'wSpring'], 'wSpring', 'a_which');
      E.$('front').innerHTML = '';
      hide(E, 'hardWheels'); show(E, 'springWheels'); E.sfx.click();
      await E.say('k_knees');
      await E.tap('cart', 'a_drive');
      E.sfx.vroom();
      await moveTo(E, 'cart', 150, 0, 2000);
      await E.say('e_safe');
      await E.say('k_seeds');
      await E.say('a_truth');
    }
  });

  /* ================= EPISODE 48: Sail Home on Light ================= */
  const sailSpace = () => sky(48) + `<defs><radialGradient id="sunGlow"><stop offset=".55" stop-color="#FFE680" stop-opacity=".7"/><stop offset="1" stop-color="#FFE680" stop-opacity="0"/></radialGradient></defs><g id="sun"><circle cx="150" cy="330" r="105" fill="url(#sunGlow)"/><circle cx="150" cy="330" r="60" fill="#FFD43B"/></g>` +
    `<g id="sailShip"><g transform="translate(0 60)"><g id="sail" style="display:none"><path d="M560 220 L720 300 L560 520Z" fill="#E9EEF6" stroke="#C9D3E2" stroke-width="4"/><path d="M560 220 L560 520" stroke="#9AA5B4" stroke-width="6"/></g>` +
    `<g id="sailFold"><rect x="548" y="300" width="24" height="140" rx="8" fill="#C9D3E2"/></g><path d="M500 520 H660 L630 580 H530Z" fill="#EEF2F7" stroke="#9AA5B4" stroke-width="5"/><circle cx="580" cy="548" r="14" fill="#9FD3F2"/></g></g>` +
    `<g id="rays" style="display:none" stroke="#FFE066" stroke-width="5" stroke-dasharray="14 12" opacity=".8"><path d="M230 330 L560 390"/><path d="M230 350 L560 480"/><path d="M220 380 L560 560"/></g>`;
  const garden = () => `<rect width="900" height="1000" fill="#A9DBF7"/><circle cx="560" cy="360" r="48" fill="#FFD43B"/><rect y="560" width="900" height="440" fill="#6DB05A"/><rect y="560" width="900" height="14" fill="#5A9A49"/>` +
    `<g id="bed"><rect x="385" y="630" width="200" height="60" rx="20" fill="#7A5434"/>${[0,1,2].map(i => `<g id="sprout${i}" style="display:none"><path d="M${420 + i*65} 634 v-34" stroke="#2E9C3E" stroke-width="6"/><ellipse cx="${408 + i*65}" cy="600" rx="14" ry="8" fill="#3FB34F"/><ellipse cx="${432 + i*65}" cy="594" rx="14" ry="8" fill="#3FB34F"/></g>`).join('')}</g>`;
  EPISODES.push({ n:48, season:4, title:'Sail Home on Light', icon:'⛵', setting:'Space, then home',
    tip:'Never look straight at the Sun, not even through glasses or a window.',
    grown:'Light carries momentum, p = E / c, so sunlight pushes gently on a thin shiny sail. The push is tiny, but in space nothing slows the ship down, so it keeps speeding up. Real solar sails like IKAROS have flown this way.',
    scene: sailSpace,
    outro: ['a_super'],
    async run(E){
      E.evanSuit(true); E.evanSet(275, 955); E.aamaSet(820, 945);
      E.person('kestrel', 85, 945, { img:'kestrelsp', scale:.9 });
      await E.say('title');
      await E.say('e_home');
      await E.say('a_fuel');
      await E.say('a_know');
      await E.say('e_truth');
      await E.tap('sailFold', 'a_open');
      hide(E, 'sailFold'); show(E, 'sail'); E.sfx.whoosh();
      await E.say('k_shiny');
      show(E, 'rays');
      await E.say('a_push');
      E.sfx.vroom();
      await moveTo(E, 'sailShip', 380, -60, 2200);
      await E.say('e_go');
      await swap(E, garden());
      E.personDrop('kestrel'); E.evanSuit(false); E.evanSet(275, 955); E.aamaSet(850, 945);
      E.person('dallu', 90, 935, { fade:true, scale:.85 });
      E.person('habba', 670, 935, { fade:true, scale:.85 });
      await E.say('d_welcome');
      await E.say('h_seeds');
      await E.taps('bed', 3, 'a_plant', async i => { E.sfx.plop(); show(E, 'sprout' + (i - 1)); await E.wait(300); });
      await E.say('e_grow');
      await E.say('a_truth');
    }
  });
  EPISODES.filter(e => e.season === 4).forEach(e => { const prev = e.setup; e.setup = E => { E.evanSuit(true); E.evanSet(275, 955); if(prev) prev(E); }; });
})();
