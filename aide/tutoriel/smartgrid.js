/* Tutoriel NRJXpert — niveau 6 « Smart Grids » : outils interactifs (aucune dépendance, fonctionne hors ligne).
   <div class="sg" data-tool="sgam|protocols|usecase|skills|reliab|cvr|sync|tco"></div>
   Les saisies (cartographie SGAM, fiche de cas d'usage, auto-évaluation) sont gardées dans le navigateur (localStorage). */
(function(){
  "use strict";
  var fr = function(x, d){ if(!isFinite(x)) return "—"; return x.toLocaleString("fr-FR", {minimumFractionDigits:d, maximumFractionDigits:d}); };
  var num = function(el){ return parseFloat(String(el.value).replace(/\s/g, "").replace(",", ".")); };
  var el = function(tag, cls, html){ var e = document.createElement(tag); if(cls) e.className = cls; if(html != null) e.innerHTML = html; return e; };
  var store = {
    get: function(k, d){ try{ var v = localStorage.getItem("nrjxpert.sg." + k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
    set: function(k, v){ try{ localStorage.setItem("nrjxpert.sg." + k, JSON.stringify(v)); }catch(e){} }
  };
  function download(name, text, type){
    try{
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([text], {type: type || "text/plain;charset=utf-8"}));
      a.download = name; document.body.appendChild(a); a.click(); a.remove();
    }catch(e){ alert(text); }
  }
  function copy(text, btn){
    var done = function(){ if(btn){ var t = btn.textContent; btn.textContent = "Copié ✓"; setTimeout(function(){ btn.textContent = t; }, 1500); } };
    if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function(){ download("export.txt", text); });
    else download("export.txt", text);
  }
  function button(text, fn, cls){ var b = el("button", cls || "", text); b.type = "button"; b.addEventListener("click", function(){ fn(b); }); return b; }

  /* ================================================================== SGAM (IEC SRD 63200) */
  var DOMAINS = [["gen", "Production centralisée"], ["tra", "Transport"], ["dis", "Distribution"], ["der", "DER"], ["cus", "Installations clients"]];
  var ZONES = [["mar", "Marché"], ["ent", "Entreprise"], ["ope", "Exploitation"], ["sta", "Poste"], ["fie", "Terrain"], ["pro", "Processus"]];
  var LAYERS = [["bus", "Business"], ["fun", "Function"], ["inf", "Information"], ["com", "Communication"], ["cmp", "Component"]];
  /* élément : [libellé, couche, domaines admis, zones admises, explication] */
  var ITEMS = [
    ["Disjoncteur de départ (appareil)", "cmp", ["dis"], ["pro"], "Équipement primaire : zone Processus du domaine Distribution."],
    ["Relais de protection du départ (IED)", "cmp", ["dis"], ["fie"], "IED de protection et de commande : zone Terrain."],
    ["RTU / passerelle de poste source", "cmp", ["dis"], ["sta"], "Concentre les IED du poste et dialogue avec le SCADA : zone Poste."],
    ["ADMS / SCADA du centre de conduite", "cmp", ["dis"], ["ope"], "Conduite du réseau en temps réel : zone Exploitation."],
    ["IACM (interrupteur télécommandé)", "cmp", ["dis"], ["pro", "fie"], "Organe de coupure du réseau (Processus) avec son coffret de télécommande (Terrain)."],
    ["Indicateur de passage de défaut (IPD)", "cmp", ["dis"], ["fie"], "Capteur communicant installé sur le réseau : zone Terrain."],
    ["Transformateur HTB/HTA du poste", "cmp", ["tra", "dis"], ["pro"], "Équipement primaire à la frontière Transport / Distribution."],
    ["EMS du gestionnaire de transport", "cmp", ["tra"], ["ope"], "Conduite du réseau de transport (IEC 61970)."],
    ["Centrale thermique", "cmp", ["gen"], ["pro"], "Production centralisée raccordée au transport."],
    ["Onduleur PV / BESS", "cmp", ["der"], ["pro"], "Électronique de puissance de la ressource : zone Processus du domaine DER."],
    ["Contrôleur de centrale (PPC)", "cmp", ["der"], ["fie"], "Pilote les onduleurs d'un site : zone Terrain."],
    ["DERMS", "cmp", ["der", "dis"], ["ope"], "Gestion des DER à l'échelle du réseau : zone Exploitation (domaine DER ou Distribution)."],
    ["Plateforme de l'agrégateur (VPP)", "cmp", ["der"], ["ent", "ope"], "Agrège un portefeuille de DER (Entreprise) et le pilote (Exploitation)."],
    ["Compteur intelligent", "cmp", ["cus"], ["fie", "pro"], "Équipement de comptage chez le client : zone Terrain (ou Processus)."],
    ["Concentrateur AMI (poste HTA/BT)", "cmp", ["dis"], ["sta"], "Collecte les compteurs d'un poste de distribution : zone Poste."],
    ["MDM (gestion des données de comptage)", "cmp", ["dis", "cus"], ["ent"], "Système d'information : zone Entreprise."],
    ["Borne de recharge (EVSE)", "cmp", ["cus"], ["pro", "fie"], "Équipement chez le client (ou sur l'espace public)."],
    ["Système de l'opérateur de bornes (CPO)", "cmp", ["cus"], ["ope", "ent"], "Supervise les bornes (OCPP) : Exploitation / Entreprise."],
    ["Bourse de l'électricité", "cmp", ["gen", "tra", "dis", "der", "cus"], ["mar"], "Zone Marché, quel que soit le domaine."],
    ["IEC 61850 GOOSE / MMS", "com", ["dis", "tra", "der"], ["sta", "fie"], "Réseau de poste : bus de poste (MMS) et messages rapides entre IED (GOOSE)."],
    ["IEC 60870-5-104", "com", ["dis", "tra"], ["ope", "sta"], "Téléconduite entre le SCADA (Exploitation) et les postes / RTU."],
    ["DLMS/COSEM sur G3-PLC", "com", ["cus", "dis"], ["fie", "sta"], "Courants porteurs entre compteurs (Terrain) et concentrateur (Poste)."],
    ["Modbus RTU/TCP", "com", ["der", "cus"], ["pro", "fie"], "Liaison locale entre onduleurs, batteries et automates."],
    ["OCPP 2.0.1", "com", ["cus"], ["fie", "ope"], "Entre la borne (Terrain) et le système du CPO (Exploitation)."],
    ["OpenADR 2.0b", "com", ["der", "cus", "dis"], ["ent", "ope"], "Signaux de prix et d'effacement entre gestionnaire / agrégateur et clients."],
    ["IEEE 2030.5 (SEP 2.0)", "com", ["der", "cus"], ["fie", "ope"], "Interface entre DER clients et serveur du gestionnaire ou de l'agrégateur."],
    ["CIM IEC 61968 (distribution)", "inf", ["dis"], ["ope", "ent"], "Échanges entre applications de la distribution (ADMS, SIG, OMS, MDM)."],
    ["CIM IEC 61970 (transport)", "inf", ["tra"], ["ope"], "Modèle de réseau des EMS et des calculs de répartition."],
    ["IEC 62325 (marchés)", "inf", ["gen", "tra", "dis", "der"], ["mar", "ent"], "Messages de marché : programmes, ajustements."],
    ["Modèle de données IEC 61850-7-420 (DER)", "inf", ["der"], ["fie", "sta"], "Nœuds logiques des DER (ZBAT, DRCC, DOPM…)."],
    ["Objets COSEM / codes OBIS", "inf", ["cus"], ["fie"], "Sémantique des grandeurs mesurées par le compteur."],
    ["FLISR (auto-cicatrisation)", "fun", ["dis"], ["ope"], "Fonction de l'ADMS ; s'appuie sur les IPD et les IACM du terrain."],
    ["IVVC/r (Volt/VAR intégré)", "fun", ["dis", "der"], ["ope"], "Optimisation de la tension par le DMS, onduleurs compris."],
    ["Agrégation VPP", "fun", ["der"], ["ent", "ope"], "Pilotage d'un portefeuille de DER."],
    ["Recharge pilotée V1G / V2G", "fun", ["cus", "der"], ["ope", "fie"], "Gestion de la recharge par le CPO ou l'EMS du site."],
    ["Îlotage d'un micro-réseau (IEEE 2030.7)", "fun", ["der", "dis"], ["fie", "sta"], "Fonction du contrôleur de micro-réseau."],
    ["Marché de la flexibilité", "bus", ["der", "dis", "cus"], ["mar"], "Valorisation des services (réserve, effacement)."],
    ["Régulation de la continuité (SAIDI, pénalités)", "bus", ["dis"], ["ent"], "Objectif du gestionnaire fixé par le régulateur."]
  ];
  function sgam(div){
    var state = store.get("sgam", {});        // index de l'élément -> "domaine|zone"
    var layer = "cmp", pick = null, checked = false;
    div.appendChild(el("h4", "", "Cartographie SGAM : placer les éléments sur la grille Domaines × Zones"));
    var bar = el("div", "sg-bar");
    LAYERS.forEach(function(l){
      var b = button(l[1], function(){ layer = l[0]; pick = null; draw(); }, "sg-tab");
      b.setAttribute("data-l", l[0]);
      bar.appendChild(b);
    });
    div.appendChild(bar);
    var wrap = el("div", "sg-sgam");
    var chips = el("div", "sg-chips");
    var grid = el("table", "sg-grid");
    wrap.appendChild(chips);
    wrap.appendChild(grid);
    div.appendChild(wrap);
    var info = el("div", "out", "Choisir une couche, cliquer sur un élément puis sur la case (domaine, zone) où il se situe.");
    div.appendChild(info);
    var tools = el("div", "sg-bar");
    tools.appendChild(button("Vérifier", function(){ checked = true; draw(); }));
    tools.appendChild(button("Effacer la couche", function(){ ITEMS.forEach(function(it, i){ if(it[1] === layer) delete state[i]; }); store.set("sgam", state); checked = false; draw(); }));
    tools.appendChild(button("Exporter (texte)", function(b){ copy(exportText(), b); }));
    div.appendChild(tools);
    function ok(i){ var it = ITEMS[i], p = (state[i] || "").split("|"); return it[2].indexOf(p[0]) >= 0 && it[3].indexOf(p[1]) >= 0; }
    function exportText(){
      var s = "Cartographie SGAM (IEC SRD 63200) — NRJXpert\n";
      LAYERS.forEach(function(l){
        s += "\nCouche " + l[1] + "\n";
        ITEMS.forEach(function(it, i){
          if(it[1] !== l[0]) return;
          var p = (state[i] || "").split("|");
          var d = DOMAINS.find(function(x){ return x[0] === p[0]; }), z = ZONES.find(function(x){ return x[0] === p[1]; });
          s += "  - " + it[0] + " : " + (d && z ? d[1] + " / " + z[1] : "non placé") + "\n";
        });
      });
      return s;
    }
    function draw(){
      bar.querySelectorAll("button").forEach(function(b){ b.classList.toggle("on", b.getAttribute("data-l") === layer); });
      chips.innerHTML = "";
      var n = 0, good = 0, placed = 0;
      ITEMS.forEach(function(it, i){
        if(it[1] !== layer) return;
        n++;
        if(state[i]){ placed++; if(ok(i)) good++; }
        var c = el("span", "sg-chip" + (pick === i ? " sel" : "") + (state[i] ? " placed" : ""), it[0]);
        if(checked && state[i]) c.classList.add(ok(i) ? "good" : "bad");
        c.title = state[i] ? "placé" : "à placer";
        c.addEventListener("click", function(){ pick = (pick === i ? null : i); draw(); info.innerHTML = "<b>" + it[0] + "</b> : cliquer sur la case où il se situe."; });
        chips.appendChild(c);
      });
      grid.innerHTML = "";
      var h = el("tr");
      h.appendChild(el("th", "", "Zone \\ Domaine"));
      DOMAINS.forEach(function(d){ h.appendChild(el("th", "", d[1])); });
      grid.appendChild(h);
      ZONES.forEach(function(z){
        var tr = el("tr");
        tr.appendChild(el("th", "", z[1]));
        DOMAINS.forEach(function(d){
          var td = el("td");
          ITEMS.forEach(function(it, i){
            if(it[1] !== layer || state[i] !== d[0] + "|" + z[0]) return;
            var c = el("span", "sg-mini", it[0]);
            if(checked) c.classList.add(ok(i) ? "good" : "bad");
            c.addEventListener("click", function(ev){ ev.stopPropagation(); delete state[i]; store.set("sgam", state); draw(); });
            c.title = "cliquer pour retirer";
            td.appendChild(c);
          });
          td.addEventListener("click", function(){
            if(pick == null) return;
            state[pick] = d[0] + "|" + z[0];
            store.set("sgam", state);
            var it = ITEMS[pick];
            info.innerHTML = "<b>" + it[0] + "</b> placé en " + d[1] + " / " + z[1] + (checked ? (ok(pick) ? " — <span class='check'>juste</span>. " : " — <span style='color:var(--bad)'>à revoir</span>. ") + it[4] : ".");
            pick = null;
            draw();
          });
          tr.appendChild(td);
        });
        grid.appendChild(tr);
      });
      if(checked)
        info.innerHTML = "Couche " + LAYERS.find(function(l){ return l[0] === layer; })[1] + " : <b>" + good + " / " + n + "</b> éléments bien placés (" +
          placed + " placés). Les éléments mal placés sont en rouge ; cliquer dessus pour les retirer, puis les replacer.";
    }
    draw();
  }

  /* ================================================================== protocoles (guide, § 4.4) */
  var PROTO = [
    ["IEC 61850", "oui", "Nœuds logiques (LN), fichiers SCL (XML)", "MMS (TCP/IP), GOOSE et SV (Ethernet niveau 2)", "Postes, IED, inter-verrouillages rapides, micro-réseaux, DER", "Poste, Terrain", "lan"],
    ["CIM (IEC 61970/61968)", "oui", "Ontologie UML, RDF/XML", "HTTP, AMQP, services web, JMS", "Échanges entre applications IT/OT (SIG, ADMS, EMS), marchés", "Exploitation, Entreprise", "it"],
    ["DLMS/COSEM (IEC 62056)", "oui", "Objets COSEM, codes OBIS", "G3-PLC, RS-485, HDLC, TCP/IPv6", "Comptage intelligent, télé-relève, profils de charge BT", "Terrain, Poste", "ami"],
    ["IEC 60870-5-104", "non", "Adresses d'objets d'information (IOA)", "TCP/IP (port 2404)", "Téléconduite SCADA, postes, organes de coupure (IACM)", "Exploitation, Poste", "scada"],
    ["DNP3 (IEEE 1815)", "non", "Index d'objets et de points (classes 0 à 3)", "Série, TCP/UDP (port 20000)", "Téléconduite (Amérique du Nord, Australie)", "Exploitation, Poste", "scada"],
    ["Modbus RTU/TCP", "non", "Registres 16 bits", "RS-485, TCP/IP (port 502)", "Automates, compteurs de tableau, onduleurs, BESS (modèles SunSpec)", "Terrain, Processus", "local"],
    ["IEEE 2030.5 (SEP 2.0)", "oui", "Objets REST, XML / JSON", "TCP/IP, Wi-Fi, Ethernet, 6LoWPAN", "Interfaces DER client, gestion de la demande, onduleurs intelligents", "Terrain, Exploitation", "der"],
    ["OpenADR 2.0b", "oui", "Schémas XML (REST)", "HTTP/HTTPS, XMPP", "Signaux de prix, programmes d'effacement, délestage", "Entreprise, Exploitation", "der"],
    ["ISO 15118-20", "oui", "Messages V2G, codage EXI", "TCP/IP sur CPL (HomePlug Green PHY)", "Véhicule–borne, Plug & Charge, V2G", "Processus, Terrain", "ev"],
    ["OCPP 2.0.1", "oui", "Messages JSON", "WebSocket sur TLS", "Borne–système du CPO, recharge intelligente", "Terrain, Exploitation", "ev"]
  ];
  function protocols(div){
    div.appendChild(el("h4", "", "Comparateur des protocoles Smart Grid"));
    var f = el("div", "sg-bar");
    var sem = el("select");
    [["", "Modèle sémantique : tous"], ["oui", "avec modèle sémantique"], ["non", "sans modèle sémantique"]].forEach(function(o){ var op = el("option", "", o[1]); op.value = o[0]; sem.appendChild(op); });
    var dom = el("select");
    [["", "Usage : tous"], ["scada", "Téléconduite"], ["lan", "Poste / IED"], ["ami", "Comptage"], ["der", "DER / effacement"], ["ev", "Mobilité électrique"], ["it", "Systèmes d'information"], ["local", "Liaisons locales"]].forEach(function(o){ var op = el("option", "", o[1]); op.value = o[0]; dom.appendChild(op); });
    var q = el("input");
    q.placeholder = "Rechercher (TCP, JSON, onduleur…)";
    f.appendChild(sem); f.appendChild(dom); f.appendChild(q);
    div.appendChild(f);
    var t = el("table", "sg-proto");
    div.appendChild(t);
    function draw(){
      t.innerHTML = "<tr><th>Protocole</th><th>Modèle sémantique</th><th>Modèle de données</th><th>Transport / réseau</th><th>Cas d'usage</th><th>Zones SGAM</th></tr>";
      var s = q.value.toLowerCase();
      PROTO.forEach(function(p){
        if(sem.value && p[1] !== sem.value) return;
        if(dom.value && p[6] !== dom.value) return;
        if(s && p.join(" ").toLowerCase().indexOf(s) < 0) return;
        var tr = el("tr");
        for(var k = 0; k < 6; k++) tr.appendChild(el("td", "", k === 0 ? "<b>" + p[k] + "</b>" : p[k]));
        t.appendChild(tr);
      });
    }
    [sem, dom, q].forEach(function(x){ x.addEventListener("input", draw); x.addEventListener("change", draw); });
    draw();
  }

  /* ================================================================== fiche de cas d'usage IEC 62559-2 */
  var UC_FIELDS = [
    ["1. Identification", [["id", "Identifiant", "UC-DIST-01"], ["title", "Titre du cas d'usage", ""], ["version", "Version / date", "0.1"],
      ["author", "Rédacteur", ""], ["domain", "Domaine(s) SGAM", ""], ["zones", "Zone(s) SGAM", ""], ["scope", "Périmètre", ""]]],
    ["2. Objectifs", [["obj_bus", "Objectif métier (Business)", "", 1], ["obj_tech", "Objectif technique", "", 1], ["kpi", "Indicateurs de performance (KPI)", "", 1]]],
    ["3. Conditions préalables et hypothèses", [["pre", "Pré-conditions", "", 1], ["assump", "Hypothèses", "", 1]]],
    ["5. Exigences d'interopérabilité", [["req_inf", "Couche Information", "", 1], ["req_com", "Couche Communication", "", 1],
      ["req_sec", "Sécurité (IEC 62351, IEC 62443)", "", 1], ["req_perf", "Performances (temps de réponse, disponibilité)", "", 1]]],
    ["6. Vérification avec NRJXpert", [["nrjx", "Calcul ou étude de validation", "", 1]]]
  ];
  var UC_TEMPLATES = {
    flisr: {title: "Isolation automatique de défaut et rétablissement du service sur un départ MT (FLISR)", id: "UC-DIST-FLISR", domain: "Distribution",
      zones: "Terrain / Poste / Exploitation", scope: "Départs HTA du poste source, organes télécommandés et IPD",
      obj_bus: "Réduire le temps moyen d'interruption par client (SAIDI) et améliorer la continuité de service.",
      obj_tech: "Isoler le tronçon défectueux en moins de 30 secondes et réalimenter sans intervention humaine les tronçons sains hors défaut.",
      kpi: "SAIDI, SAIFI, MAIFI, énergie non distribuée ; durée de la séquence automatique ; taux de réussite.",
      pre: "Départ MT modélisé en topologie exacte dans l'ADMS ; organes de coupure télécommandés fonctionnels ; canaux de communication actifs.",
      assump: "Défaut permanent ; capacité de report du départ voisin vérifiée par load flow.",
      actors: [["Indicateurs de passage de défaut (IPD)", "Équipement", "Signalent le passage du courant de défaut"],
        ["Organes de coupure télécommandés (IACM)", "Équipement", "Exécutent les ordres d'ouverture et de fermeture"],
        ["IED de poste / disjoncteur de départ", "Équipement", "Protection et réenclenchement"],
        ["Moteur FLISR de l'ADMS", "Système", "Localise, isole, calcule le plan de réalimentation"],
        ["Opérateur de conduite", "Personne", "Supervise et valide la séquence"]],
      steps: [["Détection", "Court-circuit ; déclenchement du disjoncteur de départ ; alarmes des IPD", "IED, IPD", "ADMS", "États, alarmes horodatés (IEC 60870-5-104)"],
        ["Localisation", "Le moteur FLISR analyse la topologie et identifie la section défaillante entre deux organes télécommandés", "ADMS", "—", "Modèle de réseau (CIM IEC 61968-13)"],
        ["Isolation", "Ordres d'ouverture des deux organes encadrant le défaut", "ADMS", "IACM", "Commandes double point (C_DC_NA_1)"],
        ["Rétablissement", "Vérification par load flow de la capacité de transfert, refermeture du disjoncteur, fermeture de l'organe d'interconnexion", "ADMS", "Disjoncteur, organe NO", "Commandes, retours d'état"]],
      req_inf: "États et mesures selon l'IEC 61850 (LN XCBR, XSWI, MMXU, SFPI) au poste ; conversion vers le modèle CIM (IEC 61968-13, CDPSM) dans l'ADMS.",
      req_com: "Liaison IP sécurisée (VPN IPsec / TLS) sur réseau cellulaire privé ou fibre optique ; IEC 60870-5-104 vers les IACM.",
      req_sec: "Authentification mutuelle des équipements et journalisation des commandes selon l'IEC 62351 ; segmentation (IEC 62443).",
      req_perf: "Séquence automatique < 3 min (coupure brève) ; disponibilité des télécommunications > 99,5 %.",
      nrjx: "Calcul « Auto-cicatrisation (FLISR), fiabilité » : séquence, clients coupés, END ; étude annuelle SAIDI/SAIFI avec et sans automatisation (exemples/flisr_deux_departs.xml)."},
    ivvc: {title: "Optimisation intégrée tension / réactif avec onduleurs intelligents (IVVC/r)", id: "UC-DIST-IVVC", domain: "Distribution, DER", zones: "Exploitation / Poste / Terrain",
      scope: "Départ HTA avec régleur en charge, gradins de condensateurs et centrales PV",
      obj_bus: "Réduire les pertes et la consommation (CVR) tout en respectant la tension contractuelle ; augmenter la capacité d'accueil.",
      obj_tech: "Calculer toutes les 15 min les prises, gradins et consignes de réactif des onduleurs, sans sortir de [0,95 ; 1,05] pu.",
      kpi: "Pertes (kWh), énergie appelée, heures hors plage, nombre de manœuvres du régleur et des gradins.",
      pre: "Mesures de tension en bout de départ ; onduleurs pilotables à distance ; prévision de production.", assump: "Charges représentées par un modèle ZIP.",
      actors: [["DMS (fonction IVVC)", "Système", "Optimise et envoie les consignes"], ["Régleur en charge (YLTC/ATCC)", "Équipement", "Change de prise"],
        ["Gradins de condensateurs (ZCAP)", "Équipement", "Enclenchement par gradin"], ["Onduleurs PV (DRCC, DOPM)", "Équipement", "Consigne de Q ou de cos φ, courbe Q(V)"]],
      steps: [["Acquisition", "Mesures de tension, puissances, états", "IED, onduleurs", "DMS", "IEC 61850 / 104 / SunSpec Modbus"],
        ["Optimisation", "Load flow et optimisation des réglages", "DMS", "—", "Modèle CIM"],
        ["Consignes", "Prise, gradins, consignes de réactif", "DMS", "Régleur, gradins, onduleurs", "C_RC_NA_1, C_SE_NC_1, IEEE 2030.5"]],
      req_inf: "Modèle de réseau CIM ; nœuds logiques IEC 61850-7-420 des DER.", req_com: "IEC 60870-5-104 vers le poste ; IEEE 2030.5 ou Modbus SunSpec vers les onduleurs.",
      req_sec: "IEC 62351 ; contrôle d'accès aux consignes des onduleurs.", req_perf: "Cycle de 15 min ; repli sur Q(V) local en cas de perte des communications.",
      nrjx: "Calcul « Contrôle Volt/VAR (IVVC) » : stratégies S0 à S3 (exemples/ivvc_ieee33.xml)."},
    vpp: {title: "Centrale virtuelle : agrégation et programme d'échange", id: "UC-DER-VPP", domain: "DER, Installations clients", zones: "Marché / Entreprise / Exploitation",
      scope: "Portefeuille PV, batteries, bornes de recharge, effacement", obj_bus: "Valoriser la flexibilité (réserve, programme, effacement).",
      obj_tech: "Suivre le programme d'échange au point de raccordement sans contrainte de tension ni surcharge.", kpi: "Écart au programme, réserve vendue, coût, heures de contrainte.",
      pre: "DER télé-pilotables ; prévisions de charge et de production ; prix.", assump: "Réseau contrôlé par le DERMS.",
      actors: [["Agrégateur (VPP)", "Organisation / système", "Optimise le portefeuille"], ["DERMS du gestionnaire", "Système", "Vérifie les contraintes du réseau"], ["DER", "Équipement", "Exécutent les consignes"]],
      steps: [["Programme", "Réception du programme et des prix", "Marché", "VPP", "IEC 62325, OpenADR"], ["Optimisation", "Calcul des consignes de chaque DER", "VPP", "—", ""],
        ["Contrôle", "Vérification des contraintes", "VPP", "DERMS", "CIM"], ["Consignes", "Envoi aux DER", "VPP", "DER", "IEEE 2030.5, OCPP, Modbus"]],
      req_inf: "CIM, IEC 61850-7-420.", req_com: "OpenADR 2.0b, IEEE 2030.5, OCPP 2.0.1.", req_sec: "TLS, certificats.", req_perf: "Consignes toutes les 15 min ; réserve mobilisable en 15 min.",
      nrjx: "Calcul « Centrale virtuelle (VPP) » (exemples/vpp_ve_batterie.xml)."},
    island: {title: "Îlotage intentionnel et resynchronisation d'un micro-réseau", id: "UC-MG-ISL", domain: "DER, Distribution", zones: "Terrain / Poste",
      scope: "Micro-réseau avec batterie formant le réseau et PV", obj_bus: "Continuité d'alimentation d'un site critique (hôpital, campus).",
      obj_tech: "Passer en îlot sans écroulement de fréquence ; se reconnecter dans les critères de synchronisation (IEEE 1547).", kpi: "Nadir, RoCoF, durée de resynchronisation.",
      pre: "Batterie formant le réseau de puissance suffisante ; disjoncteur de couplage télécommandé.", assump: "Charges sans délestage.",
      actors: [["Contrôleur de micro-réseau (IEEE 2030.7)", "Système", "Transition, dispatching"], ["Disjoncteur de couplage (PCC)", "Équipement", "Ouverture / fermeture"], ["Onduleur formant le réseau", "Équipement", "Référence de tension et de fréquence"]],
      steps: [["Îlotage", "Ouverture du PCC", "Contrôleur", "PCC", "IEC 61850 GOOSE"], ["Fonctionnement îloté", "Partage de charge par statisme", "Onduleurs", "—", ""],
        ["Synchronisation", "Ajustement de fréquence et de phase de l'îlot", "Contrôleur", "Onduleurs", "IEC 61850"], ["Reconnexion", "Fermeture quand Δf, ΔV, Δφ dans les limites", "Synchro-check", "PCC", ""]],
      req_inf: "IEC 61850-7-420.", req_com: "GOOSE (< 10 ms).", req_sec: "IEC 62351-6.", req_perf: "Transition < 100 ms ; essais IEEE 2030.8 (HIL).",
      nrjx: "Simulation dynamique avec évènements « Îlotage » et « Reconnexion synchronisée » (exemples/microreseau_ilotage.xml)."},
    v2g: {title: "Recharge pilotée et réinjection V2G d'une flotte de véhicules", id: "UC-EV-V2G", domain: "Installations clients, DER", zones: "Processus / Terrain / Exploitation",
      scope: "Parc de bornes d'une entreprise", obj_bus: "Réduire le coût de la recharge et offrir de la flexibilité.", obj_tech: "Garantir l'état de charge au départ ; déplacer la recharge ; réinjecter aux heures de pointe.",
      kpi: "Coût moyen de recharge (F/kWh), énergie V2G, état de charge au départ.", pre: "Bornes OCPP 2.0.1 ; véhicules ISO 15118-20.", assump: "Heures d'arrivée et de départ connues.",
      actors: [["Véhicule électrique", "Équipement", "Batterie"], ["Borne (EVSE)", "Équipement", "Charge / décharge"], ["CPO / EMS", "Système", "Profils de recharge"], ["Gestionnaire de réseau", "Organisation", "Signaux de contrainte (OpenADR)"]],
      steps: [["Branchement", "Identification, besoin d'énergie et heure de départ", "VE", "Borne", "ISO 15118-20"], ["Planification", "Calcul du profil", "CPO", "Borne", "OCPP SetChargingProfile"], ["Pointe", "Réinjection", "CPO", "Borne", "ISO 15118-20 BPT"]],
      req_inf: "Messages ISO 15118, OCPP.", req_com: "CPL HomePlug Green PHY, WebSocket TLS.", req_sec: "PKI Plug & Charge.", req_perf: "Respect de l'état de charge au départ à 100 %.",
      nrjx: "Borne VE en mode V1G / V2G : gestion économique et VPP ; séries temporelles en recharge non pilotée."}
  };
  function usecase(div){
    var uc = store.get("usecase", null) || JSON.parse(JSON.stringify(Object.assign({actors: [], steps: []}, UC_TEMPLATES.flisr)));
    div.appendChild(el("h4", "", "Fiche de cas d'usage (modèle IEC 62559-2)"));
    var bar = el("div", "sg-bar");
    var sel = el("select");
    [["", "Charger un modèle…"], ["flisr", "FLISR (guide, § 5.3)"], ["ivvc", "IVVC/r"], ["vpp", "Centrale virtuelle"], ["island", "Îlotage d'un micro-réseau"], ["v2g", "Recharge V2G"], ["blank", "Fiche vierge"]]
      .forEach(function(o){ var op = el("option", "", o[1]); op.value = o[0]; sel.appendChild(op); });
    sel.addEventListener("change", function(){
      if(!sel.value) return;
      uc = sel.value === "blank" ? {actors: [], steps: []} : JSON.parse(JSON.stringify(Object.assign({actors: [], steps: []}, UC_TEMPLATES[sel.value])));
      sel.value = "";
      store.set("usecase", uc);
      build();
    });
    bar.appendChild(sel);
    bar.appendChild(button("Exporter (Markdown)", function(){ download((uc.id || "cas-usage") + ".md", markdown(), "text/markdown;charset=utf-8"); }));
    bar.appendChild(button("Copier", function(b){ copy(markdown(), b); }));
    bar.appendChild(button("Imprimer", function(){ window.print(); }));
    div.appendChild(bar);
    var body = el("div", "sg-uc");
    div.appendChild(body);
    function save(){ store.set("usecase", uc); }
    function field(parent, f){
      var row = el("div", "row");
      row.appendChild(el("label", "", f[1]));
      var inp = f[3] ? el("textarea") : el("input");
      inp.value = uc[f[0]] != null ? uc[f[0]] : f[2];
      inp.addEventListener("input", function(){ uc[f[0]] = inp.value; save(); });
      row.appendChild(inp);
      parent.appendChild(row);
    }
    function table(parent, key, title, cols){
      parent.appendChild(el("h5", "", title));
      var t = el("table", "sg-proto");
      var h = el("tr");
      cols.forEach(function(c){ h.appendChild(el("th", "", c)); });
      h.appendChild(el("th", "", ""));
      t.appendChild(h);
      (uc[key] || []).forEach(function(r, i){
        var tr = el("tr");
        cols.forEach(function(c, k){
          var td = el("td"), inp = el("textarea");
          inp.rows = 2;
          inp.value = r[k] || "";
          inp.addEventListener("input", function(){ r[k] = inp.value; save(); });
          td.appendChild(inp); tr.appendChild(td);
        });
        var td = el("td");
        td.appendChild(button("✕", function(){ uc[key].splice(i, 1); save(); build(); }));
        tr.appendChild(td);
        t.appendChild(tr);
      });
      parent.appendChild(t);
      parent.appendChild(button("+ ligne", function(){ (uc[key] = uc[key] || []).push(cols.map(function(){ return ""; })); save(); build(); }));
    }
    function build(){
      body.innerHTML = "";
      UC_FIELDS.forEach(function(sec, si){
        var s = el("fieldset");
        s.appendChild(el("legend", "", sec[0]));
        sec[1].forEach(function(f){ field(s, f); });
        body.appendChild(s);
        if(si === 2){
          var a = el("fieldset");
          a.appendChild(el("legend", "", "4. Acteurs et scénario principal"));
          table(a, "actors", "Acteurs", ["Acteur", "Type", "Rôle"]);
          table(a, "steps", "Étapes du scénario", ["Étape", "Description", "Initiateur", "Destinataire", "Information échangée / protocole"]);
          body.appendChild(a);
        }
      });
    }
    function markdown(){
      var s = "# " + (uc.id || "") + " — " + (uc.title || "Cas d'usage") + "\n\n_Modèle IEC 62559-2, établi avec NRJXpert_\n";
      UC_FIELDS.forEach(function(sec, si){
        s += "\n## " + sec[0] + "\n\n";
        sec[1].forEach(function(f){ s += "- **" + f[1] + "** : " + (uc[f[0]] || "") + "\n"; });
        if(si === 2){
          s += "\n## 4. Acteurs et scénario principal\n\n| Acteur | Type | Rôle |\n|---|---|---|\n";
          (uc.actors || []).forEach(function(r){ s += "| " + r.join(" | ") + " |\n"; });
          s += "\n| Étape | Description | Initiateur | Destinataire | Information / protocole |\n|---|---|---|---|---|\n";
          (uc.steps || []).forEach(function(r){ s += "| " + r.join(" | ") + " |\n"; });
        }
      });
      return s;
    }
    build();
  }

  /* ================================================================== matrice des compétences (guide, § 5.2) */
  var SKILLS = [
    ["Génie électrique et conduite de réseau", ["Load flow et plans de tension", "Court-circuit et plan de protection", "Stabilité, machines et convertisseurs", "Automatismes de réseau (FLISR, IVVC)"],
      "Niveaux 2 et 5 ; calculs FLISR, IVVC et dynamique (niveau 6, § 6.3 à 6.6)", "niveau2.html"],
    ["Architecture des systèmes d'information OT/IT", ["SCADA, ADMS, EMS, DERMS", "SIG, MDM, ERP", "Intégration d'entreprise (ESB, Kafka, MQTT)", "Centrales virtuelles et agrégation"],
      "§ 6.2 et 6.5 ; calcul VPP", "#n6-2"],
    ["Normalisation et interopérabilité", ["Modèle SGAM (IEC SRD 63200)", "CIM (IEC 61970 / 61968)", "IEC 61850 et DLMS/COSEM", "IEEE 1547, ISO 15118, OCPP"],
      "§ 6.1 et 6.8 ; outil SGAM ; export CIM et liste des points", "#n6-1"],
    ["Télécommunications et cybersécurité industrielle", ["Réseaux cellulaires, fibre, G3-PLC", "Protocoles IP, IEC 60870-5-104", "Défense en profondeur (IEC 62443)", "Chiffrement, PKI (IEC 62351)"],
      "§ 6.8 et 6.9 ; exigences de sécurité des fiches de cas d'usage", "#n6-8"],
    ["Gouvernance, économie et régulation", ["Marchés et valorisation de la flexibilité", "Capex, Opex, TCO", "Cadre réglementaire des gestionnaires", "Marchés publics, AMOA (CCTP, FAT/SAT)"],
      "Niveau 4 ; § 6.9 ; calculatrice TCO et grille d'évaluation", "#n6-9"]];
  var LEVELS = ["0 — inconnu", "1 — notions", "2 — pratique guidée", "3 — autonome", "4 — expert (peut former)"];
  function skills(div){
    var v = store.get("skills", {});
    div.appendChild(el("h4", "", "Auto-évaluation : matrice des compétences de l'expert Smart Grid"));
    var grid = el("div", "sg-skills");
    var radar = el("div", "sg-radar");
    var out = el("div", "out");
    div.appendChild(grid); div.appendChild(radar); div.appendChild(out);
    SKILLS.forEach(function(s, i){
      var box = el("fieldset");
      box.appendChild(el("legend", "", s[0]));
      s[1].forEach(function(x, j){
        var row = el("div", "row");
        row.appendChild(el("label", "", x));
        var sel = el("select");
        LEVELS.forEach(function(l, k){ var op = el("option", "", l); op.value = k; sel.appendChild(op); });
        sel.value = v[i + "." + j] || 0;
        sel.addEventListener("change", function(){ v[i + "." + j] = +sel.value; store.set("skills", v); draw(); });
        row.appendChild(sel);
        box.appendChild(row);
      });
      grid.appendChild(box);
    });
    function avg(i){ var s = 0; SKILLS[i][1].forEach(function(x, j){ s += +(v[i + "." + j] || 0); }); return s / SKILLS[i][1].length; }
    function draw(){
      var n = SKILLS.length, R = 110, cx = 150, cy = 140, pts = [], axes = "", rings = "";
      for(var r = 1; r <= 4; r++){
        var ring = [];
        for(var i = 0; i < n; i++){ var a = -Math.PI / 2 + 2 * Math.PI * i / n; ring.push((cx + R * r / 4 * Math.cos(a)).toFixed(1) + "," + (cy + R * r / 4 * Math.sin(a)).toFixed(1)); }
        rings += '<polygon points="' + ring.join(" ") + '" fill="none" stroke="var(--line)"/>';
      }
      for(var i = 0; i < n; i++){
        var a = -Math.PI / 2 + 2 * Math.PI * i / n, m = avg(i);
        pts.push((cx + R * m / 4 * Math.cos(a)).toFixed(1) + "," + (cy + R * m / 4 * Math.sin(a)).toFixed(1));
        axes += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + R * Math.cos(a)).toFixed(1) + '" y2="' + (cy + R * Math.sin(a)).toFixed(1) + '" stroke="var(--line)"/>';
        var lx = cx + (R + 18) * Math.cos(a), ly = cy + (R + 18) * Math.sin(a);
        axes += '<text x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" font-size="10.5" fill="var(--muted)" text-anchor="' + (Math.cos(a) > 0.2 ? "start" : Math.cos(a) < -0.2 ? "end" : "middle") + '">' + (i + 1) + ". " + fr(m, 1) + '</text>';
      }
      radar.innerHTML = '<svg viewBox="-60 0 420 290" role="img" aria-label="Profil de compétences">' + rings + axes +
        '<polygon points="' + pts.join(" ") + '" fill="color-mix(in srgb, var(--accent) 25%, transparent)" stroke="var(--accent)" stroke-width="2"/></svg>';
      var weak = [];
      SKILLS.forEach(function(s, i){ if(avg(i) < 2.5) weak.push("<li><b>" + (i + 1) + ". " + s[0] + "</b> (" + fr(avg(i), 1) + "/4) : " + s[2] + " — <a href='" + s[3] + "'>commencer</a></li>"); });
      var tot = 0; SKILLS.forEach(function(s, i){ tot += avg(i); });
      out.innerHTML = "Moyenne générale : <b>" + fr(tot / n, 2) + " / 4</b>. " + (weak.length ? "Domaines à renforcer :<ul>" + weak.join("") + "</ul>" :
        "Profil d'expert : tous les domaines sont au moins au niveau « autonome ».");
    }
    draw();
  }

  /* ================================================================== calculatrices */
  function form(div, title, fields, compute){
    div.classList.add("calc");
    div.appendChild(el("h4", "", title));
    var inputs = {};
    fields.forEach(function(f){
      var row = el("div", "row");
      row.appendChild(el("label", "", f[1]));
      var inp;
      if(Array.isArray(f[2])){ inp = el("select"); f[2].forEach(function(o){ var op = el("option", "", o[1]); op.value = o[0]; inp.appendChild(op); }); }
      else{ inp = el("input"); inp.value = f[2]; }
      row.appendChild(inp);
      row.appendChild(el("span", "small", f[3] || ""));
      div.appendChild(row);
      inputs[f[0]] = inp;
      inp.addEventListener("input", run); inp.addEventListener("change", run);
    });
    var out = el("div", "out");
    div.appendChild(out);
    function run(){
      var v = {};
      for(var k in inputs) v[k] = inputs[k].tagName === "SELECT" ? inputs[k].value : num(inputs[k]);
      try{ out.innerHTML = compute(v); }catch(e){ out.textContent = "Saisie incomplète."; }
    }
    run();
  }
  var TOOLS = {
    sgam: sgam, protocols: protocols, usecase: usecase, skills: skills,
    reliab: function(div){
      form(div, "Fiabilité d'un départ : SAIDI, SAIFI, END avec et sans automatisation", [
        ["n", "Nombre de clients", "2000", ""], ["p", "Puissance moyenne appelée", "2,5", "MW"], ["l", "Longueur du départ", "20", "km"],
        ["lam", "Taux de défaillance", "0,1", "/km/an"], ["k", "Nombre de tronçons (organes de coupure)", "4", ""],
        ["r", "Durée de réparation", "4", "h"], ["tm", "Recherche + manœuvres manuelles", "1,5", "h"], ["ta", "Séquence FLISR", "1,5", "min"],
        ["mom", "Seuil coupure brève", "3", "min"], ["tie", "Report possible par un départ voisin", [["1", "oui"], ["0", "non"]]]],
      function(v){
        // départ à k tronçons égaux, clients répartis ; un défaut dans le tronçon i coupe tout le départ (disjoncteur de tête)
        var L = v.lam * v.l, k = Math.max(1, Math.round(v.k)), c = v.n / k, pk = v.p / k;
        function strat(ts){
          var cmi = 0, ci = 0, ens = 0, mom = 0;
          for(var i = 0; i < k; i++){
            for(var j = 0; j < k; j++){
              var d;
              if(j === i) d = v.r;
              else if(j < i || v.tie === "1") d = ts;     // amont : refermeture ; aval : report par le départ voisin
              else d = v.r;
              var dm = d * 60;
              if(dm > v.mom){ ci += c; cmi += c * dm; } else mom += c;
              ens += pk * 1000 * d;
            }
          }
          var f = L / k;
          return {saidi: f * cmi / v.n, saifi: f * ci / v.n, maifi: f * mom / v.n, ens: f * ens};
        }
        var m = strat(v.tm), a = strat(v.ta / 60);
        return "Défaillances : λ·L = <b>" + fr(L, 2) + " /an</b><br>" +
          "Sans automatisation : SAIDI = <b>" + fr(m.saidi, 1) + " min/an</b>, SAIFI = <b>" + fr(m.saifi, 2) + " /an</b>, END = " + fr(m.ens, 0) + " kWh/an<br>" +
          "Avec FLISR : SAIDI = <b>" + fr(a.saidi, 1) + " min/an</b>, SAIFI = <b>" + fr(a.saifi, 2) + " /an</b>, MAIFI = " + fr(a.maifi, 2) + " /an, END = " + fr(a.ens, 0) + " kWh/an" +
          "<br><span class='small'>Modèle simplifié : tronçons égaux, clients répartis uniformément, report total possible. Pour un réseau réel : calcul « Auto-cicatrisation » de NRJXpert.</span>";
      });
    },
    cvr: function(div){
      form(div, "Réduction de consommation par la tension (CVR) — charges ZIP", [
        ["z", "Part à impédance constante (Z)", "40", "%"], ["i", "Part à courant constant (I)", "30", "%"], ["p", "Part à puissance constante (P)", "30", "%"],
        ["dv", "Baisse de tension", "3", "%"], ["e", "Énergie annuelle du départ", "20000", "MWh"]],
      function(v){
        var s = v.z + v.i + v.p, z = v.z / s, i = v.i / s, p = v.p / s, x = 1 - v.dv / 100;
        var ratio = z * x * x + i * x + p, cvrf = (1 - ratio) / (v.dv / 100);
        return "P(V)/P0 = Z·v² + I·v + P = " + fr(ratio, 4) + " pour v = " + fr(x, 3) + " pu<br>Facteur CVR = (ΔP/P)/(ΔV/V) = <b>" + fr(cvrf, 2) +
          "</b> (≈ 2Z + I = " + fr(2 * z + i, 2) + ")<br>Économie : <b>" + fr((1 - ratio) * 100, 2) + " %</b>, soit <b>" + fr((1 - ratio) * v.e, 0) + " MWh/an</b>";
      });
    },
    sync: function(div){
      form(div, "Synchro-check d'un micro-réseau (IEEE 1547-2018, tableau 39)", [
        ["s", "Puissance des sources de l'îlot", "1200", "kVA"], ["df", "Écart de fréquence", "0,15", "Hz"], ["dv", "Écart de tension", "2", "%"], ["dp", "Écart de phase", "12", "°"]],
      function(v){
        var lim = v.s <= 500 ? [0.3, 10, 20] : v.s <= 1500 ? [0.2, 5, 15] : [0.1, 3, 10];
        var ok = [Math.abs(v.df) <= lim[0], Math.abs(v.dv) <= lim[1], Math.abs(v.dp) <= lim[2]];
        var t = function(b){ return b ? "<span class='check'>✓</span>" : "<span style='color:var(--bad)'>✗</span>"; };
        return "Limites pour " + fr(v.s, 0) + " kVA : Δf ≤ " + fr(lim[0], 1) + " Hz, ΔV ≤ " + lim[1] + " %, Δφ ≤ " + lim[2] + "°<br>" +
          "Δf " + t(ok[0]) + "  ΔV " + t(ok[1]) + "  Δφ " + t(ok[2]) + " → <b>" + (ok[0] && ok[1] && ok[2] ? "fermeture autorisée" : "fermeture interdite : le synchroniseur doit corriger l'îlot") + "</b>";
      });
    },
    tco: function(div){
      form(div, "Analyse des offres (phase 4 AMOA) : coût global de possession et note pondérée", [
        ["ca", "Offre A — investissement (équipements, intégration, formation)", "450", "MF"], ["oa", "Offre A — coûts récurrents (maintenance, licences, télécom)", "35", "MF/an"], ["ta", "Offre A — note technique", "82", "/100"],
        ["cb", "Offre B — investissement", "380", "MF"], ["ob", "Offre B — coûts récurrents", "48", "MF/an"], ["tb", "Offre B — note technique", "74", "/100"],
        ["n", "Durée d'analyse", "10", "ans"], ["a", "Taux d'actualisation", "8", "%"], ["w", "Poids de la note technique", "60", "%"]],
      function(v){
        var a = v.a / 100, fa = a > 0 ? (1 - Math.pow(1 + a, -v.n)) / a : v.n;
        var A = v.ca + v.oa * fa, B = v.cb + v.ob * fa, mn = Math.min(A, B);
        var pa = 100 * mn / A, pb = 100 * mn / B, w = v.w / 100;
        var na = w * v.ta + (1 - w) * pa, nb = w * v.tb + (1 - w) * pb;
        return "TCO actualisé sur " + v.n + " ans : A = <b>" + fr(A, 0) + " MF</b>, B = <b>" + fr(B, 0) + " MF</b><br>" +
          "Note prix (100 × TCO mini / TCO) : A = " + fr(pa, 1) + ", B = " + fr(pb, 1) + "<br>" +
          "Note globale : A = <b>" + fr(na, 1) + "</b>, B = <b>" + fr(nb, 1) + "</b> → offre <b>" + (na >= nb ? "A" : "B") + "</b> la mieux classée";
      });
    }
  };
  document.addEventListener("DOMContentLoaded", function(){
    document.querySelectorAll(".sg[data-tool]").forEach(function(d){ var f = TOOLS[d.getAttribute("data-tool")]; if(f) f(d); });
  });
})();
