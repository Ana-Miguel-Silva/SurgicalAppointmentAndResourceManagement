import { AllergyStatus } from "../domain/allergieStatus";

export const defaultMedicalRecords = [
  {
    date: "2024-12-09",
    staff: "20676900-eb92-4b1d-ac7d-298ef7644141",
    patientId : "aa6cc08c-9d3f-40aa-a795-29757b99b124",
    allergies: [
      { designacao: "Peanut Allergy", descricao: "", status:  AllergyStatus.Active },
      { designacao: "Shellfish Allergy",  descricao: "e.g., shrimp, lobster", status: AllergyStatus.NotMeaningfulAnymore }
    ],
    medicalConditions: [
      { codigo: "A04.0", designacao: "Cholera", status:  AllergyStatus.Active},
      { codigo: "A08.0", designacao: "Rotavirus enteritis", status:  AllergyStatus.Active},
    ],
    descricao: ""
  }

]
