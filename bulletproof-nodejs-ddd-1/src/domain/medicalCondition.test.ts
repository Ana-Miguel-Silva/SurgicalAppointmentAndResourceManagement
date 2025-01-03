import { expect } from "chai";
import { MedicalCondition } from "../domain/medicalCondition"; 
import { MedicalConditionId, UniqueEntityID } from "../domain/medicalConditionId"; 
import { Result } from "../core/logic/Result"; 
import "reflect-metadata"; 
import { Guard } from "../core/logic/Guard"; 

describe('MedicalCondition Domain', () => {
  let validProps: any;
  let invalidProps: any;

  beforeEach(() => {
    validProps = {
      codigo: "A123",
      designacao: "Condition Name",
      descricao: "Description of the condition",
      sintomas: ["Symptom 1", "Symptom 2"]
    };

    invalidProps = {
      codigo: "",
      designacao: "",
      descricao: "",
      sintomas: []
    };
  });

  it('should create a valid MedicalCondition instance', () => {
    const result = MedicalCondition.create(validProps);

    expect(result.isSuccess).to.be.true;
    const medicalCondition = result.getValue();
    expect(medicalCondition).to.be.an.instanceOf(MedicalCondition);
    expect(medicalCondition.codigo).to.equal(validProps.codigo);
    expect(medicalCondition.designacao).to.equal(validProps.designacao);
  });

  it('should have valid getters and setters', () => {
    const medicalCondition = MedicalCondition.create(validProps).getValue();

    expect(medicalCondition.codigo).to.equal(validProps.codigo);
    expect(medicalCondition.designacao).to.equal(validProps.designacao);
    expect(medicalCondition.descricao).to.equal(validProps.descricao);
    expect(medicalCondition.sintomas).to.deep.equal(validProps.sintomas);

    medicalCondition.codigo = "B456";
    medicalCondition.designacao = "Updated Name";
    medicalCondition.descricao = "Updated description";
    medicalCondition.sintomas = ["Updated symptom"];

    expect(medicalCondition.codigo).to.equal("B456");
    expect(medicalCondition.designacao).to.equal("Updated Name");
    expect(medicalCondition.descricao).to.equal("Updated description");
    expect(medicalCondition.sintomas).to.deep.equal(["Updated symptom"]);
  });


  it('should have the correct id for the condition', () => {
    const medicalCondition = MedicalCondition.create(validProps).getValue();

    const id = medicalCondition.id;
    expect(id).to.not.be.undefined;
    expect(id).to.be.an.instanceOf(UniqueEntityID);    
  });
});
