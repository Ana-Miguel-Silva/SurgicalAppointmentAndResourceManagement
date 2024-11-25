
:- dynamic availability/3.
:- dynamic agenda_staff/3.
:- dynamic agenda_staff1/3.
:-dynamic agenda_operation_room/3.
:-dynamic agenda_operation_room1/3.
:-dynamic better_sol/5.
:-dynamic assignment_surgery1/2.


%agenda_staff(d001,20241028,[(720,790,m01),(1080,1140,c01)]).
%agenda_staff(d002,20241028,[(850,900,m02),(901,960,m02),(1380,1440,c02)]).
%agenda_staff(d003,20241028,[(720,790,m01),(910,980,m02)]).

%timetable(d001,20241028,(480,1200)).
%timetable(d002,20241028,(500,1440)).
%timetable(d003,20241028,(520,1320)).

% first example
%agenda_staff(d001,20241028,[(720,840,m01),(1080,1200,c01)]).
%agenda_staff(d002,20241028,[(780,900,m02),(901,960,m02),(1080,1440,c02)]).
%agenda_staff(d003,20241028,[(720,840,m01),(900,960,m02)]).

%timetable(d001,20241028,(480,1200)).
%timetable(d002,20241028,(720,1440)).
%timetable(d003,20241028,(600,1320)).


staff(d001,doctor,orthopaedist,[so2,so3,so4]).
staff(d002,doctor,orthopaedist,[so2,so3,so4]).
staff(d003,doctor,orthopaedist,[so2,so3,so4]).

%surgery(SurgeryType,TAnesthesia,TSurgery,TCleaning).

surgery(so2,45,60,45).
surgery(so3,45,90,45).
surgery(so4,45,75,45).

%For Complexity analyse

agenda_staff(d001,20241028,[(720,790,m01),(1080,1140,c01)]).
agenda_staff(d002,20241028,[(850,900,m02),(901,960,m02),(1380,1440,c02)]).
agenda_staff(d003,20241028,[(720,790,m01),(910,980,m02)]).
%agenda_staff(d004,20241028,[(850,900,m02),(940,980,c04)]).

timetable(d001,20241028,(480,1200)).
timetable(d002,20241028,(500,1440)).
timetable(d003,20241028,(520,1320)).
%timetable(d004,20241028,(620,1020)).

surgery_id(so100001,so2).
surgery_id(so100002,so3).
surgery_id(so100003,so4).
%surgery_id(so100004,so2).
%surgery_id(so100005,so4).
%surgery_id(so100006,so2).
%surgery_id(so100007,so3).
%surgery_id(so100008,so2).
%surgery_id(so100009,so2).
%surgery_id(so100010,so2).
%surgery_id(so100011,so4).
%surgery_id(so100012,so2).
%surgery_id(so100013,so2).

assignment_surgery(so100001,d001).
assignment_surgery(so100002,d002).
assignment_surgery(so100003,d003).
%assignment_surgery(so100004,d001).
%assignment_surgery(so100004,d002).
%assignment_surgery(so100005,d002).
%assignment_surgery(so100005,d003).
%assignment_surgery(so100006,d001).
%assignment_surgery(so100007,d003).
%assignment_surgery(so100008,d004).
%assignment_surgery(so100008,d003).
%assignment_surgery(so100009,d002).
%assignment_surgery(so100009,d004).
%assignment_surgery(so100010,d003).
%assignment_surgery(so100011,d001).
%assignment_surgery(so100012,d001).
%assignment_surgery(so100013,d004).






agenda_operation_room(or1,20241028,[(520,579,so100000),(1000,1059,so099999)]).


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




schedule_all_surgeries(Room,Day):-
    retractall(agenda_staff1(_,_,_)),
    retractall(agenda_operation_room1(_,_,_)),
    retractall(availability(_,_,_)),
    findall(_,(agenda_staff(D,Day,Agenda),assertz(agenda_staff1(D,Day,Agenda))),_),
    agenda_operation_room(Or,Date,Agenda),assert(agenda_operation_room1(Or,Date,Agenda)),
    findall(_,(agenda_staff1(D,Date,L),free_agenda0(L,LFA),adapt_timetable(D,Date,LFA,LFA2),assertz(availability(D,Date,LFA2))),_),
    findall(OpCode,surgery_id(OpCode,_),LOpCode),

    availability_all_surgeries(LOpCode,Room,Day),!.

availability_all_surgeries([],_,_).
availability_all_surgeries([OpCode|LOpCode],Room,Day):-
    surgery_id(OpCode,OpType),surgery(OpType,_,TSurgery,_),
    availability_operation(OpCode,Room,Day,LPossibilities,LDoctors),
    schedule_first_interval(TSurgery,LPossibilities,(TinS,TfinS)),
    retract(agenda_operation_room1(Room,Day,Agenda)),
    insert_agenda((TinS,TfinS,OpCode),Agenda,Agenda1),
    assertz(agenda_operation_room1(Room,Day,Agenda1)),
    insert_agenda_doctors((TinS,TfinS,OpCode),Day,LDoctors),
    availability_all_surgeries(LOpCode,Room,Day).



availability_operation(OpCode,Room,Day,LPossibilities,LDoctors):-surgery_id(OpCode,OpType),surgery(OpType,_,TSurgery,_),
    findall(Doctor,assignment_surgery(OpCode,Doctor),LDoctors),
    intersect_all_agendas(LDoctors,Day,LA),
    agenda_operation_room1(Room,Day,LAgenda),
    free_agenda0(LAgenda,LFAgRoom),
    intersect_2_agendas(LA,LFAgRoom,LIntAgDoctorsRoom),
    remove_unf_intervals(TSurgery,LIntAgDoctorsRoom,LPossibilities).


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
    insert_agenda_doctors((TinS,TfinS,OpCode),Day,LDoctors).



obtain_better_sol(Room,Day,AgOpRoomBetter,LAgDoctorsBetter,TFinOp):-
		get_time(Ti),
		(obtain_better_sol1(Room,Day);true),
		retract(better_sol(Day,Room,AgOpRoomBetter,LAgDoctorsBetter,TFinOp)),
            write('Final Result: AgOpRoomBetter='),write(AgOpRoomBetter),nl,
            write('LAgDoctorsBetter='),write(LAgDoctorsBetter),nl,
            write('TFinOp='),write(TFinOp),nl,
		get_time(Tf),
		T is Tf-Ti,
		write('Tempo de geracao da solucao:'),write(T),nl.


obtain_better_sol1(Room,Day):-
    asserta(better_sol(Day,Room,_,_,1441)),
    findall(OpCode,surgery_id(OpCode,_),LOC),!,
    permutation(LOC,LOpCode),
    retractall(agenda_staff1(_,_,_)),
    retractall(agenda_operation_room1(_,_,_)),
    retractall(availability(_,_,_)),
    findall(_,(agenda_staff(D,Day,Agenda),assertz(agenda_staff1(D,Day,Agenda))),_),
    agenda_operation_room(Room,Day,Agenda),assert(agenda_operation_room1(Room,Day,Agenda)),
    findall(_,(agenda_staff1(D,Day,L),free_agenda0(L,LFA),adapt_timetable(D,Day,LFA,LFA2),assertz(availability(D,Day,LFA2))),_),
    availability_all_surgeries(LOpCode,Room,Day),
    agenda_operation_room1(Room,Day,AgendaR),
		update_better_sol(Day,Room,AgendaR,LOpCode),
		fail.

update_better_sol(Day,Room,Agenda,LOpCode):-
                better_sol(Day,Room,_,_,FinTime),
                reverse(Agenda,AgendaR),
                evaluate_final_time(AgendaR,LOpCode,FinTime1),
             write('Analysing for LOpCode='),write(LOpCode),nl,
             write('now: FinTime1='),write(FinTime1),write(' Agenda='),write(Agenda),nl,
		FinTime1<FinTime,
             write('best solution updated'),nl,
                retract(better_sol(_,_,_,_,_)),
                findall(Doctor,assignment_surgery(_,Doctor),LDoctors1),
                remove_equals(LDoctors1,LDoctors),
                list_doctors_agenda(Day,LDoctors,LDAgendas),
		asserta(better_sol(Day,Room,Agenda,LDAgendas,FinTime1)).

evaluate_final_time([],_,1441).
evaluate_final_time([(_,Tfin,OpCode)|_],LOpCode,Tfin):-member(OpCode,LOpCode),!.
evaluate_final_time([_|AgR],LOpCode,Tfin):-evaluate_final_time(AgR,LOpCode,Tfin).

list_doctors_agenda(_,[],[]).
list_doctors_agenda(Day,[D|LD],[(D,AgD)|LAgD]):-agenda_staff1(D,Day,AgD),list_doctors_agenda(Day,LD,LAgD).

remove_equals([],[]).
remove_equals([X|L],L1):-member(X,L),!,remove_equals(L,L1).
remove_equals([X|L],[X|L1]):-remove_equals(L,L1).

% Heuristica Um

heuristic_one(Room,Day):-
    get_time(Ti),
    retractall(agenda_staff1(_,_,_)),
    retractall(agenda_operation_room1(_,_,_)),
    retractall(availability(_,_,_)),
    retractall(assignment_surgery1(_,_)),
	
    findall(_,(assignment_surgery(Surgery,Staff),assertz(assignment_surgery1(Surgery,Staff))),_),
    findall(assignment_surgery1(Surgery,Staff),assignment_surgery1(Surgery,Staff),_),
    findall(_,(agenda_staff(D,Day,Agenda),assertz(agenda_staff1(D,Day,Agenda))),_),
	agenda_operation_room(Or,Date,Agenda),assert(agenda_operation_room1(Or,Date,Agenda)),
    findall(_,(agenda_staff1(D,Date,L),free_agenda0(L,LFA),adapt_timetable(D,Date,LFA,LFA2),assertz(availability(D,Date,LFA2))),_),
	findall(OpCode,surgery_id(OpCode,_),LOpCode),
	purge_unschedulables(LOpCode,LOpCode2,Room,Day),	
	heuristic_one_body(LOpCode2,Room,Day),
    get_time(Tf),
    T is Tf-Ti,
    write('Tempo de geracao da solucao:'),write(T),nl,
    agenda_operation_room1(Room,Day,Agendab),
    reverse(Agendab,AgendaR),
    evaluate_final_time(AgendaR,LOpCode2,FinTime1),
    write('Tempo da ultima operação:'),write(FinTime1),nl.

heuristic_one_body([],_,_):-!.
heuristic_one_body(LOpCode,Room,Day):-
	cycle_surgery(LOpCode,Room,Day,Schedule),
	earliest_schedule(Schedule,(Early,_)),
	availability_one_surgery(Early,Room,Day),
	remove_op_code(LOpCode, Early, LOpCode2),
	heuristic_one_body(LOpCode2,Room,Day).
	

earliest_schedule([Last],Last):-!.
earliest_schedule([(Xa,Ya)|L],(Xb,Yb)):-
	earliest_schedule(L,(Xc,Yc)),
    (   (Ya =< Yc, Xb = Xa, Yb = Ya)
    ;   (Ya = Yc, Xb = Xc, Yb = Yc)
    ).

cycle_surgery([],_,_,[]):-!.
cycle_surgery([H|T],Room,Day,[(H,TinS)|R]):-
    surgery_id(H,OpType),surgery(OpType,_,TSurgery,_),
	abc(H,Room,Day,TSurgery,TinS,_),
	cycle_surgery(T,Room,Day,R).
	
abc(H,Room,Day,TSurgery,TinS,TfinS):-
    availability_operation(H,Room,Day,LPossibilities,_),
    schedule_first_interval(TSurgery,LPossibilities,(TinS,TfinS)).
abc(_,_,_,_,1400,1400):-!.

remove_op_code([], _, []).
remove_op_code([OpCode|L], OpCode, Assignments) :-
    remove_op_code(L, OpCode, Assignments).
remove_op_code([X|L], OpCode, [X|Assignments]):- remove_op_code(L, OpCode, Assignments).

purge_unschedulables([],[],_,_).
purge_unschedulables([OpCode|L],[OpCode|L2],Room,Day):-
    surgery_id(OpCode,OpType),surgery(OpType,_,TSurgery,_),
	abc(OpCode,Room,Day,TSurgery,TinS,TfinS),
	\+ (TinS = 1400, TfinS = 1400),
	purge_unschedulables(L,L2,Room,Day).
purge_unschedulables([OpCode|L],L2,Room,Day):-
    surgery_id(OpCode,OpType),surgery(OpType,_,TSurgery,_),
	abc(OpCode,Room,Day,TSurgery,_,_),
	purge_unschedulables(L,L2,Room,Day).

% Heuristica Dois


task_duration((TimeS, TimeF, _), Duration):- Duration is TimeF - TimeS.

tasks_total_duration([], 1440).
tasks_total_duration([X|L], TotalDuration):-
	task_duration(X, TaskDuration),
	tasks_total_duration(L, RestDuration),
	TotalDuration is RestDuration - TaskDuration.
	
	
staff_occupancy_percentage_header((S,_,Tasks), Percentage,Assignments):-
	staff_occupancy_percentage((S,_,Tasks), Percentage,Assignments).
staff_occupancy_percentage((S,_,Tasks), Percentage,Assignments):-
	tasks_total_duration(Tasks, TotalDuration),
	unscheduled_total_duration(S,Unscheduled,Assignments),
	Percentage is Unscheduled / TotalDuration.
	
surgery_duration(Id, Duration):- surgery_id(Id, Type), surgery(Type, _, Duration, _).

assigned_surgeries_total([], 0).
assigned_surgeries_total([assignment_surgery1(Id,_)|Rest], TotalDuration) :-
	surgery_duration(Id, SurgeryDuration),
	assigned_surgeries_total(Rest, RestDuration),
	TotalDuration is SurgeryDuration + RestDuration.
unscheduled_total_duration(S,Unscheduled,Assignments):-
	include(matches_staff(S), Assignments, AssignedSurgeries),
	assigned_surgeries_total(AssignedSurgeries, Unscheduled).
matches_staff(S, assignment_surgery1(_, S)).
	
heuristic_two(Room,Day):-
    get_time(Ti),
    retractall(agenda_staff1(_,_,_)),
    retractall(agenda_operation_room1(_,_,_)),
    retractall(availability(_,_,_)),
    retractall(assignment_surgery1(_,_)),
	
    findall(_,(assignment_surgery(Surgery,Staff),assertz(assignment_surgery1(Surgery,Staff))),_),
    findall(assignment_surgery1(Surgery,Staff),assignment_surgery1(Surgery,Staff),Assignments),
    findall(_,(agenda_staff(D,Day,Agenda),assertz(agenda_staff1(D,Day,Agenda))),_),
	agenda_operation_room(Or,Date,Agenda),assert(agenda_operation_room1(Or,Date,Agenda)),
    findall(_,(agenda_staff1(D,Date,L),free_agenda0(L,LFA),adapt_timetable(D,Date,LFA,LFA2),assertz(availability(D,Date,LFA2))),_),

	all_staff_occupancy_percentage_header(Room,Day, Assignments),
    get_time(Tf),
    T is Tf-Ti,
    write('Tempo de geracao da solucao:'),write(T),nl,
    agenda_operation_room1(Room,Day,Agendab),
    reverse(Agendab,AgendaR),
    evaluate_final_time(AgendaR,LOpCode2,FinTime1),
    write('Tempo da ultima operação:'),write(FinTime1),nl.
    
	
all_staff_occupancy_percentage_header(_,_,[]):-!.
all_staff_occupancy_percentage_header(Room,Day,Assignments):-
	findall(agenda_staff1(StaffId,Day,L),agenda_staff1(StaffId,Day,L),StaffList),
	all_staff_occupancy_percentage(StaffList,PL,Assignments),
	largest_percentage(PL,(Staff,_)),

	get_first_surgery(Assignments, Staff, OpCode),
	availability_one_surgery(OpCode,Room,Day),
	remove_surgery(Assignments, OpCode, Assignments2),
	%remove_surgery(Assignments, OpCode, Assignments2),
	all_staff_occupancy_percentage_header(Room,Day,Assignments2).

all_staff_occupancy_percentage([],[], _):-!.	
all_staff_occupancy_percentage([agenda_staff1(X,_,Y)|L],[(X,Percentage)|PL],Assignments):-
	staff_occupancy_percentage_header((X,_,Y), Percentage,Assignments),
	all_staff_occupancy_percentage(L,PL,Assignments).
	
largest_percentage([Last],Last):-!.
largest_percentage([(Xa,Ya)|L],(Xb,Yb)):-
	largest_percentage(L,(Xc,Yc)),
    (   (Ya > Yc, Xb = Xa, Yb = Ya)
    ;   (Ya =< Yc, Xb = Xc, Yb = Yc)
    ).
	
availability_one_surgery(OpCode,Room,Day):-
	surgery_id(OpCode,OpType),surgery(OpType,_,TSurgery,_),
    availability_operation(OpCode,Room,Day,LPossibilities,LDoctors),
    schedule_first_interval(TSurgery,LPossibilities,(TinS,TfinS)),
    retract(agenda_operation_room1(Room,Day,Agenda)),
    insert_agenda((TinS,TfinS,OpCode),Agenda,Agenda1),
    assertz(agenda_operation_room1(Room,Day,Agenda1)),
    insert_agenda_doctors((TinS,TfinS,OpCode),Day,LDoctors).


get_first_surgery([assignment_surgery1(OpCode, Sid)|_], Sid, OpCode) :- !.
get_first_surgery([_|L], Sid, OpCode) :- get_first_surgery(L, Sid, OpCode).

remove_surgery([], _, []).
remove_surgery([assignment_surgery1(OpCode, _)|L], OpCode, Assignments) :-
    remove_surgery(L, OpCode, Assignments).
remove_surgery([X|L], OpCode, [X|Assignments]):- remove_surgery(L, OpCode, Assignments).