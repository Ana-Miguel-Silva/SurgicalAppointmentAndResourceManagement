:-dynamic availability/3.
:-dynamic agenda_staff/3.
:-dynamic agenda_staff1/3.
:-dynamic agenda_operation_room/3.
:-dynamic agenda_operation_room1/3.
:-dynamic agenda_operation_room2/3.
:-dynamic better_sol/5.
:-dynamic n_staff_op/2.


agenda_staff(d001, 20241028, [(100, 599, so100000),(600, 700, so100000)]).
agenda_staff(d002, 20241028, [(100, 599, so100000),(600, 700, so100005)]).
agenda_staff(d003, 20241028, [(100, 599, so100000),(600, 700, so100006)]).
agenda_staff(d004, 20241028, [(600, 700, so100000),(750, 790, so100005)]).
agenda_staff(d005, 20241028, [(600, 700, so100000),(750, 790, so100005)]).
agenda_staff(d006, 20241028, [(600, 700, so100000),(750, 790, so100005)]).
agenda_staff(d007, 20241028, []).
agenda_staff(d008, 20241028, []).
agenda_staff(d009, 20241028, []).
agenda_staff(d010, 20241028, []).
agenda_staff(d011, 20241028, []).
agenda_staff(d012, 20241028, []).
agenda_staff(d013, 20241028, []).
agenda_staff(d014, 20241028, []).
agenda_staff(d015, 20241028, []).
agenda_staff(d016, 20241028, []).
agenda_staff(d017, 20241028, []).
agenda_staff(d018, 20241028, []).
agenda_staff(d019, 20241028, [(100, 599, so100000),(600, 700, so100000)]).
agenda_staff(d020, 20241028, [(100, 599, so100000),(600, 700, so100000)]).

timetable(d001, 20241028, (0, 1440)).
timetable(d002, 20241028, (0, 1440)).
timetable(d003, 20241028, (0, 1440)).
timetable(d004, 20241028, (0, 1440)).
timetable(d005, 20241028, (0, 1440)).
timetable(d006, 20241028, (0, 1440)).
timetable(d007, 20241028, (0, 1440)).
timetable(d008, 20241028, (0, 1440)).
timetable(d009, 20241028, (0, 1440)).
timetable(d010, 20241028, (0, 1440)).
timetable(d011, 20241028, (0, 1440)).
timetable(d012, 20241028, (0, 1440)).
timetable(d013, 20241028, (0, 1440)).
timetable(d014, 20241028, (0, 1440)).
timetable(d015, 20241028, (0, 1440)).
timetable(d016, 20241028, (0, 1440)).
timetable(d017, 20241028, (0, 1440)).
timetable(d018, 20241028, (0, 1440)).
timetable(d019, 20241028, (0, 1440)).
timetable(d020, 20241028, (0, 1440)).
timetable(d021, 20241028, (0, 1440)).

% first example
%agenda_staff(d001,20241028,[(720,840,m01),(1080,1200,c01)]).
%agenda_staff(d002,20241028,[(780,900,m02),(901,960,m02),(1080,1440,c02)]).
%agenda_staff(d003,20241028,[(720,840,m01),(900,960,m02)]).

%timetable(d001,20241028,(480,1200)).
%timetable(d002,20241028,(720,1440)).
%timetable(d003,20241028,(600,1320)).


staff(d001,doctor,orthopaedist).
staff(d002,doctor,orthopaedist).
staff(d003,doctor,orthopaedist).
staff(d019,doctor,orthopaedist).
staff(d020,doctor,orthopaedist).

staff(d004,doctor,anaesthetist).
staff(d005,doctor,anaesthetist).
staff(d006,doctor,anaesthetist).

staff(d007,nurse,anaesthetist).
staff(d008,nurse,anaesthetist).
staff(d009,nurse,anaesthetist).


staff(d010,nurse,instrumenting).
staff(d011,nurse,instrumenting).
staff(d012,nurse,instrumenting).

staff(d013,nurse,circulating).
staff(d014,nurse,circulating).
staff(d015,nurse,circulating).

staff(d016,nurse,assistant).
staff(d017,nurse,assistant).
staff(d018,nurse,assistant).

%surgery(SurgeryType,TAnesthesia,TSurgery,TCleaning).

surgery(so2,45,60,45).
surgery(so3,45,10,45).
surgery(so4,45,10,45).

%surgery_Required_Staff (SurgeryType,Number,Role,Type).

% Required staff for surgery type so2
surgery_Required_Staff(so2, 3, doctor, orthopaedist). % At least 1 must be an orthopaedist
surgery_Required_Staff(so2, 1, doctor, anaesthetist).
surgery_Required_Staff(so2, 1, nurse, instrumenting).
surgery_Required_Staff(so2, 1, nurse, circulating).
surgery_Required_Staff(so2, 1, nurse, anaesthetist).
surgery_Required_Staff(so2, 1, nurse, assistant).

% Required staff for surgery type so3
surgery_Required_Staff(so3, 3, doctor, orthopaedist). 
surgery_Required_Staff(so3, 1, doctor, anaesthetist).
surgery_Required_Staff(so3, 1, nurse, instrumenting).
surgery_Required_Staff(so3, 1, nurse, circulating).
surgery_Required_Staff(so3, 1, nurse, anaesthetist).
surgery_Required_Staff(so3, 1, nurse, assistant).

% Required staff for surgery type so4
surgery_Required_Staff(so4, 2, doctor, orthopaedist). 
surgery_Required_Staff(so4, 1, doctor, anaesthetist).
surgery_Required_Staff(so4, 1, nurse, instrumenting).
surgery_Required_Staff(so4, 1, nurse, circulating).
surgery_Required_Staff(so4, 1, nurse, anaesthetist).
surgery_Required_Staff(so4, 1, nurse, assistant).

surgery_id(so100001,so2).
surgery_id(so100002,so3).
surgery_id(so100003,so4).


agenda_operation_room(or1,20241028,[]).




% BETTTERRRR SOLUTION
obtain_better_sol(Room,Day,AgOpRoomBetter,LAgDoctorsBetter,TFinOp):-

    % PROCESS
    (obtain_better_sol1(Room,Day);true),

    % OUTPUT
    retract(better_sol(Day,Room,AgOpRoomBetter,LAgDoctorsBetter,TFinOp)),

    foreach(member(X,LAgDoctorsBetter),(write(X),nl)).
    

obtain_better_sol1(Room,Day):-

    % Begining
    asserta(better_sol(Day,Room,_,_,1441)),
    findall(OpCode,surgery_id(OpCode,_),LOC),!,

    % ALL Permutatitions
    permutation(LOC,LOpCode),
        retractall(agenda_staff1(_,_,_)),
        retractall(agenda_operation_room1(_,_,_)),
        retractall(agenda_operation_room2(_,_,_)),
        retractall(availability(_,_,_)),
        retractall(n_staff_op(_,_)),

        % Copies data to temporary memory
        findall(_,(agenda_staff(D,Day,Agenda),assertz(agenda_staff1(D,Day,Agenda)),numberOfOperation(Agenda,N),assertz(n_staff_op(N,D))),_),
        agenda_operation_room(Room,Day,Agenda),assert(agenda_operation_room1(Room,Day,Agenda)),
        findall(_,(agenda_staff1(D,Day,L),free_agenda0(L,LFA),adapt_timetable(D,Day,LFA,LFA2),assertz(availability(D,Day,LFA2))),_),

        write('Permutation:'),write(LOpCode),nl,
        % ALGORTIHM
        availability_all_surgeries(LOpCode,Room,Day),

        % Updates if better
        agenda_operation_room1(Room,Day,AgendaR),

        update_better_sol(Day,Room,AgendaR,LOpCode),
    %Next permutation
    fail.

% Updates if the agenda_Operation_room1 is better than better_sol
update_better_sol(Day,Room,Agenda,LOpCode):-

    better_sol(Day,Room,_,_,FinTime),
    reverse(Agenda,AgendaR),
    evaluate_final_time(AgendaR,LOpCode,FinTime1),

    write(FinTime1),nl,

    FinTime1<FinTime,

    retract(better_sol(_,_,_,_,_)),

    findall((Doctor,Ag),agenda_staff1(Doctor,Day,Ag),LDAgendas),

    write('Best Solution found'),
    write('LDAgendas:'),write(LDAgendas),


    asserta(better_sol(Day,Room,Agenda,LDAgendas,FinTime1)).

evaluate_final_time([],_,1441).
evaluate_final_time([(_,Tfin,OpCode)|_],LOpCode,Tfin):-member(OpCode,LOpCode),!.
evaluate_final_time([_|AgR],LOpCode,Tfin):-evaluate_final_time(AgR,LOpCode,Tfin).

remove_equals([],[]).
remove_equals([X|L],L1):-member(X,L),!,remove_equals(L,L1).
remove_equals([X|L],[X|L1]):-remove_equals(L,L1).


% MAIN PART
availability_all_surgeries([],_,_).
availability_all_surgeries([OpCode|LOpCode],Room,Day):-
    
    nl,nl,write('OpCode:'),write(OpCode),nl,

    %Part1 (Get time)
    surgery_id(OpCode,OpType),surgery(OpType,TAnesthesia,TSurgery,TCleaning),
    TotalTime is TAnesthesia+TSurgery+TCleaning,

    %Part2 (Get room available time slot)
    agenda_operation_room1(Room,Day,LAgenda),

    % Finding all Necessary Doctors
    findALLNecessaryStaff(OpType,ListOfStaffsAnesthesia,ListOfStaffsAssistant,ListOfStaffsSurgery),

    asserta(agenda_operation_room2(Room,Day,LAgenda)),
    findAvailableTimeForStaffAndRoom(TotalTime,OpType,Room,Day,ListOfStaffsAnesthesia,ListOfStaffsAssistant,ListOfStaffsSurgery,TinS,TfinS),
    retract(agenda_operation_room2(Room,Day,_)),

    write('Found times:'),nl,
    write('TinS'),write(TinS),nl,
    write('TfinS'),write(TfinS),nl,


    TimeFinalForAnaesthesia is TinS + TAnesthesia + TSurgery - 1,

    SurgeryIntialTIme is TinS + TAnesthesia,

    TInitialForCleaning is TimeFinalForAnaesthesia + 1,
    TimeFinalForCleaning is TinS + TSurgery + TAnesthesia + TCleaning - 1,
    

    % Updating the data
    retract(agenda_operation_room1(Room,Day,Agenda)),
    insert_agenda((TinS,TfinS,OpCode),Agenda,Agenda1),
    assertz(agenda_operation_room1(Room,Day,Agenda1)),

    write('Updated Agenda:'),write(Agenda1),nl,

    addOpCodeToFormat([(TinS,TimeFinalForAnaesthesia)],OpCode,NewFormat),
    insert_agenda_doctors(NewFormat,Day,ListOfStaffsAnesthesia),

    addOpCodeToFormat([(SurgeryIntialTIme,TimeFinalForAnaesthesia)],OpCode,NewFormat2),
    insert_agenda_doctors(NewFormat2,Day,ListOfStaffsSurgery),

    addOpCodeToFormat([(TInitialForCleaning,TimeFinalForCleaning)],OpCode,NewFormat3),
    insert_agenda_doctors(NewFormat3,Day,ListOfStaffsAssistant),

    %foreach(member(X,ListOfStaffsAnesthesia),(agenda_staff1(X,Day,AgendaX),write('X='),write(X),write('   Agenda='),write(AgendaX),nl)),
    %foreach(member(X,ListOfStaffsSurgery),(agenda_staff1(X,Day,AgendaY),write('X='),write(X),write('   Agenda='),write(AgendaY),nl)),
    %foreach(member(X,ListOfStaffsAssistant),(agenda_staff1(X,Day,AgendaZ),write('X='),write(X),write('   Agenda='),write(AgendaZ),nl)),



    %write(']'),nl,nl,

    %Part3 (Next Operation code)
    availability_all_surgeries(LOpCode,Room,Day).

findAvailableTimeForStaffAndRoom(TotalTime,OpType,Room,Day,ListOfStaffsAnesthesia,ListOfStaffsAssistant,ListOfStaffsSurgery,TinSF,TfinSF):-

    %Get the room availability
    surgery(OpType,TAnesthesia,TSurgery,TCleaning),
    agenda_operation_room2(Room,Day,Agenda),
    free_agenda0(Agenda,LFAgRoom),
    remove_unf_intervals(TotalTime,LFAgRoom,LRoomAvailability),
    schedule_first_interval(TotalTime,LRoomAvailability,(TinS,TfinS)),

    % Aneasthesia Doctors verification
    TimeFinalForAnaesthesia is TinS + TAnesthesia + TSurgery - 1,
    SurgeryTotalTime is TSurgery + TAnesthesia,
    availability_Anaesthesia(Day,AneasthesiaTime,ListOfStaffsAnesthesia,(TinS,TimeFinalForAnaesthesia),SurgeryTotalTime),

    % Surgery Doctors verification
    SurgeryIntialTIme is TinS + TAnesthesia,
    availability_Surgery(Day,SurgeryTime,ListOfStaffsSurgery,(SurgeryIntialTIme,TimeFinalForAnaesthesia),TSurgery),

    % Cleaning Doctors verification
    TInitialForCleaning is TimeFinalForAnaesthesia + 1,
    TimeFinalForCleaning is TinS + TSurgery + TAnesthesia + TCleaning - 1,
    availability_Cleaning(Day,CleaningTime,ListOfStaffsAssistant,(TInitialForCleaning,TimeFinalForCleaning),TCleaning),

    write('TinS'),write(TinS),nl,
    write('TimeFinalForAnaesthesia'),write(TimeFinalForAnaesthesia),nl,

    write('AneasthesiaTime'),write(AneasthesiaTime),nl,
    write('SurgeryTime'),write(SurgeryTime),nl,
    write('CleaningTime'),write(CleaningTime),nl,

    ( (is_list_empty(AneasthesiaTime) ; is_list_empty(SurgeryTime) ; is_list_empty(CleaningTime)) 
    ->         retract(agenda_operation_room2(Room,Day,Agenda1)),
    insert_agenda((TinS,TfinS,TotalTime),Agenda1,Agenda2),
    assertz(agenda_operation_room2(Room,Day,Agenda2)),
    findAvailableTimeForStaffAndRoom(TotalTime,OpType,Room,Day,ListOfStaffsAnesthesia,ListOfStaffsAssistant,ListOfStaffsSurgery,TinSF1,TfinSF1),
    TinSF is TinSF1,TfinSF is TfinSF1
    ;TinSF is TinS, TfinSF is TfinS,!
    ).
    
is_list_empty([]).
is_list_empty([_|_]) :-fail.

availability_Anaesthesia(Day,Result,ListOfStaffsAnesthesia,(TinS,TfinS),TotalTime) :-
    intersect_all_agendas(ListOfStaffsAnesthesia,Day,StaffFreeTime),
    intersect_2_agendas(StaffFreeTime,[(TinS,TfinS)],Result1),
    write('Before unf Anesthesia:'),write(Result1),nl,
    remove_unf_intervals(TotalTime,Result1,Result),
     write('After unf Anesthesia:'),write(Result),nl.

availability_Cleaning(Day,Result,ListOfStaffsCleaning,(TinS,TfinS),TotalTime) :-
    intersect_all_agendas(ListOfStaffsCleaning,Day,StaffFreeTime),
    intersect_2_agendas(StaffFreeTime,[(TinS,TfinS)],Result1),
    write('Before unf Cleaning:'),write(Result1),nl,
    remove_unf_intervals(TotalTime,Result1,Result),
    write('After unf Cleaning:'),write(Result),nl.

availability_Surgery(Day,Result,ListOfStaffsSurgery,(TinS,TfinS),TotalTime) :-
    intersect_all_agendas(ListOfStaffsSurgery,Day,StaffFreeTime),
    intersect_2_agendas(StaffFreeTime,[(TinS,TfinS)],Result1),
    write('Before unf Surgery:'),write(Result1),nl,
    remove_unf_intervals(TotalTime,Result1,Result),
    write('After unf Surgery:'),write(Result),nl.

remove_unf_intervals(_,[],[]).
remove_unf_intervals(TSurgery,[(Tin,Tfin)|LA],[(Tin,Tfin)|LA1]):-DT is Tfin-Tin+1,TSurgery=<DT,!,
    remove_unf_intervals(TSurgery,LA,LA1).
remove_unf_intervals(TSurgery,[_|LA],LA1):- remove_unf_intervals(TSurgery,LA,LA1).


schedule_first_interval(TSurgery,[(Tin,_)|_],(Tin,TfinS)):-
    TfinS is Tin + TSurgery - 1.

insert_agenda((TinS,TfinS,OpCode),[],[(TinS,TfinS,OpCode)]).
insert_agenda((TinS,TfinS,OpCode),[(Tin,Tfin,OpCode1)|LA],[(TinS,TfinS,OpCode),(Tin,Tfin,OpCode1)|LA]):-TfinS<Tin,!.
insert_agenda((TinS,TfinS,OpCode),[(Tin,Tfin,OpCode1)|LA],[(Tin,Tfin,OpCode1)|LA1]):-insert_agenda((TinS,TfinS,OpCode),LA,LA1).

insert_agenda_doctors(_,_,[]).
insert_agenda_doctors((TinS,TfinS,OpCode),Day,[Doctor|LDoctors]):-
    retract(agenda_staff1(Doctor,Day,Agenda)),
    insert_agenda((TinS,TfinS,OpCode),Agenda,Agenda1),
    assert(agenda_staff1(Doctor,Day,Agenda1)),
    retract(n_staff_op(N,Doctor)),
    N1 is N + 1,
    assert(n_staff_op(N1,Doctor)),
    insert_agenda_doctors((TinS,TfinS,OpCode),Day,LDoctors).

remove_elements(List, [], List).

remove_elements(List, [H|T], Result) :-
    delete(List, H, NewList),          % Remove all instances of H from List.
    remove_elements(NewList, T, Result). % Continue with the rest of elements in T.

addOpCodeToFormat([(TinS,TfinS)],OpCode,(TinS,TfinS,OpCode)).

numberOfOperation([],0).
numberOfOperation([(_,_,_)| Agenda ],Res):-
    numberOfOperation(Agenda,Res1),
    Res is Res1 + 1.



% Gets all the necessary Staff Taking in account the number of Operations it has
findByStaff_Role_and_Type(_,_,[],0).
findByStaff_Role_and_Type(Role,Type,NeededDoctors,NumberLeftOfDoctors):-
    findall(D,staff(D,Role,Type),LOfDoctors),
    findByStaff_Role_and_Type(LOfDoctors,NeededDoctors,NumberLeftOfDoctors).

findByStaff_Role_and_Type(_,[],0).
findByStaff_Role_and_Type(LOfDoctors,[LowDoc|NeededDoctors],NumberLeftOfDoctors):-
    findLowestSurgeryNumber(LOfDoctors,LowDoc,_),
    NumberLeftOfDoctors1 is NumberLeftOfDoctors - 1,
    delete(LOfDoctors,LowDoc,NewList),
    findByStaff_Role_and_Type(NewList,NeededDoctors,NumberLeftOfDoctors1).

findLowestSurgeryNumber([D],D,Number):- n_staff_op(Number,D).
findLowestSurgeryNumber([D|LOfDoctors],Res,Number):-
    n_staff_op(N,D),
    findLowestSurgeryNumber(LOfDoctors,Res1,Number1),
    (N<Number1 -> Res = D, Number = N; Res = Res1, Number = Number1).


findNecessaryStaffByType(SurgeryType,StaffType,FinalList):-
    findall(Res,(surgery_Required_Staff(SurgeryType,NumberOfStaffs,Role,StaffType) ,
    findByStaff_Role_and_Type(Role,StaffType,Res,NumberOfStaffs)),ListOFStaffs),
    append(ListOFStaffs,FinalList).



findALLNecessaryStaff(SurgeryType,ListOfStaffsAnesthesia,ListOfStaffsCleaning,ListOfStaffsSurgery):-

    % anaesthetist     
    findNecessaryStaffByType(SurgeryType,anaesthetist,ListOfStaffsAnesthesia),
    % Cleaning     
    findNecessaryStaffByType(SurgeryType,assistant,ListOfStaffsCleaning),

    % Surgery

    findall(DocType,(surgery_Required_Staff(SurgeryType,_,_,DocType)),ListOfDocTypes),
    delete(ListOfDocTypes,anaesthetist,ListOfDocTypes1),
    delete(ListOfDocTypes1,assistant,ListOfDocTypes2),
    remove_duplicates(ListOfDocTypes2,ListOfDocTypes3),

    findall(Res,(member(StaffType,ListOfDocTypes3),findNecessaryStaffByType(SurgeryType,StaffType,Res)),ListOfStaffsSurgery1),
    append(ListOfStaffsSurgery1,ListOfStaffsSurgery).

% Remove Duplicates
remove_duplicates([], []).

remove_duplicates([Head|Tail], Result) :-
    member(Head, Tail),
    remove_duplicates(Tail, Result).

remove_duplicates([Head|Tail], [Head|Result]) :-
    \+ member(Head, Tail),
    remove_duplicates(Tail, Result).




free_agenda0([],[(0,1440)]).
free_agenda0([(0,Tfin,_)|LT],LT1):-!,free_agenda1([(0,Tfin,_)|LT],LT1).
free_agenda0([(Tin,Tfin,_)|LT],[(0,T1)|LT1]):- T1 is Tin-1,
    free_agenda1([(Tin,Tfin,_)|LT],LT1).

free_agenda1([(_,Tfin,_)],[(T1,1440)]):-Tfin\==1440,!,T1 is Tfin+1.
free_agenda1([(_,_,_)],[]).
free_agenda1([(_,T,_),(T1,Tfin2,_)|LT],LT1):-Tx is T+1,T1==Tx,!,
    free_agenda1([(T1,Tfin2,_)|LT],LT1).
free_agenda1([(_,Tfin1,_),(Tin2,Tfin2,_)|LT],[(T1,T2)|LT1]):-T1 is Tfin1+1,T2 is Tin2-1,
    free_agenda1([(Tin2,Tfin2,_)|LT],LT1).


adapt_timetable(D,Date,LFA,LFA2):-timetable(D,Date,(InTime,FinTime)),treatin(InTime,LFA,LFA1),treatfin(FinTime,LFA1,LFA2).

treatin(InTime,[(In,Fin)|LFA],[(In,Fin)|LFA]):-InTime=<In,!.
treatin(InTime,[(_,Fin)|LFA],LFA1):-InTime>Fin,!,treatin(InTime,LFA,LFA1).
treatin(InTime,[(_,Fin)|LFA],[(InTime,Fin)|LFA]).
treatin(_,[],[]).

treatfin(FinTime,[(In,Fin)|LFA],[(In,Fin)|LFA1]):-FinTime>=Fin,!,treatfin(FinTime,LFA,LFA1).
treatfin(FinTime,[(In,_)|_],[]):-FinTime=<In,!.
treatfin(FinTime,[(In,_)|_],[(In,FinTime)]).
treatfin(_,[],[]).


intersect_all_agendas([Name],Date,LA):-!,availability(Name,Date,LA).
intersect_all_agendas([Name|LNames],Date,LI):-
    availability(Name,Date,LA),
    intersect_all_agendas(LNames,Date,LI1),
    intersect_2_agendas(LA,LI1,LI).

intersect_2_agendas([],_,[]).
intersect_2_agendas([D|LD],LA,LIT):-	intersect_availability(D,LA,LI,LA1),
					intersect_2_agendas(LD,LA1,LID),
					append(LI,LID,LIT).

intersect_availability((_,_),[],[],[]).

intersect_availability((_,Fim),[(Ini1,Fim1)|LD],[],[(Ini1,Fim1)|LD]):-
		Fim<Ini1,!.

intersect_availability((Ini,Fim),[(_,Fim1)|LD],LI,LA):-
		Ini>Fim1,!,
		intersect_availability((Ini,Fim),LD,LI,LA).

intersect_availability((Ini,Fim),[(Ini1,Fim1)|LD],[(Imax,Fmin)],[(Fim,Fim1)|LD]):-
		Fim1>Fim,!,
		min_max(Ini,Ini1,_,Imax),
		min_max(Fim,Fim1,Fmin,_).

intersect_availability((Ini,Fim),[(Ini1,Fim1)|LD],[(Imax,Fmin)|LI],LA):-
		Fim>=Fim1,!,
		min_max(Ini,Ini1,_,Imax),
		min_max(Fim,Fim1,Fmin,_),
		intersect_availability((Fim1,Fim),LD,LI,LA).


min_max(I,I1,I,I1):- I<I1,!.
min_max(I,I1,I1,I).

