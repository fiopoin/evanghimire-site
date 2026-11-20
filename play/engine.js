/* Evan & Aama game engine */
(function(){
  const $ = id => document.getElementById(id);
  /* pausable timers: every wait, line and tap timer in the game runs on this clock */
  const PT = (() => {
    const _st = window.setTimeout.bind(window), _ct = window.clearTimeout.bind(window);
    let paused = false, seq = 0; const tm = new Map();
    function arm(id){ const o = tm.get(id); o.start = performance.now(); o.h = _st(() => { tm.delete(id); o.fn(); }, o.left); }
    return {
      get paused(){ return paused; },
      set(fn, ms){ const id = ++seq; tm.set(id, { fn, left: Math.max(0, +ms || 0) }); if(!paused) arm(id); return id; },
      every(fn, ms){ const id = ++seq; const o = { left: ms }; o.fn = () => { tm.set(id, o); o.left = ms; if(!paused) arm(id); fn(); }; tm.set(id, o); if(!paused) arm(id); return id; },
      clear(id){ const o = tm.get(id); if(o){ _ct(o.h); tm.delete(id); } },
      pause(){ if(paused) return; paused = true; const now = performance.now(); tm.forEach(o => { _ct(o.h); o.left = Math.max(0, o.left - (now - o.start)); }); },
      resume(){ if(!paused) return; paused = false; [...tm.keys()].forEach(arm); }
    };
  })();
  const setTimeout = PT.set, clearTimeout = PT.clear, setInterval = PT.every, clearInterval = PT.clear;
  const NS = 'http://www.w3.org/2000/svg';
  const svg = $('scene-svg');

  const CAST = {
    evan:    {name:'Evan',    color:'#E9A200'},
    aama:    {name:'Aama',    color:'#2E9C8A'},
    kestrel: {name:'Kestrel', color:'#C2185B', face:'👧🏻'},
    shivu:   {name:'Shivu',   color:'#5E35B1', face:'🧑🏽'},
    ruby:    {name:'Ruby',    color:'#E53935', face:'👧🏼'},
    arjun:   {name:'Arjun',   color:'#EF6C00', face:'👦🏽'},
    orion:   {name:'Orion',   color:'#1E88E5', face:'👦🏻'},
    dad:     {name:'Baba',    color:'#3A6EA5', face:'👨🏽'},
    baba:    {name:'Baba',    color:'#3A6EA5'},
    dallu:   {name:'Mom',     color:'#8E1F2F'},
    habba:   {name:'Habba',   color:'#6B4E2E'},
    buwa:    {name:'Buwa',    color:'#1E2D4F'},
    gaama:   {name:'Ghattekulo Aama', color:'#4E7A4E'},
    maa:     {name:'Maa',     color:'#B8860B'},
    papa:    {name:'Papa',    color:'#2B3F6B'},
    kaka:    {name:'Kaka',    color:'#2F5A34'},
    kaki:    {name:'Kaki',    color:'#B07F00'}
  };
  /* Season 2 people: real cutouts, each wears a name patch */
  const RATIO = {"arjun": 0.3511, "baba": 0.3175, "buwa": 0.3041, "dallu": 0.3066, "gaama": 0.3408, "habba": 0.3196, "kaka": 0.3078, "kaki": 0.2824, "kestrel": 0.4486, "maa": 0.284, "orion": 0.3038, "papa": 0.3049, "ruby": 0.4947, "shivu": 0.3018};
  const HEIGHT = { baba:570, dallu:530, habba:540, buwa:575, gaama:505, maa:525, papa:570, kaka:570, kaki:535, shivu:480, orion:440, kestrel:375 };

  const S = { muted:false, ac:null, ep:null, token:0, auto:false, buffers:{} };
  const Abort = new Error('abort');
  const alive = t => { if(t !== S.token) throw Abort; };

  /* ---------------- audio ---------------- */
  function ac(){
    try{
      if(!S.ac){ const C = window.AudioContext || window.webkitAudioContext; if(C) S.ac = new C(); }
      if(S.ac && S.ac.state === 'suspended' && !PT.paused) S.ac.resume();
    }catch(e){}
    return S.ac;
  }
  function tone(f, dur, type, vol, when, slide){
    const a = ac(); if(!a || S.muted) return;
    const t = a.currentTime + (when||0);
    const o = a.createOscillator(), g = a.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(f, t);
    if(slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(a.destination);
    o.start(t); o.stop(t + dur + 0.05);
  }
  function noiseBuf(dur){
    const a = ac(); const len = Math.floor(a.sampleRate * dur), buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i] = Math.random()*2-1;
    return buf;
  }
  function noise(dur, vol, freq, q){
    const a = ac(); if(!a || S.muted) return;
    const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    s.buffer = noiseBuf(dur); f.type = 'bandpass'; f.frequency.value = freq || 1800; f.Q.value = q || 1;
    const t = a.currentTime;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || .3, t + dur*.3); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(a.destination); s.start();
  }
  let loops = []; let timers = [];
  function every(ms, fn){ const id = setInterval(fn, ms); timers.push(id); return () => clearInterval(id); }
  function loop(freq, vol){
    const a = ac(); if(!a) return () => {};
    const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    s.buffer = noiseBuf(2); s.loop = true; f.type = 'bandpass'; f.frequency.value = freq || 3000; g.gain.value = S.muted ? 0 : (vol || .05);
    s.connect(f); f.connect(g); g.connect(a.destination); s.start();
    const h = { g, vol: vol || .05, stop(){ try{ s.stop(); }catch(e){} loops = loops.filter(x => x !== h); } };
    loops.push(h);
    return () => h.stop();
  }
  const sfx = {
    drip(){ tone(1500,.13,'sine',.22,0,450); },
    plop(){ tone(700,.1,'sine',.12,0,300); },
    beep(){ tone(880,.12,'square',.06); tone(587,.16,'square',.06,.14); },
    scan(){ tone(320,1.4,'sine',.06,0,1400); tone(1400,1.2,'sine',.04,1.4,500); },
    whoosh(){ noise(.6,.16,700); },
    squeak(){ tone(1000,.18,'triangle',.16,0,1750); tone(1750,.22,'triangle',.12,.18,1050); },
    creak(){ tone(220,.5,'sawtooth',.05,0,380); tone(380,.4,'sawtooth',.04,.45,240); },
    step(){ tone(150,.06,'sine',.12); },
    hop(){ tone(300,.14,'sine',.14,0,620); },
    wipe(){ noise(.35,.32,2200); },
    glug(){ [0,.18,.36].forEach(w => tone(260,.14,'sine',.2,w,140)); },
    drain(){ noise(1.2,.25,500,.7); },
    click(){ tone(1800,.03,'square',.12); },
    pop(){ tone(900,.08,'square',.15,0,200); noise(.15,.2,3000); },
    snap(){ tone(1200,.05,'square',.12); },
    vroom(){ tone(110,.8,'sawtooth',.08,0,260); },
    pump(){ noise(.25,.25,1200,2); },
    spray(){ noise(.8,.2,4000,.8); },
    bell(){ [880,1175].forEach((f,i)=>tone(f,.4,'sine',.12,i*.12)); },
    wrong(){ tone(260,.18,'triangle',.12); tone(200,.25,'triangle',.12,.18); },
    cheer(){ [523,659,784,1047].forEach((f,i)=>tone(f,.28,'triangle',.16,i*.12)); tone(1319,.7,'triangle',.12,.5); },
    boop(){ tone(330,.12,'sine',.1); }
  };

  async function loadAudio(ep){
    const a = ac(); if(!a) return;
    const keys = [];
    for(const k of Object.keys(LINES[ep] || {})) keys.push([ep,k]);
    for(const k of Object.keys(LINES.common)) keys.push(['common',k]);
    await Promise.all(keys.map(async ([e,k]) => {
      const id = e + '/' + k; if(S.buffers[id]) return;
      try{
        const r = await fetch('audio/' + id + '.mp3'); if(!r.ok) return;
        const ab = await r.arrayBuffer();
        S.buffers[id] = await new Promise((res, rej) => a.decodeAudioData(ab, res, rej));
      }catch(e){}
    }));
  }

  /* ---------------- speech ---------------- */
  let curSrc = null;
  const hasTTS = 'speechSynthesis' in window;
  function stopVoice(){
    if(curSrc){ try{ curSrc.onended = null; curSrc.stop(); }catch(e){} curSrc = null; }
    if(hasTTS){ try{ speechSynthesis.cancel(); }catch(e){} }
  }
  function setBubble(who, text){
    const c = CAST[who] || CAST.aama;
    const b = $('bubble');
    b.classList.remove('hidden');
    b.style.borderColor = c.color;
    const w = $('who'); w.textContent = (c.face ? c.face + ' ' : '') + c.name; w.style.background = c.color;
    $('line').textContent = text;
  }
  function lineOf(key){
    const L = LINES[S.ep] || {};
    if(L[key]) return [S.ep, L[key]];
    if(LINES.common[key]) return ['common', LINES.common[key]];
    return null;
  }
  function say(key){
    const t = S.token;
    const found = lineOf(key);
    if(!found) return Promise.resolve();
    const [e, [who, text]] = found;
    setBubble(who, text);
    stopVoice();
    Object.keys(PEOPLE).forEach(k => talking(k, false)); talking(who, true);
    return new Promise(res => {
      let done = false, tm;
      const fin = () => { if(done) return; done = true; clearTimeout(tm); talking(who, false); setTimeout(res, 250); };
      const readMs = text.length * 58 + 1200;
      const buf = S.buffers[e + '/' + key], a = S.ac;
      if(!S.muted && buf && a){
        const s = a.createBufferSource(); s.buffer = buf; s.connect(a.destination);
        s.onended = fin; curSrc = s; s.start();
        tm = setTimeout(fin, buf.duration * 1000 + 900);
        if(window.__onSay) window.__onSay(e + '/' + key);
      } else if(!S.muted && hasTTS && !S.auto){
        tm = setTimeout(fin, text.length * 80 + 3500);
        try{
          const u = new SpeechSynthesisUtterance(text);
          u.pitch = who === 'evan' ? 1.6 : 1.2; u.onend = fin; u.onerror = fin;
          speechSynthesis.speak(u);
        }catch(e){ clearTimeout(tm); tm = setTimeout(fin, readMs); }
      } else tm = setTimeout(fin, readMs);
    }).then(() => alive(t));
  }

  /* ---------------- helpers ---------------- */
  const wait = ms => { const t = S.token; return new Promise(r => setTimeout(r, ms)).then(() => alive(t)); };
  function anim(el, kf, opts){
    return new Promise(r => {
      try{ const a = el.animate(kf, opts); a.onfinish = r; setTimeout(r, (opts.duration||500) * (opts.iterations && opts.iterations !== Infinity ? opts.iterations : 1) + 250); }
      catch(e){ setTimeout(r, opts.duration||500); }
    });
  }
  function el(tag, attrs, parent){
    const n = document.createElementNS(NS, tag);
    for(const k in attrs) n.setAttribute(k, attrs[k]);
    if(parent) parent.appendChild(n);
    return n;
  }
  function bbox(node){
    const r = node.getBoundingClientRect(), m = svg.getScreenCTM().inverse();
    const p1 = new DOMPoint(r.left, r.top).matrixTransform(m), p2 = new DOMPoint(r.right, r.bottom).matrixTransform(m);
    return { x:p1.x, y:p1.y, w:p2.x - p1.x, h:p2.y - p1.y, cx:(p1.x + p2.x)/2, cy:(p1.y + p2.y)/2 };
  }
  const node = id => typeof id === 'string' ? (svg.querySelector('#' + id) || $(id)) : id;

  /* ---------------- characters ---------------- */
  const EV = { x:200, y:955 }, AA = { x:734, y:945 };
  function evanTo(x, y, ms, walk){
    const pos = $('evanPos');
    ms = ms == null ? 1000 : ms;
    pos.style.transition = 'transform ' + ms + 'ms ' + (walk ? 'linear' : 'ease-out');
    pos.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    EV.x = x; EV.y = y;
    let st = null;
    if(walk){ $('evanWalk').classList.add('walking'); st = setInterval(sfx.step, 300); }
    return wait(ms).finally(() => { if(walk){ $('evanWalk').classList.remove('walking'); clearInterval(st); } });
  }
  function evanSet(x, y){ const p = $('evanPos'); p.style.transition = 'none'; p.style.transform = 'translate(' + x + 'px,' + y + 'px)'; EV.x = x; EV.y = y; }
  function evanLean(deg){ $('evanImg').style.transform = deg ? 'rotate(' + deg + 'deg)' : ''; }
  function evanHold(markup){ $('evanHeld').innerHTML = markup || ''; }
  function aamaTo(x, y, ms){
    const p = $('aamaPos');
    p.style.transition = 'transform ' + (ms || 1100) + 'ms cubic-bezier(.45,0,.3,1)';
    p.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    AA.x = x; AA.y = y; sfx.whoosh();
    return wait((ms || 1100) + 50);
  }
  function aamaSet(x, y){ const p = $('aamaPos'); p.style.transition = 'none'; p.style.transform = 'translate(' + x + 'px,' + y + 'px)'; AA.x = x; AA.y = y; }
  function aamaHide(h){ $('aamaPos').style.display = h ? 'none' : ''; }
  function evanHide(h){ $('evanPos').style.display = h ? 'none' : ''; }

  const PEOPLE = {};
  function person(k, x, y, opts){
    opts = opts || {};
    let p = PEOPLE[k];
    const h = Math.round((HEIGHT[k] || 500) * (opts.scale || 1)), w = Math.round(h * (RATIO[k] || .35));
    if(!p){
      const g = el('g', { id:'p_' + k, class:'person' }, $('people'));
      g.innerHTML = '<g class="pwalk"><g class="ptalk"><ellipse cx="0" cy="0" rx="' + (w*.42) + '" ry="10" fill="#000" opacity=".13"/>' +
        '<image href="cast/' + k + '.webp" x="' + (-w/2) + '" y="' + (-h) + '" width="' + w + '" height="' + h + '" filter="url(#shadowF)"' + (opts.flip ? ' transform="scale(-1 1)"' : '') + '/></g></g>';
      p = PEOPLE[k] = { g, x, y, h, w };
    }
    p.g.style.transition = 'none'; p.g.style.transform = 'translate(' + x + 'px,' + y + 'px)'; p.g.style.display = ''; p.g.style.opacity = 1;
    p.x = x; p.y = y;
    if(opts.fade){ p.g.style.opacity = 0; requestAnimationFrame(() => { p.g.style.transition = 'opacity .6s'; p.g.style.opacity = 1; }); }
    return p.g;
  }
  function personTo(k, x, y, ms){
    const p = PEOPLE[k]; if(!p) return wait(0);
    ms = ms == null ? 1200 : ms;
    p.g.style.transition = 'transform ' + ms + 'ms linear';
    p.g.style.transform = 'translate(' + x + 'px,' + y + 'px)'; p.x = x; p.y = y;
    const wk = p.g.querySelector('.pwalk'); wk.classList.add('walking');
    return wait(ms).finally(() => wk.classList.remove('walking'));
  }
  function personOut(k, ms){
    const p = PEOPLE[k]; if(!p) return wait(0);
    p.g.style.transition = 'opacity ' + (ms || 600) + 'ms'; p.g.style.opacity = 0;
    return wait(ms || 600).then(() => { p.g.style.display = 'none'; });
  }
  function people(list, opts){ list.forEach(([k, x, y, o]) => person(k, x, y, Object.assign({}, opts || {}, o || {}))); }
  function talking(who, on){ const p = PEOPLE[who]; if(p) p.g.querySelector('.ptalk').classList.toggle('talk', on); }

  /* scanning */
  let scanAnim = null;
  function scan(target){
    const b = typeof target === 'object' && 'cx' in target ? target : bbox(node(target));
    const cx = b.cx, cy = b.cy, rx = Math.max(b.w/2 + 15, 45), ry = Math.max(b.h/2 + 15, 40);
    const ax = AA.x + 14, ay = AA.y - 215;
    const dx = cx - ax, dy = cy - ay, len = Math.hypot(dx, dy) || 1;
    const px = -dy/len, py = dx/len, half = Math.max(rx, ry) * .9;
    $('beam').setAttribute('points', [ax, ay, cx + px*half, cy + py*half, cx - px*half, cy - py*half].join(','));
    const r = $('scanRing'); r.setAttribute('cx', cx); r.setAttribute('cy', cy); r.setAttribute('rx', rx); r.setAttribute('ry', ry);
    const l = $('scanLine'); l.setAttribute('x1', cx - rx*.8); l.setAttribute('x2', cx + rx*.8); l.setAttribute('y1', cy - ry*.8); l.setAttribute('y2', cy - ry*.8);
    $('fx').style.display = '';
    try{ scanAnim = l.animate([{transform:'translateY(0px)'},{transform:'translateY(' + (ry*1.6) + 'px)'}], {duration:700, iterations:Infinity, direction:'alternate', easing:'ease-in-out'}); }catch(e){}
    sfx.beep(); sfx.scan();
  }
  function scanOff(){ $('fx').style.display = 'none'; if(scanAnim){ try{ scanAnim.cancel(); }catch(e){} scanAnim = null; } }

  /* friends present (shown as name chips until their photos are ready) */
  function cast(list){
    const c = $('chips'); c.innerHTML = '';
    (list || []).forEach(k => {
      const m = CAST[k]; if(!m) return;
      const d = document.createElement('div'); d.className = 'chip'; d.style.borderColor = m.color;
      d.innerHTML = '<span class="face">' + m.face + '</span>' + m.name;
      c.appendChild(d);
    });
  }

  /* ---------------- taps ---------------- */
  let pending = null, reprompt = null;
  function clearHint(){ $('hint').style.display = 'none'; $('hintRings').innerHTML = ''; $('hintExtra').innerHTML = ''; $('hits').innerHTML = ''; }
  function ringFor(b){
    return { cx:b.cx, cy:b.cy, rx:Math.max(b.w/2 + 18, 55), ry:Math.max(b.h/2 + 18, 50) };
  }
  function showRing(b, withHand){
    const r = ringFor(b);
    el('ellipse', { cx:r.cx, cy:r.cy, rx:r.rx, ry:r.ry, fill:'#FFD43B', 'fill-opacity':'.14', stroke:'#FFC400', 'stroke-width':10, class:'ringx' }, $('hintRings'));
    if(withHand){
      const h = $('hintHand');
      h.setAttribute('x', Math.min(r.cx + r.rx*.75, 860)); h.setAttribute('y', Math.min(r.cy + r.ry*.95 + 34, 985));
    }
    $('hint').style.display = '';
    return r;
  }
  function addHit(r, onTap){
    const h = el('ellipse', { cx:r.cx, cy:r.cy, rx:Math.max(r.rx, 70), ry:Math.max(r.ry, 65), fill:'transparent', 'pointer-events':'all', class:'hit' }, $('hits'));
    h.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); ac(); onTap(); });
    return h;
  }
  function targetBox(id){
    if(id === 'aama') return { cx:AA.x, cy:AA.y - 160, w:240, h:300 };
    if(id === 'evan') return { cx:EV.x, cy:EV.y - 215, w:200, h:420 };
    if(id.startsWith('p_') && PEOPLE[id.slice(2)]){ const p = PEOPLE[id.slice(2)]; return { cx:p.x, cy:p.y - p.h*.55, w:p.w*.8, h:p.h*.7 }; }
    return bbox(node(id));
  }
  function startReprompt(key){
    clearInterval(reprompt);
    if(key && !S.auto) reprompt = setInterval(() => { if(pending) say(key).catch(() => {}); }, 9000);
  }
  /* wait for one tap on a target */
  function tap(id, promptKey, opts){
    opts = opts || {};
    const t = S.token;
    return new Promise((res, rej) => {
      const b = targetBox(id);
      const r = showRing(b, true);
      if(opts.arrow) $('hintExtra').innerHTML = opts.arrow;
      const done = () => { if(pending !== p) return; pending = null; clearInterval(reprompt); clearHint(); stopVoice(); res(); };
      const p = { done, rej }; pending = p;
      addHit(r, done);
      if(promptKey) say(promptKey).catch(() => {});
      startReprompt(promptKey);
      if(S.auto) setTimeout(() => { if(t === S.token) done(); }, autoDelay(promptKey));
    }).then(() => alive(t));
  }
  function autoDelay(key){
    const f = key && lineOf(key); const buf = f && S.buffers[f[0] + '/' + key];
    return (buf ? buf.duration * 1000 : 1500) + 700;
  }
  /* pick the right one of several */
  function choice(ids, correct, promptKey){
    const t = S.token;
    return new Promise(res => {
      let finished = false;
      const p = { done(){ }, rej(){ } }; pending = p;
      ids.forEach(id => {
        const b = targetBox(id);
        const r = showRing(b, id === correct && S.auto);
        addHit(r, () => {
          if(finished) return;
          if(id === correct){
            finished = true; pending = null; clearInterval(reprompt); clearHint(); stopVoice(); sfx.bell(); res(id);
          } else {
            const n = node(id); n.classList.remove('shake'); void n.getBBox(); n.classList.add('shake');
            sfx.wrong(); say('c_wrong').catch(() => {});
          }
        });
      });
      $('hintHand').setAttribute('x', -200);
      if(promptKey) say(promptKey).catch(() => {});
      startReprompt(promptKey);
      if(S.auto) setTimeout(() => { if(t === S.token && !finished){ finished = true; pending = null; clearInterval(reprompt); clearHint(); stopVoice(); sfx.bell(); res(correct); } }, autoDelay(promptKey));
    }).then(v => { alive(t); return v; });
  }
  /* tap the same thing several times */
  async function taps(id, n, firstKey, onEach, opts){
    for(let i = 1; i <= n; i++){
      const key = i === 1 ? firstKey : (i === n && n > 2 ? 'c_onemore' : 'c_again');
      await tap(id, key, opts);
      if(onEach) await onEach(i);
    }
  }

  /* ---------------- moments ---------------- */
  function confetti(){
    const stage = $('stage'), colors = ['#FFD43B','#2E9C8A','#5FF6FF','#2FBF71','#2F6FD6','#FF7A45'];
    for(let i=0;i<70;i++){
      const c = document.createElement('div'); c.className = 'confetti';
      c.style.left = (Math.random()*100) + '%'; c.style.background = colors[i % colors.length];
      c.style.animationDuration = (2.4 + Math.random()*2) + 's'; c.style.animationDelay = (Math.random()*.8) + 's';
      stage.appendChild(c); setTimeout(() => c.remove(), 5500);
    }
  }
  function celebrate(){
    $('evanJump').classList.add('jump'); $('aamaSpin').classList.add('wiggle');
    sfx.cheer(); confetti();
    setTimeout(() => { $('evanJump').classList.remove('jump'); $('aamaSpin').classList.remove('wiggle'); }, 2600);
  }

  /* ---------------- flow ---------------- */
  function show(id, on){ $(id).classList.toggle('hidden', !on); }
  function resetStage(){
    setPaused(false);
    S.token++;
    stopVoice(); clearHint(); scanOff(); loops.slice().forEach(h => h.stop()); timers.forEach(clearInterval); timers = [];
    clearInterval(reprompt); pending = null;
    $('drops').innerHTML = ''; $('front').innerHTML = ''; $('scene').innerHTML = ''; $('people').innerHTML = ''; Object.keys(PEOPLE).forEach(k => delete PEOPLE[k]);
    evanHold(null); evanLean(0); evanHide(false); aamaHide(false);
    $('evanWalk').className.baseVal = ''; $('evanJump').classList.remove('jump'); $('aamaSpin').classList.remove('wiggle');
    evanSet(200, 955); aamaSet(734, 945);
    $('bubble').classList.add('hidden'); cast([]);
    show('end', false); show('start', false);
  }
  let frozen = [];
  function setPaused(on){
    if(on === PT.paused) return;
    if(on){
      PT.pause();
      frozen = document.getAnimations().filter(a => a.playState === 'running'); frozen.forEach(a => a.pause());
      try{ if(S.ac) S.ac.suspend(); }catch(e){}
      try{ speechSynthesis.pause(); }catch(e){}
      $('stage').classList.add('paused');
    } else {
      $('stage').classList.remove('paused');
      frozen.forEach(a => { try{ a.play(); }catch(e){} }); frozen = [];
      try{ if(S.ac) S.ac.resume(); }catch(e){}
      try{ speechSynthesis.resume(); }catch(e){}
      PT.resume();
    }
    $('pauseBtn').textContent = on ? '▶' : '⏸';
    $('pauseBtn').setAttribute('aria-label', on ? 'Play' : 'Pause');
    show('paused', on);
  }
  function episode(n){ return EPISODES.find(e => e.n === n); }
  function openEpisode(n, auto){
    const e = episode(n); if(!e){ goHome(); return; }
    resetStage();
    S.ep = 'ep' + n; S.auto = !!auto; S.cur = e;
    $('muteBtn').style.display = $('homeBtn').style.display = $('pauseBtn').style.display = auto ? 'none' : '';
    $('menu').style.display = 'none';
    $('scene').innerHTML = e.scene();
    if(e.setup) e.setup(API);
    $('startNum').textContent = (e.season === 2 ? 'Season 2 · ' : 'Season 1 · ') + 'Episode ' + n;
    $('startTitle').textContent = e.title;
    show('start', true);
    if(auto){ ac(); begin(); }
  }
  async function begin(){
    const e = S.cur; const t = S.token;
    show('start', false);
    $('playBtn').textContent = 'Loading…';
    await Promise.race([loadAudio(S.ep), new Promise(r => setTimeout(r, 8000))]);
    $('playBtn').textContent = '▶ Play';
    if(t !== S.token) return;
    try{
      await e.run(API);
      celebrate();
      for(const k of (e.outro || ['a_super'])) await say(k);
      await wait(1400);
      $('tipText').textContent = e.tip;
      $('nextBtn').style.display = episode(e.n + 1) ? '' : 'none';
      show('end', true);
      try{ localStorage.setItem('ea_done_' + e.n, '1'); }catch(err){}
      await say(e.tipKey || 'a_tip');
      if(window.__onEnd) window.__onEnd(e.n);
    }catch(err){ if(err !== Abort) console.error(err); }
  }
  function goHome(){
    resetStage();
    $('menu').style.display = '';
    const g = $('grid'); g.innerHTML = '';
    let lastSeason = 0;
    EPISODES.forEach(e => {
      const sn = e.season || 1;
      if(sn !== lastSeason){
        lastSeason = sn;
        const h = document.createElement('div'); h.className = 'season';
        h.innerHTML = sn === 1 ? '<b>Season 1</b><span>Fixing things at home</span>' : '<b>Season 2</b><span>The Trip to Nepal</span>';
        g.appendChild(h);
      }
      let done = false; try{ done = localStorage.getItem('ea_done_' + e.n) === '1'; }catch(err){}
      const b = document.createElement('button'); b.className = 'ep' + (done ? ' done' : '');
      b.innerHTML = '<div class="ico">' + e.icon + '</div><div class="num">Episode ' + e.n + (done ? ' ✓' : '') + '</div><div class="t">' + e.title + '</div><div class="s">' + e.setting + '</div>';
      b.onclick = () => { location.hash = 'ep-' + e.n; };
      g.appendChild(b);
    });
  }
  function route(){
    const m = (location.hash || '').match(/^#ep-(\d+)(-auto)?$/);
    if(m) openEpisode(parseInt(m[1], 10), !!m[2]); else goHome();
  }

  const API = { $, node, el, NS, svg, say, wait, anim, tap, choice, taps, scan, scanOff, evanTo, evanSet, evanLean, evanHold, evanHide,
    aamaTo, aamaSet, aamaHide, cast, person, personTo, personOut, people, celebrate, sfx, loop, every, bbox, get EV(){ return EV; }, get AA(){ return AA; }, get auto(){ return S.auto; } };

  window.Game = {
    API,
    boot(){
      $('playBtn').onclick = () => { ac(); try{ const a = S.ac, b = a.createBuffer(1,1,22050), s = a.createBufferSource(); s.buffer = b; s.connect(a.destination); s.start(); }catch(e){} begin(); };
      $('againBtn').onclick = () => { ac(); openEpisode(S.cur.n); begin(); };
      $('nextBtn').onclick = () => { location.hash = 'ep-' + (S.cur.n + 1); };
      document.querySelectorAll('[data-go="home"]').forEach(b => b.onclick = () => { location.hash = 'home'; });
      $('homeBtn').onclick = () => { location.hash = 'home'; };
      $('pauseBtn').onclick = () => setPaused(!PT.paused);
      $('resumeBtn').onclick = () => setPaused(false);
      document.addEventListener('keydown', ev => { if(ev.code === 'Space' && $('menu').style.display === 'none' && !S.auto){ ev.preventDefault(); setPaused(!PT.paused); } });
      document.addEventListener('visibilitychange', () => { if(document.hidden && !S.auto && $('menu').style.display === 'none') setPaused(true); });
      $('muteBtn').onclick = () => {
        S.muted = !S.muted; $('muteBtn').textContent = S.muted ? '🔇' : '🔊';
        loops.forEach(h => h.g.gain.value = S.muted ? 0 : h.vol);
        if(S.muted) stopVoice(); else ac();
      };
      svg.querySelectorAll('.hit[data-k]').forEach(h => h.addEventListener('pointerdown', () => {
        ac();
        if(!pending) { if(h.dataset.k === 'aama'){ sfx.beep(); anim($('aamaSpin'), [{transform:'rotate(0)'},{transform:'rotate(-6deg)'},{transform:'rotate(6deg)'},{transform:'rotate(0)'}], {duration:500}); } else { tone(660,.1,'sine',.1); tone(880,.12,'sine',.1,.1); } }
      }));
      window.addEventListener('hashchange', route);
      route();
    }
  };
})();
