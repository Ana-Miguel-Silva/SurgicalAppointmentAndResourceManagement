import "reflect-metadata";
import { expect } from "chai";
import { mock } from "sinon";
import MedicalConditionService from "./medicalConditionService";
import { MedicalCondition } from "../domain/medicalCondition";
import { Result } from "../core/logic/Result";
import IMedicalConditionRepo from "./IRepos/IMedicalConditionRepo";
import IMedicalConditionService from "./IServices/IMedicalConditionService";
import { MedicalConditionMap } from "../mappers/MedicalConditionMap";
import IMedicalConditionDTO from "../dto/IMedicalConditionDTO";

describe("MedicalConditionService", () => {
  let medicalConditionRepoMock: IMedicalConditionRepo;
  let service: MedicalConditionService;

  beforeEach(() => {
    medicalConditionRepoMock = mock();
    service = new MedicalConditionService(medicalConditionRepoMock);
  });

  describe("createMedicalConditionDefault", () => {
    it("should create a valid medical condition", async () => {
      const medicalConditionProps = {
        codigo: "C001",
        descricao: "Hypertension",
        designacao: "High Blood Pressure",
        sintomas: ["Headache", "Fatigue"],
      };

      const medicalConditionMock = MedicalCondition.create(medicalConditionProps).getValue();

      medicalConditionRepoMock.save = mock().resolves();

      const result = await service.createMedicalConditionDefault(medicalConditionProps);

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.have.property("designacao", "High Blood Pressure");
    });

    it("should fail to create a medical condition with invalid data", async () => {
      const invalidProps = {
        codigo: null,
        descricao: "",
        designacao: null,
        sintomas: [],
      };

      const result = await service.createMedicalConditionDefault(invalidProps);

      expect(result.isSuccess).to.be.false;
      expect(result.error).to.equal("codigo is null or undefined");
    });
  });

  describe("getMedicalConditionById", () => {
    it("should return a medical condition by ID", async () => {
      const medicalConditionMock = MedicalCondition.create({
        codigo: "C001",
        descricao: "Hypertension",
        designacao: "High Blood Pressure",
        sintomas: ["Headache", "Fatigue"],
      }).getValue();

      medicalConditionRepoMock.findById = mock().resolves(medicalConditionMock);

      const result = await service.getMedicalConditionById("C001");

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.have.property("designacao", "High Blood Pressure");
    });

    it("should return an error if medical condition not found", async () => {
      medicalConditionRepoMock.findById = mock().resolves(null);

      const result = await service.getMedicalConditionById("C001");

      expect(result.isSuccess).to.be.false;
      expect(result.error).to.equal("Medical Condition not found");
    });
  });

  describe("updateMedicalConditionById", () => {
    it("should update a medical condition successfully", async () => {
      const medicalConditionMock = MedicalCondition.create({
        codigo: "C001",
        descricao: "Hypertension",
        designacao: "High Blood Pressure",
        sintomas: ["Headache", "Fatigue"],
      }).getValue();

      const updateProps = {
        descricao: "Chronic Hypertension",
        designacao: "Severe High Blood Pressure",
        sintomas: ["Severe headache", "Dizziness"],
      };

      medicalConditionRepoMock.findById = mock().resolves(medicalConditionMock);
      medicalConditionRepoMock.save = mock().resolves(medicalConditionMock);

      const result = await service.updateMedicalConditionById("C001", updateProps);

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.have.property("designacao", "Severe High Blood Pressure");
    });

    it("should fail to update if medical condition not found", async () => {
      medicalConditionRepoMock.findById = mock().resolves(null);

      const updateProps = {
        descricao: "Chronic Hypertension",
        designacao: "Severe High Blood Pressure",
        sintomas: ["Severe headache", "Dizziness"],
      };

      const result = await service.updateMedicalConditionById("C001", updateProps);

      expect(result.isSuccess).to.be.false;
      expect(result.error).to.equal("Medical Condition not found");
    });
  });

  describe("getMedicalCondition", () => {
    it("should return medical condition details by ID", async () => {
      const medicalConditionMock = MedicalCondition.create({
        codigo: "C001",
        descricao: "Hypertension",
        designacao: "High Blood Pressure",
        sintomas: ["Headache", "Fatigue"],
      }).getValue();

      medicalConditionRepoMock.findMedicalCondition = mock().resolves([medicalConditionMock]);

      const result = await service.getMedicalCondition("C001");

      expect(result.isSuccess).to.be.true;    
    });

    it("should fail to get medical condition if not found", async () => {
      medicalConditionRepoMock.findMedicalCondition = mock().resolves([]);

      const result = await service.getMedicalCondition("C001");

      expect(result.isSuccess).to.be.false;
      expect(result.error).to.equal("MedicalCondition not found");
    });
  });

  describe("getMedicalConditionId", () => {
    it("should return medical condition ID", async () => {
      const medicalConditionMock = MedicalCondition.create({
        codigo: "C001",
        descricao: "Hypertension",
        designacao: "High Blood Pressure",
        sintomas: ["Headache", "Fatigue"],
      }).getValue();

      medicalConditionRepoMock.findById = mock().resolves(medicalConditionMock);

      const result = await service.getMedicalConditionById("C001");

      expect(result.isSuccess).to.be.true;
    });

    it("should fail to get medical condition ID if not found", async () => {
      medicalConditionRepoMock.findById = mock().resolves(null);

      const result = await service.getMedicalConditionById("C001");

      expect(result.isSuccess).to.be.false;
      expect(result.error).to.equal("Medical Condition not found");
    });
  });

  describe("getMedicalConditionAll", () => {
    it("should return all medical conditions", async () => {
      const medicalConditionMock = MedicalCondition.create({
        codigo: "C001",
        descricao: "Hypertension",
        designacao: "High Blood Pressure",
        sintomas: ["Headache", "Fatigue"],
      }).getValue();

      medicalConditionRepoMock.findMedicalCondition = mock().resolves([medicalConditionMock]);

      const result = await service.getMedicalConditionAll("C001");

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.have.lengthOf(1);
    });

    it("should fail if no medical condition is found", async () => {
      medicalConditionRepoMock.findMedicalCondition = mock().resolves([]);

      const result = await service.getMedicalConditionAll("C001");

      expect(result.isSuccess).to.be.false;
      expect(result.error).to.equal("MedicalCondition not found");
    });
  });
});
