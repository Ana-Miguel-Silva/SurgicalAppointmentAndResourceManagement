import "reflect-metadata";
import { expect } from "chai";
import { MedicalRecord } from "../../src/domain/medicalRecord";
import { Result } from "../../src/core/logic/Result";
import { UniqueEntityID } from "../../src/core/domain/UniqueEntityID";
import { AllergyStatus } from "./allergieStatus";

describe("MedicalRecord Domain", () => {
  it("should create a valid MedicalRecord instance", () => {
    const medicalRecordProps = {
      date: new Date("2023-01-01"),
      staff: "Dr. John Doe",
      patientId: "patient-123",
      allergies: [
        { designacao: "allergy-3", descricao: "Peanuts", status: AllergyStatus.Active, note: ""},
        { designacao: "allergy Teste", descricao: "Teste", status: AllergyStatus.Active, note: "" },
      ],
      medicalConditions: [
        { codigo: "A044",  designacao: "Diabetes", descricao: "Type 2 diabetes", sintomas: ['Nausia'], status: AllergyStatus.Active, note: ""},
      ],
      descricao: ["Patient requires annual follow-up.", "Monitor respiratory symptoms."],
    };

    const result = MedicalRecord.create(medicalRecordProps);

    expect(result.isSuccess).to.be.true;
    const medicalRecord = result.getValue();
    expect(medicalRecord.date).to.deep.equal(medicalRecordProps.date);
    expect(medicalRecord.staff).to.equal(medicalRecordProps.staff);
    expect(medicalRecord.patientId).to.equal(medicalRecordProps.patientId);
    expect(medicalRecord.allergies).to.deep.equal(medicalRecordProps.allergies);
    expect(medicalRecord.medicalConditions).to.deep.equal(medicalRecordProps.medicalConditions);
    expect(medicalRecord.descricao).to.deep.equal(medicalRecordProps.descricao);
  });

  it("should fail to create a MedicalRecord if required fields are missing", () => {
    const medicalRecordProps = {
      date: null, 
      staff: "Dr. John Doe",
      patientId: "patient-123",
      allergies: [
        { designacao: "allergy-3", descricao: "Peanuts", status: AllergyStatus.Active, note: "" },
      ],
      medicalConditions: [
        { codigo: "A044",  designacao: "Diabetes", descricao: "Type 2 diabetes", sintomas: ['Nausia'], status: AllergyStatus.Active, note: "" },
      ],
      descricao: ["Patient requires annual follow-up."],
    };

    const result = MedicalRecord.create(medicalRecordProps);

    expect(result.isSuccess).to.be.false;
    expect(result.error).to.equal("date is null or undefined");
  });

  it("should allow updating the properties of MedicalRecord", () => {
    const medicalRecordProps = {
      date: new Date("2023-01-01"),
      staff: "Dr. John Doe",
      patientId: "patient-123",
      allergies: [],
      medicalConditions: [],
      descricao: [],
    };

    const result = MedicalRecord.create(medicalRecordProps);
    const medicalRecord = result.getValue();

    medicalRecord.date = new Date("2024-01-01");
    medicalRecord.staff = "Dr. Jane Smith";
    medicalRecord.patientId = "patient-456";
    medicalRecord.allergies = [
      { designacao: "allergy-3", descricao: "Peanuts", status: AllergyStatus.Active, note: "" },
    ];
    medicalRecord.medicalConditions = [
      { codigo: "A044",  designacao: "Diabetes", descricao: "Type 2 diabetes", sintomas: ['Nausia'], status: AllergyStatus.Active, note: "" },
    ];
    medicalRecord.descricao = ["Patient should monitor blood sugar levels."];

    expect(medicalRecord.date).to.deep.equal(new Date("2024-01-01"));
    expect(medicalRecord.staff).to.equal("Dr. Jane Smith");
    expect(medicalRecord.patientId).to.equal("patient-456");


    expect(medicalRecord.allergies).to.deep.equal([
      { designacao: "allergy-3", descricao: "Peanuts", status: AllergyStatus.Active, note: "" },
    ]);
    expect(medicalRecord.medicalConditions).to.deep.equal([
      { codigo: "A044",  designacao: "Diabetes", descricao: "Type 2 diabetes", sintomas: ['Nausia'], status: AllergyStatus.Active, note: "" },
    ]);
    expect(medicalRecord.descricao).to.deep.equal([
      "Patient should monitor blood sugar levels.",
    ]);
  });

  it("should fail to create a MedicalRecord with an invalid field", () => {
    const medicalRecordProps = {
      date: new Date("2023-01-01"),
      staff: "Dr. John Doe",
      patientId: null,
      allergies: [],
      medicalConditions: [],
      descricao: [],
    };

    const result = MedicalRecord.create(medicalRecordProps);

    expect(result.isSuccess).to.be.false;
    expect(result.error).to.equal("patientId is null or undefined");
  });
});
