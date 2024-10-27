# US 5.1.14


## 1. Context

As part of the development of the software system, it is necessary to implement functionality that allows administrators to deactivate a Staff Profile. This is the first time this task has been assigned for development.

## 2. Requirements

**US 5.1.14** 

**Acceptance Criteria:** 

- Admins can search for and select a staff profile to deactivate.
- Deactivating a staff profile removes them from the active roster, but their historical data (e.g., appointments) remains accessible.
- The system confirms deactivation and records the action for audit purposes.



**Dependencies/References:**

* There is a dependency to "5.1.12", since it is necessary to have a Staff Profile in order to deactivate it.

**Input and Output Data**

**Input Data:**

* Selected data:
    * Staff Profile 


**Output Data:**
* Display the success of the operation.

## 3. Analysis

## 4. Design


**Domain Class/es:** Staff

**Controller:** StaffController

**UI:** None

**Repository:**	StaffRepository

**Service:** StaffService, AuthorizationService



### 4.1. Sequence Diagram

**Level One**

![Level One](level_one.svg "Level One")

**Level Two**

![Level Two](level_two.svg "Level Two")

**Level Three**

![Level Three](level_three.svg "Level Three")




## 5. Implementation


### Methods in StaffController
* **Task<ActionResult<StaffDto>> SoftDelete(string id)**  this method receives the info from the API and redirects it to the Service

### Methods in the StaffService
* **Task<StaffDto> InactivateAsync(string id)** this method deactivates a Staff Profile

### Methods in the StaffRepository
* **Task<StaffProfile> GetByStaffIDAsync(id)** this method retrieves a Staff Profile from the database by its ID

### Methods in the StaffProfile
* **void MarkAsInative()** this method updates the StaffProfile's active attribute

