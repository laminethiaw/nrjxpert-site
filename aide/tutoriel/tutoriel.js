/* Tutoriel NRJXpert — QCM interactifs et calculatrices (aucune dépendance, fonctionne hors ligne) */
(function(){
  "use strict";
  var EN = (document.documentElement.lang || "fr").indexOf("en") === 0;
  var T = function(f, e){ return EN ? e : f; };
  var fr = function(x, d){ if(!isFinite(x)) return "—"; return x.toLocaleString(EN ? "en-GB" : "fr-FR", {minimumFractionDigits:d, maximumFractionDigits:d}); };
  var num = function(el){ var v = String(el.value).replace(/\s/g, "").replace(",", "."); return parseFloat(v); };

  /* ------------------------------------------------------------ QCM
     <div class="qcm" data-answer="b"><p class="q">…</p><ol><li data-k="a">…</li>…</ol><div class="fb">explication</div></div> */
  function initQcm(){
    var qs = document.querySelectorAll(".qcm");
    if(!qs.length) return;
    var score = document.createElement("div");
    score.className = "score";
    var ok = 0, done = 0;
    var en = (document.documentElement.lang || "fr").indexOf("en") === 0;
    var upd = function(){ score.textContent = en ? "Quiz: " + ok + " / " + done + " correct answers (" + qs.length + " questions)"
        : "QCM : " + ok + " / " + done + " réponses justes (" + qs.length + " questions)"; };
    upd();
    document.querySelector("main").appendChild(score);
    qs.forEach(function(q){
      var ans = q.getAttribute("data-answer");
      q.querySelectorAll("li").forEach(function(li){
        li.addEventListener("click", function(){
          if(q.classList.contains("done")) return;
          q.classList.add("done");
          done++;
          var k = li.getAttribute("data-k");
          if(k === ans){ li.classList.add("ok"); ok++; }
          else{
            li.classList.add("ko");
            var good = q.querySelector('li[data-k="' + ans + '"]');
            if(good) good.classList.add("ok");
          }
          upd();
        });
      });
    });
    var reset = document.createElement("button");
    reset.textContent = en ? "Start again" : "Recommencer";
    reset.style.marginLeft = "10px";
    reset.onclick = function(){ qs.forEach(function(q){ q.classList.remove("done"); q.querySelectorAll("li").forEach(function(l){ l.classList.remove("ok", "ko"); }); }); ok = done = 0; upd(); score.appendChild(reset); };
    score.appendChild(reset);
  }

  /* ------------------------------------------------------------ calculatrices
     <div class="calc" data-calc="cable"></div> : le contenu est créé ici */
  function form(div, title, fields, compute){
    var h = document.createElement("h4"); h.textContent = title; div.appendChild(h);
    var inputs = {};
    fields.forEach(function(f){
      var row = document.createElement("div"); row.className = "row";
      var lab = document.createElement("label"); lab.textContent = f[1]; row.appendChild(lab);
      var inp;
      if(Array.isArray(f[2])){
        inp = document.createElement("select");
        f[2].forEach(function(o){ var op = document.createElement("option"); op.value = o[0]; op.textContent = o[1]; inp.appendChild(op); });
      }else{ inp = document.createElement("input"); inp.value = EN ? String(f[2]).replace(/(\d),(\d)/g, "$1.$2") : f[2]; }
      row.appendChild(inp);
      var u = document.createElement("span"); u.className = "small"; u.textContent = f[3] || ""; row.appendChild(u);
      div.appendChild(row);
      inputs[f[0]] = inp;
      inp.addEventListener("input", run);
      inp.addEventListener("change", run);
    });
    var out = document.createElement("div"); out.className = "out"; div.appendChild(out);
    function run(){
      var v = {};
      for(var k in inputs) v[k] = inputs[k].tagName === "SELECT" ? inputs[k].value : num(inputs[k]);
      try{ out.innerHTML = compute(v); }catch(e){ out.textContent = T("Saisie incomplète.", "Incomplete input."); }
    }
    run();
  }
  function gamma(z){   // Lanczos
    if(z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    var g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059,
      12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    z -= 1; var x = c[0];
    for(var i = 1; i < g + 2; i++) x += c[i] / (z + i);
    var t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  }
  /* câble : même méthode que NRJXpert (pv/CableSizing.java) */
  var SECT = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300];
  var IZ2 = [24, 33, 45, 58, 80, 107, 138, 171, 209, 269, 328, 382, 441, 506, 599, 693];
  var IZ3 = [22, 30, 40, 52, 71, 96, 119, 147, 179, 229, 278, 322, 371, 424, 500, 576];
  var RAT = [2, 4, 6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600];
  var CALCS = {
    cable: function(div){
      form(div, T("Section d'un câble (courant admissible et chute de tension)", "Cable cross-section (current rating and voltage drop)"), [
        ["kind", T("Nature du circuit", "Type of circuit"), [["dc", T("Continu (2 conducteurs)", "DC (2 conductors)")], ["ac1", T("Monophasé", "Single-phase")], ["ac3", T("Triphasé", "Three-phase")]]],
        ["i", T("Courant nominal", "Rated current"), "36", "A"], ["k", T("Coefficient de sécurité", "Safety factor"), "1,25", T("1,25 côté PV", "1.25 on the PV side")],
        ["u", T("Tension (composée en triphasé)", "Voltage (line-to-line in three-phase)"), "24", "V"], ["l", T("Longueur aller", "One-way length"), "15", "m"],
        ["du", T("Chute de tension maximale", "Maximum voltage drop"), "3", "%"], ["ta", T("Température ambiante", "Ambient temperature"), "40", "°C"],
        ["kg", T("Facteur de groupement", "Grouping factor"), "0,8", ""], ["mat", T("Matériau", "Material"), [["cu", T("Cuivre (ρ = 0,0225)", "Copper (ρ = 0.0225)")], ["al", T("Aluminium (ρ = 0,036)", "Aluminium (ρ = 0.036)")]]],
        ["cos", T("cos φ (alternatif)", "cos φ (AC)"), "0,9", ""]],
      function(v){
        var al = v.mat === "al", rho = al ? 0.036 : 0.0225, ib = v.i * v.k;
        var inn = RAT.find(function(r){ return r >= ib - 1e-9; }) || Math.ceil(ib / 100) * 100;
        var kt = Math.sqrt((90 - Math.min(85, v.ta)) / 60), kk = kt * v.kg;
        var b = v.kind === "ac3" ? 1 : 2, cos = v.kind === "dc" ? 1 : v.cos, sin = Math.sqrt(Math.max(0, 1 - cos * cos));
        var vref = v.kind === "ac3" ? v.u / Math.sqrt(3) : v.u;
        var drop = function(s){ return 100 * b * (rho * v.l / s * cos + 0.08e-3 * v.l * sin) * v.i / vref; };
        var iz = function(i){ return (v.kind === "ac3" ? IZ3 : IZ2)[i] * (al ? 0.78 : 1) * kk; };
        var ic = -1, id = -1;
        for(var i = al ? 5 : 0; i < SECT.length; i++){
          if(ic < 0 && iz(i) >= inn) ic = i;
          if(id < 0 && drop(SECT[i]) <= v.du) id = i;
        }
        if(ic < 0 || id < 0) return T("Au-delà de 300 mm² : conducteurs en parallèle, ou tension plus élevée.", "Above 300 mm²: conductors in parallel, or a higher voltage.");
        var j = Math.max(ic, id), s = SECT[j], n = v.kind === "ac3" ? 3 : 2;
        var pj = n * rho * v.l / s * v.i * v.i;
        return "Ib = " + fr(ib, 1) + T(" A ; protection <b>", " A; protection <b>") + inn + T(" A</b> ; kθ × kg = ", " A</b>; kθ × kg = ") + fr(kk, 3) + "<br>" +
          T("Section par l'échauffement : ", "Cross-section from heating: ") + SECT[ic] + " mm² (Iz = " + fr(iz(ic), 1) + T(" A) ; par la chute de tension : ", " A); from the voltage drop: ") + SECT[id] + " mm²<br>" +
          T("<b>Section retenue : ", "<b>Cross-section chosen: ") + (EN ? String(s) : String(s).replace(".", ",")) + " mm²</b> (" + (id > ic ? T("chute de tension", "voltage drop") : T("courant admissible", "current rating")) + T(") ; ΔU = <b>", "); ΔU = <b>") +
          fr(drop(s), 2) + T(" %</b> ; pertes Joule = ", " %</b>; Joule losses = ") + fr(pj, 1) + " W";
      });
    },
    pu: function(div){
      form(div, T("Système per-unit (valeurs de base triphasées)", "Per-unit system (three-phase base values)"), [
        ["s", T("Puissance de base Sb", "Base power Sb"), "10", "MVA"], ["u", T("Tension de base Ub (composée)", "Base voltage Ub (line-to-line)"), "30", "kV"],
        ["r", T("Résistance", "Resistance"), "4,05", "Ω"], ["x", T("Réactance", "Reactance"), "5,7", "Ω"]],
      function(v){
        var zb = v.u * v.u / v.s, ib = v.s * 1e6 / (Math.sqrt(3) * v.u * 1e3);
        return "Zb = Ub²/Sb = <b>" + fr(zb, 4) + T(" Ω</b> ; Ib = Sb/(√3·Ub) = <b>", " Ω</b>; Ib = Sb/(√3·Ub) = <b>") + fr(ib, 1) + " A</b><br>" +
          "Z = " + fr(v.r / zb, 4) + " + j" + fr(v.x / zb, 4) + T(" pu ; |Z| = ", " pu; |Z| = ") + fr(Math.hypot(v.r, v.x) / zb, 4) + " pu";
      });
    },
    icc3: function(div){
      form(div, T("Courant de court-circuit triphasé (CEI 60909)", "Three-phase short-circuit current (IEC 60909)"), [
        ["un", T("Tension nominale Un", "Nominal voltage Un"), "20", "kV"], ["c", T("Facteur de tension c", "Voltage factor c"), "1,1", T("1,1 au-delà de 1 kV (Icc max)", "1.1 above 1 kV (maximum Isc)")],
        ["r", T("Résistance R1 vue du défaut", "Resistance R1 seen from the fault"), "3,1", "Ω"], ["x", T("Réactance X1 vue du défaut", "Reactance X1 seen from the fault"), "5,5", "Ω"]],
      function(v){
        var z = Math.hypot(v.r, v.x), ik = v.c * v.un * 1e3 / (Math.sqrt(3) * z), kap = 1.02 + 0.98 * Math.exp(-3 * v.r / v.x);
        return "I\"k = c·Un/(√3·|Z1|) = <b>" + fr(ik / 1000, 3) + T(" kA</b> ; κ = 1,02 + 0,98·e<sup>−3R/X</sup> = ", " kA</b>; κ = 1.02 + 0.98·e<sup>−3R/X</sup> = ") + fr(kap, 3) +
          T(" ; ip = κ·√2·I\"k = <b>", "; ip = κ·√2·I\"k = <b>") + fr(kap * Math.SQRT2 * ik / 1000, 3) + T(" kA</b> ; S\"k = √3·Un·I\"k = ", " kA</b>; S\"k = √3·Un·I\"k = ") + fr(Math.sqrt(3) * v.un * ik / 1000, 1) + " MVA";
      });
    },
    fortescue: function(div){
      form(div, T("Composantes symétriques (Fortescue)", "Symmetrical components (Fortescue)"), [
        ["va", T("Module de la phase A", "Phase A magnitude"), "220", "V"], ["pa", T("Phase A", "Phase A angle"), "0", "°"],
        ["vb", T("Module de la phase B", "Phase B magnitude"), "200", "V"], ["pb", T("Phase B", "Phase B angle"), "-110", "°"],
        ["vc", T("Module de la phase C", "Phase C magnitude"), "180", "V"], ["pc", T("Phase C", "Phase C angle"), "130", "°"]],
      function(v){
        var d = Math.PI / 180;
        function pol(m, p){ return [m * Math.cos(p * d), m * Math.sin(p * d)]; }
        function mul(z, w){ return [z[0] * w[0] - z[1] * w[1], z[0] * w[1] + z[1] * w[0]]; }
        function add(){ var r = [0, 0]; for(var i = 0; i < arguments.length; i++){ r[0] += arguments[i][0]; r[1] += arguments[i][1]; } return r; }
        function sc(z, k){ return [z[0] * k, z[1] * k]; }
        var A = pol(v.va, v.pa), B = pol(v.vb, v.pb), C = pol(v.vc, v.pc);
        var a = pol(1, 120), a2 = pol(1, 240);
        var Vd = sc(add(A, mul(a, B), mul(a2, C)), 1 / 3);
        var Vi = sc(add(A, mul(a2, B), mul(a, C)), 1 / 3);
        var V0 = sc(add(A, B, C), 1 / 3);
        function show(n, z){ return n + " = <b>" + fr(Math.hypot(z[0], z[1]), 4) + " ∠ " + fr(Math.atan2(z[1], z[0]) / d, 2) + "°</b>"; }
        var md = Math.hypot(Vd[0], Vd[1]);
        return show(T("Direct V<sub>d</sub>", "Positive V<sub>1</sub>"), Vd) + "<br>" +
          show(T("Inverse V<sub>i</sub>", "Negative V<sub>2</sub>"), Vi) + "<br>" +
          show(T("Homopolaire V<sub>0</sub>", "Zero V<sub>0</sub>"), V0) + "<br>" +
          T("Taux de déséquilibre inverse V<sub>i</sub>/V<sub>d</sub> = <b>", "Negative-sequence unbalance V<sub>2</sub>/V<sub>1</sub> = <b>") +
          fr(md > 0 ? 100 * Math.hypot(Vi[0], Vi[1]) / md : 0, 2) + T(" %</b> (limite usuelle 2 %) ; homopolaire = ", " %</b> (usual limit 2 %); zero sequence = ") +
          fr(md > 0 ? 100 * Math.hypot(V0[0], V0[1]) / md : 0, 2) + T(" % ; I<sub>N</sub> = 3·I<sub>0</sub>", " %; I<sub>N</sub> = 3·I<sub>0</sub>");
      });
    },
    dispatch: function(div){
      form(div, T("Répartition économique de trois groupes", "Economic dispatch of three units"), [
        ["pd", T("Demande P<sub>D</sub>", "Demand P<sub>D</sub>"), "952", "MW"],
        ["b1", "β₁", "1", "F/MWh"], ["g1", "γ₁", "0,0625", "F/MWh²"],
        ["b2", "β₂", "1", "F/MWh"], ["g2", "γ₂", "0,0125", "F/MWh²"],
        ["b3", "β₃", "1", "F/MWh"], ["g3", "γ₃", "0,025", "F/MWh²"]],
      function(v){
        var b = [v.b1, v.b2, v.b3], g = [v.g1, v.g2, v.g3], i, s1 = 0, s2 = 0;
        for(i = 0; i < 3; i++){ if(!(g[i] > 0)) return T("γ doit être > 0.", "γ must be > 0."); s1 += 1 / (2 * g[i]); s2 += b[i] / (2 * g[i]); }
        var lam = (v.pd + s2) / s1, out = "", tot = 0, neg = false;
        for(i = 0; i < 3; i++){
          var p = (lam - b[i]) / (2 * g[i]); tot += p; if(p < 0) neg = true;
          out += "P<sub>" + (i + 1) + "</sub> = <b>" + fr(p, 2) + " MW</b>" + (i < 2 ? " ; " : "");
        }
        return T("Coût marginal commun λ = <b>", "Common marginal cost λ = <b>") + fr(lam, 4) + " F/MWh</b><br>" + out +
          T("<br>Total = ", "<br>Total = ") + fr(tot, 2) + " MW" +
          (neg ? T(" — attention : production négative, un groupe devrait être arrêté (limite P<sub>min</sub>).",
                   " — warning: negative output, one unit should be shut down (P<sub>min</sub> limit).") : "");
      });
    },
    weibull: function(div){
      form(div, T("Loi de Weibull : vitesse moyenne et densité de puissance", "Weibull distribution: mean speed and power density"), [
        ["c", T("Paramètre d'échelle c", "Scale parameter c"), "6,5", "m/s"], ["k", T("Paramètre de forme k", "Shape parameter k"), "2", ""],
        ["rho", T("Masse volumique de l'air ρ", "Air density ρ"), "1,17", "kg/m³"], ["v", T("Vitesse v pour f(v) et F(v)", "Speed v for f(v) and F(v)"), "5", "m/s"]],
      function(v){
        var m = v.c * gamma(1 + 1 / v.k), p = 0.5 * v.rho * Math.pow(v.c, 3) * gamma(1 + 3 / v.k);
        var f = v.k / v.c * Math.pow(v.v / v.c, v.k - 1) * Math.exp(-Math.pow(v.v / v.c, v.k)), F = 1 - Math.exp(-Math.pow(v.v / v.c, v.k));
        return T("Vitesse moyenne = c·Γ(1 + 1/k) = <b>", "Mean speed = c·Γ(1 + 1/k) = <b>") + fr(m, 2) + T(" m/s</b> ; densité de puissance = ½ρc³Γ(1 + 3/k) = <b>", " m/s</b>; power density = ½ρc³Γ(1 + 3/k) = <b>") + fr(p, 0) + " W/m²</b>" +
          T(" (soit ", " (i.e. ") + fr(p * 8.76, 0) + T(" kWh/m²/an)<br>f(", " kWh/m²/yr)<br>f(") + v.v + ") = " + fr(f, 4) + T(" s/m ; P(V ≤ ", " s/m; P(V ≤ ") + v.v + ") = " + fr(100 * F, 1) + " %";
      });
    },
    pv: function(div){
      form(div, T("Pré-dimensionnement d'un système PV autonome", "Pre-sizing of a stand-alone PV system"), [
        ["e", T("Besoins journaliers (récepteurs)", "Daily needs (appliances)"), "1200", T("Wh/j", "Wh/d")], ["h", T("Irradiation du mois défavorable", "Irradiation of the worst month"), "5,2", T("kWh/m²/j", "kWh/m²/d")],
        ["u", T("Tension du bus continu", "DC bus voltage"), "24", "V"], ["eta", T("Rendement global (câbles, batterie, onduleur)", "Overall efficiency (cables, battery, inverter)"), "0,75", ""],
        ["pm", T("Puissance crête d'un module", "Peak power of one module"), "300", T("Wc", "Wp")], ["pr", T("Facteur de pertes du champ (MPPT)", "Array loss factor (MPPT)"), "0,8", ""],
        ["j", T("Autonomie", "Autonomy"), "3", T("jours", "days")], ["dod", T("Profondeur de décharge", "Depth of discharge"), "0,6", ""], ["cb", T("Capacité d'une batterie (12 V)", "Capacity of one battery (12 V)"), "200", "Ah"]],
      function(v){
        var eb = v.e / v.eta, pc = eb / (v.h * v.pr), nm = Math.ceil(pc / v.pm - 1e-9);
        var c = eb * v.j / (v.dod * v.u), ns = Math.ceil(v.u / 12 - 1e-9), np = Math.ceil(c / v.cb - 1e-9);
        return T("Énergie à produire = ", "Energy to produce = ") + fr(eb, 0) + T(" Wh/j ; puissance crête = ", " Wh/d; peak power = ") + fr(pc, 0) + T(" Wc → <b>", " Wp → <b>") + nm + T(" modules</b> (", " modules</b> (") + fr(nm * v.pm, 0) + T(" Wc)<br>", " Wp)<br>") +
          T("Capacité = E·N/(DoD·U) = <b>", "Capacity = E·N/(DoD·U) = <b>") + fr(c, 0) + T(" Ah</b> sous ", " Ah</b> at ") + v.u + T(" V → ", " V → ") + ns + T(" en série × ", " in series × ") + np + T(" en parallèle = <b>", " in parallel = <b>") + ns * np + T(" batteries de ", " batteries of ") + v.cb + " Ah</b>";
      });
    },
    finance: function(div){
      form(div, T("Annuité, coût actualisé du kWh (LCOE) et VAN", "Annuity, levelised cost of the kWh (LCOE) and NPV"), [
        ["i0", T("Investissement", "Investment"), "10000", "kF"], ["om", T("Exploitation-maintenance", "Operation and maintenance"), "200", T("kF/an", "kF/yr")],
        ["e", T("Énergie produite", "Energy produced"), "15000", T("kWh/an", "kWh/yr")], ["n", T("Durée de vie", "Lifetime"), "20", T("ans", "years")], ["a", T("Taux d'actualisation", "Discount rate"), "8", "%"],
        ["t", T("Tarif de vente (pour la VAN)", "Selling tariff (for the NPV)"), "150", "F/kWh"]],
      function(v){
        var a = v.a / 100, crf = a > 0 ? a * Math.pow(1 + a, v.n) / (Math.pow(1 + a, v.n) - 1) : 1 / v.n;
        var lcoe = (v.i0 * crf + v.om) / v.e * 1000;
        var fa = a > 0 ? (1 - Math.pow(1 + a, -v.n)) / a : v.n;
        var van = -v.i0 + (v.e * v.t / 1000 - v.om) * fa;
        return "CRF = a(1+a)<sup>N</sup>/((1+a)<sup>N</sup> − 1) = " + fr(crf, 4) + T(" ; annuité = <b>", "; annuity = <b>") + fr(v.i0 * crf, 0) + T(" kF/an</b><br>", " kF/yr</b><br>") +
          T("LCOE = (I·CRF + E&M)/E = <b>", "LCOE = (I·CRF + O&M)/E = <b>") + fr(lcoe, 0) + T(" F/kWh</b> ; VAN = −I + (E·t − E&M)·Σ1/(1+a)<sup>n</sup> = <b>", " F/kWh</b>; NPV = −I + (E·t − O&M)·Σ1/(1+a)<sup>n</sup> = <b>") + fr(van, 0) + " kF</b> (" + (van >= 0 ? T("rentable", "profitable") : T("non rentable", "not profitable")) + ")";
      });
    }
  };
  function initCalcs(){
    document.querySelectorAll(".calc[data-calc]").forEach(function(d){
      var f = CALCS[d.getAttribute("data-calc")];
      if(f) f(d);
    });
  }
  document.addEventListener("DOMContentLoaded", function(){ initQcm(); initCalcs(); });
})();
