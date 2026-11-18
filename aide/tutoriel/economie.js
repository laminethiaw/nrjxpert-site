/* Tutoriel NRJXpert, niveau 4 — calculatrice pas à pas des six notions de l'évaluation de projets (18 nov. 2026) :
 * inflation, taux d'actualisation, coût actualisé, VAN, TRI, temps de retour (simple et actualisé).
 * <div class="eco-calc"></div> : formulaire, tableau des flux année par année, indicateurs et graphique du cumul.
 * Aucune dépendance, fonctionne hors ligne. */
(function(){
  "use strict";
  var EN = (document.documentElement.lang || "fr").toLowerCase().indexOf("en") === 0;
  var T = function(f, e){ return EN ? e : f; };
  var fmt = function(x, d){ if(!isFinite(x)) return "—"; return x.toLocaleString(EN ? "en-GB" : "fr-FR", {minimumFractionDigits: d, maximumFractionDigits: d}); };
  var num = function(el){ var v = parseFloat(String(el.value).replace(/\s/g, "").replace(",", ".")); return isFinite(v) ? v : 0; };

  var FIELDS = [
    ["i0", T("Investissement initial I₀", "Initial investment I₀"), "1000", "kF"],
    ["g", T("Gain ou économie annuel (année 1)", "Annual gain or saving (year 1)"), "250", T("kF/an", "kF/yr")],
    ["c", T("Coûts d'exploitation annuels (année 1)", "Annual operating costs (year 1)"), "0", T("kF/an", "kF/yr")],
    ["gg", T("Évolution annuelle des gains", "Annual change in gains"), "0", T("% (ex. −0,5 : vieillissement des modules)", "% (e.g. −0.5: module ageing)")],
    ["i", T("Inflation des coûts", "Cost inflation"), "0", "%"],
    ["a", T("Taux d'actualisation", "Discount rate"), "8", "%"],
    ["n", T("Durée d'étude", "Study period"), "10", T("ans", "years")],
    ["r", T("Remplacement (ex. batteries)", "Replacement (e.g. batteries)"), "0", T("kF, prix de l'année 0", "kF, year-0 price")],
    ["ry", T("… tous les", "… every"), "0", T("ans (0 = aucun)", "years (0 = none)")]];

  function compute(v){
    var a = v.a / 100, inf = v.i / 100, N = Math.max(1, Math.min(60, Math.round(v.n)));
    var rows = [], cum = -v.i0, cumD = -v.i0, costD = v.i0, pb = NaN, pbD = NaN, flows = [-v.i0];
    for(var n = 1; n <= N; n++){
      var k = Math.pow(1 + inf, n - 1);
      var gain = v.g * Math.pow(1 + (v.gg || 0) / 100, n - 1), cost = v.c * k;
      var repl = v.ry > 0 && n % Math.round(v.ry) === 0 && n < N ? v.r * Math.pow(1 + inf, n) : 0;
      var f = gain - cost - repl, fa = 1 / Math.pow(1 + a, n), fd = f * fa;
      var prev = cum, prevD = cumD;
      cum += f; cumD += fd; costD += (cost + repl) * fa;
      if(isNaN(pb) && cum >= 0 && prev < 0) pb = n - 1 + (-prev) / f;
      if(isNaN(pbD) && cumD >= 0 && prevD < 0) pbD = n - 1 + (-prevD) / fd;
      flows.push(f);
      rows.push({n: n, gain: gain, cost: cost + repl, f: f, fa: fa, fd: fd, cum: cum, cumD: cumD});
    }
    var npv = cumD;
    // TRI : dichotomie sur [−99 %, 1000 %] si la VAN change de signe
    var vanAt = function(r){ var s = 0; for(var j = 0; j < flows.length; j++) s += flows[j] / Math.pow(1 + r, j); return s; };
    var irr = NaN, lo = -0.99, hi = 10, flo = vanAt(lo), fhi = vanAt(hi);
    if(flo * fhi < 0){
      for(var it = 0; it < 200; it++){
        var mid = (lo + hi) / 2, fm = vanAt(mid);
        if(flo * fm <= 0){ hi = mid; fhi = fm; } else { lo = mid; flo = fm; }
      }
      irr = (lo + hi) / 2;
    }
    var signChanges = 0;
    for(var s = 1; s < flows.length; s++) if(flows[s] * flows[s - 1] < 0) signChanges++;
    var real = (1 + a) / (1 + inf) - 1;
    return {rows: rows, npv: npv, irr: irr, pb: pb, pbD: pbD, costD: costD, real: real, signChanges: signChanges, N: N, a: a};
  }

  function chart(res, i0){
    var W = 640, H = 230, L = 58, R = 12, Tp = 14, B = 34;
    var pts = [{n: 0, c: -i0, d: -i0}].concat(res.rows.map(function(r){ return {n: r.n, c: r.cum, d: r.cumD}; }));
    var ys = pts.map(function(p){ return p.c; }).concat(pts.map(function(p){ return p.d; }));
    var ymin = Math.min.apply(null, ys.concat([0])), ymax = Math.max.apply(null, ys.concat([0]));
    if(ymax - ymin < 1) ymax = ymin + 1;
    var X = function(n){ return L + (W - L - R) * n / res.N; }, Y = function(y){ return Tp + (H - Tp - B) * (ymax - y) / (ymax - ymin); };
    var path = function(key){ return pts.map(function(p, k){ return (k ? "L" : "M") + X(p.n).toFixed(1) + "," + Y(p[key]).toFixed(1); }).join(" "); };
    var s = "<svg viewBox='0 0 " + W + " " + H + "' width='100%' style='max-width:" + W + "px' role='img' aria-label='" +
      T("Cumul des flux, simple et actualisé", "Cumulative cash flow, simple and discounted") + "'>";
    s += "<line x1='" + L + "' x2='" + (W - R) + "' y1='" + Y(0) + "' y2='" + Y(0) + "' stroke='currentColor' stroke-opacity='.5'/>";
    for(var k = 0; k <= 4; k++){
      var yv = ymin + (ymax - ymin) * k / 4;
      s += "<text x='" + (L - 6) + "' y='" + (Y(yv) + 4) + "' text-anchor='end' font-size='11' fill='currentColor' fill-opacity='.7'>" + fmt(yv, 0) + "</text>";
      s += "<line x1='" + L + "' x2='" + (W - R) + "' y1='" + Y(yv) + "' y2='" + Y(yv) + "' stroke='currentColor' stroke-opacity='.08'/>";
    }
    var step = res.N <= 12 ? 1 : res.N <= 30 ? 5 : 10;
    for(var n = 0; n <= res.N; n += step)
      s += "<text x='" + X(n) + "' y='" + (H - B + 16) + "' text-anchor='middle' font-size='11' fill='currentColor' fill-opacity='.7'>" + n + "</text>";
    s += "<text x='" + ((L + W - R) / 2) + "' y='" + (H - 4) + "' text-anchor='middle' font-size='11' fill='currentColor' fill-opacity='.7'>" + T("année", "year") + "</text>";
    s += "<path d='" + path("c") + "' fill='none' stroke='#b7791f' stroke-width='2' stroke-dasharray='6 4'/>";
    s += "<path d='" + path("d") + "' fill='none' stroke='#1d5fa8' stroke-width='2.4'/>";
    if(isFinite(res.pbD)) s += "<circle cx='" + X(res.pbD) + "' cy='" + Y(0) + "' r='4.5' fill='#1d5fa8'/>";
    if(isFinite(res.pb)) s += "<circle cx='" + X(res.pb) + "' cy='" + Y(0) + "' r='4' fill='#b7791f'/>";
    s += "<text x='" + (L + 8) + "' y='" + (Tp + 12) + "' font-size='11.5' fill='#1d5fa8'>━ " + T("cumul actualisé (sa valeur finale = VAN)", "discounted cumulative (final value = NPV)") + "</text>";
    s += "<text x='" + (L + 8) + "' y='" + (Tp + 27) + "' font-size='11.5' fill='#b7791f'>╍ " + T("cumul simple (non actualisé)", "simple cumulative (undiscounted)") + "</text>";
    return s + "</svg>";
  }

  function build(div){
    div.classList.add("calc");
    var h = document.createElement("h4");
    h.textContent = T("Les six indicateurs d'un projet, année par année", "The six project indicators, year by year");
    div.appendChild(h);
    var inputs = {};
    FIELDS.forEach(function(f){
      var row = document.createElement("div"); row.className = "row";
      var lab = document.createElement("label"); lab.textContent = f[1];
      var inp = document.createElement("input"); inp.value = EN ? String(f[2]).replace(",", ".") : f[2]; inp.inputMode = "decimal";
      var u = document.createElement("span"); u.textContent = f[3];
      lab.htmlFor = inp.id = "eco-" + f[0] + "-" + Math.random().toString(36).slice(2, 7);
      row.appendChild(lab); row.appendChild(inp); row.appendChild(u); div.appendChild(row);
      inputs[f[0]] = inp;
      inp.addEventListener("input", upd);
    });
    var presets = document.createElement("div");
    presets.style.margin = "8px 0";
    [[T("Projet de Mme Diop", "Mrs Diop's project"), {i0: 1000, g: 250, gg: 0, c: 0, i: 0, a: 8, n: 10, r: 0, ry: 0}],
     [T("Centrale PV 10 kWc (ex. 4.3)", "10 kWp PV plant (ex. 4.3)"), {i0: 5000, g: 948.6, gg: -0.5, c: 154.5, i: 3, a: 8, n: 20, r: 600, ry: 10}],
     [T("Remplacer un groupe (exercice 1)", "Replace a genset (exercise 1)"), {i0: 18000, g: 3400, gg: 0, c: 300, i: 0, a: 8, n: 20, r: 6000, ry: 7}]].forEach(function(p){
      var b = document.createElement("button");
      b.type = "button"; b.textContent = p[0]; b.style.marginRight = "8px";
      b.onclick = function(){ Object.keys(p[1]).forEach(function(k){ inputs[k].value = EN ? String(p[1][k]) : String(p[1][k]).replace(".", ","); }); upd(); };
      presets.appendChild(b);
    });
    div.appendChild(presets);
    var out = document.createElement("div"); out.className = "out"; div.appendChild(out);
    var fig = document.createElement("div"); fig.style.margin = "10px 0"; div.appendChild(fig);
    var det = document.createElement("details");
    var sum = document.createElement("summary"); sum.textContent = T("Tableau des flux année par année", "Year-by-year cash-flow table");
    det.appendChild(sum);
    var tab = document.createElement("div"); tab.style.overflowX = "auto"; det.appendChild(tab);
    div.appendChild(det);

    function upd(){
      var v = {};
      Object.keys(inputs).forEach(function(k){ v[k] = num(inputs[k]); });
      var r = compute(v);
      var verdict = r.npv > 0 ? T("rentable : il crée de la valeur au taux de ", "profitable: it creates value at the rate of ") + fmt(v.a, 1) + " %"
                  : r.npv < 0 ? T("non rentable au taux de ", "not profitable at the rate of ") + fmt(v.a, 1) + " %" : T("tout juste équilibré", "just break-even");
      var o = "<b>" + T("VAN", "NPV") + " = " + fmt(r.npv, 1) + " kF</b> — " + verdict + "<br>";
      o += "<b>" + T("TRI", "IRR") + " = " + (isFinite(r.irr) ? fmt(r.irr * 100, 1) + " %" : "—") + "</b>" +
           (isFinite(r.irr) ? (r.irr > r.a ? T(" &gt; taux d'actualisation : rendement suffisant", " &gt; discount rate: adequate return") : T(" ≤ taux d'actualisation : rendement insuffisant", " ≤ discount rate: insufficient return")) : T(" (la VAN ne s'annule pas)", " (NPV never reaches zero)")) +
           (r.signChanges > 1 ? T(" ⚠ flux changeant plusieurs fois de signe : TRI à interpréter avec prudence", " ⚠ cash flows change sign several times: interpret the IRR with care") : "") + "<br>";
      o += T("Temps de retour simple = ", "Simple payback = ") + "<b>" + (isFinite(r.pb) ? fmt(r.pb, 1) + T(" ans", " years") : T("non atteint", "not reached")) + "</b> ; " +
           T("actualisé = ", "discounted = ") + "<b>" + (isFinite(r.pbD) ? fmt(r.pbD, 1) + T(" ans", " years") : T("non atteint", "not reached")) + "</b><br>";
      o += T("Coût actualisé (investissement + coûts) = ", "Discounted cost (investment + costs) = ") + "<b>" + fmt(r.costD, 1) + " kF</b> ; " +
           T("taux réel = (1 + a)/(1 + i) − 1 = ", "real rate = (1 + d)/(1 + i) − 1 = ") + "<b>" + fmt(r.real * 100, 2) + " %</b>";
      out.innerHTML = o;
      fig.innerHTML = chart(r, v.i0);
      var t = "<table><tr><th>" + T("Année", "Year") + "</th><th>" + T("Gain", "Gain") + "</th><th>" + T("Coûts", "Costs") + "</th><th>" + T("Flux", "Cash flow") +
              "</th><th>1/(1+a)<sup>n</sup></th><th>" + T("Flux actualisé", "Discounted flow") + "</th><th>" + T("Cumul simple", "Simple cumulative") + "</th><th>" + T("Cumul actualisé", "Discounted cumulative") + "</th></tr>";
      t += "<tr><td>0</td><td></td><td class='num'>" + fmt(v.i0, 1) + "</td><td class='num'>" + fmt(-v.i0, 1) + "</td><td class='num'>1,000</td><td class='num'>" + fmt(-v.i0, 1) + "</td><td class='num'>" + fmt(-v.i0, 1) + "</td><td class='num'>" + fmt(-v.i0, 1) + "</td></tr>";
      r.rows.forEach(function(x){
        t += "<tr><td>" + x.n + "</td><td class='num'>" + fmt(x.gain, 1) + "</td><td class='num'>" + fmt(x.cost, 1) + "</td><td class='num'>" + fmt(x.f, 1) + "</td><td class='num'>" + fmt(x.fa, 3) +
             "</td><td class='num'>" + fmt(x.fd, 1) + "</td><td class='num'>" + fmt(x.cum, 1) + "</td><td class='num'" + (x.cumD >= 0 ? " style='font-weight:600'" : "") + ">" + fmt(x.cumD, 1) + "</td></tr>";
      });
      tab.innerHTML = t.replace("1,000", fmt(1, 3)) + "</table>";
    }
    upd();
  }
  function init(){ document.querySelectorAll(".eco-calc").forEach(build); }
  window.NRJXpertEco = {compute: compute};
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
