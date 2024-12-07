# US 6.3.3


## 1. Context

As an Admin, I want to obtain a good schedule, not necessarily the better, in useful time to be adopted.

## 2. Requirements

**US 6.3.3** As an Admin, I want to obtain a good schedule, not necessarily the better, in useful time to be adopted.


**Acceptance Criteria:** 

- 

**Customer Specifications and Clarifications:**

> **Question: Good morning, By my understanding, heuritics are problem-solving methods or strategies designed to find a "good enough" solution. I assume that we must have some directing regarding what of these stratagies are.
Is there any specific heuristics or criteria you want us to be used to find a good enough solution? Like the priority of each operation or the time they take?** 
>
>**Answer: Consider the example of the Travel Salesman Problem (TSP) illustrated in the first ALGAV TP class to support the practical work. In that case the heurist is to visit the city not visited yet more close to the last city visited. The idea is that when the dimention of the problemnis high, and to generate all sequences to select the best is not feasible, we will find a way to generate one solution that isgood enough, but not the better.
In the case of surgeries it may be that the next operation is that involving the doctor that is available early, or the doctor with more surgeries not done yet. The heuristic will be good for some cases, not for others.
But in spite of involving just the doctor it may consider other staff for the surgery as well.
You can test the heuristic for cases with dimentions that are availsble for generating all solutions and compare the result using the heuristic and the better solution** 
 
**Dependencies/References:**

* There are no dependencies to other US.

**Input and Output Data**

**Input Data:**

* Typed data:
    * 




**Output Data:**
* Display the success of the operation and the data.


## 3. Analysis


## 4. Design



[//]: # (### 4.2. Class Diagram)

[//]: # ()
[//]: # (![a class diagram]&#40;us1000-class-diagram.svg "A Class Diagram"&#41;)
[//]: # ()
[//]: # (### 4.3. Applied Patterns)

[//]: # ()
[//]: # (### 4.4. Tests)

[//]: # ()
[//]: # (Include here the main tests used to validate the functionality. Focus on how they relate to the acceptance criteria.)

[//]: # ()
[//]: # ()
[//]: # ()
[//]: # (**Before Tests** **Setup of Dummy Users**)

[//]: # ()
[//]: # (```)

[//]: # (    public static SystemUser dummyUser&#40;final String email, final Role... roles&#41; {)

[//]: # (        final SystemUserBuilder userBuilder = new SystemUserBuilder&#40;new NilPasswordPolicy&#40;&#41;, new PlainTextEncoder&#40;&#41;&#41;;)

[//]: # (        return userBuilder.with&#40;email, "duMMy1", "dummy", "dummy", email&#41;.build&#40;&#41;;)

[//]: # (    })

[//]: # ()
[//]: # (    public static SystemUser crocodileUser&#40;final String email, final Role... roles&#41; {)

[//]: # (        final SystemUserBuilder userBuilder = new SystemUserBuilder&#40;new NilPasswordPolicy&#40;&#41;, new PlainTextEncoder&#40;&#41;&#41;;)

[//]: # (        return userBuilder.with&#40;email, "CroC1_", "Crocodile", "SandTomb", email&#41;.withRoles&#40;roles&#41;.build&#40;&#41;;)

[//]: # (    })

[//]: # ()
[//]: # (    private SystemUser getNewUserFirst&#40;&#41; {)

[//]: # (        return dummyUser&#40;"dummy@gmail.com", Roles.ADMIN&#41;;)

[//]: # (    })

[//]: # ()
[//]: # (    private SystemUser getNewUserSecond&#40;&#41; {)

[//]: # (        return crocodileUser&#40;"crocodile@gmail.com", Roles.OPERATOR&#41;;)

[//]: # (    })

[//]: # ()
[//]: # (```)

[//]: # ()
[//]: # (**Test 1:** *Verifies if Users are equals*)

[//]: # ()
[//]: # ()
[//]: # (```)

[//]: # (@Test)

[//]: # (public void verifyIfUsersAreEquals&#40;&#41; {)

[//]: # (    assertTrue&#40;getNewUserFirst&#40;&#41;.equals&#40;getNewUserFirst&#40;&#41;&#41;&#41;;)

[//]: # (})

[//]: # (````)

[//]: # ()
[//]: # (## 5. Implementation)

[//]: # ()
[//]: # ()
[//]: # (### Methods in the UsersController)

[//]: # (* **public async Task<ActionResult<UserDto>> Create&#40;CreatingUserDto dto&#41;**  this method creates a user)

[//]: # ()
[//]: # ()
[//]: # ()
[//]: # (## 6. Integration/Demonstration)

[//]: # ()


[//]: # (## 7. Observations)

[//]: # ()
[//]: # (*This section should be used to include any content that does not fit any of the previous sections.*)

[//]: # ()
[//]: # (*The team should present here, for instance, a critical perspective on the developed work including the analysis of alternative solutions or related works*)

[//]: # ()
[//]: # (*The team should include in this section statements/references regarding third party works that were used in the development this work.*)