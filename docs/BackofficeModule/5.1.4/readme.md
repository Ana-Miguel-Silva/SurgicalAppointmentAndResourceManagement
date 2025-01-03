# US 5.1.4


## 1. Context

As part of the development of the software system, it is necessary to implement user management functionalities within the patient interface. These functionalities are essential to allow patients to update their profile in the system.
This is the first time this task has been assigned for development.

## 2. Requirements

**US 5.1.4** As a Patient, I want to update my user profile, so that I can change my personal details and preferences.


**Acceptance Criteria:** 

- Patients can log in and update their profile details (e.g., name, contact information,
preferences).

- Changes to sensitive data, such as email, trigger an additional verification step (e.g.,
confirmation email).

- All profile updates are securely stored in the system.

- The system logs all changes made to the patient's profile for audit purposes.

**Customer Specifications and Clarifications:**

> **Question**: Can patients update both their user and patient profile information?
>
> **Answer**: Patients can update contact information but not medical details. Changes must be verified and validated.


> **Question:** what do preferences mean in the patient profile?
>
> **Answer:** Preferences are for now related to marketing consent or not by the patient, or other related GDPR preferences



**Dependencies/References:**

* There is a dependency to "US 5.1.1- As an Admin, I want to register new backoffice users (e.g., doctors, nurses, technicians, admins) via an out-of-band process, so that they can access the
backoffice system with appropriate permissions."


* There is a dependency to "5.1.6 As a (non-authenticated) Backoffice User, I want to log in to the system using my credentials, so that I can access the backoffice features according to my assigned role."


* There is a dependency to "5.1.3 As a Patient, I want to register for the healthcare application, so that I can create a user profile and book appointments online."

**Input and Output Data**

**Input Data:**

* Typed data:
  * Full name
  * E-mail (Contact Information)
  * Phone number (Contact Information)
  * UserEmail
  * Date of Birth
  * Gender



**Output Data:**
* Display the success of the operation and the data updated.

## 3. Analysis

>
>
>

[//]: # ()
[//]: # (### 3.1. Domain Model)

[//]: # (![sub domain model]&#40;us1000-sub-domain-model.svg&#41;)

## 4. Design


**Domain Class/es:** Email, Patient, MedicalRecordNumber, PhoneNumber, PatientDto

**Controller:** PatientController

**UI:** 

**Repository:**	PatientRepository, LogRepository

**Service:** PatientService, AuthorizationService, LogService, GmailService



### 4.1. Sequence Diagram

**Update Patient Level 1**

![Update Patient](sequence-diagram-1.svg "Update Patient")


**Update Patient Level 2**

![Update Patient](sequence-diagram-2.svg "Update Patient")

**Update Patient Level 3**

![Sequence Diagram Level 3](sequence-diagram-3-mail.svg "Sensitive Data Patient Profile")

![Sequence Diagram Level 3](sequence-diagram-3.svg "Edit Patient Profile")

[//]: # (![Update Patient]&#40;sequence-diagram-4.svg "Update Patient"&#41;)




[//]: # (### 4.2. Class Diagram)

[//]: # ()
[//]: # (![a class diagram]&#40;us1000-class-diagram.svg "A Class Diagram"&#41;)

### 4.3. Applied Patterns

### 4.4. Tests

Include here the main tests used to validate the functionality. Focus on how they relate to the acceptance criteria.


**Test 1:** *Edits a Patient*

````

// Check that the response status code is 200 (OK)
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});



{
    "Id": "{{patientId}}",
    "name": "Pedro Doouu",
    "dateOfBirth": "1985-05-20T00:00:00",
    "medicalRecordNumber": {
        "number": "{{patientMedicalRecordNumber}}"
    },
        "gender": "Female",
        "allergies": ["Orange"],
        "appointmentHistory": [
            "2021-09-15",
            "2022-10-10"
        ],
        "nameEmergency": "default dd",
        "phoneEmergency": {
            "number": "999999999"
        },
        "emailEmergency": {
            "fullEmail": "default@gmail.com"
        },
        "phone": {
            "number": "932385677"
        },
        "email": {
            "fullEmail": "gago3@gmail.com"
        },
        "userEmail": {
            "fullEmail": "gago@isep.ipp.pt"
        }
}
````

**Test 2:** *Check if the edit worked a Patient*


````


// Check that the response status code is 200 (OK)
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Parse the response body as JSON
const responseJson = pm.response.json();
const actualResponse = Array.isArray(responseJson) ? responseJson[0] : responseJson;


const expectedGetResponse = {
    id: pm.environment.get("patientId"),
    name: {
        firstName: "Pedro",
        middleNames: "",
        lastName: "Doouu"
    },
    dateOfBirth: "1985-05-20T00:00:00",
    medicalRecordNumber: {
        number: pm.environment.get("patientMedicalRecordNumber")
    },
    gender: "Female",
    allergies: ["Orange"],
    appointmentHistory: [
        "2021-09-15",
        "2022-10-10"
    ],
    nameEmergency: "default dd",
    phoneEmergency: {
        number: "999999999"
    },
    emailEmergency: {
        fullEmail: "default@gmail.com"
    },
    phone: {
        number: "932385677"
    },
    email: {
        fullEmail: "gago3@gmail.com"
    },
    userEmail: {
        fullEmail: "gago@isep.ipp.pt"
    }
};

pm.test("Response matches expected structure", function () {
    pm.expect(actualResponse).to.deep.equal(expectedGetResponse);
});




````

[//]: # ()
[//]: # (## 5. Implementation)

[//]: # ()
[//]: # ()
[//]: # (### Methods in the ListUsersController)

[//]: # (* **public async Task<ActionResult<PatientDto>> Update&#40;string email, PatientDto dto&#41;**  this method updates the patient info)

[//]: # ()
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