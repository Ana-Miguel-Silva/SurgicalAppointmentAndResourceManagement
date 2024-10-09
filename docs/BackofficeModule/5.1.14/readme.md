# US 5.1.14


## 1. Context

As part of the development of the software system, it is necessary to implement functinality that allows administrators to deactivate a Staff Profile. This is the first time this task has been assigned for development.

## 2. Requirements

**US 5.1.14** 

**Acceptance Criteria:** 

- Admins can search for and select a staff profile to deactivate.
- Deactivating a staff profile removes them from the active roster, but their historical data (e.g., appointments) remains accessible.
- The system confirms deactivation and records the action for audit purposes.

**Customer Specifications and Clarifications:**

> **Question 23:**
>
> **Answer:** 


**Dependencies/References:**

* There is a dependency to "XX:  XXXX, since it is necessary to be able to Sign Up as admin to deacitvate a Staff Profile.

**Input and Output Data**

**Input Data:**

* Selected data:
    * Staff Profile 


**Output Data:**
* Display the success of the operation.

## 3. Analysis

> **Question 97:** US1000 – Regarding user registration, should these all be considered "enable" by default or should there be an option to "enable/disable" users during the registration process?
>
> **Answer:** In the context of the US1000 it should be possible to activate and deactivate users. I suppose they should be active by default.

### 3.1. Domain Model
![sub domain model](us1000-sub-domain-model.svg)

## 4. Design


**Domain Class/es:** E-mail, SystemUser

**Controller:** DeactivateUserController, AddUserController, ListUserController

**UI:** DeactivateUserUI, AddUserUI, ListUserUI

**Repository:**	UserRepository

**Service:** UserManagementService, AuthorizationService



### 4.1. Sequence Diagram

**Register User**
![Register User](us1000-sequence-diagram-register.svg "Register User")




### 4.2. Class Diagram

![a class diagram](us1000-class-diagram.svg "A Class Diagram")

### 4.3. Applied Patterns

### 4.4. Tests

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