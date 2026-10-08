// ---------- Utilidades ----------
const app = document.getElementById('app');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const money = (v) => { const r = Math.round(v); return (r < 0 ? '−$' : '$') + Math.abs(r).toLocaleString('es-CO'); };
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
const COL = ['#2563eb', '#059669', '#f59e0b', '#dc2626', '#60a5fa', '#34d399'];
const av = (i = 0, s = 40) => `<svg class="av" width="${s}" height="${s}" viewBox="0 0 40 40" role="img" aria-label="Avatar ${i + 1}"><circle cx="20" cy="20" r="20" fill="${COL[i % 6]}"/><circle cx="14" cy="17" r="2.4" fill="#1f2937"/><circle cx="26" cy="17" r="2.4" fill="#1f2937"/><path d="M12 25q8 ${6 + (i % 3) * 3} 16 0" stroke="#1f2937" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>`;
const MASCOTA = `<svg class="mascota" viewBox="0 0 200 200" role="img" aria-label="Viabi, la moneda mascota"><circle cx="100" cy="100" r="86" fill="#f59e0b"/><circle cx="100" cy="100" r="68" fill="#fef3c7" stroke="#d97706" stroke-width="4"/><text x="100" y="78" text-anchor="middle" font-family="Inter,sans-serif" font-weight="800" font-size="34" fill="#b45309">$</text><circle cx="78" cy="102" r="7" fill="#1f2937"/><circle cx="122" cy="102" r="7" fill="#1f2937"/><circle cx="80" cy="100" r="2.5" fill="#fff"/><circle cx="124" cy="100" r="2.5" fill="#fff"/><path d="M76 128q24 22 48 0" stroke="#1f2937" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`;

const PORTADA = `<svg class="ilus" viewBox="0 0 440 330" role="img" aria-label="Gráfica de barras que compara tres alternativas de inversión, con la mejor señalada, y una moneda sonriente que dice: decide con números"><rect width="440" height="330" rx="18" fill="#eff6ff"/><rect x="24" y="30" width="262" height="210" rx="14" fill="#fff" stroke="#cbd5e1" stroke-width="2"/><text x="42" y="52" font-family="Inter,sans-serif" font-weight="700" font-size="12" fill="#64748b">Costo anual equivalente por alternativa</text><path d="M44 204h226" stroke="#94a3b8" stroke-width="2"/><rect x="64" y="134" width="46" height="70" rx="5" fill="#2563eb"/><rect x="132" y="109" width="46" height="95" rx="5" fill="#f59e0b"/><rect x="200" y="86" width="46" height="118" rx="5" fill="#059669"/><text x="87" y="224" text-anchor="middle" font-family="Inter,sans-serif" font-weight="700" font-size="13" fill="#475569">A</text><text x="155" y="224" text-anchor="middle" font-family="Inter,sans-serif" font-weight="700" font-size="13" fill="#475569">B</text><text x="223" y="224" text-anchor="middle" font-family="Inter,sans-serif" font-weight="700" font-size="13" fill="#475569">C</text><rect x="183" y="60" width="80" height="20" rx="10" fill="#059669"/><path d="M193 70l4 4 7-8" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><text x="234" y="74" text-anchor="middle" font-family="Inter,sans-serif" font-weight="700" font-size="12" fill="#fff">Conviene</text><rect x="24" y="254" width="80" height="28" rx="14" fill="#2563eb"/><text x="64" y="273" text-anchor="middle" font-family="Inter,sans-serif" font-weight="700" font-size="13" fill="#fff">VPN</text><rect x="112" y="254" width="80" height="28" rx="14" fill="#059669"/><text x="152" y="273" text-anchor="middle" font-family="Inter,sans-serif" font-weight="700" font-size="13" fill="#fff">TIR</text><rect x="200" y="254" width="86" height="28" rx="14" fill="#f59e0b"/><text x="243" y="273" text-anchor="middle" font-family="Inter,sans-serif" font-weight="700" font-size="13" fill="#1f2937">CAUE</text><rect x="292" y="30" width="130" height="46" rx="12" fill="#fff" stroke="#2563eb" stroke-width="2"/><path d="M332 76l-8 14 22-12z" fill="#fff" stroke="#2563eb" stroke-width="2"/><rect x="326" y="72" width="22" height="8" fill="#fff"/><text x="357" y="50" text-anchor="middle" font-family="Inter,sans-serif" font-weight="700" font-size="13" fill="#1e293b">¡Decide con</text><text x="357" y="67" text-anchor="middle" font-family="Inter,sans-serif" font-weight="700" font-size="13" fill="#1e293b">números!</text><path d="M302 150q-18-24-40-46" stroke="#059669" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M258 112l4-18 14 10z" fill="#059669"/><circle cx="352" cy="178" r="58" fill="#f59e0b"/><circle cx="352" cy="178" r="45" fill="#fef3c7" stroke="#d97706" stroke-width="4"/><text x="352" y="162" text-anchor="middle" font-family="Inter,sans-serif" font-weight="800" font-size="26" fill="#b45309">$</text><circle cx="336" cy="182" r="6" fill="#1f2937"/><circle cx="368" cy="182" r="6" fill="#1f2937"/><circle cx="338" cy="180" r="2" fill="#fff"/><circle cx="370" cy="180" r="2" fill="#fff"/><path d="M335 200q17 15 34 0" stroke="#1f2937" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="352" cy="304" rx="34" ry="9" fill="#d97706"/><ellipse cx="352" cy="296" rx="34" ry="9" fill="#f59e0b"/><ellipse cx="352" cy="288" rx="34" ry="9" fill="#fbbf24"/></svg>`;

function cabecera() {
  const u = document.getElementById('user');
  u.innerHTML = '<button class="ghost" id="n-inicio">Inicio</button>' + (user
    ? `<button class="ghost" id="n-proy">Mis proyectos</button><button class="yo" id="perfil" aria-label="Mi perfil">${av(user.avatar, 36)}</button><button class="ghost" id="salir">Cerrar sesión</button>`
    : '<button id="n-entrar">Entrar</button>');
  document.getElementById('n-inicio').onclick = landing;
  if (user) { document.getElementById('n-proy').onclick = proyectos; document.getElementById('perfil').onclick = perfil; document.getElementById('salir').onclick = salir; }
  else document.getElementById('n-entrar').onclick = acceso;
}
function inicio() { cabecera(); landing(); }

function landing() {
  app.innerHTML = `
    <section class="hero">
      <div><h1>Decide en qué invertir, con números.</h1>
        <p>Viabilia compara alternativas de inversión con VPN, TIR y CAUE, y te dice cuál conviene. Pensada para tiendas de barrio, microempresas y estudiantes de ingeniería económica.</p>
        <div class="row"><button id="empezar">${user ? 'Ir a mis proyectos' : 'Empezar'}</button><button class="ghost" id="como">Ver cómo funciona</button></div></div>
      ${PORTADA}
    </section>
    <section class="card problema"><h2>Invertir sin comparar es adivinar</h2>
      <p>¿Compro o arriendo? ¿Reparo o reemplazo? ¿Qué proyecto me deja más? Cada decisión de inversión cuesta plata y dura años. Viabilia convierte esa duda en una comparación con números: cuánto cuesta o rinde cada opción por año y cuál conviene según lo mínimo que quieres ganar.</p></section>
    <section id="pasos"><h2>Cómo funciona</h2><div class="pasos">
      <div class="card paso" style="--c:#2563eb"><span>1</span><b>Ingresa tus alternativas</b><p>Inversión, vida útil, ingresos y costos de cada opción, en pesos.</p></div>
      <div class="card paso" style="--c:#059669"><span>2</span><b>Compara con indicadores</b><p>VPN, TIR, CAUE, beneficio/costo y recuperación, con gráficas.</p></div>
      <div class="card paso" style="--c:#f59e0b"><span>3</span><b>Decide con una conclusión</b><p>Una frase clara dice cuál conviene y qué pasa si cambia la tasa.</p></div></div></section>
    <p class="sup pie">Proyecto académico de Ingeniería Económica · Universidad de Cartagena</p>`;
  document.getElementById('empezar').onclick = () => (user ? proyectos() : acceso());
  document.getElementById('como').onclick = () => document.getElementById('pasos').scrollIntoView({ behavior: 'smooth' });
}

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
const kpi = (v, l, c = '') => `<div class="kpi ${c}"><b>${v}</b><span>${l}</span></div>`;
const mejor = (alts, tmar, inf) => alts.map((a) => ({ a, m: calc(a, tmar, inf) })).sort((x, y) => y.m.caue - x.m.caue);

// ---------- Pantallas ----------
function acceso() {
  app.innerHTML = `
    <section class="hero">
      <div><h1>Entra a Viabilia</h1>
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
      localStorage.token = r.token; localStorage.user = JSON.stringify(r.user); user = r.user; cabecera(); proyectos();
    } catch (er) { document.getElementById('err').textContent = er.message; }
  };
}

function perfil() {
  app.innerHTML = `<h1>Mi perfil</h1><div class="card"><p>${esc(user.email)}</p><h2>Elige tu avatar</h2><div class="avs">${[0,1,2,3,4,5].map((i) => `<button data-i="${i}" aria-pressed="${i === user.avatar}" aria-label="Avatar ${i + 1}">${av(i, 64)}</button>`).join('')}</div><div class="row"><button class="ghost" id="atras">Volver a mis proyectos</button></div></div><h2 style="margin-top:22px">Mis proyectos</h2><div class="lista" id="pl"><p class="sup">Cargando…</p></div>`;
  app.querySelectorAll('[data-i]').forEach((b) => b.onclick = async () => {
    user.avatar = +b.dataset.i; localStorage.user = JSON.stringify(user);
    await api('auth', { method: 'POST', body: JSON.stringify({ action: 'avatar', avatar: user.avatar }) }).catch(() => {});
    cabecera(); perfil();
  });
  document.getElementById('atras').onclick = proyectos;
  api('projects').then((l) => {
    const c = document.getElementById('pl'); if (!c) return;
    c.innerHTML = l.length ? l.map((p) => `<div class="card proy"><b>${esc(p.name)}</b><br><small>Editado ${new Date(p.updated).toLocaleDateString('es-CO')}</small><div class="row"><button data-o="${p.id}">Abrir</button></div></div>`).join('') : '<p class="sup">Aún no tienes proyectos.</p>';
    c.querySelectorAll('[data-o]').forEach((b) => b.onclick = async () => editor(await api('projects?id=' + b.dataset.o)));
  }).catch(() => {});
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

const MON = ['inv', 'salv', 'ing', 'cos'];
function validar(d) {
  const e = [];
  if (!(+d.tmar > 0)) e.push('Ficha: escribe una TMAR mayor a 0 % (la rentabilidad mínima anual que exiges).');
  d.alts.forEach((a, i) => {
    const n = `Alternativa ${i + 1}`;
    if (!String(a.nombre).trim()) e.push(`${n}: escribe un nombre para identificarla.`);
    if (!(+a.vida >= 1)) e.push(`${n}: la vida útil debe ser de 1 año o más.`);
    if (a.inv === '' || !(+a.inv >= 0)) e.push(`${n}: escribe la inversión inicial en pesos (puede ser 0).`);
    if (!(+a.ing > 0)) e.push(`${n}: escribe los ingresos anuales en pesos (mayores a 0).`);
  });
  return e;
}
const AYUDA = `<div class="nota"><b>Cómo leer el resultado.</b> Se recomienda la alternativa con mayor CAUE (costo anual uniforme equivalente), porque permite comparar alternativas con distinta vida útil. Una TIR muy alta (por ejemplo, más de 100 %) aparece cuando la inversión inicial es pequeña frente a los flujos anuales, como en un arriendo; por eso no se usa sola para decidir.</div>
<details class="card" style="margin-top:14px"><summary>¿De dónde salen los números? Fórmulas y supuestos</summary>
<p class="formula">VPN = −I + Σ Fₜ / (1 + i)ᵗ</p><p class="formula">CAUE = VPN · i / (1 − (1 + i)⁻ⁿ)</p><p class="formula">B/C = VP(ingresos + salvamento) / (I + VP(costos))</p>
<ul class="sup"><li>i = TMAR; I = inversión inicial; n = vida útil en años.</li><li>Flujo neto del año t: Fₜ = (ingresos − costos) · (1 + inflación)ᵗ⁻¹. El valor de salvamento se suma en el último año.</li><li>TIR: la tasa que hace el VPN igual a cero. Recuperación: año en que el flujo acumulado pasa a ser positivo.</li></ul></details>`;
function editor(p) {
  const d = p ? p.data : { nombre: 'Compra de equipo para mi negocio', benef: '', desc: '', tmar: 12, inf: 5,
    alts: [ALT('Comprar equipo nuevo', 60e6, 8, 10e6, 30e6, 8e6), ALT('Comprar equipo usado', 35e6, 5, 4e6, 24e6, 10e6), ALT('Arrendar equipo', 3e6, 5, 0, 24e6, 17e6)] };
  let id = p ? p.id : null, tab = 0;
  const T = ['1. Ficha del proyecto', '2. Alternativas', '3. Dashboard'];
  const dibujar = () => {
    app.innerHTML = `<div class="row" style="margin:0"><button class="ghost" id="volver">Mis proyectos</button><button id="guardar">Guardar proyecto</button><span id="estado" class="sup" role="status"></span></div>
      <div class="nota">Cómo usar: 1) completa la ficha del proyecto, 2) ingresa de 2 a 4 alternativas, 3) revisa el dashboard y guarda tu proyecto.</div><div class="tabs" role="tablist">${T.map((t, i) => `<button role="tab" data-t="${i}" aria-selected="${i === tab}">${t}</button>`).join('')}</div><div id="vista"></div>`;
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
      ${CAMPOS.map(([k, l, t]) => `<label>${l}<input data-i="${i}" data-k="${k}" type="${t}" step="any" value="${esc(a[k])}">${MON.includes(k) ? `<small class="fmt">${money(a[k])}</small>` : ''}</label>`).join('')}
      ${d.alts.length > 2 ? `<div class="row"><button class="ghost" data-x="${i}">Quitar</button></div>` : ''}</div>`).join('')}</div>
      ${d.alts.length < 4 ? '<div class="row"><button id="mas">Agregar alternativa</button></div>' : ''}`;
    v.querySelectorAll('[data-i]').forEach((e) => e.oninput = () => { d.alts[e.dataset.i][e.dataset.k] = e.value; const f = e.nextElementSibling; if (f) f.textContent = money(e.value); });
    v.querySelectorAll('[data-x]').forEach((b) => b.onclick = () => { d.alts.splice(+b.dataset.x, 1); dibujar(); });
    const m = document.getElementById('mas'); if (m) m.onclick = () => { d.alts.push(ALT('Nueva alternativa', 0, 5, 0, 0, 0)); dibujar(); };
  };
  const dashboard = (v) => {
    const errs = validar(d);
    if (errs.length) { v.innerHTML = `<div class="alerta"><b>Falta completar datos para ver el dashboard:</b><ul>${errs.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>Corrígelos en las pestañas 1 y 2.</div>`; return; }
    const tmar = +d.tmar || 0, inf = +d.inf || 0, r = mejor(d.alts, tmar, inf), top = r[0], ok = top.m.caue > 0;
    const nombre = (x) => esc(x.a.nombre || 'Alternativa');
    const barras = (k, tit) => { const mx = Math.max(...r.map((x) => Math.abs(x.m[k])), 1); return `<h3>${tit}</h3>${r.map((x) => `<div class="barra"><span>${nombre(x)}</span><div class="pista"><div class="rel ${x.m[k] < 0 ? 'neg' : ''}" data-w="${Math.abs(x.m[k]) / mx * 100}"></div></div><b>${money(x.m[k])}</b></div>`).join('')}`; };
    const sens = [-3, 0, 3].map((dl) => { const s = mejor(d.alts, tmar + dl, inf)[0]; return `<tr><td>TMAR ${(tmar + dl).toFixed(1)} %</td><td>${esc(s.a.nombre)}</td><td>${money(s.m.caue)}</td></tr>`; }).join('');
    v.innerHTML = `<div class="row" style="margin:0;justify-content:space-between"><h2>${esc(d.nombre)}</h2><button class="ghost" onclick="window.print()">Imprimir o guardar PDF</button></div><p class="sup">${d.benef ? 'Beneficiario: ' + esc(d.benef) + '. ' : ''}Supuestos: TMAR ${tmar} % anual, inflación ${inf} % anual, método de comparación CAUE (permite comparar alternativas con distinta vida útil).</p>
      <div class="kpis">${kpi(nombre(top), 'alternativa recomendada')}${kpi(money(top.m.vpn), 'VPN ($)', 'clave')}${kpi(pct(top.m.tir), 'TIR (% anual)')}${kpi(money(top.m.caue), 'CAUE ($ por año)', 'clave')}${kpi(top.m.bc.toFixed(2), 'beneficio/costo')}${kpi(top.m.pri === null ? 'Más de ' + top.m.n + ' años' : top.m.pri.toFixed(1) + ' años', 'recuperación')}</div>
      <div class="concl ${ok ? '' : 'no'}"><b>Conclusión.</b> ${ok ? `Conviene <b>${nombre(top)}</b>: tiene el mayor CAUE (${money(top.m.caue)} por año) y supera la TMAR de ${tmar} %.${r[1] ? (r[1].m.caue > 0 ? ` Le sigue ${nombre(r[1])} con ${money(r[1].m.caue)} por año.` : ` ${nombre(r[1])} no supera la TMAR de ${tmar} %: su CAUE es ${money(r[1].m.caue)} por año.`) : ''}` : 'Ninguna alternativa supera la TMAR exigida. No se recomienda invertir con estos supuestos.'}</div>
      <div class="card" style="margin-top:16px">${barras('caue', 'Comparación por CAUE ($ por año)')}${barras('vpn', 'Comparación por VPN ($)')}</div>
      <h3>Comparación detallada</h3><div class="scroll"><table><tr><th>Alternativa</th><th>VPN ($)</th><th>TIR (%)</th><th>CAUE ($/año)</th><th>B/C</th><th>Vida (años)</th></tr>
      ${r.map((x) => `<tr><td>${nombre(x)}</td><td>${money(x.m.vpn)}</td><td>${pct(x.m.tir)}</td><td>${money(x.m.caue)}</td><td>${x.m.bc.toFixed(2)}</td><td>${x.m.n}</td></tr>`).join('')}</table></div>
      <h3>Sensibilidad a la TMAR</h3><div class="scroll"><table><tr><th>Escenario</th><th>Mejor alternativa</th><th>CAUE ($/año)</th></tr>${sens}</table></div>${AYUDA}`;
    requestAnimationFrame(() => setTimeout(() => v.querySelectorAll('.rel').forEach((b) => b.style.width = b.dataset.w + '%'), 40));
  };
  dibujar();
}

inicio();
