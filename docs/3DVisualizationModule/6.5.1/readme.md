# US 6.5.1


## 1. Context

As part of the development of the software system, it is necessary to implement user management functionalities within the staff user interface. These functionalities are allow the staff to visualize the map of the . This is the first time this task has been assigned for development.
This is the first time this task has been assigned for development.

## 2. Requirements

**US 6.5.1** As a healthcare staff member, I want to see a 3D representation of the hospital/clinic floor.


**Acceptance Criteria:** 

- Its description should be imported from a JSON (JavaScript Object Notation) formatted file.
- The floor must consist of several surgical rooms. 
- Each room must be enclosed by walls and include a door and a surgical table. 
- There should be no representation of the ceiling. 
- If a room is being used at any given time, a 3D model of a human body should be lying on the table. 
- Models can either be created or imported.

**Customer Specifications and Clarifications:**

> **Question:** Is it possible to explain a little more? For example, how does the JSON look like(example), and how it affects the visualization of the room.
>
>**Answer:** It's up to you to decide how the JSON file looks like. As an example, I suggest the contents of file "Loquitas.json" in project "Basic Thumb Raiser".


> **Question:** When should the human body be lying on the table? if at this precise moment there is a surgery going on? or if there are surgeries going to happen that day? Can you elaborate on this matter?
>
>**Answer:** If and only if there is a surgery going on on that precise room at that precise moment.


>**Question:** Good morning, the US 6.5.1 states "The floor must consist of several surgical rooms". For how many rooms exactly should we do the 3d representation?
>
>**Answer:** The number of operating rooms in the 3D Visualization Module must be consistent with the number of rooms that can be scheduled in the Planning/Optimization Module.

**Dependencies/References:**

* There are no dependencies to other US.
