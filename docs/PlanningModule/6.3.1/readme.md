# US 6.3.1


## 1. Context

As an Admin, I want to obtain the better scheduling of a set of operations
(surgeries) in a certain operation room in a specific day.

## 2. Requirements

**Acceptance Criteria:** 

- The better scheduling is considered as the sequence of operations that finishes early. Note that
surgeries have constraints (e.g. number of doctors or other staff), namely concerning the time
availability of staff during the day. The approach may be generating all surgeries’ sequences and
select the better, and this is possible till a certain dimension (number of surgeries).

- The user must have a user interface to start the process (enter any additional parameters the
planning algorithm needs, e.g., room number, date). The system will then generate the plan and
show it to the user on the screen. It is acceptable that the UI blocks while waiting for the planning
module response.
