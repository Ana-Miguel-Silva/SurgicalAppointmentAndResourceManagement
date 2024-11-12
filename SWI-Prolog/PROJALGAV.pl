:- dynamic availability/3.
:- dynamic agenda_staff/3.
:- dynamic agenda_staff1/3.
:-dynamic agenda_operation_room/3.
:-dynamic agenda_operation_room1/3.
:-dynamic better_sol/5.

% definir o staff e o seu horario para um determinado dia
agenda_staff(d001,20241028,[(720,790,m01),(1080,1140,c01)]).
agenda_staff(d002,20241028,[(850,900,m02),(901,960,m02),(1380,1440,c02)]).
agenda_staff(d003,20241028,[(720,790,m01),(910,980,m02)]).

% define o horario de entrada e saida do staff para um determinado dia
timetable(d001,20241028,(480,1200)).
timetable(d002,20241028,(500,1440)).
timetable(d003,20241028,(520,1320)).

% first example
%agenda_staff(d001,20241028,[(720,840,m01),(1080,1200,c01)]).
%agenda_staff(d002,20241028,[(780,900,m02),(901,960,m02),(1080,1440,c02)]).
%agenda_staff(d003,20241028,[(720,840,m01),(900,960,m02)]).

%timetable(d001,20241028,(480,1200)).
%timetable(d002,20241028,(720,1440)).
%timetable(d003,20241028,(600,1320)).

%
staff(d001,doctor,orthopaedist,[so2,so3,so4]).
staff(d002,doctor,orthopaedist,[so2,so3,so4]).
staff(d003,doctor,orthopaedist,[so2,so3,so4]).

%surgery(SurgeryType,TAnesthesia,TSurgery,TCleaning).

surgery(so2,15,30,15).
surgery(so3,30,30,30).
surgery(so4,25,25,25).

surgery_id(so100001,so2).
surgery_id(so100002,so3).
surgery_id(so100003,so4).
surgery_id(so100004,so2).
surgery_id(so100005,so4).


assignment_surgery(so100001,d001).
assignment_surgery(so100002,d002).
assignment_surgery(so100003,d003).
assignment_surgery(so100004,d001).
assignment_surgery(so100004,d002).
assignment_surgery(so100005,d002).
assignment_surgery(so100005,d003).



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

% Junta o seu horario de entrada e saida com o seu horario de cirurgias,
% dando os intervalos em que o staff está livre
adapt_timetable(D,Date,LFA,LFA2):-timetable(D,Date,(InTime,FinTime)),treatin(InTime,LFA,LFA1),treatfin(FinTime,LFA1,LFA2).
treatin(InTime,[(In,Fin)|LFA],[(In,Fin)|LFA]):-InTime=<In,!.
treatin(InTime,[(_,Fin)|LFA],LFA1):-InTime>Fin,!,treatin(InTime,LFA,LFA1).
treatin(InTime,[(_,Fin)|LFA],[(InTime,Fin)|LFA]).
treatin(_,[],[]).
treatfin(FinTime,[(In,Fin)|LFA],[(In,Fin)|LFA1]):-FinTime>=Fin,!,treatfin(FinTime,LFA,LFA1).
treatfin(FinTime,[(In,_)|_],[]):-FinTime=<In,!.
treatfin(FinTime,[(In,_)|_],[(In,FinTime)]).
treatfin(_,[],[]).

% interseta as agendas dos staff em [Name]
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


availability_all_surgeries([], _, _).
availability_all_surgeries([OpCode | LOpCode], Room, Day) :-
    surgery_id(OpCode, OpType),
    surgery(OpType, TAnesthesia, TSurgery, TCleaning),
    availability_operation(OpCode, Room, Day, LPossibilities, LDoctors),
    schedule_first_interval(TAnesthesia, TSurgery, TCleaning, LPossibilities, (TinS, TfinRoom, TfinDoctor)),

    % Update room agenda with full duration (including anesthesia and cleaning)
    retract(agenda_operation_room1(Room, Day, AgendaRoom)),
    insert_agenda((TinS, TfinRoom, OpCode), AgendaRoom, UpdatedAgendaRoom),
    assertz(agenda_operation_room1(Room, Day, UpdatedAgendaRoom)),

    % Update doctors' agendas with only surgery duration
    insert_agenda_doctors((TinS, TfinDoctor, OpCode), Day, LDoctors),

    % Recur for the rest of the surgeries
    availability_all_surgeries(LOpCode, Room, Day).

availability_all_surgeries([], _, _).
availability_all_surgeries([OpCode | LOpCode], Room, Day) :-
    surgery_id(OpCode, OpType),
    surgery(OpType, TAnesthesia, TSurgery, TCleaning),
    availability_operation(OpCode, Room, Day, LPossibilities, LDoctors),
    schedule_first_interval(TAnesthesia, TSurgery, TCleaning, LPossibilities, (TinS, TfinRoom, TfinDoctor)),

    % Update room agenda
    retract(agenda_operation_room1(Room, Day, Agenda)),
    insert_agenda((TinS, TfinRoom, OpCode), Agenda, Agenda1),
    assertz(agenda_operation_room1(Room, Day, Agenda1)),

    % Update doctors' agendas with only surgery duration
    insert_agenda_doctors((TinS, TfinDoctor, OpCode), Day, LDoctors),

    % Recur for the rest of the surgeries
    availability_all_surgeries(LOpCode, Room, Day).



availability_operation(OpCode, Room, Day, LPossibilities, LDoctors) :-
    surgery_id(OpCode, OpType),
    surgery(OpType, TAnesthesia, TSurgery, TCleaning),

    % Get doctors assigned to this surgery
    findall(Doctor, assignment_surgery(OpCode, Doctor), LDoctors),

    % Calculate free intervals for the doctors based on only the surgery time
    intersect_all_agendas(LDoctors, Day, LA),

    % Calculate free intervals for the surgery room based on all phases (anesthesia + surgery + cleaning)
    agenda_operation_room1(Room, Day, LAgenda),
    free_agenda0(LAgenda, LFAgRoom),
    TotalTime is TAnesthesia + TSurgery + TCleaning,
    intersect_2_agendas(LFAgRoom, LA, LIntAgDoctorsRoom),
    remove_unf_intervals(TotalTime, LIntAgDoctorsRoom, LPossibilities).

remove_unf_intervals(_,[],[]).
remove_unf_intervals(TSurgery,[(Tin,Tfin)|LA],[(Tin,Tfin)|LA1]):-DT is Tfin-Tin+1,TSurgery=<DT,!,
    remove_unf_intervals(TSurgery,LA,LA1).
remove_unf_intervals(TSurgery,[_|LA],LA1):- remove_unf_intervals(TSurgery,LA,LA1).

% schedule_first_interval(+TAnesthesia, +TSurgery, +TCleaning, +AvailableIntervals, -ScheduledInterval)
schedule_first_interval(TAnesthesia, TSurgery, TCleaning, [(Tin, _) | _], (TinS, TfinRoom, TfinDoctor)) :-
    % Calculate end times for room and doctor
    TfinRoom is Tin + TAnesthesia + TSurgery + TCleaning - 1,
    TfinDoctor is Tin + TSurgery - 1,
    TinS is Tin.

% For the doctors, consider only the surgery phase
schedule_doctor_interval(TSurgery, [(Tin, _) | _], (Tin, TfinS)) :-
    TfinS is Tin + TSurgery - 1.


% insert_agenda(+NewEntry, +Agenda, -UpdatedAgenda)
insert_agenda((Start, End, OpCode), [], [(Start, End, OpCode)]).
insert_agenda((Start, End, OpCode), [(S, E, Code) | Rest], [(Start, End, OpCode), (S, E, Code) | Rest]) :-
    End < S, !.
insert_agenda(NewEntry, [Entry | Rest], [Entry | UpdatedRest]) :-
    insert_agenda(NewEntry, Rest, UpdatedRest).


% Update the doctors' agendas with only the surgery phase duration
insert_agenda_doctors((TinS, TfinRoom, OpCode), Day, [Doctor | RestDoctors]) :-
    % Retrieve the surgery type and its phases
    surgery_id(OpCode, SurgeryType),
    surgery(SurgeryType, TAnesthesia, TSurgery, _TCleaning),

    % Calculate the surgery phase start and end times
    SurgeryStart is TinS + TAnesthesia,
    SurgeryEnd is SurgeryStart + TSurgery - 1,

    % Update the doctor's agenda with only the surgery phase
    retract(agenda_staff1(Doctor, Day, AgendaDoctor)),
    insert_agenda((SurgeryStart, SurgeryEnd, OpCode), AgendaDoctor, UpdatedAgendaDoctor),
    assertz(agenda_staff1(Doctor, Day, UpdatedAgendaDoctor)),

    % Recursively update for the rest of the doctors assigned to this surgery
    insert_agenda_doctors((TinS, TfinRoom, OpCode), Day, RestDoctors).

% Base case: No more doctors to update
insert_agenda_doctors(_, _, []).

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
