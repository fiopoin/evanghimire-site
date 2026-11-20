/* Evan & Aama, Season 1: scenes and stories */
(function(){
  /* ---------- drawing helpers ---------- */
  const H = {
    wall(a, b, id){ return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="900" height="800" fill="url(#${id})"/>`; },
    floor(kind){
      const clip = `<clipPath id="flc"><rect y="800" width="900" height="200"/></clipPath>`;
      const persp = (stroke, op) => `<g clip-path="url(#flc)" stroke="${stroke}" stroke-width="2" opacity="${op}"><path d="M450 330 L-500 1000 M450 330 L-200 1000 M450 330 L100 1000 M450 330 L400 1000 M450 330 L700 1000 M450 330 L1000 1000 M450 330 L1300 1000 M450 330 L1600 1000"/><path d="M0 832H900M0 872H900M0 922H900M0 984H900"/></g>`;
      if(kind === 'wood') return `<defs>${clip}<linearGradient id="flw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8844F"/><stop offset="1" stop-color="#D2A06A"/></linearGradient></defs><rect y="800" width="900" height="200" fill="url(#flw)"/><g clip-path="url(#flc)" stroke="#A0703F" stroke-width="2" opacity=".6"><path d="M0 826H900M0 858H900M0 897H900M0 943H900M0 995H900"/><path d="M120 800v26M380 800v26M650 800v26M240 826v32M520 826v32M800 826v32M90 858v39M430 858v39M720 858v39M260 897v46M600 897v46M150 943v52M480 943v52M820 943v52"/></g>`;
      if(kind === 'carpet') return `<rect y="800" width="900" height="200" fill="#C9B79C"/><rect y="800" width="900" height="200" fill="#B8A483" opacity=".25"/>`;
      if(kind === 'grass') return `<defs>${clip}<linearGradient id="flg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7DBF5A"/><stop offset="1" stop-color="#5FA544"/></linearGradient></defs><rect y="780" width="900" height="220" fill="url(#flg)"/><g stroke="#4E8F38" stroke-width="3" stroke-linecap="round" opacity=".7">${Array.from({length:40},(_, i) => { const x = (i*47)%900 + 10, y = 820 + (i*37)%170; return `<path d="M${x} ${y} l-4 -12 M${x} ${y} l3 -14 M${x} ${y} l8 -10"/>`; }).join('')}</g>`;
      if(kind === 'concrete') return `<defs>${clip}</defs><rect y="800" width="900" height="200" fill="#BDBAB3"/>${persp('#A29E95', .7)}`;
      if(kind === 'porch') return `<rect y="800" width="900" height="200" fill="#A87B52"/><g stroke="#8C6440" stroke-width="3"><path d="M0 830H900M0 866H900M0 908H900M0 956H900"/></g>`;
      return `<defs>${clip}<linearGradient id="flt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D8C6A6"/><stop offset="1" stop-color="#E6D7BC"/></linearGradient></defs><rect y="800" width="900" height="200" fill="url(#flt)"/>${persp('#C3AE8B', .75)}`;
    },
    base(color){ return `<rect y="784" width="900" height="18" fill="${color || '#FFFFFF'}"/><rect y="800" width="900" height="6" fill="#000" opacity=".08"/>`; },
    window(x, y, w, h, night){
      const sky = night ? '#1E2A55' : '#A9DDF7';
      return `<rect x="${x-10}" y="${y-10}" width="${w+20}" height="${h+20}" rx="6" fill="#FFFFFF"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${sky}"/>` +
        (night ? `<circle cx="${x+w*.72}" cy="${y+h*.3}" r="${Math.min(w,h)*.12}" fill="#FFF3C4"/><g fill="#fff">${[[.2,.25],[.4,.6],[.15,.75],[.55,.2],[.85,.7]].map(p=>`<circle cx="${x+w*p[0]}" cy="${y+h*p[1]}" r="2.5"/>`).join('')}</g>`
               : `<g fill="#fff" opacity=".9"><circle cx="${x+w*.3}" cy="${y+h*.45}" r="${h*.1}"/><circle cx="${x+w*.4}" cy="${y+h*.4}" r="${h*.13}"/><circle cx="${x+w*.5}" cy="${y+h*.46}" r="${h*.09}"/></g>`) +
        `<path d="M${x+w/2} ${y}V${y+h}M${x} ${y+h/2}H${x+w}" stroke="#FFFFFF" stroke-width="8"/>`;
    },
    frame(x, y, w, h, c){ return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#7A4E2D"/><rect x="${x+8}" y="${y+8}" width="${w-16}" height="${h-16}" fill="${c || '#E9D8B4'}"/><path d="M${x+14} ${y+h-20} l${w*.3} -${h*.35} l${w*.2} ${h*.2} l${w*.25} -${h*.3} l${w*.12} ${h*.45}" fill="none" stroke="#6E9B6A" stroke-width="5"/>`; },
    plant(x, y, s){ s = s || 1; return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-28 0 L28 0 L22 46 L-22 46Z" fill="#D9A27A"/><g fill="#4F9A5A"><ellipse cx="-20" cy="-30" rx="14" ry="34" transform="rotate(-25 -20 -30)"/><ellipse cx="18" cy="-34" rx="14" ry="36" transform="rotate(22 18 -34)"/><ellipse cx="0" cy="-48" rx="13" ry="40"/></g></g>`; },
    rug(cx, cy, rx, ry, c){ return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${c}"/><ellipse cx="${cx}" cy="${cy}" rx="${rx-14}" ry="${ry-8}" fill="none" stroke="#fff" stroke-width="4" opacity=".5"/>`; },
    stool(cx, id){ return `<g ${id ? `id="${id}"` : ''}><ellipse cx="${cx}" cy="948" rx="72" ry="9" fill="#000" opacity=".1"/><path d="M${cx-56} 812 H${cx+56} L${cx+68} 944 H${cx-68}Z" fill="#62C49A"/><rect x="${cx-62}" y="798" width="124" height="20" rx="8" fill="#7FDCB3" stroke="#4FAE84" stroke-width="3"/><rect x="${cx-74}" y="868" width="148" height="18" rx="8" fill="#7FDCB3" stroke="#4FAE84" stroke-width="3"/></g>`; },
    door(x, y, w, h, c){ return `<rect x="${x-10}" y="${y-10}" width="${w+20}" height="${h+10}" fill="#FFFFFF"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/><rect x="${x+16}" y="${y+18}" width="${w-32}" height="${h*.38}" rx="4" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="5"/><rect x="${x+16}" y="${y+h*.5}" width="${w-32}" height="${h*.42}" rx="4" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="5"/><circle cx="${x+w-22}" cy="${y+h*.5}" r="8" fill="#D6B46A"/>`; },
    sky(night){ return `<defs><linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${night ? '#1A2350' : '#7EC8F2'}"/><stop offset="1" stop-color="${night ? '#33407A' : '#CDEBFA'}"/></linearGradient></defs><rect width="900" height="820" fill="url(#skyg)"/>`; },
    clouds(){ return `<g fill="#fff" opacity=".9"><g transform="translate(160 230)"><circle r="34"/><circle cx="36" cy="-12" r="42"/><circle cx="76" r="32"/><rect x="0" y="0" width="80" height="30"/></g><g transform="translate(640 170)"><circle r="26"/><circle cx="30" cy="-10" r="34"/><circle cx="62" r="26"/></g></g><circle cx="790" cy="300" r="46" fill="#FFE27A"/>`; },
    tool(kind, id, x, y, s){
      s = s || 1;
      const t = {
        hammer: `<rect x="-6" y="-10" width="12" height="110" rx="5" fill="#B9844F"/><rect x="-42" y="-30" width="84" height="30" rx="6" fill="#7D8794"/><path d="M42 -30 q22 8 14 30 h-14z" fill="#7D8794"/>`,
        plunger: `<rect x="-6" y="-80" width="12" height="120" rx="5" fill="#C9935C"/><path d="M-38 70 Q-40 30 0 30 Q40 30 38 70 Z" fill="#D9342B"/><rect x="-40" y="66" width="80" height="8" rx="4" fill="#B02820"/>`,
        brush: `<rect x="-7" y="-20" width="14" height="80" rx="6" fill="#3D7FD6"/><rect x="-14" y="56" width="28" height="18" fill="#B8BEC8"/><path d="M-14 74 h28 l-4 34 h-20z" fill="#F2C35B"/>`,
        pump: `<rect x="-20" y="10" width="40" height="110" rx="10" fill="#2F6FD6"/><rect x="-5" y="-50" width="10" height="64" fill="#9AA5B4"/><rect x="-36" y="-60" width="72" height="16" rx="8" fill="#1E3A6E"/><rect x="-46" y="116" width="92" height="12" rx="6" fill="#1E3A6E"/>`,
        screwdriver: `<rect x="-12" y="-40" width="24" height="70" rx="10" fill="#F2A13A"/><rect x="-4" y="28" width="8" height="70" fill="#9AA5B4"/><path d="M-4 96 h8 l-2 10 h-4z" fill="#7D8794"/>`
      }[kind];
      return `<g id="${id}"><g transform="translate(${x} ${y}) scale(${s})">${t}</g></g>`;
    }
  };

  /* ---------- reusable drip for episode 1 ---------- */
  const DROP = 'M0,-11 C5.5,-2 8,4 8,7 A8,8 0 0 1 -8,7 C-8,4 -5.5,-2 0,-11Z';
  function drop(E, x, y, dy, ms, parent){
    const g = E.el('g', { transform:`translate(${x} ${y})` }, parent || E.$('drops'));
    const p = E.el('path', { d:DROP, fill:'#4FC0FF' }, g);
    p.style.transformBox = 'fill-box'; p.style.transformOrigin = '50% 0';
    return E.anim(p, [{transform:'translateY(0px) scale(.5)'},{transform:'translateY(0px) scale(1)', offset:.3},{transform:`translateY(${dy}px) scale(1)`}], {duration:ms, easing:'ease-in'}).then(() => g.remove());
  }
  function scale(E, id, s){ const n = E.node(id); n.style.transformBox = 'fill-box'; n.style.transformOrigin = 'center'; n.style.transition = 'transform .5s'; n.style.transform = `scale(${s})`; }
  function moveTo(E, id, dx, dy, ms){ const n = E.node(id); n.style.transition = `transform ${ms||800}ms ease-in-out`; n.style.transform = `translate(${dx}px,${dy}px)`; return E.wait(ms || 800); }

  const EPISODES = [];

  /* ================= EPISODE 1 ================= */
  EPISODES.push({ n:1, title:'Drip, Drip, Stop!', icon:'💧', setting:"Evan's bathroom",
    tip:'When you finish washing your hands, turn the tap all the way off.',
    outro:['d_super'], tipKey:'d_tip',
    scene: () => window.SCENE1,
    async run(E){
      let dripping = true, n = 0, puddle = .4;
      E.node('puddle').style.transform = 'scale(.4)';
      const tick = () => {
        if(!dripping) return; n++;
        drop(E, 532, 482, 48, 760).then(() => {
          if(!dripping) return; E.sfx.drip();
          E.anim(E.node('ripple'), [{opacity:1, transform:'scale(.4)'},{opacity:0, transform:'scale(1.6)'}], {duration:500});
          E.node('counterWet').style.transform = `scale(${Math.min(1, .4 + n*.08)})`;
          if(n % 2 === 0) drop(E, 620, 572, 318, 900).then(() => { if(!dripping) return; E.sfx.plop(); puddle = Math.min(1, puddle + .1); E.node('puddle').style.transform = `scale(${puddle})`; });
        });
      };
      tick(); E.every(1300, tick);
      await E.say('d_title');
      await E.say('e_noise');
      await E.tap('aama', 'd_tapme');
      await E.aamaTo(704, 795);
      E.scan({cx:482, cy:470, w:130, h:110});
      await E.say('d_scan'); E.scanOff();
      await E.aamaTo(714, 905);
      E.scan('puddle'); await E.say('e_puddle'); E.scanOff();
      await E.aamaTo(764, 915);
      await E.say('d_which');
      await Promise.all([E.say('e_climb'), (async () => { await E.evanTo(230, 955, 1000, true); E.sfx.hop(); await E.evanTo(230, 880, 300); E.sfx.hop(); await E.evanTo(230, 805, 300); })()]);
      await E.tap('handle', 'd_taphandle', { arrow:'<path d="M392 467 A55 55 0 0 1 488 467" fill="none" stroke="#FF8A3D" stroke-width="10" stroke-linecap="round"/><polygon points="500,488 500,458 476,472" fill="#FF8A3D"/>' });
      E.evanLean(7);
      E.node('handle').style.transform = 'rotate(65deg)'; E.sfx.squeak();
      await Promise.all([E.say('e_righty'), E.wait(450).then(() => { dripping = false; })]);
      await E.wait(500); E.evanLean(0);
      await E.say('e_stopped');
      await E.say('d_wipe');
      await Promise.all([E.say('e_towel'), (async () => { E.sfx.hop(); await E.evanTo(230, 880, 300); E.sfx.hop(); await E.evanTo(230, 955, 300); await E.evanTo(190, 955, 600, true); })()]);
      E.evanLean(-6); await E.wait(500);
      E.node('barTowel').style.display = 'none';
      E.evanHold('<path d="M88 -185 H132 V-63 Q132 -55 124 -55 H96 Q88 -55 88 -63Z" fill="#5FB6A8"/><rect x="88" y="-93" width="44" height="10" fill="#BFE6DF"/><rect x="88" y="-185" width="44" height="16" fill="#4FA597"/>');
      E.sfx.wipe(); E.evanLean(0); await E.wait(400);
      await E.evanTo(460, 955, 1500, true);
      await E.aamaTo(744, 855);
      const p0 = puddle;
      const keys = ['d_tappuddle', 'd_again', 'd_onemore'];
      for(let i = 1; i <= 3; i++){
        await E.tap('puddle', keys[i-1]);
        E.$('evanWalk').classList.add('sway'); E.sfx.wipe(); setTimeout(E.sfx.wipe, 450);
        await E.wait(950); E.$('evanWalk').classList.remove('sway');
        E.node('puddle').style.transform = `scale(${Math.max(.01, p0 * (1 - i/3))})`;
        if(i === 3) E.node('puddle').style.opacity = 0;
      }
      E.node('counterWet').style.transform = 'scale(0.01)';
      E.node('sparkles').style.display = '';
      await E.say('e_dry');
      E.evanHold(null); E.node('barTowel').style.display = '';
    }
  });

  /* ================= EPISODE 2 ================= */
  const kitchen = (extra) => H.wall('#F6EBDA', '#EBDCC4', 'kw') +
    `<defs><pattern id="bs" width="48" height="24" patternUnits="userSpaceOnUse"><rect width="48" height="24" fill="#FAFAF7"/><path d="M0 23.5H48M0.5 0V12M24.5 12V24M0 11.5H48" stroke="#D9DEE2" stroke-width="2"/></pattern></defs>` +
    `<rect x="140" y="400" width="650" height="160" fill="url(#bs)"/>` +
    `<rect x="140" y="160" width="190" height="210" rx="6" fill="#FFFFFF" stroke="#D7D0C2" stroke-width="4"/><rect x="600" y="160" width="190" height="210" rx="6" fill="#FFFFFF" stroke="#D7D0C2" stroke-width="4"/><path d="M235 160V370M695 160V370" stroke="#D7D0C2" stroke-width="4"/><circle cx="222" cy="340" r="6" fill="#B9A27A"/><circle cx="248" cy="340" r="6" fill="#B9A27A"/><circle cx="682" cy="340" r="6" fill="#B9A27A"/><circle cx="708" cy="340" r="6" fill="#B9A27A"/>` +
    H.window(385, 190, 170, 170) +
    `<rect x="805" y="230" width="95" height="570" rx="8" fill="#DCE1E7" stroke="#B9C1CB" stroke-width="4"/><path d="M805 430H900" stroke="#B9C1CB" stroke-width="4"/><rect x="815" y="300" width="8" height="90" rx="4" fill="#8E99A8"/><rect x="815" y="460" width="8" height="120" rx="4" fill="#8E99A8"/>` +
    H.floor('wood') + H.base('#E8E2D6') +
    `<rect x="150" y="560" width="630" height="230" fill="#9DB8A4"/><g fill="none" stroke="#7F9B87" stroke-width="5"><rect x="165" y="580" width="140" height="190" rx="5"/><rect x="320" y="580" width="140" height="190" rx="5"/><rect x="475" y="580" width="140" height="190" rx="5"/><rect x="630" y="580" width="140" height="190" rx="5"/></g><g fill="#D6B46A"><circle cx="290" cy="670" r="6"/><circle cx="335" cy="670" r="6"/><circle cx="600" cy="670" r="6"/><circle cx="645" cy="670" r="6"/></g><rect x="160" y="776" width="610" height="14" fill="#6E8775"/>` +
    `<path d="M136 556 L146 522 H784 L794 556Z" fill="#EDE8DE"/><rect x="132" y="552" width="666" height="16" rx="3" fill="#D3CCBE"/>` +
    `<ellipse cx="480" cy="537" rx="92" ry="12" fill="#C9D6DE" stroke="#AFBEC9" stroke-width="3"/>` + (extra || '') +
    `<rect x="468" y="456" width="22" height="80" rx="6" fill="#C9D3E2" stroke="#8A9AB5" stroke-width="3"/><path d="M479 460 Q479 420 520 420 Q545 420 545 450 V468" fill="none" stroke="#8A9AB5" stroke-width="16" stroke-linecap="round"/><path d="M479 460 Q479 420 520 420 Q545 420 545 450 V468" fill="none" stroke="#F1F5FA" stroke-width="9" stroke-linecap="round"/>`;
  EPISODES.push({ n:2, title:'The Grumpy Sink', icon:'🚰', setting:"Kestrel's kitchen",
    tip:'Food goes in the bin, not down the sink.',
    scene: () => kitchen(`<ellipse id="water" cx="480" cy="535" rx="84" ry="9" fill="#93AFA6"/><g fill="#C7A36A"><circle cx="455" cy="534" r="5"/><circle cx="500" cy="536" r="4"/><circle cx="478" cy="532" r="3"/></g>`) +
      H.stool(330, 'stool') +
      H.tool('hammer', 'tHammer', 210, 470, .9) + H.tool('plunger', 'tPlunger', 305, 450, .9) + H.tool('brush', 'tBrush', 385, 430, .9),
    async run(E){
      E.cast(['kestrel']);
      await E.say('title');
      await E.say('k_help');
      await E.say('e_help');
      await E.tap('aama', 'a_tapme');
      await E.aamaTo(700, 800);
      E.scan('water'); await E.say('a_scan'); E.scanOff();
      await E.say('k_what');
      await E.aamaTo(760, 915);
      await E.choice(['tHammer','tPlunger','tBrush'], 'tPlunger', 'a_which');
      await E.say('e_plunger');
      await moveTo(E, 'tPlunger', 170, 2, 900);
      await E.evanTo(330, 955, 900, true);
      E.sfx.hop(); await E.evanTo(330, 880, 300);
      E.sfx.hop(); await E.evanTo(330, 805, 300);
      E.evanLean(6);
      await E.say('e_push');
      const pl = E.node('tPlunger');
      let level = 1;
      await E.taps('tPlunger', 3, 'a_plunge', async () => {
        E.sfx.glug();
        pl.style.transition = 'transform .25s'; pl.style.transform = 'translate(170px,22px)';
        await E.wait(260); pl.style.transform = 'translate(170px,2px)';
        level -= .3; scale(E, 'water', Math.max(.08, level));
      });
      E.sfx.drain(); scale(E, 'water', .01); await E.wait(900);
      E.evanLean(0);
      await moveTo(E, 'tPlunger', 0, 0, 600);
      await E.say('k_yay');
    }
  });

  /* ================= EPISODE 3 ================= */
  EPISODES.push({ n:3, title:"The Toilet Won't Stop Running", icon:'🚽', setting:"Shivu's bathroom",
    tip:'If water keeps running, tell a grown-up.',
    scene: () => H.wall('#EAF2F4', '#DCE9EE', 'w3') +
      `<defs><pattern id="sub3" width="64" height="64" patternUnits="userSpaceOnUse"><rect width="64" height="64" fill="#FBFBF8"/><path d="M0 31.5H64M0 63.5H64M0.5 0V32M32.5 32V64" stroke="#D9DEE2" stroke-width="2.5"/></pattern></defs><rect y="470" width="900" height="330" fill="url(#sub3)"/><rect y="460" width="900" height="14" fill="#fff"/>` +
      H.window(640, 170, 170, 200) + H.frame(110, 200, 150, 120, '#D7ECF2') + H.floor('tile') + H.base() +
      `<rect x="40" y="430" width="150" height="10" rx="5" fill="#B8C1CC"/><path d="M55 436 H175 V600 Q175 610 165 610 H65 Q55 610 55 600Z" fill="#E9A15F"/>` +
      `<g id="toilet"><rect id="tank" x="470" y="500" width="190" height="150" rx="16" fill="#FFFFFF" stroke="#C3CED8" stroke-width="5"/><rect x="460" y="488" width="210" height="22" rx="10" fill="#F4F7FA" stroke="#C3CED8" stroke-width="4"/>` +
      `<g id="flush"><rect x="476" y="528" width="44" height="14" rx="7" fill="#B8C4D6" stroke="#8A9AB5" stroke-width="3"/><circle cx="482" cy="535" r="10" fill="#D7DEE9" stroke="#8A9AB5" stroke-width="3"/></g>` +
      `<path d="M500 650 H630 L612 760 Q610 790 565 795 Q520 790 518 760 Z" fill="#FFFFFF" stroke="#C3CED8" stroke-width="5"/>` +
      `<ellipse cx="565" cy="672" rx="128" ry="34" fill="#FFFFFF" stroke="#C3CED8" stroke-width="5"/><ellipse cx="565" cy="676" rx="96" ry="22" fill="#D7EEF8"/>` +
      `<g id="runlines" stroke="#69C3EA" stroke-width="4" stroke-linecap="round" fill="none"><path d="M520 676 q15 -6 30 0 t30 0"/><path d="M540 684 q15 -6 30 0 t30 0"/></g></g>` +
      `<g id="cutaway" style="display:none"><rect x="490" y="512" width="150" height="126" rx="10" fill="#BEE7F7" opacity=".95"/><path d="M500 560 H630" stroke="#69C3EA" stroke-width="4"/><path d="M520 540 L560 600" stroke="#7D8794" stroke-width="6"/><circle cx="560" cy="610" r="14" fill="#E0585B"/><text x="565" y="530" font-size="20" text-anchor="middle" fill="#2E6B85" font-family="Fredoka,sans-serif">stuck!</text></g>` +
      `<rect x="250" y="900" width="200" height="30" rx="14" fill="#B7D3E8" opacity=".9"/>`,
    async run(E){
      E.cast(['shivu']);
      const stopHiss = E.loop(3200, .04);
      const rl = E.node('runlines'); const a = rl.animate([{transform:'translateX(-10px)'},{transform:'translateX(10px)'}], {duration:400, iterations:Infinity, direction:'alternate'});
      await E.say('title');
      await E.say('s_hear');
      await E.say('e_broken');
      await E.tap('aama', 'a_tapme');
      await E.aamaTo(740, 820);
      E.node('cutaway').style.display = '';
      E.scan('tank'); await E.say('a_scan'); E.scanOff();
      E.node('cutaway').style.display = 'none';
      await E.aamaTo(770, 935);
      await E.say('s_try');
      await E.say('e_yes');
      await E.evanTo(360, 955, 900, true);
      await E.tap('flush', 'a_jiggle');
      E.evanLean(7);
      const f = E.node('flush'); f.style.transformBox = 'fill-box'; f.style.transformOrigin = '10% 50%';
      await E.anim(f, [{transform:'rotate(0)'},{transform:'rotate(-25deg)'},{transform:'rotate(15deg)'},{transform:'rotate(-10deg)'},{transform:'rotate(0)'}], {duration:700});
      E.sfx.snap(); stopHiss(); a.cancel(); rl.style.display = 'none';
      E.evanLean(0); await E.wait(500);
      await E.say('e_stopped');
      await E.say('s_you');
    }
  });

  /* ================= EPISODE 4 ================= */
  EPISODES.push({ n:4, title:'The Splashy Garden Hose', icon:'🌻', setting:"Ruby's backyard",
    tip:'Righty tighty, lefty loosey.',
    scene: () => H.sky() + H.clouds() +
      `<rect x="0" y="140" width="640" height="660" fill="#E8D7BF"/><g stroke="#D3BFA3" stroke-width="3">${Array.from({length:16},(_, i)=>`<path d="M0 ${180+i*40}H640"/>`).join('')}</g><rect x="0" y="120" width="660" height="30" fill="#8A5A3C"/>` +
      H.window(90, 260, 170, 150) + `<rect x="640" y="560" width="260" height="240" fill="#C79A6B"/><g stroke="#A97E52" stroke-width="6">${[660,700,740,780,820,860].map(x=>`<path d="M${x} 560V800"/>`).join('')}</g>` +
      H.floor('grass') +
      `<g><rect x="700" y="730" width="180" height="70" rx="10" fill="#8B5E3C"/><g>${[[720,700,'#FF6B8A'],[760,690,'#FFC93C'],[800,705,'#FF8A3D'],[840,692,'#B072FF']].map(f=>`<path d="M${f[0]} 735 V${f[1]+10}" stroke="#4F9A5A" stroke-width="5"/><circle cx="${f[0]}" cy="${f[1]}" r="14" fill="${f[2]}"/><circle cx="${f[0]}" cy="${f[1]}" r="5" fill="#FFF2B0"/>`).join('')}</g></g>` +
      `<rect x="500" y="560" width="30" height="16" rx="4" fill="#9AA5B4"/><rect x="510" y="548" width="22" height="12" fill="#B8C4D6"/><circle cx="521" cy="540" r="14" fill="#E0585B"/>` +
      `<g id="conn"><rect x="520" y="572" width="34" height="40" rx="6" fill="#4CAF50" stroke="#2E7D32" stroke-width="3"/><path d="M524 584h26M524 596h26" stroke="#2E7D32" stroke-width="3"/></g>` +
      `<path d="M537 612 C540 700 470 760 420 820 C360 900 520 940 640 900 C720 875 760 850 700 820" fill="none" stroke="#3E9E48" stroke-width="16" stroke-linecap="round"/>` +
      `<g id="spray"></g>`,
    async run(E){
      E.cast(['ruby']);
      let spraying = true;
      const stopLoop = E.loop(4200, .05);
      const sp = E.node('spray');
      const puff = () => {
        if(!spraying) return;
        for(let i=0;i<5;i++){
          const c = E.el('circle', { cx:554, cy:590 + Math.random()*16, r:3 + Math.random()*4, fill:'#7CCBFF' }, sp);
          const dx = 60 + Math.random()*160, dy = -80 + Math.random()*180;
          E.anim(c, [{transform:'translate(0,0)', opacity:1},{transform:`translate(${dx}px,${dy}px)`, opacity:0}], {duration:700}).then(() => c.remove());
        }
      };
      E.every(120, puff);
      await E.say('title');
      await E.say('r_help');
      E.anim(E.$('evanWalk'), [{transform:'translateX(0)'},{transform:'translateX(-12px)'},{transform:'translateX(12px)'},{transform:'translateX(0)'}], {duration:400});
      await E.say('e_wet');
      await E.tap('aama', 'a_tapme');
      await E.aamaTo(720, 820);
      E.scan('conn'); await E.say('a_scan'); E.scanOff();
      await E.aamaTo(780, 930);
      await E.say('r_how');
      await E.evanTo(410, 955, 900, true);
      E.evanLean(6);
      const c = E.node('conn'); c.style.transformBox = 'fill-box'; c.style.transformOrigin = 'center';
      await E.taps('conn', 2, 'a_twist', async (i) => {
        E.sfx.snap();
        await E.anim(c, [{transform:'rotate(0)'},{transform:'rotate(90deg)'},{transform:'rotate(0)'}], {duration:500});
        if(i === 2){ spraying = false; stopLoop(); E.sfx.squeak(); }
      });
      E.evanLean(0);
      await E.say('r_yay');
      await E.say('e_team');
    }
  });

  /* ================= EPISODE 5 ================= */
  EPISODES.push({ n:5, title:'Lights Out!', icon:'💡', setting:"Evan's bedroom at night",
    tip:'Always ask a grown-up before touching a light bulb.',
    scene: () => H.wall('#3F4E86', '#36437A', 'w5') + H.window(80, 170, 200, 220, true) +
      `<g fill="#FFE27A" opacity=".8">${[[380,200],[460,150],[600,230],[700,170],[820,260]].map(p=>`<path d="M${p[0]} ${p[1]-10} l3 7 l8 1 l-6 5 l2 8 l-7 -4 l-7 4 l2 -8 l-6 -5 l8 -1z"/>`).join('')}</g>` +
      H.floor('carpet') + H.base('#2F3A66') +
      `<g><rect x="20" y="600" width="300" height="200" rx="14" fill="#5C7FD6"/><rect x="20" y="560" width="70" height="240" rx="10" fill="#7A5A3C"/><rect x="40" y="610" width="120" height="50" rx="20" fill="#FFFFFF"/><rect x="20" y="660" width="300" height="140" rx="10" fill="#7FA7F0"/></g>` +
      `<rect x="470" y="660" width="170" height="140" rx="8" fill="#8B6440"/><rect x="460" y="648" width="190" height="20" rx="6" fill="#A57A50"/><circle cx="555" cy="730" r="7" fill="#D6B46A"/>` +
      `<g id="lamp"><rect x="548" y="560" width="14" height="90" fill="#C9C2B4"/><ellipse cx="555" cy="648" rx="40" ry="8" fill="#9C9384"/><path d="M505 560 L605 560 L585 490 L525 490Z" fill="#F5E6C8" stroke="#D8C7A4" stroke-width="3"/></g>` +
      `<circle id="bulb" cx="555" cy="575" r="16" fill="#9A9488"/>` +
      `<g id="lampGlow" style="display:none"><circle cx="555" cy="560" r="160" fill="#FFE9A3" opacity=".35"/><circle id="bulbOn" cx="555" cy="575" r="16" fill="#FFF4BF"/></g>` +
      `<g id="switch"><rect x="700" y="470" width="44" height="70" rx="6" fill="#F2F2F2" stroke="#BFC5CE" stroke-width="3"/><rect id="toggle" x="714" y="482" width="16" height="22" rx="4" fill="#C9CED6"/></g>` +
      `<g id="bulbs" style="display:none"><rect x="320" y="880" width="220" height="70" rx="16" fill="#FFFFFF" opacity=".9"/><g id="bulbOld"><circle cx="380" cy="905" r="20" fill="#6E6A62"/><rect x="371" y="922" width="18" height="16" fill="#9AA5B4"/></g><g id="bulbNew"><circle cx="480" cy="905" r="20" fill="#FFF7D1" stroke="#FFD43B" stroke-width="3"/><rect x="471" y="922" width="18" height="16" fill="#C9D3E2"/><path d="M460 885 l-8 -8 M500 885 l8 -8 M480 878 v-10" stroke="#FFD43B" stroke-width="3"/></g></g>`,
    setup(E){ E.$('front').innerHTML = '<rect id="dark" width="900" height="1000" fill="#0A1030" opacity="0" pointer-events="none"/>'; E.node('lampGlow').style.display = ''; },
    async run(E){
      await E.say('title');
      E.sfx.pop(); E.node('lampGlow').style.display = 'none'; E.node('dark').style.transition = 'opacity .4s'; E.node('dark').setAttribute('opacity', '.45');
      await E.wait(500);
      await E.say('e_dark');
      await E.tap('aama', 'a_glow');
      await E.aamaTo(700, 880);
      E.scan('bulb'); await E.say('a_scan'); E.scanOff();
      await E.say('e_fix');
      E.person('baba', 380, 862, { scale:.92, fade:true });
      E.node('bulbs').style.display = '';
      await E.choice(['bulbOld','bulbNew'], 'bulbNew', 'a_grownup');
      await moveTo(E, 'bulbNew', 75, -330, 1000);
      E.node('bulbNew').style.display = 'none';
      await E.say('dad_swap');
      await E.personOut('baba');
      await E.evanTo(560, 955, 1100, true);
      await E.tap('switch', 'a_switch');
      E.evanLean(6); E.sfx.click();
      E.node('toggle').setAttribute('y', '510'); E.node('toggle').setAttribute('fill', '#2FBF71');
      E.node('lampGlow').style.display = ''; E.node('dark').setAttribute('opacity', '0');
      await E.wait(500); E.evanLean(0);
      await E.say('e_light');
    }
  });

  /* ================= EPISODE 6 ================= */
  EPISODES.push({ n:6, title:'The Sleepy Toy', icon:'🔋', setting:"Arjun's playroom",
    tip:'Old batteries go to a grown-up, never in your mouth.',
    scene: () => H.wall('#FFF1D9', '#FBE3BE', 'w6') +
      `<g>${'ABCDEFG'.split('').map((l,i)=>`<rect x="${70+i*110}" y="120" width="70" height="70" rx="12" fill="${['#FF8A80','#FFD180','#A7FFEB','#80D8FF','#B388FF','#CCFF90','#FF80AB'][i]}"/><text x="${105+i*110}" y="170" font-size="44" font-weight="700" text-anchor="middle" fill="#fff" font-family="Fredoka,sans-serif">${l}</text>`).join('')}</g>` +
      `<rect x="80" y="400" width="300" height="16" fill="#C9935C"/><rect x="80" y="540" width="300" height="16" fill="#C9935C"/><rect x="110" y="350" width="50" height="50" rx="8" fill="#5C9CE6"/><circle cx="215" cy="378" r="24" fill="#FF8A3D"/><rect x="260" y="356" width="80" height="44" rx="6" fill="#A5D66F"/><rect x="120" y="480" width="40" height="60" rx="6" fill="#E57373"/><path d="M200 540 l40 -60 l40 60z" fill="#FFD54F"/>` +
      H.window(560, 230, 220, 180) + H.floor('wood') + H.base('#F2D7AE') +
      H.rug(460, 900, 300, 60, '#8FC9E8') +
      `<g id="car"><rect x="380" y="840" width="180" height="56" rx="18" fill="#E53935"/><path d="M410 840 Q430 800 470 800 H500 Q530 800 545 840Z" fill="#EF5350"/><rect x="440" y="810" width="40" height="26" rx="6" fill="#B3E5FC"/><circle cx="420" cy="900" r="22" fill="#263238"/><circle cx="520" cy="900" r="22" fill="#263238"/><circle cx="420" cy="900" r="8" fill="#B0BEC5"/><circle cx="520" cy="900" r="8" fill="#B0BEC5"/><rect x="455" y="858" width="50" height="26" rx="4" fill="#C62828"/></g>` +
      `<g id="tray" style="display:none"><rect x="300" y="560" width="320" height="200" rx="22" fill="#FFFFFF" stroke="#E0D3BC" stroke-width="5"/><text x="460" y="596" font-size="22" text-anchor="middle" fill="#7A879C" font-family="Fredoka,sans-serif">Battery spot</text>` +
      `<rect x="330" y="606" width="260" height="46" rx="10" fill="#ECEFF1" stroke="#90A4AE" stroke-width="3" stroke-dasharray="8 6"/><text x="352" y="640" font-size="30" font-weight="700" fill="#2E7D32" font-family="Fredoka,sans-serif">+</text><text x="566" y="640" font-size="30" font-weight="700" fill="#C62828" font-family="Fredoka,sans-serif">−</text>` +
      `<g id="batA"><rect x="340" y="682" width="110" height="40" rx="8" fill="#2F6FD6"/><rect x="330" y="692" width="12" height="20" rx="3" fill="#B0BEC5"/><rect x="340" y="682" width="30" height="40" rx="8" fill="#FFC107"/><text x="355" y="709" font-size="22" font-weight="700" text-anchor="middle" fill="#fff" font-family="Fredoka,sans-serif">+</text></g>` +
      `<g id="batB"><rect x="480" y="682" width="110" height="40" rx="8" fill="#2F6FD6"/><rect x="588" y="692" width="12" height="20" rx="3" fill="#B0BEC5"/><rect x="560" y="682" width="30" height="40" rx="8" fill="#FFC107"/><text x="575" y="709" font-size="22" font-weight="700" text-anchor="middle" fill="#fff" font-family="Fredoka,sans-serif">+</text></g></g>`,
    async run(E){
      E.cast(['arjun']);
      await E.say('title');
      await Promise.all([E.say('ar_toy'), E.anim(E.node('car'), [{transform:'translateX(0)'},{transform:'translateX(8px)'},{transform:'translateX(-8px)'},{transform:'translateX(0)'}], {duration:400, iterations:2})]);
      await E.say('e_sleepy');
      await E.tap('aama', 'a_tapme');
      await E.aamaTo(700, 900);
      E.scan('car'); await E.say('a_scan'); E.scanOff();
      await E.say('ar_hungry');
      E.node('tray').style.display = '';
      await E.choice(['batA','batB'], 'batA', 'a_which');
      await moveTo(E, 'batA', 0, -76, 600); E.sfx.snap();
      await E.wait(400);
      E.node('tray').style.display = 'none';
      E.sfx.vroom();
      await E.anim(E.node('car'), [{transform:'translateX(0)'},{transform:'translateX(240px)'},{transform:'translateX(-120px)'},{transform:'translateX(0)'}], {duration:1800, easing:'ease-in-out'});
      await E.say('ar_yay');
      await E.say('e_vroom');
    }
  });

  /* ================= EPISODE 7 ================= */
  EPISODES.push({ n:7, title:'Click Goes the Switch', icon:'🔌', setting:"Orion and Kestrel's hallway",
    tip:'Switch lights off when you leave the room.', outro:['a_super'],
    scene: () => H.wall('#EFE6D6', '#E2D6C1', 'w7') +
      `<rect x="0" y="0" width="900" height="70" fill="#F7F2E8"/>` +
      `<g id="ceilLight"><rect x="430" y="70" width="40" height="14" fill="#B9A27A"/><path d="M400 84 H500 L480 130 H420Z" fill="#F4EBD6" stroke="#D8C7A4" stroke-width="3"/></g>` +
      `<g id="lightOn" style="display:none"><ellipse cx="450" cy="150" rx="260" ry="120" fill="#FFF2B8" opacity=".45"/><path d="M420 130 H480 L560 600 H340Z" fill="#FFF6D0" opacity=".3"/></g>` +
      H.door(80, 330, 150, 470, '#C69C6D') + H.door(720, 330, 150, 470, '#C69C6D') + H.frame(300, 300, 140, 110) + H.frame(580, 260, 100, 140, '#D7ECF2') +
      `<path id="wire" d="M582 520 V250 Q582 200 532 180 L470 110" fill="none" stroke="#FFC400" stroke-width="10" stroke-dasharray="18 14" stroke-linecap="round" style="display:none"/>` +
      `<g id="switch"><rect x="560" y="500" width="44" height="70" rx="6" fill="#FAFAFA" stroke="#BFC5CE" stroke-width="3"/><rect id="toggle" x="574" y="540" width="16" height="22" rx="4" fill="#C9CED6"/></g>` +
      H.floor('wood') + H.base('#F7F2E8') + `<rect x="240" y="840" width="440" height="110" rx="12" fill="#B5544A"/><rect x="258" y="854" width="404" height="82" rx="8" fill="none" stroke="#F2D7AE" stroke-width="4"/>`,
    setup(E){ E.$('front').innerHTML = '<rect id="dim" width="900" height="1000" fill="#1A1E33" opacity=".25" pointer-events="none" style="transition:opacity .3s"/>'; },
    async run(E){
      E.cast(['kestrel','orion']);
      await E.say('title');
      await E.say('k_how');
      await E.say('e_dunno');
      await E.tap('aama', 'a_tapme');
      await E.aamaTo(730, 880);
      E.scan('switch');
      const w = E.node('wire'); w.style.display = '';
      const wa = w.animate([{strokeDashoffset:0},{strokeDashoffset:-64}], {duration:600, iterations:Infinity});
      await E.say('a_xray'); E.scanOff();
      await E.say('o_off');
      wa.cancel(); w.style.display = 'none';
      await E.evanTo(420, 955, 900, true);
      const set = (on) => {
        E.sfx.click(); E.node('toggle').setAttribute('y', on ? '508' : '540'); E.node('toggle').setAttribute('fill', on ? '#2FBF71' : '#C9CED6');
        E.node('lightOn').style.display = on ? '' : 'none'; E.node('dim').setAttribute('opacity', on ? '0' : '.25');
      };
      await E.tap('switch', 'a_tapon'); E.evanLean(6); set(true); await E.wait(700); E.evanLean(0);
      await E.tap('switch', 'a_tapoff'); E.evanLean(6); set(false); await E.wait(500); E.evanLean(0);
      await E.say('k_boss');
      set(true); await E.wait(300); set(false); await E.wait(300); set(true);
      await E.say('a_save');
    }
  });

  /* ================= EPISODE 8 ================= */
  EPISODES.push({ n:8, title:'Plugs Are for Grown-Ups', icon:'⚠️', setting:'The living room',
    tip:'Never touch a socket. Always ask a grown-up.',
    scene: () => H.wall('#E6EEF0', '#D7E3E6', 'w8') + H.window(80, 180, 220, 230) + H.frame(560, 200, 180, 130, '#F2E3C9') + H.floor('wood') + H.base() +
      `<g><rect x="380" y="560" width="440" height="200" rx="30" fill="#6C8EAD"/><rect x="360" y="640" width="480" height="140" rx="26" fill="#7FA2C2"/><rect x="400" y="600" width="190" height="80" rx="18" fill="#8FB1CF"/><rect x="610" y="600" width="190" height="80" rx="18" fill="#8FB1CF"/><rect x="380" y="780" width="20" height="20" fill="#5A4030"/><rect x="800" y="780" width="20" height="20" fill="#5A4030"/></g>` +
      H.plant(130, 760, 1.4) +
      `<g id="socket"><rect x="250" y="690" width="56" height="74" rx="8" fill="#FAFAFA" stroke="#BFC5CE" stroke-width="3"/><rect x="266" y="708" width="6" height="16" rx="2" fill="#555"/><rect x="284" y="708" width="6" height="16" rx="2" fill="#555"/><circle cx="278" cy="742" r="5" fill="#555"/></g>` +
      `<g id="quiz" style="display:none"><rect x="150" y="300" width="600" height="420" rx="34" fill="#FFFFFF" stroke="#FFD43B" stroke-width="10"/><text id="qPic" x="450" y="490" font-size="150" text-anchor="middle">☝️</text>` +
      `<g id="safe"><circle cx="330" cy="625" r="62" fill="#2FBF71"/><text x="330" y="650" font-size="70" text-anchor="middle">👍</text></g>` +
      `<g id="notsafe"><circle cx="570" cy="625" r="62" fill="#E53935"/><path d="M548 580 h44 l31 31 v44 l-31 31 h-44 l-31 -31 v-44z" fill="#C62828" stroke="#fff" stroke-width="5"/><text x="570" y="635" font-size="26" font-weight="700" text-anchor="middle" fill="#fff" font-family="Fredoka,sans-serif">STOP</text></g></g>`,
    async run(E){
      E.cast(['kestrel']);
      await E.say('title');
      E.sfx.beep();
      await E.aamaTo(420, 900, 800);
      E.scan('socket'); await E.say('a_stop');
      await E.say('k_what');
      await E.say('a_explain'); E.scanOff();
      await E.aamaTo(760, 930);
      await E.say('e_ask');
      await E.say('a_game');
      E.evanHide(false);
      const q = [['☝️🔌','a_q1','notsafe'],['🙋👩','a_q2','safe'],['🍴🍞','a_q3','notsafe']];
      E.node('quiz').style.display = '';
      for(const [pic, key, ans] of q){
        E.node('qPic').textContent = pic;
        await E.choice(['safe','notsafe'], ans, key);
        await E.say('c_right');
      }
      E.node('quiz').style.display = 'none';
      await E.say('e_allright');
    }
  });

  /* ================= EPISODE 9 ================= */
  EPISODES.push({ n:9, title:'The Flat Bike Tire', icon:'🚲', setting:"Orion's driveway",
    tip:'Check your tires and wear a helmet every ride.',
    scene: () => H.sky() + H.clouds() +
      `<rect x="40" y="200" width="620" height="600" fill="#F1E3CC"/><path d="M20 210 L350 70 L680 210Z" fill="#9C5B43"/><rect x="120" y="420" width="420" height="380" fill="#E7E3DA" stroke="#C9C3B7" stroke-width="6"/><g stroke="#C9C3B7" stroke-width="5">${[480,540,600,660,720].map(y=>`<path d="M120 ${y}H540"/>`).join('')}</g>` +
      `<rect x="660" y="600" width="240" height="200" fill="#7DBF5A"/>` + H.plant(760, 780, 1.2) +
      H.floor('concrete') +
      `<g id="bike"><path d="M380 880 L450 800 L540 880 M450 800 L500 800 L540 880 M450 800 L440 770 M420 770 H460 M500 800 L520 760 H545" fill="none" stroke="#2F6FD6" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<circle cx="540" cy="880" r="60" fill="none" stroke="#263238" stroke-width="14"/><circle cx="540" cy="880" r="6" fill="#90A4AE"/>` +
      `<g id="tire"><ellipse id="tireShape" cx="380" cy="895" rx="62" ry="45" fill="none" stroke="#263238" stroke-width="14"/><circle cx="380" cy="895" r="6" fill="#90A4AE"/></g></g>` +
      H.tool('pump', 'pump', 260, 820, .9).replace('<g id="pump">', '<g id="pump" style="display:none">'),
    setup(E){ E.evanSet(150, 955); },
    async run(E){
      E.cast(['orion']);
      await E.say('title');
      await E.say('e_wobbly');
      await E.tap('tire', 'o_squeeze');
      const ts = E.node('tireShape');
      await E.anim(E.node('tire'), [{transform:'scale(1,1)'},{transform:'scale(1.05,.9)'},{transform:'scale(1,1)'}], {duration:400});
      await E.say('e_squishy');
      await E.aamaTo(700, 900);
      E.scan('tire'); await E.say('a_scan'); E.scanOff();
      await E.say('o_pump');
      E.sfx.beep(); E.node('pump').style.display = '';
      await E.anim(E.node('pump'), [{transform:'translate(400px,-200px) scale(.3)', opacity:0},{transform:'translate(0,0) scale(1)', opacity:1}], {duration:700});
      let ry = 45;
      const handle = E.node('pump');
      await E.taps('pump', 5, 'a_pump', async () => {
        E.sfx.pump();
        await E.anim(handle, [{transform:'translateY(0)'},{transform:'translateY(14px)'},{transform:'translateY(0)'}], {duration:300});
        ry = Math.min(62, ry + 3.5); ts.setAttribute('ry', ry);
      });
      ts.setAttribute('ry', 62);
      E.node('pump').style.display = 'none';
      await E.say('e_ride');
      await E.say('o_helmet');
    }
  });

  /* ================= EPISODE 10 ================= */
  EPISODES.push({ n:10, title:'Wipe the Windows', icon:'🚗', setting:'The family garage',
    tip:'A clean window keeps everyone safe on the road.',
    scene: () => H.wall('#D9DBDE', '#C9CCD1', 'w10') +
      `<rect x="40" y="120" width="260" height="22" fill="#8C939C"/><g fill="#A7AFB9"><rect x="60" y="150" width="40" height="60" rx="4"/><rect x="120" y="160" width="60" height="50" rx="4"/><rect x="200" y="150" width="70" height="60" rx="4"/></g><rect x="40" y="300" width="260" height="22" fill="#8C939C"/><g fill="#E57373"><rect x="70" y="250" width="50" height="50" rx="6"/></g><g fill="#64B5F6"><rect x="150" y="240" width="40" height="60" rx="6"/></g>` +
      H.floor('concrete') + H.base('#9EA4AC') +
      `<g id="car"><path d="M300 820 L310 700 Q320 650 380 640 L470 560 Q500 540 560 540 H730 Q790 540 820 590 L860 650 Q895 660 895 700 V820 Z" fill="#2F6FD6"/>` +
      `<path id="window" d="M490 572 Q505 560 545 560 H705 Q745 560 765 600 L790 650 H440 Z" fill="#B3E5FC"/>` +
      `<path id="dust" d="M490 572 Q505 560 545 560 H705 Q745 560 765 600 L790 650 H440 Z" fill="#B9A585" opacity=".75"/>` +
      `<path id="wiper" d="M520 645 L610 590" stroke="#263238" stroke-width="6" stroke-linecap="round"/>` +
      `<g id="hood"><path d="M310 700 Q320 650 380 640 H470 L440 700 Z" fill="#285FB8"/></g>` +
      `<circle cx="420" cy="830" r="62" fill="#263238"/><circle cx="420" cy="830" r="24" fill="#B0BEC5"/><circle cx="780" cy="830" r="62" fill="#263238"/><circle cx="780" cy="830" r="24" fill="#B0BEC5"/>` +
      `<rect x="300" y="740" width="30" height="20" rx="6" fill="#FFE082"/></g>` +
      `<g id="bay" style="display:none"><rect x="80" y="230" width="600" height="300" rx="30" fill="#37474F" stroke="#FFD43B" stroke-width="8"/><text x="380" y="275" font-size="26" text-anchor="middle" fill="#ECEFF1" font-family="Fredoka,sans-serif">Under the hood</text>` +
      `<g id="capOil"><circle cx="200" cy="400" r="62" fill="#FFC107"/><text x="200" y="425" font-size="66" text-anchor="middle">🛢️</text></g>` +
      `<g id="capWasher"><circle cx="380" cy="400" r="62" fill="#29B6F6"/><text x="380" y="425" font-size="66" text-anchor="middle">🪟</text></g>` +
      `<g id="capCool"><circle cx="560" cy="400" r="62" fill="#EF5350"/><text x="560" y="425" font-size="66" text-anchor="middle">🌡️</text></g></g>` +
      `<g id="sprayFx"></g>`,
    setup(E){ E.evanSet(150, 955); E.aamaSet(340, 560); },
    async run(E){
      E.cast(['shivu']);
      await E.say('title');
      await E.say('s_dusty');
      await E.say('e_spray');
      const wp = E.node('wiper'); wp.style.transformBox = 'fill-box'; wp.style.transformOrigin = '0% 100%';
      E.sfx.squeak();
      await E.anim(wp, [{transform:'rotate(0)'},{transform:'rotate(-30deg)'},{transform:'rotate(0)'}], {duration:700});
      await E.say('e_nothing');
      await E.tap('aama', 'a_tapme');
      await E.aamaTo(560, 520);
      E.scan('hood');
      E.node('bay').style.display = '';
      E.scanOff();
      await E.choice(['capOil','capWasher','capCool'], 'capWasher', 'a_scan');
      await E.say('s_pour'); E.sfx.glug(); await E.wait(700); E.sfx.glug();
      E.node('bay').style.display = 'none';
      await E.aamaTo(340, 560);
      await E.tap('window', 'a_spray');
      E.sfx.spray();
      const fx = E.node('sprayFx');
      for(let i=0;i<14;i++){ const c = E.el('circle', { cx:470 + Math.random()*40, cy:648, r:4 + Math.random()*4, fill:'#4FC3F7' }, fx); E.anim(c, [{transform:'translate(0,0)', opacity:1},{transform:`translate(${80 + Math.random()*200}px,${-40 - Math.random()*60}px)`, opacity:0}], {duration:700}).then(() => c.remove()); }
      await E.wait(400);
      E.sfx.squeak();
      E.anim(wp, [{transform:'rotate(0)'},{transform:'rotate(-30deg)'},{transform:'rotate(0)'},{transform:'rotate(-30deg)'},{transform:'rotate(0)'}], {duration:1200});
      E.node('dust').style.transition = 'opacity 1.2s'; E.node('dust').setAttribute('opacity', '0');
      await E.wait(1300);
      await E.say('e_sparkle');
    }
  });

  /* ================= EPISODE 11 ================= */
  EPISODES.push({ n:11, title:'The Squeaky Door', icon:'🚪', setting:"Ruby's front door",
    tip:'A little drop goes a long way.',
    scene: () => H.wall('#D8E4EC', '#C9D8E2', 'w11') +
      `<g stroke="#B9CAD6" stroke-width="3">${Array.from({length:18},(_, i)=>`<path d="M0 ${30+i*42}H900"/>`).join('')}</g>` +
      `<rect x="0" y="0" width="900" height="60" fill="#5A6B7A"/>` + H.window(80, 250, 160, 200) + H.window(660, 250, 160, 200) +
      `<rect x="362" y="300" width="216" height="500" fill="#FFFFFF"/><rect x="380" y="318" width="180" height="482" fill="#3A2A20"/>` +
      `<g id="door"><rect x="380" y="318" width="180" height="482" fill="#C0392B"/><rect x="400" y="340" width="140" height="180" rx="6" fill="none" stroke="#962D22" stroke-width="6"/><rect x="400" y="560" width="140" height="200" rx="6" fill="none" stroke="#962D22" stroke-width="6"/><circle cx="535" cy="560" r="10" fill="#D6B46A"/></g>` +
      `<g id="hinge"><rect x="372" y="380" width="14" height="44" rx="4" fill="#9AA5B4"/><rect x="372" y="680" width="14" height="44" rx="4" fill="#9AA5B4"/></g>` +
      H.floor('porch') + `<rect x="380" y="805" width="190" height="34" rx="6" fill="#8D6E63"/><text x="475" y="830" font-size="22" text-anchor="middle" fill="#F2E3C9" font-family="Fredoka,sans-serif">WELCOME</text>` +
      H.plant(300, 760, 1.1) + H.plant(640, 760, 1.1) +
      `<g id="oil"><g transform="translate(610 900)"><path d="M-30 0 H30 V-50 Q30 -60 20 -60 H-20 Q-30 -60 -30 -50Z" fill="#FFB300"/><path d="M20 -50 L70 -90" stroke="#9AA5B4" stroke-width="8" stroke-linecap="round"/><rect x="-14" y="-74" width="28" height="16" rx="4" fill="#9AA5B4"/></g></g>`,
    setup(E){ E.evanSet(170, 955); },
    async run(E){
      E.cast(['ruby']);
      const d = E.node('door'); d.style.transformBox = 'fill-box'; d.style.transformOrigin = '0% 50%';
      const swing = () => E.anim(d, [{transform:'scaleX(1)'},{transform:'scaleX(.35)'},{transform:'scaleX(1)'}], {duration:1400, easing:'ease-in-out'});
      await E.say('title');
      E.sfx.creak(); await swing();
      await E.say('r_eek');
      await E.say('e_notmonster');
      await E.tap('aama', 'a_tapme');
      await E.aamaTo(700, 880);
      E.scan('hinge'); await E.say('a_scan'); E.scanOff();
      await E.say('r_elbow');
      await E.tap('oil', 'a_elbow');
      await moveTo(E, 'oil', -230, -330, 1000);
      const dropFx = E.el('g', {}, E.$('front'));
      await drop(E, 385, 400, 30, 600, dropFx); E.sfx.plop();
      await drop(E, 385, 700, 30, 600, dropFx); E.sfx.plop();
      await moveTo(E, 'oil', 0, 0, 800);
      await E.tap('door', 'a_swing');
      await swing();
      await E.say('r_nomonster');
      await E.say('e_fixed');
    }
  });

  /* ================= EPISODE 12 ================= */
  EPISODES.push({ n:12, title:'The Wobbly Chair', icon:'🪑', setting:"Evan's kitchen",
    tip:'Use tools with a grown-up nearby.', outro:['a_super','e_little'],
    scene: () => H.wall('#FDF0DC', '#F3E1C3', 'w12') + H.window(520, 170, 240, 220) + H.frame(120, 220, 160, 120, '#F7D9C4') + H.floor('wood') + H.base('#EADBC2') +
      `<g><rect x="420" y="640" width="320" height="22" rx="6" fill="#A0703F"/><rect x="440" y="662" width="18" height="250" fill="#8B5E34"/><rect x="702" y="662" width="18" height="250" fill="#8B5E34"/><ellipse cx="600" cy="634" rx="60" ry="10" fill="#FFFFFF"/><g fill="#E8B865"><rect x="570" y="620" width="22" height="16" rx="3"/><rect x="598" y="618" width="22" height="16" rx="3"/><rect x="584" y="610" width="22" height="16" rx="3"/></g></g>` +
      `<g id="chair"><rect x="300" y="560" width="18" height="200" fill="#C08A55"/><rect x="300" y="740" width="150" height="22" rx="6" fill="#D29A61"/><rect x="306" y="762" width="16" height="160" fill="#B07A45"/><rect x="426" y="762" width="16" height="160" fill="#B07A45"/><rect x="300" y="580" width="18" height="18" fill="#B07A45"/><rect x="300" y="640" width="18" height="18" fill="#B07A45"/></g>` +
      `<circle id="screw" cx="434" cy="790" r="9" fill="#9AA5B4" stroke="#5F6B7A" stroke-width="3"/>` +
      `<g id="tools" style="display:none"><rect x="470" y="905" width="300" height="80" rx="18" fill="#FFFFFF" opacity=".92"/>` +
      H.tool('plunger', 't1', 520, 920, .45) + H.tool('pump', 't2', 620, 915, .45) + H.tool('screwdriver', 't3', 715, 925, .6) + `</g>`,
    setup(E){ E.evanSet(150, 955); },
    async run(E){
      E.cast(['kestrel']);
      const ch = E.node('chair'); ch.style.transformBox = 'fill-box'; ch.style.transformOrigin = '50% 100%';
      const wob = () => E.anim(ch, [{transform:'rotate(0)'},{transform:'rotate(-3deg)'},{transform:'rotate(3deg)'},{transform:'rotate(0)'}], {duration:500, iterations:2});
      await E.say('title');
      E.sfx.creak(); await wob();
      await E.say('e_wiggly');
      await E.tap('aama', 'a_tapme');
      await E.aamaTo(700, 900);
      E.scan('screw'); await E.say('a_scan'); E.scanOff();
      await E.say('k_fix');
      await E.say('e_yes');
      E.node('tools').style.display = '';
      await E.choice(['t1','t2','t3'], 't3', 'a_which');
      const sd = E.node('t3');
      await moveTo(E, 't3', -270, -150, 900);
      E.node('tools').firstElementChild.style.display = 'none'; E.node('t1').style.display = 'none'; E.node('t2').style.display = 'none';
      const s = E.node('screw'); s.style.transformBox = 'fill-box'; s.style.transformOrigin = 'center';
      let rot = 0;
      await E.taps('screw', 3, 'a_turn', async () => {
        E.sfx.squeak(); rot += 120;
        s.style.transition = 'transform .4s'; s.style.transform = `rotate(${rot}deg)`;
        await E.anim(sd, [{transform:'translate(-270px,-150px) rotate(0)'},{transform:'translate(-270px,-150px) rotate(25deg)'},{transform:'translate(-270px,-150px) rotate(0)'}], {duration:400});
      });
      E.sfx.click();
      E.node('tools').style.display = 'none';
      await E.say('e_snack');
      await E.say('k_helped');
    }
  });

  window.EPISODES = EPISODES; window.H = H;
})();
