// ---------- Utilidades ----------
const app = document.getElementById('app');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const money = (v) => '$' + Math.round(v).toLocaleString('es-CO');
const pct = (v) => (isNaN(v) ? 'No definida' : (v * 100).toFixed(1) + '%');
let user = JSON.parse(localStorage.user || 'null');

async function api(path, opts = {}) {
  const res = await fetch('/api/' + path, { ...opts, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (localStorage.token || '') } });
  const json = await res.json().catch(() => ({}));
  if (res.status === 401 && localStorage.token) salir();
  if (!res.ok) throw new Error(json.error || 'Error del servidor');
  return json;
}
function salir() { localStorage.removeItem('token'); localStorage.removeItem('user'); user = null; inicio(); }

// Avatares y mascota dibujados en SVG (sin imágenes externas)
const COL = ['#2f6bff', '#7aa5ff', '#f5f8ff', '#1d4ed8', '#38bdf8', '#94a3b8'];
const av = (i = 0, s = 40) => `<svg class="av" width="${s}" height="${s}" viewBox="0 0 40 40" role="img" aria-label="Avatar ${i + 1}"><circle cx="20" cy="20" r="20" fill="${COL[i % 6]}"/><circle cx="14" cy="17" r="2.4" fill="#05080f"/><circle cx="26" cy="17" r="2.4" fill="#05080f"/><path d="M12 25q8 ${6 + (i % 3) * 3} 16 0" stroke="#05080f" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>`;
const MASCOTA = `<svg class="mascota" viewBox="0 0 200 200" role="img" aria-label="Viabi, la moneda mascota"><circle cx="100" cy="100" r="86" fill="#2f6bff"/><circle cx="100" cy="100" r="68" fill="#0a1428" stroke="#7aa5ff" stroke-width="4"/><text x="100" y="78" text-anchor="middle" font-family="Sora,sans-serif" font-weight="800" font-size="34" fill="#f5f8ff">$</text><circle cx="78" cy="102" r="7" fill="#f5f8ff"/><circle cx="122" cy="102" r="7" fill="#f5f8ff"/><circle cx="80" cy="103" r="3" fill="#05080f"/><circle cx="124" cy="103" r="3" fill="#05080f"/><path d="M76 128q24 22 48 0" stroke="#f5f8ff" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`;

function cabecera() {
  const u = document.getElementById('user');
  u.innerHTML = user ? `<button class="yo" id="perfil" aria-label="Mi perfil">${av(user.avatar, 36)}</button><button class="ghost" id="salir">Cerrar sesión</button>` : '';
  if (user) { document.getElementById('perfil').onclick = perfil; document.getElementById('salir').onclick = salir; }
}
function inicio() { cabecera(); user ? proyectos() : acceso(); }

// ---------- Cálculos de ingeniería económica ----------
function calc(a, tmar, inf) {
  const I = +a.inv || 0, n = Math.max(1, Math.round(+a.vida || 1)), S = +a.salv || 0, r = tmar / 100, g = inf / 100;
  const ing = +a.ing || 0, cos = +a.cos || 0, fl = [-I];
  for (let t = 1; t <= n; t++) fl.push((ing - cos) * Math.pow(1 + g, t - 1) + (t === n ? S : 0));
  const vp = (k) => fl.reduce((s, c, i) => s + c / Math.pow(1 + k, i), 0);
  const vpn = vp(r), caue = r ? vpn * r / (1 - Math.pow(1 + r, -n)) : vpn / n;
  let lo = -0.99, hi = 10, tir = NaN;
  if (vp(lo) * vp(hi) < 0) { for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; vp(lo) * vp(m) <= 0 ? hi = m : lo = m; } tir = (lo + hi) / 2; }
  let ac = -I, pri = null;
  for (let t = 1; t <= n && pri === null; t++) { const p = ac; ac += fl[t]; if (ac >= 0) pri = t - 1 + (-p / fl[t]); }
  let pb = S / Math.pow(1 + r, n), pc = 0;
  for (let t = 1; t <= n; t++) { const f = Math.pow(1 + g, t - 1) / Math.pow(1 + r, t); pb += ing * f; pc += cos * f; }
  return { n, vpn, caue, tir, pri, bc: pb / ((I + pc) || 1) };
}
const kpi = (v, l) => `<div class="kpi"><b>${v}</b><span>${l}</span></div>`;
const mejor = (alts, tmar, inf) => alts.map((a) => ({ a, m: calc(a, tmar, inf) })).sort((x, y) => y.m.caue - x.m.caue);

// ---------- Pantallas ----------
function acceso() {
  app.innerHTML = `
    <section class="hero">
      <div><h1>Decide en qué invertir, con números.</h1>
        <p>Compara alternativas de inversión con VPN, TIR, CAUE y beneficio/costo, y obtén una conclusión clara. Guarda tus proyectos en tu cuenta.</p>
        <form class="card auth" id="f"><h2>Entrar o crear cuenta</h2>
          <label>Correo<input type="email" name="email" required autocomplete="email"></label>
          <label>Contraseña (mínimo 8 caracteres)<input type="password" name="password" required minlength="8" autocomplete="current-password"></label>
          <div class="row"><button type="submit" data-a="login">Iniciar sesión</button><button type="submit" data-a="register" class="ghost">Crear cuenta</button></div>
          <div class="err" id="err" role="alert"></div></form></div>
      ${MASCOTA}
    </section>`;
  const f = document.getElementById('f');
  f.onsubmit = async (e) => {
    e.preventDefault();
    try {
      const r = await api('auth', { method: 'POST', body: JSON.stringify({ action: e.submitter.dataset.a, email: f.email.value, password: f.password.value }) });
      localStorage.token = r.token; localStorage.user = JSON.stringify(r.user); user = r.user; inicio();
    } catch (er) { document.getElementById('err').textContent = er.message; }
  };
}

function perfil() {
  app.innerHTML = `<h1>Mi perfil</h1><div class="card"><p>${esc(user.email)}</p><h2>Elige tu avatar</h2><div class="avs">${[0,1,2,3,4,5].map((i) => `<button data-i="${i}" aria-pressed="${i === user.avatar}" aria-label="Avatar ${i + 1}">${av(i, 64)}</button>`).join('')}</div><div class="row"><button class="ghost" id="atras">Volver a mis proyectos</button></div></div>`;
  app.querySelectorAll('[data-i]').forEach((b) => b.onclick = async () => {
    user.avatar = +b.dataset.i; localStorage.user = JSON.stringify(user);
    await api('auth', { method: 'POST', body: JSON.stringify({ action: 'avatar', avatar: user.avatar }) }).catch(() => {});
    cabecera(); perfil();
  });
  document.getElementById('atras').onclick = proyectos;
}

async function proyectos() {
  app.innerHTML = '<p>Cargando tus proyectos…</p>';
  try {
    const l = await api('projects');
    app.innerHTML = `<h1>Hola, ${esc(user.email.split('@')[0])}</h1><p class="sup">Cada proyecto compara alternativas de inversión.</p>
      <div class="row"><button id="nuevo">Crear proyecto</button></div>
      <div class="lista">${l.length ? l.map((p) => `<div class="card proy"><b>${esc(p.name)}</b><br><small>Editado ${new Date(p.updated).toLocaleDateString('es-CO')}</small>
        <div class="row"><button data-o="${p.id}">Abrir</button><button class="ghost" data-b="${p.id}">Eliminar</button></div></div>`).join('') : '<p>Aún no tienes proyectos. Crea el primero.</p>'}</div>`;
    document.getElementById('nuevo').onclick = () => editor(null);
    app.querySelectorAll('[data-o]').forEach((b) => b.onclick = async () => editor(await api('projects?id=' + b.dataset.o)));
    app.querySelectorAll('[data-b]').forEach((b) => b.onclick = async () => { if (confirm('¿Eliminar este proyecto? No se puede deshacer.')) { await api('projects?id=' + b.dataset.b, { method: 'DELETE' }); proyectos(); } });
  } catch (er) { app.innerHTML = `<p class="err">${esc(er.message)}</p>`; }
}

const ALT = (n, inv, vida, salv, ing, cos) => ({ nombre: n, inv, vida, salv, ing, cos });
const CAMPOS = [['nombre', 'Nombre', 'text'], ['inv', 'Inversión inicial ($)', 'number'], ['vida', 'Vida útil (años)', 'number'], ['salv', 'Valor de salvamento ($)', 'number'], ['ing', 'Ingresos anuales ($)', 'number'], ['cos', 'Costos anuales ($)', 'number']];

function editor(p) {
  const d = p ? p.data : { nombre: 'Compra de equipo para mi negocio', benef: '', desc: '', tmar: 12, inf: 5,
    alts: [ALT('Comprar equipo nuevo', 60e6, 8, 10e6, 30e6, 8e6), ALT('Comprar equipo usado', 35e6, 5, 4e6, 24e6, 10e6), ALT('Arrendar equipo', 3e6, 5, 0, 24e6, 17e6)] };
  let id = p ? p.id : null, tab = 0;
  const T = ['1. Ficha del proyecto', '2. Alternativas', '3. Dashboard'];
  const dibujar = () => {
    app.innerHTML = `<div class="row" style="margin:0"><button class="ghost" id="volver">Mis proyectos</button><button id="guardar">Guardar proyecto</button><span id="estado" class="sup" role="status"></span></div>
      <div class="tabs" role="tablist">${T.map((t, i) => `<button role="tab" data-t="${i}" aria-selected="${i === tab}">${t}</button>`).join('')}</div><div id="vista"></div>`;
    app.querySelectorAll('[data-t]').forEach((b) => b.onclick = () => { tab = +b.dataset.t; dibujar(); });
    document.getElementById('volver').onclick = proyectos;
    document.getElementById('guardar').onclick = async () => {
      const e = document.getElementById('estado');
      try { const r = await api('projects', { method: 'POST', body: JSON.stringify({ id, name: d.nombre || 'Sin nombre', data: d }) }); id = r.id; e.textContent = 'Guardado ✓'; } catch (er) { e.textContent = er.message; }
    };
    [ficha, alternativas, dashboard][tab](document.getElementById('vista'));
  };
  const ficha = (v) => {
    v.innerHTML = `<div class="card"><h2>Ficha del proyecto</h2><p class="sup">Describe la decisión y los supuestos generales. La TMAR es la rentabilidad mínima que exiges.</p><div class="grid">
      <label class="wide">Nombre del proyecto<input data-k="nombre" value="${esc(d.nombre)}"></label>
      <label class="wide">Beneficiario (empresa, entidad o comunidad)<input data-k="benef" value="${esc(d.benef)}"></label>
      <label class="wide">Descripción de la decisión<textarea data-k="desc">${esc(d.desc)}</textarea></label>
      <label>TMAR (% anual)<input type="number" step="any" data-k="tmar" value="${esc(d.tmar)}"></label>
      <label>Inflación esperada (% anual)<input type="number" step="any" data-k="inf" value="${esc(d.inf)}"></label></div></div>`;
    v.querySelectorAll('[data-k]').forEach((e) => e.oninput = () => d[e.dataset.k] = e.value);
  };
  const alternativas = (v) => {
    v.innerHTML = `<p class="sup">Ingresa de 2 a 4 alternativas. Los flujos netos crecen con la inflación.</p><div class="alts">${d.alts.map((a, i) => `<div class="card"><h2>Alternativa ${i + 1}</h2>
      ${CAMPOS.map(([k, l, t]) => `<label>${l}<input data-i="${i}" data-k="${k}" type="${t}" step="any" value="${esc(a[k])}"></label>`).join('')}
      ${d.alts.length > 2 ? `<div class="row"><button class="ghost" data-x="${i}">Quitar</button></div>` : ''}</div>`).join('')}</div>
      ${d.alts.length < 4 ? '<div class="row"><button id="mas">Agregar alternativa</button></div>' : ''}`;
    v.querySelectorAll('[data-i]').forEach((e) => e.oninput = () => d.alts[e.dataset.i][e.dataset.k] = e.value);
    v.querySelectorAll('[data-x]').forEach((b) => b.onclick = () => { d.alts.splice(+b.dataset.x, 1); dibujar(); });
    const m = document.getElementById('mas'); if (m) m.onclick = () => { d.alts.push(ALT('Nueva alternativa', 0, 5, 0, 0, 0)); dibujar(); };
  };
  const dashboard = (v) => {
    const tmar = +d.tmar || 0, inf = +d.inf || 0, r = mejor(d.alts, tmar, inf), top = r[0], ok = top.m.caue > 0;
    const nombre = (x) => esc(x.a.nombre || 'Alternativa');
    const barras = (k, tit) => { const mx = Math.max(...r.map((x) => Math.abs(x.m[k])), 1); return `<h3>${tit}</h3>${r.map((x) => `<div class="barra"><span>${nombre(x)}</span><div class="pista"><div class="rel ${x.m[k] < 0 ? 'neg' : ''}" data-w="${Math.abs(x.m[k]) / mx * 100}"></div></div><b>${money(x.m[k])}</b></div>`).join('')}`; };
    const sens = [-3, 0, 3].map((dl) => { const s = mejor(d.alts, tmar + dl, inf)[0]; return `<tr><td>TMAR ${(tmar + dl).toFixed(1)} %</td><td>${esc(s.a.nombre)}</td><td>${money(s.m.caue)}</td></tr>`; }).join('');
    v.innerHTML = `<h2>${esc(d.nombre)}</h2><p class="sup">${d.benef ? 'Beneficiario: ' + esc(d.benef) + '. ' : ''}Supuestos: TMAR ${tmar} % anual, inflación ${inf} % anual, método de comparación CAUE (permite comparar alternativas con distinta vida útil).</p>
      <div class="kpis">${kpi(nombre(top), 'alternativa recomendada')}${kpi(money(top.m.vpn), 'VPN ($)')}${kpi(pct(top.m.tir), 'TIR (% anual)')}${kpi(money(top.m.caue), 'CAUE ($ por año)')}${kpi(top.m.bc.toFixed(2), 'beneficio/costo')}${kpi(top.m.pri === null ? 'Más de ' + top.m.n + ' años' : top.m.pri.toFixed(1) + ' años', 'recuperación')}</div>
      <div class="concl ${ok ? '' : 'no'}"><b>Conclusión.</b> ${ok ? `Conviene <b>${nombre(top)}</b>: tiene el mayor CAUE (${money(top.m.caue)} por año) y supera la TMAR de ${tmar} %.${r[1] ? ` Le sigue ${nombre(r[1])} con ${money(r[1].m.caue)} por año.` : ''}` : 'Ninguna alternativa supera la TMAR exigida. No se recomienda invertir con estos supuestos.'}</div>
      <div class="card" style="margin-top:16px">${barras('caue', 'Comparación por CAUE ($ por año)')}${barras('vpn', 'Comparación por VPN ($)')}</div>
      <h3>Comparación detallada</h3><div class="scroll"><table><tr><th>Alternativa</th><th>VPN ($)</th><th>TIR (%)</th><th>CAUE ($/año)</th><th>B/C</th><th>Vida (años)</th></tr>
      ${r.map((x) => `<tr><td>${nombre(x)}</td><td>${money(x.m.vpn)}</td><td>${pct(x.m.tir)}</td><td>${money(x.m.caue)}</td><td>${x.m.bc.toFixed(2)}</td><td>${x.m.n}</td></tr>`).join('')}</table></div>
      <h3>Sensibilidad a la TMAR</h3><div class="scroll"><table><tr><th>Escenario</th><th>Mejor alternativa</th><th>CAUE ($/año)</th></tr>${sens}</table></div>`;
    requestAnimationFrame(() => setTimeout(() => v.querySelectorAll('.rel').forEach((b) => b.style.width = b.dataset.w + '%'), 40));
  };
  dibujar();
}

inicio();
