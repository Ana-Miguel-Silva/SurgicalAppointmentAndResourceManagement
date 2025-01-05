# US 7.2.10


## 1. Context

As an Admin, I want to add new Types of rooms, so that I can reflect on the available medical procedures in the system

## 2. Requirements

**US 7.2.10** As an Admin, I want to add new Types of rooms, so that I can reflect on the available medical procedures in the system

**Dependencies/References:**


* There is a dependency to "US 5.1.1- As an Admin, I want to register new backoffice users (e.g., doctors, nurses, technicians, admins) via an out-of-band process, so that they can access the
backoffice system with appropriate permissions."

* There is a dependency to "US 5.1.6- As a (non-authenticated) Backoffice User, I want to log in to the system using my credentials, so that I can access the backoffice features according to my assigned role."


**Input and Output Data**

**Input Data:**

* Typed data:
    * Code
    * Designation
    * Description
    * SurgerySuitable


**Output Data:**
* Display the success of the operation



## 4. Design


**Domain Class/es:** RoomTypes, RoomTypeId

**Controller:** RoomTypesController

**UI:** Admin.component.html

**Repository:** RoomTypesRepository

**Service:** RoomTypesService, AuthorizationService



### 4.1. Sequence Diagram

#### Create RoomTypes

**Sequence Diagram Level 1**

![Sequence Diagram Level 1](sequence-diagram-1.svg "Actor and System")

**Sequence Diagram Level 2**

![Sequence Diagram Level 2](sequence-diagram-2.svg "FrontEnd and BackEnd")

**Sequence Diagram Level 3**

![Sequence Diagram Level 3](sequence-diagram-3.svg "Creat RoomTypes")

