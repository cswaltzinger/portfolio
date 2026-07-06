const defaultInput = `
Patient Demographics & Administrative
    Name: Gwen Pendragon
    DOB : 03/15/1990 (35 years old)
    Medical Record Number (MRN): 8912345
    Admission Date/Time: 11/07/2025 @ 14:30
    Admitting Physician: Dr. Susan Chen (Internal Medicine)
    Primary Insurance: Harmony Health PPO
    Allergies: Penicillin (Anaphylaxis), Sulfa drugs (Hives)
Chief Complaint & History of Present Illness (HPI)
    Chief Complaint: Severe, sharp abdominal pain (lower right quadrant) for 12 hours.
    Onset: Approximately 02:00 AM this morning.
    Severity (Pain Scale 1-10): 8/10 at worst; currently 7/10.
    Associated Symptoms: Nausea, low-grade fever (100.5°F/38.1°C), loss of appetite.
    Pertinent Negatives: No vomiting, no diarrhea, no chest pain, no recent injury.
Physical Exam & Vitals (On Arrival)
    Temperature: 100.8°F (38.2°C)
    Heart Rate: 98 bpm (Tachycardic)
    Blood Pressure: 130/85 mmHg
    Respiratory Rate: 18 breaths/min
    O2 Saturation: 97% on room air
    Abdominal Exam: Guarding and significant rebound tenderness noted in the right lower quadrant (RLQ). Bowel sounds hypoactive.
    General: Patient alert and oriented x 3 (Person, Place, Time). Appears distressed by pain.
Diagnosis & Plan
    Admitting Diagnosis: Acute Appendicitis (Suspected)
    Consults: Surgical Consult placed immediately.
    Initial Orders: NPO (Nothing by Mouth), IV Fluids (Normal Saline), Pain Management (Morphine 2mg IV prn), Antiemetic (Ondansetron 4mg IV prn), Pre-op Labs, Abdominal CT scan.
    Anticipated LOS: 3-5 days (Post-operative recovery).
    `

const defaultOutput = `
Patient: Gwen Pendragon

Vitals:
    Temperature: 100.8°F (38.2°C)
    Heart Rate: 98 bpm (Tachycardic)
    Blood Pressure: 130/85 mmHg
    Respiratory Rate: 18 breaths/min
    O2 Saturation: 97% on room air
    Allergies: Penicillin (Anaphylaxis), Sulfa drugs (Hives)
    Current Condition:  
        Overall: Stable but in moderate distress due to pain.
        Onset: Approximately 02:00 AM this morning.
        Severity: 8/10 at worst; currently 7/10.
        Associated Symptoms: Nausea, low-grade fever (100.5°F/38.1°C), loss of appetite.
        Pertinent Negatives: No vomiting, no diarrhea, no chest pain, no recent injury.

Abdominal Exam: 
    Guarding and significant rebound tenderness noted in the right lower quadrant (RLQ). 
    Bowel sounds hypoactive.

Prognosis: Suspected Acute Appendicitis 
Plan:
    Consults: Surgical Consult placed immediately.
    Orders:
        NPO (Nothing by Mouth)
        IV Fluids (Normal Saline)
        Pain Management (Morphine 2mg IV prn)
        Antiemetic (Ondansetron 4mg IV prn)
        Pre-op Labs
        Abdominal CT scan


`

// module.exports = {defaultInput,defaultOutput}