/* Evan & Aama, Season 5: Big Ideas */
(function(){
  const EPISODES = window.EPISODES;
  const { moveTo, hide, show, fill, swap, txt, stars, sky, tray, three, two, screen, room, ice, glimmer, glow, crew, bubbles, style, domeIn } = window.S4H;
  const frosty = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#DDEBFA"/><circle cx="${cx - r*.3}" cy="${cy - r*.2}" r="${r*.18}" fill="#C7DCF2"/><circle cx="${cx + r*.35}" cy="${cy + r*.3}" r="${r*.12}" fill="#C7DCF2"/>`;
  const bigShip = (x, y) => `<g id="bigShip"><path d="M${x} ${y} h220 q40 0 40 30 v30 q0 30 -40 30 h-220 q-30 -45 0 -90z" fill="#7D8794" stroke="#C9D3E2" stroke-width="5"/>${[0,1,2,3,4].map(i => `<circle cx="${x + 30 + i*40}" cy="${y + 45}" r="9" fill="#FFD43B"/>`).join('')}</g>`;
  const cockpit = (view, seed) => sky(seed || 57) + (view || '') +
    `<path d="M0 0 H900 V90 Q450 40 0 90Z" fill="#3E4A66"/><path d="M0 760 Q450 700 900 760 V1000 H0Z" fill="#3E4A66"/><path d="M0 760 Q450 700 900 760" stroke="#9AA5B4" stroke-width="8" fill="none"/>`;

  /* ================= EPISODE 49 ================= */
  const pullScene = () => sky(49) + frosty(430, 330, 70) + bigShip(570, 290) +
    `<g id="path" style="display:none"><path id="nearP" d="M570 335 Q530 360 500 350" stroke="#E53935" stroke-width="7" stroke-dasharray="14 10" fill="none"/><path id="farP" d="M600 290 Q620 220 760 200" stroke="#2FBF71" stroke-width="7" stroke-dasharray="14 10" fill="none"/></g>` +
    `<g id="sling"><circle cx="560" cy="620" r="8" fill="#5D6B80"/><g id="orbit" style="transform-origin:560px 620px"><path d="M560 620 L650 620" stroke="#C9D3E2" stroke-width="4"/><circle id="ball" cx="650" cy="620" r="20" fill="#FF7A45"/></g></g>` +
    `<path d="M0 790 Q450 760 900 790 V1000 H0Z" fill="#E4EFFA"/>`;
  EPISODES.push({ n:49, season:5, title:"The Big Ship's Pull", icon:'🪐', setting:'Frosty Moon, under the stars',
    tip:'Swing toys only where nobody is standing close.',
    grown:'Gravity: F = G × m₁ × m₂ / r². Heavier things pull harder, and the pull gets weaker fast as things move apart. A moon keeps circling its planet because gravity pulls it inward, like a string on a swinging ball.',
    scene: pullScene,
    async run(E){
      crew(E);
      await E.say('title');
      await E.say('e_ship');
      await E.say('a_pull');
      await E.say('s_why');
      await E.say('a_know');
      await E.say('e_truth');
      await E.taps('ball', 3, 'a_swing', async () => { E.sfx.whoosh(); await E.anim(E.node('orbit'), [{transform:'rotate(0deg)'},{transform:'rotate(360deg)'}], {duration:900}); });
      await E.say('e_feel');
      show(E, 'path');
      E.$('front').innerHTML = tray('ways', 380, 800, 280, 160, two(['wNear', 'wFar'], [
        `${txt(50, 30, 'close', 18, '#24324A', 700)}<circle cx="30" cy="80" r="22" fill="#DDEBFA" stroke="#9AA5B4" stroke-width="3"/><path d="M90 60 Q70 70 54 80" stroke="#E53935" stroke-width="6" stroke-dasharray="8 6" fill="none"/>`,
        `${txt(50, 30, 'far away', 18, '#24324A', 700)}<circle cx="22" cy="96" r="16" fill="#DDEBFA" stroke="#9AA5B4" stroke-width="3"/><path d="M90 96 Q80 50 50 46" stroke="#2FBF71" stroke-width="6" stroke-dasharray="8 6" fill="none"/>`]));
      await E.choice(['wNear', 'wFar'], 'wFar', 'a_which');
      E.$('front').innerHTML = '';
      hide(E, 'nearP'); E.sfx.vroom();
      await moveTo(E, 'bigShip', 120, -110, 2200, .6);
      await E.say('s_phew');
      await E.say('a_truth');
    }
  });

  /* ================= EPISODE 50 ================= */
  const storm = () => domeIn() +
    `<g id="wind" stroke="#E9FFFE" stroke-width="5" fill="none" opacity=".6" stroke-linecap="round"><path d="M40 200 q120 -30 240 0"/><path d="M600 160 q120 -30 240 0"/><path d="M380 260 q90 -24 180 0"/></g>` +
    `<g id="core"><path d="M560 640 L620 560 L680 640 L620 700Z" fill="#B9A2F2" stroke="#E9FFFE" stroke-width="4"/><circle cx="620" cy="630" r="10" fill="#E9FFFE"/></g>`;
  EPISODES.push({ n:50, season:5, title:'The Spinning Top Storm', icon:'🌀', setting:'Inside the Glimmer Dome',
    tip:'Stay inside during storms, and wait for a grown-up to say it is safe.',
    grown:'A spinning object resists tipping. This is angular momentum, L = I × ω: the faster it spins, the steadier it stays. Gyroscopes in phones, bikes and spacecraft use the same idea.',
    scene: storm,
    setup(E){ E.node('glim').setAttribute('transform', 'translate(470 430) scale(.7)'); },
    async run(E){
      E.evanSuit(true); E.evanSet(275, 955); E.aamaSet(820, 945);
      E.person('orion', 95, 945, { img:'orionsp' });
      E.node('glim').style.opacity = 1;
      const wob = E.anim(E.$('scene'), [{transform:'rotate(0deg)'},{transform:'rotate(.6deg)'},{transform:'rotate(-.6deg)'},{transform:'rotate(0deg)'}], {duration:700, iterations:4});
      E.sfx.whoosh();
      await E.say('title');
      await wob;
      await E.say('o_wobble');
      await E.say('a_core');
      await E.say('a_know');
      await E.say('e_truth');
      E.$('front').innerHTML = tray('tops', 380, 800, 280, 160, two(['tStill', 'tSpin'], [
        `<path d="M30 110 L80 70 L60 40 L30 90Z" fill="#B9A2F2"/>${txt(50, 30, 'still', 18, '#24324A', 700)}`,
        `<path d="M50 50 L80 90 L50 120 L20 90Z" fill="#B9A2F2"/><path d="M14 80 q36 -18 72 0" stroke="#2F6FD6" stroke-width="4" fill="none"/>${txt(50, 30, 'spinning', 18, '#24324A', 700)}`]));
      await E.choice(['tStill', 'tSpin'], 'tSpin', 'a_which');
      E.$('front').innerHTML = '';
      await E.say('e_spin');
      E.node('core').style.transformBox = 'fill-box'; E.node('core').style.transformOrigin = 'center';
      await E.taps('core', 3, 'a_tapcore', async i => { E.sfx.vroom(); await E.anim(E.node('core'), [{transform:'scaleX(1)'},{transform:'scaleX(-1)'},{transform:'scaleX(1)'}], {duration:Math.max(200, 700 - i*180), iterations:2}); });
      E.node('core').style.transformBox = 'fill-box'; E.node('core').style.transformOrigin = 'center';
      E.anim(E.node('core'), [{transform:'scaleX(1)'},{transform:'scaleX(-1)'},{transform:'scaleX(1)'}], {duration:220, iterations:12});
      hide(E, 'wind'); E.sfx.bell();
      await E.say('o_steady');
      await glow(E, 2);
      await E.say('a_truth');
    }
  });

  /* ================= EPISODE 51 ================= */
  const beamScene = () => domeIn() + bigShip(600, 250) +
    `<g id="panels"><path id="flatP" d="M420 700 H700" stroke="#C9D3E2" stroke-width="10"/></g>` +
    `<g id="bowl" style="display:none"><path d="M420 640 Q560 760 700 640" stroke="#E9FFFE" stroke-width="10" fill="none"/></g>` +
    `<g id="scatter"><path d="M560 700 L470 560 M560 700 L620 600 M560 700 L700 690 M560 700 L520 540" stroke="#FFE066" stroke-width="4" stroke-dasharray="8 8" opacity=".7"/></g>` +
    `<g id="beamUp" style="display:none"><path d="M560 690 L700 300" stroke="#FFE066" stroke-width="12" opacity=".85"/></g>`;
  EPISODES.push({ n:51, season:5, title:'The Shiny Bowl', icon:'📡', setting:'Inside the Glimmer Dome',
    tip:'Never shine a flashlight or any light into someone’s eyes.',
    grown:'A parabola is a special curve: every ray that comes in straight bounces through one point, the focus, and light sent out from the focus leaves in one straight beam. Satellite dishes, car headlights and big telescopes use this shape.',
    scene: beamScene,
    setup(E){ E.node('glim').setAttribute('transform', 'translate(330 380) scale(.55)'); E.node('torch').style.display = 'none'; },
    async run(E){
      E.evanSuit(true); E.evanSet(275, 955); E.aamaSet(820, 945);
      E.person('kestrel', 95, 945, { img:'kestrelsp' });
      E.node('glim').style.opacity = 1;
      await E.say('title');
      await E.say('a_hello');
      await E.say('k_spread');
      await E.say('a_know');
      await E.say('e_truth');
      E.$('front').innerHTML = tray('shapes', 380, 800, 300, 160, three(['sFlat', 'sBowl', 'sBumpy'], [
        `<path d="M10 60 H66" stroke="#5D6B80" stroke-width="8"/>${txt(38, 112, 'flat', 16, '#24324A', 700)}`,
        `<path d="M10 40 Q38 90 66 40" stroke="#2F6FD6" stroke-width="8" fill="none"/>${txt(38, 112, 'bowl', 16, '#24324A', 700)}`,
        `<path d="M8 60 q10 -20 20 0 q10 20 20 0 q10 -20 20 0" stroke="#5D6B80" stroke-width="8" fill="none"/>${txt(38, 112, 'bumpy', 16, '#24324A', 700)}`]));
      await E.choice(['sFlat', 'sBowl', 'sBumpy'], 'sBowl', 'a_which');
      E.$('front').innerHTML = '';
      hide(E, 'panels'); hide(E, 'scatter'); show(E, 'bowl'); E.sfx.click();
      await E.tap('bowl', 'a_shine');
      show(E, 'beamUp'); E.sfx.beep();
      await E.say('k_beam');
      await moveTo(E, 'bigShip', 300, -40, 1800);
      await E.say('e_turned');
      await E.say('a_truth');
    }
  });

  /* ================= EPISODE 52 ================= */
  const faces = ['', '<circle cx="50" cy="50" r="9"/>', '<circle cx="30" cy="30" r="9"/><circle cx="70" cy="70" r="9"/>', '<circle cx="28" cy="28" r="9"/><circle cx="50" cy="50" r="9"/><circle cx="72" cy="72" r="9"/>', '<circle cx="30" cy="30" r="9"/><circle cx="70" cy="30" r="9"/><circle cx="30" cy="70" r="9"/><circle cx="70" cy="70" r="9"/>', '<circle cx="28" cy="28" r="9"/><circle cx="72" cy="28" r="9"/><circle cx="50" cy="50" r="9"/><circle cx="28" cy="72" r="9"/><circle cx="72" cy="72" r="9"/>', '<circle cx="30" cy="26" r="9"/><circle cx="70" cy="26" r="9"/><circle cx="30" cy="50" r="9"/><circle cx="70" cy="50" r="9"/><circle cx="30" cy="74" r="9"/><circle cx="70" cy="74" r="9"/>'];
  const vaultDoor = () => room(`<g id="vdoor"><circle cx="545" cy="500" r="170" fill="#9AA5B4" stroke="#C9D3E2" stroke-width="12"/><circle cx="545" cy="500" r="125" fill="#B7C1CF"/><g transform="translate(495 440)" fill="#24324A"><rect width="100" height="100" rx="18" fill="#FFFFFF" stroke="#5D6B80" stroke-width="4"/>${faces[6]}</g>${txt(545, 600, 'SEED VAULT', 22, '#4A5568', 700)}</g>`, { window:false });
  EPISODES.push({ n:52, season:5, title:'The Lucky Door', icon:'🎲', setting:'Under the Shattered Sea',
    tip:'Take turns when you play games, and cheer for each other.',
    grown:'A die has 6 sides, so each roll has a 1 in 6 chance of a six. The chance of at least one six in n rolls is 1 − (5/6)ⁿ: about 52% after 4 rolls and 84% after 10. In quantum physics, particles sometimes slip through walls this way: very unlikely each try, but it happens.',
    scene: vaultDoor,
    async run(E){
      crew(E, { ax:830 });
      await E.say('title');
      await E.say('s_locked');
      await E.say('a_six');
      await E.say('a_know');
      await E.say('e_truth');
      E.$('front').innerHTML = tray('dice', 430, 800, 180, 160, `<g id="die"><rect x="470" y="820" width="100" height="100" rx="18" fill="#FFFFFF" stroke="#2F6FD6" stroke-width="5"/><g id="dieFace" transform="translate(470 820)" fill="#24324A">${faces[1]}</g></g>`);
      const rolls = [2, 4, 1, 6];
      for(let i = 0; i < rolls.length; i++){
        await E.tap('die', i ? 'a_again' : 'a_roll');
        E.sfx.click();
        for(let k = 0; k < 5; k++){ E.node('dieFace').innerHTML = faces[1 + (k*3 + i) % 6]; await E.wait(90); }
        E.node('dieFace').innerHTML = faces[rolls[i]];
        if(rolls[i] !== 6){ E.sfx.wrong(); await E.say('t' + (i + 1)); }
      }
      E.sfx.cheer();
      await E.say('e_six');
      E.$('front').innerHTML = '';
      await moveTo(E, 'vdoor', 380, 0, 1500);
      await E.say('s_open');
      await E.say('a_truth');
    }
  });

  /* ================= EPISODE 53 ================= */
  const magnetRoom = () => room(`<g id="plate"><rect x="420" y="270" width="260" height="40" rx="8" fill="#7D8794" stroke="#C9D3E2" stroke-width="4"/></g>` +
    `<g id="seedBox"><rect x="500" y="690" width="100" height="90" rx="12" fill="#FFF3D6" stroke="#E0B85A" stroke-width="4"/>${txt(550, 745, 'seeds', 18, '#8A6A1A', 700)}</g>` +
    `<g id="nail"><rect x="540" y="420" width="20" height="160" rx="4" fill="#9AA5B4"/><path d="M530 420 h40" stroke="#9AA5B4" stroke-width="10"/><g id="coils" stroke="#E07A2E" stroke-width="6" fill="none"></g></g>` +
    `<g id="batt"><rect x="400" y="520" width="80" height="44" rx="8" fill="#2F6FD6"/><rect x="480" y="532" width="8" height="20" fill="#2F6FD6"/>${txt(440, 549, '+  −', 18, '#fff', 700)}</g>` +
    `<path id="wireL" d="M480 542 Q510 560 540 560" stroke="#E07A2E" stroke-width="5" fill="none" style="display:none"/>` +
    `<g id="field" style="display:none"><ellipse cx="550" cy="420" rx="60" ry="30" fill="none" stroke="#5FF6FF" stroke-width="4" stroke-dasharray="8 6"/><ellipse cx="550" cy="400" rx="90" ry="45" fill="none" stroke="#5FF6FF" stroke-width="3" stroke-dasharray="8 6" opacity=".6"/></g>`, { window:false });
  EPISODES.push({ n:53, season:5, title:'Magnet Brakes', icon:'🧲', setting:'Inside the Seed Vault',
    tip:'Keep magnets and button batteries away from little mouths. If one is swallowed, tell a grown-up right away.',
    grown:'Electricity flowing through a coil of wire makes a magnetic field: an electromagnet. When metal moves past a magnet, the magnet stirs up tiny electric currents in the metal (eddy currents) that push back and slow it down. This is Lenz’s law, and some trains brake this way.',
    scene: magnetRoom,
    async run(E){
      E.evanSuit(true); E.evanSet(275, 955); E.aamaSet(820, 945);
      E.person('orion', 95, 945, { img:'orionsp' });
      await E.say('title');
      E.sfx.creak();
      await moveTo(E, 'plate', 0, 40, 900);
      await E.say('o_falling');
      await E.say('a_know');
      await E.say('e_truth');
      await E.say('a_coil');
      await E.taps('nail', 3, 'a_wrap', async i => { E.sfx.click(); E.node('coils').innerHTML += [0,1,2].map(j => `<ellipse cx="550" cy="${450 + (i-1)*36 + j*12}" rx="18" ry="5"/>`).join(''); });
      show(E, 'wireL');
      await E.tap('batt', 'a_battery');
      show(E, 'field'); E.sfx.beep();
      await E.say('e_magnet');
      await moveTo(E, 'plate', 0, 90, 2600);
      await E.say('o_slow');
      await E.tap('seedBox', 'a_grab');
      E.sfx.pop(); await moveTo(E, 'seedBox', -220, 60, 700, .8);
      await E.say('e_got');
      await E.say('a_truth');
    }
  });

  /* ================= EPISODE 54 ================= */
  const kitchen = () => `<rect width="900" height="1000" fill="#FFF4DE"/><rect y="560" width="900" height="440" fill="#E7C9A0"/><rect x="0" y="540" width="900" height="30" fill="#C9A274"/>` +
    `<rect x="60" y="250" width="200" height="160" rx="14" fill="#BFE0F5" stroke="#FFFFFF" stroke-width="10"/><path d="M160 250 V410 M60 330 H260" stroke="#FFFFFF" stroke-width="8"/>` +
    `<g id="fridge"><rect x="640" y="240" width="160" height="300" rx="18" fill="#E9EEF6" stroke="#B7C1CF" stroke-width="5"/><path d="M640 360 H800" stroke="#B7C1CF" stroke-width="5"/><rect x="770" y="280" width="10" height="50" rx="4" fill="#9AA5B4"/></g>` +
    `<g id="cup"><path d="M430 470 h100 l-12 70 h-76z" fill="#E07A2E"/><rect x="430" y="462" width="100" height="14" rx="6" fill="#B5571C"/><g id="sprout" style="display:none"><path d="M480 462 v-60" stroke="#2E9C3E" stroke-width="7"/><ellipse cx="462" cy="410" rx="18" ry="9" fill="#3FB34F"/><ellipse cx="498" cy="400" rx="18" ry="9" fill="#3FB34F"/></g><g id="stem" style="display:none"><path d="M480 462 v-20" stroke="#2E9C3E" stroke-width="6"/></g></g>`;
  EPISODES.push({ n:54, season:5, title:'Sleepy Seeds', icon:'🌱', setting:"Evan's kitchen",
    tip:'Wash your hands after gardening, and never eat seeds or plants unless a grown-up says they are food.',
    grown:'Seeds can stay dormant (asleep) for years when they are kept cold and dry. Water and warmth wake them up. Seed banks like the Svalbard Global Seed Vault store seeds at about −18 °C to keep crops safe for the future.',
    scene: kitchen,
    setup(E){ E.evanSuit(false); E.evanSet(275, 955); },
    async run(E){
      E.evanSuit(false); E.evanSet(275, 955); E.aamaSet(820, 945);
      E.person('kestrel', 95, 945);
      await E.say('title');
      await E.say('k_box');
      await E.say('e_sleep');
      await E.say('a_know');
      await E.say('e_truth');
      E.$('front').innerHTML = tray('places', 380, 800, 280, 160, two(['pWarm', 'pCold'], [
        `<rect x="20" y="40" width="60" height="50" rx="8" fill="#5FB8F2"/><circle cx="50" cy="30" r="14" fill="#FFD43B"/>${txt(50, 122, 'warm, wet', 16, '#24324A', 700)}`,
        `<rect x="22" y="22" width="56" height="76" rx="8" fill="#E9EEF6" stroke="#9AA5B4" stroke-width="3"/><path d="M40 50 l20 0 M50 40 l0 20 M43 43 l14 14 M57 43 l-14 14" stroke="#5FB8F2" stroke-width="3"/>${txt(50, 122, 'cold, dry', 16, '#24324A', 700)}`]));
      await E.choice(['pWarm', 'pCold'], 'pCold', 'a_where');
      E.$('front').innerHTML = '';
      E.sfx.click();
      await E.say('k_fridge');
      await E.say('a_wake');
      await E.taps('cup', 3, 'a_water', async i => { E.sfx.drip(); if(i === 2) show(E, 'stem'); if(i === 3){ hide(E, 'stem'); show(E, 'sprout'); } await E.wait(300); });
      E.sfx.bell();
      await E.say('e_woke');
      await E.say('a_truth');
    }
  });

  /* ================= EPISODE 55 ================= */
  const lemonTable = () => `<rect width="900" height="1000" fill="#FFF4DE"/><rect y="600" width="900" height="400" fill="#E7C9A0"/><rect x="360" y="580" width="420" height="30" rx="8" fill="#B5844E"/>` +
    `${[0,1,2,3].map(i => `<g id="lem${i}"><ellipse cx="${410 + i*100}" cy="540" rx="42" ry="34" fill="#FFE14D" stroke="#E0B81A" stroke-width="3"/><rect x="${392 + i*100}" y="500" width="8" height="40" fill="#9AA5B4"/><rect x="${420 + i*100}" y="506" width="12" height="30" rx="3" fill="#D9824A"/></g>`).join('')}` +
    `<g id="wires" stroke="#24324A" stroke-width="4" fill="none"></g>` +
    `<g id="led"><path d="M650 420 v60 M670 420 v60" stroke="#9AA5B4" stroke-width="4"/><path d="M640 420 q20 -60 40 0z" fill="#F4F7FB" stroke="#9AA5B4" stroke-width="3"/><circle id="ledGlow" cx="660" cy="400" r="40" fill="#FF7A45" opacity="0"/></g>`;
  EPISODES.push({ n:55, season:5, title:'Lemon Light', icon:'🍋', setting:"Evan's kitchen table",
    tip:'Kids use only tiny batteries for science. Never play with wall sockets or plugs.',
    grown:'Two different metals in an acid make a battery. A zinc nail and a copper coin in a lemon give about 0.9 volts. Four lemons joined in a row add up to about 3.6 volts, enough to light a small LED. Power P = V × I.',
    scene: lemonTable,
    setup(E){ E.evanSuit(false); E.evanSet(275, 955); },
    async run(E){
      E.evanSuit(false); E.evanSet(275, 955); E.aamaSet(830, 945);
      E.person('shivu', 95, 945);
      await E.say('title');
      await E.say('s_lemon');
      await E.say('e_how');
      await E.say('a_know');
      await E.say('e_truth');
      await E.say('a_metals');
      for(let i = 1; i <= 4; i++){
        await E.tap('lem' + (i - 1), i === 1 ? 'a_link' : (i === 4 ? 'c_onemore' : 'c_again'));
        E.sfx.snap();
        const x = 410 + (i-1)*100;
        E.node('wires').innerHTML += i < 4 ? `<path d="M${x + 16} 506 Q${x + 50} 470 ${x + 96} 500"/>` : `<path d="M${x + 16} 506 Q${x + 30} 440 650 480"/>`;
        E.node('ledGlow').setAttribute('opacity', [0, .1, .2, .35, .9][i]);
        await E.wait(250);
      }
      E.sfx.bell();
      await E.say('e_light');
      await E.say('s_four');
      await E.say('a_truth');
    }
  });

  /* ================= EPISODE 56 ================= */
  const hillside = () => `<rect id="skyBg" width="900" height="1000" fill="#9AA0A8"/><g id="smog"><rect width="900" height="560" fill="#7A7F86" opacity=".5"/></g>` +
    `<path d="M0 600 Q300 470 600 540 T900 520 V1000 H0Z" fill="#8C8F78"/><path id="hillG" d="M0 680 Q300 600 620 650 T900 640 V1000 H0Z" fill="#9A9A7C"/>` +
    `${[0,1,2].map(i => `<g id="tree${i}" style="display:none"><rect x="${445 + i*95}" y="560" width="14" height="70" fill="#7A5434"/><circle cx="${452 + i*95}" cy="540" r="40" fill="#3FA65A"/></g>`).join('')}` +
    `<g id="spots">${[0,1,2].map(i => `<ellipse cx="${452 + i*95}" cy="630" rx="30" ry="9" fill="#6B4A2E"/>`).join('')}</g>`;
  EPISODES.push({ n:56, season:5, title:'Trees That Clean the Air', icon:'🌳', setting:'A grey hillside',
    tip:'Plant with a grown-up, and wear gloves when you dig.',
    grown:'Trees take in carbon dioxide (CO₂) through their leaves and use sunlight to turn it into wood, roots and leaves. The carbon stays locked inside the tree for as long as it grows, which is why planting and protecting forests helps the air.',
    scene: hillside,
    setup(E){ E.evanSuit(false); E.evanSet(275, 955); },
    async run(E){
      E.evanSuit(false); E.evanSet(275, 955); E.aamaSet(820, 945);
      E.person('orion', 95, 945);
      await E.say('title');
      await E.say('o_grey');
      await E.say('e_cough');
      await E.say('a_know');
      await E.say('e_truth');
      await E.taps('spots', 3, 'a_plant', async i => { E.sfx.plop(); show(E, 'tree' + (i - 1)); fill(E, 'skyBg', ['#A3B4C4','#A9C6DE','#A9DBF7'][i-1]); E.node('smog').style.opacity = [.6, .3, 0][i-1]; fill(E, 'hillG', ['#8EA472','#79AE62','#6DB05A'][i-1]); await E.wait(400); });
      E.sfx.cheer();
      await E.say('o_blue');
      await E.say('e_breathe');
      await E.say('a_truth');
    }
  });

  /* ================= EPISODE 57 ================= */
  const raceTrack = () => cockpit(`<g id="lanes">${[0,1,2].map(i => `<path d="M380 ${335 + i*90} H840" stroke="#5B6B90" stroke-width="2" stroke-dasharray="10 10"/>`).join('')}<path d="M830 260 V520" stroke="#FFFFFF" stroke-width="6" stroke-dasharray="14 10"/>` +
    `<g id="rRocket"><path d="M400 280 h60 l26 18 l-26 18 h-60z" fill="#EEF2F7"/><path d="M400 280 l-16 -10 v56 l16 -10" fill="#E53935"/></g>` +
    `<g id="rPlane"><path d="M400 372 h76 l18 9 l-18 9 h-76z" fill="#C9D3E2"/><path d="M426 372 l16 -24 h12 l-8 24 M426 390 l16 24 h12 l-8 -24" fill="#9AA5B4"/></g>` +
    `<g id="rLight"><rect x="390" y="457" width="44" height="26" rx="8" fill="#FFD43B"/><path id="lightBeam" d="M436 470 H436" stroke="#FFF3A3" stroke-width="12" stroke-linecap="round"/></g></g>`, 57);
  EPISODES.push({ n:57, season:5, title:'Faster Than a Rocket?', icon:'💡', setting:"Aama's ship, deep space",
    tip:'Never look at a laser pointer, and never point one at people, pets or planes.',
    grown:'Light is the fastest thing in the universe: about 300,000 kilometers per second. Sunlight takes about 8 minutes 20 seconds to reach Earth, and light from the center of our galaxy takes about 26,000 years. Even at light speed, space is enormous.',
    scene: raceTrack,
    async run(E){
      crew(E);
      await E.say('title');
      await E.say('e_far');
      await E.say('a_race');
      await E.say('a_know');
      await E.say('e_truth');
      E.$('front').innerHTML = tray('pick', 380, 800, 300, 160, three(['pRocket', 'pPlane', 'pLight'], [
        `<path d="M8 50 h40 l20 12 l-20 12 h-40z" fill="#C9D3E2"/>${txt(38, 112, 'rocket', 16, '#24324A', 700)}`,
        `<path d="M8 56 h48 l12 6 l-12 6 h-48z" fill="#9AA5B4"/>${txt(38, 112, 'plane', 16, '#24324A', 700)}`,
        `<rect x="8" y="48" width="30" height="24" rx="6" fill="#FFD43B"/><path d="M40 60 H70" stroke="#FFE066" stroke-width="10" stroke-linecap="round"/>${txt(38, 112, 'light', 16, '#24324A', 700)}`]));
      await E.choice(['pRocket', 'pPlane', 'pLight'], 'pLight', 'a_guess');
      E.$('front').innerHTML = '';
      await E.say('s_go');
      E.sfx.whoosh();
      E.node('lightBeam').setAttribute('d', 'M436 470 H830');
      moveTo(E, 'rRocket', 150, 0, 2000); moveTo(E, 'rPlane', 70, 0, 2000);
      await E.wait(600);
      E.sfx.bell();
      await E.say('e_light');
      await E.say('a_sun');
      await E.say('a_truth');
    }
  });

  /* ================= EPISODE 58 ================= */
  const blackHole = () => cockpit(`<defs><radialGradient id="bhG"><stop offset=".35" stop-color="#000"/><stop offset=".5" stop-color="#FFB347"/><stop offset=".7" stop-color="#E05A2B" stop-opacity=".6"/><stop offset="1" stop-color="#0B1030" stop-opacity="0"/></radialGradient></defs>` +
    `<circle cx="600" cy="330" r="150" fill="url(#bhG)"/><g id="tub" style="display:none"><ellipse cx="560" cy="590" rx="150" ry="56" fill="#BFE0F5" stroke="#FFFFFF" stroke-width="10"/><circle cx="560" cy="590" r="10" fill="#3E4A66"/><g id="leaves">${[0,1,2,3].map(i => `<ellipse cx="${470 + i*55}" cy="${575 + (i%2)*25}" rx="12" ry="7" fill="#3FA65A"/>`).join('')}</g></g>` +
    `<g id="paths" style="display:none"><path d="M200 640 Q450 520 520 400" stroke="#E53935" stroke-width="7" stroke-dasharray="14 10" fill="none"/><path d="M200 640 Q260 420 380 260" stroke="#2FBF71" stroke-width="7" stroke-dasharray="14 10" fill="none"/></g>`, 58);
  EPISODES.push({ n:58, season:5, title:'The Black Hole Drain', icon:'🕳️', setting:'Near the center of the galaxy',
    tip:'A grown-up should always be nearby whenever there is bath water, even just a little.',
    grown:'A black hole packs so much mass into a small space that, inside its edge (the event horizon), not even light can escape. Sagittarius A*, at the center of our Milky Way, is about 4 million times the mass of the Sun. Swirling gas around it glows before it falls in.',
    scene: blackHole,
    async run(E){
      E.evanSuit(true); E.evanSet(275, 955); E.aamaSet(820, 945);
      E.person('kestrel', 95, 945, { img:'kestrelsp' });
      await E.say('title');
      await E.say('k_what');
      await E.say('a_bh');
      await E.say('a_know');
      await E.say('e_truth');
      show(E, 'tub');
      await E.tap('tub', 'a_plug');
      E.sfx.drain();
      const lv = E.node('leaves'); lv.style.transformBox = 'view-box'; lv.style.transformOrigin = '560px 590px';
      await E.anim(lv, [{transform:'rotate(0deg) scale(1)'},{transform:'rotate(540deg) scale(.1)'}], {duration:2200, fill:'forwards'});
      await E.say('k_swirl');
      hide(E, 'tub'); show(E, 'paths');
      E.$('front').innerHTML = tray('ways', 380, 800, 280, 160, two(['wClose', 'wFar'], [
        `<circle cx="70" cy="30" r="18" fill="#000" stroke="#FFB347" stroke-width="4"/><path d="M14 104 Q40 70 60 44" stroke="#E53935" stroke-width="6" stroke-dasharray="8 6" fill="none"/>${txt(30, 126, 'close', 14, '#24324A', 700)}`,
        `<circle cx="80" cy="30" r="14" fill="#000" stroke="#FFB347" stroke-width="4"/><path d="M14 104 Q16 60 40 30" stroke="#2FBF71" stroke-width="6" stroke-dasharray="8 6" fill="none"/>${txt(60, 126, 'far away', 14, '#24324A', 700)}`]));
      await E.choice(['wClose', 'wFar'], 'wFar', 'a_which');
      E.$('front').innerHTML = '';
      E.sfx.vroom();
      await E.say('e_safe');
      await E.say('a_truth');
    }
  });

  /* ================= EPISODE 59 ================= */
  const machineRoom = () => room(`<g id="machine"><rect x="390" y="300" width="300" height="420" rx="24" fill="#3E4A5C" stroke="#9AA5B4" stroke-width="6"/>` +
    `<rect x="420" y="330" width="240" height="90" rx="12" fill="#0E2A2E"/><text id="sum" x="540" y="392" font-family="Fredoka,sans-serif" font-size="48" font-weight="700" fill="#FF7A45" text-anchor="middle">1 + 1 = 3</text>` +
    `<g id="partIn"><rect x="420" y="450" width="70" height="90" rx="12" fill="#5D6B80"/>${txt(455, 500, 'IN', 20, '#E4EFFA', 700)}</g>` +
    `<g id="partGear"><rect x="505" y="450" width="70" height="90" rx="12" fill="#5D6B80"/><circle cx="540" cy="495" r="22" fill="none" stroke="#C9D3E2" stroke-width="7" stroke-dasharray="6 5"/><g id="sock"><path d="M548 470 h14 v26 l12 10 l-6 8 l-20 -12z" fill="#E53935"/></g></g>` +
    `<g id="partOut"><rect x="590" y="450" width="70" height="90" rx="12" fill="#5D6B80"/>${txt(625, 500, 'OUT', 20, '#E4EFFA', 700)}</g></g>`);
  EPISODES.push({ n:59, season:5, title:'Is 1 + 1 Still 2?', icon:'🧮', setting:'Frosty Moon, the Counting Machine',
    tip:'Machines get switched off and unplugged before anyone looks inside. That is a grown-up job.',
    grown:'First principles debugging: when a system gives a wrong answer, do not guess. Break it into parts, check each part against something you know is true, and the broken part shows itself. Engineers fix bridges, code and rockets this way.',
    scene: machineRoom,
    async run(E){
      E.evanSuit(true); E.evanSet(275, 955); E.aamaSet(820, 945);
      E.person('orion', 95, 945, { img:'orionsp' });
      await E.say('title');
      E.sfx.wrong();
      await E.say('o_wrong');
      await E.say('e_two');
      await E.say('a_know');
      await E.say('e_truth');
      await E.say('a_parts');
      await E.tap('partIn', 'a_check1');
      E.sfx.beep(); await E.say('e_ok1');
      await E.tap('partOut', 'a_check2');
      E.sfx.beep(); await E.say('e_ok2');
      await E.tap('partGear', 'a_check3');
      await E.say('o_sock');
      await moveTo(E, 'sock', 0, 300, 900);
      E.node('sum').textContent = '1 + 1 = 2'; fill(E, 'sum', '#5FF6FF'); E.sfx.cheer();
      await E.say('e_fixed');
      await E.say('a_truth');
    }
  });

  /* ================= EPISODE 60 ================= */
  const outpostEnd = () => room(style +
    `<g id="boxes">${[0,1,2,3,4,5].map(i => `<g id="mb${i}"><rect x="${400 + (i%3)*95}" y="${310 + Math.floor(i/3)*100}" width="80" height="80" rx="12" fill="${i%2 ? '#7D8794' : '#9C6B4E'}" stroke="#C9D3E2" stroke-width="3"/>${i%2 ? '' : `<path d="M${415 + (i%3)*95} ${330 + Math.floor(i/3)*100} l50 40 M${465 + (i%3)*95} ${330 + Math.floor(i/3)*100} l-50 40" stroke="#5A3A24" stroke-width="5"/>`}</g>`).join('')}</g>` +
    `<g id="tanksEnd">${[0,1].map(i => `<rect id="te${i}" x="${420 + i*130}" y="560" width="100" height="200" rx="14" fill="#7E8A6E"/>`).join('')}</g>` +
    `<g id="tanksBub" style="display:none">${bubbles(424, 740, 92, 5)}${bubbles(554, 740, 92, 5)}</g>` +
    `<g id="grid" style="display:none">${Array.from({length:12}, (_, i) => `<circle cx="${70 + (i%4)*50}" cy="${330 + Math.floor(i/4)*40}" r="5" fill="#FFF3A3"/>`).join('')}</g>` +
    `<g id="codeBox" style="display:none"><rect x="400" y="300" width="270" height="200" rx="16" fill="#F4F7FB" stroke="#9AA5B4" stroke-width="4"/>${txt(535, 340, 'Secret code', 22, '#2F6FD6', 700)}<text x="535" y="410" font-size="44" text-anchor="middle">⭐❤️🌙</text>${txt(535, 470, 'I love you', 20, '#24324A', 700)}</g>`);
  EPISODES.push({ n:60, season:5, title:'Clean Up Time', icon:'🧹', setting:'Frosty Moon, the outpost',
    tip:'Keep passwords secret, and share them only with your grown-up.',
    grown:'Computers have limited memory. Garbage collection finds memory that nothing uses anymore and frees it, so the system does not slow down or crash. Encryption scrambles a message with a key so only someone with the key can read it.',
    scene: outpostEnd,
    async run(E){
      E.evanSuit(true); E.evanSet(275, 955); E.aamaSet(820, 945);
      E.person('shivu', 95, 945, { img:'shivusp' });
      await E.say('title');
      await E.say('s_slow');
      await E.say('a_full');
      await E.say('a_know');
      await E.say('e_truth');
      let n = 0;
      for(const i of [0, 2, 4]){
        await E.tap('mb' + i, n ? 'c_again' : 'a_tidy');
        E.sfx.whoosh(); await E.anim(E.node('mb' + i), [{opacity:1},{opacity:0}], {duration:400, fill:'forwards'}); n++;
      }
      E.sfx.bell();
      await E.say('s_room');
      hide(E, 'boxes'); show(E, 'codeBox');
      await E.say('a_code');
      await E.tap('codeBox', 'a_send');
      E.sfx.beep(); hide(E, 'codeBox');
      E.$('front').innerHTML = screen('mc', 738, 262, 130, 160, [['dallu', .3066]], 'Call from Earth');
      await E.say('d_love');
      E.$('front').innerHTML = '';
      await E.say('a_restart');
      await E.tap('aama', 'a_tapme');
      E.sfx.vroom(); await E.wait(500);
      for(const c of ['#9CB86A', '#6FB45E', '#4FAF5E']){ fill(E, 'te0', c); fill(E, 'te1', c); await E.wait(400); }
      show(E, 'tanksBub'); show(E, 'grid'); E.sfx.cheer();
      await E.say('e_stars');
      await E.say('s_engineer');
      await E.say('a_truth');
    }
  });

  EPISODES.filter(e => e.season === 5 && ![54, 55, 56].includes(e.n)).forEach(e => { const prev = e.setup; e.setup = E => { E.evanSuit(true); E.evanSet(275, 955); if(prev) prev(E); }; });
})();
