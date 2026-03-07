export interface DiseaseAdvice {
  disease: string;
  description: string;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
  urgency: "low" | "medium" | "high" | "critical";
  recommendedAction: string;
}

const diseaseDatabase: { [key: string]: DiseaseAdvice } = {
  HEALTHY: {
    disease: "Healthy Cattle",
    description:
      "Your cattle appears to be in good health! Continue with regular care.",
    symptoms: [],
    treatment: ["Maintain regular veterinary check-ups"],
    prevention: [
      "Balanced diet and proper nutrition",
      "Clean water and shelter",
      "Regular exercise",
      "Vaccination schedule",
    ],
    urgency: "low",
    recommendedAction:
      "Schedule a routine check-up to maintain optimal health",
  },
  FOOT_AND_MOUTH: {
    disease: "Foot and Mouth Disease (FMD)",
    description:
      "Foot and Mouth Disease is a highly contagious viral disease affecting cloven-hoofed animals. It causes severe economic losses.",
    symptoms: [
      "Fever and lameness",
      "Blisters on hooves, mouth, and teats",
      "Excessive salivation and drooling",
      "Reduced milk production",
      "Loss of appetite",
      "Painful movement",
    ],
    treatment: [
      "Immediate isolation of affected animals",
      "Supportive care: fluids, pain management, antibiotics for secondary infections",
      "Contact veterinary authorities immediately",
      "No specific antiviral treatment - supportive care only",
      "Culling may be necessary in severe outbreaks",
    ],
    prevention: [
      "Vaccination (where available)",
      "Quarantine infected animals",
      "Strict biosecurity measures",
      "Disinfection of facilities",
      "Control of movement of animals",
      "Regular health monitoring",
    ],
    urgency: "critical",
    recommendedAction:
      "IMMEDIATE: Contact a veterinarian and report to animal health authorities. Isolate the animal immediately.",
  },
  LUMPY_SKIN: {
    disease: "Lumpy Skin Disease (LSD)",
    description:
      "Lumpy Skin Disease is a viral infection causing nodular lesions on the skin. It affects cattle and water buffalo.",
    symptoms: [
      "Fever (104-107°F)",
      "Nodules and lumps on skin",
      "Swelling of lymph nodes",
      "Lameness",
      "Loss of appetite",
      "Reduced milk production",
      "Nasal discharge",
      "Watery eyes",
    ],
    treatment: [
      "Isolation of affected animals",
      "Proper nutrition and supportive care",
      "Treatment of secondary bacterial infections with antibiotics",
      "Pain relief medication",
      "Improved ventilation and hygiene",
      "No specific antiviral treatment",
    ],
    prevention: [
      "Vaccination against LSD",
      "Control insect vectors (flies, mosquitoes)",
      "Biosecurity measures",
      "Regular health monitoring",
      "Quarantine of new animals",
      "Maintain good farm hygiene",
    ],
    urgency: "high",
    recommendedAction:
      "Schedule an urgent veterinary appointment. Isolate the animal from the herd.",
  },
  ANTHRAX: {
    disease: "Anthrax",
    description:
      "Anthrax is a serious, potentially fatal disease caused by the bacterium Bacillus anthracis. It requires immediate attention.",
    symptoms: [
      "Sudden death with no warning signs",
      "Hemorrhage from body orifices (nose, mouth, rectum)",
      "High fever (up to 106°F)",
      "Rapid breathing",
      "Reduced milk production",
      "Skin lesions (if cutaneous form)",
      "Intestinal distress",
    ],
    treatment: [
      "IMMEDIATE antibiotic therapy (Penicillin G or Tetracycline)",
      "High-dose antibiotics IV or IM",
      "Supportive care and fluid therapy",
      "DO NOT perform necropsy - spores can spread",
      "Safe disposal of carcass (incineration)",
      "Environmental decontamination",
    ],
    prevention: [
      "Annual vaccination (Anthrax vaccine for animals)",
      "Quarantine measures for known cases",
      "Proper disposal of animal waste",
      "Use of gloves when handling infected animals",
      "Avoid contact with infected carcasses",
      "Report to health authorities immediately",
    ],
    urgency: "critical",
    recommendedAction:
      "EMERGENCY: Contact veterinarian and animal health authorities NOW. This is a zoonotic disease - take precautions.",
  },
  MASTITIS: {
    disease: "Mastitis",
    description:
      "Mastitis is an inflammation of the udder, usually caused by bacterial infection, and can significantly reduce milk production and quality.",
    symptoms: [
      "Swollen, hot, or painful udder",
      "Abnormal milk (watery, clots, flakes, or blood)",
      "Reduced milk yield",
      "Cow discomfort during milking",
      "Fever in severe cases",
    ],
    treatment: [
      "Isolate affected cow for hygiene control",
      "Consult a veterinarian for culture-guided antibiotics",
      "Frequent and complete milking of affected quarter",
      "Use anti-inflammatory medication as advised",
      "Maintain strict udder and milking hygiene",
    ],
    prevention: [
      "Clean and dry housing/bedding",
      "Pre- and post-milking teat disinfection",
      "Proper milking machine maintenance",
      "Regular screening (e.g., CMT/somatic cell checks)",
      "Dry cow therapy as recommended by a veterinarian",
    ],
    urgency: "high",
    recommendedAction:
      "Arrange a prompt veterinary assessment and begin udder hygiene control immediately.",
  },
};

export function getDiseaseAdvice(diseaseType: string): DiseaseAdvice {
  return (
    diseaseDatabase[diseaseType] || {
      disease: "Unknown",
      description: "Unable to determine disease type",
      symptoms: [],
      treatment: ["Consult with a veterinarian"],
      prevention: ["Regular health monitoring"],
      urgency: "medium",
      recommendedAction: "Contact a veterinary professional for diagnosis",
    }
  );
}

export function formatAdviceForChat(advice: DiseaseAdvice): string {
  return `
**${advice.disease}**

*Urgency Level: ${advice.urgency.toUpperCase()}*

${advice.description}

**Symptoms:**
${advice.symptoms.map((s) => `• ${s}`).join("\n")}

**Treatment Options:**
${advice.treatment.map((t) => `• ${t}`).join("\n")}

**Prevention Measures:**
${advice.prevention.map((p) => `• ${p}`).join("\n")}

**Recommended Action:**
${advice.recommendedAction}

*Please consult with a veterinary professional for a proper diagnosis and treatment plan.*
  `.trim();
}
