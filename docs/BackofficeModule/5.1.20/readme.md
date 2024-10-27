# US 5.1.20

## 1. Context

As an Admin, I want to add new types of operations, so that I can reflect on the available medical procedures in the
system.

## 2. Requirements

**US 5.1.20**

**Acceptance Criteria:**

- Admins can add new operation types with attributes like:
- Operation Name
- Required Staff by Specialization
- Estimated Duration
- The system validates that the operation name is unique.
- The system logs the creation of new operation types and makes them available for scheduling
  immediately.

**Customer Specifications and Clarifications:**

> **Question:In the document with the surgeries, they all have 3 phases and respective duration:-Anesthesia/patient
preparation -Surgery -Cleaning Can we assume while creating a new operation type, that the surgery must always have this
3 phases?**
>
> **Answer:yes**
> **Question:Na criação de um novo tipo de operação, Temos um nome , 3 fases temporal da Cirurgia, lista "requeridas"
> de (especialidades, quantidade ). Esse novo tipo de operação não deve ter uma especialidade para alem das requeridas
> de
> modo segundo 5.1.16 AC2 um médico só pode marcar Cirurgia da sua especialidade? O processo é criar o novo tipo de
> operação e depois adicionar a lista de especialidades requeridas?
>
> **Answer: sim. o tipo de operação está associado com uma dada especialidade. a lista de especialidaes faz parte
integrante do tipo de operação. a criação é efetuada num único passo e não em dois passos como sugeres**

**Dependencies/References:**

**There are dependencies to 5.1.1.**

* US 5.1.1 - There is the need to be logged and authenticated in the system in order to know it is an Admin.

**Input and Output Data**

**Input Data:**

* Typed data:
    * Name
    * Required Staff
    * Estimated Duration

* Selected data:
    * none

* Generated data:
    * Operation Type Id

**Output Data:**

* Display the success of the operation and the data of the created operation type

## 3. Design

**Domain Class/es:** OperationType, OperationTypeDto, OperationTypeDto, OperationTypeId,
IOperationTypeRepository, ILogRepository, IOperationTypeRepository, EstimatedDuration, RequiredStaff

**Controller:** OperationTypeController

**UI:**

**Repository:**    OperationTypeRepository, LogRepository, OperationTypeRepository

**Service:** OperationTypeService, AuthorizationService, LogService

### 3.1. Sequence Diagram

**Register Patient Level 1**
![Register Operation Request](sequence-diagram-1.svg "Register Operation Request")

**Register Patient Level 2**
![Register Operation Request](sequence-diagram-2.svg "Register Operation Request")

**Register Patient Level 3**
![Register Operation Request](sequence-diagram-3.svg "Register Operation Request")



