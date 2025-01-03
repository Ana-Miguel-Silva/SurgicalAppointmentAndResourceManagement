import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

import { Result } from "../core/logic/Result";
import { MedicalRecordId } from "./medicalRecordId";

import IMedicalRecordDTO from "../dto/IMedicalRecordDTO";
import { Guard } from "../core/logic/Guard";
import { IAllergieMedicalRecord } from "../dataschema/IAllergieMedicalRecord";
import { IMedicalRecordPersistence } from "../dataschema/IMedicalRecordPersistence";
import { IMedicalConditionPersistence } from "../dataschema/IMedicalConditionPersistence";
import { IMedicalConditionMedicalRecord } from "../dataschema/IMedicalConditionMedicalRecord";

interface MedicalRecordProps {
  date: Date;
  staff: string;
  patientId: string;
  allergies: IAllergieMedicalRecord[];
  medicalConditions: IMedicalConditionMedicalRecord[];
  descricao: string[]
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

  get allergies(): IAllergieMedicalRecord[] {
    return this.props.allergies;
  }

  set allergies(value: IAllergieMedicalRecord[]) {
    this.props.allergies = value;
  }

  get medicalConditions(): IMedicalConditionMedicalRecord[] {
    return this.props.medicalConditions;
  }

  set medicalConditions(value: IMedicalConditionMedicalRecord[]) {
    this.props.medicalConditions = value;
  }

  get descricao(): string[] {
    return this.props.descricao;
  }

  set descricao(value: string[]) {
    this.props.descricao = value;
  }

  public constructor(props: MedicalRecordProps, id?: UniqueEntityID) {
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
