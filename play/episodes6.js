/* Evan & Aama, Season 6: Cousin Week at the Lake */
(function(){
  const EPISODES = window.EPISODES;
  const { moveTo, hide, show, fill, swap, txt, stars, sky, tray, three, two, bubbles, style } = window.S4H;

  /* ---------- scenery ---------- */
  const trees = (y, c) => Array.from({length:10}, (_, i) => `<path d="M${i*95 - 20} ${y} l45 -${70 + (i%3)*25} l45 ${70 + (i%3)*25}z" fill="${c}"/>`).join('');
  function lake(inner, opts){
    opts = opts || {};
    const night = opts.night;
    return `<defs><linearGradient id="lsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${night ? '#0B1030' : '#8FCBF2'}"/><stop offset="1" stop-color="${night ? '#2C3A6B' : '#D8EEFB'}"/></linearGradient></defs>` +
      `<rect width="900" height="1000" fill="url(#lsky)"/>` + (night ? stars(66, 120, 470) : `<circle cx="${opts.sunX || 760}" cy="${opts.sunY || 300}" r="46" fill="#FFD43B"/>`) +
      trees(470, night ? '#1B3A2E' : '#3E8E5A') +
      `<rect y="470" width="900" height="${opts.ground === 'sand' ? 150 : 170}" fill="${night ? '#1E3B5E' : '#4FA3D9'}"/>` +
      `<g stroke="${night ? '#3D5D8A' : '#9AD3F5'}" stroke-width="3" opacity=".7"><path d="M60 520 h80 M300 560 h110 M560 510 h90 M700 590 h120"/></g>` +
      (opts.ground === 'sand' ? `<rect y="620" width="900" height="380" fill="${night ? '#8A7A5A' : '#EED9A4'}"/>` : opts.ground === 'dock' ? `<rect y="640" width="900" height="360" fill="#9A6B43"/>${Array.from({length:10}, (_, i) => `<path d="M0 ${660 + i*36} H900" stroke="#7A5032" stroke-width="3"/>`).join('')}` : `<rect y="640" width="900" height="360" fill="${night ? '#2E5A34' : '#7CC36A'}"/>`) +
      (inner || '');
  }
  const house = `<g><rect x="560" y="300" width="240" height="170" fill="#C98E5B" stroke="#8A5A33" stroke-width="5"/><path d="M540 305 L680 210 L820 305Z" fill="#8A3B2E"/><rect x="600" y="360" width="50" height="50" fill="#BFE0F5" stroke="#fff" stroke-width="4"/><rect x="700" y="380" width="56" height="90" fill="#6B3E22"/></g>`;
  const indoor = (inner) => `<rect width="900" height="1000" fill="#F5E6CF"/><rect y="0" width="900" height="40" fill="#C98E5B"/>` +
    `<g><rect x="60" y="230" width="230" height="180" rx="10" fill="#8FCBF2" stroke="#fff" stroke-width="10"/><rect x="60" y="340" width="230" height="70" fill="#4FA3D9"/><path d="M175 230 V410" stroke="#fff" stroke-width="7"/></g>` +
    `<rect y="660" width="900" height="340" fill="#B98A5E"/>${Array.from({length:8}, (_, i) => `<path d="M${i*120} 660 V1000" stroke="#9A6E46" stroke-width="3"/>`).join('')}` + (inner || '');
  const setup6 = (E, helper, hx, hs) => {
    E.evanSuit(false); E.evanSet(275, 955); E.aamaSet(800, 945);
    if(helper) E.person(helper, hx || 95, 945, { scale: hs || .85 });
  };

  /* ================= 61 ================= */
  const carScene = () => lake(`<g id="car"><rect x="380" y="430" width="270" height="250" rx="30" fill="#5B7FB8" stroke="#3E5A8A" stroke-width="6"/><rect x="410" y="460" width="210" height="150" rx="12" fill="#2C3654"/>` +
    `<g id="bagA"><rect x="420" y="520" width="80" height="84" rx="10" fill="#E07A2E"/></g><g id="bagB"><rect x="508" y="540" width="56" height="64" rx="10" fill="#2FBF71"/></g><rect id="gap" x="570" y="480" width="44" height="124" rx="6" fill="none" stroke="#FFD43B" stroke-width="4" stroke-dasharray="8 6"/>` +
    `<g id="tallBag" style="display:none"><rect x="572" y="482" width="40" height="120" rx="8" fill="#AD1457"/></g>` +
    `<circle cx="430" cy="690" r="34" fill="#24324A"/><circle cx="600" cy="690" r="34" fill="#24324A"/></g>`);
  EPISODES.push({ n:61, season:6, title:'Lake House, Here We Come!', icon:'🚙', setting:"Fupu and Fupa's lake house",
    tip:'Everyone buckles up in a car seat or seat belt, every trip, even short ones.',
    grown:'Packing is a geometry puzzle: big and tall things go in first, small ones fill the gaps. Engineers call it spatial reasoning, and it is the same skill used to load trucks, ships and even computer memory.',
    scene: carScene,
    async run(E){
      E.evanSuit(false); E.evanSet(275, 955); E.aamaHide(true);
      E.person('baba', 95, 945, { scale:.8 });
      E.person('habba', 720, 945, { scale:.8 });
      await E.say('title');
      await E.say('b_trunk');
      await E.say('e_gap');
      await E.say('h_think');
      await E.say('e_truth');
      E.$('front').innerHTML = tray('bags', 380, 800, 280, 160, two(['bWide', 'bTall'], [
        `<rect x="14" y="40" width="72" height="50" rx="10" fill="#E9A200"/>${txt(50, 120, 'wide', 16, '#24324A', 700)}`,
        `<rect x="34" y="12" width="32" height="92" rx="8" fill="#AD1457"/>${txt(50, 124, 'tall', 16, '#24324A', 700)}`]));
      await E.choice(['bWide', 'bTall'], 'bTall', 'b_which');
      E.$('front').innerHTML = '';
      show(E, 'tallBag'); hide(E, 'gap'); E.sfx.snap();
      await E.say('b_fits');
      await swap(E, lake(house + `<path d="M520 640 V600 M800 640 V600" stroke="#8A5A33" stroke-width="6"/>`));
      E.personDrop('baba'); E.personDrop('habba');
      E.evanSet(330, 955); E.aamaHide(false); E.aamaSet(800, 945);
      E.person('fupa', 70, 945, { scale:.75, fade:true }); E.person('fupu', 190, 945, { scale:.75, fade:true });
      E.person('sanvi', 480, 945, { scale:.8, fade:true }); E.person('anvi', 600, 945, { scale:.8, fade:true });
      await E.say('fu_welcome');
      await E.say('a_hi');
      await E.say('s_hi');
      await E.say('fa_week');
      await E.say('e_yay');
      await E.say('a_truth');
    }
  });

  /* ================= 62 ================= */
  const kitScene = () => indoor(`<g id="kit"><rect x="390" y="430" width="290" height="200" rx="18" fill="#FFFFFF" stroke="#E53935" stroke-width="6"/><rect x="510" y="470" width="50" height="120" fill="#E53935"/><rect x="475" y="505" width="120" height="50" fill="#E53935"/></g><rect x="360" y="630" width="350" height="30" rx="8" fill="#8A5A33"/>`);
  const firstAid = [
    `<rect x="14" y="40" width="48" height="22" rx="10" fill="#F2C9A0" stroke="#C98E5B" stroke-width="2"/><rect x="30" y="40" width="16" height="22" fill="#FFF1E0"/>${txt(38, 112, 'bandage', 15, '#24324A', 700)}`,
    `<rect x="14" y="26" width="48" height="52" rx="10" fill="#5FB8F2"/><path d="M26 40 h24 M26 52 h24 M26 64 h24" stroke="#fff" stroke-width="3"/>${txt(38, 112, 'cold pack', 15, '#24324A', 700)}`,
    `<rect x="26" y="14" width="24" height="66" rx="8" fill="#FFD43B"/><rect x="30" y="6" width="16" height="12" rx="3" fill="#E07A2E"/>${txt(38, 112, 'sunscreen', 15, '#24324A', 700)}`];
  EPISODES.push({ n:62, season:6, title:"Fupu's First Aid Kit", icon:'🩹', setting:'The lake house kitchen',
    tip:'If you get hurt, tell a grown-up right away. Even small hurts get looked at.',
    grown:'A home first aid kit needs bandages, gauze, tape, a cold pack, tweezers, antiseptic wipes, gloves and sunscreen. Wrap a cold pack in a cloth and use it for about 15 to 20 minutes at a time. For anything serious, call emergency services.',
    scene: kitScene,
    async run(E){
      setup6(E, 'fupu');
      await E.say('title');
      await E.say('fu_doctor');
      await E.say('e_box');
      await E.say('a_know');
      await E.say('e_truth');
      const ids = ['iBand', 'iCold', 'iSun'];
      E.$('front').innerHTML = tray('kitItems', 380, 800, 300, 160, three(ids, firstAid));
      await E.choice(ids, 'iBand', 'fu_cut');
      await E.say('e_band');
      await E.choice(ids, 'iCold', 'fu_bump');
      await E.say('e_cold');
      await E.choice(ids, 'iSun', 'fu_sun');
      E.$('front').innerHTML = '';
      E.sfx.cheer();
      await E.say('fu_helper');
      await E.say('a_truth');
    }
  });

  /* ================= 63 ================= */
  const dockScene = () => lake(`<g id="bucket"><rect x="420" y="480" width="230" height="140" rx="16" fill="#E8F2FF" opacity=".5" stroke="#9AA5B4" stroke-width="5"/><rect x="424" y="540" width="222" height="76" rx="12" fill="#5FB8F2" opacity=".8"/>` +
    `<g id="rock"><ellipse cx="480" cy="500" rx="26" ry="18" fill="#7D8794"/></g><g id="ball"><circle cx="590" cy="500" r="24" fill="#FF7A45"/><path d="M566 500 h48" stroke="#fff" stroke-width="4"/></g></g>`, { ground:'dock' });
  EPISODES.push({ n:63, season:6, title:'Life Jackets On', icon:'🦺', setting:"The lake house dock",
    tip:'Always wear a life jacket near the lake, and only swim when a grown-up is watching.',
    grown:'Something floats when it pushes aside water that weighs as much as it does. A life jacket is full of foam with tiny air pockets, so it is very light for its size and holds your head up. It should be snug: when a grown-up lifts the shoulders, it should not slide up past the chin.',
    scene: dockScene,
    async run(E){
      setup6(E, 'sanvi');
      await E.say('title');
      await E.say('s_jackets');
      await E.say('e_why');
      await E.say('a_know');
      await E.say('e_truth');
      await E.tap('bucket', 'a_drop');
      E.sfx.plop();
      moveTo(E, 'rock', 0, 100, 900); await moveTo(E, 'ball', 0, 34, 700);
      await E.say('e_float');
      await E.say('a_air');
      E.$('front').innerHTML = tray('jackets', 380, 800, 300, 160, three(['jBig', 'jMid', 'jSmall'], [
        `<path d="M10 20 h56 v78 h-56z" fill="#FF7A45"/>${txt(38, 118, 'big', 16, '#24324A', 700)}`,
        `<path d="M16 30 h44 v64 h-44z" fill="#FF7A45"/>${txt(38, 118, 'medium', 16, '#24324A', 700)}`,
        `<path d="M22 40 h32 v50 h-32z" fill="#FF7A45"/>${txt(38, 118, 'small', 16, '#24324A', 700)}`]));
      await E.choice(['jBig', 'jMid', 'jSmall'], 'jSmall', 's_which');
      E.$('front').innerHTML = '';
      E.sfx.click();
      await E.say('s_snug');
      await E.say('e_ready');
      await E.say('a_truth');
    }
  });

  /* ================= 64 ================= */
  const beach = (extra) => lake(`<g id="net"><path d="M480 470 V760 M760 470 V760" stroke="#5D6B80" stroke-width="8"/><rect x="480" y="480" width="280" height="70" fill="none" stroke="#24324A" stroke-width="3"/><g stroke="#24324A" stroke-width="2" opacity=".6">${Array.from({length:9}, (_, i) => `<path d="M${508 + i*28} 480 v70"/>`).join('')}<path d="M480 515 h280"/></g></g>` + (extra || ''), { ground:'sand' });
  const vbScene = () => beach(`<g id="vball"><ellipse id="vb" cx="440" cy="730" rx="34" ry="18" fill="#FFFFFF" stroke="#2F6FD6" stroke-width="4"/></g><g id="pump"><rect x="640" y="660" width="26" height="100" rx="6" fill="#E53935"/><rect x="620" y="650" width="66" height="14" rx="6" fill="#5D6B80"/></g>`);
  EPISODES.push({ n:64, season:6, title:'Sand Volleyball with Sanvi', icon:'🏐', setting:'The lake beach',
    tip:'Drink water when you play in the sun, before you feel thirsty.',
    grown:'Pumping squeezes more air into the ball. Packed air pushes outward on every part of the skin, so the ball keeps its round shape and springs back when hit. A volleyball is pumped to about 4.3 to 4.6 pounds per square inch.',
    scene: vbScene,
    async run(E){
      setup6(E, 'sanvi');
      await E.say('title');
      await E.say('s_play');
      await E.say('e_flat');
      await E.say('a_know');
      await E.say('e_truth');
      E.$('front').innerHTML = tray('fills', 380, 800, 300, 160, three(['fSand', 'fWater', 'fAir'], [
        `<path d="M14 80 q24 -46 48 0z" fill="#EED9A4"/>${txt(38, 118, 'sand', 16, '#24324A', 700)}`,
        `<path d="M38 24 q22 32 0 56 q-22 -24 0 -56z" fill="#5FB8F2"/>${txt(38, 118, 'water', 16, '#24324A', 700)}`,
        `<circle cx="38" cy="54" r="26" fill="none" stroke="#9AA5B4" stroke-width="5" stroke-dasharray="6 5"/>${txt(38, 118, 'air', 16, '#24324A', 700)}`]));
      await E.choice(['fSand', 'fWater', 'fAir'], 'fAir', 'a_which');
      E.$('front').innerHTML = '';
      await E.taps('pump', 3, 'a_pump', async i => { E.sfx.whoosh(); const v = E.node('vb'); v.setAttribute('cy', 730 - i*4); v.setAttribute('ry', 18 + i*5.5); await E.wait(250); });
      E.sfx.boop();
      await E.anim(E.node('vball'), [{transform:'translateY(0)'},{transform:'translateY(-150px)'},{transform:'translateY(0)'},{transform:'translateY(-90px)'},{transform:'translateY(0)'}], {duration:1400});
      await E.say('s_bounce');
      await E.say('a_truth');
    }
  });

  /* ================= 65 ================= */
  const lawn = (extra) => lake(house + (extra || ''));
  const kneeScene = () => lawn(`<g id="kneeKit"><rect x="420" y="660" width="240" height="90" rx="14" fill="#FFFFFF" stroke="#E53935" stroke-width="5"/><path d="M530 680 v50 M505 705 h50" stroke="#E53935" stroke-width="10"/></g>`);
  const kneeSteps = [
    `<path d="M24 30 h28 v56 h-28z" fill="#BFE0F5" stroke="#5FB8F2" stroke-width="3"/><rect x="30" y="20" width="16" height="12" fill="#2F6FD6"/>${txt(38, 112, 'water', 16, '#24324A', 700)}`,
    `<rect x="14" y="40" width="48" height="22" rx="10" fill="#F2C9A0" stroke="#C98E5B" stroke-width="2"/><rect x="30" y="40" width="16" height="22" fill="#FFF1E0"/>${txt(38, 112, 'bandage', 16, '#24324A', 700)}`,
    `<rect x="18" y="30" width="40" height="40" rx="4" fill="#FFFFFF" stroke="#C9D3E2" stroke-width="3"/>${txt(38, 112, 'gauze', 16, '#24324A', 700)}`];
  EPISODES.push({ n:65, season:6, title:'Oops, a Scraped Knee', icon:'🩹', setting:'The lake house lawn',
    tip:'Tell a grown-up whenever you get hurt, even if it is small.',
    grown:'For a small scrape: wash your hands, rinse the scrape under clean running water, pat dry with clean gauze, then cover it with a bandage. Change the bandage if it gets wet or dirty. See a doctor for a deep cut, dirt that will not rinse out, or redness and swelling that spread.',
    scene: kneeScene,
    async run(E){
      setup6(E, 'fupu');
      await E.say('title');
      E.sfx.wrong();
      await E.anim(E.$('evanPos'), [{transform:'translate(275px,955px)'},{transform:'translate(275px,975px)'},{transform:'translate(275px,955px)'}], {duration:500});
      await E.say('e_ouch');
      await E.say('fu_calm');
      await E.say('a_know');
      await E.say('e_truth');
      const ids = ['kWater', 'kBand', 'kGauze'];
      E.$('front').innerHTML = tray('knee', 380, 800, 300, 160, three(ids, kneeSteps));
      await E.choice(ids, 'kWater', 'fu_first');
      E.sfx.drip(); await E.say('fu_rinse');
      await E.choice(ids, 'kGauze', 'fu_second');
      await E.say('fu_pat');
      await E.choice(ids, 'kBand', 'fu_third');
      E.$('front').innerHTML = '';
      E.sfx.cheer();
      await E.say('e_better');
      await E.say('fu_heal');
      await E.say('a_truth');
    }
  });

  /* ================= 66 ================= */
  const workout = () => lake(`<g id="heart"><path d="M540 470 c-30 -40 -100 -10 -70 40 l70 60 l70 -60 c30 -50 -40 -80 -70 -40z" fill="#E53935"/></g>${txt(540, 640, 'heartbeat', 22, '#FFFFFF', 700)}` +
    `<g id="jumpBtn"><rect x="460" y="680" width="160" height="70" rx="35" fill="#FFD43B" stroke="#E0B81A" stroke-width="4"/>${txt(540, 725, 'JUMP!', 28, '#24324A', 700)}</g>`, { ground:'dock' });
  EPISODES.push({ n:66, season:6, title:"Fupa's Dock Workout", icon:'💪', setting:'The lake house dock',
    tip:'Warm up first, drink water, and stop and tell a grown-up if you feel dizzy.',
    grown:'During exercise, muscles need more oxygen, so the heart pumps faster to carry blood to them. A child’s resting heart rate is often around 70 to 110 beats a minute and can rise well above that while running and jumping. Water replaces what you lose in sweat.',
    scene: workout,
    async run(E){
      setup6(E, 'fupa');
      const beat = ms => E.anim(E.node('heart'), [{transform:'scale(1)'},{transform:'scale(1.15)'},{transform:'scale(1)'}], {duration:ms, iterations:3});
      E.node('heart').style.transformBox = 'fill-box'; E.node('heart').style.transformOrigin = 'center';
      await E.say('title');
      await E.say('fa_workout');
      await E.say('e_ready');
      await E.say('a_know');
      await E.say('e_truth');
      E.sfx.boop(); await beat(900);
      await E.say('a_slow');
      await E.taps('jumpBtn', 3, 'fa_jump', async () => { E.sfx.pop(); await E.anim(E.$('evanPos'), [{transform:'translate(275px,955px)'},{transform:'translate(275px,905px)'},{transform:'translate(275px,955px)'}], {duration:420}); });
      E.sfx.boop(); await beat(350);
      await E.say('e_fast');
      await E.say('a_muscles');
      E.$('front').innerHTML = tray('drinks', 380, 800, 300, 160, three(['dSoda', 'dWater', 'dNone'], [
        `<rect x="24" y="24" width="28" height="60" rx="6" fill="#E53935"/>${txt(38, 112, 'soda', 16, '#24324A', 700)}`,
        `<rect x="24" y="20" width="28" height="66" rx="8" fill="#BFE0F5" stroke="#5FB8F2" stroke-width="3"/>${txt(38, 112, 'water', 16, '#24324A', 700)}`,
        `<circle cx="38" cy="54" r="24" fill="none" stroke="#9AA5B4" stroke-width="5"/><path d="M22 70 l32 -32" stroke="#9AA5B4" stroke-width="5"/>${txt(38, 112, 'nothing', 16, '#24324A', 700)}`]));
      await E.choice(['dSoda', 'dWater', 'dNone'], 'dWater', 'fa_drink');
      E.$('front').innerHTML = '';
      await E.say('fa_rep');
      await E.say('a_truth');
    }
  });

  /* ================= 67 ================= */
  const gridX = 400, gridY = 290, cell = 66;
  const blockScene = () => indoor(`<g id="board"><rect x="${gridX - 10}" y="${gridY - 10}" width="${cell*4 + 20}" height="${cell*4 + 20}" rx="16" fill="#2C3654"/>` +
    Array.from({length:16}, (_, i) => `<rect x="${gridX + (i%4)*cell + 3}" y="${gridY + Math.floor(i/4)*cell + 3}" width="${cell - 6}" height="${cell - 6}" rx="8" fill="${[5,6,9].includes(i) ? '#4E9A4E' : '#4FA3D9'}"/>`).join('') +
    `<text x="${gridX + 3*cell + 33}" y="${gridY + 45}" font-size="38" text-anchor="middle">💎</text>` +
    `<g id="boat"><text x="${gridX + 33}" y="${gridY + 3*cell + 46}" font-size="40" text-anchor="middle">⛵</text></g></g>`);
  const arrows = (s) => `${txt(38, 64, s, 22, '#24324A', 700)}`;
  EPISODES.push({ n:67, season:6, title:"Anvi's Block World", icon:'🧱', setting:'The lake house living room',
    tip:'Take breaks from screens, and play outside too.',
    grown:'An algorithm is a list of exact steps done in order. Computers do only what the steps say, so programmers plan the path, test it, and fix (debug) any step that goes the wrong way. Arrow cards like these are how many kids start coding without a screen.',
    scene: blockScene,
    async run(E){
      setup6(E, 'anvi', 95, .9);
      await E.say('title');
      await E.say('an_level');
      await E.say('e_how');
      await E.say('a_know');
      await E.say('e_truth');
      await E.say('an_rules');
      E.$('front').innerHTML = tray('codes', 380, 800, 300, 160, three(['cA', 'cB', 'cC'], [arrows('↑↑↑→'), arrows('→→→↑↑↑'), arrows('→↑→')]));
      await E.choice(['cA', 'cB', 'cC'], 'cB', 'an_which');
      E.$('front').innerHTML = '';
      await E.tap('boat', 'an_go');
      const b = E.node('boat');
      for(const [dx, dy] of [[1,0],[2,0],[3,0],[3,-1],[3,-2],[3,-3]]){ b.setAttribute('transform', `translate(${dx*cell} ${dy*cell})`); E.sfx.click(); await E.wait(330); }
      E.sfx.cheer();
      await E.say('an_win');
      await E.say('e_code');
      await E.say('a_truth');
    }
  });

  /* ================= 68 ================= */
  const sunny = () => lake(house + `<g id="post"><rect x="450" y="560" width="14" height="140" fill="#8A5A33"/></g><g id="shR"><path d="M464 700 L640 720 L640 732 L464 712Z" fill="#000" opacity=".25"/></g>` +
    `<g id="sL" style="display:none"><circle cx="440" cy="760" r="20" fill="#FFD43B" opacity=".9"/></g><g id="sR" style="display:none"><circle cx="640" cy="760" r="20" fill="#FFD43B" opacity=".9"/></g>`, { sunX:200, sunY:330 });
  EPISODES.push({ n:68, season:6, title:'Sunny Day', icon:'☀️', setting:'The lake house lawn',
    tip:'Wear sunscreen and a hat, and find shade in the middle of the day.',
    grown:'Light travels in straight lines, so a shadow always points away from the Sun. Shadows are shortest around midday, when the Sun is highest and its ultraviolet (UV) light is strongest. Use broad-spectrum sunscreen SPF 30 or higher and put more on every 2 hours and after swimming.',
    scene: sunny,
    async run(E){
      setup6(E, 'sanvi');
      await E.say('title');
      await E.say('s_shadow');
      await E.say('e_sun');
      await E.say('a_know');
      await E.say('e_truth');
      await E.say('a_move');
      show(E, 'sL'); show(E, 'sR');
      await E.choice(['sL', 'sR'], 'sL', 'a_where');
      hide(E, 'sL'); hide(E, 'sR');
      await moveTo(E, 'shR', -190, 0, 900, null, 0);
      E.sfx.bell();
      await E.say('e_other');
      E.$('front').innerHTML = tray('protect', 380, 800, 300, 160, three(['pIce', 'pScreen', 'pSand'], [
        `<path d="M24 40 h28 l-14 50z" fill="#E0B85A"/><circle cx="38" cy="34" r="16" fill="#F48FB1"/>${txt(38, 112, 'ice cream', 14, '#24324A', 700)}`,
        `<rect x="26" y="14" width="24" height="66" rx="8" fill="#FFD43B"/><rect x="30" y="6" width="16" height="12" rx="3" fill="#E07A2E"/>${txt(38, 112, 'sunscreen', 14, '#24324A', 700)}`,
        `<path d="M14 80 q24 -46 48 0z" fill="#EED9A4"/>${txt(38, 112, 'sand', 14, '#24324A', 700)}`]));
      await E.choice(['pIce', 'pScreen', 'pSand'], 'pScreen', 's_protect');
      E.$('front').innerHTML = '';
      await E.say('s_hat');
      await E.say('a_truth');
    }
  });

  /* ================= 69 ================= */
  const kayak = () => lake(`<g id="kayak"><path d="M380 600 Q540 690 700 600 L680 580 H400Z" fill="#E07A2E" stroke="#B5571C" stroke-width="5"/><g id="water"><path d="M420 600 Q540 650 660 600Z" fill="#5FB8F2" opacity=".8"/></g><g id="hole"><circle cx="520" cy="638" r="10" fill="#24324A"/></g><g id="drip">${bubbles(505, 660, 30, 3)}</g><g id="patch" style="display:none"><rect x="500" y="624" width="40" height="28" rx="6" fill="#5D6B80"/></g></g>` + style, { ground:'dock' });
  EPISODES.push({ n:69, season:6, title:'The Leaky Kayak', icon:'🛶', setting:'The lake house dock',
    tip:'Check boats with a grown-up before going on the water, and always wear your life jacket.',
    grown:'Water pressure grows with depth, so water pushes in through any hole below the waterline. A waterproof patch seals the hole and keeps the boat dry. Boats float because their shape pushes aside a lot of water while the boat itself stays light.',
    scene: kayak,
    async run(E){
      setup6(E, 'fupa');
      await E.say('title');
      await E.say('fa_kayak');
      await E.say('e_wet');
      await E.say('a_know');
      await E.say('e_truth');
      await E.tap('aama', 'a_tapme');
      E.scan('hole'); await E.say('a_scan'); E.scanOff();
      E.$('front').innerHTML = tray('patches', 380, 800, 300, 160, three(['pPaper', 'pTape', 'pLeaf'], [
        `<rect x="14" y="30" width="48" height="40" rx="4" fill="#F2E3C4"/>${txt(38, 112, 'paper', 16, '#24324A', 700)}`,
        `<rect x="14" y="30" width="48" height="40" rx="8" fill="#5D6B80"/>${txt(38, 104, 'waterproof', 13, '#24324A', 700)}${txt(38, 120, 'patch', 13, '#24324A', 700)}`,
        `<path d="M38 20 q26 30 0 66 q-26 -36 0 -66z" fill="#4E9A4E"/>${txt(38, 112, 'leaf', 16, '#24324A', 700)}`]));
      await E.choice(['pPaper', 'pTape', 'pLeaf'], 'pTape', 'fa_which');
      E.$('front').innerHTML = '';
      show(E, 'patch'); hide(E, 'drip'); E.sfx.snap();
      await E.say('fa_sponge');
      await E.tap('water', 'fa_tapwater');
      await E.anim(E.node('water'), [{opacity:1},{opacity:0}], {duration:900, fill:'forwards'});
      await E.say('e_dry');
      await E.say('a_truth');
    }
  });

  /* ================= 70 ================= */
  const garden = () => lake(house + `<g id="flowers">${[0,1,2,3,4].map(i => `<g><path d="M${420 + i*55} 700 v-70" stroke="#2E9C3E" stroke-width="5"/><circle cx="${420 + i*55}" cy="622" r="18" fill="${['#F48FB1','#FFD43B','#B39DDB','#FF8A65','#F48FB1'][i]}"/><circle cx="${420 + i*55}" cy="622" r="6" fill="#E0A800"/></g>`).join('')}</g>` +
    `<g id="bee"><ellipse cx="560" cy="560" rx="16" ry="11" fill="#FFD43B"/><path d="M552 552 v16 M562 551 v18" stroke="#24324A" stroke-width="4"/><ellipse cx="556" cy="546" rx="9" ry="6" fill="#E9F6FF" opacity=".9"/><ellipse cx="566" cy="546" rx="9" ry="6" fill="#E9F6FF" opacity=".9"/></g>`);
  EPISODES.push({ n:70, season:6, title:'Buzzing Bee', icon:'🐝', setting:"Fupu's flower garden",
    tip:'Stay calm and still near bees. If you get stung, tell a grown-up right away.',
    grown:'Honeybees leave their stinger behind. Scrape it out sideways with a flat edge like a card as soon as possible, wash the spot, and hold a wrapped cold pack on it for about 10 minutes. Call emergency services at once if someone has trouble breathing or swelling of the face, lips or throat after a sting.',
    scene: garden,
    async run(E){
      setup6(E, 'fupu');
      await E.say('title');
      await E.anim(E.node('bee'), [{transform:'translate(0,0)'},{transform:'translate(-60px,-30px)'},{transform:'translate(40px,-10px)'},{transform:'translate(0,0)'}], {duration:1600});
      await E.say('e_bee');
      E.sfx.wrong();
      await E.say('e_ouch');
      await E.say('fu_calm');
      await E.say('a_know');
      await E.say('e_truth');
      E.$('front').innerHTML = tray('sting', 380, 800, 300, 160, three(['sSqueeze', 'sCard', 'sLeave'], [
        `<path d="M18 60 q20 -30 40 0" stroke="#F2C9A0" stroke-width="12" fill="none" stroke-linecap="round"/>${txt(38, 112, 'squeeze', 15, '#24324A', 700)}`,
        `<rect x="12" y="34" width="52" height="34" rx="5" fill="#2F6FD6"/>${txt(38, 112, 'scrape', 15, '#24324A', 700)}`,
        `<circle cx="38" cy="52" r="24" fill="none" stroke="#9AA5B4" stroke-width="5"/><path d="M22 68 l32 -32" stroke="#9AA5B4" stroke-width="5"/>${txt(38, 112, 'leave it', 15, '#24324A', 700)}`]));
      await E.choice(['sSqueeze', 'sCard', 'sLeave'], 'sCard', 'fu_how');
      E.$('front').innerHTML = '';
      await E.say('fu_cold');
      await E.say('e_better');
      await moveTo(E, 'bee', -120, 50, 1200);
      await E.say('fu_pollen');
      await E.say('a_truth');
    }
  });

  /* ================= 71 ================= */
  const camp = () => lake(`<g id="fire"><ellipse cx="560" cy="700" rx="80" ry="22" fill="#5D6B80"/><path d="M520 700 l40 -26 l40 26" stroke="#6B3E22" stroke-width="12"/><path id="flame" d="M560 600 q-40 40 -20 90 q20 10 40 0 q20 -50 -20 -90z" fill="#FF7A45"/><path d="M560 630 q-20 30 -8 60 q8 6 16 0 q12 -34 -8 -60z" fill="#FFD43B"/></g>` +
    `<g id="spot1" style="display:none"><circle cx="560" cy="760" r="22" fill="#FFFFFF" opacity=".85"/></g><g id="spot2" style="display:none"><circle cx="440" cy="790" r="22" fill="#FFFFFF" opacity=".85"/></g>` +
    `<g id="stick" style="display:none"><path d="M380 600 L520 640" stroke="#8A5A33" stroke-width="6"/><ellipse id="mallow" cx="524" cy="642" rx="14" ry="11" fill="#FFFFFF"/></g>`, { night:true, ground:'sand' });
  EPISODES.push({ n:71, season:6, title:"Campfire S'mores", icon:'🔥', setting:'The lake beach at night',
    tip:'Stay a big step back from fires. Only grown-ups light a fire or put it out.',
    grown:'Fire gives off heat by radiation (warmth you feel on your face) and convection (hot air rising). Sugar in a marshmallow melts and then browns, a change called caramelization. Keep children at least 3 feet (about 1 meter) from a campfire and always drown it with water before leaving.',
    scene: camp,
    async run(E){
      setup6(E, 'sanvi');
      E.anim(E.node('flame'), [{opacity:1},{opacity:.75},{opacity:1}], {duration:500, iterations:40});
      await E.say('title');
      await E.say('s_smores');
      await E.say('e_close');
      await E.say('a_know');
      await E.say('e_truth');
      show(E, 'spot1'); show(E, 'spot2');
      await E.choice(['spot1', 'spot2'], 'spot2', 'a_where');
      hide(E, 'spot1'); hide(E, 'spot2');
      await E.say('s_good');
      E.$('front').innerHTML = tray('sticks', 380, 800, 280, 160, two(['stShort', 'stLong'], [
        `<path d="M40 70 L70 50" stroke="#8A5A33" stroke-width="6"/><circle cx="72" cy="48" r="9" fill="#fff" stroke="#C9D3E2"/>${txt(50, 122, 'short', 16, '#24324A', 700)}`,
        `<path d="M8 90 L84 40" stroke="#8A5A33" stroke-width="6"/><circle cx="86" cy="38" r="9" fill="#fff" stroke="#C9D3E2"/>${txt(50, 122, 'long', 16, '#24324A', 700)}`]));
      await E.choice(['stShort', 'stLong'], 'stLong', 's_stick');
      E.$('front').innerHTML = '';
      show(E, 'stick');
      for(const c of ['#FFF3D6', '#F2D29B', '#D9A05B']){ fill(E, 'mallow', c); E.sfx.click(); await E.wait(500); }
      await E.say('e_gold');
      await E.say('s_yum');
      await E.say('a_truth');
    }
  });

  /* ================= 72 ================= */
  const cupScene = () => beach(`<g id="vball2"><circle cx="430" cy="640" r="22" fill="#FFFFFF" stroke="#2F6FD6" stroke-width="4"/></g><g id="score">${txt(620, 405, 'COUSIN CUP', 26, '#24324A', 700)}<text id="scoreT" x="620" y="440" font-family="Fredoka,sans-serif" font-size="24" font-weight="700" fill="#AD1457" text-anchor="middle">Team Evan 9 : 9 Team Fupa</text></g>`);
  const starNight = () => lake(`<g id="scope"><path d="M520 760 l40 -120 l40 120" stroke="#5D6B80" stroke-width="7" fill="none"/><rect x="510" y="600" width="110" height="34" rx="10" fill="#9AA5B4" transform="rotate(-25 565 617)"/></g><g id="moonBig" style="display:none"><circle cx="560" cy="320" r="70" fill="#E8EEF6"/><circle cx="540" cy="300" r="12" fill="#C9D3E2"/><circle cx="585" cy="340" r="9" fill="#C9D3E2"/><circle cx="575" cy="295" r="6" fill="#C9D3E2"/></g>`, { night:true });
  EPISODES.push({ n:72, season:6, title:'The Cousin Cup', icon:'🏆', setting:'The lake beach, then the stars',
    tip:'Never look at the Sun through a telescope or binoculars.',
    grown:'Teams win by passing: a pass lets the next player set the ball up for a better hit. Through a small telescope, the Moon’s craters and dark plains (called maria) are easy to see, especially along the edge between light and shadow.',
    scene: cupScene,
    outro: ['a_super'],
    async run(E){
      setup6(E, 'sanvi');
      E.person('anvi', 640, 945, { scale:.75 });
      E.aamaSet(850, 945);
      await E.say('title');
      await E.say('a_tied');
      await E.say('s_pass');
      await E.say('a_know');
      await E.say('e_truth');
      await E.tap('p_sanvi', 'a_tapsanvi');
      E.sfx.boop(); await moveTo(E, 'vball2', 40, -200, 600);
      await E.say('s_set');
      await E.tap('vball2', 'a_hit');
      E.sfx.boop(); await moveTo(E, 'vball2', 260, -160, 700);
      E.node('scoreT').textContent = 'Team Evan 10 : 9 Team Fupa'; E.sfx.cheer();
      await E.say('e_won');
      await E.say('an_cup');
      await swap(E, starNight());
      E.personDrop('sanvi'); E.personDrop('anvi');
      E.evanSet(380, 955); E.aamaSet(820, 945);
      E.person('habba', 90, 945, { scale:.8, fade:true }); E.person('dallu', 215, 945, { scale:.8, fade:true });
      await E.say('d_stars');
      await E.tap('scope', 'a_look');
      show(E, 'moonBig'); E.sfx.bell();
      await E.say('e_moon');
      await E.say('h_family');
      await E.say('e_best');
      await E.say('a_truth');
    }
  });

  EPISODES.filter(e => e.season === 6).forEach(e => { const prev = e.setup; e.setup = E => { E.evanSuit(false); E.evanSet(275, 955); if(prev) prev(E); }; });
})();
