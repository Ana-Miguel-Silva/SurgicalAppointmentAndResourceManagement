# US 5.1.12


## 1. Context

As part of the development of the software system, it is necessary to implement functinality that allows administrators to create new Staff Profiles. This is the first time this task has been assigned for development.

## 2. Requirements

**US 5.1.12** 

**Acceptance Criteria:** 

- Admins can input staff details such as first name, last name, contact information, and specialization.
- A unique staff ID (License Number) is generated upon profile creation.
- The system ensures that the staff's email and phone number are unique.
- The profile is stored securely, and access is based on role-based permissions.

**Customer Specifications and Clarifications:**

> **Question:** How should the specialization be assigned to a staff? Should the admin write it like a first name? Or should the admin select the specialization?
>
> **Answer:** the system has a list of specializations. staff is assigned a specialization from that list

> **Question:** Can a doctor haver more than one Expertise?
>
> **Answer:** no. consider only one specialization per doctor

> **Question:** Are healthcare staff IDs unique across roles? 
>
> **Answer:** Yes, staff IDs are unique and not role-specific (e.g., a doctor and nurse can share the same ID format).


**Dependencies/References:**

* There is a dependency to "XX:  XXXX, since it is necessary to be able to Sign Up as admin to create a new Staff Profile.

**Input and Output Data**

**Input Data:**

* Typed data:
    * First Name
    * Last Name
    * Contact Information
        * E-mail
        * Phone number


* Selected data:
    * Specialization

* Generated data:
    * License number


**Output Data:**
* Display the success of the operation and the data of the registered Staff Profile

## 3. Analysis


### 3.1. Domain Model
![sub domain model](us1000-sub-domain-model.svg)

## 4. Design


**Domain Class/es:** E-mail, Staff

**Controller:** AddStaffProfileController

**UI:** 

**Repository:**	StaffRepository

**Service:** 



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