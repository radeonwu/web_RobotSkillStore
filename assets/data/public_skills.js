// Auto-generated from public_skills.json — do not edit manually.
window.RSS_STATIC_SKILLS = [
  {
    "skill_id": "press_fit_bearing",
    "name": "Press-Fit Bearing",
    "category": "Assembly",
    "subcategory": "Press Fitting",
    "maturity": "beta",
    "latest_version": "1.0.0",
    "description": "Press a bearing into a housing bore with controlled force profile to achieve interference fit.",
    "robots_supported": 3,
    "robots": [
      "UR10e",
      "UR5e",
      "KUKA_iiwa7"
    ]
  },
  {
    "skill_id": "peg_in_hole",
    "name": "Peg-in-Hole Insertion",
    "category": "Assembly",
    "subcategory": "Fine Assembly",
    "maturity": "stable",
    "latest_version": "1.0.0",
    "description": "Insert a peg or cylindrical component into a hole with tight tolerance using compliant motion.",
    "robots_supported": 4,
    "robots": [
      "UR5e",
      "UR10e",
      "KUKA_iiwa7",
      "ABB_IRB1200"
    ]
  },
  {
    "skill_id": "snap_fit_connector",
    "name": "Snap-Fit Connector Assembly",
    "category": "Assembly",
    "subcategory": "Snap Fitting",
    "maturity": "beta",
    "latest_version": "1.0.0",
    "description": "Press a snap-fit connector into its socket until an audible/tactile click confirms full engagement.",
    "robots_supported": 3,
    "robots": [
      "UR5e",
      "UR10e",
      "Fanuc_LRMate200iD"
    ]
  },
  {
    "skill_id": "nut_run",
    "name": "Nut Running",
    "category": "Assembly",
    "subcategory": "Fastening",
    "maturity": "stable",
    "latest_version": "1.0.0",
    "description": "Run a nut down a bolt to a specified torque using a torque-controlled end effector.",
    "robots_supported": 3,
    "robots": [
      "UR10e",
      "UR16e",
      "KUKA_KR10"
    ]
  },
  {
    "skill_id": "torque_verify",
    "name": "Fastener Torque Verification",
    "category": "Assembly",
    "subcategory": "Fastening",
    "maturity": "stable",
    "latest_version": "1.0.0",
    "description": "Verify a fastener has been tightened to within its specified torque band using an FT sensor.",
    "robots_supported": 3,
    "robots": [
      "UR5e",
      "UR10e",
      "KUKA_iiwa7"
    ]
  },
  {
    "skill_id": "apply_threadlocker",
    "name": "Apply Threadlocker",
    "category": "Assembly",
    "subcategory": "Surface Preparation",
    "maturity": "alpha",
    "latest_version": "1.0.0",
    "description": "Apply a metered drop of anaerobic threadlocker to a bolt thread before fastening.",
    "robots_supported": 2,
    "robots": [
      "UR5e",
      "UR10e"
    ]
  },
  {
    "skill_id": "rivet_install",
    "name": "Blind Rivet Installation",
    "category": "Assembly",
    "subcategory": "Fastening",
    "maturity": "beta",
    "latest_version": "1.0.0",
    "description": "Insert and set a blind rivet through pre-drilled holes in sheet metal or structural panels.",
    "robots_supported": 3,
    "robots": [
      "UR10e",
      "UR16e",
      "Fanuc_M20iA"
    ]
  },
  {
    "skill_id": "pick_with_vision",
    "name": "Vision-Guided Pick",
    "category": "Manipulation",
    "subcategory": "Pick and Place",
    "maturity": "stable",
    "latest_version": "1.0.0",
    "description": "Pick a known object from a semi-structured environment using 2.5D vision-guided grasping.",
    "robots_supported": 4,
    "robots": [
      "UR5e",
      "UR10e",
      "ABB_IRB1200",
      "Fanuc_LRMate200iD"
    ]
  },
  {
    "skill_id": "place_on_fixture",
    "name": "Precision Place on Fixture",
    "category": "Manipulation",
    "subcategory": "Pick and Place",
    "maturity": "stable",
    "latest_version": "1.0.0",
    "description": "Place a held object into a fixture or nest with positional accuracy under 1 mm.",
    "robots_supported": 3,
    "robots": [
      "UR5e",
      "UR10e",
      "ABB_IRB1200"
    ]
  },
  {
    "skill_id": "bin_pick",
    "name": "Bin Picking (Unstructured)",
    "category": "Manipulation",
    "subcategory": "Bin Picking",
    "maturity": "beta",
    "latest_version": "1.0.0",
    "description": "Pick a part from a bin of randomly oriented identical parts using 3D point cloud perception.",
    "robots_supported": 4,
    "robots": [
      "UR10e",
      "UR16e",
      "Fanuc_M10iA",
      "KUKA_KR10"
    ]
  },
  {
    "skill_id": "pallet_stack",
    "name": "Pallet Layer Stacking",
    "category": "Manipulation",
    "subcategory": "Palletizing",
    "maturity": "stable",
    "latest_version": "1.0.0",
    "description": "Stack boxes or parts in a predefined pattern on a pallet layer by layer.",
    "robots_supported": 4,
    "robots": [
      "UR16e",
      "UR20",
      "Fanuc_M20iA",
      "KUKA_KR20"
    ]
  },
  {
    "skill_id": "pallet_unstack",
    "name": "Pallet Layer Unstacking",
    "category": "Manipulation",
    "subcategory": "Palletizing",
    "maturity": "stable",
    "latest_version": "1.0.0",
    "description": "Remove items from a pallet layer by layer, passing them to downstream conveyor or cell.",
    "robots_supported": 3,
    "robots": [
      "UR16e",
      "UR20",
      "Fanuc_M20iA"
    ]
  },
  {
    "skill_id": "conveyor_transfer",
    "name": "Conveyor Transfer",
    "category": "Manipulation",
    "subcategory": "Material Transfer",
    "maturity": "beta",
    "latest_version": "1.0.0",
    "description": "Pick a moving or static part from a conveyor and transfer it to a target pose.",
    "robots_supported": 3,
    "robots": [
      "UR10e",
      "UR16e",
      "ABB_IRB2400"
    ]
  },
  {
    "skill_id": "surface_inspect_2d",
    "name": "2D Surface Defect Inspection",
    "category": "Inspection",
    "subcategory": "Visual Inspection",
    "maturity": "stable",
    "latest_version": "1.0.0",
    "description": "Inspect a surface for visible defects (scratches, dents, contamination) using a 2D camera.",
    "robots_supported": 3,
    "robots": [
      "UR5e",
      "UR10e",
      "ABB_IRB1200"
    ]
  },
  {
    "skill_id": "dimension_measure",
    "name": "Dimension Measurement",
    "category": "Inspection",
    "subcategory": "Dimensional Inspection",
    "maturity": "beta",
    "latest_version": "1.0.0",
    "description": "Measure a critical part dimension (length, diameter, flatness) using a contact probe or laser sensor.",
    "robots_supported": 3,
    "robots": [
      "UR5e",
      "UR10e",
      "ABB_IRB1200"
    ]
  },
  {
    "skill_id": "barcode_scan",
    "name": "Barcode / QR Code Scan",
    "category": "Inspection",
    "subcategory": "ID & Traceability",
    "maturity": "stable",
    "latest_version": "1.0.0",
    "description": "Scan a 1D barcode or 2D QR/DataMatrix code on a part for traceability and routing.",
    "robots_supported": 2,
    "robots": [
      "UR5e",
      "UR10e"
    ]
  },
  {
    "skill_id": "presence_check",
    "name": "Part Presence Check",
    "category": "Inspection",
    "subcategory": "Presence Detection",
    "maturity": "stable",
    "latest_version": "1.0.0",
    "description": "Confirm whether a part or sub-component is present at an expected location.",
    "robots_supported": 2,
    "robots": [
      "UR5e",
      "UR10e"
    ]
  },
  {
    "skill_id": "profile_scan_3d",
    "name": "3D Laser Profile Scan",
    "category": "Inspection",
    "subcategory": "Dimensional Inspection",
    "maturity": "beta",
    "latest_version": "1.0.0",
    "description": "Acquire a 3D surface profile of a part using a line laser profilometer for geometric inspection.",
    "robots_supported": 2,
    "robots": [
      "UR10e",
      "ABB_IRB2400"
    ]
  },
  {
    "skill_id": "load_cnc_part",
    "name": "CNC Machine Part Loading",
    "category": "Machine Tending",
    "subcategory": "CNC Tending",
    "maturity": "stable",
    "latest_version": "1.0.0",
    "description": "Load a raw part into a CNC machine chuck or fixture and confirm secure clamping.",
    "robots_supported": 3,
    "robots": [
      "UR10e",
      "UR16e",
      "Fanuc_LRMate200iD"
    ]
  },
  {
    "skill_id": "unload_cnc_part",
    "name": "CNC Machine Part Unloading",
    "category": "Machine Tending",
    "subcategory": "CNC Tending",
    "maturity": "stable",
    "latest_version": "1.0.0",
    "description": "Unload a finished part from a CNC machine chuck/fixture after machining is complete.",
    "robots_supported": 3,
    "robots": [
      "UR10e",
      "UR16e",
      "Fanuc_LRMate200iD"
    ]
  },
  {
    "skill_id": "door_open_machine",
    "name": "Open Machine Door / Guard",
    "category": "Machine Tending",
    "subcategory": "Door Operation",
    "maturity": "stable",
    "latest_version": "1.0.0",
    "description": "Open a machine safety door or guard using a robot-mounted actuator or push/slide motion.",
    "robots_supported": 3,
    "robots": [
      "UR5e",
      "UR10e",
      "Fanuc_LRMate200iD"
    ]
  },
  {
    "skill_id": "door_close_machine",
    "name": "Close Machine Door / Guard",
    "category": "Machine Tending",
    "subcategory": "Door Operation",
    "maturity": "stable",
    "latest_version": "1.0.0",
    "description": "Close and latch a machine safety door or guard after loading/unloading is complete.",
    "robots_supported": 2,
    "robots": [
      "UR5e",
      "UR10e"
    ]
  },
  {
    "skill_id": "apply_adhesive_bead",
    "name": "Apply Adhesive Bead",
    "category": "Dispensing",
    "subcategory": "Adhesive Dispensing",
    "maturity": "beta",
    "latest_version": "1.0.0",
    "description": "Dispense a continuous adhesive bead along a programmed path with controlled width and height.",
    "robots_supported": 2,
    "robots": [
      "UR5e",
      "UR10e"
    ]
  },
  {
    "skill_id": "apply_sealant_bead",
    "name": "Apply Sealant Bead",
    "category": "Dispensing",
    "subcategory": "Sealant Dispensing",
    "maturity": "beta",
    "latest_version": "1.0.0",
    "description": "Apply a continuous sealant bead (silicone, polyurethane) along a sealing path for environmental sealing.",
    "robots_supported": 2,
    "robots": [
      "UR10e",
      "ABB_IRB2400"
    ]
  },
  {
    "skill_id": "dispense_fluid_shot",
    "name": "Dispense Metered Fluid Shot",
    "category": "Dispensing",
    "subcategory": "Shot Dispensing",
    "maturity": "alpha",
    "latest_version": "1.0.0",
    "description": "Dispense a precise metered volume of fluid (lubricant, flux, solder paste) at a target point.",
    "robots_supported": 1,
    "robots": [
      "UR5e"
    ]
  },
  {
    "skill_id": "spray_coat_surface",
    "name": "Spray Coat Surface",
    "category": "Dispensing",
    "subcategory": "Spray Coating",
    "maturity": "beta",
    "latest_version": "1.0.0",
    "description": "Apply an even spray coat (paint, primer, lubricant, conformal coating) over a surface area.",
    "robots_supported": 3,
    "robots": [
      "UR10e",
      "ABB_IRB2400",
      "Fanuc_P250"
    ]
  },
  {
    "skill_id": "spot_weld",
    "name": "Resistance Spot Welding",
    "category": "Welding",
    "subcategory": "Resistance Welding",
    "maturity": "beta",
    "latest_version": "1.0.0",
    "description": "Execute a resistance spot weld at a programmed location on sheet metal stack-up.",
    "robots_supported": 3,
    "robots": [
      "UR16e",
      "Fanuc_R2000iB",
      "KUKA_KR200"
    ]
  },
  {
    "skill_id": "seam_weld_arc",
    "name": "Arc Seam Weld Segment",
    "category": "Welding",
    "subcategory": "Arc Welding",
    "maturity": "beta",
    "latest_version": "1.0.0",
    "description": "Execute a continuous arc weld along a seam path using MIG or TIG process.",
    "robots_supported": 3,
    "robots": [
      "UR10e",
      "ABB_IRB2400",
      "Fanuc_ARC_Mate_100iD"
    ]
  },
  {
    "skill_id": "deburr_edge",
    "name": "Automated Edge Deburring",
    "category": "Finishing",
    "subcategory": "Deburring",
    "maturity": "beta",
    "latest_version": "1.0.0",
    "description": "Remove machining burrs from part edges using a compliant deburring spindle with controlled contact force.",
    "robots_supported": 3,
    "robots": [
      "UR10e",
      "UR5e",
      "ABB_IRB2400"
    ]
  },
  {
    "skill_id": "polish_surface",
    "name": "Surface Polishing",
    "category": "Finishing",
    "subcategory": "Polishing",
    "maturity": "alpha",
    "latest_version": "1.0.0",
    "description": "Polish a surface to a target roughness (Ra) specification using a compliant polishing tool.",
    "robots_supported": 2,
    "robots": [
      "UR10e",
      "ABB_IRB2400"
    ]
  }
];
