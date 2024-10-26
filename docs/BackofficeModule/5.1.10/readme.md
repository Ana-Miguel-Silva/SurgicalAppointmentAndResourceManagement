# US 5.1.10


## 1. Context

As an Admin, I want to delete a patient profile, so that I can remove patients who are no longer under care
## 2. Requirements

**US 5.1.10** 

**Acceptance Criteria:** 

- Admins can search for a patient profile and mark it for deletion.
- Before deletion, the system prompts the admin to confirm the action.
- Once deleted, all patient data is permanently removed from the system within a predefined time frame.
- The system logs the deletion for audit and GDPR compliance purposes.

**Customer Specifications and Clarifications:**

> **Question 1:**
>
> **Answer 1:** 


**Dependencies/References:**

[//]: # (* There is a dependency to "USG007:  "As a Project Manager, I want the system to support and apply authentication and authorization for all its users and functionalities.", since is necessary to be able to Sign Up as admin to create others Users.)

**Input and Output Data**

**Input Data:**

* Typed data:
    * Id


**Output Data:**
* Display the success of the operation and the data of the deleted patient (Delete Patient)

## 3. Analysis

> **Question 1:**
>
> **Answer 1:** 

### 3.1. Domain Model
![sub domain model](us1000-sub-domain-model.svg)

## 4. Design


**Domain Class/es:** E-mail, SystemUser

**Controller:** DeactivateUserController, AddUserController, ListUserController

**UI:** DeactivateUserUI, AddUserUI, ListUserUI

**Repository:**	UserRepository

**Service:** UserManagementService, AuthorizationService



### 4.1. Sequence Diagram

#### Delete Patient Profile

**Sequence Diagram Level 1**

![Sequence Diagram Level 1](sequence-diagram-1.svg "Actor and System")

**Sequence Diagram Level 2**

![Sequence Diagram Level 2](sequence-diagram-2.svg "FrontEnd and BackEnd")

**Sequence Diagram Level 3**

![Sequence Diagram Level 3](sequence-diagram-3.svg "Delete Patient Profile")




### 4.2. Applied Patterns

### 4.3. Tests

Include here the main tests used to validate the functionality. Focus on how they relate to the acceptance criteria.



**Before Tests** **Setup of Dummy Users**

```
    public static SystemUser dummyUser(final String email, final Role... roles) {
        final SystemUserBuilder userBuilder = new SystemUserBuilder(new NilPasswordPolicy(), new PlainTextEncoder());
        return userBuilder.with(email, "duMMy1", "dummy", "dummy", email).build();
    }

    public static SystemUser crocodileUser(final String email, final Role... roles) {
        final SystemUserBuilder userBuilder = new SystemUserBuilder(new NilPasswordPolicy(), new PlainTextEncoder());
        return userBuilder.with(email, "CroC1_", "Crocodile", "SandTomb", email).withRoles(roles).build();
    }

    private SystemUser getNewUserFirst() {
        return dummyUser("dummy@gmail.com", Roles.ADMIN);
    }

    private SystemUser getNewUserSecond() {
        return crocodileUser("crocodile@gmail.com", Roles.OPERATOR);
    }

```

**Test 1:** *Verifies if Users are equals*


```
@Test
public void verifyIfUsersAreEquals() {
    assertTrue(getNewUserFirst().equals(getNewUserFirst()));
}
````


## 5. Implementation


### Methods in the ListUsersController
* **Iterable<SystemUser> filteredUsersOfBackOffice()**  this method filters to list all backoffice users



### Methods in the AddUsersController

* **Role[] getRoleTypes()** this method list the roles to choose for the User

* **SystemUser addUser(final String email, final String password, final String firstName,
  final String lastName, final Set<Role> roles, final Calendar createdOn)**  this method send the information to create the User.

* **String generatePassword()** this method automatically generate a password for the User. 



### Methods in the DeactivateUsersController

* **Iterable<SystemUser> activeUsers()** this method list all the activated Users. 

* **Iterable<SystemUser> deactiveUsers()** this method list all the deactivated Users.

* **SystemUser activateUser(final SystemUser user)** this method activate the chosen User.

* **SystemUser deactivateUser(final SystemUser user)** this method deactivate the chosen User. 


## 6. Integration/Demonstration



[//]: # (## 7. Observations)

[//]: # ()
[//]: # (*This section should be used to include any content that does not fit any of the previous sections.*)

[//]: # ()
[//]: # (*The team should present here, for instance, a critical perspective on the developed work including the analysis of alternative solutions or related works*)

[//]: # ()
[//]: # (*The team should include in this section statements/references regarding third party works that were used in the development this work.*)