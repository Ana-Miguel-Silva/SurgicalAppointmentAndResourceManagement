import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

import { Result } from "../core/logic/Result";
import { MedicalRecordId } from "./medicalRecordId";

import IMedicalRecordDTO from "../dto/IMedicalRecordDTO";
import { Guard } from "../core/logic/Guard";

interface MedicalRecordProps {
  date: Date;
  staff: string;
  patientId: string;
  allergies: string[]; 
  medicalConditions: string[];
  descricao: string  
}

export class MedicalRecord extends AggregateRoot<MedicalRecordProps> {
  get id(): UniqueEntityID {
    return this._id;
  }


  get medicalRecordId(): MedicalRecordId {
    return MedicalRecordId.caller(this.id)
  }

  get date(): Date {
    return this.props.date;
  }

  set date(value: Date) {
    this.props.date = value;
  }

  get staff(): string {
    return this.props.staff;
  }

  set staff(value: string) {
    this.props.staff = value;
  }

  get patientId(): string {
    return this.props.patientId;
  }

  set patientId(value: string) {
    this.props.patientId = value;
  }

  get allergies(): string[] {
    return this.props.allergies;
  }

  set allergies(value: string[]) {
    this.props.allergies = value;
  }

  get medicalConditions(): string[] {
    return this.props.medicalConditions;
  }

  set medicalConditions(value: string[]) {
    this.props.medicalConditions = value;
  }

  get descricao(): string {
    return this.props.descricao;
  }

  set descricao(value: string) {
    this.props.descricao = value;
  }

  private constructor(props: MedicalRecordProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create (props: MedicalRecordProps, id?: UniqueEntityID): Result<MedicalRecord> {

    const guardedProps = [
      { argument: props.date, argumentName: 'date' },
      { argument: props.staff, argumentName: 'staff' },
      { argument: props.patientId, argumentName: 'patientId' },
      { argument: props.medicalConditions, argumentName: 'MedicalConditions' },
      { argument: props.allergies, argumentName: 'allergies' },      
      { argument: props.descricao, argumentName: 'descricao' }
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<MedicalRecord>(guardResult.message)
    }     
    else {
      const user = new MedicalRecord({
        ...props
      }, id);

      return Result.ok<MedicalRecord>(user);
    }
  }
  

  
}
