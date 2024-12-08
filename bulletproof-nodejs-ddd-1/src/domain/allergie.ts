import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

import { Result } from "../core/logic/Result";
import { AllergieId } from "./allergieId";

import IAllergieDTO from "../dto/IAllergieDTO";
import { Guard } from "../core/logic/Guard";
import { forEach } from "lodash";

interface AllergieProps {
  designacao: string;
  descricao: string;
}

export class Allergie extends AggregateRoot<AllergieProps> {

  
  get id(): UniqueEntityID {
    return this._id;
  }

  get allergieId(): AllergieId {
    return AllergieId.caller(this.id)
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

  private constructor(props: AllergieProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create (props: AllergieProps, id?: UniqueEntityID): Result<Allergie> {

    const guardedProps = [
      { argument: props.designacao, argumentName: 'designacao' },
      { argument: props.descricao, argumentName: 'descricao' }
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<Allergie>(guardResult.message)
    }     
    else {
      const allergie = new Allergie({
        ...props
      }, id);
      

      return Result.ok<Allergie>(allergie);
    }
  }
}
