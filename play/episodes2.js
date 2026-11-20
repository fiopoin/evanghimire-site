/* Evan & Aama, Season 2: The Trip to Nepal */
(function(){
  const H = window.H, EPISODES = window.EPISODES;

  /* ---------- helpers ---------- */
  function moveTo(E, id, dx, dy, ms, sc){ const n = E.node(id); n.style.transformBox = 'fill-box'; n.style.transformOrigin = 'center'; n.style.transition = `transform ${ms||800}ms ease-in-out`; n.style.transform = `translate(${dx}px,${dy}px)` + (sc != null ? ` scale(${sc})` : ''); return E.wait(ms || 800); }
  function hide(E, id){ E.node(id).style.display = 'none'; }
  function showEl(E, id){ E.node(id).style.display = ''; }
  async function swap(E, markup, front){
    const sc = E.$('scene');
    await E.anim(sc, [{opacity:1},{opacity:0}], {duration:450, fill:'forwards'});
    sc.innerHTML = markup; E.$('front').innerHTML = front || '';
    await E.anim(sc, [{opacity:0},{opacity:1}], {duration:450, fill:'forwards'});
  }
  const txt = (x, y, s, size, color, weight, anchor) => `<text x="${x}" y="${y}" font-family="Fredoka,sans-serif" font-size="${size||28}" font-weight="${weight||600}" fill="${color||'#24324A'}" text-anchor="${anchor||'middle'}">${s}</text>`;
  const hills = (y) => `<path d="M0 ${y} Q120 ${y-110} 260 ${y-40} T520 ${y-70} T780 ${y-30} T900 ${y-80} V${y+60} H0Z" fill="#7FAF7A"/><path d="M0 ${y+20} Q180 ${y-60} 340 ${y+5} T660 ${y-20} T900 ${y+10} V${y+80} H0Z" fill="#5E9A60"/>`;
  const mountains = (y) => `<path d="M60 ${y} L200 ${y-150} L270 ${y-90} L380 ${y-200} L520 ${y} Z" fill="#B9C9DD"/><path d="M380 ${y-200} L350 ${y-160} L372 ${y-165} L395 ${y-150} L410 ${y-170} Z" fill="#fff"/><path d="M440 ${y} L620 ${y-170} L760 ${y-60} L840 ${y-120} L900 ${y-80} V${y} Z" fill="#AFC0D6"/><path d="M620 ${y-170} L590 ${y-135} L615 ${y-140} L640 ${y-125} L652 ${y-140} Z" fill="#fff"/>`;
  const flags = (x1, y1, x2, y2) => { const c = ['#2F6FD6','#FFFFFF','#E53935','#2FBF71','#FFD43B']; let o = `<path d="M${x1} ${y1} Q${(x1+x2)/2} ${Math.max(y1,y2)+40} ${x2} ${y2}" stroke="#7A6A55" stroke-width="2" fill="none"/>`; for(let i=1;i<14;i++){ const t=i/14, x=x1+(x2-x1)*t, y=(1-t)*(1-t)*y1+2*(1-t)*t*(Math.max(y1,y2)+40)+t*t*y2; o += `<rect x="${x-9}" y="${y}" width="18" height="24" fill="${c[i%5]}" stroke="#00000022"/>`; } return o; };
  const marigolds = (x, y, n) => Array.from({length:n||5}, (_, i) => `<circle cx="${x + i*22}" cy="${y + (i%2)*10}" r="11" fill="${i%2 ? '#FF9F1C' : '#FFB703'}"/><circle cx="${x + i*22}" cy="${y + (i%2)*10}" r="4" fill="#E36414"/>`).join('');
  const brickWall = (id) => `<defs><pattern id="${id}" width="60" height="30" patternUnits="userSpaceOnUse"><rect width="60" height="30" fill="#B5583A"/><path d="M0 29.5H60M0 14.5H60M30 0V15M0.5 15V30M59.5 15V30" stroke="#8E3F27" stroke-width="2"/></pattern></defs>`;
  const suitcase = (id, x, y, color, tag) => `<g id="${id}"><rect x="${x}" y="${y}" width="130" height="160" rx="16" fill="${color}" stroke="#00000033" stroke-width="4"/><path d="M${x+30} ${y} V${y-26} H${x+100} V${y}" fill="none" stroke="#333" stroke-width="8"/><path d="M${x+20} ${y+30} V${y+140} M${x+110} ${y+30} V${y+140}" stroke="#00000022" stroke-width="5"/><circle cx="${x+22}" cy="${y+166}" r="10" fill="#333"/><circle cx="${x+108}" cy="${y+166}" r="10" fill="#333"/>${tag ? `<rect x="${x+16}" y="${y+56}" width="98" height="38" rx="6" fill="#FFF8E1" stroke="#C9A227" stroke-width="3"/>` + txt(x+65, y+84, tag, 22, '#24324A', 700) : ''}</g>`;
  const phoneCard = () => '';

  /* ================= EPISODE 13 ================= */
  EPISODES.push({ n:13, season:2, title:'Pack It Up!', icon:'🎒', setting:"Evan's bedroom",
    tip:'Pack your own small backpack, and take only what you can carry.',
    scene: () => H.wall('#DCEBF5', '#CFE0EE', 'w13') + H.window(620, 170, 200, 200) + H.frame(110, 190, 150, 120, '#F6E6C8') + H.floor('wood') + H.base() +
      `<rect x="290" y="560" width="40" height="240" rx="8" fill="#8A6440"/><rect x="300" y="640" width="330" height="150" rx="14" fill="#F2C35B"/><rect x="300" y="610" width="330" height="60" rx="18" fill="#FFFFFF"/><rect x="300" y="660" width="330" height="40" fill="#5FA8D3"/><rect x="618" y="600" width="30" height="200" rx="8" fill="#8A6440"/>` +
      H.rug(450, 920, 230, 40, '#9CC9A8') +
      `<g id="it_bottle"><rect x="330" y="560" width="34" height="70" rx="10" fill="#4FB0E8"/><rect x="337" y="548" width="20" height="16" rx="4" fill="#2F6FD6"/></g>` +
      `<g id="it_snack"><rect x="390" y="580" width="62" height="46" rx="8" fill="#FF8A3D"/><circle cx="421" cy="603" r="12" fill="#FFD43B"/></g>` +
      `<g id="it_phones"><path d="M478 610 Q505 560 532 610" fill="none" stroke="#24324A" stroke-width="8"/><rect x="470" y="600" width="18" height="30" rx="6" fill="#E53935"/><rect x="522" y="600" width="18" height="30" rx="6" fill="#E53935"/></g>` +
      `<g id="it_car"><rect x="558" y="596" width="62" height="26" rx="8" fill="#2FBF71"/><rect x="570" y="582" width="34" height="18" rx="6" fill="#7FDCB3"/><circle cx="572" cy="624" r="8" fill="#24324A"/><circle cx="606" cy="624" r="8" fill="#24324A"/></g>` +
      `<g id="it_dino" transform="translate(-130 150)"><path d="M690 790 Q680 700 720 650 Q740 560 790 560 Q840 560 830 610 Q820 640 790 640 Q800 700 840 760 L870 790 Z" fill="#7BC67E" stroke="#4E9A55" stroke-width="5"/><circle cx="805" cy="590" r="7" fill="#24324A"/><path d="M720 650 l-14 -16 M740 620 l-12 -18 M762 598 l-6 -20" stroke="#4E9A55" stroke-width="6"/></g>` +
      `<g id="pack"><path d="M380 860 Q380 800 450 800 Q520 800 520 860 V945 Q520 960 505 960 H395 Q380 960 380 945Z" fill="#E9A200" stroke="#B57E00" stroke-width="4"/><rect x="395" y="870" width="110" height="60" rx="10" fill="#F2B92E" stroke="#B57E00" stroke-width="3"/><path id="zipline" d="M392 830 Q450 812 508 830" fill="none" stroke="#7A5300" stroke-width="6" stroke-dasharray="6 5"/><g id="zip"><rect x="440" y="812" width="20" height="30" rx="5" fill="#9AA5B4" stroke="#5D6B80" stroke-width="3"/></g><path id="strap" d="M470 822 q20 10 30 40" stroke="#B57E00" stroke-width="8" fill="none"/></g>`,
    async run(E){
      E.evanSet(270, 955); E.aamaSet(800, 945);
      E.person('dallu', 110, 905, { scale:.95 });
      await E.say('title');
      await E.say('d_trip');
      await E.say('e_bigboy');
      E.person('habba', 600, 900, { scale:.9, fade:true });
      E.evanSet(260, 955);
      await E.say('h_carry');
      await E.personOut('habba');
      const into = async (id) => { E.sfx.whoosh(); const b = E.bbox(E.node(id)); await moveTo(E, id, 450 - b.cx, 860 - b.cy, 700, .3); hide(E, id); E.sfx.plop(); };
      await E.tap('it_bottle', 'a_pack'); await into('it_bottle');
      await E.tap('it_snack', 'a_snack'); await into('it_snack');
      await E.tap('it_phones', 'a_phones'); await into('it_phones');
      await E.choice(['it_dino', 'it_car'], 'it_car', 'a_dino'); await into('it_car');
      await E.say('e_dino');
      await E.say('e_stuck');
      await E.tap('aama', 'a_tapme');
      await E.aamaTo(700, 890);
      E.scan('zip'); await E.say('a_scan'); E.scanOff();
      await E.aamaTo(800, 945);
      const z = E.node('zip');
      await E.taps('zip', 3, 'a_zip', async (i) => {
        E.sfx.squeak(); z.style.transition = 'transform .35s';
        z.style.transform = i < 3 ? `translate(${i % 2 ? -8 : 8}px,0)` : 'translate(48px,4px)';
        if(i === 2) hide(E, 'strap');
        await E.wait(350);
      });
      E.sfx.click(); E.node('zipline').setAttribute('stroke-dasharray', '0');
      await E.say('e_zipped');
      await E.say('d_proud');
    }
  });

  /* ================= EPISODE 14 ================= */
  const cabin = () => `<rect width="900" height="1000" fill="#E9E4DA"/><path d="M0 0 H900 V140 Q450 220 0 140Z" fill="#F7F4EE"/>` +
    [150, 450, 750].map(x => `<rect x="${x-70}" y="250" width="140" height="190" rx="60" fill="#D8D2C6"/><rect x="${x-55}" y="265" width="110" height="160" rx="50" fill="#9FD3F2"/><g fill="#fff" opacity=".9"><circle cx="${x-20}" cy="360" r="18"/><circle cx="${x+5}" cy="350" r="24"/><circle cx="${x+30}" cy="362" r="16"/></g>`).join('') +
    `<rect x="0" y="470" width="900" height="16" fill="#CFC8BA"/><rect y="800" width="900" height="200" fill="#6E7FA6"/><path d="M0 830H900" stroke="#5E6F96" stroke-width="4"/>` +
    `<g id="sign"><rect x="400" y="150" width="100" height="56" rx="10" fill="#24324A"/><g id="signOn" style="display:none">${txt(450,190,'🔔',30)}</g></g>`;
  const seats = () => [240, 480, 720].map(x => `<rect x="${x-120}" y="560" width="240" height="250" rx="40" fill="#2F4F8F" opacity="0"/>`).join('') +
    [240, 480].map(x => `<path d="M${x-125} 840 H${x+125} V990 H${x-125}Z" fill="#2F4F8F"/><rect x="${x-130}" y="820" width="260" height="40" rx="14" fill="#3D63AD"/>`).join('');
  EPISODES.push({ n:14, season:2, title:'Up, Up and Away', icon:'✈️', setting:'The airport and the plane',
    tip:'Sip, swallow or yawn when the plane goes up or down, and stay buckled when the sign is on.',
    scene: () => H.wall('#EEF1F5', '#DFE5EC', 'w14') + `<rect x="0" y="120" width="900" height="300" fill="#BFD9EE"/>${mountains(420)}<path d="M0 120H900M300 120V420M600 120V420" stroke="#FFFFFF" stroke-width="10"/>` + H.floor('concrete') + H.base('#C9CED6') +
      `<rect x="250" y="700" width="580" height="60" rx="10" fill="#4A5568"/><path d="M260 712H820" stroke="#2D3748" stroke-width="6" stroke-dasharray="20 14"/><rect x="560" y="560" width="230" height="200" rx="18" fill="#9AA5B4" stroke="#6B7686" stroke-width="5"/><rect x="590" y="620" width="170" height="140" fill="#24324A"/><g fill="#24324A" opacity=".55"><rect x="595" y="620" width="16" height="70"/><rect x="615" y="620" width="16" height="70"/><rect x="635" y="620" width="16" height="70"/></g>` +
      `<g id="bin"><rect x="330" y="664" width="150" height="40" rx="8" fill="#B8C4D6" stroke="#7D8794" stroke-width="4"/></g>` +
      `<g id="bpack"><path d="M300 880 Q300 830 350 830 Q400 830 400 880 V945 Q400 958 388 958 H312 Q300 958 300 945Z" fill="#E9A200" stroke="#B57E00" stroke-width="4"/><rect x="315" y="890" width="70" height="44" rx="8" fill="#F2B92E"/></g>`,
    async run(E){
      E.aamaSet(800, 945); E.evanSet(170, 955);
      E.people([['dallu', 520, 900, {scale:.92}], ['baba', 660, 905, {scale:.95}]]);
      await E.say('title');
      await E.say('b_scanner');
      await E.say('d_ready');
      await E.say('e_ride');
      await E.tap('bpack', 'a_bin');
      E.sfx.whoosh(); await moveTo(E, 'bpack', 55, -205, 800, .6);
      E.sfx.vroom(); moveTo(E, 'bin', 280, 0, 1600); moveTo(E, 'bpack', 335, -205, 1600, .6);
      await E.say('e_bye');
      await swap(E, cabin(), seats());
      E.personOut('dallu', 1); E.person('baba', 720, 990, { scale:.95 });
      E.person('habba', 480, 990, { scale:.92 });
      E.evanSet(240, 1000); E.aamaSet(820, 720);
      await E.say('h_plane');
      E.sfx.bell(); showEl(E, 'signOn');
      E.$('front').insertAdjacentHTML('beforeend', `<g id="buckle"><rect x="150" y="900" width="180" height="22" rx="8" fill="#5D6B80"/><rect id="buckleL" x="190" y="892" width="44" height="38" rx="6" fill="#C9D3E2" stroke="#7D8794" stroke-width="3"/></g>`);
      await E.tap('buckle', 'a_sign');
      E.sfx.click(); E.node('buckleL').setAttribute('x', '218'); E.node('buckleL').setAttribute('fill', '#2FBF71');
      await E.say('e_click');
      await E.say('b_good');
      E.sfx.vroom(); await E.anim(E.$('scene'), [{transform:'rotate(0)'},{transform:'rotate(-2deg)'},{transform:'rotate(0)'}], {duration:1600});
      await E.say('e_ears');
      await E.tap('aama', 'a_tapme');
      E.scan({cx:240, cy:690, w:130, h:150}); await E.say('a_scan'); E.scanOff();
      E.$('front').insertAdjacentHTML('beforeend', `<g id="tray"><rect x="330" y="760" width="260" height="90" rx="16" fill="#FFFFFF" opacity=".95" stroke="#C9CED6" stroke-width="3"/><g id="cCup"><path d="M370 775 h46 l-6 60 h-34z" fill="#CFEFFF" stroke="#4FB0E8" stroke-width="4"/><rect x="376" y="795" width="34" height="34" fill="#4FB0E8" opacity=".6"/></g><g id="cDrum"><ellipse cx="520" cy="790" rx="44" ry="14" fill="#F2C35B"/><rect x="476" y="790" width="88" height="44" fill="#E53935"/><ellipse cx="520" cy="834" rx="44" ry="14" fill="#C62828"/><path d="M476 800 L564 830 M564 800 L476 830" stroke="#FFD43B" stroke-width="4"/></g></g>`);
      await E.choice(['cCup', 'cDrum'], 'cCup', 'a_which');
      hide(E, 'tray');
      E.evanHold('<path d="M110 -230 h40 l-5 48 h-30z" fill="#CFEFFF" stroke="#4FB0E8" stroke-width="4"/>');
      E.sfx.glug();
      await E.say('e_sip');
      E.evanHold(null);
      await E.say('h_next');
    }
  });

  /* ================= EPISODE 15 ================= */
  const arrivals = (sign) => H.wall('#F3EEE4', '#E6DFD2', 'wa') + `<rect x="0" y="130" width="900" height="300" fill="#BFE0F5"/>${mountains(380)}${hills(420)}<path d="M0 130H900M225 130V430M450 130V430M675 130V430" stroke="#FFFFFF" stroke-width="10"/><rect x="0" y="430" width="900" height="16" fill="#D3CBBB"/>` +
    `<rect x="250" y="225" width="400" height="66" rx="12" fill="#B71C1C"/>${txt(450, 270, sign, 34, '#FFFFFF', 700)}` + flags(0, 460, 230, 470) + flags(670, 470, 900, 460) + H.floor('tile') + H.base('#D3CBBB') +
    `<rect x="0" y="770" width="900" height="10" fill="#9AA5B4"/><g fill="#9AA5B4">${[60,240,420,600,780].map(x => `<rect x="${x}" y="730" width="10" height="70"/>`).join('')}</g><rect x="0" y="726" width="900" height="8" rx="4" fill="#C0C7D2"/>`;
  const habbaRoom = () => H.wall('#F4E6CF', '#EAD8BA', 'wh') + H.window(90, 170, 190, 200) + H.floor('tile') + H.base('#C9B48F') +
    `<g id="socket"><rect x="560" y="560" width="90" height="90" rx="10" fill="#FBFBF8" stroke="#BFC5CE" stroke-width="4"/><circle cx="590" cy="595" r="8" fill="#555"/><circle cx="620" cy="595" r="8" fill="#555"/><circle cx="605" cy="625" r="8" fill="#555"/></g>` +
    `<g id="aaPlug"><rect x="690" y="610" width="40" height="30" rx="6" fill="#24324A"/><rect x="732" y="616" width="16" height="6" fill="#B8C4D6"/><rect x="732" y="628" width="16" height="6" fill="#B8C4D6"/></g>` +
    `<g id="tray15" style="display:none"><rect x="300" y="820" width="330" height="110" rx="18" fill="#FFFFFF" opacity=".95" stroke="#E0D6C2" stroke-width="3"/>` +
    `<g id="ad1"><rect x="325" y="845" width="70" height="60" rx="10" fill="#E9A200"/>${txt(360, 885, '?', 30, '#fff', 700)}</g>` +
    `<g id="ad2"><rect x="430" y="845" width="70" height="60" rx="10" fill="#2E9C8A"/><circle cx="452" cy="868" r="6" fill="#fff"/><circle cx="478" cy="868" r="6" fill="#fff"/><circle cx="465" cy="888" r="6" fill="#fff"/></g>` +
    `<g id="ad3"><rect x="535" y="845" width="70" height="60" rx="10" fill="#9AA5B4"/><rect x="555" y="860" width="8" height="30" fill="#fff"/><rect x="577" y="860" width="8" height="30" fill="#fff"/></g></g>`;
  EPISODES.push({ n:15, season:2, title:'Hello, Kathmandu!', icon:'🙏', setting:'Kathmandu airport and Habba’s house',
    tip:'Sunshine helps your body clock catch up. Sockets are for grown-ups.',
    scene: () => arrivals('Welcome to Nepal'),
    async run(E){
      E.aamaSet(800, 945); E.evanSet(170, 955);
      E.person('habba', 380, 900, { scale:.95 });
      await E.say('title');
      await E.say('h_home');
      await E.say('a_time');
      await E.say('e_morning');
      await E.personOut('habba');
      E.person('shivu', 900, 900); await E.personTo('shivu', 400, 900, 1400);
      await E.say('s_here');
      await E.say('e_shivu');
      E.person('maa', 530, 895, { scale:.95, fade:true }); E.person('papa', 660, 895, { scale:.95, fade:true });
      E.evanHold(`<g transform="translate(0 -300)"><path d="M-60 0 Q0 90 60 0" fill="none" stroke="#FF9F1C" stroke-width="14" stroke-dasharray="2 10" stroke-linecap="round"/></g>`);
      await E.say('m_flowers');
      await E.say('p_bag');
      await Promise.all([E.personOut('shivu'), E.personOut('maa'), E.personOut('papa')]);
      E.person('buwa', 420, 900, { scale:.95, fade:true }); E.person('gaama', 570, 900, { scale:.95, fade:true });
      await E.say('bu_hi');
      await E.tap('evan', 'a_namaste');
      E.evanLean(-5); E.sfx.bell();
      await E.say('e_namaste');
      E.evanLean(0);
      await E.say('g_hug');
      await E.say('e_yawn');
      E.$('front').innerHTML = `<g id="tray"><rect x="300" y="800" width="330" height="140" rx="18" fill="#FFFFFF" opacity=".95"/><g id="cSun"><circle cx="390" cy="870" r="38" fill="#FFD43B"/><g stroke="#FFB703" stroke-width="6" stroke-linecap="round">${[0,45,90,135,180,225,270,315].map(a => `<path d="M${390+50*Math.cos(a*Math.PI/180)} ${870+50*Math.sin(a*Math.PI/180)} l${10*Math.cos(a*Math.PI/180)} ${10*Math.sin(a*Math.PI/180)}"/>`).join('')}</g></g><g id="cBed"><rect x="490" y="860" width="110" height="40" rx="10" fill="#5FA8D3"/><rect x="490" y="840" width="40" height="26" rx="8" fill="#fff"/>${txt(570, 845, 'z z', 24, '#5D6B80')}</g></g>`;
      await E.choice(['cSun', 'cBed'], 'cSun', 'a_which');
      E.$('front').innerHTML = '';
      await E.say('e_play');
      await swap(E, habbaRoom());
      E.evanHold(null); E.personOut('buwa', 1); E.personOut('gaama', 1);
      E.evanSet(200, 955); E.aamaSet(780, 945);
      await E.say('a_charge');
      await E.tap('aama', 'a_tapme');
      E.scan('socket'); await E.say('a_scan'); E.scanOff();
      showEl(E, 'tray15');
      await E.choice(['ad1', 'ad2', 'ad3'], 'ad2', null);
      E.person('baba', 900, 900); await E.personTo('baba', 640, 900, 1200);
      await E.say('b_plug');
      hide(E, 'tray15'); E.sfx.click();
      await moveTo(E, 'aaPlug', -60, -20, 600);
      await E.personOut('baba');
      await E.say('a_ahh');
    }
  });

  /* ================= EPISODE 16 ================= */
  const kathKitchen = () => H.wall('#F2E8D6', '#E6D9C1', 'w16') + H.window(560, 160, 200, 190) +
    `<rect x="100" y="420" width="420" height="140" fill="#D9CDB5"/><g fill="#B8A88A">${[0,1,2,3,4,5].map(i => `<rect x="${110+i*68}" y="432" width="60" height="50" rx="4" opacity=".5"/>`).join('')}</g>` +
    H.floor('tile') + H.base('#C9B48F') +
    `<rect x="80" y="560" width="760" height="240" fill="#8B6440"/><rect x="70" y="545" width="780" height="22" rx="4" fill="#5D4630"/>` +
    `<g id="ktap"><rect x="210" y="470" width="18" height="80" rx="6" fill="#9AA5B4"/><path d="M219 475 Q219 445 255 445 Q275 445 275 470" fill="none" stroke="#9AA5B4" stroke-width="14" stroke-linecap="round"/></g><ellipse cx="250" cy="548" rx="80" ry="10" fill="#B8C4D6"/>` +
    `<g id="filter"><rect x="560" y="380" width="120" height="170" rx="14" fill="#E7F4FB" stroke="#9AA5B4" stroke-width="5"/><rect id="fLevel" x="566" y="500" width="108" height="44" rx="8" fill="#4FB0E8" opacity=".55"/><rect x="560" y="440" width="120" height="8" fill="#9AA5B4"/><rect x="600" y="540" width="40" height="14" fill="#7D8794"/><path d="M620 552 v20" stroke="#7D8794" stroke-width="10"/></g>` +
    `<g id="jug"><path d="M400 470 h70 l10 80 h-90z" fill="#C9D3E2" stroke="#7D8794" stroke-width="4"/><path d="M470 485 q30 10 0 45" fill="none" stroke="#7D8794" stroke-width="6"/><rect x="398" y="500" width="74" height="44" fill="#4FB0E8" opacity=".45"/></g>`;
  EPISODES.push({ n:16, season:2, title:'Bottled Water Only', icon:'🚰', setting:'Habba’s kitchen in Kathmandu',
    tip:'In Nepal, drink only safe water, and ask a grown-up if the water is safe before you brush your teeth.',
    scene: kathKitchen,
    async run(E){
      E.aamaSet(800, 945); E.evanSet(330, 955);
      E.person('habba', 600, 920, { scale:.95 });
      await E.say('title');
      await E.say('e_thirsty');
      E.evanHold('<path d="M110 -230 h40 l-5 48 h-30z" fill="#FFFFFF" stroke="#9AA5B4" stroke-width="4"/>');
      await E.evanTo(250, 955, 700, true);
      E.sfx.beep();
      await E.tap('aama', 'a_beep');
      await E.aamaTo(720, 880);
      E.scan('ktap'); await E.say('a_scan'); E.scanOff();
      await E.aamaTo(800, 945);
      await E.say('e_germs');
      await E.say('h_safe');
      await E.choice(['ktap', 'filter'], 'filter', 'a_which');
      await E.say('e_safe');
      await E.say('h_lift');
      const jug = E.node('jug'); jug.style.transformBox = 'fill-box'; jug.style.transformOrigin = 'center';
      let lvl = 44;
      await E.taps('jug', 3, 'a_pour', async () => {
        jug.style.transition = 'transform .4s'; jug.style.transform = 'translate(120px,-90px) rotate(55deg)'; E.sfx.glug();
        await E.wait(500); lvl += 22; const f = E.node('fLevel'); f.setAttribute('y', 544 - lvl); f.setAttribute('height', lvl);
        jug.style.transform = 'translate(0,0) rotate(0)'; await E.wait(350);
      });
      E.evanHold(null);
      E.person('dallu', 900, 905); await E.personTo('dallu', 460, 905, 1300);
      await E.say('d_teeth');
      await E.say('e_teeth');
    }
  });

  /* ================= EPISODE 17 ================= */
  const street = () => brickWall('bw17') + `<rect width="900" height="560" fill="#BFE0F5"/>${mountains(330)}` +
    `<rect x="0" y="220" width="330" height="400" fill="url(#bw17)"/><rect x="40" y="290" width="80" height="100" fill="#5D3A1A"/><rect x="190" y="290" width="80" height="100" fill="#5D3A1A"/><rect x="100" y="470" width="110" height="150" fill="#3E2A16"/>` +
    `<rect x="600" y="260" width="300" height="360" fill="url(#bw17)"/><rect x="650" y="320" width="70" height="90" fill="#5D3A1A"/><rect x="790" y="320" width="70" height="90" fill="#5D3A1A"/>` + flags(330, 240, 600, 260) +
    `<rect y="620" width="900" height="380" fill="#8E8A82"/><path d="M0 700H900" stroke="#B9B4AA" stroke-width="6"/><rect y="610" width="900" height="20" fill="#A9A49A"/><g stroke="#F2F2F2" stroke-width="10">${[60,200,340,480,620,760].map(x => `<path d="M${x} 760h80"/>`).join('')}</g>`;
  const shop = () => `<rect width="900" height="1000" fill="#F2E3C6"/><rect x="0" y="100" width="900" height="60" fill="#B71C1C"/>${txt(450, 145, 'Corner Shop', 40, '#fff', 700)}` +
    [220, 360, 500].map(y => `<rect x="60" y="${y}" width="780" height="14" fill="#8B6440"/>`).join('') +
    `<g>${Array.from({length:14}, (_, i) => `<rect x="${80 + i*54}" y="${180 + (i%2)*6}" width="40" height="${34 - (i%2)*6}" rx="4" fill="${['#E53935','#2F6FD6','#FFD43B','#2FBF71','#FF8A3D'][i%5]}"/>`).join('')}${Array.from({length:12}, (_, i) => `<rect x="${90 + i*62}" y="${312 + (i%3)*4}" width="48" height="${44 - (i%3)*4}" rx="6" fill="${['#FFF3D6','#C9D3E2','#E9A200','#9CC9A8'][i%4]}"/>`).join('')}</g>` +
    H.floor('concrete') + `<rect x="430" y="600" width="420" height="200" fill="#8B6440"/><rect x="420" y="585" width="440" height="22" rx="4" fill="#5D4630"/>` +
    `<g><rect x="470" y="530" width="54" height="56" rx="8" fill="#FFFFFF" stroke="#BFC5CE" stroke-width="3"/>${txt(497, 565, 'MILK', 14, '#2F6FD6', 700)}<rect x="545" y="550" width="90" height="36" rx="8" fill="#E8D7B4"/><g fill="#FFF8E7">${[560,582,604,626].map(x => `<ellipse cx="${x}" cy="556" rx="10" ry="12"/>`).join('')}</g><path d="M660 585 q30 -60 70 -40 q-20 10 -30 40z" fill="#FFD43B" stroke="#E0B000" stroke-width="3"/></g>` +
    `<g id="bag"><path d="M300 860 h120 l-12 100 h-96z" fill="#F4EBDD" stroke="#C9B48F" stroke-width="4"/><path id="handleL" d="M325 860 q0 -50 35 -50" fill="none" stroke="#C9B48F" stroke-width="8"/><path id="handleR" d="M395 860 q0 -40 -18 -46" fill="none" stroke="#C9B48F" stroke-width="8"/><path id="handleFix" d="M325 860 q35 -80 70 0" fill="none" stroke="#C9B48F" stroke-width="8" style="display:none"/><circle id="knot" cx="360" cy="818" r="10" fill="#C9B48F" style="display:none"/></g>`;
  EPISODES.push({ n:17, season:2, title:'Walk to the Corner Shop', icon:'🛒', setting:'Habba’s neighborhood in Kathmandu',
    tip:'Never pet street dogs. Cars drive on the left in Nepal, so look right first.',
    scene: street,
    async run(E){
      E.aamaSet(800, 945); E.evanSet(200, 955);
      E.person('habba', 380, 905, { scale:.95 });
      await E.say('title');
      await E.say('h_walk');
      await E.say('e_shop');
      E.$('front').innerHTML = `<g id="dog" style="transform:translate(980px,0)"><g><ellipse cx="560" cy="790" rx="70" ry="30" fill="#B07A45"/><circle cx="625" cy="760" r="28" fill="#B07A45"/><path d="M640 740 l12 -20 l4 26z" fill="#8A5A30"/><circle cx="632" cy="756" r="4" fill="#24324A"/><rect x="510" y="805" width="14" height="45" fill="#8A5A30"/><rect x="590" y="805" width="14" height="45" fill="#8A5A30"/><path d="M490 780 q-30 -20 -20 -40" stroke="#B07A45" stroke-width="10" fill="none"/></g></g>`;
      const dog = E.node('dog'); dog.style.transition = 'transform 1.6s linear'; requestAnimationFrame(() => dog.style.transform = 'translate(0,0)');
      await E.wait(1700);
      await E.say('e_doggy');
      await E.tap('aama', 'a_tapme');
      E.scan(dog); await E.say('a_dog'); E.scanOff();
      E.$('front').insertAdjacentHTML('beforeend', `<g id="tray"><rect x="300" y="860" width="300" height="110" rx="18" fill="#FFFFFF" opacity=".95"/><g id="cWave">${txt(380, 940, '👋', 64)}</g><g id="cPet">${txt(520, 940, '🐕', 64)}</g></g>`);
      await E.choice(['cWave', 'cPet'], 'cWave', 'a_which');
      hide(E, 'tray');
      await E.say('e_wave');
      dog.style.transform = 'translate(-900px,0)'; await E.wait(600);
      await E.say('h_road');
      E.$('front').innerHTML = `<g id="tray2"><rect x="300" y="860" width="300" height="110" rx="18" fill="#FFFFFF" opacity=".95"/><g id="arrL"><path d="M420 915 h-70 M370 890 l-28 25 l28 25" stroke="#2F6FD6" stroke-width="14" fill="none" stroke-linecap="round"/></g><g id="arrR"><path d="M480 915 h70 M530 890 l28 25 l-28 25" stroke="#2F6FD6" stroke-width="14" fill="none" stroke-linecap="round"/></g></g>`;
      await E.choice(['arrL', 'arrR'], 'arrR', 'a_look');
      E.$('front').innerHTML = '';
      await E.say('e_right');
      await swap(E, shop());
      E.person('habba', 600, 905, { scale:.95 });
      E.evanSet(180, 955);
      await E.say('h_count');
      await E.say('e_dhanyabad');
      E.sfx.snap(); hide(E, 'handleR');
      await E.say('e_snap');
      await E.taps('bag', 2, 'a_knot', async (i) => { E.sfx.squeak(); if(i === 2){ hide(E, 'handleL'); showEl(E, 'handleFix'); showEl(E, 'knot'); } await E.wait(300); });
      await E.say('e_tied');
    }
  });

  /* ================= EPISODE 18 ================= */
  EPISODES.push({ n:18, season:2, title:'The Cousins Land!', icon:'🛬', setting:'Kathmandu airport arrivals',
    tip:'In a busy place, hold a grown-up’s hand. If you get lost, stay where you are and ask someone in a uniform.',
    scene: () => arrivals('Arrivals'),
    async run(E){
      E.aamaSet(810, 945); E.evanSet(170, 955);
      E.people([['baba', 330, 905, {scale:.95}], ['buwa', 480, 900, {scale:.92}], ['habba', 620, 900, {scale:.92}]]);
      await E.say('title');
      await E.say('b_who');
      await E.say('e_me');
      await E.say('bu_wait');
      E.evanSet(200, 955);
      await E.tap('p_baba', 'a_hand');
      E.evanLean(5); E.sfx.bell();
      await E.say('b_holding');
      E.evanLean(0);
      await Promise.all([E.personOut('buwa'), E.personOut('habba')]);
      E.person('kestrel', 900, 930); E.person('orion', 980, 920);
      E.aamaTo(815, 540);
      await Promise.all([E.personTo('kestrel', 430, 930, 1400), E.personTo('orion', 535, 920, 1400)]);
      await E.say('k_here');
      await E.say('o_hi');
      E.person('kaka', 650, 900, { scale:.95, fade:true });
      await E.say('kk_hi');
      await E.personOut('kaka');
      E.person('kaki', 650, 900, { scale:.95, fade:true });
      await E.say('ki_hi');
      E.$('front').innerHTML = `<g id="cart"><rect x="300" y="900" width="360" height="16" rx="6" fill="#7D8794"/><path d="M660 905 l40 -150" stroke="#7D8794" stroke-width="10"/>${suitcase('bagK', 330, 735, '#2F6FD6', 'KESTREL')}${suitcase('bagO', 490, 735, '#2F6FD6', 'ORION')}<g id="wheel"><circle cx="330" cy="945" r="20" fill="#24324A"/><circle cx="330" cy="945" r="6" fill="#9AA5B4"/><circle id="pebble" cx="345" cy="960" r="7" fill="#A0896B"/></g><circle cx="630" cy="945" r="20" fill="#24324A"/></g>`;
      await E.say('o_bags');
      await E.choice(['bagK', 'bagO'], 'bagO', 'a_tag');
      await E.say('e_found');
      await E.say('ki_cart');
      await E.tap('aama', 'a_tapme');
      E.scan('wheel'); await E.say('a_scan'); E.scanOff();
      await E.tap('wheel', null);
      E.sfx.pop(); await moveTo(E, 'pebble', 40, 20, 400); hide(E, 'pebble');
      E.sfx.vroom();
      await E.say('e_rolling');
    }
  });

  /* ================= EPISODE 19 ================= */
  const park = () => H.sky() + H.clouds() + mountains(560) + `<g fill="#4F9A5A">${[60,170,780,860].map(x => `<rect x="${x-8}" y="520" width="16" height="260" fill="#7A5A3C"/><circle cx="${x}" cy="500" r="70"/>`).join('')}</g>` + H.floor('grass') +
    `<g id="slide"><rect x="560" y="540" width="16" height="280" fill="#9AA5B4"/><rect x="660" y="540" width="16" height="280" fill="#9AA5B4"/><path d="M560 560 h116" stroke="#9AA5B4" stroke-width="10"/><path d="M560 600 h116 M560 650 h116 M560 700 h116 M560 750 h116" stroke="#9AA5B4" stroke-width="8"/><path d="M576 545 L430 820" stroke="#E53935" stroke-width="44" stroke-linecap="round"/><g id="wet"><circle cx="520" cy="640" r="8" fill="#BFE8FF"/><circle cx="480" cy="720" r="10" fill="#BFE8FF"/><circle cx="455" cy="780" r="7" fill="#BFE8FF"/><circle cx="545" cy="600" r="6" fill="#BFE8FF"/></g></g>` +
    `<g id="kite"><path d="M300 360 l50 -60 l50 60 l-50 80z" fill="#FFD43B" stroke="#E0B000" stroke-width="4"/><path d="M350 300 V440 M300 360 H400" stroke="#E0B000" stroke-width="3"/><g id="tangle"><path d="M350 440 q-30 40 10 60 q40 20 -10 50 q-40 20 0 60 q30 30 -20 40 q-30 10 0 40" fill="none" stroke="#5D6B80" stroke-width="4"/><circle cx="345" cy="520" r="22" fill="none" stroke="#5D6B80" stroke-width="4"/><circle cx="360" cy="600" r="18" fill="none" stroke="#5D6B80" stroke-width="4"/></g></g>`;
  EPISODES.push({ n:19, season:2, title:'Park Day with Shivu', icon:'🪁', setting:'A Kathmandu park after monsoon rain',
    tip:'Wet slides are slippery, so check before you slide.',
    scene: park,
    async run(E){
      E.aamaSet(810, 945); E.evanSet(170, 955);
      hide(E, 'kite');
      E.aamaSet(815, 540);
      E.people([['shivu', 300, 905, {scale:.95}], ['kestrel', 720, 930], ['orion', 820, 925]]);
      await E.say('title');
      await E.say('s_park');
      await E.say('o_first');
      await E.say('k_first');
      await E.say('e_wait');
      await E.tap('aama', 'a_tapme');
      E.scan('wet'); await E.say('a_scan'); E.scanOff();
      E.person('habba', 0, 900); await E.personTo('habba', 120, 900, 700);
      E.evanHold('<path d="M88 -185 H132 V-63 Q132 -55 124 -55 H96 Q88 -55 88 -63Z" fill="#5FB6A8"/>');
      await E.say('h_towel');
      await E.personOut('habba');
      await E.evanTo(420, 955, 900, true);
      const wet = E.node('wet').children;
      await E.taps('slide', 3, 'a_wipe', async (i) => { E.sfx.wipe(); E.$('evanWalk').classList.add('sway'); await E.wait(700); E.$('evanWalk').classList.remove('sway'); for(let j = 0; j < wet.length; j++) if(j < i * 2) wet[j].style.display = 'none'; });
      E.evanHold(null);
      await E.evanTo(170, 955, 900, true);
      await E.choice(['p_kestrel', 'p_orion'], 'p_kestrel', 'a_turns');
      await E.personTo('kestrel', 560, 640, 700); await E.personTo('kestrel', 440, 900, 600);
      await E.say('k_whee');
      await E.personTo('kestrel', 720, 930, 600);
      await E.personTo('orion', 560, 640, 700); await E.personTo('orion', 440, 900, 600);
      await E.say('o_next');
      await E.personTo('orion', 820, 925, 700);
      showEl(E, 'kite');
      await E.say('s_kite');
      const t = E.node('tangle');
      await E.taps('tangle', 3, 'a_kite', async (i) => { E.sfx.squeak(); t.style.opacity = 1 - i/3.2; await E.wait(300); });
      hide(E, 'tangle');
      await moveTo(E, 'kite', 150, -180, 1400);
      await E.say('s_fly');
    }
  });

  /* ================= EPISODE 20 ================= */
  const newHome = () => H.wall('#F5F1EA', '#EAE4D9', 'w20') + `<rect x="380" y="150" width="240" height="260" fill="#BFE0F5"/>${''}<path d="M380 150h240v260h-240z M500 150v260" fill="none" stroke="#FFFFFF" stroke-width="10"/>` +
    H.door(60, 380, 170, 420, '#A0703F') + H.floor('wood') + H.base('#E2DCD0') +
    `<g id="shelf"><rect x="680" y="300" width="170" height="500" fill="#C49A6C" stroke="#8B6440" stroke-width="5"/><path d="M680 420h170M680 540h170M680 660h170" stroke="#8B6440" stroke-width="6"/><g>${[0,1,2].map(r => [0,1,2,3,4].map(i => `<rect x="${692 + i*30}" y="${330 + r*120 + (i%2)*10}" width="22" height="${80 - (i%2)*10}" fill="${['#E53935','#2F6FD6','#2FBF71','#FFD43B','#7E57C2'][(i+r)%5]}"/>`).join('')).join('')}</g><g id="bracket" style="display:none"><rect x="700" y="290" width="40" height="18" fill="#7D8794"/><rect x="790" y="290" width="40" height="18" fill="#7D8794"/></g></g>` +
    `<g id="table"><rect x="380" y="640" width="260" height="20" rx="6" fill="#7A5A3C"/><rect x="395" y="660" width="16" height="140" fill="#6A4A2C"/><rect x="610" y="660" width="16" height="140" fill="#6A4A2C"/></g>` +
    `<g id="win"><rect x="380" y="150" width="240" height="260" fill="transparent"/></g>` +
    `<g id="shoes"><g id="sh1" style="transform:translate(0,0)"><path d="M90 900 q0 -24 30 -24 h30 q20 0 26 24z" fill="#2F6FD6"/></g><g id="sh2"><path d="M150 940 q0 -24 30 -24 h30 q20 0 26 24z" fill="#E53935" transform="rotate(25 190 930)"/></g><g id="sh3"><path d="M60 960 q0 -24 30 -24 h30 q20 0 26 24z" fill="#FFFFFF" stroke="#BFC5CE" stroke-width="3" transform="rotate(-30 100 950)"/></g></g>` +
    `<g id="level" style="display:none"><rect x="660" y="270" width="210" height="26" rx="6" fill="#FFD43B" stroke="#C9A227" stroke-width="3"/><rect x="745" y="275" width="40" height="16" rx="8" fill="#CFF5D6"/><circle id="bubbleL" cx="752" cy="283" r="6" fill="#7FDCB3"/></g>`;
  EPISODES.push({ n:20, season:2, title:'Shivu’s New Home', icon:'🏠', setting:'Shivu’s new house',
    tip:'If the ground shakes: drop, cover and hold on.',
    scene: newHome,
    async run(E){
      E.aamaSet(800, 945); E.evanSet(300, 955);
      E.people([['shivu', 470, 905, {scale:.95}], ['maa', 590, 900, {scale:.95}]]);
      await E.say('title');
      await E.say('s_welcome');
      await E.say('m_shoes');
      await E.evanTo(250, 955, 600, true);
      await E.taps('shoes', 3, 'a_shoes', async (i) => {
        E.sfx.step(); const s = E.node('sh' + i); s.style.transition = 'transform .4s'; s.style.transform = `translate(${[0, -50, 20, 60][i]}px,${[0, 20, -20, -40][i]}px)`;
        s.firstElementChild.setAttribute('transform', ''); await E.wait(400);
      });
      await E.say('m_thanks');
      await E.personOut('maa');
      E.person('papa', 900, 905); await E.personTo('papa', 600, 905, 1200);
      E.sfx.creak(); await E.anim(E.node('shelf'), [{transform:'rotate(0)'},{transform:'rotate(-2deg)'},{transform:'rotate(2deg)'},{transform:'rotate(0)'}], {duration:700});
      await E.say('p_wobble');
      await E.tap('aama', 'a_tapme');
      E.scan('shelf'); await E.say('a_scan'); E.scanOff();
      showEl(E, 'level');
      await E.say('p_level');
      await E.tap('level', 'a_level');
      E.sfx.click(); E.node('bubbleL').setAttribute('cx', '765'); showEl(E, 'bracket'); E.sfx.squeak();
      await E.say('p_done');
      hide(E, 'level');
      await E.say('s_drill');
      await E.choice(['win', 'shelf', 'table'], 'table', 'a_which');
      await E.evanTo(510, 955, 900, true);
      await E.say('e_drop');
    }
  });

  /* ================= EPISODE 21 ================= */
  const temple = () => H.sky() + H.clouds() + mountains(520) +
    `<g><path d="M330 560 Q450 360 570 560Z" fill="#FFFFFF" stroke="#D9D2C4" stroke-width="4"/><rect x="405" y="300" width="90" height="70" fill="#F2C35B"/><path d="M425 330 q12 -10 24 0 M455 330 q12 -10 24 0" stroke="#24324A" stroke-width="5" fill="none"/><path d="M447 340 q5 12 0 18" stroke="#24324A" stroke-width="4" fill="none"/><path d="M415 300 L450 150 L485 300Z" fill="#F2C35B"/><path d="M420 280h60M425 255h50M430 230h40M435 205h30M440 180h20" stroke="#D9A52B" stroke-width="5"/></g>` +
    flags(100, 300, 450, 160) + flags(450, 160, 820, 300) +
    `<g id="stairs">${Array.from({length:6}, (_, i) => `<rect x="${280 + i*12}" y="${800 - i*40}" width="${340 - i*24}" height="40" fill="${i%2 ? '#B9B1A0' : '#C9C1AF'}"/>`).join('')}</g><rect x="0" y="560" width="300" height="240" fill="#9C9384"/><rect x="600" y="560" width="300" height="240" fill="#9C9384"/>` +
    `<g id="monkey" style="display:none" transform="translate(-700 0)"><ellipse cx="770" cy="545" rx="34" ry="28" fill="#8A6A4A"/><circle cx="800" cy="512" r="22" fill="#8A6A4A"/><circle cx="806" cy="514" r="13" fill="#E8C9A6"/><circle cx="802" cy="510" r="3" fill="#24324A"/><circle cx="811" cy="510" r="3" fill="#24324A"/><path d="M740 550 q-40 10 -30 50" stroke="#8A6A4A" stroke-width="8" fill="none"/></g>` + H.floor('concrete');
  EPISODES.push({ n:21, season:2, title:'The Monkey Temple', icon:'🐒', setting:'Swayambhunath, Kathmandu',
    tip:'Don’t feed or stare at monkeys, and keep snacks zipped away.',
    scene: temple,
    async run(E){
      E.aamaSet(810, 945); E.evanSet(170, 955);
      E.people([['kaka', 650, 900, {scale:.92}], ['kaki', 520, 900, {scale:.92}]]);
      await E.say('title');
      await E.say('kk_stairs');
      await E.say('ki_wow');
      await Promise.all([E.personOut('kaka'), E.personOut('kaki')]);
      await E.evanTo(330, 955, 800, true);
      let step = 0;
      await E.taps('stairs', 3, 'a_count', async () => { step++; E.sfx.hop(); await E.evanTo(330 + step*20, 955 - step*40, 350); E.sfx.hop(); await E.evanTo(340 + step*20, 955 - step*40, 250); });
      await E.say('e_top');
      await E.evanTo(200, 955, 10);
      E.aamaTo(815, 540);
      E.people([['shivu', 380, 905, {scale:.95}], ['orion', 520, 920], ['kestrel', 640, 930]]);
      E.$('front').innerHTML = `<g id="snack"><rect x="600" y="760" width="70" height="56" rx="10" fill="#FF8A3D" stroke="#C9661F" stroke-width="3"/><path id="snackOpen" d="M600 760 l12 -22 h46 l12 22" fill="#FFB703" stroke="#C9661F" stroke-width="3"/><rect id="snackZip" x="600" y="756" width="70" height="8" fill="#5D6B80" style="display:none"/></g>`;
      showEl(E, 'monkey');
      await E.say('o_monkey');
      await E.say('k_snack');
      await E.tap('aama', 'a_tapme');
      E.scan('monkey'); await E.say('a_scan'); E.scanOff();
      await E.tap('snack', 'a_zip');
      E.sfx.click(); hide(E, 'snackOpen'); showEl(E, 'snackZip');
      await moveTo(E, 'monkey', -200, 0, 900); hide(E, 'monkey');
      await E.say('k_safe');
      E.$('front').innerHTML = `<g id="tray"><rect x="300" y="830" width="300" height="130" rx="18" fill="#FFFFFF" opacity=".95"/><g id="ccw"><path d="M400 860 a35 35 0 1 0 30 20" fill="none" stroke="#2F6FD6" stroke-width="10"/><path d="M386 846 l18 18 l-24 6z" fill="#2F6FD6"/></g><g id="cw"><path d="M500 860 a35 35 0 1 1 -30 20" fill="none" stroke="#2FBF71" stroke-width="10"/><path d="M514 846 l-18 18 l24 6z" fill="#2FBF71"/></g></g>`;
      await E.say('s_walk');
      await E.choice(['ccw', 'cw'], 'cw', 'a_which');
      E.$('front').innerHTML = '';
      await E.say('e_round');
    }
  });

  /* ================= EPISODE 22 ================= */
  const courtyard = () => brickWall('bw22') + `<rect width="900" height="820" fill="url(#bw22)"/><rect x="0" y="120" width="900" height="40" fill="#5D3A1A"/>` +
    `<g id="gutter"><rect x="80" y="160" width="740" height="30" rx="6" fill="#7D8794"/><g id="gLeaves">${Array.from({length:12}, (_, i) => `<ellipse cx="${110 + i*60}" cy="164" rx="16" ry="9" fill="${i%2 ? '#C9662B' : '#7FAF3A'}" transform="rotate(${i*25} ${110 + i*60} 164)"/>`).join('')}</g></g>` +
    `<rect x="100" y="300" width="110" height="140" fill="#5D3A1A"/><rect x="680" y="300" width="110" height="140" fill="#5D3A1A"/><rect x="360" y="420" width="180" height="380" fill="#3E2A16"/>` +
    `<g id="ladder"><path d="M790 800 L820 190 M860 800 L880 190" stroke="#B9844F" stroke-width="12"/>${[240,320,400,480,560,640,720].map(y => `<path d="M${790 + (800-y)/610*30*-1+30} ${y} h50" stroke="#B9844F" stroke-width="8"/>`).join('')}</g>` +
    H.floor('concrete') + marigolds(20, 780, 6) +
    `<g id="stove"><rect x="560" y="700" width="120" height="100" rx="8" fill="#5D6B80"/><ellipse cx="620" cy="690" rx="60" ry="16" fill="#3E4A5C"/><path d="M570 650 h100 v40 h-100z" fill="#B87333"/><path d="M600 640 q8 -20 0 -40 M630 640 q8 -20 0 -40" stroke="#BFC5CE" stroke-width="4" fill="none"/></g>` +
    `<g id="beans"><ellipse cx="420" cy="880" rx="90" ry="26" fill="#E8D7B4" stroke="#B9A27A" stroke-width="3"/><g id="beanMix">${Array.from({length:18}, (_, i) => `<ellipse cx="${360 + (i*37)%120}" cy="${872 + (i%3)*6}" rx="7" ry="5" fill="${['#8E1F2F','#F2E3C6','#2F2F2F','#C9A227','#6B8E23'][i%5]}"/>`).join('')}</g><g id="beanSort" style="display:none">${['#8E1F2F','#F2E3C6','#2F2F2F','#6B8E23'].map((c, j) => Array.from({length:4}, (_, i) => `<ellipse cx="${355 + j*32 + (i%2)*8}" cy="${868 + Math.floor(i/2)*10}" rx="7" ry="5" fill="${c}"/>`).join('')).join('')}</g></g>`;
  EPISODES.push({ n:22, season:2, title:'Buwa’s House', icon:'🫘', setting:'Evan’s grandparents’ home in Kathmandu',
    tip:'Stay back from the stove, and let grown-ups do ladders.',
    scene: courtyard,
    async run(E){
      E.aamaSet(810, 945); E.evanSet(170, 955);
      E.aamaSet(820, 945);
      E.people([['gaama', 640, 900, {scale:.95}], ['kestrel', 500, 935]]);
      await E.say('title');
      await E.say('g_kwati');
      await E.say('k_beans');
      await E.say('g_sort');
      await E.evanTo(260, 955, 600, true);
      await E.taps('beans', 3, 'a_sort', async (i) => { E.sfx.click(); if(i === 3){ hide(E, 'beanMix'); showEl(E, 'beanSort'); } await E.wait(300); });
      await E.say('g_good');
      await Promise.all([E.personOut('gaama'), E.personOut('kestrel')]);
      E.people([['buwa', 640, 900, {scale:.95}], ['orion', 450, 925]]);
      await E.say('bu_gutter');
      await E.tap('aama', 'a_tapme');
      await E.aamaTo(560, 560);
      E.scan('gutter'); await E.say('a_scan'); E.scanOff();
      await E.choice(['p_buwa', 'p_orion'], 'p_buwa', 'a_which');
      await E.say('bu_climb');
      await E.personTo('buwa', 830, 900, 900);
      E.$('front').innerHTML = `<g id="bucket"><path d="M500 880 h110 l-12 80 h-86z" fill="#2F6FD6"/><ellipse cx="555" cy="880" rx="55" ry="12" fill="#1E4FA0"/></g><g id="leaves">${Array.from({length:6}, (_, i) => `<ellipse cx="${330 + i*30}" cy="${950 - (i%2)*8}" rx="16" ry="9" fill="${i%2 ? '#C9662B' : '#7FAF3A'}"/>`).join('')}</g>`;
      hide(E, 'gLeaves');
      const lv = E.node('leaves').children;
      await E.taps('leaves', 3, 'a_leaves', async (i) => { E.sfx.wipe(); for(let j = 0; j < lv.length; j++) if(j < i*2) lv[j].style.display = 'none'; await E.wait(300); });
      await E.say('o_done');
      await E.personTo('buwa', 640, 900, 900);
      await E.say('bu_thanks');
    }
  });

  /* ================= EPISODE 23 ================= */
  const stormRoom = () => H.wall('#3F4E86', '#36437A', 'w23') + H.window(560, 170, 230, 230, true) +
    `<g id="rain" stroke="#BFE0FF" stroke-width="3" opacity=".8">${Array.from({length:22}, (_, i) => `<path d="M${570 + (i*43)%220} ${180 + (i*61)%200} l-8 22"/>`).join('')}</g><path id="bolt" d="M680 180 l-30 70 h26 l-24 60 l50 -80 h-26 l26 -50z" fill="#FFF3A3" opacity="0"/>` +
    H.floor('tile') + H.base('#2F3A66') +
    `<g id="hook"><rect x="80" y="460" width="190" height="16" rx="6" fill="#8B6440"/><circle cx="120" cy="490" r="8" fill="#9AA5B4"/><circle cx="220" cy="490" r="8" fill="#9AA5B4"/></g>` +
    `<g id="umb"><g id="u1"><path d="M330 900 q0 -90 40 -90 q40 0 40 90 q-40 -20 -80 0z" fill="#E53935"/><path d="M370 900 v40" stroke="#555" stroke-width="5"/></g><g id="u2"><path d="M420 910 q0 -90 40 -90 q40 0 40 90 q-40 -20 -80 0z" fill="#FFD43B"/><path d="M460 910 v40" stroke="#555" stroke-width="5"/></g></g>` +
    `<g id="boots"><path d="M100 960 v-60 h34 v44 h30 v16z" fill="#2FBF71" transform="rotate(-25 130 940)"/><path d="M220 970 v-60 h34 v44 h30 v16z" fill="#2F6FD6" transform="rotate(30 250 950)"/></g>` +
    `<g id="flash"><rect x="600" y="840" width="110" height="34" rx="12" fill="#5D6B80"/><path d="M710 834 h30 v46 h-30z" fill="#9AA5B4"/><g id="beamF" style="display:none"><path d="M740 836 L900 780 V940 L740 878z" fill="#FFF3A3" opacity=".6"/></g></g>`;
  EPISODES.push({ n:23, season:2, title:'Rainy Night Rescue', icon:'🔦', setting:'Habba’s house in a monsoon storm',
    tip:'Keep a flashlight ready, and use bug spray in the rainy season.',
    scene: stormRoom,
    setup(E){ E.$('front').innerHTML = '<rect id="dark" width="900" height="1000" fill="#050A20" opacity="0" pointer-events="none"/>'; },
    async run(E){
      E.aamaSet(810, 945); E.evanSet(170, 955);
      E.people([['kaki', 470, 900, {scale:.95}], ['kestrel', 330, 935], ['orion', 590, 925]]);
      const rain = E.loop(5000, .05);
      const r = E.node('rain'); r.animate([{transform:'translateY(0)'},{transform:'translateY(18px)'}], {duration:300, iterations:Infinity});
      await E.say('title');
      await E.say('ki_rain');
      E.node('bolt').setAttribute('opacity', 1); E.sfx.vroom(); E.sfx.pop();
      const dark = E.node('dark'); dark.style.transition = 'opacity .3s'; dark.setAttribute('opacity', '.62');
      await E.wait(300); E.node('bolt').setAttribute('opacity', 0);
      await E.say('k_scared');
      await E.say('e_okay');
      dark.setAttribute('opacity', '.35');
      await E.tap('aama', 'a_light');
      E.scan('flash'); await E.say('a_scan'); E.scanOff();
      E.person('habba', 0, 900); await E.personTo('habba', 120, 900, 700);
      await E.say('h_batt');
      E.$('front').insertAdjacentHTML('beforeend', `<g id="tray"><rect x="300" y="820" width="300" height="140" rx="18" fill="#FFFFFF"/><g id="bat1"><rect x="370" y="840" width="40" height="90" rx="6" fill="#2F2F2F"/><rect x="370" y="840" width="40" height="30" rx="6" fill="#C9A227"/><rect x="382" y="832" width="16" height="10" fill="#9AA5B4"/>${txt(390, 862, '+', 26, '#24324A', 700)}</g><g id="bat2"><rect x="490" y="840" width="40" height="90" rx="6" fill="#2F2F2F"/><rect x="490" y="900" width="40" height="30" rx="6" fill="#C9A227"/><rect x="502" y="928" width="16" height="10" fill="#9AA5B4"/>${txt(510, 865, '−', 26, '#FFFFFF', 700)}</g></g>`);
      await E.choice(['bat1', 'bat2'], 'bat1', 'a_which');
      hide(E, 'tray');
      E.sfx.click(); showEl(E, 'beamF'); dark.setAttribute('opacity', '.15');
      await E.say('o_light');
      await E.personOut('habba');
      await E.say('ki_wet');
      await E.evanTo(260, 955, 600, true);
      await E.taps('umb', 2, 'a_hang', async (i) => { E.sfx.whoosh(); await moveTo(E, 'u' + i, i === 1 ? -250 : -240, -420, 600, .6); });
      E.sfx.step(); E.node('boots').innerHTML = '<path d="M100 960 v-60 h34 v44 h30 v16z" fill="#2FBF71"/><path d="M180 960 v-60 h34 v44 h30 v16z" fill="#2F6FD6"/>';
      await E.say('e_tidy');
      E.person('habba', 0, 900); await E.personTo('habba', 120, 900, 700);
      await E.say('h_bugs');
      await E.say('k_brave');
      rain();
    }
  });

  /* ================= EPISODE 24 ================= */
  const packRoom = () => H.wall('#F4E6CF', '#EAD8BA', 'w24') + H.window(600, 170, 200, 200) + H.floor('tile') + H.base('#C9B48F') + marigolds(80, 420, 8) +
    `<g id="case"><rect x="330" y="820" width="300" height="110" rx="16" fill="#2F6FD6"/><g id="lid"><rect x="330" y="640" width="300" height="180" rx="16" fill="#3D7FE0" transform="rotate(-12 330 820)"/></g><g id="clothes">${['#E53935','#FFD43B','#2FBF71','#7E57C2','#FF8A3D'].map((c, i) => `<rect class="cl" x="${350 + i*52}" y="${770 - (i%2)*16}" width="50" height="${60 + (i%2)*16}" rx="8" fill="${c}"/>`).join('')}</g><g id="rolled" style="display:none">${['#E53935','#FFD43B','#2FBF71','#7E57C2','#FF8A3D'].map((c, i) => `<rect x="${350 + i*54}" y="796" width="48" height="26" rx="13" fill="${c}"/>`).join('')}</g></g>`;
  const curb = () => H.sky() + H.clouds() + mountains(520) + `<rect x="0" y="380" width="900" height="420" fill="#E6DFD2"/><rect x="0" y="380" width="900" height="30" fill="#B71C1C"/>${txt(450, 404, 'Departures', 24, '#fff', 700)}<rect x="80" y="440" width="740" height="300" fill="#BFE0F5" opacity=".7"/><path d="M80 440h740M265 440v300M450 440v300M635 440v300" stroke="#fff" stroke-width="8"/>` + flags(0, 420, 900, 420) + H.floor('concrete');
  EPISODES.push({ n:24, season:2, title:'See You Soon, Nepal', icon:'👋', setting:'Habba’s house, then the airport',
    tip:'Roll clothes to fit more, and always say thank you.',
    scene: packRoom,
    async run(E){
      E.aamaSet(810, 945); E.evanSet(170, 955);
      E.person('dallu', 700, 900, { scale:.95 });
      await E.say('title');
      await E.say('d_pack');
      E.sfx.creak(); await E.anim(E.node('lid'), [{transform:'translateY(0)'},{transform:'translateY(-14px)'},{transform:'translateY(0)'}], {duration:500, iterations:2});
      await E.say('e_full');
      await E.tap('aama', 'a_tapme');
      await E.aamaTo(800, 800);
      E.scan('clothes'); await E.say('a_scan'); E.scanOff();
      const cl = E.node('clothes').children;
      await E.taps('clothes', 3, 'a_roll', async (i) => { E.sfx.wipe(); for(let j = 0; j < cl.length; j++) if(j < i*2) cl[j].style.display = 'none'; if(i === 3) showEl(E, 'rolled'); await E.wait(300); });
      const lid = E.node('lid').firstElementChild;
      await E.tap('lid', 'a_press');
      lid.setAttribute('transform', ''); lid.setAttribute('y', '800'); lid.setAttribute('height', '40'); E.sfx.click();
      await E.say('e_closed');
      await swap(E, curb());
      E.personOut('dallu', 1);
      E.aamaSet(815, 540); E.evanSet(170, 955);
      E.people([['shivu', 330, 905, {scale:.95}], ['maa', 470, 900, {scale:.93}], ['papa', 600, 900, {scale:.93}]]);
      E.evanHold('<g transform="translate(120 -260)"><path d="M0 0 l26 -32 l26 32 l-26 40z" fill="#FFD43B" stroke="#E0B000" stroke-width="3"/></g>');
      await E.say('s_gift');
      await E.say('m_bye');
      await E.say('p_bye');
      await Promise.all([E.personOut('maa'), E.personOut('papa')]);
      E.people([['buwa', 480, 900, {scale:.93, fade:true}], ['gaama', 620, 900, {scale:.93, fade:true}]]);
      await E.say('bu_bye');
      await E.say('e_toolbox');
      await E.say('g_bye');
      E.$('front').innerHTML = `<g id="phone"><rect x="300" y="560" width="230" height="300" rx="26" fill="#24324A"/><rect x="314" y="590" width="202" height="250" rx="12" fill="#DCEBF5"/><image href="cast/ruby.webp" x="324" y="640" width="88" height="180"/><image href="cast/arjun.webp" x="430" y="660" width="64" height="180"/><rect x="330" y="600" width="74" height="26" rx="13" fill="#E53935"/>${txt(367, 619, 'Ruby', 18, '#fff', 700)}<rect x="424" y="600" width="80" height="26" rx="13" fill="#EF6C00"/>${txt(464, 619, 'Arjun', 18, '#fff', 700)}</g>`;
      E.sfx.bell();
      await E.say('r_call');
      await E.say('ar_call');
      await E.say('e_tomorrow');
      E.$('front').innerHTML = '';
      E.evanHold(null);
      await E.tap('evan', 'a_namaste');
      E.evanLean(-5); E.sfx.bell();
      await E.say('e_namaste');
      E.evanLean(0);
    }
  });
})();
