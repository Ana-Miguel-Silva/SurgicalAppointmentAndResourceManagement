import "reflect-metadata";
import { expect } from "chai";
import MedicalRecordService from "./medicalRecordService";
import { MedicalRecord } from "../domain/medicalRecord";
import { Result } from "../core/logic/Result";
import { mock } from "sinon";
import IMedicalRecordRepo from "./IRepos/IMedicalRecordRepo";
import IAllergieService from "./IServices/IAllergieService";
import IMedicalConditionService from "./IServices/IMedicalConditionService";


describe("MedicalRecordService", () => {
  let medicalRecordRepoMock: IMedicalRecordRepo;
  let allergieServiceMock: IAllergieService;
  let medicalConditionServiceMock: IMedicalConditionService;
  let service: MedicalRecordService;

  beforeEach(() => {
    medicalRecordRepoMock = mock();
    allergieServiceMock = mock();
    medicalConditionServiceMock = mock();

    service = new MedicalRecordService(
      medicalRecordRepoMock,
      allergieServiceMock,
      medicalConditionServiceMock
    );
  });

  describe("createMedicalRecordDefault", () => {
    it("should create a valid medical record", async () => {
      const medicalRecordProps = {
        date: new Date(),
        staff: "Dr. Smith",
        patientId: "12345",
        allergies: [],
        medicalConditions: [],
        descricao: ["General check-up"],
      };

      const medicalRecordMock = MedicalRecord.create(medicalRecordProps).getValue();

      medicalRecordRepoMock.save = mock().resolves();

      const result = await service.createMedicalRecordDefault(medicalRecordProps);

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.have.property("staff", "Dr. Smith");
    });

    it("should fail to create a medical record with invalid data", async () => {
      const invalidProps = {
        date: null,
        staff: "",
        patientId: null,
        allergies: [],
        medicalConditions: [],
        descricao: [],
      };

      const result = await service.createMedicalRecordDefault(invalidProps);

      expect(result.isSuccess).to.be.false;
      expect(result.error).to.equal("date is null or undefined");
    });
  });

  describe("getMedicalRecordById", () => {
    it("should return a medical record by ID", async () => {
      const medicalRecordMock = MedicalRecord.create({
        date: new Date(),
        staff: "Dr. Smith",
        patientId: "12345",
        allergies: [],
        medicalConditions: [],
        descricao: ["General check-up"],
      }).getValue();

      medicalRecordRepoMock.findById = mock().resolves(medicalRecordMock);

      const result = await service.getMedicalRecordById("12345");

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.have.property("staff", "Dr. Smith");
    });

    it("should return an error if no medical record is found", async () => {
      medicalRecordRepoMock.findById = mock().resolves(null);

      const result = await service.getMedicalRecordById("12345");

      expect(result.isSuccess).to.be.false;
      expect(result.error).to.equal("MedicalRecord not found");
    });
  });

  describe("deleteMedicalRecord", () => {
    it("should delete a medical record by patient ID", async () => {
      const medicalRecordMock = MedicalRecord.create({
        date: new Date(),
        staff: "Dr. Smith",
        patientId: "12345",
        allergies: [],
        medicalConditions: [],
        descricao: ["General check-up"],
      }).getValue();

      medicalRecordRepoMock.findMedicalRecord = mock().resolves([medicalRecordMock]);
      medicalRecordRepoMock.delete = mock().resolves("Medical record successfully deleted");

      const result = await service.deleteMedicalRecord("12345");

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.equal("Medical Record was deleted");
    });

    it("should fail if no medical record is found", async () => {
      medicalRecordRepoMock.findMedicalRecord = mock().resolves([]);

      const result = await service.deleteMedicalRecord("12345");

      expect(result.isSuccess).to.be.false;
      expect(result.error).to.equal("Medical Record not found");
    });
  });

  describe("updateMedicalRecord", () => {
    it("should update a medical record successfully", async () => {
      const medicalRecordMock = MedicalRecord.create({
        date: new Date(),
        staff: "Dr. Smith",
        patientId: "12345",
        allergies: [],
        medicalConditions: [],
        descricao: ["General check-up"],
      }).getValue();

      const updateProps = {
        id: "11111",
        patientId: "12345",
        descricao: ["Updated description"],
        allergies: [],
        medicalConditions: [],
      };

      medicalRecordRepoMock.findMedicalRecord = mock().resolves([medicalRecordMock]);
      medicalRecordRepoMock.update = mock().resolves();

      const result = await service.updateMedicalRecord(updateProps);

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.have.property("descricao").that.includes("Updated description");
    });

    it("should fail to update if medical record not found", async () => {
      medicalRecordRepoMock.findMedicalRecord = mock().resolves([]);

      const updateProps = {
        id: "11111",
        patientId: "12345",      
        allergies: [],
        medicalConditions: [],
        descricao: ["Updated description"],
      };

      const result = await service.updateMedicalRecord(updateProps);

      expect(result.isSuccess).to.be.false;
      expect(result.error).to.equal("MedicalRecord not found");
    });
  });
});
