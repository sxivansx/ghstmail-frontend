import { slugLabel, aliasAddress, randomTail, formatTimeLeft } from "@/lib/landing-demo";

// Wires up the landing page demos. Returns a cleanup function for the effect that calls it.
export function mountLanding(root) {
  const $ = (s) => root.querySelector(s);
  const $$ = (s) => [...root.querySelectorAll(s)];
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CH = "abcdefghijkmnpqrstuvwxyz23456789";
  const rand = randomTail;
  const ac = new AbortController();
  const observers = [];
  let dead = false;
  const on = (el, type, fn) => el.addEventListener(type, fn, { signal: ac.signal });
  const observe = (el, fn, options) => { const o = new IntersectionObserver(fn, options); o.observe(el); observers.push(o); };
  const wait = (ms) => new Promise((r) => setTimeout(() => dead || r(), calm ? 0 : ms));

  // Resolve text left to right through random characters.
  function scramble(el, text, from = 0) {
    const id = (el._s = (el._s || 0) + 1);
    if (calm) { el.textContent = text; return; }
    const t0 = performance.now(), dur = 520;
    (function tick(now) {
      if (dead || el._s !== id) return;
      const k = Math.min(1, (now - t0) / dur);
      const done = from + Math.floor((text.length - from) * k);
      let s = text.slice(0, done);
      for (let i = done; i < text.length; i++) s += /[.@]/.test(text[i]) ? text[i] : CH[Math.random() * CH.length | 0];
      el.textContent = s;
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }

  // Hero alias maker. The label you type also drives the diagram below.
  const site = $("#site"), aliasEl = $("#alias");
  let label = "netflix", tail = rand(5);
  site.value = "";
  const address = () => aliasAddress(label, tail);
  function render(fromIdx) {
    scramble(aliasEl, address(), fromIdx);
    $$("[data-alias]").forEach((e) => (e.textContent = address()));
    $$("[data-alias-short]").forEach((e) => (e.textContent = `${label}.${tail}@…`));
    $$("[data-site]").forEach((e) => (e.textContent = label.charAt(0).toUpperCase() + label.slice(1)));
  }
  on(site, "input", () => { label = slugLabel(site.value); render(label.length + 1); });
  // Turn an element's text to embers, one character at a time.
  function burnText(el) {
    if (calm) return Promise.resolve();
    const t = el.textContent;
    el._s = (el._s || 0) + 1;
    el.textContent = "";
    [...t].forEach((c, i) => {
      const sp = document.createElement("span");
      sp.className = "char-burn"; sp.textContent = c; sp.style.animationDelay = i * 24 + "ms";
      el.append(sp);
    });
    return wait(t.length * 24 + 820);
  }
  let burning = false;
  on($("#burn"), "click", async () => {
    if (burning) return; burning = true;
    await burnText(aliasEl);
    aliasEl.classList.add("ash"); aliasEl.textContent = "Burned. Mail sent there goes nowhere now.";
    await wait(1700);
    aliasEl.classList.remove("ash");
    tail = rand(5); render(0); burning = false;
  });
  on($("#leaks"), "click", async (e) => {
    const b = e.target.closest("button"); if (!b) return;
    const li = b.closest("li"); b.remove();
    await burnText(li.querySelector(".a"));
    li.classList.remove("hot");
    li.querySelector(".a").textContent = "burned"; li.querySelector(".a").style.color = "var(--muted)";
    li.querySelector(".n").textContent = "0 from now on";
    li.querySelector(".t i").style.setProperty("--w", "0%");
  });
  // Headline fire: the letters of "burn" are frosted glass over a brick oven.
  // One fragment shader draws the oven (brick wall at the back, fire in the middle,
  // embers nearest), shifts each layer by a different amount as the pointer moves so
  // the scene has depth, and keeps only the pixels inside the letter shapes. The glass
  // comes from three things: averaging the oven over a small disc (the frosting),
  // bending the view near the edges (refraction), and lighting the bevel from one side.
  const burnWord = $(".burn"), fireCanvas = $("#fire");
  const VERT = "attribute vec2 p; varying vec2 v; void main() { v = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }";
  const FRAG = `
    precision mediump float;
    uniform sampler2D u_mask; uniform sampler2D u_soft; uniform vec2 u_res; uniform vec4 u_box; uniform vec2 u_par;
    uniform float u_time; uniform float u_lit;
    varying vec2 v;
    float wide, heat, flicker;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
      return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
    }
    float fbm(vec2 p) { float s = 0., a = .5; for (int i = 0; i < 4; i++) { s += a * noise(p); p *= 2.03; a *= .5; } return s; }
    vec3 bricks(vec2 s) {
      vec2 b = s / vec2(.46, .2);
      b.x += mod(floor(b.y), 2.) * .5;
      vec2 f = fract(b);
      float face = smoothstep(0., .07, f.x) * smoothstep(1., .93, f.x) * smoothstep(0., .14, f.y) * smoothstep(1., .86, f.y);
      return mix(vec3(.05, .035, .03), vec3(.42, .17, .1) * (.7 + .3 * hash(floor(b))), face);
    }
    // The oven, in a space where the origin is the baseline and one unit is a letter height.
    vec3 scene(vec2 s) {
      vec3 col = bricks(s - u_par * .035) * (.16 + 1.9 * heat * flicker);
      col += vec3(1., .34, .05) * heat * .3 * (1.15 - s.y);
      if (u_lit < 0.) return col;

      // The burn starts at the spark and runs outward: each column lights when the
      // front reaches it (about half a second edge to edge), kicks up, then settles.
      vec2 fs = s - u_par * .09;
      vec2 spark = vec2(wide * .5, .1);
      float since = u_lit - abs(fs.x - spark.x) / (wide * .5 / .55);
      if (since > 0.) {
        float caught = 1. - exp(-since * 4.5);
        float top = .08 + .82 * caught + exp(-pow(since - .35, 2.) * 14.) * .3;
        float n = fbm(vec2(fs.x * 2.7, fs.y * 2.1 - u_time * 1.6));
        float n2 = fbm(vec2(fs.x * 6. + 7., fs.y * 4.2 - u_time * 2.5));
        float fl = clamp((1. - fs.y / top) * 1.55 - n * .9 - n2 * .28 + .12, 0., 1.) * smoothstep(0., .07, since);
        vec3 fc = mix(vec3(.75, .08, 0.), vec3(1., .42, .04), smoothstep(.05, .35, fl));
        fc = mix(fc, vec3(1., .8, .3), smoothstep(.35, .7, fl));
        fc = mix(fc, vec3(1., .97, .85), smoothstep(.82, 1., fl));
        col = mix(col, fc, smoothstep(.03, .25, fl));
        col += vec3(1., .85, .5) * exp(-since * 9.) * .9 * (1. - smoothstep(0., .9, fs.y));
      }

      vec2 es = s - u_par * .16;
      for (int i = 0; i < 6; i++) {
        float k = float(i);
        vec2 at = vec2(wide * hash(vec2(k, 1.)) + .05 * sin(u_time * 2. + k), fract(hash(vec2(k, 2.)) + u_time * (.22 + .2 * hash(vec2(k, 3.)))) * 1.25);
        col += vec3(1., .6, .2) * smoothstep(.045, 0., distance(es, at)) * heat;
      }
      // The spark itself: a flash, and a fan of bits thrown up and out that fall away.
      col += vec3(1., .92, .7) * exp(-u_lit * 9.) * 1.6 * smoothstep(.45, 0., distance(s, spark));
      for (int i = 0; i < 7; i++) {
        float k = float(i);
        float angle = mix(.3, 2.84, hash(vec2(k, 5.)));
        vec2 at = spark + u_lit * (1.2 + 1.5 * hash(vec2(k, 6.))) * vec2(cos(angle), sin(angle)) - vec2(0., u_lit * u_lit * 1.1);
        col += vec3(1., .85, .5) * smoothstep(.04, 0., distance(s, at)) * exp(-u_lit * 3.5);
      }
      return col;
    }
    void main() {
      vec2 px = v * u_res;
      float m = texture2D(u_mask, v).a;
      if (m < .01) { gl_FragColor = vec4(0.); return; }
      wide = u_box.z / u_box.w;
      heat = u_lit < 0. ? 0. : 1. - exp(-u_lit * 2.4);
      flicker = .8 + .2 * noise(vec2(u_time * 7., 3.));

      // Shape of the pane: the blurred mask is ~.5 on an edge and 1 deep inside, and
      // its slope points toward the middle of the stroke.
      vec2 d = 3. / u_res;
      float soft = texture2D(u_soft, v).a;
      vec2 slope = vec2(texture2D(u_soft, v + vec2(d.x, 0.)).a - texture2D(u_soft, v - vec2(d.x, 0.)).a, texture2D(u_soft, v + vec2(0., d.y)).a - texture2D(u_soft, v - vec2(0., d.y)).a);
      vec2 inward = slope / max(length(slope), .001);
      float bevel = 1. - smoothstep(.5, .8, soft);

      // Refraction at the bevel, then frost: average the oven over a small disc.
      vec2 s = (px - u_box.xy) / u_box.w + inward * bevel * .1;
      float spin = hash(px) * 6.2832;
      vec3 col = vec3(0.);
      for (int i = 0; i < 8; i++) {
        float k = float(i);
        float a = k * 2.3999 + spin;
        col += scene(s + (.012 + .042 * sqrt((k + .5) / 8.)) * vec2(cos(a), sin(a)));
      }
      col /= 8.;

      // Cold, the glass is frosted almost solid, close to the white of the headline.
      // The frosting is slightly uneven, and it clears as the fire heats the pane.
      float haze = mix(.92, .07, heat) * (.88 + .24 * fbm(s * 3.1 + 9.));
      col = mix(col, vec3(.94, .92, .87) * (.92 + .08 * clamp(s.y, 0., 1.)), clamp(haze, 0., 1.));
      col += (hash(px * .9 + 3.) - .5) * .035;

      // Light from the upper left: bright on the edges that face it, shaded on the far ones.
      vec2 light = normalize(vec2(-.55, .83));
      float facing = dot(-inward, light);
      col += bevel * pow(max(facing, 0.), 1.6) * mix(.3, .7, heat);
      col *= 1. - bevel * max(-facing, 0.) * mix(.2, .45, heat);
      col = mix(col, col * vec3(.86, .97, .94), bevel * .35);

      // A soft diagonal sheen that slides as the pointer moves.
      float across = (s.x * .55 + s.y) - (.85 + u_par.x * .6 + u_par.y * .25);
      col += (exp(-across * across * 30.) * .13 + exp(-(across - .5) * (across - .5) * 160.) * .08) * (1. - bevel * .5);

      gl_FragColor = vec4(clamp(col, 0., 1.) * m, m);
    }`;
  let gl = null, uni = null, litAt = 0, fireSeen = true, fireRaf = 0, fireSize = null;
  const lean = { x: 0, y: 0, tx: 0, ty: 0 };
  function initFire() {
    gl = fireCanvas.getContext("webgl", { premultipliedAlpha: true, antialias: false });
    if (!gl) return;
    const program = gl.createProgram();
    for (const [type, source] of [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, FRAG]]) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source); gl.compileShader(shader); gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl = null; return; }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const corner = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(corner); gl.vertexAttribPointer(corner, 2, gl.FLOAT, false, 0, 0);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    // Unit 0 holds the crisp letter shapes, unit 1 a blurred copy used for the bevel.
    for (const unit of [0, 1]) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    uni = {};
    for (const name of ["res", "box", "par", "time", "lit"]) uni[name] = gl.getUniformLocation(program, "u_" + name);
    gl.uniform1i(gl.getUniformLocation(program, "u_mask"), 0);
    gl.uniform1i(gl.getUniformLocation(program, "u_soft"), 1);
  }
  function setupFire() {
    const box = burnWord.getBoundingClientRect(), cs = getComputedStyle(burnWord);
    if (!gl || !box.width) return;
    const pad = Math.round(box.height * .12);
    const W = Math.ceil(box.width + pad * 2), H = Math.ceil(box.height + pad * 2), dpr = Math.min(devicePixelRatio || 1, 2);
    fireCanvas.width = W * dpr; fireCanvas.height = H * dpr;
    Object.assign(fireCanvas.style, { left: -pad + "px", top: -pad + "px", width: W + "px", height: H + "px" });
    const shape = document.createElement("canvas"); shape.width = W * dpr; shape.height = H * dpr;
    const sx = shape.getContext("2d");
    sx.scale(dpr, dpr);
    sx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    sx.letterSpacing = cs.letterSpacing;
    sx.fillStyle = "#fff";
    const m = sx.measureText("burn");
    const baseline = pad + (box.height - m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2 + m.fontBoundingBoxAscent;
    sx.fillText("burn", pad, baseline);
    const soft = document.createElement("canvas"); soft.width = shape.width; soft.height = shape.height;
    const fx = soft.getContext("2d");
    fx.filter = `blur(${m.actualBoundingBoxAscent * .05 * dpr}px)`;
    fx.drawImage(shape, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, shape);
    gl.activeTexture(gl.TEXTURE1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, soft);
    gl.viewport(0, 0, fireCanvas.width, fireCanvas.height);
    gl.uniform2f(uni.res, W, H);
    gl.uniform4f(uni.box, pad, H - baseline, box.width, m.actualBoundingBoxAscent);
    burnWord.classList.add("glass");
  }
  function fireFrame(now) {
    fireRaf = requestAnimationFrame(fireFrame);
    if (!fireSeen) return;
    lean.x += (lean.tx - lean.x) * .08; lean.y += (lean.ty - lean.y) * .08;
    gl.uniform2f(uni.par, lean.x, lean.y);
    gl.uniform1f(uni.time, now / 1000);
    gl.uniform1f(uni.lit, litAt ? (now - litAt) / 1000 : -1);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  // The glass sits cold for a beat, then a spark catches.
  wait(1500).then(() => { litAt = performance.now(); burnWord.classList.add("lit"); });
  if (!calm) {
    initFire();
    if (gl) {
      document.fonts.ready.then(() => { if (!dead) { setupFire(); fireRaf = requestAnimationFrame(fireFrame); } });
      fireSize = new ResizeObserver(setupFire);
      fireSize.observe(burnWord);
      observe(burnWord, (es) => { fireSeen = es[0].isIntersecting; }, { rootMargin: "200px" });
      on(window, "pointermove", (e) => {
        const r = burnWord.getBoundingClientRect();
        lean.tx = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / (innerWidth / 2)));
        lean.ty = Math.max(-1, Math.min(1, (r.top + r.height / 2 - e.clientY) / (innerHeight / 2)));
      });
    }
  }
  on($("#copy"), "click", async (e) => {
    try { await navigator.clipboard.writeText(address()); e.target.textContent = "Copied"; }
    catch { e.target.textContent = "Copy failed"; }
    setTimeout(() => (e.target.textContent = "Copy"), 1400);
  });
  (async () => {
    await wait(700);
    for (const c of "netflix") {
      if (document.activeElement === site || site.value.length > 6) break;
      site.value += c; await wait(70);
    }
    render(0);
  })();

  // The ghost behind the card watches the cursor.
  const peek = $("#peek"), eyes = $("#eyes");
  let raf = 0, lastMove = 0;
  on(window, "pointermove", (e) => {
    lastMove = performance.now();
    if (calm || raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const r = peek.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height * .4);
      const d = Math.hypot(dx, dy) || 1, reach = Math.min(1, d / 260) * 1.1;
      eyes.style.transform = `translate(${(dx / d) * reach}px, ${(dy / d) * reach}px)`;
    });
  });

  // Left alone, the ghost blinks, squeezes its eyes shut, or has a look around.
  if (!calm) (async () => {
    const flash = async (cls, ms) => { peek.classList.add(cls); await wait(ms); peek.classList.remove(cls); };
    for (;;) {
      await wait(1800 + Math.random() * 2600);
      const roll = Math.random();
      if (roll < .45) await flash("blink", 130);
      else if (roll < .6) { await flash("blink", 110); await wait(120); await flash("blink", 110); }
      else if (roll < .8) await flash("squint", 900);
      else if (performance.now() - lastMove > 2000) {
        for (const x of [-1.1, 1.1, 0]) { eyes.style.transform = `translate(${x}px, 0)`; await wait(650); }
      }
    }
  })();

  // Relay diagram.
  const stage = $("#stage"), pkt = $("#pkt"), mid = $("#mid"), cap = $("#caption");
  const slotSite = $("#slot-site"), slotInbox = $("#slot-inbox"), midText = $("#mid-text");
  const captions = {
    in: "The site writes to the alias. GhstMail rewrites the headers and forwards the message to you. It is not written to disk on the way through.",
    reply: "You hit reply in your normal mail app. The message goes out signed as the alias, so the site still has no idea what your real email is.",
    off: "Burn the alias and mail to it stops at our server. And since that email only ever went to one site, you know exactly who leaked or sold it.",
  };
  let run = 0, inView = false, idle = true, current = "in";
  const order = ["in", "reply", "off"];
  async function fly(from, to, kind) {
    pkt.className = "pkt " + kind;
    if (calm) { stage.style.setProperty("--p", to); return; }
    await stage.animate([{ "--p": from }, { "--p": to }], { duration: 850, easing: "cubic-bezier(.45,0,.2,1)", fill: "forwards" }).finished;
  }
  // Plays one scenario, then moves on to the next by itself while the diagram is on screen.
  async function play(name) {
    const me = ++run;
    current = name; idle = false;
    $$(".tabs button").forEach((b) => {
      const on = b.dataset.play === name;
      b.setAttribute("aria-selected", on);
      b.firstElementChild.getAnimations().forEach((a) => a.cancel());
      if (on && !calm) b.firstElementChild.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: name === "off" ? 5000 : 4950, fill: "forwards" });
    });
    slotSite.classList.remove("on"); slotInbox.classList.remove("on");
    mid.classList.toggle("off", name === "off");
    midText.textContent = name === "off" ? "alias burned" : "forwards, keeps no copy";
    cap.textContent = captions[name];
    pkt.style.opacity = 1;
    await wait(250); if (me !== run) return;
    if (name === "in") {
      await fly(0, .5, ""); if (me !== run) return;
      await fly(.5, 1, "private"); if (me !== run) return;
      slotInbox.classList.add("on");
    } else if (name === "reply") {
      await fly(1, .5, "private"); if (me !== run) return;
      await fly(.5, 0, ""); if (me !== run) return;
      slotSite.classList.add("on");
    } else {
      await fly(0, .5, ""); if (me !== run) return;
      pkt.className = "pkt stopped";
      await wait(900); if (me !== run) return;
    }
    pkt.style.opacity = 0;
    if (calm) { idle = true; return; }
    await wait(3000); if (me !== run) return;
    idle = true;
    if (inView) play(order[(order.indexOf(name) + 1) % 3]);
  }
  $$(".tabs button").forEach((b) => on(b, "click", () => play(b.dataset.play)));
  cap.textContent = captions.in;
  observe(stage, (es) => {
    inView = es[0].isIntersecting;
    if (inView && idle) play(current);
  }, { threshold: .4 });

  // Extension demo: a cursor works through three made-up signup pages on a loop.
  const sites = [
    ["Parcelbird", "Create your account", "parcelbird.example/signup"],
    ["Night Owl", "Get the weekly letter", "nightowl.example/newsletter"],
    ["Stackforge", "Start your 14 day trial", "stackforge.example/trial"],
  ];
  const demo = $("#ext-demo"), form = $("#ext-form"), field = $("#ext-field"), out = $("#ext-out");
  const btn = $("#ext-btn"), btnT = $("#ext-btn-t"), pop = $("#ext-pop"), recent = $("#ext-recent"), cur = $("#ext-cur");
  const steps = $$("#ext-steps li");
  let extRun = 0, extView = false, extIdle = true, siteIdx = 0;
  const step = (n) => steps.forEach((li, i) => li.classList.toggle("on", i === n));
  function fill() {
    const addr = `${slugLabel(sites[siteIdx][0])}.${rand(5)}@ghstmail.space`;
    scramble(out, addr);
    btnT.textContent = "Filled!"; btn.classList.add("done");
    recent.querySelectorAll(".new").forEach((li) => li.classList.remove("new"));
    const li = document.createElement("li"); li.className = "new"; li.textContent = addr;
    recent.prepend(li);
    while (recent.children.length > 3) recent.lastElementChild.remove();
  }
  function reset() {
    const [name, sub, url] = sites[siteIdx];
    $("#ext-site").textContent = name; $("#ext-sub").textContent = sub; $("#ext-url").textContent = url;
    out._s = (out._s || 0) + 1; out.textContent = "";
    btnT.textContent = "GET"; btn.classList.remove("done", "press");
    field.classList.remove("found"); pop.classList.remove("on");
  }
  async function tour() {
    const me = ++extRun; extIdle = false;
    form.classList.add("swap"); await wait(300); if (me !== extRun) return;
    reset(); form.classList.remove("swap");
    cur.style.opacity = 1; cur.style.transform = "translate(40px, 190px)";
    await wait(600); if (me !== extRun) return;
    step(0); field.classList.add("found");
    await wait(900); if (me !== extRun) return;
    const p = cur.parentElement.getBoundingClientRect(), b = btn.getBoundingClientRect();
    cur.style.transform = `translate(${b.left - p.left + b.width / 2}px, ${b.top - p.top + b.height / 2}px)`;
    await wait(950); if (me !== extRun) return;
    step(1); btn.classList.add("press"); btnT.textContent = "...";
    await wait(650); if (me !== extRun) return;
    btn.classList.remove("press"); fill(); step(2);
    await wait(900); if (me !== extRun) return;
    pop.classList.add("on");
    await wait(2600); if (me !== extRun) return;
    siteIdx = (siteIdx + 1) % sites.length;
    extIdle = true;
    if (extView) tour();
  }
  on(btn, "click", () => { extRun++; extIdle = true; cur.style.opacity = 0; fill(); step(2); pop.classList.add("on"); });
  if (calm) { reset(); fill(); step(2); pop.classList.add("on"); }
  else observe(demo, (es) => {
    extView = es[0].isIntersecting;
    if (extView && extIdle) tour();
  }, { threshold: .35 });

  // Expiry demo: a real countdown from the chosen duration.
  let total = 24 * 3600e3, started = Date.now();
  function tick() {
    const leftMs = Math.max(0, total - (Date.now() - started));
    $("#left").textContent = formatTimeLeft(leftMs);
    $("#ring").style.strokeDashoffset = 289 * (1 - leftMs / total);
  }
  $$(".seg button").forEach((b) => on(b, "click", () => {
    $$(".seg button").forEach((x) => x.setAttribute("aria-pressed", x === b));
    total = b.dataset.h * 3600e3; started = Date.now(); tick();
  }));
  tick(); const ticker = setInterval(tick, 1000);

  // Filter demo.
  on($("#block"), "click", (e) => {
    const on = e.target.getAttribute("aria-pressed") !== "true";
    e.target.setAttribute("aria-pressed", on);
    e.target.textContent = on ? "Unblock promo.example" : "Block promo.example";
    $$("#mail li[data-d]").forEach((li) => {
      li.classList.toggle("blocked", on);
      li.lastElementChild.textContent = on ? "blocked" : "forwarded";
    });
  });

  // Terminal tabs.
  $$(".term-bar button").forEach((b) => on(b, "click", () => {
    $$(".term-bar button").forEach((x) => x.setAttribute("aria-selected", x === b));
    $("#term-cli").hidden = b.dataset.term !== "cli";
    $("#term-curl").hidden = b.dataset.term !== "curl";
  }));

  // Cursor light on the tiles.
  $$(".tile").forEach((t) => on(t, "pointermove", (e) => {
    const r = t.getBoundingClientRect();
    t.style.setProperty("--mx", e.clientX - r.left + "px");
    t.style.setProperty("--my", e.clientY - r.top + "px");
  }));

  return () => {
    dead = true; run++; extRun++;
    ac.abort();
    clearInterval(ticker);
    observers.forEach((o) => o.disconnect());
    stage.getAnimations().forEach((a) => a.cancel());
    recent.textContent = "";
    peek.classList.remove("blink", "squint");
    cancelAnimationFrame(fireRaf);
    if (fireSize) fireSize.disconnect();
    burnWord.classList.remove("lit", "glass");
  };
}
