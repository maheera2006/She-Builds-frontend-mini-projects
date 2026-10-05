# Product Analysis and SDLC

Covers both projects. Validate the "existing solutions" section by trying 2-3 real tools yourself and adding screenshots.

## 1. Problem and users
| | Result Portal | Event Portal |
|---|---|---|
| Users | Students, teachers | Participants, organisers |
| Core job | Enter marks, get a correct, clear result | Find an event and register fast |
| First-time risk | Unsure what to type, where | Unsure which event, how to sign up |

## 2. Existing solutions and their approach
| Category | Typical approach | Where it fails |
|---|---|---|
| University ERP / result sites | Long forms, login-first, desktop layouts | Not mobile friendly, vague errors, no guidance for new users |
| Spreadsheets (Excel/Sheets) | Manual formulas | Formula mistakes, no validation, hard to share |
| Event platforms (ticketing sites) | Generic checkout flow | Paid focus, heavy for small college fests, little local schedule info |
| Social posts / WhatsApp / Google Forms | Poster plus a form link | Scattered info, no live schedule, no filtering, duplicate entries |

## 3. Gaps found
1. No step-by-step guidance for first-time users.
2. Errors appear late or say only "invalid".
3. Poor small-screen layouts and tiny tap targets.
4. Information split across many places.
5. Pass/fail rules hidden from the user.

## 4. Our approach (how each gap is closed)
| Gap | Our fix | Where |
|---|---|---|
| No guidance | "How to use" banner with 4 numbered steps, placeholders, helper text | Student portal top; event register intro |
| Vague errors | Field-level messages saying what to fix, focus moved to first error | Both validators |
| Mobile | Mobile-first grid, 44px controls, collapsible menu, no sideways scroll | Event CSS, Bootstrap grid |
| Scattered info | One page: events, schedule, gallery, register, contact | Event portal |
| Hidden rules | Pass rule printed up front (35% per subject, 40% overall) | Student portal |
| Wrong marks | Subjects and maximum marks load per course (editable); marks limited to 0 and the subject maximum | `script.js` |

## 5. User-friendly onboarding principles
- One primary action per screen section; plain verbs ("Calculate result", "Register").
- Show the next step before the user asks.
- Validate on submit and say how to fix it. Never clear the form on error.
- Confirmation states what happened and what comes next.
- Keyboard focus visible, labels on every input, readable contrast.

## 6. Innovation strategies
- Subjects and maximum marks adapt to the chosen course, and can be edited or extended (less typing, fewer errors).
- "Register" button on an event card pre-selects that event.
- Category filter and live announcements editable without reloading.
- Ideas for next version: save results in `localStorage`, print/PDF result sheet, QR check-in, dark mode, grade points and CGPA, backend (Node/Firebase) with email confirmation.

## 7. SDLC (Agile, 1-week sprints)
| Phase | Work done | Output |
|---|---|---|
| Planning | Objectives, scope, tech choice | This document |
| Requirements | Features from the two briefs, user stories | Section 4 table |
| Design | Wireframes, navigation, colour and type | Sketches in `/docs` (add) |
| Development | HTML, then CSS/Bootstrap, then JS | Source code |
| Testing | See checklist below | Test table |
| Deployment | GitHub Pages | Live link in README |
| Maintenance | Fix bugs, add backlog items | Issues list |

## 8. Test checklist
| Case | Expected |
|---|---|
| Empty form submit | Every field shows a message |
| Marks 101 or -1 | Rejected |
| Marks 34 in one subject, 80 elsewhere | FAIL (below 35) |
| All 40 | PASS, 40% |
| Phone with 9 digits | Rejected |
| Viewports 360, 768, 1280 px | No horizontal scroll, menu works |
| Tab key only | Every control reachable |

## 9. Risks
Client-side validation can be bypassed, so a real product needs server checks. Data is not stored after refresh.