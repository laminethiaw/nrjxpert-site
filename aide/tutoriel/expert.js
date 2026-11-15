/* Tutoriel NRJXpert — niveau 7 (atelier expert) : calculatrices interactives, en français ou en anglais selon <html lang>.
   <div class="xp" data-tool="island|g3plc|ntl|baseline|sl"></div>  — aucune dépendance, fonctionne hors ligne. */
(function(){
  "use strict";
  var EN = (document.documentElement.lang || "fr").indexOf("en") === 0;
  var T = function(fr, en){ return EN ? en : fr; };
  var fmt = function(x, d){ if(!isFinite(x)) return "—"; return x.toLocaleString(EN ? "en-GB" : "fr-FR", {minimumFractionDigits:d, maximumFractionDigits:d}); };
  var num = function(el){ return parseFloat(String(el.value).replace(/\s/g, "").replace(",", ".")); };
  var el = function(tag, cls, html){ var e = document.createElement(tag); if(cls) e.className = cls; if(html != null) e.innerHTML = html; return e; };

  /* formulaire : champs [clé, libellé, valeur ou liste d'options, unité] */
  function form(div, title, fields, compute){
    div.classList.add("calc");
    div.appendChild(el("h4", "", title));
    var inputs = {};
    fields.forEach(function(f){
      var row = el("div", "row");
      row.appendChild(el("label", "", f[1]));
      var inp;
      if(Array.isArray(f[2])){
        inp = document.createElement("select");
        f[2].forEach(function(o){ var op = document.createElement("option"); op.value = o[0]; op.textContent = o[1]; inp.appendChild(op); });
      }else if(f[2] === true || f[2] === false){
        inp = document.createElement("input"); inp.type = "checkbox"; inp.checked = f[2];
      }else{ inp = document.createElement("input"); inp.value = EN ? String(f[2]).replace(/(\d),(\d)/g, "$1.$2") : f[2]; }
      row.appendChild(inp);
      row.appendChild(el("span", "small", f[3] || ""));
      div.appendChild(row);
      inputs[f[0]] = inp;
      inp.addEventListener("input", run);
      inp.addEventListener("change", run);
    });
    var out = el("div", "out");
    div.appendChild(out);
    function run(){
      var v = {};
      for(var k in inputs){
        var i = inputs[k];
        v[k] = i.type === "checkbox" ? i.checked : i.tagName === "SELECT" ? i.value : num(i);
      }
      try{ out.innerHTML = compute(v); }catch(e){ out.textContent = T("Saisie incomplète.", "Incomplete input."); }
    }
    run();
  }

  var TOOLS = {
    /* îlotage : RoCoF initial, écart de fréquence établi (statisme), critère de survie */
    island: function(d){
      form(d, T("Îlotage : RoCoF et fréquence établie", "Islanding: RoCoF and steady-state frequency"), [
        ["dp", T("Échange au point de couplage perdu ΔP", "Lost exchange at the PCC ΔP"), "0,3", "MW"],
        ["s", T("Puissance des sources formant le réseau ΣSn", "Rating of grid-forming sources ΣSn"), "1,8", "MVA"],
        ["h", T("Inertie (réelle ou synthétique) H", "Inertia (real or synthetic) H"), "2", "s"],
        ["r", T("Statisme R", "Droop R"), "5", "%"],
        ["f", T("Fréquence nominale", "Nominal frequency"), "50", "Hz"],
        ["lim", T("RoCoF admissible", "Admissible RoCoF"), "2", "Hz/s"]
      ], function(v){
        var rocof = v.dp * v.f / (2 * v.h * v.s);
        var df = v.r / 100 * v.dp / v.s * v.f;
        return T("RoCoF initial", "Initial RoCoF") + " = ΔP·f₀ / (2·H·ΣSn) = <b>" + fmt(rocof, 2) + " Hz/s</b> " +
          (rocof <= v.lim ? "✓" : "✗ " + T("au-delà du critère : plus d'inertie ou d'anticipation (îlotage programmé)", "above the criterion: more inertia or anticipation (planned islanding)")) +
          "<br>" + T("Écart établi par statisme", "Steady-state droop deviation") + " Δf = R·ΔP/ΣSn·f₀ = <b>" + fmt(df, 3) + " Hz</b> → f = " + fmt(v.f - df, 3) + " Hz" +
          "<br><span class='small'>" + T("Le nadir est plus bas que la fréquence établie ; seul le calcul dynamique (banc d'essai T1, T4, T5) le donne.",
            "The nadir is below the steady-state frequency; only the dynamic calculation (tests T1, T4, T5) gives it.") + "</span>";
      });
    },
    /* télérelève G3-PLC : réussite d'une trame, complétude journalière, volume DLMS */
    g3plc: function(d){
      form(d, T("Télérelève G3-PLC : complétude et volume", "G3-PLC data collection: completeness and volume"), [
        ["hops", T("Nombre de sauts (maillage 6LoWPAN)", "Number of hops (6LoWPAN mesh)"), "2", ""],
        ["p", T("Réussite d'un saut", "Success of one hop"), "93", "%"],
        ["rt", T("Répétitions", "Retries"), "3", ""],
        ["step", T("Période d'intégration de la courbe de charge", "Load-profile capture period"), "15", "min"],
        ["rec", T("Octets par enregistrement (horloge, statut, A+, A−, U)", "Bytes per record (clock, status, A+, A−, U)"), "30", T("octets", "bytes")],
        ["blk", T("Enregistrements par réponse DLMS", "Records per DLMS response"), "16", ""],
        ["ovh", T("Surcoût par trame (HDLC/IP, AES-GCM)", "Overhead per frame (HDLC/IP, AES-GCM)"), "60", T("octets", "bytes")],
        ["n", T("Compteurs du concentrateur", "Meters of the concentrator"), "200", ""],
        ["kbps", T("Débit brut du canal", "Raw channel rate"), "20", "kbit/s"]
      ], function(v){
        var p1 = Math.pow(v.p / 100, v.hops);
        var pf = 1 - Math.pow(1 - p1, v.rt + 1);
        var recs = 1440 / v.step, frames = Math.ceil(recs / v.blk);
        var day = Math.pow(pf, frames);
        var bytes = recs * v.rec + frames * v.ovh;
        var tcol = bytes * 8 / (v.kbps * 1000 * 0.35) * v.hops * v.n / Math.pow(day, 1 / frames) / 60;
        return T("Trame transmise du premier coup", "Frame delivered at first attempt") + " = p^n = " + fmt(100 * p1, 2) + T(" % ; ", " %; ") +
          T("avec répétitions", "with retries") + " = 1 − (1 − pⁿ)^(r+1) = <b>" + fmt(100 * pf, 3) + " %</b><br>" +
          recs + T(" enregistrements par jour en ", " records per day in ") + frames + T(" trames → complétude journalière ", " frames → daily completeness ") +
          "<b>" + fmt(100 * day, 2) + " %</b><br>" + T("Volume par compteur", "Volume per meter") + T(" : <b>", ": <b>") + fmt(bytes / 1000, 2) + T(" ko/", " kB/") + T("jour", "day") +
          T("</b> ; ", "</b>; ") + T("durée de collecte du concentrateur", "concentrator collection time") + " ≈ <b>" + fmt(tcol, 1) + " min</b>";
      });
    },
    /* bilan des pertes : techniques / non techniques, valeur annuelle, retour d'un projet AMI */
    ntl: function(d){
      form(d, T("Bilan des pertes et rentabilité du comptage évolué", "Loss balance and value of smart metering"), [
        ["ein", T("Énergie injectée au poste source (mois)", "Energy injected at the substation (month)"), "1 700 000", "kWh"],
        ["tl", T("Pertes techniques (load flow)", "Technical losses (load flow)"), "3,0", "%"],
        ["em", T("Énergie comptée chez les clients", "Energy metered at customers"), "1 560 000", "kWh"],
        ["price", T("Prix moyen de vente", "Average selling price"), "110", "F/kWh"],
        ["rec", T("Part des pertes non techniques récupérable", "Recoverable share of non-technical losses"), "60", "%"],
        ["nm", T("Nombre de compteurs", "Number of meters"), "8 000", ""],
        ["cm", T("Coût d'un compteur posé + part du système", "Cost of one installed meter + share of the system"), "75 000", "F"]
      ], function(v){
        var et = v.ein * v.tl / 100, ntl = v.ein - et - v.em;
        var gain = ntl * 12 * v.price * v.rec / 100, inv = v.nm * v.cm;
        return T("Pertes non techniques", "Non-technical losses") + " = E<sub>inj</sub> − E<sub>tech</sub> − " + T("E<sub>comptée</sub>", "E<sub>metered</sub>") + " = <b>" + fmt(ntl, 0) + " kWh</b> (" +
          fmt(100 * ntl / v.ein, 2) + " %)<br>" + T("Gain annuel", "Annual gain") + " = <b>" + fmt(gain / 1e6, 1) + T(" MF</b> ; ", " MF</b>; ") +
          T("investissement", "investment") + " = " + fmt(inv / 1e6, 1) + " MF → " + T("temps de retour simple", "simple payback") + " <b>" +
          fmt(inv / gain, 1) + T(" ans", " years") + "</b>";
      });
    },
    /* référence d'effacement « X parmi Y » (CAISO 10/10, PJM 4/5…) et règlement */
    baseline: function(d){
      form(d, T("Référence d'effacement et règlement (OpenADR)", "Demand response baseline and settlement (OpenADR)"), [
        ["days", T("Consommation des derniers jours ouvrés pendant la plage (MWh, séparés par ;)", "Consumption of the last working days in the window (MWh, separated by ;)"),
          "2,9 ; 3,1 ; 3,0 ; 2,8 ; 3,2 ; 3,0 ; 2,7 ; 3,3 ; 3,1 ; 2,9", ""],
        ["x", T("Jours retenus (les plus forts) X", "Days kept (highest) X"), "5", ""],
        ["adj", T("Ajustement du jour (matin de l'évènement)", "Day-of adjustment (morning of the event)"), "1,05", "×"],
        ["meas", T("Consommation mesurée pendant l'évènement", "Metered consumption during the event"), "2,1", "MWh"],
        ["req", T("Effacement demandé", "Requested reduction"), "1,2", "MWh"],
        ["inc", T("Rémunération", "Payment"), "250", "F/kWh"],
        ["pen", T("Pénalité de non-réalisation", "Shortfall penalty"), "100", "F/kWh"]
      ], function(v){
        var raw = String(d.querySelector("input").value).split(/[;\n]/).map(function(s){ return parseFloat(s.replace(",", ".")); }).filter(isFinite);
        raw.sort(function(a, b){ return b - a; });
        var keep = raw.slice(0, Math.max(1, Math.min(raw.length, v.x)));
        var base = keep.reduce(function(a, b){ return a + b; }, 0) / keep.length * v.adj;
        var del = Math.max(0, base - v.meas), paid = Math.min(del, v.req), short = Math.max(0, v.req - del);
        return T("Référence", "Baseline") + " = " + T("moyenne des ", "mean of the ") + keep.length + T(" plus forts × ajustement", " highest × adjustment") + " = <b>" + fmt(base, 3) + " MWh</b><br>" +
          T("Effacement réalisé", "Delivered reduction") + " = " + fmt(del, 3) + " MWh (" + fmt(v.req ? 100 * del / v.req : 0, 0) + " %)<br>" +
          T("Règlement", "Settlement") + " = " + fmt(paid * 1000 * v.inc / 1e3, 0) + " kF − " + fmt(short * 1000 * v.pen / 1e3, 0) + T(" kF de pénalité", " kF penalty") +
          " = <b>" + fmt((paid * v.inc - short * v.pen), 0) + " kF</b><br><span class='small'>" +
          T("NRJXpert prend pour référence le fonctionnement optimal sans évènement : c'est la meilleure référence possible, que le règlement réel n'atteint pas (d'où les règles « X parmi Y » contre les références gonflées).",
            "NRJXpert uses the optimal operation without the event as baseline: the best possible baseline, which a real settlement cannot observe (hence the « X of Y » rules against inflated baselines).") + "</span>";
      });
    },
    /* IEC 62443 : niveau atteint par exigence fondamentale et écart au niveau cible */
    sl: function(d){
      var FR = [["FR1 IAC", T("comptes individuels", "individual accounts"), T("IAM / RBAC", "IAM / RBAC"), T("MFA à distance", "remote MFA"), "PKI"],
        ["FR2 UC", T("rôles", "roles"), T("moindre privilège, journal", "least privilege, log"), T("double validation", "four-eyes"), T("mobiles", "mobile devices")],
        ["FR3 SI", T("anti-malware", "anti-malware"), "MAC IEC 62351-6", T("firmware signé", "signed firmware"), T("intégrité auto.", "auto. integrity")],
        ["FR4 DC", T("données au repos", "data at rest"), "TLS / IEC 62351-3", T("gestion des clés", "key management"), "HSM"],
        ["FR5 RDF", T("zones / VLAN", "zones / VLAN"), T("pare-feu", "firewall"), "DMZ", T("diode", "data diode")],
        ["FR6 TRE", T("journaux", "logs"), "SIEM", T("IDS OT", "OT IDS"), "SOC"],
        ["FR7 RA", T("sauvegardes", "backups"), "anti-DoS", T("redondance", "redundancy"), T("mode dégradé", "degraded mode")]];
      d.classList.add("calc");
      d.appendChild(el("h4", "", T("IEC 62443 : SL-A par exigence fondamentale", "IEC 62443: SL-A per foundational requirement")));
      var row = el("div", "row");
      row.appendChild(el("label", "", T("Niveau cible SL-T de la zone", "Target level SL-T of the zone")));
      var sel = document.createElement("select");
      [1, 2, 3, 4].forEach(function(k){ var o = document.createElement("option"); o.value = k; o.textContent = "SL " + k; if(k === 3) o.selected = true; sel.appendChild(o); });
      row.appendChild(sel); d.appendChild(row);
      var tab = el("table");
      tab.innerHTML = "<tr><th>FR</th><th>SL1</th><th>SL2</th><th>SL3</th><th>SL4</th><th>SL-A</th></tr>";
      var boxes = [];
      FR.forEach(function(f, i){
        var tr = el("tr");
        tr.appendChild(el("td", "", f[0]));
        boxes[i] = [];
        for(var k = 1; k <= 4; k++){
          var td = el("td"), cb = document.createElement("input");
          cb.type = "checkbox"; cb.checked = k === 1; cb.title = f[k];
          td.appendChild(cb); td.appendChild(el("span", "small", " " + f[k]));
          tr.appendChild(td); boxes[i].push(cb);
          cb.addEventListener("change", run);
        }
        tr.appendChild(el("td", "res"));
        tab.appendChild(tr);
      });
      d.appendChild(tab);
      var out = el("div", "out"); d.appendChild(out);
      sel.addEventListener("change", run);
      function run(){
        var t = parseInt(sel.value, 10), gaps = 0, worst = 4;
        tab.querySelectorAll("tr").forEach(function(tr, i){
          if(i === 0) return;
          var b = boxes[i - 1], a = 0;
          while(a < 4 && b[a].checked) a++;
          worst = Math.min(worst, a);
          gaps += Math.max(0, t - a);
          var c = tr.querySelector(".res");
          c.textContent = a + (a >= t ? " ✓" : " ✗");
          c.style.color = a >= t ? "#11734b" : "#b3261e";
        });
        out.innerHTML = T("Niveau atteint de la zone (plus faible des FR)", "Achieved level of the zone (lowest FR)") + T(" : <b>SL ", ": <b>SL ") + worst + T("</b> ; ", "</b>; ") +
          T("écart cumulé", "cumulative gap") + T(" : <b>", ": <b>") + gaps + "</b> " + T("niveau(x)", "level(s)") + "<br><span class='small'>" +
          T("SL-A d'une exigence = plus haut niveau dont toutes les mesures inférieures sont en place (une mesure SL3 sans la mesure SL2 ne compte pas).",
            "SL-A of a requirement = highest level whose lower measures are all in place (an SL3 measure without the SL2 one does not count).") + "</span>";
      }
      run();
    }
  };
  document.addEventListener("DOMContentLoaded", function(){
    document.querySelectorAll(".xp[data-tool]").forEach(function(d){ var f = TOOLS[d.getAttribute("data-tool")]; if(f) f(d); });
  });
})();
