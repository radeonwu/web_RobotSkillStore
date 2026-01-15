#!/usr/bin/env python3
"""Validate Docs tab groups for both EN and ZH.

Regression guard for the recurring issue:
  "Only the 1st tab works; other tabs are unclickable."

The tab JS expects:
- A scope wrapper (recommended) with `data-toggle-scope`.
- Within the scope, one or more `.pillbar[data-toggle-group]`.
- Each `.pill` has `data-toggle-target`.
- Each panel has `id=<data-toggle-target>` and `data-panel=<group>`.

This script checks:
- No duplicate IDs within each scope.
- Every pill's target exists within the same scope.
- Every panel in the scope is reachable by some pill.

Exit code:
- 0 OK
- 1 validation failed
"""

from __future__ import annotations

import sys
from pathlib import Path
from collections import Counter

try:
    from bs4 import BeautifulSoup
except ImportError:
    print("ERROR: BeautifulSoup4 is required. Install via: pip install beautifulsoup4", file=sys.stderr)
    sys.exit(2)


def _validate_scope(html_path: Path, scope_id: str) -> list[str]:
    errors: list[str] = []
    soup = BeautifulSoup(html_path.read_text(encoding="utf-8"), "html.parser")

    scope = soup.find(id=scope_id)
    if scope is None:
        return [f"{html_path}: missing scope element id={scope_id}"]

    if not scope.get("data-toggle-scope"):
        errors.append(f"{html_path}: scope #{scope_id} missing data-toggle-scope attribute")

    # Duplicate IDs within scope
    ids = [el.get("id") for el in scope.find_all(attrs={"id": True})]
    dup = [k for k, v in Counter(ids).items() if v > 1]
    if dup:
        errors.append(f"{html_path}: duplicate ids within #{scope_id}: {dup}")

    pillbars = scope.select(".pillbar[data-toggle-group]")
    if not pillbars:
        errors.append(f"{html_path}: scope #{scope_id} has no .pillbar[data-toggle-group]")
        return errors

    # Validate each group in this scope
    for bar in pillbars:
        group = bar.get("data-toggle-group")
        if not group:
            errors.append(f"{html_path}: pillbar in #{scope_id} missing data-toggle-group")
            continue

        pills = bar.select(".pill[data-toggle-target]")
        if not pills:
            errors.append(f"{html_path}: group '{group}' in #{scope_id} has no .pill[data-toggle-target]")
            continue

        targets = []
        for pill in pills:
            t = pill.get("data-toggle-target")
            if not t:
                errors.append(f"{html_path}: group '{group}' in #{scope_id}: a pill missing data-toggle-target")
                continue
            targets.append(t)
            # target must exist within same scope
            if scope.find(id=t) is None:
                label = pill.get_text(strip=True) or "(no label)"
                errors.append(
                    f"{html_path}: group '{group}' in #{scope_id}: pill '{label}' targets missing panel id='{t}'"
                )

        # Panels for this group should be within scope and reachable
        panels = scope.select(f"[data-panel='{group}'][id]")
        panel_ids = [p.get("id") for p in panels if p.get("id")]
        missing_from_pills = [pid for pid in panel_ids if pid not in targets]
        if missing_from_pills:
            errors.append(
                f"{html_path}: group '{group}' in #{scope_id}: panels not reachable by pills: {missing_from_pills}"
            )

        # Pills that point to a panel of different group are suspicious
        for t in targets:
            el = scope.find(id=t)
            if el is None:
                continue
            dp = el.get("data-panel")
            if dp != group:
                errors.append(
                    f"{html_path}: group '{group}' in #{scope_id}: target '{t}' has data-panel='{dp}' (expected '{group}')"
                )

    return errors


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    docs = [
        root / "en" / "docs" / "index.html",
        root / "zh" / "docs" / "index.html",
    ]
    scopes = ["rss-summaries", "rsp-summaries"]

    all_errors: list[str] = []
    for doc in docs:
        if not doc.exists():
            all_errors.append(f"missing file: {doc}")
            continue
        for scope in scopes:
            all_errors.extend(_validate_scope(doc, scope))

    if all_errors:
        print("Docs tabs validation FAILED:\n" + "\n".join(f"- {e}" for e in all_errors), file=sys.stderr)
        return 1

    print("Docs tabs validation OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
