/* NRJXpert tutorial — Level 6 "Smart Grids": interactive tools (no dependencies, works offline). English version of smartgrid.js.
   <div class="sg" data-tool="sgam|protocols|usecase|skills|reliab|cvr|sync|tco"></div>
   Inputs (SGAM mapping, use case sheet, self-assessment) are kept in the browser (localStorage). */
(function(){
  "use strict";
  var fr = function(x, d){ if(!isFinite(x)) return "—"; return x.toLocaleString("en-GB", {minimumFractionDigits:d, maximumFractionDigits:d}); };
  var num = function(el){ return parseFloat(String(el.value).replace(/\s/g, "").replace(",", ".")); };
  var el = function(tag, cls, html){ var e = document.createElement(tag); if(cls) e.className = cls; if(html != null) e.innerHTML = html; return e; };
  var store = {
    get: function(k, d){ try{ var v = localStorage.getItem("nrjxpert.sg.en." + k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
    set: function(k, v){ try{ localStorage.setItem("nrjxpert.sg.en." + k, JSON.stringify(v)); }catch(e){} }
  };
  function download(name, text, type){
    try{
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([text], {type: type || "text/plain;charset=utf-8"}));
      a.download = name; document.body.appendChild(a); a.click(); a.remove();
    }catch(e){ alert(text); }
  }
  function copy(text, btn){
    var done = function(){ if(btn){ var t = btn.textContent; btn.textContent = "Copied ✓"; setTimeout(function(){ btn.textContent = t; }, 1500); } };
    if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function(){ download("export.txt", text); });
    else download("export.txt", text);
  }
  function button(text, fn, cls){ var b = el("button", cls || "", text); b.type = "button"; b.addEventListener("click", function(){ fn(b); }); return b; }

  /* ================================================================== SGAM (IEC SRD 63200) */
  var DOMAINS = [["gen", "Bulk generation"], ["tra", "Transmission"], ["dis", "Distribution"], ["der", "DER"], ["cus", "Customer premises"]];
  var ZONES = [["mar", "Market"], ["ent", "Enterprise"], ["ope", "Operation"], ["sta", "Station"], ["fie", "Field"], ["pro", "Process"]];
  var LAYERS = [["bus", "Business"], ["fun", "Function"], ["inf", "Information"], ["com", "Communication"], ["cmp", "Component"]];
  /* item: [label, layer, allowed domains, allowed zones, explanation] */
  var ITEMS = [
    ["Feeder circuit breaker (switchgear)", "cmp", ["dis"], ["pro"], "Primary equipment: Process zone of the Distribution domain."],
    ["Feeder protection relay (IED)", "cmp", ["dis"], ["fie"], "Protection and control IED: Field zone."],
    ["RTU / primary substation gateway", "cmp", ["dis"], ["sta"], "Concentrates the substation IEDs and talks to SCADA: Station zone."],
    ["Control centre ADMS / SCADA", "cmp", ["dis"], ["ope"], "Real-time network operation: Operation zone."],
    ["Remote-controlled switch (RCS)", "cmp", ["dis"], ["pro", "fie"], "Network switching device (Process) with its remote-control cabinet (Field)."],
    ["Fault passage indicator (FPI)", "cmp", ["dis"], ["fie"], "Communicating sensor installed on the network: Field zone."],
    ["HV/MV substation transformer", "cmp", ["tra", "dis"], ["pro"], "Primary equipment at the Transmission / Distribution boundary."],
    ["Transmission operator EMS", "cmp", ["tra"], ["ope"], "Transmission network operation (IEC 61970)."],
    ["Thermal power plant", "cmp", ["gen"], ["pro"], "Bulk generation connected to the transmission network."],
    ["PV / BESS inverter", "cmp", ["der"], ["pro"], "Power electronics of the resource: Process zone of the DER domain."],
    ["Power plant controller (PPC)", "cmp", ["der"], ["fie"], "Controls the inverters of a site: Field zone."],
    ["DERMS", "cmp", ["der", "dis"], ["ope"], "Network-wide DER management: Operation zone (DER or Distribution domain)."],
    ["Aggregator platform (VPP)", "cmp", ["der"], ["ent", "ope"], "Aggregates a DER portfolio (Enterprise) and dispatches it (Operation)."],
    ["Smart meter", "cmp", ["cus"], ["fie", "pro"], "Metering equipment at the customer's premises: Field (or Process) zone."],
    ["AMI data concentrator (MV/LV substation)", "cmp", ["dis"], ["sta"], "Collects the meters of a distribution substation: Station zone."],
    ["MDM (meter data management)", "cmp", ["dis", "cus"], ["ent"], "Information system: Enterprise zone."],
    ["Charging station (EVSE)", "cmp", ["cus"], ["pro", "fie"], "Equipment at the customer's premises (or in a public space)."],
    ["Charge point operator system (CPO)", "cmp", ["cus"], ["ope", "ent"], "Supervises the charging stations (OCPP): Operation / Enterprise."],
    ["Power exchange", "cmp", ["gen", "tra", "dis", "der", "cus"], ["mar"], "Market zone, whatever the domain."],
    ["IEC 61850 GOOSE / MMS", "com", ["dis", "tra", "der"], ["sta", "fie"], "Substation network: station bus (MMS) and fast messages between IEDs (GOOSE)."],
    ["IEC 60870-5-104", "com", ["dis", "tra"], ["ope", "sta"], "Telecontrol between SCADA (Operation) and the substations / RTUs."],
    ["DLMS/COSEM over G3-PLC", "com", ["cus", "dis"], ["fie", "sta"], "Power line carrier between meters (Field) and concentrator (Station)."],
    ["Modbus RTU/TCP", "com", ["der", "cus"], ["pro", "fie"], "Local link between inverters, batteries and PLCs."],
    ["OCPP 2.0.1", "com", ["cus"], ["fie", "ope"], "Between the charging station (Field) and the CPO system (Operation)."],
    ["OpenADR 2.0b", "com", ["der", "cus", "dis"], ["ent", "ope"], "Price and demand-response signals between utility / aggregator and customers."],
    ["IEEE 2030.5 (SEP 2.0)", "com", ["der", "cus"], ["fie", "ope"], "Interface between customer DER and the utility's or aggregator's server."],
    ["CIM IEC 61968 (distribution)", "inf", ["dis"], ["ope", "ent"], "Exchanges between distribution applications (ADMS, GIS, OMS, MDM)."],
    ["CIM IEC 61970 (transmission)", "inf", ["tra"], ["ope"], "Network model of EMS and power flow calculations."],
    ["IEC 62325 (markets)", "inf", ["gen", "tra", "dis", "der"], ["mar", "ent"], "Market messages: schedules, balancing."],
    ["IEC 61850-7-420 data model (DER)", "inf", ["der"], ["fie", "sta"], "DER logical nodes (ZBAT, DRCC, DOPM…)."],
    ["COSEM objects / OBIS codes", "inf", ["cus"], ["fie"], "Semantics of the quantities measured by the meter."],
    ["FLISR (self-healing)", "fun", ["dis"], ["ope"], "ADMS function; relies on the field FPIs and RCSs."],
    ["IVVC/r (integrated Volt/VAR)", "fun", ["dis", "der"], ["ope"], "Voltage optimisation by the DMS, inverters included."],
    ["VPP aggregation", "fun", ["der"], ["ent", "ope"], "Dispatch of a DER portfolio."],
    ["Smart charging V1G / V2G", "fun", ["cus", "der"], ["ope", "fie"], "Charging management by the CPO or the site EMS."],
    ["Microgrid islanding (IEEE 2030.7)", "fun", ["der", "dis"], ["fie", "sta"], "Microgrid controller function."],
    ["Flexibility market", "bus", ["der", "dis", "cus"], ["mar"], "Monetisation of services (reserve, demand response)."],
    ["Continuity regulation (SAIDI, penalties)", "bus", ["dis"], ["ent"], "Utility objective set by the regulator."]
  ];
  function sgam(div){
    var state = store.get("sgam", {});        // item index -> "domain|zone"
    var layer = "cmp", pick = null, checked = false;
    div.appendChild(el("h4", "", "SGAM mapping: place the items on the Domains × Zones grid"));
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
    var info = el("div", "out", "Choose a layer, click an item, then click the cell (domain, zone) where it belongs.");
    div.appendChild(info);
    var tools = el("div", "sg-bar");
    tools.appendChild(button("Check", function(){ checked = true; draw(); }));
    tools.appendChild(button("Clear layer", function(){ ITEMS.forEach(function(it, i){ if(it[1] === layer) delete state[i]; }); store.set("sgam", state); checked = false; draw(); }));
    tools.appendChild(button("Export (text)", function(b){ copy(exportText(), b); }));
    div.appendChild(tools);
    function ok(i){ var it = ITEMS[i], p = (state[i] || "").split("|"); return it[2].indexOf(p[0]) >= 0 && it[3].indexOf(p[1]) >= 0; }
    function exportText(){
      var s = "SGAM mapping (IEC SRD 63200) — NRJXpert\n";
      LAYERS.forEach(function(l){
        s += "\n" + l[1] + " layer\n";
        ITEMS.forEach(function(it, i){
          if(it[1] !== l[0]) return;
          var p = (state[i] || "").split("|");
          var d = DOMAINS.find(function(x){ return x[0] === p[0]; }), z = ZONES.find(function(x){ return x[0] === p[1]; });
          s += "  - " + it[0] + ": " + (d && z ? d[1] + " / " + z[1] : "not placed") + "\n";
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
        c.title = state[i] ? "placed" : "to place";
        c.addEventListener("click", function(){ pick = (pick === i ? null : i); draw(); info.innerHTML = "<b>" + it[0] + "</b>: click the cell where it belongs."; });
        chips.appendChild(c);
      });
      grid.innerHTML = "";
      var h = el("tr");
      h.appendChild(el("th", "", "Zone \\ Domain"));
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
            c.title = "click to remove";
            td.appendChild(c);
          });
          td.addEventListener("click", function(){
            if(pick == null) return;
            state[pick] = d[0] + "|" + z[0];
            store.set("sgam", state);
            var it = ITEMS[pick];
            info.innerHTML = "<b>" + it[0] + "</b> placed in " + d[1] + " / " + z[1] + (checked ? (ok(pick) ? " — <span class='check'>correct</span>. " : " — <span style='color:var(--bad)'>to review</span>. ") + it[4] : ".");
            pick = null;
            draw();
          });
          tr.appendChild(td);
        });
        grid.appendChild(tr);
      });
      if(checked)
        info.innerHTML = LAYERS.find(function(l){ return l[0] === layer; })[1] + " layer: <b>" + good + " / " + n + "</b> items correctly placed (" +
          placed + " placed). Misplaced items are shown in red; click them to remove them, then place them again.";
    }
    draw();
  }

  /* ================================================================== protocols (guide, § 4.4) */
  var PROTO = [
    ["IEC 61850", "yes", "Logical nodes (LN), SCL files (XML)", "MMS (TCP/IP), GOOSE and SV (layer-2 Ethernet)", "Substations, IEDs, fast interlocking, microgrids, DER", "Station, Field", "lan"],
    ["CIM (IEC 61970/61968)", "yes", "UML ontology, RDF/XML", "HTTP, AMQP, web services, JMS", "Exchanges between IT/OT applications (GIS, ADMS, EMS), markets", "Operation, Enterprise", "it"],
    ["DLMS/COSEM (IEC 62056)", "yes", "COSEM objects, OBIS codes", "G3-PLC, RS-485, HDLC, TCP/IPv6", "Smart metering, remote reading, LV load profiles", "Field, Station", "ami"],
    ["IEC 60870-5-104", "no", "Information object addresses (IOA)", "TCP/IP (port 2404)", "SCADA telecontrol, substations, switching devices (RCS)", "Operation, Station", "scada"],
    ["DNP3 (IEEE 1815)", "no", "Object and point indexes (classes 0 to 3)", "Serial, TCP/UDP (port 20000)", "Telecontrol (North America, Australia)", "Operation, Station", "scada"],
    ["Modbus RTU/TCP", "no", "16-bit registers", "RS-485, TCP/IP (port 502)", "PLCs, panel meters, inverters, BESS (SunSpec models)", "Field, Process", "local"],
    ["IEEE 2030.5 (SEP 2.0)", "yes", "REST objects, XML / JSON", "TCP/IP, Wi-Fi, Ethernet, 6LoWPAN", "Customer DER interfaces, demand management, smart inverters", "Field, Operation", "der"],
    ["OpenADR 2.0b", "yes", "XML schemas (REST)", "HTTP/HTTPS, XMPP", "Price signals, demand-response programmes, load shedding", "Enterprise, Operation", "der"],
    ["ISO 15118-20", "yes", "V2G messages, EXI encoding", "TCP/IP over PLC (HomePlug Green PHY)", "Vehicle–charger, Plug & Charge, V2G", "Process, Field", "ev"],
    ["OCPP 2.0.1", "yes", "JSON messages", "WebSocket over TLS", "Charger–CPO system, smart charging", "Field, Operation", "ev"]
  ];
  function protocols(div){
    div.appendChild(el("h4", "", "Smart Grid protocol comparator"));
    var f = el("div", "sg-bar");
    var sem = el("select");
    [["", "Semantic model: all"], ["yes", "with semantic model"], ["no", "without semantic model"]].forEach(function(o){ var op = el("option", "", o[1]); op.value = o[0]; sem.appendChild(op); });
    var dom = el("select");
    [["", "Use: all"], ["scada", "Telecontrol"], ["lan", "Substation / IED"], ["ami", "Metering"], ["der", "DER / demand response"], ["ev", "E-mobility"], ["it", "Information systems"], ["local", "Local links"]].forEach(function(o){ var op = el("option", "", o[1]); op.value = o[0]; dom.appendChild(op); });
    var q = el("input");
    q.placeholder = "Search (TCP, JSON, inverter…)";
    f.appendChild(sem); f.appendChild(dom); f.appendChild(q);
    div.appendChild(f);
    var t = el("table", "sg-proto");
    div.appendChild(t);
    function draw(){
      t.innerHTML = "<tr><th>Protocol</th><th>Semantic model</th><th>Data model</th><th>Transport / network</th><th>Use cases</th><th>SGAM zones</th></tr>";
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

  /* ================================================================== IEC 62559-2 use case sheet */
  var UC_FIELDS = [
    ["1. Identification", [["id", "Identifier", "UC-DIST-01"], ["title", "Use case title", ""], ["version", "Version / date", "0.1"],
      ["author", "Author", ""], ["domain", "SGAM domain(s)", ""], ["zones", "SGAM zone(s)", ""], ["scope", "Scope", ""]]],
    ["2. Objectives", [["obj_bus", "Business objective", "", 1], ["obj_tech", "Technical objective", "", 1], ["kpi", "Key performance indicators (KPI)", "", 1]]],
    ["3. Preconditions and assumptions", [["pre", "Preconditions", "", 1], ["assump", "Assumptions", "", 1]]],
    ["5. Interoperability requirements", [["req_inf", "Information layer", "", 1], ["req_com", "Communication layer", "", 1],
      ["req_sec", "Security (IEC 62351, IEC 62443)", "", 1], ["req_perf", "Performance (response time, availability)", "", 1]]],
    ["6. Verification with NRJXpert", [["nrjx", "Validation calculation or study", "", 1]]]
  ];
  var UC_TEMPLATES = {
    flisr: {title: "Fault location, isolation and service restoration on an MV feeder (FLISR)", id: "UC-DIST-FLISR", domain: "Distribution",
      zones: "Field / Station / Operation", scope: "MV feeders of the primary substation, remote-controlled switches and FPIs",
      obj_bus: "Reduce the average interruption duration per customer (SAIDI) and improve continuity of supply.",
      obj_tech: "Isolate the faulted section in less than 30 seconds and re-energise the healthy sections without human intervention.",
      kpi: "SAIDI, SAIFI, MAIFI, energy not supplied; duration of the automatic sequence; success rate.",
      pre: "MV feeder modelled with exact topology in the ADMS; remote-controlled switches operational; communication channels active.",
      assump: "Permanent fault; transfer capacity of the neighbouring feeder checked by load flow.",
      actors: [["Fault passage indicators (FPI)", "Equipment", "Signal the passage of fault current"],
        ["Remote-controlled switches (RCS)", "Equipment", "Execute opening and closing commands"],
        ["Substation IED / feeder circuit breaker", "Equipment", "Protection and reclosing"],
        ["ADMS FLISR engine", "System", "Locates, isolates, computes the restoration plan"],
        ["Control room operator", "Person", "Supervises and validates the sequence"]],
      steps: [["Detection", "Short circuit; feeder breaker trips; FPI alarms", "IED, FPI", "ADMS", "Time-stamped states and alarms (IEC 60870-5-104)"],
        ["Location", "The FLISR engine analyses the topology and identifies the faulted section between two remote-controlled switches", "ADMS", "—", "Network model (CIM IEC 61968-13)"],
        ["Isolation", "Opening commands to the two switches on either side of the fault", "ADMS", "RCS", "Double commands (C_DC_NA_1)"],
        ["Restoration", "Load-flow check of the transfer capacity, breaker reclosing, closing of the tie switch", "ADMS", "Breaker, NO switch", "Commands, status feedback"]],
      req_inf: "States and measurements according to IEC 61850 (LN XCBR, XSWI, MMXU, SFPI) in the substation; conversion to the CIM model (IEC 61968-13, CDPSM) in the ADMS.",
      req_com: "Secure IP link (IPsec VPN / TLS) over private cellular network or optical fibre; IEC 60870-5-104 to the RCSs.",
      req_sec: "Mutual authentication of devices and command logging according to IEC 62351; segmentation (IEC 62443).",
      req_perf: "Automatic sequence < 3 min (short interruption); telecommunication availability > 99.5 %.",
      nrjx: "\"Self-healing (FLISR), reliability\" calculation: sequence, customers interrupted, ENS; annual SAIDI/SAIFI study with and without automation (exemples/flisr_deux_departs.xml)."},
    ivvc: {title: "Integrated volt / VAR optimisation with smart inverters (IVVC/r)", id: "UC-DIST-IVVC", domain: "Distribution, DER", zones: "Operation / Station / Field",
      scope: "MV feeder with on-load tap changer, capacitor banks and PV plants",
      obj_bus: "Reduce losses and consumption (CVR) while meeting the contractual voltage; increase hosting capacity.",
      obj_tech: "Every 15 min, compute the taps, capacitor steps and inverter reactive set-points without leaving [0.95; 1.05] pu.",
      kpi: "Losses (kWh), energy drawn, hours out of range, number of tap changer and capacitor operations.",
      pre: "Voltage measurements at the feeder end; remotely controllable inverters; generation forecast.", assump: "Loads represented by a ZIP model.",
      actors: [["DMS (IVVC function)", "System", "Optimises and sends set-points"], ["On-load tap changer (YLTC/ATCC)", "Equipment", "Changes tap"],
        ["Capacitor banks (ZCAP)", "Equipment", "Step-by-step switching"], ["PV inverters (DRCC, DOPM)", "Equipment", "Q or cos φ set-point, Q(V) curve"]],
      steps: [["Acquisition", "Voltage, power and status measurements", "IED, inverters", "DMS", "IEC 61850 / 104 / SunSpec Modbus"],
        ["Optimisation", "Load flow and optimisation of settings", "DMS", "—", "CIM model"],
        ["Set-points", "Tap, capacitor steps, reactive set-points", "DMS", "Tap changer, capacitors, inverters", "C_RC_NA_1, C_SE_NC_1, IEEE 2030.5"]],
      req_inf: "CIM network model; IEC 61850-7-420 logical nodes of the DER.", req_com: "IEC 60870-5-104 to the substation; IEEE 2030.5 or SunSpec Modbus to the inverters.",
      req_sec: "IEC 62351; access control to the inverter set-points.", req_perf: "15-min cycle; fallback to local Q(V) if communications are lost.",
      nrjx: "\"Volt/VAR control (IVVC)\" calculation: strategies S0 to S3 (exemples/ivvc_ieee33.xml)."},
    vpp: {title: "Virtual power plant: aggregation and exchange schedule", id: "UC-DER-VPP", domain: "DER, Customer premises", zones: "Market / Enterprise / Operation",
      scope: "Portfolio of PV, batteries, charging stations, demand response", obj_bus: "Monetise flexibility (reserve, schedule, demand response).",
      obj_tech: "Follow the exchange schedule at the point of connection without voltage constraints or overloads.", kpi: "Deviation from schedule, reserve sold, cost, hours under constraint.",
      pre: "Remotely controllable DER; load and generation forecasts; prices.", assump: "Network checked by the DERMS.",
      actors: [["Aggregator (VPP)", "Organisation / system", "Optimises the portfolio"], ["Utility DERMS", "System", "Checks network constraints"], ["DER", "Equipment", "Execute the set-points"]],
      steps: [["Schedule", "Receipt of the schedule and prices", "Market", "VPP", "IEC 62325, OpenADR"], ["Optimisation", "Computation of each DER's set-points", "VPP", "—", ""],
        ["Check", "Constraint verification", "VPP", "DERMS", "CIM"], ["Set-points", "Dispatch to the DER", "VPP", "DER", "IEEE 2030.5, OCPP, Modbus"]],
      req_inf: "CIM, IEC 61850-7-420.", req_com: "OpenADR 2.0b, IEEE 2030.5, OCPP 2.0.1.", req_sec: "TLS, certificates.", req_perf: "Set-points every 15 min; reserve available within 15 min.",
      nrjx: "\"Virtual power plant (VPP)\" calculation (exemples/vpp_ve_batterie.xml)."},
    island: {title: "Intentional islanding and resynchronisation of a microgrid", id: "UC-MG-ISL", domain: "DER, Distribution", zones: "Field / Station",
      scope: "Microgrid with grid-forming battery and PV", obj_bus: "Continuity of supply for a critical site (hospital, campus).",
      obj_tech: "Go into island mode without frequency collapse; reconnect within the synchronisation criteria (IEEE 1547).", kpi: "Nadir, RoCoF, resynchronisation time.",
      pre: "Grid-forming battery of sufficient rating; remote-controlled coupling breaker.", assump: "Loads without shedding.",
      actors: [["Microgrid controller (IEEE 2030.7)", "System", "Transition, dispatch"], ["Coupling breaker (PCC)", "Equipment", "Opening / closing"], ["Grid-forming inverter", "Equipment", "Voltage and frequency reference"]],
      steps: [["Islanding", "Opening of the PCC", "Controller", "PCC", "IEC 61850 GOOSE"], ["Islanded operation", "Load sharing by droop", "Inverters", "—", ""],
        ["Synchronisation", "Adjustment of the island frequency and phase", "Controller", "Inverters", "IEC 61850"], ["Reconnection", "Closing when Δf, ΔV, Δφ are within limits", "Synchro-check", "PCC", ""]],
      req_inf: "IEC 61850-7-420.", req_com: "GOOSE (< 10 ms).", req_sec: "IEC 62351-6.", req_perf: "Transition < 100 ms; IEEE 2030.8 tests (HIL).",
      nrjx: "Dynamic simulation with \"Islanding\" and \"Synchronised reconnection\" events (exemples/microreseau_ilotage.xml)."},
    v2g: {title: "Smart charging and V2G discharge of a vehicle fleet", id: "UC-EV-V2G", domain: "Customer premises, DER", zones: "Process / Field / Operation",
      scope: "A company's charging stations", obj_bus: "Reduce charging costs and offer flexibility.", obj_tech: "Guarantee the state of charge at departure; shift charging; discharge at peak hours.",
      kpi: "Average charging cost (F/kWh), V2G energy, state of charge at departure.", pre: "OCPP 2.0.1 charging stations; ISO 15118-20 vehicles.", assump: "Arrival and departure times known.",
      actors: [["Electric vehicle", "Equipment", "Battery"], ["Charging station (EVSE)", "Equipment", "Charge / discharge"], ["CPO / EMS", "System", "Charging profiles"], ["Network operator", "Organisation", "Constraint signals (OpenADR)"]],
      steps: [["Plug-in", "Identification, energy need and departure time", "EV", "Charger", "ISO 15118-20"], ["Scheduling", "Profile computation", "CPO", "Charger", "OCPP SetChargingProfile"], ["Peak", "Discharge to the grid", "CPO", "Charger", "ISO 15118-20 BPT"]],
      req_inf: "ISO 15118 and OCPP messages.", req_com: "HomePlug Green PHY PLC, WebSocket TLS.", req_sec: "Plug & Charge PKI.", req_perf: "State of charge at departure met 100 % of the time.",
      nrjx: "EV charger in V1G / V2G mode: economic dispatch and VPP; time series with unmanaged charging."}
  };
  function usecase(div){
    var uc = store.get("usecase", null) || JSON.parse(JSON.stringify(Object.assign({actors: [], steps: []}, UC_TEMPLATES.flisr)));
    div.appendChild(el("h4", "", "Use case sheet (IEC 62559-2 template)"));
    var bar = el("div", "sg-bar");
    var sel = el("select");
    [["", "Load a template…"], ["flisr", "FLISR (guide, § 5.3)"], ["ivvc", "IVVC/r"], ["vpp", "Virtual power plant"], ["island", "Microgrid islanding"], ["v2g", "V2G charging"], ["blank", "Blank sheet"]]
      .forEach(function(o){ var op = el("option", "", o[1]); op.value = o[0]; sel.appendChild(op); });
    sel.addEventListener("change", function(){
      if(!sel.value) return;
      uc = sel.value === "blank" ? {actors: [], steps: []} : JSON.parse(JSON.stringify(Object.assign({actors: [], steps: []}, UC_TEMPLATES[sel.value])));
      sel.value = "";
      store.set("usecase", uc);
      build();
    });
    bar.appendChild(sel);
    bar.appendChild(button("Export (Markdown)", function(){ download((uc.id || "use-case") + ".md", markdown(), "text/markdown;charset=utf-8"); }));
    bar.appendChild(button("Copy", function(b){ copy(markdown(), b); }));
    bar.appendChild(button("Print", function(){ window.print(); }));
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
      parent.appendChild(button("+ row", function(){ (uc[key] = uc[key] || []).push(cols.map(function(){ return ""; })); save(); build(); }));
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
          a.appendChild(el("legend", "", "4. Actors and main scenario"));
          table(a, "actors", "Actors", ["Actor", "Type", "Role"]);
          table(a, "steps", "Scenario steps", ["Step", "Description", "Initiator", "Receiver", "Information exchanged / protocol"]);
          body.appendChild(a);
        }
      });
    }
    function markdown(){
      var s = "# " + (uc.id || "") + " — " + (uc.title || "Use case") + "\n\n_IEC 62559-2 template, prepared with NRJXpert_\n";
      UC_FIELDS.forEach(function(sec, si){
        s += "\n## " + sec[0] + "\n\n";
        sec[1].forEach(function(f){ s += "- **" + f[1] + "**: " + (uc[f[0]] || "") + "\n"; });
        if(si === 2){
          s += "\n## 4. Actors and main scenario\n\n| Actor | Type | Role |\n|---|---|---|\n";
          (uc.actors || []).forEach(function(r){ s += "| " + r.join(" | ") + " |\n"; });
          s += "\n| Step | Description | Initiator | Receiver | Information / protocol |\n|---|---|---|---|---|\n";
          (uc.steps || []).forEach(function(r){ s += "| " + r.join(" | ") + " |\n"; });
        }
      });
      return s;
    }
    build();
  }

  /* ================================================================== skills matrix (guide, § 5.2) */
  var SKILLS = [
    ["Electrical engineering and network operation", ["Load flow and voltage plans", "Short circuit and protection plan", "Stability, machines and converters", "Network automation (FLISR, IVVC)"],
      "Levels 2 and 5; FLISR, IVVC and dynamic calculations (Level 6, § 6.3 to 6.6)", "niveau2-en.html"],
    ["OT/IT information systems architecture", ["SCADA, ADMS, EMS, DERMS", "GIS, MDM, ERP", "Enterprise integration (ESB, Kafka, MQTT)", "Virtual power plants and aggregation"],
      "§ 6.2 and 6.5; VPP calculation", "#n6-2"],
    ["Standardisation and interoperability", ["SGAM model (IEC SRD 63200)", "CIM (IEC 61970 / 61968)", "IEC 61850 and DLMS/COSEM", "IEEE 1547, ISO 15118, OCPP"],
      "§ 6.1 and 6.8; SGAM tool; CIM export and points list", "#n6-1"],
    ["Telecommunications and industrial cybersecurity", ["Cellular networks, fibre, G3-PLC", "IP protocols, IEC 60870-5-104", "Defence in depth (IEC 62443)", "Encryption, PKI (IEC 62351)"],
      "§ 6.8 and 6.9; security requirements of the use case sheets", "#n6-8"],
    ["Governance, economics and regulation", ["Markets and monetisation of flexibility", "Capex, Opex, TCO", "Regulatory framework for network operators", "Public procurement, owner's engineering (specifications, FAT/SAT)"],
      "Level 4; § 6.9; TCO calculator and evaluation grid", "#n6-9"]];
  var LEVELS = ["0 — unknown", "1 — notions", "2 — guided practice", "3 — autonomous", "4 — expert (can train others)"];
  function skills(div){
    var v = store.get("skills", {});
    div.appendChild(el("h4", "", "Self-assessment: Smart Grid expert skills matrix"));
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
      radar.innerHTML = '<svg viewBox="-60 0 420 290" role="img" aria-label="Skills profile">' + rings + axes +
        '<polygon points="' + pts.join(" ") + '" fill="color-mix(in srgb, var(--accent) 25%, transparent)" stroke="var(--accent)" stroke-width="2"/></svg>';
      var weak = [];
      SKILLS.forEach(function(s, i){ if(avg(i) < 2.5) weak.push("<li><b>" + (i + 1) + ". " + s[0] + "</b> (" + fr(avg(i), 1) + "/4): " + s[2] + " — <a href='" + s[3] + "'>start</a></li>"); });
      var tot = 0; SKILLS.forEach(function(s, i){ tot += avg(i); });
      out.innerHTML = "Overall average: <b>" + fr(tot / n, 2) + " / 4</b>. " + (weak.length ? "Areas to strengthen:<ul>" + weak.join("") + "</ul>" :
        "Expert profile: every area is at least at the \"autonomous\" level.");
    }
    draw();
  }

  /* ================================================================== calculators */
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
      try{ out.innerHTML = compute(v); }catch(e){ out.textContent = "Incomplete input."; }
    }
    run();
  }
  var TOOLS = {
    sgam: sgam, protocols: protocols, usecase: usecase, skills: skills,
    reliab: function(div){
      form(div, "Feeder reliability: SAIDI, SAIFI, ENS with and without automation", [
        ["n", "Number of customers", "2000", ""], ["p", "Average power demand", "2.5", "MW"], ["l", "Feeder length", "20", "km"],
        ["lam", "Failure rate", "0.1", "/km/yr"], ["k", "Number of sections (switching devices)", "4", ""],
        ["r", "Repair time", "4", "h"], ["tm", "Fault search + manual switching", "1.5", "h"], ["ta", "FLISR sequence", "1.5", "min"],
        ["mom", "Short interruption threshold", "3", "min"], ["tie", "Back-feed possible from a neighbouring feeder", [["1", "yes"], ["0", "no"]]]],
      function(v){
        // feeder with k equal sections, customers spread evenly; a fault in section i trips the whole feeder (head breaker)
        var L = v.lam * v.l, k = Math.max(1, Math.round(v.k)), c = v.n / k, pk = v.p / k;
        function strat(ts){
          var cmi = 0, ci = 0, ens = 0, mom = 0;
          for(var i = 0; i < k; i++){
            for(var j = 0; j < k; j++){
              var d;
              if(j === i) d = v.r;
              else if(j < i || v.tie === "1") d = ts;     // upstream: reclosing; downstream: back-feed from the neighbouring feeder
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
        return "Failures: λ·L = <b>" + fr(L, 2) + " /yr</b><br>" +
          "Without automation: SAIDI = <b>" + fr(m.saidi, 1) + " min/yr</b>, SAIFI = <b>" + fr(m.saifi, 2) + " /yr</b>, ENS = " + fr(m.ens, 0) + " kWh/yr<br>" +
          "With FLISR: SAIDI = <b>" + fr(a.saidi, 1) + " min/yr</b>, SAIFI = <b>" + fr(a.saifi, 2) + " /yr</b>, MAIFI = " + fr(a.maifi, 2) + " /yr, ENS = " + fr(a.ens, 0) + " kWh/yr" +
          "<br><span class='small'>Simplified model: equal sections, customers spread evenly, full back-feed possible. For a real network: NRJXpert's \"Self-healing\" calculation.</span>";
      });
    },
    cvr: function(div){
      form(div, "Conservation voltage reduction (CVR) — ZIP loads", [
        ["z", "Constant impedance share (Z)", "40", "%"], ["i", "Constant current share (I)", "30", "%"], ["p", "Constant power share (P)", "30", "%"],
        ["dv", "Voltage reduction", "3", "%"], ["e", "Annual feeder energy", "20000", "MWh"]],
      function(v){
        var s = v.z + v.i + v.p, z = v.z / s, i = v.i / s, p = v.p / s, x = 1 - v.dv / 100;
        var ratio = z * x * x + i * x + p, cvrf = (1 - ratio) / (v.dv / 100);
        return "P(V)/P0 = Z·v² + I·v + P = " + fr(ratio, 4) + " for v = " + fr(x, 3) + " pu<br>CVR factor = (ΔP/P)/(ΔV/V) = <b>" + fr(cvrf, 2) +
          "</b> (≈ 2Z + I = " + fr(2 * z + i, 2) + ")<br>Saving: <b>" + fr((1 - ratio) * 100, 2) + " %</b>, i.e. <b>" + fr((1 - ratio) * v.e, 0) + " MWh/yr</b>";
      });
    },
    sync: function(div){
      form(div, "Microgrid synchro-check (IEEE 1547-2018, table 39)", [
        ["s", "Rating of the island sources", "1200", "kVA"], ["df", "Frequency difference", "0.15", "Hz"], ["dv", "Voltage difference", "2", "%"], ["dp", "Phase difference", "12", "°"]],
      function(v){
        var lim = v.s <= 500 ? [0.3, 10, 20] : v.s <= 1500 ? [0.2, 5, 15] : [0.1, 3, 10];
        var ok = [Math.abs(v.df) <= lim[0], Math.abs(v.dv) <= lim[1], Math.abs(v.dp) <= lim[2]];
        var t = function(b){ return b ? "<span class='check'>✓</span>" : "<span style='color:var(--bad)'>✗</span>"; };
        return "Limits for " + fr(v.s, 0) + " kVA: Δf ≤ " + fr(lim[0], 1) + " Hz, ΔV ≤ " + lim[1] + " %, Δφ ≤ " + lim[2] + "°<br>" +
          "Δf " + t(ok[0]) + "  ΔV " + t(ok[1]) + "  Δφ " + t(ok[2]) + " → <b>" + (ok[0] && ok[1] && ok[2] ? "closing allowed" : "closing blocked: the synchroniser must correct the island") + "</b>";
      });
    },
    tco: function(div){
      form(div, "Bid evaluation (owner's engineering phase 4): total cost of ownership and weighted score", [
        ["ca", "Bid A — investment (equipment, integration, training)", "450", "MF"], ["oa", "Bid A — recurring costs (maintenance, licences, telecoms)", "35", "MF/yr"], ["ta", "Bid A — technical score", "82", "/100"],
        ["cb", "Bid B — investment", "380", "MF"], ["ob", "Bid B — recurring costs", "48", "MF/yr"], ["tb", "Bid B — technical score", "74", "/100"],
        ["n", "Analysis period", "10", "years"], ["a", "Discount rate", "8", "%"], ["w", "Weight of the technical score", "60", "%"]],
      function(v){
        var a = v.a / 100, fa = a > 0 ? (1 - Math.pow(1 + a, -v.n)) / a : v.n;
        var A = v.ca + v.oa * fa, B = v.cb + v.ob * fa, mn = Math.min(A, B);
        var pa = 100 * mn / A, pb = 100 * mn / B, w = v.w / 100;
        var na = w * v.ta + (1 - w) * pa, nb = w * v.tb + (1 - w) * pb;
        return "Discounted TCO over " + v.n + " years: A = <b>" + fr(A, 0) + " MF</b>, B = <b>" + fr(B, 0) + " MF</b><br>" +
          "Price score (100 × min TCO / TCO): A = " + fr(pa, 1) + ", B = " + fr(pb, 1) + "<br>" +
          "Overall score: A = <b>" + fr(na, 1) + "</b>, B = <b>" + fr(nb, 1) + "</b> → bid <b>" + (na >= nb ? "A" : "B") + "</b> ranks first";
      });
    }
  };
  document.addEventListener("DOMContentLoaded", function(){
    document.querySelectorAll(".sg[data-tool]").forEach(function(d){ var f = TOOLS[d.getAttribute("data-tool")]; if(f) f(d); });
  });
})();
