# Supplementary Specification (FURPS+)

## Functionality

_Specifies functionalities that:_

- _are common across several US/UC;_
- _are not related to US/UC, namely: Audit, Reporting and Security._

**Authentication**

All those who wish to use the application must be authenticated with a password of seven alphanumeric characters, including
three capital letters and two digits.


## Usability 

_Evaluates the user interface. It has several subcategories,
among them: error prevention; interface aesthetics and design; help and
documentation; consistency and standards._

**Error Prevention:**
- The application should provide real-time validation messages or tooltips to guide users when they enter invalid data.
- Form fields should be validated to ensure that required fields are not left blank.

**Interface Aesthetics and Design:**
- The application should have a modern and intuitive user interface design.
- Clear navigation menus and icons should be used to enhance user understanding and ease of use.
- Consistent color schemes and fonts should be maintained throughout the application.
- Console Interface
    - Colours - Each colour presented on the console UI has a specific meaning that is used to facilitate reading. The exact shade of the colour will depend on the console's colour scheme.
        - White - Used for general messages and listing options to be selected
        - Yellow - Used for important information that the user needs to read
        - Cyan - Used for headers
        - Purple - Used for input prompts
        - Red - Used for Error messages
        - Green - Used for Success messages


**Help and Documentation:**
- The application should provide in-app tooltips or context-sensitive help to guide users on how to perform specific tasks.
- A comprehensive user manual or online documentation should be available to cover all application features and functionalities.


## Reliability
_Refers to the integrity, compliance and interoperability of the software. The requirements to be considered are: frequency and severity of failure, possibility of recovery, possibility of prediction, accuracy, average time between failures._

Certainly! Here's an example of how the FURPS+ supplementary specification could be written for your project:

---

**Frequency and Severity of Failure:**
- The application should have a low frequency of critical failures that impact the core functionality.
- Minor failures or errors should not occur frequently.

**Recovery Time:**
- In case of a system failure or crash, the application should automatically recover and restore the user's previous state upon restarting.

**Accuracy:**
- All calculations and data processing performed by the application should be accurate within acceptable margins.

**Average Time Between Failures:**
- The application should have a long average time between failures, ensuring stable and reliable performance over extended periods of use.


## Performance
_Evaluates the performance requirements of the software, namely: response time, start-up time, recovery time, memory consumption, CPU usage, load capacity and application availability._

**Response Time:**
- The application should respond to user actions and queries within two seconds for optimal user experience.

**Memory Consumption:**
- The application should be optimized to minimize memory usage and avoid excessive memory leaks.

**Load Capacity:**
- The application should support concurrent usage by multiple users without significant performance degradation.


## Supportability
_The supportability requirements gathers several characteristics, such as:
testability, adaptability, maintainability, compatibility,
configurability, installability, scalability and more._ 

**Localisability** 

The application must support the English language.

**Testability:**
- The application should be designed to facilitate automated testing, with clear separation of concerns and modular components.

**Maintainability:**
- Code should be well-structured, properly commented, and follow industry best practices to ensure ease of maintenance and future enhancements.

**Compatibility:**
- The application should be compatible with popular web browsers (e.g., Chrome, Firefox, Safari) and operating systems (e.g., Windows, macOS, Linux).

**Installability:**
- The installation process for the application should be simple and straightforward, with clear instructions and minimal dependencies.


### Design Constraints

_Specifies or constraints the system design process. Examples may include: programming languages, software process, mandatory standards/patterns, use of development tools, class library, etc._

**Analysis mechanisms**

The application will be developed in Java language using the IntelliJ IDE or NetBeans.

It will present a graphical interface developed in JavaFX 11.



### Implementation Constraints

_Specifies or constraints the code or construction of a system such
as: mandatory standards/patterns, implementation languages,
database integrity, resource limits, operating system._

**Implementation languages**

All the images/figures produced during the software development process should be recorded in SVG format.

**Platform support**

The application should use object serialization to ensure data persistence between two runs of the application.


### Interface Constraints
_Specifies or constraints the features inherent to the interaction of the
system being developed with other external systems._


### Physical Constraints

_Specifies a limitation or physical requirement regarding the hardware used to house the system, as for example: material, shape, size or weight._


