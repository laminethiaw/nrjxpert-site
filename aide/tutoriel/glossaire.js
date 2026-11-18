/* NRJXpert — glossaire des ressources décentralisées (DER), des réseaux intelligents et de l'évaluation économique.
 * Chaque occurrence d'un terme du glossaire dans le texte du guide ou du tutoriel est soulignée en pointillé ;
 * au survol (ou au toucher, ou avec la touche Tab) une info-bulle donne sa définition, la formule, les valeurs
 * usuelles et les normes. Aucune dépendance, fonctionne hors ligne (pages file://). Page en anglais : lang="en".
 * Source principale : document « DER-definitions » (L. Thiaw), complété pour les termes qu'il ne couvre pas.
 * Champs : k = formes du terme dans les pages françaises, ke = formes dans les pages anglaises,
 *          cs = respect de la casse (sigles), fr / en = {t: titre, d: définition, f: formule, v: valeurs usuelles,
 *          r: rôle et enjeux, s: normes / voir aussi}. */
(function(){
  "use strict";
  var EN = (document.documentElement.lang || "fr").toLowerCase().indexOf("en") === 0;
  var G = [
  // ------------------------------------------------------------------ ressources décentralisées
  {k:["DER","DERs"], ke:["DER","DERs"], cs:true,
   fr:{t:"DER — ressources énergétiques décentralisées", d:"Moyens de production, de stockage ou de consommation pilotable raccordés au réseau de distribution ou chez les clients : photovoltaïque, éolien, batteries (BESS), groupes électrogènes, bornes de recharge, charges effaçables.", r:"Ils rendent le flux de puissance bidirectionnel, modifient les tensions, les courants de court-circuit et l'inertie du réseau ; leur intégration est encadrée par les codes de réseau.", s:"IEEE 1547-2018, EN 50549, IEC 61850-7-420."},
   en:{t:"DER — distributed energy resources", d:"Generation, storage or controllable demand connected to the distribution network or at customer premises: photovoltaics, wind, batteries (BESS), gensets, EV chargers, curtailable loads.", r:"They make power flows bidirectional and change voltages, short-circuit currents and system inertia; grid codes govern their integration.", s:"IEEE 1547-2018, EN 50549, IEC 61850-7-420."}},
  {k:["ressources décentralisées","ressource décentralisée","ressources énergétiques décentralisées"], ke:["distributed energy resources","distributed energy resource"],
   fr:{t:"Ressources décentralisées (DER)", d:"Ensemble des unités de production, de stockage et de flexibilité raccordées au plus près des consommateurs, en basse ou moyenne tension, par opposition aux grandes centrales raccordées au transport.", s:"Voir DER."},
   en:{t:"Distributed energy resources (DER)", d:"Generation, storage and flexibility units connected close to consumers at low or medium voltage, as opposed to bulk power plants connected to the transmission grid.", s:"See DER."}},
  {k:["BESS"], ke:["BESS"], cs:true,
   fr:{t:"BESS — système de stockage par batteries", d:"Batteries (lithium-fer-phosphate, NMC, plomb…) associées à un convertisseur bidirectionnel (PCS) et à un système de gestion (BMS).", r:"Lissage de la production renouvelable, écrêtement de la pointe, réserve, réglage de fréquence, formation du réseau en îlotage.", v:"Rendement aller-retour 85 à 95 % (lithium), 70 à 80 % (plomb)."},
   en:{t:"BESS — battery energy storage system", d:"Batteries (LFP, NMC, lead-acid…) with a bidirectional power conversion system (PCS) and a battery management system (BMS).", r:"Smoothing of renewables, peak shaving, reserve, frequency control, grid forming in island mode.", v:"Round-trip efficiency 85–95 % (lithium), 70–80 % (lead-acid)."}},
  {k:["SOC","SoC","état de charge"], ke:["SOC","SoC","state of charge"], cs:true,
   fr:{t:"SOC — état de charge", d:"Énergie contenue dans une batterie rapportée à sa capacité, en %.", f:"SOC(t+Δt) = SOC(t) + (η_c·P_c − P_d/η_d)·Δt / E_nom", r:"Le SOC est borné entre SOC_min (= 1 − profondeur de décharge) et 100 % pour préserver la durée de vie."},
   en:{t:"SOC — state of charge", d:"Energy stored in a battery relative to its capacity, in %.", f:"SOC(t+Δt) = SOC(t) + (η_c·P_c − P_d/η_d)·Δt / E_rated", r:"SOC is kept between SOC_min (= 1 − depth of discharge) and 100 % to preserve battery life."}},
  {k:["profondeur de décharge","DoD"], ke:["depth of discharge","DoD"],
   fr:{t:"Profondeur de décharge (DoD)", d:"Fraction de la capacité nominale qu'on s'autorise à prélever d'une batterie.", v:"Plomb 50 à 70 %, lithium-fer-phosphate 80 à 90 %.", r:"Plus la décharge est profonde, plus la capacité utile est grande, mais plus le nombre de cycles de vie diminue.", f:"Capacité nécessaire = besoins × autonomie / (DoD × rendement)"},
   en:{t:"Depth of discharge (DoD)", d:"Fraction of rated capacity that may be drawn from a battery.", v:"Lead-acid 50–70 %, LFP 80–90 %.", r:"Deeper discharge gives more usable energy but fewer life cycles.", f:"Required capacity = demand × autonomy / (DoD × efficiency)"}},
  {k:["charges prioritaires","charge prioritaire"], ke:["priority loads","priority load"],
   fr:{t:"Charges prioritaires", d:"Récepteurs qui doivent rester alimentés en toute circonstance (froid médical, éclairage de sécurité, télécommunications…). Les autres charges peuvent être délestées.", r:"Dans NRJXpert, on peut dimensionner la batterie d'un système PV ou éolien pour les seules charges prioritaires : batterie plus petite, délestage des autres charges pendant les jours sans soleil ou sans vent."},
   en:{t:"Priority loads", d:"Loads that must remain supplied at all times (medical refrigeration, emergency lighting, telecoms…). Other loads may be shed.", r:"In NRJXpert the battery of a PV or wind system can be sized for priority loads only: smaller battery, other loads shed during sunless or windless days."}},
  {k:["délestage"], ke:["load shedding"],
   fr:{t:"Délestage", d:"Coupure volontaire de charges non prioritaires pour rétablir l'équilibre production–consommation, protéger la batterie ou éviter l'effondrement de la fréquence.", r:"Délestage fréquencemétrique : par seuils de fréquence et de RoCoF ; délestage dans un système autonome : sur seuil d'état de charge de la batterie."},
   en:{t:"Load shedding", d:"Deliberate disconnection of non-priority loads to restore the generation–demand balance, protect the battery or avoid frequency collapse.", r:"Under-frequency load shedding uses frequency and RoCoF thresholds; in stand-alone systems shedding is triggered by the battery state of charge."}},
  {k:["onduleur","onduleurs"], ke:["inverter","inverters"],
   fr:{t:"Onduleur", d:"Convertisseur continu → alternatif. Onduleur réseau (grid-following) : se synchronise sur la tension du réseau et injecte un courant ; onduleur autonome ou formant le réseau (grid-forming) : impose la tension et la fréquence.", r:"Il porte les fonctions exigées par les codes de réseau : Q(U), P(f), tenue aux creux (FRT), anti-îlotage.", s:"IEC 62109, IEEE 1547, SunSpec."},
   en:{t:"Inverter", d:"DC → AC converter. Grid-following inverters synchronise to the grid voltage and inject current; stand-alone or grid-forming inverters impose voltage and frequency.", r:"It provides grid-code functions: Q(V), P(f), fault ride-through, anti-islanding.", s:"IEC 62109, IEEE 1547, SunSpec."}},
  {k:["grid-forming","formant le réseau"], ke:["grid-forming","grid forming"],
   fr:{t:"Onduleur formant le réseau (grid-forming)", d:"Onduleur commandé en source de tension : il fixe l'amplitude et la fréquence de la tension, partage la charge par statisme et apporte une inertie synthétique.", r:"Indispensable pour faire fonctionner un micro-réseau îloté sans machine tournante.", s:"IEEE 2030.7, IEEE 2800."},
   en:{t:"Grid-forming inverter", d:"Inverter controlled as a voltage source: it sets voltage magnitude and frequency, shares load through droop and provides synthetic inertia.", r:"Required to run an islanded microgrid without rotating machines.", s:"IEEE 2030.7, IEEE 2800."}},
  {k:["grid-following"], ke:["grid-following","grid following"],
   fr:{t:"Onduleur suiveur de réseau (grid-following)", d:"Onduleur commandé en source de courant, synchronisé par une boucle à verrouillage de phase (PLL) sur la tension du réseau ; il ne peut pas fonctionner seul.", r:"Cas de la plupart des onduleurs photovoltaïques."},
   en:{t:"Grid-following inverter", d:"Inverter controlled as a current source, synchronised to the grid voltage by a phase-locked loop (PLL); it cannot operate alone.", r:"Most PV inverters work this way."}},
  {k:["MPPT"], ke:["MPPT"], cs:true,
   fr:{t:"MPPT — recherche du point de puissance maximale", d:"Commande d'un convertisseur qui ajuste en permanence la tension du champ photovoltaïque pour qu'il fournisse sa puissance maximale (méthodes perturbation-observation, incrément de conductance).", v:"Rendement de suivi > 99 %."},
   en:{t:"MPPT — maximum power point tracking", d:"Converter control that continuously adjusts the PV array voltage so that it delivers its maximum power (perturb-and-observe, incremental conductance).", v:"Tracking efficiency > 99 %."}},
  {k:["statisme","droop"], ke:["droop"],
   fr:{t:"Statisme (droop)", d:"Loi de réglage qui fait varier la puissance d'un générateur proportionnellement à l'écart de fréquence (P(f)) ou la puissance réactive avec l'écart de tension (Q(U)).", f:"ΔP / P_n = −(1/s) · Δf / f_n", v:"s = 4 à 5 % pour les groupes ; 2 à 12 % réglable pour les onduleurs.", r:"Permet à plusieurs sources de se partager la charge sans communication."},
   en:{t:"Droop", d:"Control law that changes a generator's active power in proportion to the frequency deviation (P(f)) or its reactive power with the voltage deviation (Q(V)).", f:"ΔP / P_n = −(1/s) · Δf / f_n", v:"s = 4–5 % for gensets; 2–12 % adjustable for inverters.", r:"Lets several sources share load without communication."}},
  {k:["inertie"], ke:["inertia"],
   fr:{t:"Inertie du réseau", d:"Énergie cinétique des masses tournantes synchronisées (alternateurs, turbines), exprimée par la constante d'inertie H (s) : énergie stockée / puissance apparente.", f:"H = ½·J·ω² / S_n", v:"H = 2 à 9 s pour les machines synchrones ; ≈ 0 pour un onduleur sans inertie synthétique.", r:"Elle freine la variation de fréquence après un incident ; les DER à onduleurs la réduisent, d'où des RoCoF plus élevés."},
   en:{t:"System inertia", d:"Kinetic energy of synchronised rotating masses, expressed by the inertia constant H (s): stored energy / apparent power.", f:"H = ½·J·ω² / S_n", v:"H = 2–9 s for synchronous machines; ≈ 0 for inverters without synthetic inertia.", r:"It slows the frequency change after a disturbance; inverter-based DER reduce it, hence higher RoCoF."}},
  {k:["RoCoF"], ke:["RoCoF","ROCOF"], cs:true,
   fr:{t:"RoCoF — taux de variation de la fréquence", d:"Vitesse à laquelle la fréquence varie juste après un déséquilibre production–consommation (perte d'un groupe, déclenchement d'une charge). Unité : Hz/s.", f:"RoCoF = df/dt ≈ ΔP · f₀ / (2·H·S_système)", v:"Seuils de protection usuels : 0,5 à 2 Hz/s selon les codes de réseau.", r:"Indicateur d'inertie ; utilisé par la protection anti-îlotage et le délestage. Des seuils trop sensibles peuvent provoquer des déclenchements en cascade d'onduleurs."},
   en:{t:"RoCoF — rate of change of frequency", d:"Speed at which frequency changes right after a generation–load imbalance (loss of a unit, load trip). Unit: Hz/s.", f:"RoCoF = df/dt ≈ ΔP · f₀ / (2·H·S_system)", v:"Usual protection thresholds: 0.5–2 Hz/s depending on grid codes.", r:"Inertia indicator; used for anti-islanding protection and load shedding. Over-sensitive settings can cause cascading inverter trips."}},
  {k:["code de réseau","codes de réseau","code réseau","codes réseau","Grid Code"], ke:["grid code","grid codes"],
   fr:{t:"Code de réseau (Grid Code)", d:"Ensemble des règles techniques qu'une installation doit respecter pour se raccorder au réseau public : plages de tension et de fréquence, tenue au RoCoF, soutien du réseau (P(f), Q(U)), tenue aux creux (FRT), protections de découplage.", v:"Ex. : fonctionnement entre 47,5 et 51,5 Hz ; tenue à 2 Hz/s.", s:"EN 50549, règlement européen RfG, VDE-AR-N 4105, IEEE 1547 ; code de réseau de la Senelec au Sénégal."},
   en:{t:"Grid code", d:"Technical rules an installation must meet to connect to the public grid: voltage and frequency ranges, RoCoF withstand, grid support (P(f), Q(V)), fault ride-through, interface protection.", v:"E.g. operation between 47.5 and 51.5 Hz; withstand 2 Hz/s.", s:"EN 50549, EU RfG, VDE-AR-N 4105, IEEE 1547; Senelec grid code in Senegal."}},
  {k:["FRT","LVRT","HVRT","tenue aux creux de tension","tenue aux défauts","Fault Ride-Through"], ke:["FRT","LVRT","HVRT","fault ride-through","low-voltage ride-through"],
   fr:{t:"FRT — tenue aux défauts (creux de tension)", d:"Capacité d'un générateur à rester connecté pendant un défaut bref (150 ms à 1 s) au lieu de déclencher, en suivant un gabarit tension–temps imposé par le code de réseau ; LVRT pour les creux, HVRT pour les surtensions.", r:"Évite la perte simultanée de milliers d'onduleurs lors d'un court-circuit (effet domino) ; pendant le défaut, l'onduleur injecte souvent du courant réactif pour soutenir la tension."},
   en:{t:"FRT — fault ride-through", d:"Ability of a generator to stay connected during a short fault (150 ms to 1 s) instead of tripping, following a voltage–time profile set by the grid code; LVRT for dips, HVRT for overvoltages.", r:"Prevents the simultaneous loss of thousands of inverters during a short circuit (domino effect); during the fault the inverter often injects reactive current to support voltage."}},
  {k:["Q(U)","Q(V)","Volt/VAR","volt-var","Volt-VAR"], ke:["Q(V)","Q(U)","Volt/VAR","volt-var","Volt-VAR"],
   fr:{t:"Q(U) — réglage Volt/VAR", d:"Loi de commande d'un onduleur qui absorbe de la puissance réactive quand la tension locale monte et en fournit quand elle baisse, selon une courbe à zone morte.", r:"Augmente la capacité d'accueil d'un départ BT/HTA en limitant les surtensions dues à l'injection photovoltaïque.", s:"IEEE 1547 (catégorie B), EN 50549, SunSpec modèle 126."},
   en:{t:"Q(V) — Volt/VAR control", d:"Inverter control law that absorbs reactive power when local voltage rises and supplies it when it falls, following a curve with a dead band.", r:"Increases feeder hosting capacity by limiting PV-induced overvoltage.", s:"IEEE 1547 (category B), EN 50549, SunSpec model 126."}},
  {k:["P(f)","Frequency/Watt","fréquence-puissance"], ke:["P(f)","frequency-watt","Frequency/Watt"],
   fr:{t:"P(f) — réglage fréquence–puissance", d:"Réduction automatique de la puissance active d'un générateur quand la fréquence dépasse un seuil (surproduction), et éventuellement augmentation quand elle baisse s'il dispose d'une réserve.", v:"Ex. : réduction de 40 % de P par Hz au-dessus de 50,2 Hz.", s:"EN 50549, IEEE 1547, SunSpec modèle 134."},
   en:{t:"P(f) — frequency-watt control", d:"Automatic reduction of a generator's active power when frequency exceeds a threshold (over-generation), possibly an increase when it drops if headroom is available.", v:"E.g. 40 % of P per Hz above 50.2 Hz.", s:"EN 50549, IEEE 1547, SunSpec model 134."}},
  {k:["Volt-Watt","Volt/Watt","P(U)"], ke:["Volt-Watt","volt-watt","P(V)"],
   fr:{t:"Volt-Watt — P(U)", d:"Limitation de la puissance active d'un onduleur quand la tension dépasse un seuil, en complément de Q(U).", s:"IEEE 1547, SunSpec modèle 132."},
   en:{t:"Volt-Watt — P(V)", d:"Limitation of inverter active power when voltage exceeds a threshold, complementing Q(V).", s:"IEEE 1547, SunSpec model 132."}},
  {k:["I_skPF","IskPF","source de courant limité"], ke:["I_skPF","IskPF","current-limited source"],
   fr:{t:"I_skPF — source à courant limité", d:"Modèle de court-circuit d'un générateur raccordé par électronique de puissance (PV, batterie, éolienne de type 4) : il injecte un courant maximal fixe, souvent réactif, au lieu d'agir comme une source de tension derrière une impédance.", v:"1,0 à 1,2 × I_n (jusqu'à 1,5 × I_n quelques millisecondes), contre 5 à 10 × I_n pour un alternateur.", r:"Les DER font baisser le niveau de court-circuit : des protections à maximum de courant peuvent devenir « aveugles », surtout en îlotage.", s:"IEC 60909-0:2016."},
   en:{t:"I_skPF — current-limited source", d:"Short-circuit model of a power-electronics-connected generator (PV, battery, type-4 wind): it injects a fixed maximum current, often reactive, instead of behaving as a voltage source behind an impedance.", v:"1.0–1.2 × I_n (up to 1.5 × I_n for a few ms), versus 5–10 × I_n for a synchronous generator.", r:"DER lower the short-circuit level: overcurrent relays may become 'blind', especially in island mode.", s:"IEC 60909-0:2016."}},
  {k:["anti-îlotage"], ke:["anti-islanding"],
   fr:{t:"Protection anti-îlotage", d:"Fonction qui déconnecte un générateur lorsque le réseau principal est perdu (surveillance de la tension, de la fréquence, du RoCoF, du saut de vecteur), pour protéger les intervenants et éviter un réseau non maîtrisé.", v:"Déclenchement en moins de 2 s (IEEE 1547).", s:"IEC 62116, IEEE 1547, EN 50549."},
   en:{t:"Anti-islanding protection", d:"Function that disconnects a generator when the main grid is lost (voltage, frequency, RoCoF, vector-shift monitoring) to protect line workers and avoid an uncontrolled island.", v:"Trip within 2 s (IEEE 1547).", s:"IEC 62116, IEEE 1547, EN 50549."}},
  {k:["îlotage","îloté","îlotée"], ke:["islanding","islanded","island mode"],
   fr:{t:"Îlotage", d:"Fonctionnement d'une partie du réseau séparée du réseau principal, alimentée par ses propres sources. Îlotage intentionnel : micro-réseau qui s'isole volontairement (ouverture du PCC) pour continuer à alimenter ses charges ; îlotage involontaire : à éviter (anti-îlotage).", s:"IEEE 2030.7, IEEE 2030.8, IEEE 1547.4."},
   en:{t:"Islanding", d:"Operation of part of the network separated from the main grid and fed by its own sources. Intentional islanding: a microgrid deliberately disconnects (opening the PCC) to keep supplying its loads; unintentional islanding must be avoided (anti-islanding).", s:"IEEE 2030.7, IEEE 2030.8, IEEE 1547.4."}},
  {k:["micro-réseau","micro-réseaux","microréseau"], ke:["microgrid","microgrids","micro-grid"],
   fr:{t:"Micro-réseau", d:"Ensemble de charges et de ressources décentralisées, aux limites électriques définies, piloté comme une entité unique, capable de fonctionner raccordé au réseau ou îloté.", r:"Améliore la résilience (sites isolés, hôpitaux, campus) ; nécessite une source formant le réseau et un contrôleur.", s:"IEEE 2030.7 (contrôleur), IEEE 2030.8 (essais)."},
   en:{t:"Microgrid", d:"Group of loads and DER within clearly defined electrical boundaries, controlled as a single entity, able to operate grid-connected or islanded.", r:"Improves resilience (remote sites, hospitals, campuses); needs a grid-forming source and a controller.", s:"IEEE 2030.7 (controller), IEEE 2030.8 (testing)."}},
  {k:["PCC","point de couplage commun","point de raccordement"], ke:["PCC","point of common coupling"], cs:true,
   fr:{t:"PCC — point de couplage commun", d:"Point où une installation (micro-réseau, centrale, client) est raccordée au réseau public ; c'est là que s'appliquent les exigences du code de réseau et qu'on place le disjoncteur de couplage.", r:"Dans un micro-réseau, l'ouverture du PCC provoque l'îlotage."},
   en:{t:"PCC — point of common coupling", d:"Point where an installation (microgrid, plant, customer) connects to the public grid; grid-code requirements apply there and the coupling breaker is located there.", r:"In a microgrid, opening the PCC breaker creates the island."}},
  {k:["capacité d'accueil"], ke:["hosting capacity"],
   fr:{t:"Capacité d'accueil", d:"Puissance maximale de production décentralisée raccordable en un point sans violer les contraintes du réseau : tension (ex. U ≤ 1,05 pu), courant admissible des lignes et transformateurs, protection, qualité.", r:"Augmentée par Q(U), Volt-Watt, régleur en charge, stockage, renforcement.", s:"Étude « Capacité d'accueil » de NRJXpert ; EPRI DRIVE."},
   en:{t:"Hosting capacity", d:"Maximum DER power that can be connected at a point without violating network limits: voltage (e.g. V ≤ 1.05 pu), line and transformer ampacity, protection, power quality.", r:"Increased by Q(V), Volt-Watt, on-load tap changers, storage, reinforcement.", s:"NRJXpert 'Hosting capacity' study; EPRI DRIVE."}},
  {k:["prosommateur","prosommateurs"], ke:["prosumer","prosumers"],
   fr:{t:"Prosommateur", d:"Client qui consomme et produit de l'électricité (souvent du photovoltaïque en toiture), en autoconsommation avec injection du surplus.", s:"Voir net metering, AMI."},
   en:{t:"Prosumer", d:"Customer who both consumes and produces electricity (often rooftop PV), self-consuming and exporting the surplus.", s:"See net metering, AMI."}},
  {k:["Net Metering","net metering","comptage net"], ke:["net metering","Net Metering"],
   fr:{t:"Net metering — comptage net", d:"Facturation sur la différence entre énergie soutirée et énergie injectée sur une période : le surplus solaire « fait tourner le compteur à l'envers ».", r:"Nécessite un compteur bidirectionnel (AMI)."},
   en:{t:"Net metering", d:"Billing on the difference between imported and exported energy over a period: surplus PV 'runs the meter backwards'.", r:"Requires a bidirectional meter (AMI)."}},
  {k:["autoconsommation"], ke:["self-consumption"],
   fr:{t:"Autoconsommation", d:"Consommation sur place de l'électricité produite par l'installation. Taux d'autoconsommation = énergie autoconsommée / énergie produite ; taux d'autoproduction = énergie autoconsommée / énergie consommée.", r:"Le stockage et le pilotage des charges augmentent l'autoconsommation."},
   en:{t:"Self-consumption", d:"On-site use of the energy produced. Self-consumption rate = self-consumed / produced energy; self-sufficiency = self-consumed / consumed energy.", r:"Storage and load control increase self-consumption."}},
  // ------------------------------------------------------------------ réseau, calcul
  {k:["load flow","répartition de charge","répartition des charges","écoulement de puissance"], ke:["load flow","power flow"],
   fr:{t:"Load flow — calcul de répartition des charges", d:"Calcul du régime permanent d'un réseau : tensions (module et angle) de tous les nœuds et transits de puissance, à partir des consommations, des productions et des impédances. Équations non linéaires résolues par itérations.", f:"S_i = P_i + jQ_i = V_i · Σ_k (Y_ik · V_k)*", s:"Méthodes : Newton-Raphson, Gauss-Seidel, découplée rapide, balayage avant-arrière (réseaux radiaux)."},
   en:{t:"Load flow (power flow)", d:"Steady-state calculation of a network: voltage magnitude and angle at all buses and power flows, from loads, generation and impedances. Non-linear equations solved iteratively.", f:"S_i = P_i + jQ_i = V_i · Σ_k (Y_ik · V_k)*", s:"Methods: Newton-Raphson, Gauss-Seidel, fast decoupled, backward/forward sweep (radial networks)."}},
  {k:["bus balancier","nœud balancier","slack bus","jeu de barres de référence"], ke:["slack bus","swing bus","reference bus"],
   fr:{t:"Bus balancier (slack)", d:"Nœud de référence d'un load flow : tension et angle imposés ; sa puissance équilibre la production, la consommation et les pertes. En général le poste source (réseau amont).", r:"Un seul par réseau connexe dans NRJXpert."},
   en:{t:"Slack (swing) bus", d:"Reference bus of a load flow: voltage magnitude and angle are fixed; its power balances generation, demand and losses. Usually the upstream grid supply point.", r:"One per connected network in NRJXpert."}},
  {k:["bus PV","nœud PV"], ke:["PV bus"],
   fr:{t:"Bus PV (générateur)", d:"Nœud où la puissance active P et le module de la tension |V| sont imposés (générateur régulant sa tension) ; Q et l'angle sont calculés.", r:"Rien à voir avec le photovoltaïque : P pour puissance, V pour tension."},
   en:{t:"PV bus (generator bus)", d:"Bus where active power P and voltage magnitude |V| are specified (voltage-regulating generator); Q and angle are computed.", r:"Unrelated to photovoltaics: P for power, V for voltage."}},
  {k:["bus PQ","nœud PQ","bus de charge"], ke:["PQ bus","load bus"],
   fr:{t:"Bus PQ (charge)", d:"Nœud où les puissances active P et réactive Q sont imposées ; module et angle de la tension sont calculés."},
   en:{t:"PQ bus (load bus)", d:"Bus where active and reactive powers P and Q are specified; voltage magnitude and angle are computed."}},
  {k:["Newton-Raphson"], ke:["Newton-Raphson"],
   fr:{t:"Méthode de Newton-Raphson", d:"Méthode itérative qui linéarise les équations du load flow autour du point courant (matrice jacobienne) et corrige tensions et angles à chaque itération.", r:"Convergence quadratique : 3 à 6 itérations en général ; référence des logiciels industriels."},
   en:{t:"Newton-Raphson method", d:"Iterative method that linearises the load-flow equations around the current point (Jacobian matrix) and corrects voltages and angles at each iteration.", r:"Quadratic convergence: typically 3–6 iterations; the industry standard."}},
  {k:["Gauss-Seidel"], ke:["Gauss-Seidel"],
   fr:{t:"Méthode de Gauss-Seidel", d:"Méthode itérative qui recalcule la tension de chaque nœud à partir des valeurs les plus récentes des autres nœuds.", r:"Simple, mais convergence lente sur les grands réseaux ; facteur d'accélération 1,4 à 1,6."},
   en:{t:"Gauss-Seidel method", d:"Iterative method that updates each bus voltage from the latest values of the other buses.", r:"Simple but slow on large networks; acceleration factor 1.4–1.6."}},
  {k:["découplée rapide","fast decoupled"], ke:["fast decoupled"],
   fr:{t:"Méthode découplée rapide", d:"Variante de Newton-Raphson qui sépare les problèmes P–θ et Q–V avec des matrices constantes, valable quand R/X est faible (transport).", r:"Peu adaptée aux réseaux de distribution où R/X est élevé."},
   en:{t:"Fast decoupled method", d:"Newton-Raphson variant that separates the P–θ and Q–V problems with constant matrices, valid when R/X is small (transmission).", r:"Ill-suited to distribution networks with high R/X."}},
  {k:["p.u.","grandeurs réduites"], ke:["per unit","p.u."],
   fr:{t:"Grandeurs réduites (pu)", d:"Valeur exprimée en fraction d'une grandeur de base : U_pu = U / U_base, S_pu = S / S_base, Z_base = U_base² / S_base.", r:"Fait disparaître les rapports des transformateurs et permet de comparer des réseaux de tensions différentes.", v:"Plage contractuelle usuelle : 0,95 à 1,05 pu (ou ± 10 % en BT)."},
   en:{t:"Per unit (pu)", d:"Quantity expressed as a fraction of a base value: V_pu = V / V_base, S_pu = S / S_base, Z_base = V_base² / S_base.", r:"Removes transformer ratios and allows comparing networks at different voltages.", v:"Usual statutory range: 0.95–1.05 pu (± 10 % at LV)."}},
  {k:["court-circuit","courts-circuits"], ke:["short circuit","short-circuit"],
   fr:{t:"Court-circuit", d:"Liaison accidentelle de faible impédance entre phases ou entre phase et terre. Le calcul détermine les courants de défaut pour dimensionner les appareillages et régler les protections.", f:"I″k3 = c·U_n / (√3·|Z_k|)", s:"IEC 60909 ; composantes symétriques pour les défauts dissymétriques."},
   en:{t:"Short circuit", d:"Accidental low-impedance connection between phases or phase and earth. The calculation gives fault currents to size switchgear and set protections.", f:"I″k3 = c·U_n / (√3·|Z_k|)", s:"IEC 60909; symmetrical components for unbalanced faults."}},
  {k:["IEC 60909"], ke:["IEC 60909"], cs:true,
   fr:{t:"IEC 60909", d:"Norme de calcul des courants de court-circuit dans les réseaux triphasés alternatifs : méthode de la source de tension équivalente au point de défaut (facteur de tension c), courants I″k, i_p, I_b, I_k.", v:"c_max = 1,1 (HTA), 1,05 ou 1,10 (BT)."},
   en:{t:"IEC 60909", d:"Standard for short-circuit current calculation in three-phase AC systems: equivalent voltage source at the fault location (voltage factor c), currents I″k, i_p, I_b, I_k.", v:"c_max = 1.1 (MV), 1.05 or 1.10 (LV)."}},
  {k:["OPF","répartition optimale des puissances"], ke:["OPF","optimal power flow"], cs:true,
   fr:{t:"OPF — répartition optimale des puissances", d:"Load flow dans lequel les productions et les consignes sont choisies pour minimiser un coût (combustible, achats au réseau, pertes) en respectant les contraintes de tension, de courant et de puissance.", s:"Voir dispatch économique, MILP."},
   en:{t:"OPF — optimal power flow", d:"Load flow in which generation and set points are chosen to minimise a cost (fuel, grid purchases, losses) subject to voltage, current and power limits.", s:"See economic dispatch, MILP."}},
  {k:["dispatch économique","répartition économique"], ke:["economic dispatch"],
   fr:{t:"Dispatch économique", d:"Choix, à chaque pas de temps, de la puissance de chaque source (groupe, batterie, réseau, renouvelables) qui satisfait la demande au moindre coût, en respectant réserves et limites techniques.", r:"Sur un horizon (24 h par pas de 15 min) avec démarrages/arrêts et stockage, il se formule souvent en MILP."},
   en:{t:"Economic dispatch", d:"Choice, at each time step, of the output of each source (genset, battery, grid, renewables) that meets demand at least cost within reserves and technical limits.", r:"Over a horizon (24 h in 15-min steps) with start/stop and storage it is often formulated as a MILP."}},
  {k:["MILP"], ke:["MILP"], cs:true,
   fr:{t:"MILP — programmation linéaire en nombres entiers mixtes", d:"Méthode d'optimisation de référence des systèmes de gestion de l'énergie : variables continues (puissances, état de charge) et binaires (marche/arrêt d'un groupe, interdiction de charger et décharger en même temps).", r:"Objectif : minimiser le coût d'exploitation (achats, carburant, vieillissement) ou maximiser les revenus, sous contraintes physiques et bilan énergétique."},
   en:{t:"MILP — mixed-integer linear programming", d:"Reference optimisation method of energy management systems: continuous variables (powers, state of charge) and binaries (genset on/off, no simultaneous charge and discharge).", r:"Objective: minimise operating cost (purchases, fuel, ageing) or maximise revenue under physical constraints and energy balance."}},
  {k:["réserve tournante"], ke:["spinning reserve"],
   fr:{t:"Réserve tournante", d:"Marge de puissance disponible immédiatement sur les machines en fonctionnement (ou les batteries) pour compenser la perte d'une source ou une hausse de la demande.", v:"Souvent 10 % de la charge + une part de la production renouvelable dans un micro-réseau."},
   en:{t:"Spinning reserve", d:"Power margin available immediately from running units (or batteries) to cover the loss of a source or a rise in demand.", v:"Often 10 % of load plus a share of renewable output in a microgrid."}},
  {k:["régleur en charge","OLTC"], ke:["on-load tap changer","OLTC"],
   fr:{t:"Régleur en charge (OLTC)", d:"Dispositif qui change la prise d'un transformateur sous tension pour régler la tension secondaire, par pas de 1 à 2,5 %.", r:"Élément central du réglage de tension (IVVC) des postes HTB/HTA."},
   en:{t:"On-load tap changer (OLTC)", d:"Device that changes a transformer tap while energised to regulate secondary voltage, in 1–2.5 % steps.", r:"Key element of voltage control (IVVC) in HV/MV substations."}},
  {k:["gradins de condensateurs","batterie de condensateurs"], ke:["capacitor bank","capacitor banks"],
   fr:{t:"Gradins de condensateurs", d:"Batterie de condensateurs fractionnée en étapes enclenchées selon le besoin pour compenser la puissance réactive, relever la tension et réduire les pertes.", f:"Q = U² · ω · C", s:"Pilotés par l'IVVC (IEC 61850 : ZCAP)."},
   en:{t:"Capacitor bank", d:"Capacitors split into steps switched as needed to compensate reactive power, raise voltage and reduce losses.", f:"Q = V² · ω · C", s:"Controlled by IVVC (IEC 61850: ZCAP)."}},
  {k:["IVVC","Volt/VAR intégré"], ke:["IVVC","integrated volt/VAR"], cs:true,
   fr:{t:"IVVC — réglage intégré tension / réactif", d:"Fonction de l'ADMS qui coordonne régleurs en charge, gradins de condensateurs et puissance réactive des onduleurs pour maintenir les tensions dans la plage contractuelle en minimisant les pertes ou la consommation (CVR).", s:"Étude « IVVC » de NRJXpert."},
   en:{t:"IVVC — integrated volt/VAR control", d:"ADMS function that coordinates tap changers, capacitor banks and inverter reactive power to keep voltages within limits while minimising losses or demand (CVR).", s:"NRJXpert 'IVVC' study."}},
  {k:["CVR"], ke:["CVR"], cs:true,
   fr:{t:"CVR — réduction de la consommation par la tension", d:"Abaissement maîtrisé de la tension dans le bas de la plage contractuelle pour réduire la consommation des charges sensibles à la tension.", f:"Facteur CVR = (ΔP/P) / (ΔU/U)", v:"Facteur CVR typique 0,7 à 1."},
   en:{t:"CVR — conservation voltage reduction", d:"Controlled lowering of voltage towards the bottom of the statutory range to reduce the demand of voltage-sensitive loads.", f:"CVR factor = (ΔP/P) / (ΔV/V)", v:"Typical CVR factor 0.7–1."}},
  {k:["ZIP","modèle ZIP"], ke:["ZIP","ZIP model"], cs:true,
   fr:{t:"Modèle de charge ZIP", d:"Représentation d'une charge comme somme d'une part à impédance constante (Z), à courant constant (I) et à puissance constante (P).", f:"P(U) = P₀·[a_Z·(U/U₀)² + a_I·(U/U₀) + a_P], a_Z + a_I + a_P = 1"},
   en:{t:"ZIP load model", d:"Load represented as constant-impedance (Z), constant-current (I) and constant-power (P) parts.", f:"P(V) = P₀·[a_Z·(V/V₀)² + a_I·(V/V₀) + a_P], a_Z + a_I + a_P = 1"}},
  {k:["HTA","HTB","BT"], ke:["MV","HV","LV"], cs:true,
   fr:{t:"Domaines de tension (BT, HTA, HTB)", d:"BT : basse tension (≤ 1 kV en alternatif, ex. 230/400 V) ; HTA : moyenne tension (1 à 50 kV, ex. 6,6, 15, 30 kV au Sénégal) ; HTB : haute tension (> 50 kV, ex. 90 et 225 kV).", s:"NF C 18-510, IEC 60038."},
   en:{t:"Voltage levels (LV, MV, HV)", d:"LV: low voltage (≤ 1 kV AC, e.g. 230/400 V); MV: medium voltage (1–50 kV, e.g. 6.6, 15, 30 kV); HV: high voltage (> 50 kV, e.g. 90 and 225 kV).", s:"IEC 60038."}},
  {k:["GRD","gestionnaire du réseau de distribution","GRT"], ke:["DSO","TSO","distribution system operator"], cs:true,
   fr:{t:"GRD / GRT", d:"Gestionnaire du réseau de distribution (GRD, en anglais DSO) : exploite les réseaux HTA et BT ; gestionnaire du réseau de transport (GRT, TSO) : exploite le réseau HTB et assure l'équilibre production–consommation.", s:"Au Sénégal, la Senelec assure les deux missions ; le régulateur est la CRSE."},
   en:{t:"DSO / TSO", d:"Distribution system operator (DSO): operates MV and LV networks; transmission system operator (TSO): operates the HV grid and keeps generation and demand balanced.", s:"In Senegal Senelec performs both roles; the regulator is the CRSE."}},
  {k:["EMT"], ke:["EMT"], cs:true,
   fr:{t:"EMT — simulation des transitoires électromagnétiques", d:"Simulation dans le domaine temporel des tensions et courants instantanés (pas de quelques microsecondes), nécessaire pour la commutation des convertisseurs, les surtensions et les protections rapides.", r:"Plus précise mais beaucoup plus lente que la simulation en phaseurs (RMS) utilisée pour la stabilité."},
   en:{t:"EMT — electromagnetic transient simulation", d:"Time-domain simulation of instantaneous voltages and currents (time step of a few microseconds), needed for converter switching, overvoltages and fast protections.", r:"More accurate but much slower than phasor (RMS) simulation used for stability."}},
  // ------------------------------------------------------------------ réseaux intelligents
  {k:["réseau intelligent","réseaux intelligents","Smart Grid","Smart Grids","smart grid"], ke:["smart grid","smart grids","Smart Grid","Smart Grids"],
   fr:{t:"Réseau intelligent (Smart Grid)", d:"Réseau électrique qui intègre capteurs, communications numériques et automatismes pour observer, piloter et optimiser en temps réel la production, les flux et la consommation, y compris les DER et les clients.", s:"Cadre d'architecture SGAM ; normes IEC 61850, CIM (61968/61970), IEC 62351."},
   en:{t:"Smart grid", d:"Power network that integrates sensors, digital communications and automation to observe, control and optimise generation, flows and demand in real time, including DER and customers.", s:"SGAM architecture framework; IEC 61850, CIM (61968/61970), IEC 62351."}},
  {k:["SGAM"], ke:["SGAM"], cs:true,
   fr:{t:"SGAM — modèle d'architecture des réseaux intelligents", d:"Cadre de référence (CEN-CENELEC-ETSI, 2012 ; IEC TR 63097) qui décrit un système de réseau intelligent selon 5 couches d'interopérabilité (métier, fonction, information, communication, composant), 5 domaines (production, transport, distribution, DER, clients) et 6 zones (processus, terrain, poste, exploitation, entreprise, marché).", r:"Sert à analyser des cas d'usage, repérer les lacunes de normalisation et vérifier l'interopérabilité. Atelier SGAM de NRJXpert : menu Outils."},
   en:{t:"SGAM — Smart Grid Architecture Model", d:"Reference framework (CEN-CENELEC-ETSI, 2012; IEC TR 63097) describing a smart grid system through 5 interoperability layers (business, function, information, communication, component), 5 domains (generation, transmission, distribution, DER, customer premises) and 6 zones (process, field, station, operation, enterprise, market).", r:"Used to analyse use cases, find standardisation gaps and check interoperability. NRJXpert SGAM workshop: Tools menu."}},
  {k:["cas d'usage"], ke:["use case","use cases"],
   fr:{t:"Cas d'usage (IEC 62559-2)", d:"Description structurée d'une fonction d'un système : portée, objectifs, acteurs, conditions préalables, scénario pas à pas indiquant pour chaque pas l'émetteur, le destinataire et l'information échangée, exigences.", s:"IEC 62559-2 (gabarit), IEC 62559-3 (format XML)."},
   en:{t:"Use case (IEC 62559-2)", d:"Structured description of a system function: scope, objectives, actors, preconditions, step-by-step scenario giving for each step the producer, receiver and information exchanged, requirements.", s:"IEC 62559-2 (template), IEC 62559-3 (XML format)."}},
  {k:["SCADA"], ke:["SCADA"], cs:true,
   fr:{t:"SCADA — supervision, contrôle et acquisition de données", d:"Système de conduite qui acquiert en temps réel les mesures et états des postes (via les RTU et les IED) et envoie les télécommandes.", s:"IEC 60870-5-104, DNP3, IEC 61850."},
   en:{t:"SCADA — supervisory control and data acquisition", d:"Control system that acquires real-time measurements and states from substations (via RTUs and IEDs) and sends remote commands.", s:"IEC 60870-5-104, DNP3, IEC 61850."}},
  {k:["ADMS","DMS"], ke:["ADMS","DMS"], cs:true,
   fr:{t:"ADMS — système avancé de gestion de la distribution", d:"Plateforme du distributeur qui réunit SCADA, gestion des incidents (OMS) et applications d'analyse fondées sur le modèle du réseau : estimation d'état, load flow, FLISR, IVVC, gestion des DER.", s:"Modèle de réseau CIM (IEC 61968/61970)."},
   en:{t:"ADMS — advanced distribution management system", d:"Utility platform combining SCADA, outage management (OMS) and model-based applications: state estimation, load flow, FLISR, IVVC, DER management.", s:"CIM network model (IEC 61968/61970)."}},
  {k:["EMS"], ke:["EMS"], cs:true,
   fr:{t:"EMS — système de gestion de l'énergie", d:"Logiciel qui planifie et pilote les sources et les charges d'un site, d'un micro-réseau ou d'un réseau de transport (prévisions, dispatch, réserves), souvent par optimisation MILP."},
   en:{t:"EMS — energy management system", d:"Software that schedules and controls the sources and loads of a site, microgrid or transmission system (forecasts, dispatch, reserves), often through MILP optimisation."}},
  {k:["DERMS"], ke:["DERMS"], cs:true,
   fr:{t:"DERMS — système de gestion des ressources décentralisées", d:"Plateforme qui surveille et pilote un parc de DER (consignes P, Q, modes Volt/VAR), en coordination avec l'ADMS, pour respecter les contraintes du réseau et fournir des services.", s:"IEEE 2030.5, IEC 61850-7-420, IEC 61968-5."},
   en:{t:"DERMS — distributed energy resource management system", d:"Platform that monitors and controls a fleet of DER (P, Q set points, volt/VAR modes) in coordination with the ADMS, to respect network limits and provide services.", s:"IEEE 2030.5, IEC 61850-7-420, IEC 61968-5."}},
  {k:["RTU"], ke:["RTU"], cs:true,
   fr:{t:"RTU — unité terminale distante", d:"Automate de poste qui collecte mesures et états et exécute les télécommandes pour le SCADA."},
   en:{t:"RTU — remote terminal unit", d:"Substation controller that collects measurements and states and executes remote commands for SCADA."}},
  {k:["IED"], ke:["IED"], cs:true,
   fr:{t:"IED — équipement électronique intelligent", d:"Équipement numérique de protection, de mesure ou de commande (relais, contrôleur de cellule) qui communique, en général selon l'IEC 61850."},
   en:{t:"IED — intelligent electronic device", d:"Digital protection, measurement or control device (relay, bay controller) that communicates, usually via IEC 61850."}},
  {k:["FLISR","auto-cicatrisation","auto-cicatrisant","Self-Healing"], ke:["FLISR","self-healing"],
   fr:{t:"FLISR — localisation, isolement et réalimentation", d:"Automatisme du réseau de distribution (« auto-cicatrisant ») qui, après un défaut permanent sur un départ HTA : 1) localise le tronçon en défaut grâce aux IPD ; 2) l'isole par les interrupteurs télécommandés ; 3) réalimente l'amont (refermeture du disjoncteur) et l'aval (fermeture d'un organe de bouclage, après vérification par load flow).", v:"Quelques dizaines de secondes à quelques minutes, contre parfois plus d'une heure en manuel.", r:"Réduit directement le SAIDI et l'END. Les DER compliquent la détection (courants inversés, plan de protection à recalculer)."},
   en:{t:"FLISR — fault location, isolation and service restoration", d:"Distribution automation ('self-healing grid') that, after a permanent fault on an MV feeder: 1) locates the faulted section using FPIs; 2) isolates it with remote-controlled switches; 3) restores upstream (reclosing the breaker) and downstream customers (closing a tie switch after a load-flow check).", v:"Tens of seconds to a few minutes, versus sometimes over an hour manually.", r:"Directly reduces SAIDI and ENS. DER complicate detection (reverse currents, protection settings to recompute)."}},
  {k:["IPD","indicateur de passage de défaut","indicateurs de passage de défaut","FPI"], ke:["FPI","fault passage indicator","fault passage indicators"], cs:true,
   fr:{t:"IPD — indicateur de passage de défaut", d:"Capteur placé le long d'une artère HTA qui signale le passage d'un courant de défaut ; le tronçon en défaut est entre le dernier IPD « allumé » et le premier resté « éteint » (FPI en anglais). Avec des DER, des IPD directionnels sont nécessaires.", r:"Autre sens du sigle : dispositif de protection d'interconnexion (Interconnection Protection Device) d'un producteur décentralisé (surveillance U, f, RoCoF, découplage).", s:"IEC 61850 (SFPI)."},
   en:{t:"FPI — fault passage indicator", d:"Sensor along an MV feeder that signals the passage of fault current; the faulted section lies between the last 'lit' FPI and the first 'unlit' one. With DER, directional FPIs are needed.", s:"IEC 61850 (SFPI)."}},
  {k:["IACM","IAT","interrupteurs télécommandés","interrupteur télécommandé"], ke:["remote-controlled switch","remote-controlled switches"],
   fr:{t:"IACM / IAT — interrupteur télécommandé", d:"Interrupteur aérien (IAT) ou de poste HTA/BT (IACM) manœuvrable à distance par le SCADA, utilisé pour isoler un tronçon et reconfigurer le réseau."},
   en:{t:"Remote-controlled switch", d:"Overhead or ground-mounted MV switch operated remotely by SCADA, used to isolate a section and reconfigure the network."}},
  {k:["organe de bouclage","interrupteur de bouclage","Tie Switch"], ke:["tie switch","tie switches"],
   fr:{t:"Organe de bouclage (tie switch)", d:"Interrupteur normalement ouvert entre deux départs ; sa fermeture permet de réalimenter une partie d'un départ par l'autre."},
   en:{t:"Tie switch", d:"Normally-open switch between two feeders; closing it allows part of one feeder to be supplied from the other."}},
  {k:["réenclencheur","réenclenchement"], ke:["recloser","reclosing"],
   fr:{t:"Réenclencheur", d:"Disjoncteur qui se referme automatiquement après un déclenchement, une ou plusieurs fois, pour éliminer les défauts fugitifs (foudre, branche).", r:"Chaque cycle crée une coupure brève comptée dans le MAIFI ; il peut faire décrocher les onduleurs."},
   en:{t:"Recloser", d:"Breaker that automatically recloses after tripping, once or several times, to clear transient faults (lightning, branches).", r:"Each cycle causes a momentary interruption counted in MAIFI and can trip inverters."}},
  {k:["SAIDI"], ke:["SAIDI"], cs:true,
   fr:{t:"SAIDI — durée moyenne de coupure par client", d:"Durée cumulée moyenne des coupures longues subies par un client sur une période (souvent un an).", f:"SAIDI = Σ(r_i · N_i) / N_T", v:"Unité : minutes ou heures / client / an.", r:"SAIDI = SAIFI × CAIDI ; mesure l'efficacité des équipes et de l'automatisation.", s:"IEEE 1366."},
   en:{t:"SAIDI — system average interruption duration index", d:"Average cumulative duration of sustained interruptions per customer over a period (usually a year).", f:"SAIDI = Σ(r_i · N_i) / N_T", v:"Unit: minutes or hours / customer / year.", r:"SAIDI = SAIFI × CAIDI; reflects crew efficiency and automation.", s:"IEEE 1366."}},
  {k:["SAIFI"], ke:["SAIFI"], cs:true,
   fr:{t:"SAIFI — fréquence moyenne des coupures", d:"Nombre moyen de coupures longues subies par un client sur une période.", f:"SAIFI = Σ N_i / N_T", v:"Unité : coupures / client / an.", r:"Mesure la qualité des équipements et l'exposition aux intempéries.", s:"IEEE 1366."},
   en:{t:"SAIFI — system average interruption frequency index", d:"Average number of sustained interruptions per customer over a period.", f:"SAIFI = Σ N_i / N_T", v:"Unit: interruptions / customer / year.", r:"Reflects equipment quality and weather exposure.", s:"IEEE 1366."}},
  {k:["MAIFI"], ke:["MAIFI"], cs:true,
   fr:{t:"MAIFI — fréquence moyenne des coupures brèves", d:"Nombre moyen de coupures brèves (microcoupures, en général moins d'1 min ou 3 min) par client.", f:"MAIFI = Σ N_mi / N_T", r:"Crucial avec les équipements électroniques et les DER : les réenclenchements répétés peuvent faire décrocher les onduleurs.", s:"IEEE 1366."},
   en:{t:"MAIFI — momentary average interruption frequency index", d:"Average number of momentary interruptions (usually under 1 or 3 min) per customer.", f:"MAIFI = Σ N_mi / N_T", r:"Critical with electronic equipment and DER: repeated reclosing can trip inverters.", s:"IEEE 1366."}},
  {k:["CAIDI"], ke:["CAIDI"], cs:true,
   fr:{t:"CAIDI — durée moyenne de rétablissement", d:"Durée moyenne d'une coupure pour les clients coupés.", f:"CAIDI = SAIDI / SAIFI = Σ(r_i·N_i) / Σ N_i"},
   en:{t:"CAIDI — customer average interruption duration index", d:"Average restoration time per interruption for affected customers.", f:"CAIDI = SAIDI / SAIFI = Σ(r_i·N_i) / Σ N_i"}},
  {k:["ASAI"], ke:["ASAI"], cs:true,
   fr:{t:"ASAI — disponibilité moyenne du service", d:"Pourcentage du temps pendant lequel l'électricité est effectivement fournie.", f:"ASAI = (N_T·T − Σ r_i·N_i) / (N_T·T), T = 8 760 h", v:"ASAI = 99,9 % ≈ 8,76 h de coupure par an."},
   en:{t:"ASAI — average service availability index", d:"Percentage of time electricity is actually supplied.", f:"ASAI = (N_T·T − Σ r_i·N_i) / (N_T·T), T = 8,760 h", v:"ASAI = 99.9 % ≈ 8.76 h of interruption per year."}},
  {k:["END","ENS","énergie non distribuée","Énergie non distribuée"], ke:["ENS","energy not supplied"], cs:true,
   fr:{t:"END — énergie non distribuée", d:"Énergie qui n'a pas pu être livrée aux consommateurs à cause des coupures (ENS en anglais).", f:"END = Σ (P_i · r_i)", v:"Unité : kWh ou MWh ; valorisée au coût de défaillance (ex. 1 à 10 €/kWh).", r:"Traduit l'impact économique des coupures et justifie les investissements (automatisation, stockage, micro-réseaux)."},
   en:{t:"ENS — energy not supplied", d:"Energy that could not be delivered to customers because of interruptions.", f:"ENS = Σ (P_i · r_i)", v:"Unit: kWh or MWh; valued at the value of lost load (e.g. 1–10 €/kWh).", r:"Expresses the economic impact of outages and justifies investments (automation, storage, microgrids)."}},
  {k:["VPP","centrale virtuelle","centrales virtuelles"], ke:["VPP","virtual power plant","virtual power plants"], cs:true,
   fr:{t:"VPP — centrale virtuelle", d:"Agrégation, par une plateforme logicielle, de nombreuses ressources dispersées (batteries, bornes VE, charges effaçables, petites productions) pilotées comme une seule centrale pour vendre de l'énergie ou des services (effacement, réserve).", s:"OpenADR, IEEE 2030.5, OCPP."},
   en:{t:"VPP — virtual power plant", d:"Software aggregation of many dispersed resources (batteries, EV chargers, curtailable loads, small generation) operated as a single plant to sell energy or services (demand response, reserve).", s:"OpenADR, IEEE 2030.5, OCPP."}},
  {k:["agrégateur","agrégateurs"], ke:["aggregator","aggregators"],
   fr:{t:"Agrégateur", d:"Acteur qui regroupe les flexibilités de nombreux clients ou DER et les valorise auprès du gestionnaire de réseau ou sur les marchés.", s:"Voir VPP, OpenADR."},
   en:{t:"Aggregator", d:"Actor that pools the flexibility of many customers or DER and sells it to the network operator or on markets.", s:"See VPP, OpenADR."}},
  {k:["effacement","effacements","Demand Response","demand response"], ke:["demand response"],
   fr:{t:"Effacement (demand response)", d:"Réduction ou report volontaire de la consommation à la demande d'un signal (prix, contrainte réseau), éventuellement rémunéré.", s:"OpenADR (IEC 62746-10-1)."},
   en:{t:"Demand response", d:"Voluntary reduction or shift of consumption in response to a signal (price, grid constraint), possibly remunerated.", s:"OpenADR (IEC 62746-10-1)."}},
  {k:["flexibilité"], ke:["flexibility"],
   fr:{t:"Flexibilité", d:"Capacité d'une ressource à modifier sa production ou sa consommation à la demande (sens, puissance, durée, délai de mobilisation)."},
   en:{t:"Flexibility", d:"Ability of a resource to change its generation or consumption on request (direction, power, duration, activation time)."}},
  {k:["OpenADR"], ke:["OpenADR"], cs:true,
   fr:{t:"OpenADR — effacement automatisé ouvert", d:"Protocole ouvert (IEC 62746-10-1) d'automatisation de l'effacement : un serveur (VTN) envoie des évènements (prix dynamique, alerte de congestion, demande de réduction) à des clients (VEN) qui déclenchent automatiquement les actions prévues dans leur EMS.", s:"XML/JSON sur HTTP ou XMPP ; profils 2.0a, 2.0b, 3.0."},
   en:{t:"OpenADR — open automated demand response", d:"Open protocol (IEC 62746-10-1) automating demand response: a server (VTN) sends events (dynamic price, congestion alert, load-reduction request) to clients (VEN) that automatically trigger actions defined in their EMS.", s:"XML/JSON over HTTP or XMPP; profiles 2.0a, 2.0b, 3.0."}},
  {k:["VTN"], ke:["VTN"], cs:true,
   fr:{t:"VTN — nœud virtuel supérieur (OpenADR)", d:"Serveur OpenADR du fournisseur, du gestionnaire de réseau ou de l'agrégateur, qui publie les évènements d'effacement."},
   en:{t:"VTN — virtual top node (OpenADR)", d:"OpenADR server of the utility, network operator or aggregator that publishes demand-response events."}},
  {k:["VEN"], ke:["VEN"], cs:true,
   fr:{t:"VEN — nœud virtuel terminal (OpenADR)", d:"Client OpenADR (site industriel, bâtiment, gestionnaire de DER) qui reçoit les évènements et rend compte de sa réponse."},
   en:{t:"VEN — virtual end node (OpenADR)", d:"OpenADR client (industrial site, building, DER manager) that receives events and reports its response."}},
  {k:["AMI","comptage évolué","infrastructure de comptage avancée"], ke:["AMI","advanced metering infrastructure"], cs:true,
   fr:{t:"AMI — infrastructure de comptage évolué", d:"Système intégré de compteurs intelligents, de réseaux de communication (CPL G3, 4G, NB-IoT, radio maillée) et de systèmes de données (HES, MDMS) qui permet une communication bidirectionnelle entre le gestionnaire et le client ou prosommateur.", r:"Télérelève et téléopération, intégration des DER (énergie injectée, tarifs dynamiques), détection des coupures (dernier souffle), réduction des pertes non techniques par bilan énergétique, contrôle de la tension.", s:"Contrairement à l'AMR (relève unidirectionnelle). IEC 62056 (DLMS/COSEM)."},
   en:{t:"AMI — advanced metering infrastructure", d:"Integrated system of smart meters, communication networks (G3-PLC, 4G, NB-IoT, RF mesh) and data systems (HES, MDMS) enabling two-way communication between the utility and the customer or prosumer.", r:"Remote reading and operation, DER integration (exported energy, dynamic tariffs), outage detection (last gasp), non-technical loss reduction by energy balance, voltage monitoring.", s:"Unlike AMR (one-way reading). IEC 62056 (DLMS/COSEM)."}},
  {k:["AMR"], ke:["AMR"], cs:true,
   fr:{t:"AMR — relève automatisée des compteurs", d:"Génération de comptage antérieure à l'AMI : relève à distance, mais unidirectionnelle (pas de commande vers le compteur)."},
   en:{t:"AMR — automated meter reading", d:"Metering generation before AMI: remote but one-way reading (no commands to the meter)."}},
  {k:["compteur communicant","compteurs communicants","compteur intelligent","compteurs intelligents","Smart Meter","Smart Meters"], ke:["smart meter","smart meters"],
   fr:{t:"Compteur communicant (smart meter)", d:"Compteur électronique qui mesure par pas de 10 à 15 min l'énergie soutirée et injectée, la tension, le courant, le facteur de puissance et la qualité de l'onde, et communique dans les deux sens.", s:"IEC 62056 (DLMS/COSEM), codes OBIS."},
   en:{t:"Smart meter", d:"Electronic meter that records imported and exported energy, voltage, current, power factor and power quality every 10–15 min and communicates both ways.", s:"IEC 62056 (DLMS/COSEM), OBIS codes."}},
  {k:["HES"], ke:["HES"], cs:true,
   fr:{t:"HES — système central de télérelève (Head-End System)", d:"Logiciel central qui collecte les données brutes des compteurs et leur envoie les commandes à distance (coupure, puissance souscrite, mise à jour)."},
   en:{t:"HES — head-end system", d:"Central software that collects raw meter data and sends remote commands (disconnect, contracted power, firmware)."}},
  {k:["MDMS","MDM"], ke:["MDMS","MDM"], cs:true,
   fr:{t:"MDMS — gestion des données de comptage", d:"Base de données analytique qui valide, estime, stocke et traite les courbes de charge avant de les transmettre à la facturation, à la prévision ou à la conduite du réseau (SCADA/ADMS).", s:"IEC 61968-9."},
   en:{t:"MDMS — meter data management system", d:"Analytical database that validates, estimates, stores and processes load profiles before passing them to billing, forecasting or network operation (SCADA/ADMS).", s:"IEC 61968-9."}},
  {k:["dernier souffle","last gasp"], ke:["last gasp"],
   fr:{t:"Dernier souffle (last gasp)", d:"Message d'alerte envoyé par un compteur communicant au moment où il perd son alimentation, qui permet de localiser une coupure BT sans attendre l'appel des clients."},
   en:{t:"Last gasp", d:"Alarm message sent by a smart meter as it loses supply, allowing an LV outage to be located without waiting for customer calls."}},
  {k:["pertes non techniques"], ke:["non-technical losses"],
   fr:{t:"Pertes non techniques", d:"Énergie consommée mais non facturée : fraudes, branchements illicites, erreurs de comptage ou de facturation. Détectées par bilan énergétique entre le poste et la somme des compteurs en aval."},
   en:{t:"Non-technical losses", d:"Energy consumed but not billed: theft, illegal connections, metering or billing errors. Detected by energy balance between the substation and the sum of downstream meters."}},
  {k:["DLMS/COSEM","DLMS","COSEM"], ke:["DLMS/COSEM","DLMS","COSEM"], cs:true,
   fr:{t:"DLMS/COSEM (IEC 62056)", d:"Standard de communication des compteurs. COSEM : modèle objet des données du compteur, chaque grandeur étant identifiée par un code OBIS ; DLMS : protocole (requêtes GET, SET, ACTION, chiffrement, authentification) indépendant du support (CPL G3, 4G, NB-IoT, port optique, RS-485)."},
   en:{t:"DLMS/COSEM (IEC 62056)", d:"Meter communication standard. COSEM: object model of meter data, each quantity identified by an OBIS code; DLMS: protocol (GET, SET, ACTION requests, encryption, authentication) independent of the medium (G3-PLC, 4G, NB-IoT, optical port, RS-485)."}},
  {k:["OBIS"], ke:["OBIS"], cs:true,
   fr:{t:"Code OBIS", d:"Identifiant normalisé à six groupes (A.B.C.D.E.F) d'une grandeur dans un compteur COSEM.", v:"Ex. : 1.0.1.8.0.255 = énergie active totale soutirée ; 1.0.2.8.0.255 = énergie active injectée."},
   en:{t:"OBIS code", d:"Standard six-group identifier (A.B.C.D.E.F) of a quantity in a COSEM meter.", v:"E.g. 1.0.1.8.0.255 = total imported active energy; 1.0.2.8.0.255 = exported active energy."}},
  {k:["OCPP"], ke:["OCPP"], cs:true,
   fr:{t:"OCPP — protocole ouvert des bornes de recharge", d:"Protocole (JSON sur WebSocket, versions 1.6J et 2.0.1) entre une borne de recharge et son superviseur (CSMS). Messages : BootNotification, Heartbeat, Authorize, TransactionEvent, StatusNotification, MeterValues, et SetChargingProfile pour la recharge intelligente (limite de puissance par créneau).", s:"Voir ISO 15118 pour le dialogue véhicule–borne."},
   en:{t:"OCPP — Open Charge Point Protocol", d:"Protocol (JSON over WebSocket, versions 1.6J and 2.0.1) between an EV charger and its management system (CSMS). Messages: BootNotification, Heartbeat, Authorize, TransactionEvent, StatusNotification, MeterValues and SetChargingProfile for smart charging (power limit per time slot).", s:"See ISO 15118 for the vehicle–charger dialogue."}},
  {k:["CSMS"], ke:["CSMS"], cs:true,
   fr:{t:"CSMS — système de gestion des bornes", d:"Serveur central qui supervise les bornes de recharge par OCPP : sessions, facturation, profils de recharge."},
   en:{t:"CSMS — charging station management system", d:"Central server supervising EV chargers through OCPP: sessions, billing, charging profiles."}},
  {k:["V2G"], ke:["V2G"], cs:true,
   fr:{t:"V2G — du véhicule vers le réseau", d:"Utilisation de la batterie d'un véhicule électrique branché pour réinjecter de l'énergie sur le réseau ou fournir des services.", s:"ISO 15118-20 (transfert bidirectionnel), OCPP 2.0.1."},
   en:{t:"V2G — vehicle-to-grid", d:"Use of a plugged-in EV battery to export energy to the grid or provide services.", s:"ISO 15118-20 (bidirectional power transfer), OCPP 2.0.1."}},
  {k:["recharge intelligente","Smart Charging"], ke:["smart charging"],
   fr:{t:"Recharge intelligente (smart charging)", d:"Modulation de la puissance de recharge des véhicules selon les contraintes du réseau, le prix ou la production solaire.", s:"OCPP SetChargingProfile, ISO 15118."},
   en:{t:"Smart charging", d:"Modulation of EV charging power according to network constraints, price or solar output.", s:"OCPP SetChargingProfile, ISO 15118."}},
  {k:["IEC 61850","CEI 61850"], ke:["IEC 61850"],
   fr:{t:"IEC 61850", d:"Norme de communication des postes électriques et des DER : modèle de données par nœuds logiques (XCBR disjoncteur, MMXU mesures, PTOC protection, DRCC commande de DER…), services MMS client-serveur, messages rapides GOOSE et valeurs échantillonnées (SV), langage de configuration SCL.", s:"IEC 61850-7-420 pour les DER ; sécurité IEC 62351-6."},
   en:{t:"IEC 61850", d:"Communication standard for substations and DER: data model of logical nodes (XCBR breaker, MMXU measurements, PTOC protection, DRCC DER control…), MMS client-server services, fast GOOSE messages and sampled values (SV), SCL configuration language.", s:"IEC 61850-7-420 for DER; security IEC 62351-6."}},
  {k:["GOOSE"], ke:["GOOSE"], cs:true,
   fr:{t:"GOOSE (IEC 61850)", d:"Message multidiffusé rapide (moins de 3 à 10 ms) entre IED pour les déclenchements et verrouillages, répété en cas de changement d'état."},
   en:{t:"GOOSE (IEC 61850)", d:"Fast multicast message (under 3–10 ms) between IEDs for trips and interlocks, repeated on state changes."}},
  {k:["IEC 60870-5-104","IEC 104","IEC 60870-5-101"], ke:["IEC 60870-5-104","IEC 104","IEC 60870-5-101"],
   fr:{t:"IEC 60870-5-101 / 104", d:"Protocoles de téléconduite entre un centre de conduite et les postes : 101 sur liaison série, 104 sur TCP/IP. Les données sont transportées dans des ASDU.", s:"Sécurité : IEC 62351-3 (TLS), 62351-5."},
   en:{t:"IEC 60870-5-101 / 104", d:"Telecontrol protocols between a control centre and substations: 101 over serial links, 104 over TCP/IP. Data travel in ASDUs.", s:"Security: IEC 62351-3 (TLS), 62351-5."}},
  {k:["ASDU"], ke:["ASDU"], cs:true,
   fr:{t:"ASDU — unité de données applicative (IEC 60870-5)", d:"Structure de données des protocoles 101/104. Le type ASDU (1 à 255) indique la nature de l'information et le sens.", v:"Surveillance : type 1 (état simple d'un disjoncteur), 13 (mesure flottante), 36 (mesure horodatée CP56Time2a) ; commande : type 45 (commande simple), 50 (consigne flottante, ex. bridage P_max d'un onduleur)."},
   en:{t:"ASDU — application service data unit (IEC 60870-5)", d:"Data structure of the 101/104 protocols. The ASDU type (1–255) gives the nature of the information and its direction.", v:"Monitoring: type 1 (single-point breaker state), 13 (floating measured value), 36 (time-tagged CP56Time2a); command: type 45 (single command), 50 (floating set point, e.g. inverter P_max limit)."}},
  {k:["DNP3"], ke:["DNP3"], cs:true,
   fr:{t:"DNP3", d:"Protocole de téléconduite (IEEE 1815) très répandu en Amérique du Nord, équivalent de l'IEC 60870-5-104."},
   en:{t:"DNP3", d:"Telecontrol protocol (IEEE 1815) widespread in North America, equivalent to IEC 60870-5-104."}},
  {k:["Modbus"], ke:["Modbus"], cs:true,
   fr:{t:"Modbus", d:"Protocole maître-esclave simple (série RTU ou TCP) à registres ; très utilisé pour les onduleurs, compteurs et automates.", s:"Modèles d'onduleurs normalisés SunSpec."},
   en:{t:"Modbus", d:"Simple master-slave register-based protocol (serial RTU or TCP), widely used for inverters, meters and PLCs.", s:"Standard inverter models: SunSpec."}},
  {k:["SunSpec"], ke:["SunSpec"], cs:true,
   fr:{t:"SunSpec", d:"Modèles de données normalisés des onduleurs et batteries sur Modbus (103 mesures, 123 commandes, 124 stockage, 126 Volt/VAR, 134 fréquence-puissance) ; repris par IEEE 1547.1."},
   en:{t:"SunSpec", d:"Standard inverter and battery data models over Modbus (103 measurements, 123 controls, 124 storage, 126 volt-VAR, 134 frequency-watt); adopted by IEEE 1547.1."}},
  {k:["IEEE 2030.5"], ke:["IEEE 2030.5"],
   fr:{t:"IEEE 2030.5 (SEP 2.0)", d:"Protocole REST/HTTPS de pilotage des DER et des usages (consignes, programmes, prix) entre un serveur (utility, DERMS) et des onduleurs ou passerelles ; exigé par la règle 21 en Californie."},
   en:{t:"IEEE 2030.5 (SEP 2.0)", d:"REST/HTTPS protocol for controlling DER and end uses (set points, schedules, prices) between a server (utility, DERMS) and inverters or gateways; required by California Rule 21."}},
  {k:["IEC 62351"], ke:["IEC 62351"],
   fr:{t:"IEC 62351", d:"Série de normes de cybersécurité des protocoles du secteur électrique : TLS pour 104 et MMS (62351-3/4), authentification des GOOSE (62351-6), gestion des rôles (62351-8), des clés (62351-9)."},
   en:{t:"IEC 62351", d:"Cyber-security standards for power-system protocols: TLS for 104 and MMS (62351-3/4), GOOSE authentication (62351-6), role-based access (62351-8), key management (62351-9)."}},
  {k:["IEC 62443"], ke:["IEC 62443"],
   fr:{t:"IEC 62443", d:"Série de normes de cybersécurité des systèmes d'automatisation industrielle : zones et conduits, niveaux de sécurité SL 1 à 4, exigences fondamentales FR1 à FR7."},
   en:{t:"IEC 62443", d:"Cyber-security standards for industrial automation and control systems: zones and conduits, security levels SL 1–4, foundational requirements FR1–FR7."}},
  {k:["IEEE 1547"], ke:["IEEE 1547"],
   fr:{t:"IEEE 1547", d:"Norme d'interconnexion des DER aux réseaux (2018) : plages de tension et de fréquence, tenue aux défauts, réglages Q(U), P(f), anti-îlotage, interopérabilité (catégories A et B)."},
   en:{t:"IEEE 1547", d:"DER interconnection standard (2018): voltage and frequency ranges, ride-through, Q(V) and P(f) functions, anti-islanding, interoperability (categories A and B)."}},
  {k:["IEEE 2030.7","IEEE 2030.8"], ke:["IEEE 2030.7","IEEE 2030.8"],
   fr:{t:"IEEE 2030.7 / 2030.8", d:"Normes des contrôleurs de micro-réseau : 2030.7 définit les fonctions (dispatch, transitions vers et depuis l'îlotage) ; 2030.8 les essais de ces fonctions."},
   en:{t:"IEEE 2030.7 / 2030.8", d:"Microgrid controller standards: 2030.7 defines the functions (dispatch, transitions to and from island mode); 2030.8 the tests of those functions."}},
  {k:["EN 50549"], ke:["EN 50549"],
   fr:{t:"EN 50549", d:"Norme européenne des exigences de raccordement des installations de production aux réseaux de distribution BT (partie 1) et HTA (partie 2)."},
   en:{t:"EN 50549", d:"European standard on requirements for generating plants connected to LV (part 1) and MV (part 2) distribution networks."}},
  {k:["CIM","modèle CIM","format CIM"], ke:["CIM"], cs:true,
   fr:{t:"CIM — modèle d'information commun (IEC 61970, 61968, 62325)", d:"Norme internationale de description et d'échange des données des réseaux électriques sous forme d'objets (transformateurs, lignes, onduleurs, charges, générateurs), de leurs connexions et de leurs paramètres. Fichiers RDF/XML, souvent regroupés en archive .zip selon le profil CGMES.", r:"Langue commune entre logiciels (PowerFactory, ETAP, CYME, PSS/E, OpenDSS, pandapower) et avec les gestionnaires de réseau (SCADA, EMS, ADMS) : on transfère un modèle sans le redessiner. NRJXpert l'importe et l'exporte (menu Fichier).", s:"Profils EQ (équipements), TP (topologie), SSH (hypothèse de régime permanent), SV (variables d'état)."},
   en:{t:"CIM — Common Information Model (IEC 61970, 61968, 62325)", d:"International standard for describing and exchanging power-system data as objects (transformers, lines, inverters, loads, generators), their connections and parameters. RDF/XML files, often zipped according to the CGMES profile.", r:"Common language between tools (PowerFactory, ETAP, CYME, PSS/E, OpenDSS, pandapower) and with network operators (SCADA, EMS, ADMS): a model is transferred without redrawing. NRJXpert imports and exports it (File menu).", s:"Profiles EQ (equipment), TP (topology), SSH (steady-state hypothesis), SV (state variables)."}},
  {k:["CGMES"], ke:["CGMES"], cs:true,
   fr:{t:"CGMES — Common Grid Model Exchange Standard", d:"Profil européen du CIM (ENTSO-E, IEC 61970-600) : un fichier par profil — EQ (équipements et caractéristiques), TP (connexions, nœuds topologiques), SSH (puissances injectées, état des organes, consommations), SV (résultats : tensions des nœuds, transits) — réunis dans une archive .zip avec des en-têtes de dépendance."},
   en:{t:"CGMES — Common Grid Model Exchange Standard", d:"European CIM profile (ENTSO-E, IEC 61970-600): one file per profile — EQ (equipment and ratings), TP (connections, topological nodes), SSH (injections, switch states, loads), SV (results: bus voltages, flows) — zipped with dependency headers."}},
  {k:["IEC 61968","IEC 61970","CEI 61968","CEI 61970"], ke:["IEC 61968","IEC 61970"],
   fr:{t:"IEC 61970 / IEC 61968", d:"IEC 61970 : CIM du transport et interfaces des EMS (61970-301 modèle de base, -552 format RDF/XML, -600 CGMES) ; IEC 61968 : extensions de la distribution et messages entre applications (61968-9 comptage, 61968-100 échanges)."},
   en:{t:"IEC 61970 / IEC 61968", d:"IEC 61970: transmission CIM and EMS interfaces (61970-301 base model, -552 RDF/XML format, -600 CGMES); IEC 61968: distribution extensions and inter-application messages (61968-9 metering, 61968-100 messaging)."}},
  {k:["estimation d'état"], ke:["state estimation"],
   fr:{t:"Estimation d'état", d:"Calcul de l'état le plus probable du réseau (tensions, angles) à partir de mesures redondantes et entachées d'erreurs, par moindres carrés pondérés ; détecte les mesures aberrantes."},
   en:{t:"State estimation", d:"Computation of the most likely network state (voltages, angles) from redundant, noisy measurements by weighted least squares; detects bad data."}},
  {k:["PMU","synchrophaseur","synchrophaseurs"], ke:["PMU","synchrophasor","synchrophasors"], cs:true,
   fr:{t:"PMU — unité de mesure de phaseurs", d:"Appareil qui mesure les phaseurs de tension et de courant horodatés par GPS (synchrophaseurs), 25 à 100 fois par seconde.", s:"IEEE C37.118, IEC 60255-118-1."},
   en:{t:"PMU — phasor measurement unit", d:"Device measuring GPS-time-stamped voltage and current phasors (synchrophasors) 25–100 times per second.", s:"IEEE C37.118, IEC 60255-118-1."}},
  {k:["courbe de charge","courbes de charge"], ke:["load profile","load profiles","load curve"],
   fr:{t:"Courbe de charge", d:"Évolution de la puissance appelée en fonction du temps (pas de 10 min à 1 h), sur une journée, une semaine ou une année."},
   en:{t:"Load profile", d:"Power demand as a function of time (10 min to 1 h steps) over a day, week or year."}},
  {k:["facteur de charge"], ke:["capacity factor","load factor"],
   fr:{t:"Facteur de charge", d:"Rapport entre l'énergie produite sur une période et celle qu'aurait produite l'installation à sa puissance nominale pendant toute la période.", v:"PV : 15 à 22 % au Sahel ; éolien : 20 à 45 %."},
   en:{t:"Capacity factor", d:"Ratio of energy produced over a period to the energy the plant would have produced at rated power the whole time.", v:"PV: 15–22 % in the Sahel; wind: 20–45 %."}},
  {k:["Weibull","loi de Weibull"], ke:["Weibull","Weibull distribution"],
   fr:{t:"Loi de Weibull", d:"Loi de probabilité des vitesses de vent, de paramètres c (échelle, m/s) et k (forme).", f:"f(v) = (k/c)·(v/c)^(k−1)·exp[−(v/c)^k] ; v̄ = c·Γ(1 + 1/k)", v:"k ≈ 2 (loi de Rayleigh) dans de nombreux sites."},
   en:{t:"Weibull distribution", d:"Probability distribution of wind speeds, with scale c (m/s) and shape k.", f:"f(v) = (k/c)·(v/c)^(k−1)·exp[−(v/c)^k]; mean v = c·Γ(1 + 1/k)", v:"k ≈ 2 (Rayleigh) at many sites."}},
  // ------------------------------------------------------------------ économie
  {k:["taux d'inflation","inflation"], ke:["inflation rate","inflation"],
   fr:{t:"Taux d'inflation", d:"Pourcentage d'augmentation générale et durable des prix des biens et services sur une période (en général un an). Il mesure la perte de pouvoir d'achat de la monnaie.", f:"Prix(n) = Prix(0) × (1 + i)^n", v:"Ex. : avec 3 % d'inflation, un panier à 100 l'an dernier coûte 103 aujourd'hui.", r:"Sert de base aux calculs : coûts futurs d'entretien, de carburant, de remplacement."},
   en:{t:"Inflation rate", d:"Percentage general and sustained increase in the prices of goods and services over a period (usually a year). It measures the loss of purchasing power of money.", f:"Price(n) = Price(0) × (1 + i)^n", v:"E.g. with 3 % inflation, a basket costing 100 last year costs 103 today.", r:"Basis for future maintenance, fuel and replacement costs."}},
  {k:["taux d'actualisation","actualisation","actualisé","actualisée","actualisés","actualisées"], ke:["discount rate","discounting","discounted"],
   fr:{t:"Taux d'actualisation", d:"Taux qui convertit une somme future en sa valeur équivalente aujourd'hui : 1 franc aujourd'hui vaut plus que 1 franc demain (inflation, risque, coût d'opportunité).", f:"Valeur actuelle = F_n / (1 + a)^n", v:"En pratique, rentabilité minimale exigée par l'investisseur (souvent 6 à 12 %).", r:"Taux réel ≈ taux nominal − inflation : (1 + a_nom) = (1 + a_réel)(1 + i)."},
   en:{t:"Discount rate", d:"Rate converting a future amount into its equivalent value today: 1 unit today is worth more than 1 tomorrow (inflation, risk, opportunity cost).", f:"Present value = F_n / (1 + d)^n", v:"In practice the minimum return required by the investor (often 6–12 %).", r:"Real rate ≈ nominal rate − inflation: (1 + d_nom) = (1 + d_real)(1 + i)."}},
  {k:["coût actualisé","coûts actualisés","coût global actualisé"], ke:["discounted cost","life-cycle cost","present cost"],
   fr:{t:"Coût actualisé (coût global)", d:"Somme de toutes les dépenses d'un projet sur sa durée de vie (achat, installation, entretien, énergie, remplacements), ramenées à leur valeur d'aujourd'hui avec le taux d'actualisation.", f:"C_act = I₀ + Σ_{n=1..N} C_n / (1 + a)^n", r:"Permet de comparer objectivement deux équipements : un appareil bon marché mais gourmand peut coûter plus cher sur 10 ans qu'un appareil cher et économe."},
   en:{t:"Discounted (life-cycle) cost", d:"Sum of all project expenses over its life (purchase, installation, maintenance, energy, replacements) brought back to today's value with the discount rate.", f:"C_disc = I₀ + Σ_{n=1..N} C_n / (1 + d)^n", r:"Allows objective comparison: a cheap but energy-hungry device may cost more over 10 years than an expensive efficient one."}},
  {k:["VAN","valeur actuelle nette"], ke:["NPV","net present value"], cs:true,
   fr:{t:"VAN — valeur actuelle nette", d:"Richesse nette créée par un projet, en valeur d'aujourd'hui : somme des gains futurs actualisés moins l'investissement initial.", f:"VAN = −I₀ + Σ_{n=1..N} (R_n − D_n) / (1 + a)^n", r:"VAN > 0 : le projet rapporte plus que le minimum exigé, on investit ; VAN = 0 : il rembourse tout juste l'investissement et le rendement exigé ; VAN < 0 : il détruit de la valeur."},
   en:{t:"NPV — net present value", d:"Net wealth created by a project in today's money: sum of discounted future gains minus the initial investment.", f:"NPV = −I₀ + Σ_{n=1..N} (R_n − E_n) / (1 + d)^n", r:"NPV > 0: the project earns more than required, invest; NPV = 0: it just repays the investment and required return; NPV < 0: it destroys value."}},
  {k:["TRI","taux de rentabilité interne","taux de rendement interne"], ke:["IRR","internal rate of return"], cs:true,
   fr:{t:"TRI — taux de rentabilité interne", d:"Taux de rendement annuel réel d'un projet : le taux d'actualisation qui annule la VAN.", f:"Σ_{n=0..N} F_n / (1 + TRI)^n = 0", r:"On le compare au taux d'actualisation ou au taux d'emprunt : prêt à 4 % et TRI de 9 % → projet intéressant ; TRI inférieur au taux d'actualisation → rentabilité insuffisante. Attention : le sigle TRI désigne aussi parfois le temps de retour sur investissement."},
   en:{t:"IRR — internal rate of return", d:"Actual annual return of a project: the discount rate that makes NPV zero.", f:"Σ_{n=0..N} F_n / (1 + IRR)^n = 0", r:"Compare it with the discount or borrowing rate: loan at 4 % and IRR of 9 % → attractive; IRR below the discount rate → insufficient return."}},
  {k:["temps de retour","temps de retour sur investissement","délai de récupération","Payback","payback"], ke:["payback period","payback","simple payback"],
   fr:{t:"Temps de retour sur investissement (payback)", d:"Durée nécessaire pour que les gains cumulés d'un projet remboursent la mise de départ.", f:"Temps de retour simple = I₀ / gain annuel ; actualisé : plus petit n tel que Σ_{k=1..n} F_k / (1 + a)^k ≥ I₀", v:"Ex. : 10 000 investis, 2 500 économisés par an → 4 ans.", r:"Indicateur de risque et de liquidité simple mais incomplet : il ignore ce qui se passe après le remboursement et, sous sa forme simple, l'actualisation."},
   en:{t:"Payback period", d:"Time needed for a project's cumulative gains to repay the initial outlay.", f:"Simple payback = I₀ / annual gain; discounted: smallest n with Σ_{k=1..n} F_k / (1 + d)^k ≥ I₀", v:"E.g. 10,000 invested, 2,500 saved per year → 4 years.", r:"Simple risk and liquidity indicator, but incomplete: it ignores what happens after payback and, in simple form, discounting."}},
  {k:["LCOE","coût actualisé de l'énergie","coût du kWh"], ke:["LCOE","levelized cost of energy","levelised cost of energy","levelized cost of electricity"], cs:true,
   fr:{t:"LCOE — coût actualisé de l'énergie", d:"Prix de vente constant du kWh qui permettrait d'équilibrer exactement le coût actualisé du projet (VAN nulle).", f:"LCOE = [I₀ + Σ C_n/(1+a)^n] / [Σ E_n/(1+a)^n]", v:"PV au sol au Sahel : de l'ordre de 25 à 45 F CFA/kWh ; diesel : souvent plus de 150 F CFA/kWh.", r:"Sert à comparer des filières de production de durées de vie et de profils de coûts différents."},
   en:{t:"LCOE — levelised cost of energy", d:"Constant kWh price that exactly balances the project's discounted cost (zero NPV).", f:"LCOE = [I₀ + Σ C_n/(1+d)^n] / [Σ E_n/(1+d)^n]", v:"Utility PV in the Sahel: roughly 0.04–0.07 €/kWh; diesel often above 0.25 €/kWh.", r:"Used to compare technologies with different lifetimes and cost profiles."}},
  {k:["CAPEX"], ke:["CAPEX"], cs:true,
   fr:{t:"CAPEX — dépenses d'investissement", d:"Coûts d'achat et d'installation initiaux (équipements, génie civil, raccordement, études)."},
   en:{t:"CAPEX — capital expenditure", d:"Initial purchase and installation costs (equipment, civil works, connection, studies)."}},
  {k:["OPEX"], ke:["OPEX"], cs:true,
   fr:{t:"OPEX — dépenses d'exploitation", d:"Coûts annuels d'exploitation et d'entretien : maintenance, carburant, assurances, personnel, location."},
   en:{t:"OPEX — operating expenditure", d:"Annual operating and maintenance costs: maintenance, fuel, insurance, staff, rent."}},
  {k:["facteur d'actualisation"], ke:["discount factor"],
   fr:{t:"Facteur d'actualisation", d:"Coefficient par lequel on multiplie un flux de l'année n pour obtenir sa valeur actuelle.", f:"FA_n = 1 / (1 + a)^n"},
   en:{t:"Discount factor", d:"Coefficient applied to a year-n cash flow to obtain its present value.", f:"DF_n = 1 / (1 + d)^n"}},
  {k:["annuité","facteur de récupération du capital"], ke:["annuity","capital recovery factor"],
   fr:{t:"Annuité — facteur de récupération du capital", d:"Montant constant annuel équivalent à un investissement I₀ sur N ans au taux a.", f:"A = I₀ · a / [1 − (1 + a)^−N]"},
   en:{t:"Annuity — capital recovery factor", d:"Constant annual amount equivalent to an investment I₀ over N years at rate d.", f:"A = I₀ · d / [1 − (1 + d)^−N]"}}
  ];

  // ------------------------------------------------------------------ index des formes
  var forms = [];          // {re: forme, cs: casse, e: entrée}
  G.forEach(function(e){
    // sigles (aucune minuscule, ou au moins deux majuscules sans espace : RoCoF, SoC, OpenADR) : casse respectée
    (EN ? e.ke : e.k || []).forEach(function(f){
      if(!f) return;
      var up = (f.match(/[A-Z]/g) || []).length, low = /[a-zà-ÿ]/.test(f);
      forms.push({f: f, cs: !low || (up >= 2 && !/\s/.test(f)), e: e});
    });
  });
  forms.sort(function(a, b){ return b.f.length - a.f.length; });
  var esc = function(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/'/g, "['’]"); };
  var lookup = {};
  forms.forEach(function(x){ lookup[x.cs ? "S:" + x.f : "I:" + x.f.toLowerCase().replace(/’/g, "'")] = x.e; });
  var csList = forms.filter(function(x){ return x.cs; }).map(function(x){ return esc(x.f); });
  var ciList = forms.filter(function(x){ return !x.cs; }).map(function(x){ return esc(x.f); });
  var L = "A-Za-z0-9\\u00C0-\\u024F";            // lettres (accents compris) : limites de mot
  var reCs, reCi;
  try{
    reCs = csList.length ? new RegExp("(^|[^" + L + "_])(" + csList.join("|") + ")(?![" + L + "_])", "g") : null;
    reCi = ciList.length ? new RegExp("(^|[^" + L + "_])(" + ciList.join("|") + ")(?![" + L + "_])", "gi") : null;
  }catch(err){ return; }

  var SKIP = {SCRIPT:1, STYLE:1, CODE:1, PRE:1, A:1, BUTTON:1, INPUT:1, TEXTAREA:1, SELECT:1, OPTION:1, SVG:1, H1:1, KBD:1, TITLE:1, LABEL:1, CANVAS:1, MATH:1};
  function skip(el){
    for(var p = el; p && p !== document.body; p = p.parentNode){
      if(p.nodeType !== 1) continue;
      if(SKIP[p.nodeName.toUpperCase()]) return true;
      if(p.classList && (p.classList.contains("gl") || p.classList.contains("no-gl") || p.classList.contains("calc") || p.id === "gl-tip")) return true;
      if(p.getAttribute && p.getAttribute("contenteditable") === "true") return true;
    }
    return false;
  }
  function entryFor(text){
    return lookup["S:" + text] || lookup["I:" + text.toLowerCase().replace(/’/g, "'")] || null;
  }
  function matches(s){
    var out = [];
    [reCs, reCi].forEach(function(re){
      if(!re) return;
      re.lastIndex = 0;
      var m;
      while((m = re.exec(s)) !== null){
        var start = m.index + m[1].length, txt = m[2];
        out.push({s: start, e: start + txt.length, t: txt});
        if(re.lastIndex === m.index) re.lastIndex++;
        else re.lastIndex = start + txt.length;
      }
    });
    out.sort(function(a, b){ return a.s - b.s || (b.e - b.s) - (a.e - a.s); });
    var res = [], end = -1;
    out.forEach(function(x){ if(x.s >= end && entryFor(x.t)){ res.push(x); end = x.e; } });
    return res;
  }
  var ids = new Map(), n = 0;
  function idOf(e){ if(!ids.has(e)) ids.set(e, "g" + (n++)); return ids.get(e); }
  var byId = {};
  function wrap(root){
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var nodes = [], t;
    while((t = walker.nextNode())) if(t.nodeValue && t.nodeValue.trim().length > 1) nodes.push(t);
    nodes.forEach(function(node){
      if(!node.parentNode || skip(node.parentNode)) return;
      var s = node.nodeValue, ms = matches(s);
      if(!ms.length) return;
      var frag = document.createDocumentFragment(), pos = 0;
      ms.forEach(function(m){
        if(m.s > pos) frag.appendChild(document.createTextNode(s.slice(pos, m.s)));
        var e = entryFor(m.t), id = idOf(e);
        byId[id] = e;
        var span = document.createElement("span");
        span.className = "gl";
        span.tabIndex = 0;
        span.setAttribute("data-gl", id);
        span.setAttribute("role", "term");
        span.setAttribute("aria-describedby", "gl-tip");
        span.textContent = m.t;
        frag.appendChild(span);
        pos = m.e;
      });
      if(pos < s.length) frag.appendChild(document.createTextNode(s.slice(pos)));
      node.parentNode.replaceChild(frag, node);
    });
  }

  // ------------------------------------------------------------------ info-bulle
  var tip, cur = null, hideTimer = null;
  function css(){
    var st = document.createElement("style");
    st.textContent =
      ".gl{border-bottom:1px dotted currentColor;cursor:help;text-decoration:none}" +
      ".gl:hover,.gl:focus{background:rgba(255,196,0,.22);outline:none;border-bottom-style:solid}" +
      "#gl-tip{position:absolute;z-index:9999;max-width:min(440px,92vw);padding:11px 13px 10px;border-radius:9px;" +
      "background:#fffdf6;color:#1d2733;border:1px solid #d9c48a;box-shadow:0 8px 26px rgba(0,0,0,.18);" +
      "font:13.5px/1.45 'IBM Plex Sans',system-ui,-apple-system,'Segoe UI',sans-serif;display:none}" +
      "#gl-tip .gt{font-weight:600;font-size:14px;margin-bottom:4px;color:#7a4b00}" +
      "#gl-tip .gf{font-family:'IBM Plex Mono',ui-monospace,Menlo,monospace;font-size:12.5px;background:#f4efe1;border-radius:5px;padding:4px 7px;margin:6px 0;white-space:normal}" +
      "#gl-tip .gk{font-weight:600}#gl-tip p{margin:4px 0}" +
      "@media (prefers-color-scheme: dark){#gl-tip{background:#22272e;color:#e6edf3;border-color:#6b5a2e}#gl-tip .gt{color:#f0c060}#gl-tip .gf{background:#2d333b}}";
    document.head.appendChild(st);
  }
  function h(s){ return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function fill(e){
    var x = EN ? e.en : e.fr, lab = EN ? {f: "Formula", v: "Typical values", r: "Why it matters", s: "Standards / see also"}
                                       : {f: "Formule", v: "Valeurs usuelles", r: "Rôle et enjeux", s: "Normes / voir aussi"};
    var o = "<div class='gt'>" + h(x.t) + "</div><p>" + h(x.d) + "</p>";
    if(x.f) o += "<div class='gf'>" + h(x.f) + "</div>";
    if(x.v) o += "<p><span class='gk'>" + lab.v + " : </span>" + h(x.v) + "</p>";
    if(x.r) o += "<p><span class='gk'>" + lab.r + " : </span>" + h(x.r) + "</p>";
    if(x.s) o += "<p><span class='gk'>" + lab.s + " : </span>" + h(x.s) + "</p>";
    if(EN) o = o.replace(/ : <\/span>/g, ": </span>");
    tip.innerHTML = o;
  }
  function show(span){
    var e = byId[span.getAttribute("data-gl")];
    if(!e) return;
    clearTimeout(hideTimer);
    cur = span;
    fill(e);
    tip.style.display = "block";
    var r = span.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
    var x = r.left + window.scrollX, y = r.bottom + window.scrollY + 6;
    var maxX = window.scrollX + document.documentElement.clientWidth - tw - 8;
    if(x > maxX) x = Math.max(window.scrollX + 8, maxX);
    if(r.bottom + th + 12 > window.innerHeight && r.top > th + 12) y = r.top + window.scrollY - th - 6;
    tip.style.left = x + "px";
    tip.style.top = y + "px";
  }
  function hide(){ hideTimer = setTimeout(function(){ tip.style.display = "none"; cur = null; }, 120); }
  function init(){
    css();
    tip = document.createElement("div");
    tip.id = "gl-tip";
    tip.setAttribute("role", "tooltip");
    document.body.appendChild(tip);
    tip.addEventListener("mouseenter", function(){ clearTimeout(hideTimer); });
    tip.addEventListener("mouseleave", hide);
    wrap(document.querySelector("main") || document.body);
    document.addEventListener("mouseover", function(ev){ var s = ev.target.closest && ev.target.closest(".gl"); if(s) show(s); });
    document.addEventListener("mouseout", function(ev){ var s = ev.target.closest && ev.target.closest(".gl"); if(s) hide(); });
    document.addEventListener("focusin", function(ev){ if(ev.target.classList && ev.target.classList.contains("gl")) show(ev.target); });
    document.addEventListener("focusout", function(ev){ if(ev.target.classList && ev.target.classList.contains("gl")) hide(); });
    document.addEventListener("click", function(ev){
      var s = ev.target.closest && ev.target.closest(".gl");
      if(s){ if(cur === s && tip.style.display === "block") hide(); else show(s); }
      else if(!(ev.target.closest && ev.target.closest("#gl-tip"))) { tip.style.display = "none"; cur = null; }
    });
    document.addEventListener("keydown", function(ev){ if(ev.key === "Escape"){ tip.style.display = "none"; cur = null; } });
    // contenu ajouté plus tard (calculatrices, QCM, exercices dynamiques) : traité à son apparition
    if(window.MutationObserver){
      var busy = false;
      new MutationObserver(function(list){
        if(busy) return;
        busy = true;
        list.forEach(function(m){ m.addedNodes.forEach(function(nd){
          if(nd.nodeType === 1 && !skip(nd) && nd.id !== "gl-tip" && !(nd.classList && nd.classList.contains("gl"))) wrap(nd);
        }); });
        busy = false;
      }).observe(document.querySelector("main") || document.body, {childList: true, subtree: true});
    }
  }
  window.NRJXpertGlossary = {count: G.length, entries: G};
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
