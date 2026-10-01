# Methodology interpretations and deviations: VM0042 v2.2

This register lists every place where the platform does not apply a VM0042 v2.2 equation literally. Most
entries come from the 1 October 2026 audit against the PDF. Each entry is either **conservative** (it never
increases credits) or an **interpretation** of a gap in the text. Declare these entries in the monitoring report
and give them to the verifier with the verification package.

| # | VM0042 | Literal text | What the platform does | Why | Effect |
|---|---|---|---|---|---|
| D1 | Eq. 75–77 (p.84–85) | Bu_ER and Bu_CR have no floor; VCU_ER = ER_NET − Bu_ER | The buffer is floored at 0. The raw Eq. 75/76 values are still reported (`buffer_*_eq75/76`) | A negative buffer would add credits in a loss year | Conservative |
| D2 | Eq. 39/42 (p.56–57) | LK_ER = LK × ER/(ER+CR) and LK_CR = LK × CR/(ER+CR) | When ER or CR is negative, or ER+CR ≤ 0, leakage is split using the positive parts. When both are positive the split is literal | The literal shares are undefined or negative in these cases | Total unchanged; only the ER/CR labels differ |
| D3 | Eq. 39/42 | Only LE_OA + LE_BR enter the allocation | LK_disp (VMD0054 Eq. 36) and any approved "other leakage" are also deducted through Eq. 39/42 | §8.4.2–8.4.3 require displacement and production leakage to be accounted for, but no equation routes them | Conservative |
| D4 | Eq. 37 (p.54) | ΔCH4_soil × (1 − UNC) and ΔN2O_soil × (1 − UNC) | (1 + UNC) is used when the reduction is negative | Mirrors the I_soil logic of Eq. 44/45, so uncertainty never shrinks a loss | Conservative |
| D5 | Eq. 74 (p.82) | t at 66.7 % "≈ 0.4307" | t(0.667, df) is computed exactly (0.4316 at large df) | 0.4307 is t(2/3); the rule value 0.667 is what the PDF states | About 0.2 % larger deduction (conservative) |
| D6 | §8.2.1.2 (p.30) | 3–5 composites per stratum "should" | The run blocks below the rule-pack floor (default 3) | Platform policy; the floor is a rule value the methodology owner can raise | Stricter |
| D7 | §6 (p.14) rotation | At least one complete crop rotation | Auto-detection needs the cycle to be seen restarting (p + 1 years). A rotation length stated on an attested crop record is accepted with p years | Without a stated length, a third crop could follow | Stricter unless the length is attested |
| D8 | §8.6.3 (p.81) | Use the low/high end of each factor's uncertainty range | When the rule pack gives only a central value, it is used and flagged (`range_missing`, plus a warning in the result) | Some IPCC defaults publish no range | Visible to the verifier |
| D9 | §8.4.3 / VMD0054 | VMD0054 Eq. 6 and 8–10 (not reproduced in VM0042) | INL and the per-hectare emission factor are entered from the proponent's VMD0054 worksheet, with evidence. LK_t = Σ AL_y × EF_y | VM0042 does not give these equations | Needs expert review against the VMD0054 version in force |
| D10 | Eq. 48–51 / AR-TOOL14 | Tree and shrub carbon by the CDM A/R tools | Per-tree allometry from an approved model, root:shoot and carbon fraction from the rule pack. Plot pairs give a stratum mean with sampling variance | The tool's own uncertainty discount is not applied in the engine; the variance is published with the term | Review against AR-TOOL14 |
| D11 | Eq. 33 (p.52) | Amendments "new or additional" compared with the look-back period | Compared with the schedule year mapped to each project year | Gives the same or a larger leakage | Conservative |
| D12 | Box 1 tier 4 (p.16) | Census within 20 years or the 10 most recent iterations, whichever is more recent | Needs the dataset's release interval; the window starts at max(start − 20, start − 10 × interval) | — | Literal |

QA1 (VMD0053 models) and Appendix 6 have their own notes in the module docstrings (`api/app/modules/qa1/`,
`api/app/modules/calculation/multistage.py`).
