import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

import { Result } from "../core/logic/Result";

import { Guard } from "../core/logic/Guard";
import { forEach } from "lodash";

export enum AllergyStatus {
  Active = 'Ativo',
  NotMeaningfulAnymore = 'Not Meaningful Anymore',
  Misdiagnosed = 'Misdiagnosed'
}