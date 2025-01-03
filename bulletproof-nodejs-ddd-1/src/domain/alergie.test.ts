import "reflect-metadata";
import { expect } from "chai";
import { Allergie } from "../../src/domain/allergie";
import { Result } from "../../src/core/logic/Result";
import IAllergieDTO from "../../src/dto/IAllergieDTO";

describe("Allergie Domain", () => {
  it("should create a valid Allergie instance", () => {
    const allergieDTO: IAllergieDTO = {
      id: "12345",
      designacao: "Pollen Allergie",
      descricao: "Allergie caused by pollen",
    };

    const result = Allergie.create(allergieDTO);

    expect(result.isSuccess).to.be.true;
    const allergie = result.getValue();
    expect(allergie.designacao).to.equal(allergieDTO.designacao);
    expect(allergie.descricao).to.equal(allergieDTO.descricao);
  });

  it("should sucess to create an Allergie if designacao is empty", () => {
    const allergieDTO: IAllergieDTO = {
      id: "12345",
      designacao: "", 
      descricao: "Allergie caused by pollen",
    };

    const result = Allergie.create(allergieDTO);

    expect(result.isSuccess).to.be.true;
  });

  it("should sucess to create an Allergie if descricao is empty", () => {
    const allergieDTO: IAllergieDTO = {
      id: "12345",
      designacao: "Pollen Allergie",
      descricao: "",
    };

    const result = Allergie.create(allergieDTO);

    expect(result.isSuccess).to.be.true;   
  });
 
});
