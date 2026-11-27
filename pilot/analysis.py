#!/usr/bin/env python3
"""پائلٹ اسیسمنٹ کے اعداد کا تجزیہ۔

آزمائشی ایپ سے اتاری گئی CSV فائلیں پڑھتا ہے اور ہر اسیسمنٹ کے ہر پیمانے کے لیے
کرونباخ الفا، درست شدہ آئٹم-کل ارتباط، اور الفا-اگر-آئٹم-ہٹایا-جائے، نکالتا ہے۔
کمزور آئٹم پر جھنڈا لگاتا ہے: درست شدہ ارتباط 0.30 سے کم ہو، یا آئٹم ہٹانے سے
الفا بڑھ جائے۔

استعمال:
    python3 analysis.py file1.csv file2.csv
    python3 analysis.py /path/to/csv-folder/
    python3 analysis.py . --json report.json

یہ اسکرپٹ کوئی ڈیٹا نہیں بناتا؛ صرف دی گئی فائلیں پڑھتا ہے۔ اگر کوئی فائل نہ ملے
تو کچھ نہیں کرتا۔ الفا 3 سے کم جواب دہندگان پر ناقابل اعتماد ہوتا ہے، اس لیے
ایسی صورت میں انتباہ لکھا جاتا ہے۔
"""
import argparse
import csv
import glob
import json
import math
import os
import sys
from collections import defaultdict


def mean(xs):
    return sum(xs) / len(xs)


def variance(xs):
    """Sample variance (ddof=1)."""
    if len(xs) < 2:
        return 0.0
    m = mean(xs)
    return sum((x - m) ** 2 for x in xs) / (len(xs) - 1)


def pearson(xs, ys):
    """Pearson r; returns None if either series has zero variance."""
    if len(xs) < 2 or len(xs) != len(ys):
        return None
    mx, my = mean(xs), mean(ys)
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    den = math.sqrt(sum((x - mx) ** 2 for x in xs) * sum((y - my) ** 2 for y in ys))
    if den == 0:
        return None
    return num / den


def cronbach_alpha(matrix):
    """matrix: list of respondents, each a list of item scores (same items).
    Returns None if fewer than 2 items or fewer than 2 respondents."""
    if not matrix or len(matrix) < 2:
        return None
    k = len(matrix[0])
    if k < 2:
        return None
    item_vars = [variance([row[j] for row in matrix]) for j in range(k)]
    totals = [sum(row) for row in matrix]
    total_var = variance(totals)
    if total_var == 0:
        return None
    return (k / (k - 1.0)) * (1.0 - sum(item_vars) / total_var)


def load_rows(paths):
    """Read app-exported CSVs. Returns list of dicts."""
    rows = []
    for path in paths:
        with open(path, newline="", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            needed = {"respondent_code", "assessment_id", "scale", "item_id",
                      "reverse", "raw_value", "scored_value"}
            if reader.fieldnames is None or not needed.issubset(set(reader.fieldnames)):
                print(f"خبردار: {path} میں مطلوبہ کالم نہیں ہیں، چھوڑ دی گئی۔", file=sys.stderr)
                continue
            for r in reader:
                if r.get("scored_value") in (None, ""):
                    # Fall back: recompute from raw value and reverse flag.
                    raw = r.get("raw_value")
                    if raw in (None, ""):
                        continue
                    raw = float(raw)
                    r["scored_value"] = 3.0 - raw if r.get("reverse") == "1" else raw
                else:
                    r["scored_value"] = float(r["scored_value"])
                rows.append(r)
    return rows


def analyse_scale(item_ids, respondents):
    """respondents: {code: {item_id: scored}} using only complete cases.
    Returns dict with alpha, n, per-item stats and flags."""
    complete = {c: d for c, d in respondents.items()
                if all(i in d for i in item_ids)}
    n = len(complete)
    matrix = [[complete[c][i] for i in item_ids] for c in sorted(complete)]
    alpha = cronbach_alpha(matrix) if n >= 2 else None
    items_out = []
    for j, item_id in enumerate(item_ids):
        col = [row[j] for row in matrix] if matrix else []
        rest_totals = [sum(row) - row[j] for row in matrix] if matrix else []
        r = pearson(col, rest_totals) if matrix else None
        without = [[v for k, v in enumerate(row) if k != j] for row in matrix]
        alpha_del = cronbach_alpha(without) if matrix else None
        flags = []
        if col and variance(col) == 0:
            flags.append("آئٹم میں کوئی تغیر نہیں (سب نے ایک جیسا جواب دیا)")
        if r is not None and r < 0.30:
            flags.append(f"درست شدہ ارتباط کم ہے ({r:.2f} < 0.30)")
        if r is None and col and variance(col) > 0:
            flags.append("ارتباط نکالا نہیں جا سکا")
        if alpha is not None and alpha_del is not None and alpha_del > alpha:
            flags.append(f"ہٹانے سے الفا بڑھتا ہے ({alpha_del:.3f} > {alpha:.3f})")
        items_out.append({
            "item_id": item_id,
            "n": len(col),
            "mean": round(mean(col), 2) if col else None,
            "sd": round(math.sqrt(variance(col)), 2) if len(col) >= 2 else None,
            "item_total_r": round(r, 3) if r is not None else None,
            "alpha_if_deleted": round(alpha_del, 3) if alpha_del is not None else None,
            "flags": flags,
        })
    return {
        "n_respondents": n,
        "n_items": len(item_ids),
        "alpha": round(alpha, 3) if alpha is not None else None,
        "items": items_out,
    }


def analyse(rows):
    """Group rows by (assessment_id, scale) and analyse each scale."""
    grouped = defaultdict(lambda: defaultdict(dict))  # (aid, scale) -> code -> {item: score}
    assessment_names = {}
    for r in rows:
        key = (r["assessment_id"], r["scale"])
        assessment_names[r["assessment_id"]] = r.get("assessment_name", r["assessment_id"])
        grouped[key][r["respondent_code"]][r["item_id"]] = r["scored_value"]
    report = {"assessments": {}}
    for (aid, scale), respondents in sorted(grouped.items()):
        item_ids = sorted({i for d in respondents.values() for i in d})
        result = analyse_scale(item_ids, respondents)
        result["scale"] = scale
        report["assessments"].setdefault(aid, {
            "name": assessment_names.get(aid, aid), "scales": [],
        })["scales"].append(result)
    return report


def print_report(report, total_rows):
    print(f"کل قطاریں پڑھی گئیں: {total_rows}")
    for aid, a in report["assessments"].items():
        print(f"\n=== {a['name']} ({aid}) ===")
        for s in a["scales"]:
            print(f"\n-- {s['scale']} --")
            print(f"  جواب دہندگان (مکمل): {s['n_respondents']} | آئٹم: {s['n_items']} | "
                  f"کرونباخ الفا: {s['alpha'] if s['alpha'] is not None else 'نہیں نکلا'}")
            if s["n_respondents"] < 3:
                print("  انتباہ: 3 سے کم جواب دہندگان پر الفا ناقابل اعتماد ہے۔")
            if s["n_respondents"] < 30:
                print("  نوٹ: چھوٹی آزمائش (30 سے کم) میں الفا صرف اشارہ ہے، فیصلہ نہیں۔")
            print(f"  {'آئٹم':<10}{'اوسط':>7}{'معیاری انحراف':>14}{'ارتباط':>9}{'الفا اگر ہٹایا':>15}  جھنڈے")
            for it in s["items"]:
                r = f"{it['item_total_r']:.3f}" if it["item_total_r"] is not None else "-"
                ad = f"{it['alpha_if_deleted']:.3f}" if it["alpha_if_deleted"] is not None else "-"
                m = f"{it['mean']:.2f}" if it["mean"] is not None else "-"
                sd = f"{it['sd']:.2f}" if it["sd"] is not None else "-"
                flag = " | ".join(it["flags"]) if it["flags"] else ""
                print(f"  {it['item_id']:<10}{m:>7}{sd:>14}{r:>9}{ad:>15}  {flag}")
    flagged = [(aid, s["scale"], it["item_id"], it["flags"])
               for aid, a in report["assessments"].items()
               for s in a["scales"] for it in s["items"] if it["flags"]]
    print(f"\n=== خلاصہ: جھنڈے والے آئٹم ({len(flagged)}) ===")
    if not flagged:
        print("کوئی آئٹم جھنڈا نہیں کھا سکا۔")
    for aid, scale, item_id, flags in flagged:
        print(f"  {aid} | {scale} | {item_id}: {'; '.join(flags)}")


def collect_paths(args):
    paths = []
    for a in args:
        if os.path.isdir(a):
            paths.extend(sorted(glob.glob(os.path.join(a, "*.csv"))))
        elif os.path.isfile(a):
            paths.append(a)
        else:
            paths.extend(sorted(glob.glob(a)))
    return sorted(set(paths))


def main(argv=None):
    ap = argparse.ArgumentParser(description="پائلٹ CSV کا تجزیہ: الفا، آئٹم-کل ارتباط، جھنڈے۔")
    ap.add_argument("inputs", nargs="*", default=["."],
                    help="CSV فائل، فولڈر، یا glob (طے شدہ: موجودہ فولڈر کی *.csv)")
    ap.add_argument("--json", dest="json_out", default=None,
                    help="رپورٹ JSON فائل میں بھی محفوظ کریں")
    args = ap.parse_args(argv)
    paths = collect_paths(args.inputs)
    if not paths:
        print("کوئی CSV فائل نہیں ملی۔ پہلے ایپ سے جوابات اتار کر اس فولڈر میں رکھیں۔")
        return 1
    rows = load_rows(paths)
    if not rows:
        print("فائلوں میں کوئی قابل استعمال قطار نہیں ملی۔")
        return 1
    report = analyse(rows)
    print(f"فائلیں: {len(paths)}")
    print_report(report, len(rows))
    if args.json_out:
        with open(args.json_out, "w", encoding="utf-8") as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        print(f"\nJSON رپورٹ محفوظ ہوئی: {args.json_out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
