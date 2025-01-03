# US 6.2.19


## 1. Context

As part of the development of the software system, it is necessary to implement user management functionalities within the administrative interface. These functionalities are essential to allow administrators to edit existing operation types, to update or correct information. 
This is the first time this task has been assigned for development.

## 2. Requirements

**US 6.2.19** As an Admin, I want to edit existing operation types, so that I can update or correct
information about the procedure.

**Acceptance Criteria:** 

- Admins can search for and select an existing operation type to edit.

- Editable fields include operation name, required staff by specialization, and estimated
duration.

- Changes are reflected in the system immediately for future operation requests.

- Historical data is maintained, but new operation requests will use the updated operation type
information.

**Customer Specifications and Clarifications:**

> **Question:**Can you clarify? "Historical data is maintained, but new operation requests will use the updated operation type information."
>
> **Answer:** It means that if an operation type is changed we need to keep track of its changes. For instance,Operation Type "A" is defined as taking 30 minutes preparation, 1h surgery and 30 minutes cleaning with a team of 1 doctor with specialization X and one nurse with specialization Y some operations are requested, scheduled and performed based on this definition after sometime, the hospital changes its procedures and defines the operation type "A" as needing 30 min prep, 30 min. surgery and 30 min. cleaning, with a team of 3 doctors and one nurse.New operations will be requested, scheduled and performed using this new definition, however, we need to keep historical data, so that if the admin wants to know the details of an operation in the past, the system must show the operation type as it was defined at the time of the operation request.


> **Question:** If the operation type already has a specialization associated, how can we have staff with different specializations?
>What do you understand by specialization? Is it cardiology/orthopedics? Or anaesthesist/circulating/...
>
> **Answer:** The operation is mainly associated with one specialization, but for a specific operation it might require a team with multiple specializations.
>Cardiology, orthopedics, anaesthesist are specializations that either doctors or nurses can have.
>The circulating technician is a different type of medical professional. for now the system doesn't need to support technicians






**Dependencies/References:**

* There is a dependency to "US 5.1.1 - As an Admin, I want to register new backoffice users (e.g., doctors, nurses, technicians, admins) via an out-of-band process, so that they can access the
backoffice system with appropriate permissions."

* There is a dependency to "5.1.20 As an Admin, I want to add new types of operations, so that I can reflect the available medical procedures in the system."

* There is a dependency to "6.2.18 As an Admin, I want to add new types of operations, so that I can reflect the available medical procedures in the system."


**Input and Output Data**

**Input Data:**

* Typed data:
    * Name
    * RequiredStaff
    * EstimatedDuration


* Selected data:
    


**Output Data:**
* Display the success of the operation and the changed data.

## 3. Analysis

> **Question 1:**
>
> **Answer 1:**


## 4. Design


**Domain Class/es:** OperationTypes

**Controller:** OperationTypesController

**UI:** Admin.component.html

**Repository:**	OperationTypesRepository

**Service:** OperationTypesService



### 4.1. Sequence Diagram

#### Edit OperationType

**Sequence Diagram Level 1**

![Sequence Diagram Level 1](sequence-diagram-1.svg "Actor and System")

**Sequence Diagram Level 2**

![Sequence Diagram Level 2](sequence-diagram-2.svg "FrontEnd and BackEnd")

**Sequence Diagram Level 3**

![Sequence Diagram Level 3](sequence-diagram-3.svg "Edit OperationType")





### 4.2. Applied Patterns

### 4.3. Tests

Include here the main tests used to validate the functionality. Focus on how they relate to the acceptance criteria.



**Json**

```
    {
        "id": "{{operationTypeId}}",
        "name": "GYNECOLOGY",
        "requiredStaff": [
            {
                "quantity": 6,
                "specialization": "Lung",
                "role": "Doctor"
            },
            {
                "quantity": 3,
                "specialization": "Heart",
                "role": "Doctor"
            },
            {
                "quantity": 2,
                "specialization": "Lung",
                "role": "Nurse"
            }
        ],
        "estimatedDuration": {
            "patientPreparation": "00:30:00",
            "surgery": "02:30:00",
            "cleaning": "00:55:00"
        }
}

```

**Test 1:**


```
// Check that the response status code is 200 (OK)
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});
````


[//]: # (## 5. Implementation)

[//]: # ()
[//]: # ()
[//]: # (### Methods in the ListUsersController)

[//]: # (* **Iterable<SystemUser> filteredUsersOfBackOffice&#40;&#41;**  this method filters to list all backoffice users)

[//]: # ()
[//]: # ()
[//]: # ()
[//]: # (### Methods in the AddUsersController)

[//]: # ()
[//]: # (* **Role[] getRoleTypes&#40;&#41;** this method list the roles to choose for the User)

[//]: # ()
[//]: # (* **SystemUser addUser&#40;final String email, final String password, final String firstName,)

[//]: # (  final String lastName, final Set<Role> roles, final Calendar createdOn&#41;**  this method send the information to create the User.)

[//]: # ()
[//]: # (* **String generatePassword&#40;&#41;** this method automatically generate a password for the User. )

[//]: # ()
[//]: # ()
[//]: # ()
[//]: # (### Methods in the DeactivateUsersController)

[//]: # ()
[//]: # (* **Iterable<SystemUser> activeUsers&#40;&#41;** this method list all the activated Users. )

[//]: # ()
[//]: # (* **Iterable<SystemUser> deactiveUsers&#40;&#41;** this method list all the deactivated Users.)

[//]: # ()
[//]: # (* **SystemUser activateUser&#40;final SystemUser user&#41;** this method activate the chosen User.)

[//]: # ()
[//]: # (* **SystemUser deactivateUser&#40;final SystemUser user&#41;** this method deactivate the chosen User. )

[//]: # ()
[//]: # ()
[//]: # (## 6. Integration/Demonstration)



[//]: # (## 7. Observations)

[//]: # ()
[//]: # (*This section should be used to include any content that does not fit any of the previous sections.*)

[//]: # ()
[//]: # (*The team should present here, for instance, a critical perspective on the developed work including the analysis of alternative solutions or related works*)

[//]: # ()
[//]: # (*The team should include in this section statements/references regarding third party works that were used in the development this work.*)