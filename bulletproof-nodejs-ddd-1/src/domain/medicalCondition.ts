import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

import { Result } from "../core/logic/Result";
import { MedicalConditionId } from "./medicalConditionId";

import IMedicalConditionDTO from "../dto/IMedicalConditionDTO";
import { Guard } from "../core/logic/Guard";

interface MedicalConditionProps {
  codigo: string;
  designacao: string;
  descricao: string;
  sintomas: string[];
}

export class MedicalCondition extends AggregateRoot<MedicalConditionProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get MedicalConditionId(): MedicalConditionId {
    return MedicalConditionId.caller(this.id)
  }

  get codigo(): string {
    return this.props.codigo;
  }

  set codigo(value: string) {
    this.props.codigo = value;
  }
  get designacao(): string {
    return this.props.designacao;
  }

  set designacao(value: string) {
    this.props.designacao = value;
  }

  get descricao(): string {
    return this.props.descricao;
  }

  set descricao(value: string) {
    this.props.descricao = value;
  }
  get sintomas(): string[] {
    return this.props.sintomas;
  }

  set sintomas(value: string[]) {
    this.props.sintomas = value;
  }

  private constructor(props: MedicalConditionProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create (props: MedicalConditionProps, id?: UniqueEntityID): Result<MedicalCondition> {

    const guardedProps = [
      { argument: props.codigo, argumentName: 'codigo' },
      { argument: props.codigo, argumentName: 'designacao' },
      { argument: props.codigo, argumentName: 'descricao' },
      { argument: props.descricao, argumentName: 'sintomas' }
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<MedicalCondition>(guardResult.message)
    }     
    else {
      const user = new MedicalCondition({
        ...props
      }, id);

      return Result.ok<MedicalCondition>(user);
    }
  }
}
