# MILESTONE — clinical decision platform (demo)

A working prototype of **Milestone**: one shared case where every relevant specialist takes the decision together, instead of relying on data scattered across the EMR.

**Live demo:** https://cloudnateadmin.github.io/milestone-demo/

## What the demo shows
- **Getting started** walkthrough of the whole flow
- **Cases → Summary → Timeline → MDT → Node forms**, worked through on one rectal-cancer case
- Tiered escalation (Tier 1 / Tier 2), a synchronous MDT with recorded opinions and dissent, the Trial box, chemotherapy dose-intensity and side-effect tracking, and the surveillance dashboard

## Please note
- **Demonstration only.** All patient data is fictional. This is not a medical device and must not be used for clinical decisions.
- The node forms are representational: nothing entered is saved.
- Images are illustrative reference images, not of the demo patient. Rights in the images remain with their original owners.

## Run locally
It is a static site (no build step): open `index.html`, or run `python -m http.server` in this folder.
