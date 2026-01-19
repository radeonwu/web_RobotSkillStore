---

# Robot Skill Store (RSS)

## Web v6.77.49 — **Freeze Release Notes**

**Status:** ✅ FROZEN
**Scope:** Concept, Information Architecture, UX, and Visual Semantics
**Date:** 2026-01-19

---

## 1. Release Positioning

RSS Web v6.77.49 marks the **first fully stabilized public-facing version** of the Robot Skill Store website.

This release freezes:

* Conceptual framing of RSS as a **platform**, not a demo
* Skill lifecycle narrative (Register → Validate → Certify → Deploy)
* Platform runtime semantics aligned with **RSS Platform v1.0.4.12**
* Agent-based skill deployment explanation with a concrete industrial example

From this version onward, **structure and visual semantics are considered stable**.
Future versions should **extend content, not reinterpret concepts**.

---

## 2. What Is Frozen in This Release

### 2.1 Concept & Narrative (Frozen)

* **RSS as a platform**

  * Skills are deployable, governed capability assets
  * Not project code, demos, or scripts
* **Supplier → RSS → User ecosystem**

  * Clear separation of roles and responsibilities
* **Skill lifecycle**

  * Register, Validate, Certify, Deploy treated as platform-managed stages
* **Evidence-first philosophy**

  * Every execution produces immutable runs and artifacts
  * Trust derives from evidence, not manual review

---

### 2.2 Platform Page (Frozen)

* Platform capabilities mapped to **real backend modules and APIs**

  * Skill registry
  * Run execution & validation
  * Evidence & artifact store
  * Evaluation, certification, and governance
* **Platform runtime pipeline**

  * Layout stabilized (2 rows × 3 blocks)
  * Arrow directions encode control & data flow
  * Matches actual dataflow in RSS Platform v1.0.4.12
* Auth & access model clarified

  * Anonymous read
  * X-API-Key
  * Public `/public/v1/*` embedding paths
* Artifact store abstraction

  * Local vs S3/MinIO
  * Presigned URL model

---

### 2.3 Deployment Page (Frozen)

* **Agent-based Skill Deployment Flow**

  * Layout fixed as:

    * Row 1: Task → Plan → Match
    * Row 2 (right→left): Execute → Recover → Evidence
    * Vertical link: Match ↓ Execute
* Flow semantics clarified:

  * Agent orchestrates certified skills
  * Recovery and evidence are first-class runtime concerns
* **Concrete industrial example**

  * Connector assembly application
  * UR5 robotic arm + RG2 gripper
  * Skills reused via parameterization, not re-implementation
* Visual semantics (box size, arrow weight, alignment) frozen

---

### 2.4 Certified Skills & Docs (Frozen)

* Certified Skills actions now **base-URL driven**

  * Works for both local file browsing and deployed servers
* Docs homepage simplified

  * Legacy/internal pages hidden from default navigation
* RSS / RSP whitepapers clearly positioned:

  * RSS: product & platform view
  * RSP: protocol & invariants layer
* Navigation style unified across EN / ZH

---

### 2.5 Navigation & Internationalization (Frozen)

* EN / ZH navigation behavior stabilized
* Active tab highlighting fixed across all pages
* Layout consistency ensured between languages
* No further navigation restructuring planned in v6.x

---

## 3. What This Release Explicitly Does NOT Do

* ❌ No UI framework migration
* ❌ No responsive redesign
* ❌ No platform backend changes
* ❌ No feature expansion beyond explanation & illustration

This is a **communication and conceptual stabilization release**, not a functional expansion.

---

## 4. Forward Compatibility & Next Steps

With v6.77.49 frozen:

* **Web v6.x**

  * Only accepts:

    * Content additions
    * New examples
    * Documentation expansion
  * No conceptual or layout changes
* **Web v7.0+**

  * If needed, may introduce:

    * New verticals (e.g. humanoid, mobile manipulation)
    * Multi-agent orchestration views
    * Deeper integration with platform UI
  * Must preserve v6.77.49 semantics as baseline

---

## 5. Summary Statement

> **RSS Web v6.77.49 establishes a stable, evidence-driven, platform-first narrative for robot skills.**
> It aligns website semantics with real platform behavior, enabling RSS to be understood, evaluated, and extended as infrastructure rather than demonstration code.

---

