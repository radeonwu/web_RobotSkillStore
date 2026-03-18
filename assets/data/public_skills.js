// Auto-generated from public_skills.json — do not edit manually
// RSS Platform v1.1.0 — 74 industrial + 6 companion skills across 9 categories
// Generated: 2026-03-18
window.RSS_STATIC_SKILLS = [
  {
    "skill_id": "press_fit_bearing",
    "name": "Press-Fit Bearing",
    "category": "Assembly",
    "subcategory": "",
    "maturity": "beta",
    "description": "Uses force-controlled linear insertion to press a bearing into a housing. Monitors insertion force profile for correct seating. Supports H7/p6 and H7/r6 fits on shafts 8–80 mm. Compatible with UR e-Series and KUKA iiwa via FT sensor.",
    "latest_version": "1.0.0",
    "robots": [
      "UR10e",
      "UR5e",
      "KUKA_iiwa7"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "peg_in_hole",
    "name": "Peg-in-Hole Insertion",
    "category": "Assembly",
    "subcategory": "",
    "maturity": "stable",
    "description": "Classic peg-in-hole task with active compliance. Uses spiral search or RRT-based contact strategy to handle positional uncertainty up to ±2 mm. Suitable for clearance fits 0.01–0.1 mm. Widely used in connector and shaft assembly.",
    "latest_version": "1.0.0",
    "robots": [
      "UR5e",
      "UR10e",
      "KUKA_iiwa7",
      "ABB_IRB1200"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "snap_fit_connector",
    "name": "Snap-Fit Connector Assembly",
    "category": "Assembly",
    "subcategory": "",
    "maturity": "beta",
    "description": "Detects engagement via force-drop signature characteristic of snap-fit geometry. Suitable for plastic connectors, automotive clips, and PCB latches. Configurable engagement force threshold and depth check.",
    "latest_version": "1.0.0",
    "robots": [
      "UR5e",
      "UR10e",
      "Fanuc_LRMate200iD"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "nut_run",
    "name": "Nut Running",
    "category": "Assembly",
    "subcategory": "",
    "maturity": "stable",
    "description": "Runs a nut down a bolt thread using a nut-runner end effector. Applies a two-stage strategy: fast rundown at low torque, then final tightening to target torque. Verifies final torque against min/max band. Suitable for M4–M20 fasteners.",
    "latest_version": "1.0.0",
    "robots": [
      "UR10e",
      "UR16e",
      "KUKA_KR10"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "torque_verify",
    "name": "Fastener Torque Verification",
    "category": "Assembly",
    "subcategory": "",
    "maturity": "stable",
    "description": "Non-destructive torque audit using FT-sensor-equipped robot. Applies a small incremental angle and measures breakaway torque to confirm it is ≥ target. Used as a quality gate after nut_run or tighten_screw.",
    "latest_version": "1.0.0",
    "robots": [
      "UR5e",
      "UR10e",
      "KUKA_iiwa7"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "apply_threadlocker",
    "name": "Apply Threadlocker",
    "category": "Assembly",
    "subcategory": "",
    "maturity": "alpha",
    "description": "Dispenses a calibrated volume of threadlocker compound onto a fastener thread prior to assembly. Maintains precise tip standoff and applies controlled dispensing pressure. Prevents fastener loosening in vibration environments.",
    "latest_version": "1.0.0",
    "robots": [
      "UR5e",
      "UR10e"
    ],
    "robots_supported": 2
  },
  {
    "skill_id": "rivet_install",
    "name": "Blind Rivet Installation",
    "category": "Assembly",
    "subcategory": "",
    "maturity": "beta",
    "description": "Feeds a blind rivet, aligns with hole, inserts mandrel, and applies pull force to set the rivet. Detects mandrel break via force-drop signature. Used in automotive and aerospace sheet metal joining. Compatible with Avdel/Stanley Engineered tooling.",
    "latest_version": "1.0.0",
    "robots": [
      "UR10e",
      "UR16e",
      "Fanuc_M20iA"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "pick_with_vision",
    "name": "Vision-Guided Pick",
    "category": "Manipulation",
    "subcategory": "",
    "maturity": "stable",
    "description": "Detects object pose via 2.5D depth camera or structured light, selects an antipodal grasp candidate, and executes a pick approach. Handles pose uncertainty ±5 mm / ±5°. Uses MoveIt2 task constructor or similar for collision-aware reach planning.",
    "latest_version": "1.0.0",
    "robots": [
      "UR5e",
      "UR10e",
      "ABB_IRB1200",
      "Fanuc_LRMate200iD"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "place_on_fixture",
    "name": "Precision Place on Fixture",
    "category": "Manipulation",
    "subcategory": "",
    "maturity": "stable",
    "description": "Performs a compliant place-into-fixture motion. Uses force sensing to detect seating and confirm part is resting on datum surfaces. Optional pin-finding spiral if fixture has locating pins.",
    "latest_version": "1.0.0",
    "robots": [
      "UR5e",
      "UR10e",
      "ABB_IRB1200"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "bin_pick",
    "name": "Bin Picking (Unstructured)",
    "category": "Manipulation",
    "subcategory": "",
    "maturity": "beta",
    "description": "Acquires a 3D scan of bin contents, segments and matches part models in the point cloud, ranks grasp candidates by accessibility and stability, and executes the best pick. Handles occlusion and near-boundary parts. Integrates with Pickit3D / Photoneo / Roboception vision systems.",
    "latest_version": "1.0.0",
    "robots": [
      "UR10e",
      "UR16e",
      "Fanuc_M10iA",
      "KUKA_KR10"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "pallet_stack",
    "name": "Pallet Layer Stacking",
    "category": "Manipulation",
    "subcategory": "",
    "maturity": "stable",
    "description": "Executes a palletizing pattern from a layout specification (row × col × layers). Computes each stack position from pallet origin, part dimensions, and layer offset. Handles slip-sheet insertion between layers when configured.",
    "latest_version": "1.0.0",
    "robots": [
      "UR16e",
      "UR20",
      "Fanuc_M20iA",
      "KUKA_KR20"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "pallet_unstack",
    "name": "Pallet Layer Unstacking / Depalletizing",
    "category": "Manipulation",
    "subcategory": "",
    "maturity": "stable",
    "description": "Inverse of pallet_stack. Reads current layer index, computes pick position, picks and transfers to output conveyor or buffer. Uses top-layer detection via 2D laser or ultrasonic to handle imprecise stack heights.",
    "latest_version": "1.0.0",
    "robots": [
      "UR16e",
      "UR20",
      "Fanuc_M20iA"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "conveyor_transfer",
    "name": "Conveyor Transfer",
    "category": "Manipulation",
    "subcategory": "",
    "maturity": "beta",
    "description": "Supports both static-stop (conveyor stops for pick) and dynamic-tracking modes (encoder-based belt tracking). Interfaces with conveyor PLC for belt velocity and stop/start signals via ROS2 hardware_interface.",
    "latest_version": "1.0.0",
    "robots": [
      "UR10e",
      "UR16e",
      "ABB_IRB2400"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "surface_inspect_2d",
    "name": "2D Surface Defect Inspection",
    "category": "Inspection",
    "subcategory": "",
    "maturity": "stable",
    "description": "Positions camera at programmed standoff and captures image(s) for defect detection. Supports halogen ring-light, coaxial, and structured-light illumination. Defect classification via OpenCV blob analysis or a pre-trained CNN model. Returns pass/fail verdict and defect map.",
    "latest_version": "1.0.0",
    "robots": [
      "UR5e",
      "UR10e",
      "ABB_IRB1200"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "dimension_measure",
    "name": "Dimension Measurement",
    "category": "Inspection",
    "subcategory": "",
    "maturity": "beta",
    "description": "Sweeps probe or laser across measurement features to compute dimensions. Supports Renishaw RMP40 touch probe, Keyence LK-H series laser, and ATI Axia FT-based contact. Reports measured value vs. nominal with tolerance band verdict.",
    "latest_version": "1.0.0",
    "robots": [
      "UR5e",
      "UR10e",
      "ABB_IRB1200"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "barcode_scan",
    "name": "Barcode / QR Code Scan",
    "category": "Inspection",
    "subcategory": "",
    "maturity": "stable",
    "description": "Positions camera at optimal standoff and angle, triggers scan, and decodes 1D (Code128, Code39, EAN13) or 2D (QR, DataMatrix, Aztec) symbols. Returns decoded string and confidence. Can trigger part routing decisions.",
    "latest_version": "1.0.0",
    "robots": [
      "UR5e",
      "UR10e"
    ],
    "robots_supported": 2
  },
  {
    "skill_id": "presence_check",
    "name": "Part Presence Check",
    "category": "Inspection",
    "subcategory": "",
    "maturity": "stable",
    "description": "Binary presence/absence check using a 2D camera, laser distance sensor, or proximity sensor at a programmed standoff. Returns PRESENT/ABSENT verdict with confidence. Often used as a pre-condition gate before assembly operations.",
    "latest_version": "1.0.0",
    "robots": [
      "UR5e",
      "UR10e"
    ],
    "robots_supported": 2
  },
  {
    "skill_id": "profile_scan_3d",
    "name": "3D Laser Profile Scan",
    "category": "Inspection",
    "subcategory": "",
    "maturity": "beta",
    "description": "Sweeps a Keyence LJ-X8000 or Cognex DS1300 laser profilometer over the part surface at constant velocity to build a dense 3D point cloud. Fits the cloud to the nominal CAD model to compute surface deviation map, flatness, step heights, and weld bead geometry. Integrates with ROS2 point_cloud_transport.",
    "latest_version": "1.0.0",
    "robots": [
      "UR10e",
      "ABB_IRB2400"
    ],
    "robots_supported": 2
  },
  {
    "skill_id": "load_cnc_part",
    "name": "CNC Machine Part Loading",
    "category": "Machine Tending",
    "subcategory": "",
    "maturity": "stable",
    "description": "Opens CNC machine door, presents part to chuck/fixture, triggers clamping, confirms clamp signal, and closes door. Interfaces with CNC controller via FOCAS2 or MTConnect protocol. Validates clamp confirmation before door close. Part of a typical load→machine→unload→inspect cycle.",
    "latest_version": "1.0.0",
    "robots": [
      "UR10e",
      "UR16e",
      "Fanuc_LRMate200iD"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "unload_cnc_part",
    "name": "CNC Machine Part Unloading",
    "category": "Machine Tending",
    "subcategory": "",
    "maturity": "stable",
    "description": "Opens door, waits for spindle stop and coolant drain, triggers chuck unclamp, picks finished part, and hands off to inspection or conveyor. Detects chip/swarf on part via vision if configured.",
    "latest_version": "1.0.0",
    "robots": [
      "UR10e",
      "UR16e",
      "Fanuc_LRMate200iD"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "door_open_machine",
    "name": "Open Machine Door / Guard",
    "category": "Machine Tending",
    "subcategory": "",
    "maturity": "stable",
    "description": "Executes programmed door-open trajectory (slide, rotate, or push). Monitors door-open sensor for confirmation within timeout. Respects safety interlocks — only opens when machine is in safe state (spindle off, axis park).",
    "latest_version": "1.0.0",
    "robots": [
      "UR5e",
      "UR10e",
      "Fanuc_LRMate200iD"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "door_close_machine",
    "name": "Close Machine Door / Guard",
    "category": "Machine Tending",
    "subcategory": "",
    "maturity": "stable",
    "description": "Executes door-close trajectory (slide, rotate, or push to latch). Confirms door-closed and latched state from machine IO before releasing. Prevents machine cycle start until close is confirmed.",
    "latest_version": "1.0.0",
    "robots": [
      "UR5e",
      "UR10e"
    ],
    "robots_supported": 2
  },
  {
    "skill_id": "apply_adhesive_bead",
    "name": "Apply Adhesive Bead",
    "category": "Dispensing",
    "subcategory": "",
    "maturity": "beta",
    "description": "Follows a Cartesian path at constant TCP speed while maintaining dispenser pressure to deposit a consistent adhesive bead. Supports time-pressure and gear-pump dispense systems (Nordson EFD, Fisnar). Monitors bead with inline laser profilometer for closed-loop width control.",
    "latest_version": "1.0.0",
    "robots": [
      "UR5e",
      "UR10e"
    ],
    "robots_supported": 2
  },
  {
    "skill_id": "apply_sealant_bead",
    "name": "Apply Sealant Bead",
    "category": "Dispensing",
    "subcategory": "",
    "maturity": "beta",
    "description": "Similar to adhesive_bead but optimised for high-viscosity sealants. Supports screw-pump and time-pressure systems. Path following maintains constant standoff for consistent bead cross-section. Used in automotive body sealing and electronic enclosure gasket application.",
    "latest_version": "1.0.0",
    "robots": [
      "UR10e",
      "ABB_IRB2400"
    ],
    "robots_supported": 2
  },
  {
    "skill_id": "dispense_fluid_shot",
    "name": "Dispense Metered Fluid Shot",
    "category": "Dispensing",
    "subcategory": "",
    "maturity": "alpha",
    "description": "Moves to dispense pose, triggers valve open for calibrated duration, closes valve. Supports time-pressure and positive-displacement systems. Verifies dispensed volume via weight check or vision if configured. Used for lubrication, flux application, and precision drop dispensing.",
    "latest_version": "1.0.0",
    "robots": [
      "UR5e"
    ],
    "robots_supported": 1
  },
  {
    "skill_id": "spray_coat_surface",
    "name": "Spray Coat Surface",
    "category": "Dispensing",
    "subcategory": "",
    "maturity": "beta",
    "description": "Executes a raster or contour spray path at constant standoff and TCP speed. Maintains atomisation air and fluid pressure for even coverage. Supports electrostatic spray guns (Graco, ITW Ransburg) and conventional HVLP guns. Path density controlled by overlap percentage parameter.",
    "latest_version": "1.0.0",
    "robots": [
      "UR10e",
      "ABB_IRB2400",
      "Fanuc_P250"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "spot_weld",
    "name": "Resistance Spot Welding",
    "category": "Welding",
    "subcategory": "",
    "maturity": "beta",
    "description": "Positions weld gun electrodes, applies clamp force, triggers weld current pulse (schedule-based), releases, and confirms nugget quality via current/voltage monitoring. Interfaces with Bosch, Entron, or ARO weld controllers over DeviceNet/Profibus. Supports single and multi-pulse schedules per AWS D8.1.",
    "latest_version": "1.0.0",
    "robots": [
      "UR16e",
      "Fanuc_R2000iB",
      "KUKA_KR200"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "seam_weld_arc",
    "name": "Arc Seam Weld Segment",
    "category": "Welding",
    "subcategory": "",
    "maturity": "beta",
    "description": "Follows a programmed seam path at constant travel speed while maintaining arc via Fronius CMT, Lincoln Electric Powerwave, or ESAB Aristo weld source. Uses through-arc seam tracking (TAST) or laser seam finder for path correction. Supports multi-pass welds via layer offset parameter. Compliant with AWS D1.1.",
    "latest_version": "1.0.0",
    "robots": [
      "UR10e",
      "ABB_IRB2400",
      "Fanuc_ARC_Mate_100iD"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "deburr_edge",
    "name": "Automated Edge Deburring",
    "category": "Finishing",
    "subcategory": "",
    "maturity": "beta",
    "description": "Follows edge path with a pneumatic or electric deburring spindle (ATI Compliant Deburring Tool, Cogsdill). Uses force-controlled compliance to maintain consistent contact along irregular edges. Removes ISO grade N8–N12 burrs. Programmable chamfer depth via force set-point.",
    "latest_version": "1.0.0",
    "robots": [
      "UR10e",
      "UR5e",
      "ABB_IRB2400"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "polish_surface",
    "name": "Surface Polishing",
    "category": "Finishing",
    "subcategory": "",
    "maturity": "alpha",
    "description": "Performs multi-pass raster or contour polishing with constant contact force. Supports dry and wet polishing, abrasive pad and felt bob media. Monitors contact force via FT sensor to maintain consistent material removal rate. Compliance frame absorbs surface waviness ±3 mm. Used in aerospace and mould finishing.",
    "latest_version": "1.0.0",
    "robots": [
      "UR10e",
      "ABB_IRB2400"
    ],
    "robots_supported": 2
  },
  {
    "skill_id": "screw_drive",
    "name": "Automated Screwdriving",
    "category": "Assembly",
    "subcategory": "",
    "maturity": "stable",
    "description": "Drives slotted, cross-head, or hex-socket fasteners fed via automatic screw feeder. Uses force/torque sensing to detect cam-out, missed drive, and target torque. Distinct from nut_run (hex nuts) and torque_verify (verification only). Compatible with Robotiq Screwdriving Solution and Estic high-torque units.",
    "latest_version": "1.0.0",
    "robots": [
      "UR3e",
      "UR5e",
      "UR16e",
      "Dobot_CR5",
      "Dobot_CR7",
      "ABB_GoFa",
      "FANUC_CRX10iA"
    ],
    "robots_supported": 7
  },
  {
    "skill_id": "wiring_harness_insert",
    "name": "Wiring Harness Connector Insertion",
    "category": "Assembly",
    "subcategory": "",
    "maturity": "stable",
    "description": "Picks a wired plug or connector and inserts it into a mating socket using force-guided insertion with active compliance. Detects successful seating via force-feedback click signature or vision confirmation. Common in automotive wiring harness and industrial panel assembly.",
    "latest_version": "1.0.0",
    "robots": [
      "FANUC_CRX10iA",
      "FANUC_CRX25iA",
      "UR10e",
      "UR16e"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "gasket_install",
    "name": "Gasket / O-Ring Installation",
    "category": "Assembly",
    "subcategory": "",
    "maturity": "stable",
    "description": "Places a pre-formed gasket or O-ring into a seating groove or flange surface, then presses it flush using controlled contact force to achieve a proper seal without deformation or roll-out. Used in automotive fluid systems, pneumatic enclosures, and industrial valves.",
    "latest_version": "1.0.0",
    "robots": [
      "FANUC_CRX10iA",
      "UR10e",
      "ABB_GoFa",
      "ABB_SWIFTI"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "insert_overmold",
    "name": "Injection Mold Insert Loading",
    "category": "Assembly",
    "subcategory": "",
    "maturity": "stable",
    "description": "Picks a threaded bushing, pin, or clip and places it into an open injection mold cavity with vision-guided precision before the mold closes for insert overmolding. Must complete placement within the mold-open cycle window. Used in automotive, electronics, and consumer product manufacturing.",
    "latest_version": "1.0.0",
    "robots": [
      "FANUC_CRX10iA",
      "FANUC_M10iD",
      "UR10e",
      "UR16e"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "label_apply",
    "name": "Label Application",
    "category": "Assembly",
    "subcategory": "",
    "maturity": "stable",
    "description": "Picks a printed label from a dispenser and applies it to a product surface with precise alignment and controlled pressure, vision-guided for placement accuracy. Supports barcode, QR code, and regulatory labels. Common in food/beverage, pharmaceutical, and electronics packaging lines.",
    "latest_version": "1.0.0",
    "robots": [
      "UR5e",
      "UR10e",
      "Dobot_CR5"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "sprue_remove",
    "name": "Sprue / Runner Removal",
    "category": "Machine Tending",
    "subcategory": "",
    "maturity": "stable",
    "description": "After mold ejection, the robot grips and removes the sprue or runner system from the molded part, depositing it in a regrind bin. Typically executed immediately after mold open within the cycle window. Used across thermoplastic and thermoset injection molding cells.",
    "latest_version": "1.0.0",
    "robots": [
      "FANUC_CRX10iA",
      "FANUC_LRMate200iD",
      "UR10e"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "load_press_part",
    "name": "Press Loading / Unloading",
    "category": "Machine Tending",
    "subcategory": "",
    "maturity": "stable",
    "description": "Picks a workpiece from an infeed conveyor or fixture and loads it into the die of a hydraulic or mechanical stamping press, then unloads the formed part after the press cycle completes. Requires interlocked press safety signals. Used in metal forming and stamping.",
    "latest_version": "1.0.0",
    "robots": [
      "FANUC_CRX25iA",
      "FANUC_M10iD",
      "UR16e",
      "UR20",
      "ABB_IRB2600"
    ],
    "robots_supported": 5
  },
  {
    "skill_id": "part_clean_blow_off",
    "name": "Part Cleaning / Blow-Off",
    "category": "Machine Tending",
    "subcategory": "",
    "maturity": "stable",
    "description": "After machining or molding, the robot presents a part to a fixed air nozzle or moves a robot-mounted air knife across the part surface to remove chips, coolant, and debris before downstream inspection or assembly. Reduces contamination in automated manufacturing lines.",
    "latest_version": "1.0.0",
    "robots": [
      "FANUC_CRX10iA",
      "UR10e",
      "Dobot_CR5"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "end_of_line_functional_test",
    "name": "End-of-Line Functional Test",
    "category": "Inspection",
    "subcategory": "",
    "maturity": "beta",
    "description": "Activates buttons, switches, connectors, or ports on a finished product to verify electrical and mechanical function, logging pass/fail results against specifications. Uses force sensing to detect actuation depth and resistance. Common in consumer electronics, automotive controls, and industrial panel assembly.",
    "latest_version": "1.0.0",
    "robots": [
      "UR5e",
      "UR10e",
      "Dobot_MG400",
      "ABB_GoFa"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "vision_measure_3d",
    "name": "3D Vision Dimensional Measurement",
    "category": "Inspection",
    "subcategory": "",
    "maturity": "beta",
    "description": "Uses a robot-mounted structured-light or stereo 3D camera to acquire point clouds of a part from multiple angles and compares them against a CAD nominal to detect shape deviations, warpage, or missing features. Complements profile_scan_3d with full-surface CAD comparison capability.",
    "latest_version": "1.0.0",
    "robots": [
      "ABB_GoFa",
      "UR10e",
      "UR16e",
      "FANUC_CRX10iA"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "liquid_pipette",
    "name": "Liquid Pipetting",
    "category": "Inspection",
    "subcategory": "",
    "maturity": "stable",
    "description": "Aspirates and dispenses precise volumes of liquid into wells, vials, or reaction vessels using a robot-mounted pipette or liquid handler, maintaining repeatability for analytical and diagnostic workflows. Used in pharmaceutical QC, life science research, and food safety labs.",
    "latest_version": "1.0.0",
    "robots": [
      "ABB_GoFa",
      "UR3e",
      "UR5e"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "potting_encapsulate",
    "name": "Potting / Encapsulation",
    "category": "Dispensing",
    "subcategory": "",
    "maturity": "stable",
    "description": "Dispenses a two-part epoxy or polyurethane potting compound into an electronic enclosure or connector cavity to protect components from moisture, vibration, and thermal stress. Uses metered mix ratio control and path planning for void-free fill. Common in automotive ECU, power electronics, and industrial sensor manufacturing.",
    "latest_version": "1.0.0",
    "robots": [
      "FANUC_M10iD",
      "UR10e",
      "UR16e",
      "ABB_IRB2600"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "conformal_coat",
    "name": "Conformal Coating",
    "category": "Dispensing",
    "subcategory": "",
    "maturity": "stable",
    "description": "Applies a thin, uniform conformal coating (acrylic, silicone, or urethane) to a PCB surface following a programmed path, masking sensitive components and leaving edge connectors clear. Uses selective spray or needle dispense for precise coverage control.",
    "latest_version": "1.0.0",
    "robots": [
      "UR10e",
      "UR16e",
      "FANUC_LRMate200iD",
      "Dobot_CR5"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "form_in_place_gasket",
    "name": "Form-In-Place Gasket Dispensing",
    "category": "Dispensing",
    "subcategory": "",
    "maturity": "stable",
    "description": "Extrudes a continuous bead of liquid silicone or polyurethane foam directly onto a flange or mating surface to form an in-place gasket, replacing pre-cut gaskets. Path accuracy and bead width consistency are critical for sealing performance. Common in automotive transmission covers, enclosures, and HVAC assemblies.",
    "latest_version": "1.0.0",
    "robots": [
      "FANUC_M20iD",
      "UR16e",
      "ABB_IRB2400"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "tig_weld",
    "name": "TIG Welding",
    "category": "Welding",
    "subcategory": "",
    "maturity": "stable",
    "description": "Performs Tungsten Inert Gas (TIG/GTAW) welding along a programmed path for high-quality, low-spatter welds on stainless steel, aluminum, or thin-gauge materials. Uses through-arc seam tracking for joint following. Preferred over MIG/MAG for cosmetic and high-purity welds.",
    "latest_version": "1.0.0",
    "robots": [
      "FANUC_CRX10iA",
      "ABB_IRB1520ID",
      "UR10e"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "friction_stir_weld",
    "name": "Friction Stir Welding",
    "category": "Welding",
    "subcategory": "",
    "maturity": "beta",
    "description": "Joins aluminum or other non-ferrous panels by plunging a rotating FSW tool along the joint line, producing a solid-state bond with no melting. Used for EV battery trays, aerospace panels, and structural aluminum assemblies. Requires high axial forces; typically performed by large-payload robots.",
    "latest_version": "1.0.0",
    "robots": [
      "ABB_IRB7720"
    ],
    "robots_supported": 1
  },
  {
    "skill_id": "sand_surface",
    "name": "Robotic Sanding",
    "category": "Finishing",
    "subcategory": "",
    "maturity": "stable",
    "description": "Moves an active-contact sanding head over a workpiece surface with force-controlled compliance to achieve consistent stock removal across flat or contoured areas. Distinct from polish_surface (fine Ra finishing); sanding targets coarse stock removal and surface preparation before painting or coating.",
    "latest_version": "1.0.0",
    "robots": [
      "UR10e",
      "UR16e",
      "ABB_GoFa",
      "FANUC_CRX10iA"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "laser_mark_engrave",
    "name": "Laser Marking / Engraving",
    "category": "Finishing",
    "subcategory": "",
    "maturity": "stable",
    "description": "Moves a robot-mounted laser marking head over a workpiece to etch serial numbers, data matrix codes, logos, or traceability marks onto metal, plastic, or ceramic surfaces. Robot positioning enables marking on curved or angled surfaces not reachable by fixed laser stations.",
    "latest_version": "1.0.0",
    "robots": [
      "FANUC_CRX10iA",
      "ABB_IRB4400",
      "UR10e"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "case_erect_seal",
    "name": "Case Erecting and Sealing",
    "category": "Packaging",
    "subcategory": "",
    "maturity": "stable",
    "description": "Picks a flat corrugated blank, folds and erects it into a box, and applies tape or hot-melt adhesive to seal the bottom flaps, ready for product loading. Used in e-commerce fulfilment, food and beverage, and consumer goods packaging lines.",
    "latest_version": "1.0.0",
    "robots": [
      "UR10e",
      "UR20",
      "ABB_SWIFTI"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "kitting_assemble_tray",
    "name": "Kit Assembly / Tray Loading",
    "category": "Packaging",
    "subcategory": "",
    "maturity": "stable",
    "description": "Picks multiple different part types in a defined sequence and places each into designated positions within a kit tray or shipper, supporting mixed-SKU fulfilment or assembly kitting. Vision-guided pick with tray map verification ensures correct kit composition.",
    "latest_version": "1.0.0",
    "robots": [
      "ABB_SWIFTI",
      "ABB_GoFa",
      "UR10e",
      "UR16e",
      "FANUC_CRX10iA"
    ],
    "robots_supported": 5
  },
  {
    "skill_id": "plasma_weld",
    "name": "Plasma Welding",
    "category": "Welding",
    "subcategory": "",
    "maturity": "stable",
    "description": "Performs plasma arc welding (PAW/GPAW) along a programmed path using a constricted plasma torch, producing high-energy-density welds with a narrow heat-affected zone. Suitable for stainless steel, titanium, and thin-gauge materials requiring precision not achievable with standard MIG/TIG.",
    "latest_version": "1.0.0",
    "robots": [
      "Dobot_CR5",
      "Dobot_CR7",
      "FANUC_ARC_Mate100iD",
      "ABB_IRB1520ID"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "solder_joint",
    "name": "Robotic Soldering",
    "category": "Welding",
    "subcategory": "",
    "maturity": "stable",
    "description": "Solders PCB through-hole joints, surface-mount pads, or wire terminations using a robot-mounted soldering iron or selective solder head. Follows IPC-J-STD-001 solder joint quality criteria. Common in consumer electronics, semiconductor, and industrial PCB assembly.",
    "latest_version": "1.0.0",
    "robots": [
      "Dobot_MG400",
      "Dobot_CR3",
      "UR3e",
      "UR5e"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "weave_weld",
    "name": "Weave Welding",
    "category": "Welding",
    "subcategory": "",
    "maturity": "stable",
    "description": "Performs arc welding with programmable transverse oscillation (weave) patterns — triangular, sinusoidal, trapezoidal, or spiral — with configurable amplitude, frequency, and edge dwell time. Used for wide-bead gap-bridging, thick-plate joints, and fillet welds requiring greater fusion width than a straight `seam_weld_arc` pass.",
    "latest_version": "1.0.0",
    "robots": [
      "Dobot_CR5",
      "Dobot_CR7",
      "Dobot_CR10",
      "FANUC_ARC_Mate100iD",
      "ABB_IRB1520ID"
    ],
    "robots_supported": 5
  },
  {
    "skill_id": "multipass_weld",
    "name": "Multi-Pass Welding",
    "category": "Welding",
    "subcategory": "",
    "maturity": "stable",
    "description": "Executes multiple sequential weld passes over the same joint to build up the required weld cross-section for thick-plate or structural applications. Manages pass sequencing, inter-pass temperature limits, and layer offset geometry. Required for joints exceeding single-pass throat thickness per AWS/ISO weld standards.",
    "latest_version": "1.0.0",
    "robots": [
      "Dobot_CR10",
      "Dobot_CR16",
      "FANUC_ARC_Mate120iD",
      "ABB_IRB2600"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "force_controlled_polish",
    "name": "Force-Controlled Polishing",
    "category": "Finishing",
    "subcategory": "",
    "maturity": "stable",
    "description": "Polishes contoured workpiece surfaces with real-time active force feedback, maintaining constant contact pressure regardless of surface waviness or fixture variation. Distinct from `polish_surface` (open-loop path) and `sand_surface` (stock removal): this skill uses a torque-sensor compliance loop for consistent finish on curved automotive, aerospace, and consumer product surfaces.",
    "latest_version": "1.0.0",
    "robots": [
      "Dobot_CRAF",
      "Dobot_CR5",
      "UR10e",
      "ABB_GoFa"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "drill_hole",
    "name": "Robotic Drilling",
    "category": "Finishing",
    "subcategory": "",
    "maturity": "stable",
    "description": "Drills holes in metal, composite, or plastic workpieces using a robot-mounted electric or pneumatic spindle with controlled feed rate and depth. Supports one-shot and peck drilling cycles. Used in aerospace panel drilling, automotive body, and fixture fabrication.",
    "latest_version": "1.0.0",
    "robots": [
      "Dobot_CR5",
      "Dobot_CR7",
      "UR10e",
      "UR16e",
      "FANUC_CRX10iA"
    ],
    "robots_supported": 5
  },
  {
    "skill_id": "mill_contour",
    "name": "Robotic Milling / Contouring",
    "category": "Finishing",
    "subcategory": "",
    "maturity": "beta",
    "description": "Performs milling or routing of contoured surfaces, pockets, or profiles on workpieces using a robot-mounted electric spindle, following CAM-generated paths. Complements CNC machining for large or complex parts requiring flexible reach. Used in automotive trim, composite finishing, and foam/wood prototyping.",
    "latest_version": "1.0.0",
    "robots": [
      "Dobot_CR10",
      "Dobot_CR16",
      "UR16e",
      "UR20"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "spray_paint_surface",
    "name": "Spray Painting",
    "category": "Dispensing",
    "subcategory": "",
    "maturity": "stable",
    "description": "Applies decorative or protective paint to vehicle panels, consumer products, or appliances using a robot-mounted spray gun following programmed path patterns. Distinct from `spray_coat_surface` (industrial functional coatings): this skill targets aesthetic finish quality — gloss, color consistency, and overspray minimization.",
    "latest_version": "1.0.0",
    "robots": [
      "Dobot_CR5",
      "Dobot_CR7",
      "ABB_IRB5500",
      "FANUC_P250iB"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "hot_melt_glue_apply",
    "name": "Hot Melt Adhesive Application",
    "category": "Dispensing",
    "subcategory": "",
    "maturity": "stable",
    "description": "Applies hot-melt (thermoplastic) adhesive beads or shots from a heated dispensing valve for bonding packaging flaps, automotive interior trim, or electronics enclosures. Distinct from `apply_adhesive_bead` (structural/epoxy) by the heated thermoplastic delivery system, fast-set time, and open-time sensitivity.",
    "latest_version": "1.0.0",
    "robots": [
      "Dobot_MG400",
      "Dobot_CR3",
      "UR5e",
      "UR10e"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "tend_die_cast_machine",
    "name": "Die Casting Machine Tending",
    "category": "Machine Tending",
    "subcategory": "",
    "maturity": "stable",
    "description": "Triggers the die casting shot, extracts hot cast parts from the open die using heat-resistant tooling, and transfers them to a cooling conveyor or trim press. Must complete extraction within the mold-open window. Common in automotive powertrain, consumer electronics housing, and hardware casting.",
    "latest_version": "1.0.0",
    "robots": [
      "Dobot_CR10",
      "Dobot_CR16",
      "FANUC_M20iD",
      "ABB_IRB4600"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "tend_bending_machine",
    "name": "Press Brake / Bending Machine Tending",
    "category": "Machine Tending",
    "subcategory": "",
    "maturity": "stable",
    "description": "Loads sheet metal blanks into a press brake or CNC bending machine, supports the part during the bend cycle to prevent springback distortion, and unloads formed parts to an outfeed stack. Requires coordinated motion with the press stroke signal.",
    "latest_version": "1.0.0",
    "robots": [
      "Dobot_CR10",
      "Dobot_CR16",
      "FANUC_CRX25iA",
      "ABB_IRB4600"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "ic_test_handler",
    "name": "IC / Component Test Handler",
    "category": "Inspection",
    "subcategory": "",
    "maturity": "stable",
    "description": "Picks individual electronic components (ICs, chips, modules) and loads them into test sockets on burn-in boards or functional test fixtures, then unloads and sorts by pass/fail result. Distinct from `end_of_line_functional_test` which tests whole assemblies; this skill handles component-level chip-in-socket operations.",
    "latest_version": "1.0.0",
    "robots": [
      "Dobot_MG400",
      "Dobot_CR3",
      "UR3e"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "force_controlled_insert",
    "name": "Force-Controlled Precision Insertion",
    "category": "Assembly",
    "subcategory": "",
    "maturity": "stable",
    "description": "Inserts tight-tolerance components (connectors, bearings, shafts, pins) using active joint-torque-sensor force feedback to detect contact, control insertion force profile, and detect errors such as jamming or misalignment. Distinct from `peg_in_hole` (passive RCC compliance) by requiring active torque-sensor control loops available on force-sensitive cobots.",
    "latest_version": "1.0.0",
    "robots": [
      "Dobot_CRAF",
      "UR5e",
      "UR10e",
      "ABB_GoFa",
      "FANUC_CRX10iA"
    ],
    "robots_supported": 5
  },
  {
    "skill_id": "pallet_interlayer_insert",
    "name": "Pallet Interlayer / Slip Sheet Insert",
    "category": "Packaging",
    "subcategory": "",
    "maturity": "stable",
    "description": "Picks cardboard slip sheets, foam interlayers, or corner separators from a magazine and places them between product layers during palletizing to stabilize stacks and prevent product damage. Executed as part of a palletizing workflow between `pallet_stack` cycles.",
    "latest_version": "1.0.0",
    "robots": [
      "Dobot_CR20A",
      "UR20",
      "ABB_IRB460"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "act_bimanual_cube_transfer",
    "name": "Bimanual Cube Transfer (ACT)",
    "category": "Manipulation",
    "subcategory": "Bimanual",
    "maturity": "beta",
    "description": "Bimanual manipulation skill trained via imitation learning on the ALOHA platform. ACT (Action Chunking with Transformers) policy trained on 50 human demonstrations achieves 83% success rate in simulation. Uses 4 cameras (2 wrist, 2 overhead) and 14-DOF joint control. Deployed from HuggingFace Hub: lerobot/act_aloha_sim_transfer_cube_human.",
    "latest_version": "1.0.0",
    "robots": [
      "ALOHA_v1",
      "ALOHA_v2"
    ],
    "robots_supported": 2
  },
  {
    "skill_id": "act_bimanual_peg_insertion",
    "name": "Bimanual Peg Insertion (ACT)",
    "category": "Assembly",
    "subcategory": "Fine Assembly",
    "maturity": "beta",
    "description": "Contact-rich bimanual insertion trained with ACT on 50 human demonstrations. Harder than cube transfer due to tight tolerances; trained for 100k steps to achieve 20.6% success in simulation. Uses same 4-camera, 14-DOF ALOHA setup. Deployed from HuggingFace Hub: lerobot/act_aloha_sim_insertion_human.",
    "latest_version": "1.0.0",
    "robots": [
      "ALOHA_v1",
      "ALOHA_v2"
    ],
    "robots_supported": 2
  },
  {
    "skill_id": "diffusion_push_object_to_target",
    "name": "Push Object to Target (Diffusion Policy)",
    "category": "Manipulation",
    "subcategory": "Non-Prehensile",
    "maturity": "beta",
    "description": "Non-prehensile manipulation skill using Diffusion Policy (DDPM U-Net) trained on human teleoperation data. Pushes a T-block to a goal pose on a planar surface. Achieves 65.4% success rate. End-effector operates in 2D (x, y, angle). Deployed from HuggingFace Hub: lerobot/diffusion_pusht.",
    "latest_version": "1.0.0",
    "robots": [
      "UR5e",
      "UR3e",
      "Franka_FR3"
    ],
    "robots_supported": 3
  },
  {
    "skill_id": "act_battery_slot_insertion",
    "name": "Battery Slot Insertion (ACT, Real Robot)",
    "category": "Assembly",
    "subcategory": "Electronic Assembly",
    "maturity": "beta",
    "description": "Real-robot battery insertion skill using ACT policy. Trained on 49 episodes of human demonstrations on physical ALOHA hardware, achieving 84% success rate. Demonstrates sim-to-real quality for tight-tolerance electronic assembly. Deployed from HuggingFace Hub: lerobot/aloha_static_battery.",
    "latest_version": "1.0.0",
    "robots": [
      "ALOHA_v1",
      "ALOHA_v2"
    ],
    "robots_supported": 2
  },
  {
    "skill_id": "mtc_pick_and_place",
    "name": "MTC Pick-and-Place",
    "category": "Manipulation",
    "subcategory": "Pick and Place",
    "maturity": "stable",
    "description": "Hierarchical state-machine pick-and-place using MoveIt Task Constructor (MTC). 23 states including approach, grasp candidate sampling, IK solve with fallback, lift, transfer, lower, place, and retreat. Supports grasp candidate ranking and automatic replanning on IK failure. Standard ROS-Industrial reference implementation.",
    "latest_version": "1.0.0",
    "robots": [
      "UR5e",
      "UR10e",
      "Franka_FR3",
      "ABB_IRB1200",
      "KUKA_KR10"
    ],
    "robots_supported": 5
  },
  {
    "skill_id": "ros_bin_picking_with_recovery",
    "name": "Bin Picking with Recovery (ROS-Industrial)",
    "category": "Manipulation",
    "subcategory": "Bin Picking",
    "maturity": "beta",
    "description": "15-state ROS-Industrial bin picking skill with automated recovery. Captures 3D point cloud, ranks grasp candidates by quality score (collision clearance + approach angle), executes best grasp, falls back through ranked list on failure, and triggers rescan if all candidates exhausted. Suitable for metal stampings, castings, and injection-molded parts.",
    "latest_version": "1.0.0",
    "robots": [
      "UR10e",
      "UR16e",
      "KUKA_KR10",
      "Fanuc_M20iD"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "ros_machine_tending_cnc",
    "name": "CNC Machine Tending (ROS-Industrial)",
    "category": "Machine Tending",
    "subcategory": "CNC Tending",
    "maturity": "beta",
    "description": "18-state ROS-Industrial machine tending skill for CNC lathes and machining centers. Coordinates with CNC PLC via digital I/O signals: door open/close, chuck control, cycle start, cycle complete. Handles workpiece pick from tray, fixture alignment, load into chuck, monitor machining cycle, unload to output tray. Supports Fanuc, HAAS, and Mazak CNC interfaces.",
    "latest_version": "1.0.0",
    "robots": [
      "UR10e",
      "UR16e",
      "Fanuc_M20iD",
      "KUKA_KR16"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "hybrid_vision_guided_pick_foundationpose",
    "name": "Vision-Guided Pick (FoundationPose)",
    "category": "Manipulation",
    "subcategory": "Vision-Guided Pick",
    "maturity": "beta",
    "description": "Hybrid skill: FoundationPose neural pose estimator (NVIDIA, 2024) provides 6-DoF object pose from RGBD data without prior training on target object. Pose estimate feeds MoveIt2 Cartesian planner for collision-aware pick execution. Handles textureless industrial parts; reference pose from CAD mesh or single RGB image. Deployed as Docker Compose service with NVIDIA runtime for GPU inference.",
    "latest_version": "1.0.0",
    "robots": [
      "UR5e",
      "UR10e",
      "Franka_FR3",
      "ABB_IRB1200"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "hybrid_vision_force_peg_in_hole",
    "name": "Vision-Force Peg-in-Hole (FoundationPose + Impedance)",
    "category": "Assembly",
    "subcategory": "Fine Assembly",
    "maturity": "beta",
    "description": "Two-phase hybrid assembly: Phase 1 — FoundationPose RGBD estimates hole pose with ~1mm accuracy for coarse alignment. Phase 2 — Cartesian impedance controller executes spiral search (5mm radius, 0.5mm pitch) to handle residual ±2mm uncertainty. Force threshold triggers transition between phases. Suitable for connector, shaft, and precision component insertion where vision alone is insufficient.",
    "latest_version": "1.0.0",
    "robots": [
      "UR5e",
      "UR10e",
      "KUKA_iiwa7",
      "Franka_FR3"
    ],
    "robots_supported": 4
  },
  {
    "skill_id": "hybrid_scan_and_plan_surface_finishing",
    "name": "Scan-and-Plan Surface Finishing (Noether)",
    "category": "Finishing",
    "subcategory": "Surface Treatment",
    "maturity": "beta",
    "description": "Hybrid scan-to-finish skill using industrial_reconstruction (3D mesh from RGBD) and Noether (ROS-Industrial tool-path planner) for adaptive surface finishing. Phase 1: Robot-mounted RGBD camera scans part to reconstruct mesh. Phase 2: Noether generates raster or contour tool-path from mesh normals. Phase 3: Force-controlled Cartesian execution maintains constant contact force. Suitable for grinding, sanding, polishing, and de-burring of complex geometries.",
    "latest_version": "1.0.0",
    "robots": [
      "UR10e",
      "UR16e",
      "ABB_IRB4400",
      "KUKA_KR16"
    ],
    "robots_supported": 4
  },

  {
    "skill_id": "focus_mode",
    "name": "Focus Mode",
    "category": "Companion",
    "subcategory": "Productivity",
    "domain": "companion",
    "scene": "coding",
    "maturity": "beta",
    "description": "Monitors attention and posture via on-device sensors. When distraction is detected the arm performs a gentle nudge gesture and voice reminds the user of their current task. All processing runs on-device — no data leaves the machine.",
    "latest_version": "0.1.0",
    "device": "DESKMATE ONE",
    "context_sources": ["screen", "posture", "attention"],
    "output_channels": ["arm_gesture", "voice"],
    "privacy_mode": "local_only",
    "robots": [],
    "robots_supported": 0
  },
  {
    "skill_id": "study_buddy",
    "name": "Study Buddy",
    "category": "Companion",
    "subcategory": "Education",
    "domain": "companion",
    "scene": "studying",
    "maturity": "beta",
    "description": "Watches the screen and tracks attention during study sessions. Prompts active recall at natural breakpoints, celebrates milestones with an arm gesture, and nudges the user to take Pomodoro breaks.",
    "latest_version": "0.1.0",
    "device": "DESKMATE ONE",
    "context_sources": ["screen", "attention", "calendar"],
    "output_channels": ["arm_gesture", "voice", "screen"],
    "privacy_mode": "local_only",
    "robots": [],
    "robots_supported": 0
  },
  {
    "skill_id": "writing_coach",
    "name": "Writing Coach",
    "category": "Companion",
    "subcategory": "Creativity",
    "domain": "companion",
    "scene": "writing",
    "maturity": "alpha",
    "description": "Detects writing slowdowns by monitoring words-per-minute via screen analysis. When flow drops below threshold the arm gestures encouragingly and voice offers a brief motivational prompt or writing suggestion.",
    "latest_version": "0.1.0",
    "device": "DESKMATE ONE",
    "context_sources": ["screen", "posture", "history"],
    "output_channels": ["arm_gesture", "voice"],
    "privacy_mode": "local_only",
    "robots": [],
    "robots_supported": 0
  },
  {
    "skill_id": "gaming_companion",
    "name": "Gaming Companion",
    "category": "Companion",
    "subcategory": "Entertainment",
    "domain": "companion",
    "scene": "gaming",
    "maturity": "alpha",
    "description": "Monitors posture and session length during gaming. Provides high-energy arm celebrations for achievements, posture nudges after long periods of slouching, and break reminders for marathon sessions.",
    "latest_version": "0.1.0",
    "device": "DESKMATE ONE",
    "context_sources": ["screen", "voice"],
    "output_channels": ["arm_gesture", "voice", "notification"],
    "privacy_mode": "local_only",
    "robots": [],
    "robots_supported": 0
  },
  {
    "skill_id": "daily_companion",
    "name": "Daily Companion",
    "category": "Companion",
    "subcategory": "Wellbeing",
    "domain": "companion",
    "scene": "companion",
    "maturity": "beta",
    "description": "Always-on ambient companion that greets the user at their desk, tracks time-at-desk for health reminders, responds to voice interactions, and provides a warm presence through gentle arm movements and voice.",
    "latest_version": "0.1.0",
    "device": "DESKMATE ONE",
    "context_sources": ["screen", "webcam", "posture"],
    "output_channels": ["arm_gesture", "voice", "screen"],
    "privacy_mode": "local_only",
    "robots": [],
    "robots_supported": 0
  },
  {
    "skill_id": "reading_aide",
    "name": "Reading Aide",
    "category": "Companion",
    "subcategory": "Education",
    "domain": "companion",
    "scene": "reading",
    "maturity": "alpha",
    "description": "Monitors reading attention via eye-tracking and posture sensors. When attention drops, gently nudges the user back. After each section, the arm taps the desk to prompt a brief self-test. Supports vocab lookup and summarization on demand.",
    "latest_version": "0.1.0",
    "device": "DESKMATE ONE",
    "context_sources": ["screen", "posture", "attention"],
    "output_channels": ["arm_gesture", "voice"],
    "privacy_mode": "local_only",
    "robots": [],
    "robots_supported": 0
  }
];
