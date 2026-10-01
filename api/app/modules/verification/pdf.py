"""Human-readable verification report, rendered only from the package JSON."""

from __future__ import annotations

import io
from collections import Counter
from typing import Any

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import KeepTogether, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

INK = colors.HexColor("#1f2933")
MUTED = colors.HexColor("#616e7c")
ACCENT = colors.HexColor("#2f6f4e")
RULE = colors.HexColor("#d9e2ec")
BAND = colors.HexColor("#f0f4f8")


def _styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle("title", parent=base["Title"], fontName="Helvetica-Bold", fontSize=22, leading=27,
                                textColor=INK, alignment=TA_LEFT, spaceAfter=4),
        "subtitle": ParagraphStyle("subtitle", parent=base["Normal"], fontSize=11, leading=15, textColor=MUTED),
        "h2": ParagraphStyle("h2", parent=base["Heading2"], fontName="Helvetica-Bold", fontSize=13, leading=17,
                             textColor=ACCENT, spaceBefore=12, spaceAfter=6),
        "body": ParagraphStyle("body", parent=base["Normal"], fontSize=9, leading=12, textColor=INK),
        "small": ParagraphStyle("small", parent=base["Normal"], fontSize=7.5, leading=9.5, textColor=INK),
        "figure": ParagraphStyle("figure", parent=base["Normal"], fontName="Helvetica-Bold", fontSize=16, leading=19,
                                 textColor=INK),
        "label": ParagraphStyle("label", parent=base["Normal"], fontSize=8, leading=10, textColor=MUTED),
    }


_GLYPHS = {"Δ": "d", "Σ": "Sum ", "²": "^2", "≥": ">=", "≤": "<=", "−": "-", "×": "x", "√": "sqrt ",
           "π": "pi", "₂": "2", "₄": "4", "…": "...", "–": "-", "“": '"', "”": '"', "’": "'", "⁶": "^6", "—": "-", "°": "deg"}


def _latin1(s: str) -> str:
    """The standard PDF fonts cover Latin-1 only; spell out the maths symbols used in labels."""
    out = "".join(_GLYPHS.get(ch, ch) for ch in s)
    return out.encode("latin-1", "replace").decode("latin-1")


def _esc(v: Any) -> str:
    s = _latin1("" if v is None else str(v))
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def _num(v: Any, digits: int = 2) -> str:
    if v is None:
        return "—"
    try:
        return f"{float(v):,.{digits}f}"
    except (TypeError, ValueError):
        return _esc(v)


def _value(v: Any) -> str:
    if isinstance(v, bool):
        return "Yes" if v else "No"
    if isinstance(v, list):
        return ", ".join(str(x) for x in v)
    return "—" if v is None else str(v)


def _table(rows: list[list[Any]], widths: list[float], st: dict[str, ParagraphStyle]) -> Table:
    data = [[c if isinstance(c, Paragraph) else Paragraph(_esc(c), st["small"]) for c in r] for r in rows]
    t = Table(data, colWidths=widths, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BAND),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("LINEBELOW", (0, 0), (-1, 0), 0.6, ACCENT),
        ("LINEBELOW", (0, 1), (-1, -1), 0.25, RULE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    return t


def render_pdf(pkg: dict[str, Any]) -> bytes:
    st = _styles()
    meta = pkg.get("metadata", {})
    fingerprint = meta.get("sha256", "")
    calc = pkg.get("calculation", {})
    head = calc.get("headline", {})
    results = calc.get("results", {})
    buf = io.BytesIO()
    width = A4[0] - 36 * mm

    def footer(canvas, doc) -> None:
        canvas.saveState()
        canvas.setStrokeColor(RULE)
        canvas.line(18 * mm, 14 * mm, A4[0] - 18 * mm, 14 * mm)
        canvas.setFont("Helvetica", 7)
        canvas.setFillColor(MUTED)
        canvas.drawString(18 * mm, 10 * mm, f"Package SHA-256: {fingerprint}")
        canvas.drawRightString(A4[0] - 18 * mm, 10 * mm, f"Page {doc.page}")
        canvas.restoreState()

    doc = SimpleDocTemplate(buf, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=18 * mm,
                            bottomMargin=20 * mm, title=f"Verification package {meta.get('project_code', '')}",
                            author="Varsapradaya Carbon", subject="Soil carbon verification package")
    story: list[Any] = []

    # ---------------------------------------------------------------- cover
    story += [
        Paragraph("Soil Carbon Verification Package", st["title"]),
        Paragraph(f"{_esc(meta.get('project_name'))} ({_esc(meta.get('project_code'))})", st["subtitle"]),
        Paragraph(f"Monitoring period {_esc(meta.get('period_label'))}: {_esc(meta.get('period_start'))} to "
                  f"{_esc(meta.get('period_end'))}", st["subtitle"]),
        Paragraph(f"Package version {_esc(meta.get('package_version'))} · engine {_esc(meta.get('engine_version'))}"
                  f" · generated by {_esc(meta.get('generated_by'))}", st["subtitle"]),
        Spacer(1, 10 * mm),
    ]
    figures = [
        ("Net credits", head.get("net_credits_t_co2e")), ("Emission reductions", head.get("reductions_t_co2e")),
        ("Carbon removals", head.get("removals_t_co2e")),
        ("Uncertainty deduction", head.get("uncertainty_deduction_t_co2e")),
        ("Buffer contribution", head.get("buffer_t_co2e")), ("Gross change", head.get("gross_t_co2e")),
    ]
    grid = []
    for i in range(0, len(figures), 3):
        grid.append([Paragraph(f"{_num(v)}<br/><font size=8 color='#616e7c'>{_esc(k)} (t CO2e)</font>", st["figure"])
                     for k, v in figures[i:i + 3]])
    g = Table(grid, colWidths=[width / 3] * 3)
    g.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.6, RULE), ("INNERGRID", (0, 0), (-1, -1), 0.3, RULE),
        ("BACKGROUND", (0, 0), (-1, 0), BAND), ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8), ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ]))
    story += [g, Spacer(1, 6 * mm)]
    flags = results.get("flags", {})
    notes = []
    if flags.get("carbon_lost"):
        notes.append("Soil carbon did not increase over this period; the result is reported as measured, not floored.")
    if flags.get("high_uncertainty"):
        notes.append("The uncertainty deduction exceeds 15% of the net result.")
    if flags.get("controls_used"):
        notes.append("The baseline scenario was measured at control sites.")
    story.append(Paragraph(
        f"Net result before uncertainty: <b>{_num(head.get('net_before_uncertainty_t_co2e'))}</b> t CO2e · "
        f"standard error {_num(results.get('se_t_co2e'))} · effective degrees of freedom "
        f"{_num(results.get('df_effective'), 1)} · confidence {_esc(results.get('confidence'))} · "
        f"non-permanence risk {_num(results.get('non_permanence_risk_pct'), 1)}%", st["body"]))
    for n in notes:
        story.append(Paragraph(f"• {_esc(n)}", st["body"]))
    story += [
        Spacer(1, 6 * mm),
        Paragraph("Integrity", st["h2"]),
        Paragraph(f"Package fingerprint (SHA-256): <font name='Courier'>{_esc(fingerprint)}</font>", st["small"]),
        Paragraph(f"Evidence content fingerprint: <font name='Courier'>{_esc(meta.get('content_sha256'))}</font>",
                  st["small"]),
        Paragraph(f"Calculation input fingerprint: <font name='Courier'>"
                  f"{_esc(calc.get('run', {}).get('snapshot_sha256'))}</font>", st["small"]),
        Paragraph("Every figure in this report is taken from the package JSON. Recomputing the SHA-256 of that JSON "
                  "(canonical form, excluding this fingerprint) must reproduce the value above.", st["small"]),
        PageBreak(),
    ]

    # ---------------------------------------------------------------- rules
    story.append(Paragraph("Methodology rules", st["h2"]))
    pack = (pkg.get("methodology") or {}).get("pack") or {}
    story.append(Paragraph(f"{_esc(pack.get('title'))} — {_esc(pack.get('methodology_code'))} "
                           f"v{_esc(pack.get('methodology_version'))} revision {_esc(pack.get('revision'))}", st["body"]))
    story.append(Spacer(1, 2 * mm))
    rows = [["Rule", "Value", "Source"]]
    for r in (pkg.get("methodology") or {}).get("rules", []):
        src = ", ".join(x for x in (r.get("source_document"), r.get("source_section"),
                                    f"p. {r['source_page']}" if r.get("source_page") else None) if x)
        rows.append([r.get("label"), _value(r.get("value")), src])
    story.append(_table(rows, [width * 0.38, width * 0.22, width * 0.40], st))

    # ---------------------------------------------------------------- strata
    story.append(Paragraph("Zone results", st["h2"]))
    rows = [["Zone", "Area (ha)", "n", "Baseline (t C/ha)", "Monitoring (t C/ha)", "Change (t C/ha)", "SE", "df",
             "Excluded"]]
    for s in results.get("strata", []):
        rows.append([s.get("code"), _num(s.get("area_ha")), s.get("n_used"), _num(s.get("mean_baseline_t_c_ha")),
                     _num(s.get("mean_monitoring_t_c_ha")), _num(s.get("delta_t_c_ha"), 3), _num(s.get("se"), 3),
                     _num(s.get("df"), 1), ", ".join(s.get("excluded_sites") or []) or "—"])
    story.append(_table(rows, [width * w for w in (0.10, 0.10, 0.06, 0.13, 0.13, 0.12, 0.09, 0.07, 0.20)], st))
    if results.get("control_strata"):
        story.append(Spacer(1, 2 * mm))
        story.append(Paragraph("Control zones: " + ", ".join(
            f"{_esc(c.get('code'))} (change {_num(c.get('measured_delta_t_c_ha'), 3)} t C/ha)"
            for c in results["control_strata"]), st["body"]))

    story.append(Paragraph("Project terms", st["h2"]))
    rows = [["Term", "Value (t CO2e)", "Variance", "Source"]]
    for t in results.get("terms", []):
        rows.append([t.get("term", "").replace("_", " "), _num(t.get("value_t_co2e")), _num(t.get("variance")),
                     t.get("source")])
    story.append(_table(rows, [width * 0.25, width * 0.17, width * 0.14, width * 0.44], st))

    # ---------------------------------------------------------------- VM0042 v2.2 equations & vintages
    eqs = pkg.get("equations") or results.get("equations") or []
    if eqs:
        story.append(Paragraph("Equation summary (VM0042 v2.2)", st["h2"]))
        rows = [["Equation", "Quantity", "Value", "Unit"]]
        for e in eqs:
            rows.append([e.get("eq"), e.get("label"), _num(e.get("value"), 4), e.get("unit")])
        story.append(_table(rows, [width * 0.14, width * 0.54, width * 0.17, width * 0.15], st))
    vint = pkg.get("vintages") or results.get("vintages") or []
    if vint:
        story.append(Paragraph("Verified carbon units per vintage (Eq. 37–43, 75–79)", st["h2"]))
        rows = [["Vintage", "ΣΔE", "ER", "CR", "Leakage", "Buffer", "VCU (ER)", "VCU (CR)", "VCU"]]
        for v in vint:
            rows.append([v.get("year"), _num(v.get("sum_delta_e_t_co2e")), _num(v.get("er_t_co2e")),
                         _num(v.get("cr_t_co2e")), _num(v.get("leakage_t_co2e")),
                         _num((v.get("buffer_er_t_co2e") or 0) + (v.get("buffer_cr_t_co2e") or 0)),
                         _num(v.get("vcu_er")), _num(v.get("vcu_cr")), _num(v.get("vcu"))])
        story.append(_table(rows, [width * 0.1] + [width * 0.1125] * 8, st))
        story.append(Paragraph("All figures in t CO2e. The buffer applies to carbon-stock changes only.", st["small"]))
    unc = pkg.get("uncertainty") or results.get("uncertainty") or {}
    if unc:
        story.append(Paragraph("Uncertainty by source (Eq. 70–74)", st["h2"]))
        rows = [["Source", "Approach", "UNC %", "Note"]]
        for k, u in unc.items():
            if k == "qa3" and isinstance(u, dict):
                for src, q in u.items():
                    rows.append([src.replace("_", " "), "qa3", _num(q.get("unc_pct")),
                                 f"{q.get('method')} — {q.get('ef_end')} end"])
                continue
            if isinstance(u, dict):
                rows.append([k.replace("_", " "), u.get("approach", ""), _num(u.get("unc_pct")),
                             u.get("method") or (f"t = {_num(u.get('t'), 4)}, df = {_num(u.get('df'), 1)}"
                                                 if u.get("t") is not None else "")])
        story.append(_table(rows, [width * 0.25, width * 0.12, width * 0.13, width * 0.5], st))
    conf = pkg.get("conformance") or []
    if conf:
        story.append(Paragraph("Methodology conformance checklist", st["h2"]))
        rows = [["Ref", "Requirement", "Status", "Evidence"]]
        for c in conf:
            rows.append([c.get("ref"), c.get("requirement"), c.get("status"), c.get("evidence")])
        story.append(_table(rows, [width * 0.16, width * 0.36, width * 0.1, width * 0.38], st))
    annex = pkg.get("annex") or {}
    if annex:
        story.append(Paragraph(
            f"Strata annex: {len(annex.get('strata', []))} strata and {len(annex.get('points', []))} sampling points "
            "with intended and actual coordinates are in the package JSON (also as CSV).", st["body"]))

    # ---------------------------------------------------------------- lab
    story.append(Paragraph("Laboratory summary", st["h2"]))
    lab = pkg.get("lab_results", [])
    used = [r for r in lab if r.get("used_in_calculation")]
    by = Counter((r.get("analyte"), r.get("method")) for r in used)
    certs = sum(1 for r in used if r.get("certificate_id"))
    story.append(Paragraph(
        f"{len(used)} accepted result(s) used in the calculation, of {len(lab)} on record; {certs} carry a signed "
        f"certificate. Labs: {_esc(', '.join(x.get('name', '') for x in pkg.get('labs', [])) or '—')}.", st["body"]))
    rows = [["Analyte", "Method", "Results used"]] + [[a, m, n] for (a, m), n in sorted(by.items(), key=str)]
    story.append(_table(rows, [width * 0.4, width * 0.4, width * 0.2], st))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        f"{len(pkg.get('samples', []))} sample(s) from {len(pkg.get('sites', []))} site(s); "
        f"{len(pkg.get('custody_events', []))} custody event(s); {len(pkg.get('fields', []))} field(s); "
        f"{len(pkg.get('document_index', []))} evidence file(s) in the document index.", st["body"]))

    # ---------------------------------------------------------------- QA
    story.append(Paragraph("Quality checks", st["h2"]))
    qa = pkg.get("qa_findings", [])
    sev = Counter((f.get("severity"), f.get("status")) for f in qa)
    if not qa:
        story.append(Paragraph("No quality findings were recorded for this project.", st["body"]))
    else:
        rows = [["Severity", "Status", "Count"]] + [[s, stt, n] for (s, stt), n in sorted(sev.items(), key=str)]
        story.append(_table(rows, [width * 0.4, width * 0.4, width * 0.2], st))
        rows = [["Rule", "Severity", "Status", "Message"]]
        for f in qa[:60]:
            rows.append([f.get("rule_code"), f.get("severity"), f.get("status"), f.get("message")])
        story.append(Spacer(1, 2 * mm))
        story.append(_table(rows, [width * 0.22, width * 0.12, width * 0.12, width * 0.54], st))

    # ---------------------------------------------------------------- history
    story.append(KeepTogether([
        Paragraph("Approval history", st["h2"]),
        _table([["Status", "When", "Note"]] + [[h.get("status"), h.get("at"), h.get("note") or ""]
                                                for h in calc.get("status_history", [])],
               [width * 0.2, width * 0.35, width * 0.45], st),
    ]))

    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    return buf.getvalue()
