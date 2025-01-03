import "reflect-metadata";
import { expect } from "chai";
import { mock } from "sinon";
import AllergieService from "./allergieService";
import IAllergieRepo from "./IRepos/IAllergieRepo";
import { Result } from "../core/logic/Result";
import { Allergie } from "../domain/allergie";
import { AllergieMap } from "../mappers/AllergieMap";
import IAllergieDTO from "../dto/IAllergieDTO";

describe("AllergieService", () => {
  let allergieRepoMock: IAllergieRepo;
  let service: AllergieService;

  beforeEach(() => {
    allergieRepoMock = mock();
    service = new AllergieService(allergieRepoMock);
  });

  describe("createAllergie", () => {
    it("should create a valid allergie", async () => {
      const allergieProps = {
        id: "111",
        designacao: "Peanut",
        descricao: "Severe nut allergy",
      };

      const allergieMock = Allergie.create(allergieProps).getValue();

      allergieRepoMock.save = mock().resolves();

      const result = await service.createAllergie(allergieProps);

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.have.property("designacao", "Peanut");
    });

    it("should fail to create allergie with invalid data", async () => {
      const invalidProps = {
        id: null,
        designacao: null,
        descricao: null,
      };

      const result = await service.createAllergie(invalidProps);

      expect(result.isSuccess).to.be.false;
      expect(result.error).to.equal("designacao is null or undefined");
    });
  });

  describe("updateAllergie", () => {
    it("should update an allergie successfully", async () => {
      const allergieProps = {
        designacao: "Peanut",
        descricao: "Severe nut allergy",
      };

      const updatedProps = {
        designacao: "Peanut",
        descricao: "Severe nut allergy",
      };

      const allergieMock = Allergie.create(allergieProps).getValue();
      allergieRepoMock.findByDesignacao = mock().resolves(allergieMock);
      allergieRepoMock.update = mock().resolves(allergieMock);

      const result = await service.updateAllergie("Peanut", updatedProps);

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.have.property("descricao", "Severe nut allergy");
    });

    it("should fail to update if allergie is not found", async () => {
      allergieRepoMock.findByDesignacao = mock().resolves(null);

      const updatedProps = {
        designacao: "Peanut",
        descricao: "Updated description",
      };

      const result = await service.updateAllergie("Peanut", updatedProps);

      expect(result.isSuccess).to.be.false;
      expect(result.error).to.equal("Allergie with designacao Peanut not found");
    });
  });

  describe("getAllergieByDesignacao", () => {
    it("should return an allergie by designacao", async () => {
      const allergieProps = {
        designacao: "Peanut",
        descricao: "Severe nut allergy",
      };

      const allergieMock = Allergie.create(allergieProps).getValue();
      allergieRepoMock.findByDesignacao = mock().resolves(allergieMock);

      const result = await service.getAllergyByDesignacao("Peanut");

      expect(result).to.be.an.instanceOf(Allergie);
      expect(result).to.have.property("designacao", "Peanut");
    });

    it("should return null if allergie is not found", async () => {
      allergieRepoMock.findByDesignacao = mock().resolves(null);

      const result = await service.getAllergyByDesignacao("Peanut");

      expect(result).to.be.null;
    });
  });

  describe("getAllergieById", () => {
    it("should return an allergie by ID", async () => {
      const allergieProps = {
        designacao: "Peanut",
        descricao: "Severe nut allergy",
      };

      const allergieMock = Allergie.create(allergieProps).getValue();
      allergieRepoMock.findById = mock().resolves(allergieMock);

      const result = await service.getAllergieById("12345");

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.have.property("designacao", "Peanut");
    });

    it("should fail if allergie is not found", async () => {
      allergieRepoMock.findById = mock().resolves(null);

      const result = await service.getAllergieById("12345");

      expect(result.isSuccess).to.be.false;
      expect(result.error).to.equal("Allergie not found");
    });
  });

  describe("getAllergies", () => {
    it("should return multiple allergies", async () => {
      const allergieProps = {
        designacao: "Peanut",
        descricao: "Severe nut allergy",
      };

      const allergieMock = Allergie.create(allergieProps).getValue();
      allergieRepoMock.findAllergies = mock().resolves([allergieMock]);

      const result = await service.getAllergies("Peanut");

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.be.an("array").that.has.lengthOf(1);
    });

    it("should return an error if no allergies are found", async () => {
      allergieRepoMock.findAllergies = mock().resolves([]);

      const result = await service.getAllergies("Peanut");

      expect(result.isSuccess).to.be.false;
      expect(result.error).to.equal("Allergie not found");
    });
  });

  describe("getAllergieId", () => {
    it("should return allergie ID", async () => {
      allergieRepoMock.getAllergieId = mock().resolves("12345");

      const result = await service.getAllergieId("Peanut");

      expect(result).to.equal("12345");
    });

    it("should return error if allergie ID is not found", async () => {
      allergieRepoMock.getAllergieId = mock().resolves(null);

      const result = await service.getAllergieId("Peanut");

      expect(result).to.equal("Allergie not found");
    });
  });
});
