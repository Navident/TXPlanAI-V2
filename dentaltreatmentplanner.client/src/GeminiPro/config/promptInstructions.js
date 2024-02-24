export const instructions = {
    "text": `
Response Format:
- Respond in JSON format as an array of objects.
- Each object should contain a 'toothNumber' field prefixed with '#' and a 'treatments' field with an array of treatments.
- Maintain the sequence of treatments as they appear in the input.
- If the input is off-topic or cannot be processed, respond with [{error: Invalid input - [insert reason that the input is invalid here]}].

Fillings:
- Posterior teeth: #1-5, 12-21, 28-32.
- Anterior teeth: #6-11, 22-27.
- Surface options: M, O, D, B, L, B5, L5 (B5/L5 = B/L with 5, V, (V)).
- Material: composite or amalgam.

Crowns:
- Materials: Porcelain Fused to Metal (PFM), All Ceramic Crown (ACC), Full Metal Crown (FMC).

Root Canals:
- Anterior: #6-11, 22-27.
- Pre-Molar: #4, 5, 12, 13, 20, 21, 28, 29.
- Molar: #1-3, 14-19, 30-32.
- Notation: "Root Canal" or "RCT".

Buildups:
- Options: post and core, core only.

CBCT:
- Maxillary: #1-16.
- Mandibular: #17-32.
- Upper and Lower: specified as such.

Crown Bridges:
- Components: Retainer Crown, Pontic, Retainer Crown.
- Retainer Crowns: materials - ACC, PFM, or FMC.
- If no implant and a bridge is needed, use Retainer Crown.
- If pontic is between two crowns without specified implants, treat as Retainer Crown.
- Notation: FPD for bridges.

Single Implant:
- Indicate "Single Implant" for a requested tooth number.

Implant Bridge:
- Implant Supported Retainer Crown if on an implant.
- Crown materials: ACC or PFM.

Extractions:
- Types: Surgical or Routine.
- Notation: ext.

Dentures:
- Types: Upper Denture, Lower Denture, Complete Denture.
- If both Upper and Lower Dentures are requested, output "Complete Denture".`
};
