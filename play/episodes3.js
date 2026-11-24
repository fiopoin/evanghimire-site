/* Evan & Aama, Season 3: Mission to the Planets */
(function(){
  const EPISODES = window.EPISODES;

  /* ---------- helpers ---------- */
  function moveTo(E, id, dx, dy, ms, sc, rot){ const n = E.node(id); n.style.transformBox = 'fill-box'; n.style.transformOrigin = 'center'; n.style.transition = `transform ${ms||800}ms ease-in-out`; n.style.transform = `translate(${dx}px,${dy}px)` + (sc != null ? ` scale(${sc})` : '') + (rot ? ` rotate(${rot}deg)` : ''); return E.wait(ms || 800); }
  const hide = (E, id) => { E.node(id).style.display = 'none'; };
  const show = (E, id) => { E.node(id).style.display = ''; };
  async function swap(E, markup, front){
    const sc = E.$('scene');
    await E.anim(sc, [{opacity:1},{opacity:0}], {duration:450, fill:'forwards'});
    sc.innerHTML = markup; E.$('front').innerHTML = front || '';
    await E.anim(sc, [{opacity:0},{opacity:1}], {duration:450, fill:'forwards'});
  }
  const txt = (x, y, s, size, color, weight) => `<text x="${x}" y="${y}" font-family="Fredoka,sans-serif" font-size="${size||28}" font-weight="${weight||600}" fill="${color||'#24324A'}" text-anchor="middle">${s}</text>`;
  function rng(seed){ let s = seed; return () => (s = (s * 9301 + 49297) % 233280) / 233280; }
  function stars(seed, n, y1){ const r = rng(seed); let o = ''; for(let i = 0; i < (n||90); i++){ const x = r()*900, y = r()*(y1||1000), z = r(); o += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(z*2.2+0.6).toFixed(1)}" fill="#fff" opacity="${(0.4+z*0.6).toFixed(2)}"/>`; } return o; }
  const space = (seed) => `<rect width="900" height="1000" fill="#0B1030"/><rect width="900" height="1000" fill="url(#neb${seed})" opacity=".7"/><defs><radialGradient id="neb${seed}" cx="${30+seed%40}%" cy="30%" r="70%"><stop offset="0" stop-color="#3B2A7A"/><stop offset="1" stop-color="#0B1030" stop-opacity="0"/></radialGradient></defs>` + stars(seed);
  function planet(cx, cy, r, base, bands, extra){
    const id = 'pl' + Math.round(cx + cy + r);
    let o = `<defs><clipPath id="${id}c"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath><radialGradient id="${id}g" cx="35%" cy="35%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient></defs>`;
    o += `<g clip-path="url(#${id}c)"><circle cx="${cx}" cy="${cy}" r="${r}" fill="${base}"/>`;
    (bands || []).forEach(([y, h, c]) => { o += `<rect x="${cx-r}" y="${cy-r+y*2*r}" width="${2*r}" height="${h*2*r}" fill="${c}"/>`; });
    o += (extra || '') + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}g)"/></g>`;
    return o;
  }
  const earth = (cx, cy, r) => planet(cx, cy, r, '#2F7FD6', [], `<path d="M${cx-r*.6} ${cy-r*.3} q${r*.3} ${-r*.4} ${r*.6} ${-r*.1} q${r*.2} ${r*.4} ${-r*.1} ${r*.6} q${-r*.4} ${r*.1} ${-r*.5} ${-r*.5}z" fill="#3FA65A"/><path d="M${cx+r*.2} ${cy+r*.2} q${r*.4} ${-r*.2} ${r*.5} ${r*.2} q${-r*.1} ${r*.4} ${-r*.4} ${r*.3}z" fill="#3FA65A"/><ellipse cx="${cx-r*.1}" cy="${cy+r*.05}" rx="${r*.7}" ry="${r*.08}" fill="#fff" opacity=".55"/><ellipse cx="${cx+r*.2}" cy="${cy-r*.55}" rx="${r*.4}" ry="${r*.06}" fill="#fff" opacity=".5"/>`);
  /* rocket cabin with a big round window */
  function cabin(view, seed){
    return `<defs><clipPath id="win"><circle cx="500" cy="330" r="200"/></clipPath><linearGradient id="wallG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3E4A66"/><stop offset="1" stop-color="#27304A"/></linearGradient></defs>` +
      `<rect width="900" height="1000" fill="url(#wallG)"/>` +
      `<g transform="translate(0,70)"><g clip-path="url(#win)">${space(seed || 3)}${view || ''}</g>` +
      `<circle cx="500" cy="330" r="200" fill="none" stroke="#9AA5B4" stroke-width="22"/><circle cx="500" cy="330" r="214" fill="none" stroke="#5D6B80" stroke-width="6"/>` +
      [0,45,90,135,180,225,270,315].map(a => `<circle cx="${500+211*Math.cos(a*Math.PI/180)}" cy="${330+211*Math.sin(a*Math.PI/180)}" r="6" fill="#C9D3E2"/>`).join('') + `</g>` +
      `<rect y="790" width="900" height="210" fill="#5D6B80"/><path d="M0 790H900" stroke="#9AA5B4" stroke-width="8"/><g stroke="#4A5568" stroke-width="3">${[100,250,400,550,700,850].map(x => `<path d="M${x} 800V1000"/>`).join('')}</g>`;
  }
  /* video screen for Mission Control */
  function screen(id, x, y, w, h, faces, label){
    const fw = w / faces.length;
    let o = `<g id="${id}"><rect x="${x-8}" y="${y-8}" width="${w+16}" height="${h+40}" rx="14" fill="#1B2240" stroke="#9AA5B4" stroke-width="4"/><defs><clipPath id="${id}c"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/></clipPath></defs><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#BFE0F5"/><g clip-path="url(#${id}c)">`;
    faces.forEach(([k, ratio], i) => { const iw = fw * 1.1, ih = iw / ratio; o += `<image href="cast/${k}.webp" x="${x + i*fw - fw*.05}" y="${y + 6}" width="${iw}" height="${ih}"/>`; });
    return o + `</g>${txt(x + w/2, y + h + 24, label || 'Mission Control', 18, '#BFE0F5', 700)}</g>`;
  }
  const tray = (id, x, y, w, h, inner) => `<g id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="#FFFFFF" opacity=".96" stroke="#C9D3E2" stroke-width="4"/>${inner}</g>`;
  const card = (id, x, y, inner) => `<g id="${id}"><rect x="${x}" y="${y}" width="104" height="104" rx="16" fill="#F4F7FB" stroke="#9AA5B4" stroke-width="3"/>${inner}</g>`;
  function crew(E, opts){
    opts = opts || {};
    E.evanSuit(true);
    E.evanSet(opts.ex || 275, opts.ey || 955);
    E.aamaSet(opts.ax || 790, opts.ay || 945);
    if(opts.shivu !== false) E.person('shivu', opts.sx || 95, opts.sy || 945, { img:'shivusp' });
  }

  /* ================= EPISODE 25 ================= */
  const backyard = () => `<defs><linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B3A7A"/><stop offset=".6" stop-color="#F28C6B"/><stop offset="1" stop-color="#FFD29A"/></linearGradient></defs><rect width="900" height="1000" fill="url(#dusk)"/>` + stars(7, 30, 300) +
    `<rect x="0" y="520" width="900" height="200" fill="#B98552"/>` + Array.from({length:19}, (_, i) => `<rect x="${i*48}" y="500" width="40" height="230" rx="6" fill="#C99563"/>`).join('') +
    `<rect y="720" width="900" height="280" fill="#5E9A4E"/><rect y="720" width="900" height="16" fill="#4E8A40"/>` +
    `<g id="pad"><ellipse cx="560" cy="905" rx="130" ry="26" fill="#9AA5B4"/><ellipse cx="560" cy="895" rx="120" ry="20" fill="#C9D3E2"/><g id="padBtn"><circle cx="560" cy="890" r="16" fill="#E53935" stroke="#fff" stroke-width="4"/></g></g>`;
  const rocketPad = () => `<defs><linearGradient id="dusk2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B3A7A"/><stop offset=".6" stop-color="#F28C6B"/><stop offset="1" stop-color="#FFD29A"/></linearGradient></defs><rect width="900" height="1000" fill="url(#dusk2)"/>` + stars(7, 30, 300) +
    `<rect y="720" width="900" height="280" fill="#5E9A4E"/>` +
    `<g id="rocket"><path d="M560 180 Q640 280 640 470 V700 H480 V470 Q480 280 560 180Z" fill="#EEF2F7" stroke="#9AA5B4" stroke-width="5"/><circle cx="560" cy="380" r="46" fill="#9FD3F2" stroke="#5D6B80" stroke-width="8"/><path d="M480 600 L420 720 H480Z M640 600 L700 720 H640Z" fill="#E53935"/><rect x="510" y="700" width="100" height="30" fill="#5D6B80"/><g id="redLight"><circle cx="560" cy="520" r="14" fill="#E53935"/></g><g id="flame" style="display:none"><path d="M520 730 Q560 880 600 730Z" fill="#FFB703"/><path d="M535 730 Q560 830 585 730Z" fill="#FFF3A3"/></g></g>`;
  EPISODES.push({ n:25, season:3, title:'Blast Off!', icon:'🚀', setting:"Evan's backyard, then Earth orbit",
    tip:'Earth is our home planet. From space it looks blue because most of it is ocean.',
    scene: backyard,
    async run(E){
      E.evanSet(200, 955); E.aamaSet(780, 945);
      await E.say('title');
      await E.say('e_button');
      await E.say('a_secret');
      await E.say('e_space');
      E.person('shivu', 0, 940); await E.personTo('shivu', 360, 940, 1100);
      await E.say('s_me');
      E.person('dallu', 60, 900, { fade:true });
      await E.say('d_go');
      await E.personOut('dallu');
      E.sfx.whoosh();
      await swap(E, rocketPad());
      E.personDrop('shivu');
      E.evanSuit(true); E.evanSet(275, 955); E.person('shivu', 95, 945, { img:'shivusp' }); E.aamaSet(800, 945);
      await E.say('e_go');
      E.sfx.beep();
      await E.anim(E.node('redLight'), [{opacity:1},{opacity:.2},{opacity:1}], {duration:500, iterations:3});
      await E.say('e_uhoh');
      await E.tap('aama', 'a_tapme');
      E.scan('rocket'); await E.say('a_scan'); E.scanOff();
      const cardG = (id, x, inner) => `<g id="${id}"><g transform="translate(${x} 880) scale(.75)"><rect width="80" height="80" rx="12" fill="#F4F7FB" stroke="#2F6FD6" stroke-width="4"/>${inner}</g></g>`;
      E.$('front').innerHTML = tray('cards', 380, 790, 280, 170,
        `<g id="slots">${[0,1,2,3].map(i => `<rect x="${395+i*65}" y="805" width="60" height="60" rx="10" fill="none" stroke="#C9D3E2" stroke-width="3" stroke-dasharray="6 5"/>`).join('')}</g>` +
        cardG('cHelmet', 395, `<circle cx="40" cy="35" r="24" fill="#BFE8FF" stroke="#9AA5B4" stroke-width="5"/><rect x="16" y="52" width="48" height="12" rx="4" fill="#9AA5B4"/>`) +
        cardG('cBelt', 460, `<path d="M10 15 L70 65 M70 15 L10 65" stroke="#5D6B80" stroke-width="10"/><rect x="28" y="28" width="24" height="24" rx="4" fill="#FFD43B"/>`) +
        cardG('cHatch', 525, `<rect x="15" y="10" width="50" height="62" rx="20" fill="#9AA5B4"/><circle cx="40" cy="35" r="12" fill="#9FD3F2"/>`) +
        cardG('cGo', 590, `<circle cx="40" cy="40" r="28" fill="#E53935"/>${txt(40, 50, 'GO', 22, '#fff', 700)}`));
      const snap = async (id, i, x) => { E.sfx.click(); await moveTo(E, id, 395 + i*65 - x, -75, 450); };
      await E.tap('cHelmet', 'a_first'); await snap('cHelmet', 0, 395);
      await E.tap('cBelt', 'a_second'); await snap('cBelt', 1, 460);
      await E.tap('cHatch', 'a_third'); await snap('cHatch', 2, 525);
      await E.tap('cGo', 'a_count'); await snap('cGo', 3, 590);
      E.node('redLight').firstElementChild.setAttribute('fill', '#2FBF71');
      await E.say('all_count');
      E.$('front').innerHTML = '';
      show(E, 'flame'); E.sfx.vroom();
      E.personOut('shivu', 300); E.evanHide(true); E.aamaHide(true);
      await moveTo(E, 'rocket', 0, -1100, 2200);
      await E.say('e_fly');
      await swap(E, cabin(earth(500, 360, 150), 25));
      E.evanHide(false); E.aamaHide(false); crew(E);
      await E.say('e_marble');
      await E.say('a_home');
      E.$('front').innerHTML = screen('mc', 718, 262, 160, 160, [['dallu', .3066], ['baba', .3175]]);
      E.sfx.bell();
      await E.say('b_screen');
      await E.say('e_hi');
    }
  });

  /* ================= EPISODE 26 ================= */
  const moon = () => `<rect width="900" height="1000" fill="#05081A"/>` + stars(26, 120, 520) + earth(720, 170, 60) +
    `<path d="M0 560 Q200 520 450 545 T900 530 V1000 H0Z" fill="#9C9C9C"/><path d="M0 620 Q250 590 500 610 T900 600 V1000 H0Z" fill="#B3B3B3"/>` +
    `<ellipse cx="160" cy="650" rx="70" ry="16" fill="#8A8A8A"/><ellipse cx="760" cy="700" rx="90" ry="20" fill="#8A8A8A"/>` +
    `<g transform="translate(60,0)"><g id="crater"><ellipse cx="540" cy="760" rx="100" ry="34" fill="#7E7E7E"/><ellipse cx="540" cy="752" rx="86" ry="26" fill="#6A6A6A"/></g>` +
    `<g id="rover"><rect x="350" y="700" width="110" height="46" rx="10" fill="#E9ECF2" stroke="#7D8794" stroke-width="4"/><rect x="370" y="676" width="60" height="26" rx="6" fill="#2F6FD6"/><circle cx="372" cy="752" r="16" fill="#3E4A5C"/><circle cx="440" cy="752" r="16" fill="#3E4A5C"/><path d="M450 700 v-30" stroke="#7D8794" stroke-width="4"/><circle cx="450" cy="666" r="7" fill="#E53935"/></g>` +
    `<g id="pathBad" style="display:none"><path d="M460 730 Q540 760 620 745" stroke="#E53935" stroke-width="10" stroke-dasharray="16 12" fill="none"/>${txt(560, 790, '', 1)}</g>` +
    `<g id="pathGood" style="display:none"><path d="M460 720 Q520 600 560 600" stroke="#2FBF71" stroke-width="10" stroke-dasharray="16 12" fill="none"/></g></g>` +
    `<g id="prints" style="display:none" fill="#8A8A8A">${[0,1,2,3,4].map(i => `<ellipse cx="${120+i*28}" cy="${930 + (i%2)*14}" rx="9" ry="14"/>`).join('')}</g>`;
  EPISODES.push({ n:26, season:3, title:'Moon Footprints', icon:'🌕', setting:'The Moon',
    tip:'The Moon has no air, so astronauts wear spacesuits, and footprints stay for a very long time.',
    scene: moon,
    async run(E){
      crew(E, { ex:200, sx:60 });
      await E.say('title');
      await E.evanTo(290, 955, 900, true); show(E, 'prints');
      await E.say('e_moon');
      await E.say('a_air');
      await E.say('s_rover');
      await E.tap('aama', 'a_tapme');
      E.scan('rover'); await E.say('a_scan'); E.scanOff();
      show(E, 'pathBad'); show(E, 'pathGood');
      E.$('front').innerHTML = tray('tray', 390, 840, 270, 120, `<g id="cBad"><rect x="405" y="860" width="115" height="80" rx="12" fill="#FDECEA"/><path d="M418 900 h90" stroke="#E53935" stroke-width="10" stroke-dasharray="14 10"/><ellipse cx="463" cy="900" rx="22" ry="12" fill="#6A6A6A"/></g><g id="cGood"><rect x="530" y="860" width="115" height="80" rx="12" fill="#E5F4E4"/><path d="M543 915 q45 -50 90 0" stroke="#2FBF71" stroke-width="10" fill="none" stroke-dasharray="14 10"/><ellipse cx="588" cy="915" rx="22" ry="12" fill="#6A6A6A"/></g>`);
      await E.choice(['cBad', 'cGood'], 'cGood', 'a_which');
      E.$('front').innerHTML = ''; hide(E, 'pathBad');
      E.sfx.vroom();
      await moveTo(E, 'rover', 90, -90, 900); await moveTo(E, 'rover', 150, -130, 700);
      hide(E, 'pathGood');
      await E.say('e_drive');
      await E.say('s_safe');
    }
  });

  /* ================= EPISODE 27 ================= */
  const station = () => `<rect width="900" height="1000" fill="#E9EEF5"/><rect y="0" width="900" height="120" fill="#D3DBE6"/>` +
    `<defs><clipPath id="sw"><circle cx="560" cy="300" r="130"/></clipPath></defs><g clip-path="url(#sw)">${space(27)}${earth(560, 420, 190)}</g><circle cx="560" cy="300" r="130" fill="none" stroke="#9AA5B4" stroke-width="16"/>` +
    Array.from({length:6}, (_, i) => `<rect x="${30 + i*150}" y="560" width="130" height="90" rx="10" fill="#F7F9FC" stroke="#C9D3E2" stroke-width="3"/>`).join('') +
    `<g id="clip"><rect x="80" y="300" width="120" height="30" rx="8" fill="#5D6B80"/><circle cx="110" cy="315" r="7" fill="#C9D3E2"/><circle cx="170" cy="315" r="7" fill="#C9D3E2"/></g>` +
    `<rect y="800" width="900" height="200" fill="#C9D3E2"/>` +
    `<g id="bowls"><path d="M395 880 h80 q-6 44 -40 44 q-34 0 -40 -44z" fill="#E53935"/><path d="M495 880 h80 q-6 44 -40 44 q-34 0 -40 -44z" fill="#FFD43B"/><path d="M595 880 h80 q-6 44 -40 44 q-34 0 -40 -44z" fill="#2FBF71"/></g>` +
    `<g id="fApple"><circle cx="420" cy="470" r="30" fill="#E53935"/><path d="M420 440 q6 -16 18 -18" stroke="#4E8A40" stroke-width="5" fill="none"/></g>` +
    `<g id="fJuice"><rect x="440" y="610" width="50" height="70" rx="8" fill="#FFD43B" stroke="#E0B000" stroke-width="3"/><path d="M475 610 v-24" stroke="#fff" stroke-width="6"/></g>` +
    `<g id="fTort"><circle cx="690" cy="520" r="40" fill="#EAC98B" stroke="#C9A25C" stroke-width="4"/><circle cx="675" cy="510" r="5" fill="#C9A25C"/><circle cx="700" cy="535" r="5" fill="#C9A25C"/></g>` +
    `<g id="wrench"><path d="M500 740 l90 -50" stroke="#7D8794" stroke-width="14" stroke-linecap="round"/><circle cx="595" cy="687" r="16" fill="none" stroke="#7D8794" stroke-width="10"/></g>`;
  EPISODES.push({ n:27, season:3, title:'Floating Breakfast', icon:'🍎', setting:'A space station',
    tip:'In space things float, so astronauts strap down their tools and sleep in sleeping bags tied to the wall.',
    scene: station,
    async run(E){
      crew(E, { ex:265, sx:80, ax:830 });
      const fl = E.$('evanJump').animate([{transform:'translateY(0)'},{transform:'translateY(-30px)'}], {duration:1400, iterations:Infinity, direction:'alternate', easing:'ease-in-out'});
      const drift = ['fApple','fJuice','fTort','wrench'].map((id, i) => E.node(id).animate([{transform:'translate(0,0) rotate(0)'},{transform:`translate(${i%2?14:-14}px,-22px) rotate(${i%2?12:-12}deg)`}], {duration:1600 + i*300, iterations:Infinity, direction:'alternate'}));
      await E.say('title');
      await E.say('a_station');
      await E.say('e_float');
      await E.say('s_food');
      await E.tap('aama', 'a_tapme');
      E.scan('fTort'); await E.say('a_scan'); E.scanOff();
      const into = async (id, bx, i) => { drift[i].cancel(); E.sfx.plop(); const b = E.bbox(E.node(id)); await moveTo(E, id, bx - b.cx, 880 - b.cy, 700, .7); };
      await E.tap('fApple', 'a_apple'); await into('fApple', 435, 0);
      await E.tap('fJuice', 'a_juice'); await into('fJuice', 535, 1);
      await E.tap('fTort', 'a_tort'); await into('fTort', 635, 2);
      await E.say('e_yum');
      await E.say('s_tools');
      await E.tap('wrench', 'a_clip');
      drift[3].cancel(); E.sfx.click(); { const b = E.bbox(E.node('wrench')); await moveTo(E, 'wrench', 140 - b.cx, 300 - b.cy, 700, .8, -30); }
      fl.cancel();
    }
  });

  /* ================= EPISODE 28 ================= */
  const sunView = () => `<defs><radialGradient id="sunG"><stop offset="0" stop-color="#FFF6C2"/><stop offset=".5" stop-color="#FFC233"/><stop offset=".85" stop-color="#FF8A1F"/><stop offset="1" stop-color="#FF8A1F" stop-opacity="0"/></radialGradient></defs><circle cx="500" cy="330" r="260" fill="url(#sunG)"/><g fill="#FF7A00" opacity=".5"><circle cx="430" cy="280" r="18"/><circle cx="560" cy="380" r="12"/></g>`;
  EPISODES.push({ n:28, season:3, title:'Hot, Hotter, Hottest', icon:'☀️', setting:'Near the Sun, Mercury and Venus',
    tip:'The Sun is a giant ball of hot gas. Mercury is closest to it, but Venus is the hottest planet.',
    scene: () => cabin(sunView(), 28) + `<g id="shield" style="transform:translateY(-520px)"><rect x="290" y="190" width="420" height="420" rx="20" fill="#3E2A10" opacity=".78"/><path d="M300 400 H700" stroke="#FFC233" stroke-width="4" opacity=".6"/></g><g id="shieldBtn"><rect x="40" y="620" width="120" height="120" rx="18" fill="#1B2240" stroke="#FFC233" stroke-width="4"/><path d="M100 650 l-30 40 h60z" fill="#FFC233"/><rect x="85" y="690" width="30" height="30" fill="#FFC233"/></g><rect id="heat" width="900" height="1000" fill="#FF5A1F" opacity="0" pointer-events="none"/>`,
    async run(E){
      crew(E);
      await E.say('title');
      await E.say('a_sun');
      const h = E.node('heat'); h.style.transition = 'opacity 1.5s'; h.setAttribute('opacity', '.22');
      await E.say('e_hot');
      await E.tap('aama', 'a_tapme');
      E.scan('shieldBtn'); await E.say('a_scan'); E.scanOff();
      await E.tap('shieldBtn', null);
      E.sfx.whoosh(); const sh = E.node('shield'); sh.style.transition = 'transform 1.2s'; sh.style.transform = 'translateY(0)'; h.setAttribute('opacity', '0');
      await E.wait(1200);
      await E.say('s_cool');
      E.$('front').innerHTML = tray('tray', 380, 790, 280, 160,
        `<g id="pMerc">${planet(430, 860, 30, '#9E9E9E', [], '<circle cx="420" cy="850" r="6" fill="#7E7E7E"/><circle cx="440" cy="872" r="5" fill="#7E7E7E"/>')}</g>` +
        `<g id="pVenus">${planet(530, 860, 36, '#E8C26B', [[.3,.1,'#F2D58F'],[.6,.08,'#D9AD52']])}</g>` +
        `<g id="pEarth">${earth(615, 860, 32)}</g>` +
        `<g id="nums">${txt(430, 935, '1', 26, '#2F6FD6', 700)}${txt(530, 935, '2', 26, '#2F6FD6', 700)}${txt(615, 935, '3', 26, '#2F6FD6', 700)}</g>`);
      const ok = (id) => { E.sfx.bell(); E.anim(E.node(id), [{transform:'scale(1)'},{transform:'scale(1.15)'},{transform:'scale(1)'}], {duration:400}); };
      await E.tap('pMerc', 'a_order'); ok('pMerc');
      await E.tap('pVenus', 'a_second'); ok('pVenus');
      await E.tap('pEarth', 'a_third'); ok('pEarth');
      await E.say('e_order');
      await E.say('s_hottest');
      await E.say('a_venus');
      E.$('front').innerHTML = '';
    }
  });

  /* ================= EPISODE 29 ================= */
  const mars = () => `<defs><linearGradient id="msky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C98A6B"/><stop offset="1" stop-color="#F2C29A"/></linearGradient></defs><rect width="900" height="1000" fill="url(#msky)"/>` +
    `<path d="M0 520 L140 420 L260 500 L420 380 L600 500 L760 430 L900 520 V600 H0Z" fill="#A64B2A"/><rect y="580" width="900" height="420" fill="#C1582F"/><g fill="#9E4426">${[[120,700,40],[700,760,55],[420,900,30],[820,620,24]].map(([x,y,r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.45}"/>`).join('')}</g>` +
    `<g id="mrover" transform="translate(-40,0)"><rect x="470" y="660" width="170" height="60" rx="10" fill="#E9ECF2" stroke="#7D8794" stroke-width="4"/><g id="panels"><rect x="430" y="620" width="250" height="30" fill="#1E3A6E" stroke="#7D8794" stroke-width="4"/><path d="M490 620v30M550 620v30M610 620v30" stroke="#7D8794" stroke-width="3"/></g><g id="dust"><rect x="432" y="622" width="82" height="26" fill="#B5603C"/><rect x="514" y="622" width="82" height="26" fill="#B86A44"/><rect x="596" y="622" width="82" height="26" fill="#B5603C"/></g><circle cx="490" cy="730" r="20" fill="#3E4A5C"/><circle cx="555" cy="730" r="20" fill="#3E4A5C"/><circle cx="620" cy="730" r="20" fill="#3E4A5C"/><path d="M630 660 v-50" stroke="#7D8794" stroke-width="5"/><circle id="eye" cx="630" cy="600" r="12" fill="#5D6B80"/></g>`;
  EPISODES.push({ n:29, season:3, title:'Red Planet Rover', icon:'🔴', setting:'Mars',
    tip:'Mars is red because its dust has rust in it. Rovers there use sunlight for power.',
    scene: mars,
    async run(E){
      crew(E, { sx:90, ex:270 });
      await E.say('title');
      await E.say('e_red');
      await E.say('a_mars');
      await E.say('s_rover');
      await E.tap('aama', 'a_tapme');
      E.scan('mrover'); await E.say('a_scan'); E.scanOff();
      const d = E.node('dust').children;
      await E.taps('panels', 3, 'a_wipe', async (i) => { E.sfx.wipe(); d[i-1].style.transition = 'opacity .5s'; d[i-1].style.opacity = 0; await E.wait(500); });
      E.node('eye').setAttribute('fill', '#2FBF71'); E.sfx.bell();
      await E.anim(E.node('mrover'), [{transform:'translateX(0)'},{transform:'translateX(-20px)'},{transform:'translateX(0)'}], {duration:900});
      await E.say('e_wake');
    }
  });

  /* ================= EPISODE 30 ================= */
  const rock = (x, y, r) => `<path d="M${x-r} ${y} q${r*.2} ${-r} ${r} ${-r} q${r*.9} ${r*.1} ${r} ${r*.9} q${-r*.3} ${r*.9} ${-r*1.1} ${r*.7} q${-r*.8} ${-r*.1} ${-r*.9} ${-r*.6}z" fill="#8A7A6A" stroke="#5E5244" stroke-width="3"/>`;
  const beltView = (step) => {
    const left = step % 2 === 0;
    return `<g id="rocks">${rock(left ? 420 : 580, 330, 60)}${rock(left ? 380 : 620, 240, 35)}${rock(left ? 440 : 560, 430, 30)}${rock(330, 160, 20)}${rock(680, 480, 22)}</g>`;
  };
  EPISODES.push({ n:30, season:3, title:'Asteroid Maze', icon:'☄️', setting:'The asteroid belt',
    tip:'Asteroids are space rocks. Comets are balls of ice and dust that grow a glowing tail near the Sun.',
    scene: () => cabin(`<g id="view">${beltView(0)}</g><g id="comet" style="transform:translate(-500px,-200px)"><circle cx="500" cy="300" r="18" fill="#DFF6FF"/><path d="M500 300 L300 200 L310 240Z" fill="#BFE8FF" opacity=".7"/><path d="M500 300 L320 250 L330 280Z" fill="#fff" opacity=".5"/></g>`, 30),
    async run(E){
      crew(E);
      await E.say('title');
      await E.say('s_rocks');
      await E.say('a_belt');
      const c = E.node('comet'); c.style.transition = 'transform 3s linear'; requestAnimationFrame(() => c.style.transform = 'translate(760px,240px)');
      await E.say('e_comet');
      await E.say('a_comet');
      const arrows = `<g id="goL"><path d="M480 880 h-70 M440 850 l-30 30 l30 30" stroke="#2F6FD6" stroke-width="16" fill="none" stroke-linecap="round"/></g><g id="goR"><path d="M560 880 h70 M600 850 l30 30 l-30 30" stroke="#2F6FD6" stroke-width="16" fill="none" stroke-linecap="round"/></g>`;
      E.$('front').innerHTML = tray('tray', 380, 810, 280, 140, arrows);
      const lines = ['a_steer1', 'a_steer2', 'a_steer3'];
      for(let s = 0; s < 3; s++){
        E.node('view').innerHTML = beltView(s);
        const right = s % 2 === 0; /* rocks on the left when step is even */
        await E.choice(['goL', 'goR'], right ? 'goR' : 'goL', lines[s]);
        E.sfx.whoosh();
        await E.anim(E.node('view'), [{transform:'translateX(0)'},{transform:`translateX(${right ? -260 : 260}px)`}], {duration:700});
      }
      E.node('view').innerHTML = '';
      E.$('front').innerHTML = '';
      await E.say('e_through');
      await E.say('s_yes');
    }
  });

  /* ================= EPISODE 31 ================= */
  const jupiter = () => planet(500, 330, 230, '#D9A36B', [[.12,.08,'#F2DFC2'],[.24,.1,'#B9784A'],[.38,.08,'#F2DFC2'],[.52,.12,'#C98A5A'],[.68,.07,'#F2DFC2'],[.8,.1,'#B9784A']], `<ellipse id="spot" cx="580" cy="400" rx="50" ry="28" fill="#C2452D"/>`);
  EPISODES.push({ n:31, season:3, title:'The Giant Storm', icon:'🪐', setting:'Jupiter',
    tip:'Jupiter is the biggest planet. It is made of gas, and its Great Red Spot is a storm bigger than Earth.',
    scene: () => cabin(jupiter(), 31),
    async run(E){
      crew(E);
      await E.say('title');
      await E.say('e_big');
      await E.say('a_gas');
      await E.say('s_spot');
      E.scan({cx:580, cy:470, w:140, h:90}); await E.say('a_spot'); E.scanOff();
      const st = (x, c) => `<rect x="${x}" y="805" width="42" height="64" rx="8" fill="${c}"/>`;
      E.$('front').innerHTML = tray('tray', 380, 785, 280, 185, st(400, '#D9823F') + st(450, '#F2DFC2') + st(500, '#D9823F') + st(550, '#F2DFC2') + `<rect id="gap" x="600" y="805" width="42" height="64" rx="8" fill="none" stroke="#9AA5B4" stroke-width="3" stroke-dasharray="6 5"/>${txt(621, 848, '?', 28, '#9AA5B4', 700)}` +
        `<g id="oOr"><circle cx="440" cy="925" r="24" fill="#D9823F"/></g><g id="oBl"><circle cx="520" cy="925" r="24" fill="#2F6FD6"/></g><g id="oGr"><circle cx="600" cy="925" r="24" fill="#2FBF71"/></g>`);
      await E.say('e_stripes');
      await E.tap('aama', 'a_tapme');
      E.scan('tray'); await E.say('a_scan'); E.scanOff();
      await E.choice(['oOr', 'oBl', 'oGr'], 'oOr', null);
      E.sfx.click(); E.node('gap').setAttribute('fill', '#D9823F'); E.node('gap').setAttribute('stroke', 'none');
      await E.say('e_done');
      E.$('front').innerHTML = '';
    }
  });

  /* ================= EPISODE 32 ================= */
  const saturn = () => `<g><ellipse cx="500" cy="330" rx="250" ry="60" fill="none" stroke="#E8D3A2" stroke-width="26" opacity=".85"/></g>` + planet(500, 330, 130, '#E3C27D', [[.3,.12,'#EED9A8'],[.55,.1,'#CFA75E']]) + `<path d="M250 330 A250 60 0 0 0 750 330" fill="none" stroke="#E8D3A2" stroke-width="26" opacity=".95"/><path d="M262 330 A238 52 0 0 0 738 330" fill="none" stroke="#C9AE76" stroke-width="6"/>`;
  EPISODES.push({ n:32, season:3, title:'Rings of Ice', icon:'💍', setting:'Saturn',
    tip:"Saturn's rings are made of ice and rock, from tiny pieces to pieces as big as a house.",
    scene: () => cabin(saturn(), 32) + `<g id="antenna"><rect x="40" y="250" width="130" height="130" rx="16" fill="#1B2240" stroke="#9AA5B4" stroke-width="4"/><g id="ant" style="transform-box:fill-box;transform-origin:50% 100%;transform:rotate(35deg)"><path d="M105 350 V280" stroke="#C9D3E2" stroke-width="8"/><circle cx="105" cy="275" r="12" fill="#FFD43B"/></g></g>`,
    async run(E){
      crew(E);
      await E.say('title');
      await E.say('e_rings');
      await E.say('a_rings');
      E.sfx.pop(); await E.anim(E.$('scene'), [{transform:'translate(0,0)'},{transform:'translate(8px,-4px)'},{transform:'translate(-8px,4px)'},{transform:'translate(0,0)'}], {duration:500});
      await E.say('bump');
      await E.tap('aama', 'a_tapme');
      const piece = (id, x, r) => `<g id="${id}"><path d="M${x-r} 880 q${r*.3} ${-r} ${r} ${-r} q${r} 0 ${r} ${r} q${-r*.2} ${r*.9} ${-r} ${r*.8} q${-r*.9} 0 ${-r} ${-r*.8}z" fill="#E8F4FF" stroke="#9FC6E6" stroke-width="3"/></g>`;
      E.$('front').innerHTML = tray('tray', 380, 790, 280, 170, piece('rBig', 440, 40) + piece('rSmall', 530, 16) + piece('rMid', 600, 26) + `<g>${[0,1,2].map(i => `<rect x="${395+i*85}" y="925" width="75" height="26" rx="8" fill="none" stroke="#C9D3E2" stroke-width="3" stroke-dasharray="5 4"/>`).join('')}</g>`);
      E.scan('tray'); await E.say('a_scan'); E.scanOff();
      const put = async (id, i) => { E.sfx.click(); const b = E.bbox(E.node(id)); await moveTo(E, id, 432 + i*85 - b.cx, 905 - b.cy, 500, .55); };
      await put('rSmall', 0);
      await E.tap('rMid', 'a_mid'); await put('rMid', 1);
      await E.tap('rBig', 'a_big'); await put('rBig', 2);
      E.$('front').innerHTML = '';
      await E.tap('antenna', 'a_ant');
      E.sfx.squeak(); const a = E.node('ant'); a.style.transition = 'transform .6s'; a.style.transform = 'rotate(0deg)';
      await E.wait(600);
      E.$('front').innerHTML = screen('call', 718, 262, 160, 160, [['orion', .3038], ['kestrel', .4486]], 'Call from Earth');
      E.sfx.bell();
      await E.say('o_call');
      await E.say('k_call');
      await E.say('e_call');
    }
  });

  /* ================= EPISODE 33 ================= */
  const twoPlanets = () => `<g id="uranus"><ellipse cx="400" cy="300" rx="18" ry="120" fill="none" stroke="#CFF3F5" stroke-width="5" opacity=".8"/>${planet(400, 300, 80, '#9EE0E6', [[.45,.1,'#B8ECEF']])}</g>` +
    `<g id="neptune">${planet(610, 380, 85, '#2B57C9', [[.3,.06,'#3D6EE0'],[.62,.05,'#1E3F9A']], '<path d="M560 350 q40 -10 90 0" stroke="#fff" stroke-width="5" fill="none" opacity=".7"/><path d="M570 410 q40 -8 70 2" stroke="#fff" stroke-width="4" fill="none" opacity=".6"/>')}</g>`;
  EPISODES.push({ n:33, season:3, title:'The Sideways Planet', icon:'🔵', setting:'Uranus and Neptune',
    tip:'Uranus spins on its side. Neptune has the fastest winds of any planet.',
    scene: () => cabin(twoPlanets(), 33),
    async run(E){
      crew(E);
      await E.say('title');
      await E.say('s_map');
      await E.tap('aama', 'a_tapme');
      E.scan({cx:500, cy:400, w:380, h:300}); await E.say('a_scan'); E.scanOff();
      await E.choice(['uranus', 'neptune'], 'uranus', 'a_uranus');
      E.sfx.bell(); E.anim(E.node('uranus'), [{transform:'rotate(0)'},{transform:'rotate(360deg)'}], {duration:1500});
      await E.say('e_roll');
      await E.choice(['uranus', 'neptune'], 'neptune', 'a_neptune');
      E.sfx.whoosh();
      await E.say('s_wind');
    }
  });

  /* ================= EPISODE 34 ================= */
  const pluto = () => `<rect width="900" height="1000" fill="#05081A"/>` + stars(34, 140, 560) + `<circle cx="760" cy="140" r="8" fill="#FFF3C4"/>` +
    `<path d="M0 560 Q300 520 600 560 T900 540 V1000 H0Z" fill="#C9B9A2"/><path d="M0 640 Q300 610 600 640 T900 630 V1000 H0Z" fill="#B7A48A"/>` +
    `<path id="heart" d="M520 640 c-40 -60 -130 -10 -90 50 l90 80 l90 -80 c40 -60 -50 -110 -90 -50z" fill="#F2E6D6"/>` +
    `<g id="radio" transform="translate(0,130)"><rect x="360" y="190" width="200" height="140" rx="16" fill="#1B2240" stroke="#9AA5B4" stroke-width="4"/><path d="M460 190 V140" stroke="#9AA5B4" stroke-width="5"/><circle cx="460" cy="134" r="8" fill="#E53935"/>${[0,1,2].map(i => `<rect id="bar${i}" x="${400+i*45}" y="${300-(i+1)*30}" width="30" height="${(i+1)*30}" rx="4" fill="#3E4A5C"/>`).join('')}</g>`;
  EPISODES.push({ n:34, season:3, title:'Little Pluto', icon:'💜', setting:'Pluto',
    tip:'Pluto is a dwarf planet, far away and very cold, with a big heart shape on it.',
    scene: pluto,
    async run(E){
      crew(E, { sx:90, ex:280 });
      await E.say('title');
      await E.say('e_small');
      E.scan('heart'); await E.say('a_dwarf'); E.scanOff();
      await E.say('e_heart');
      await E.say('s_radio');
      await E.tap('aama', 'a_tapme');
      E.scan('radio'); await E.say('a_scan'); E.scanOff();
      await E.taps('radio', 3, null, async (i) => { E.sfx.beep(); E.node('bar' + (i-1)).setAttribute('fill', '#2FBF71'); await E.wait(300); });
      await E.say('count');
      E.$('front').innerHTML = screen('mc', 738, 262, 130, 160, [['dallu', .3066]]);
      E.sfx.bell();
      await E.say('d_radio');
      await E.say('e_radio');
    }
  });

  /* ================= EPISODE 35 ================= */
  const DIP = [[370,230],[430,250],[480,290],[540,300],[560,380],[650,390],[670,310]];
  const dipView = () => `<rect x="300" y="130" width="400" height="400" fill="#05081A" opacity=".5"/><g id="dlines"></g><g id="dipper">${DIP.map(([x,y], i) => `<circle id="st${i}" cx="${x}" cy="${y}" r="14" fill="#FFF3A3"/><circle cx="${x}" cy="${y}" r="26" fill="#FFF3A3" opacity=".25"/>`).join('')}</g>`;
  EPISODES.push({ n:35, season:3, title:'Follow the Stars', icon:'✨', setting:'Deep space, on the way home',
    tip:'The Sun is a star too. It looks big because it is the closest star to us.',
    scene: () => cabin(dipView(), 35) + `<g id="map"><rect x="40" y="250" width="140" height="110" rx="14" fill="#1B2240" stroke="#9AA5B4" stroke-width="4"/><rect id="mapScr" x="52" y="262" width="116" height="86" rx="8" fill="#2F6FD6"/></g>`,
    async run(E){
      crew(E);
      await E.say('title');
      await E.say('a_home');
      E.sfx.pop(); E.node('mapScr').setAttribute('fill', '#05081A');
      await E.say('s_dark');
      await E.tap('aama', 'a_tapme');
      E.scan('dipper'); await E.say('a_scan'); E.scanOff();
      const L = E.node('dlines');
      await E.taps('dipper', 6, 'a_dots', async (i) => {
        E.sfx.click(); const [a, b] = [DIP[i-1], DIP[i]];
        L.insertAdjacentHTML('beforeend', `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#FFD43B" stroke-width="6" stroke-linecap="round"/>`);
        await E.wait(250);
      });
      L.insertAdjacentHTML('beforeend', `<line x1="${DIP[6][0]}" y1="${DIP[6][1]}" x2="${DIP[3][0]}" y2="${DIP[3][1]}" stroke="#FFD43B" stroke-width="6" stroke-linecap="round"/>`);
      E.node('mapScr').setAttribute('fill', '#2FBF71'); E.sfx.bell();
      await E.say('e_spoon');
      await E.say('s_sun');
      await E.say('a_sun');
    }
  });

  /* ================= EPISODE 36 ================= */
  const reentry = () => earth(500, 560, 320) + `<rect id="glow" x="300" y="130" width="400" height="400" fill="#FF6A1F" opacity="0"/>`;
  const chute = (id, x, r, c) => `<g id="${id}"><path d="M${x-r} 300 q${r} ${-r*1.4} ${2*r} 0z" fill="${c}" stroke="#fff" stroke-width="3"/><path d="M${x-r} 300 L${x} 380 M${x+r} 300 L${x} 380 M${x} 300 L${x} 380" stroke="#C9D3E2" stroke-width="2"/></g>`;
  const beach = () => `<defs><linearGradient id="bsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7EC8F2"/><stop offset="1" stop-color="#CFEFFF"/></linearGradient></defs><rect width="900" height="1000" fill="url(#bsky)"/><circle cx="780" cy="120" r="50" fill="#FFD43B"/>` +
    `<rect y="430" width="900" height="250" fill="#2F8FD6"/><path d="M0 470 q60 -14 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0" stroke="#BFE8FF" stroke-width="5" fill="none"/>` +
    `<g id="capsule"><path d="M380 520 L420 420 H500 L540 520Z" fill="#EEF2F7" stroke="#9AA5B4" stroke-width="5"/><circle cx="460" cy="470" r="18" fill="#9FD3F2"/><ellipse cx="460" cy="525" rx="90" ry="14" fill="#E53935"/></g>` +
    `<rect y="660" width="900" height="340" fill="#F2D8A2"/><path d="M0 660 q120 -20 240 0 t240 0 t240 0 t240 0" fill="#E8F4FF" opacity=".6"/>`;
  EPISODES.push({ n:36, season:3, title:'Splashdown!', icon:'🌊', setting:'Back to Earth',
    tip:"Earth's air slows a space capsule down and makes it hot, so a heat shield keeps the astronauts safe.",
    scene: () => cabin(reentry(), 36),
    async run(E){
      crew(E);
      await E.say('title');
      await E.say('a_earth');
      const g = E.node('glow'); g.style.transition = 'opacity 1.5s'; g.setAttribute('opacity', '.45');
      E.sfx.vroom();
      await E.say('e_fast');
      await E.say('a_shield');
      await E.tap('aama', 'a_tapme');
      E.$('front').innerHTML = tray('tray', 380, 760, 280, 200, `<g transform="translate(0,520)">${chute('chS', 425, 22, '#FFD43B') + chute('chM', 510, 32, '#2F6FD6') + chute('chB', 605, 44, '#E53935')}</g>`);
      ['chS','chM','chB'].forEach(id => { E.node(id).style.opacity = .35; });
      E.scan('tray'); await E.say('a_scan'); E.scanOff();
      const open = (id) => { E.sfx.whoosh(); E.node(id).style.transition = 'opacity .4s'; E.node(id).style.opacity = 1; };
      await E.tap('chS', null); open('chS');
      await E.tap('chM', 'a_mid'); open('chM');
      await E.tap('chB', 'a_big'); open('chB');
      g.setAttribute('opacity', '0');
      await E.wait(600);
      E.$('front').innerHTML = '';
      E.sfx.plop();
      await swap(E, beach());
      E.personDrop('shivu');
      E.evanSet(225, 955); E.aamaSet(845, 945);
      E.person('shivu', 72, 945, { img:'shivusp', scale:.8 });
      await E.say('e_splash');
      E.people([['dallu', 362, 905, {scale:.8}], ['baba', 500, 905, {scale:.8}], ['habba', 642, 905, {scale:.8}]]);
      await E.say('d_welcome');
      await E.say('b_proud');
      await Promise.all([E.personOut('dallu'), E.personOut('baba')]);
      E.people([['buwa', 362, 905, {scale:.8, fade:true}], ['gaama', 500, 905, {scale:.8, fade:true}]]);
      await E.say('h_shabash');
      await E.say('g_welcome');
      await E.say('e_story');
      await E.say('s_next');
    }
  });
  EPISODES.filter(e => e.season === 3 && e.n !== 25).forEach(e => { const prev = e.setup; e.setup = E => { E.evanSuit(true); E.evanSet(275, 955); if(prev) prev(E); }; });
})();
