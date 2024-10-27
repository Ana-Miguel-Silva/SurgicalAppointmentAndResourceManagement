# US 5.1.9


## 1. Context

As an Admin, I want to edit an existing patient profile, so that I can update their information when needed.

## 2. Requirements

**US 5.1.9** 

**Acceptance Criteria:** 

- Admins can search for and select a patient profile to edit.
- Editable fields include name, contact information, medical history, and allergies. 
- Changes to sensitive data (e.g., contact information) trigger an email notification to the patient. 
- The system logs all profile changes for auditing purposes.

**Customer Specifications and Clarifications:**

> **Question 1: Hello Client, When one of the contents that administrator edits is a sensitive content (eg. email), the notification is sent for what patient's email, the email in patient account, the old email of patient or the new email of patient?**
> 
> **Answer 1: If the email is changed, the notification should be sent to the "old" email** 

> **Question 2: No caderno de encargos, nos critérios de aceitação da us 5.1.9 está escrito o seguinte: "Editable fields include name, contact information, medical history, and allergies.". Sendo assim, este critério de aceitação não deveria ser apenas os parâmetros que ele próprio inseriu?**
>
> **Answer 2: Sim. devem considerar como critério de aceitação: Editable fields are first name, last name, date of birth and contact information**

> **Question 3:**
>
> **Answer 3:** 

**Dependencies/References:**

* There is a dependency to "US 5.1.1 - As an Admin, I want to register new backoffice users (e.g., doctors, nurses, technicians, admins) via an out-of-band process, so that they can access the backoffice system with appropriate permissions."

* There is a dependency to "US 5.1.6 - As a (non-authenticated) Backoffice User, I want to log in to the system using my credentials, so that I can access the backoffice features according to my assigned role."

* There is a dependency to "US 5.1.8 - As an Admin, I want to create a new patient profile, so that I can register their personal details and medical history."



**Input and Output Data**

**Input Data:**

* Typed data:
  * Full Name
  * E-mail
  * Phone
  * Gender
  * AppointmentHistory
  * Emergency Contact
  * Allergies


**Output Data:**
* Display the success of the operation and the data of the updated patient (Update Patient)


## 3. Analysis


> **Question 1: In this US an admin can edit a user profile. Does the system display a list of all users or the admin searchs by ID? Or both?**
>
> **Answer 1: This requirement is for the editing of the user profile. from a usability point of view, the user should be able to start this feature either by searching for a specific user or listing all users and selecting one. note that we are not doing the user interface of the system in this sprint.**


[//]: # (### 3.1. Domain Model)

[//]: # (![sub domain model]&#40;us1000-sub-domain-model.svg&#41;)

## 4. Design

[//]: # (TODO: Devido à sensative data fazer algo a mais  ?)

**Domain Class/es:** Email, Patient, PatientDto, PhoneNumber, MedicalRecordNumber

**Controller:** PatientController

**UI:**

**Repository:**	PatientRepository, LogRepository

**Service:** PatientService, AuthorizationService, LogService



### 4.1. Sequence Diagram

#### Edit Patient Profile

**Sequence Diagram Level 1**

![Sequence Diagram Level 1](sequence-diagram-1.svg "Actor and System")

**Sequence Diagram Level 2**

![Sequence Diagram Level 2](sequence-diagram-2.svg "FrontEnd and BackEnd")

**Sequence Diagram Level 3**

![Sequence Diagram Level 3](sequence-diagram-3.svg "Edit Patient Profile")


[//]: # (TODO: Necessario fazer algo ?)
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