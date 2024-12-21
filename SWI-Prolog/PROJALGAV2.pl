% Bibliotecas
    :- use_module(library(http/thread_httpd)).
    :- use_module(library(http/http_dispatch)).
    :- use_module(library(http/http_parameters)).
    :- use_module(library(http/http_open)).
    :- use_module(library(http/http_cors)).
    :- use_module(library(date)).
    :- use_module(library(random)).
    :- use_module(library(http/json_convert)).
    :- use_module(library(http/http_json)).
    :- use_module(library(http/json)).


% Program Memory variables
    :-dynamic population/1.

    :-dynamic best_individual_room/2.
    :-dynamic availability/3.
    :-dynamic agenda_operation_room1/3.
    :-dynamic agenda_operation_room2/3.
    :-dynamic agenda_staff1/3.
    :-dynamic better_sol/5.
    :-dynamic n_staff_op/2.
    :-dynamic n_surgeries/1.

    :-dynamic nearPerfectTime/1.
    :-dynamic stabilizedGenerations/2.

    :-dynamic lastGenerations/2.
    :- dynamic agenda_operation_room_copy/3.
    :- dynamic surgery_room/2.
    :- dynamic room_free_time/2.

% To Json Memory Variables


% Recieved memory variable
    % Staff
    :-dynamic agenda_staff/3.
    :-dynamic staff/3.
    :-dynamic timetable/3.
    % Room
    :-dynamic agenda_operation_room/3.
    % Surgery
    :-dynamic surgery/4.
    :-dynamic surgery_Required_Staff/4.
    :-dynamic surgery_id/2.

    % Algoritm Variables
    :-dynamic day/1.
    :-dynamic prob_crossover/1.
    :-dynamic prob_mutation/1.
    :-dynamic generations/1.
    :-dynamic base_population/1.


% Static Variables

additionToPerfectTime(1).
numberOfGenerationsThatStabilized(3).

%agenda_staff(d001, 20241028, [(0,200,so000001)]).

%timetable(d001, 20241028, (0, 1440)).

%staff(d001,doctor,orthopaedist).

%surgery(so2,45,60,45). Aneasthesia, Surgery, Cleaning

%surgery_Required_Staff(so3, 1, nurse, assistant).

%surgery_Required_Staff(so4, 2, doctor, orthopaedist).

%surgery_id(so100001,so2).

%agenda_operation_room(or1,20241028,[(120,200,so100009),(360,420,s010005)]).


% Gerir Servidor
server(Port) :-
        http_server(http_dispatch, [port(Port)]).

c_server(Port) :-
    http_stop_server(Port, []).

open_server() :-
        http_server(http_dispatch, [port(5050)]).

close_server():-
    http_stop_server(5050, []).

:- set_setting(http:cors, [*]).

%JSONS

   :- json_object finalJson(roomArray:list(roomData)).

    %Room Json
    :- json_object roomData(roomId:string,appointmentJson_array:list(appointmentJson)).
    :- json_object appointmentJson(operationRequestId:string,instanteInicial:integer,instanteFinal:integer,staffArray:list(surgeryStaffJson)).
    :- json_object surgeryStaffJson(staffId:string,instanteInicial:integer,instanteFinal:integer).
    
% Example usage

:- debug(http).

:- http_handler('/geneticAlg', get_all_Surgeries, []).

get_all_Surgeries(_Request) :-
    cors_enable,
    http_read_json(_Request, JSON, [json_object(dict)]),
    % Treat all the data from the Json
    treatData(JSON,JSON.day),

    debug(http, 'Day: ~w', [JSON.day]),
    debug(http, 'CrossOver: ~w', [JSON.prob_CrossOver]),
    debug(http, 'prob_Mutation: ~w', [JSON.prob_Mutation]),
    debug(http, 'n_Generations: ~w', [JSON.n_Generations]),
    debug(http, 'base_Population: ~w ~n ~n ~n', [JSON.base_Population]),

    debug(http, 'Beginning Generate', []),

    generate(JSON.n_Generations,JSON.prob_CrossOver,JSON.prob_Mutation,JSON.base_Population,JSON.day),

    debug(http, 'End Generate', []),

    debug(http, 'Generation Json', []),

    transformDataPrologJson(FinalJson),

    % Convert Prolog term to JSON
    prolog_to_json(FinalJson, JSONObject),

    debug(http, 'Json: ~w', [JSONObject]),

    reply_json(JSONObject, [json_object(dict)]).

transformDataPrologJson(FinalJson) :-
    findall((StaffId, Agenda), agenda_staff(StaffId, _, Agenda), StaffList),
    findall((RoomId, Agenda), agenda_operation_room(RoomId, _, Agenda), RoomList),

    roomToJson(RoomList, FinalJson, StaffList).


roomToJson([],[],_).
roomToJson([(RoomId,OpList) | Rooms],[Res|Data],StaffList):-
        operationListToJson(OpList,Data1,StaffList),
        Res = roomData(RoomId,Data1),
        roomToJson(Rooms,Data,StaffList).

operationListToJson([],[],_):-!.
operationListToJson([ (_,_,OpCode) | List] , Data, StaffList):-
    (OpCode == "UsedSpace",!,debug(http,'Found The Used Space',[]),operationListToJson(List,Data,StaffList)).

operationListToJson([ (Tins,Tfin,OpId) | OpList],[Res|Data],StaffList):-
    findStaffsForOperation(StaffList,OpId,StaffsJson),
    Res = appointmentJson(OpId,Tins,Tfin,StaffsJson),
    operationListToJson(OpList,Data,StaffList).


findStaffsForOperation([],_,[]):-!.
findStaffsForOperation([(StaffId,Agenda)|StaffList],DesiredOpCode,[Res|Data]):-
    agendaHasOpCode(Agenda,DesiredOpCode,(Tins,Tfin)),
    (string(StaffId) -> true; debug(http, 'StaffId is not a string', [])),
    (integer(Tins) -> true ; debug(http, 'Tins is not an integer', [])),
    (integer(Tfin) -> true ; debug(http, 'Tfin is not an integer', [])),    Res = surgeryStaffJson(StaffId,Tins,Tfin),
    debug(http, 'surgeryStaffJson: ~w',[Res]),
    findStaffsForOperation(StaffList,DesiredOpCode,Data).

findStaffsForOperation([_|StaffList],DesiredOpCode,Data):-
    findStaffsForOperation(StaffList,DesiredOpCode,Data).

agendaHasOpCode([],_,[]):-!,fail.
agendaHasOpCode([(Tins,Tfin,OpCode)|_],OpCode,(Tins,Tfin)).

agendaHasOpCode([_|Agenda],OpCode,Res):-
    agendaHasOpCode(Agenda,OpCode,Res).

printText([]).
printText([X|L]):-debug(http,'Json ~w ~n', [X]),printText(L).

treatData(Json,Day):-
    % Clear all the data
    (retractall(agenda_staff(_,_,_)) ; true),
    (retractall(staff(_,_,_)) ; true),
    (retractall(timetable(_,_,_)); true),
    (retractall(agenda_operation_room(_,_,_)); true),
    (retractall(surgery_id(_,_)); true),
    (retractall(surgery(_,_,_,_)); true),
    (retractall(surgery_Required_Staff(_,_,_,_)); true),

    treatRecievedStaffData(Json.staffInfo,Day),

    treatRecievedRoomData(Json.roomsInfo,Day),

    treatRecievedOperationData(Json.operationRequests),

    treatRecievedOpTypeInfo(Json.opType),

    treatRecievedStaffNumberInfo(Json.specializationAssignments)

    ,debugData
.


debugData :-
    % Find and print all staff data
    findall((LN, R, S), staff(LN, R, S), StaffList),
    debug(http, '---- Staff Data ----', []),
    printStaffData(StaffList),

    % Find and print all timetable data
    findall((LN, D, AgTT), timetable(LN, D, AgTT), TimetableList),
    debug(http, '---- Timetable Data ----', []),
    printTimetableData(TimetableList),

    % Find and print all agenda operation room data
    findall((Room, D, Agenda), agenda_operation_room(Room, D, Agenda), RoomList),
    debug(http, '---- Room Data ----', []),
    printRoomData(RoomList),

    % Find and print all surgery data
    findall((OpId, Anesthesia, Surgery, Cleaning), surgery(OpId, Anesthesia, Surgery, Cleaning), SurgeryList),
    debug(http, '---- Surgery Data ----', []),
    printSurgeryData(SurgeryList),

    % Find and print all surgery required staff data
    findall((OpId, Number, Role, Cleaning), surgery_Required_Staff(OpId, Number, Role, Cleaning), RequiredStaffList),
    debug(http, '---- Required Staff Data ----', []),
    printRequiredStaffData(RequiredStaffList),

    % Find and print all surgery ID data
    findall((SurgeryId, SurgeryType), surgery_id(SurgeryId, SurgeryType), SurgeryIdList),
    debug(http, '---- Surgery ID Data ----', []),
    printSurgeryIdData(SurgeryIdList),

    % Find and print all agenda staff data
    findall((StaffId, Day, Agenda), agenda_staff(StaffId, Day, Agenda), AgendaStaffList),
    debug(http, '---- Agenda Staff Data ----', []),
    printAgendaStaffData(AgendaStaffList).

printStaffData([]).
printStaffData([(LN, R, S) | Rest]) :-
    debug(http, 'License Number: ~w, Role: ~w, Specialization: ~w', [LN, R, S]),
    printStaffData(Rest).

printTimetableData([]).
printTimetableData([(LN, D, AgTT) | Rest]) :-
    debug(http, 'License Number: ~w, Day: ~w, Timetable: ~w', [LN, D, AgTT]),
    printTimetableData(Rest).

printRoomData([]).
printRoomData([(Room, D, Agenda) | Rest]) :-
    debug(http, 'Room: ~w, Day: ~w, Agenda: ~w', [Room, D, Agenda]),
    printRoomData(Rest).

printSurgeryData([]).
printSurgeryData([(OpId, Anesthesia, Surgery, Cleaning) | Rest]) :-
    debug(http, 'Operation ID: ~w, Anesthesia: ~w, Surgery: ~w, Cleaning: ~w', [OpId, Anesthesia, Surgery, Cleaning]),
    printSurgeryData(Rest).

printRequiredStaffData([]).
printRequiredStaffData([(OpId, Number, Role, Cleaning) | Rest]) :-
    debug(http, 'Operation ID: ~w, Number: ~w, Role: ~w, Specialization: ~w', [OpId, Number, Role, Cleaning]),
    printRequiredStaffData(Rest).

printSurgeryIdData([]).
printSurgeryIdData([(SurgeryId, SurgeryType) | Rest]) :-
    debug(http, 'Surgery ID: ~w, Surgery Type: ~w', [SurgeryId, SurgeryType]),
    printSurgeryIdData(Rest).

printAgendaStaffData([]).
printAgendaStaffData([(StaffId, Day, Agenda) | Rest]) :-
    debug(http, 'Staff ID: ~w, Day: ~w, Agenda: ~w', [StaffId, Day, Agenda]),
    printAgendaStaffData(Rest).

treatRecievedStaffNumberInfo([]).
treatRecievedStaffNumberInfo([Specialization | Specializations]):-

    Id = Specialization.get('OperationTypeId'),
    Number = Specialization.get('NumberOfSpecialists'),
    Role = Specialization.get('Role'),
    SpecString = Specialization.get('Specialization'),

    % Convert the Specialization to an atom

    assert(surgery_Required_Staff(Id, Number, Role, SpecString)),


    treatRecievedStaffNumberInfo(Specializations).

treatRecievedOpTypeInfo([]).
treatRecievedOpTypeInfo([OpType | OpTypes]):-

    OpId = OpType.get('id'),
    Anesthesia = OpType.get('anaesthetist_Time'),
    Surgery = OpType.get('surgery_Time'),
    Cleaning = OpType.get('cleaning_Time'),

    assert(surgery(OpId, Anesthesia, Surgery, Cleaning)),

    treatRecievedOpTypeInfo(OpTypes).

treatRecievedOperationData([]).
treatRecievedOperationData([Operation|Operations]):-

   % Access the fields using the correct field names
    OpId = Operation.get('Id'),
    OpType = Operation.get('Type'),

    assert(surgery_id(OpId, OpType)),

    treatRecievedOperationData(Operations).


treatRecievedRoomData([],_).
treatRecievedRoomData([Room|Rooms],Day):-
    
    RoomId = Room.get('Id'), 
    MaintanceSlots = Room.get('maintanceSlots'),

    convert_to_tuples(MaintanceSlots, MaintanceSlotsTuples),
    avalilabilitySlotsToAgenda(MaintanceSlotsTuples, Agenda1),

    assert(agenda_operation_room(RoomId,Day,Agenda1)),

    treatRecievedRoomData(Rooms,Day).


treatRecievedStaffData([],_).
treatRecievedStaffData([St|Staffs],Day):-

    LicenseNumber = St.get('LicenseNumber'),
    Role = St.get('Role'),
    Specialization = St.get('Specialization'),
    AvailabilitySlots = St.get('AvailabilitySlots'),

    asserta(staff(LicenseNumber, Role, Specialization)),
    asserta(timetable(LicenseNumber, Day, (0, 1440))),

    convert_to_tuples(AvailabilitySlots, AvailabilitySlotsTuples),

    avalilabilitySlotsToAgenda(AvailabilitySlotsTuples, Agenda1),
    free_agenda0(Agenda1, Agenda),
    formatAgenda(Agenda, Agenda2),
    assert(agenda_staff(LicenseNumber, Day, Agenda2)),

    treatRecievedStaffData(Staffs,Day).

convert_to_tuples([], []).
convert_to_tuples([Start,End| Ag], [(Start, End) | Res]) :-
    convert_to_tuples(Ag, Res).

avalilabilitySlotsToAgenda([], []).
avalilabilitySlotsToAgenda([(Start, End)| Ag], [(Start, End, "UsedSpace") | Res]) :-
    avalilabilitySlotsToAgenda(Ag, Res).

formatAgenda([], []).
formatAgenda([(Start, End)|Ag], [(Start, End,"UsedSpace")|Res]) :-
    formatAgenda(Ag, Res).

treatSurgeryData([], []).
treatSurgeryData([A|AgOpRoomBetter], [Res1|Res]) :-
    treatStaffData(A, Res1),
    treatSurgeryData(AgOpRoomBetter, Res).

treatStaffData((StaffId, List), Res) :-
    treatAgendaData(List, AgendaData),
    atom_string(StaffId, StaffIdStr),
    Res = surgeryStaffJson(StaffIdStr, AgendaData).

treatAgendaData([], []).
treatAgendaData([(Ini, Fin, Id)|Agenda], [Res1|Res]) :-
    atom_string(Id, Id1),
    Res1 = agenda_json(Ini, Fin, Id1),
    treatAgendaData(Agenda, Res).




assignSurgeriesToRoom:-
    (retractall(surgery_room(_, _)); true),
    (retractall(agenda_operation_room_copy(_, _, _)); true),
    (retractall(room_free_time(_, _)); true),

    findall((SurgeryID, TotalTime),(surgery_id(SurgeryID, OpType), surgery(OpType, T1, T2, T3), TotalTime is T1 + T2 + T3),Surgeries),

    findall((RoomID, FreeTime),(agenda_operation_room(RoomID, _, Agenda), free_agenda0(Agenda, FreeTime)),Rooms),

    copy_all_agendas,

    set_room_free_time(Rooms),

    sort_room_free_time_desc,

    assignSurgeriesWithConstraints(Surgeries).



assignSurgeriesWithConstraints([]).
assignSurgeriesWithConstraints([(SurgeryID, Duration) | Rest]) :-

    (select_room_for_surgery(Duration, SelectedRoom, Start, End),
        SelectedRoom \= "notPossible"
    ->  assert(surgery_room(SurgeryID, SelectedRoom)),

        update_agenda_with_surgery(SelectedRoom, (Start, End, SurgeryID)),

        retract(room_free_time(SelectedRoom, FreeTime)),
        NewFreeTime is FreeTime - Duration,
        assert(room_free_time(SelectedRoom, NewFreeTime)),

        sort_room_free_time_desc,

        assignSurgeriesWithConstraints(Rest)
    ;
        assignSurgeriesWithConstraints(Rest)
    ).


select_room_for_surgery(Duration, SelectedRoom, Start, End) :-
    room_free_time(RoomID, FreeTime),

    agenda_operation_room_copy(RoomID,_,Agenda),
    free_agenda0(Agenda,LFAgRoom),

    remove_unf_intervals(Duration,LFAgRoom,LRoomAvailability),

    schedule_first_interval(Duration,LRoomAvailability,(Start,End)),

    ( ( End > 1439 , fail) ; true),

    check_eighty_percent(FreeTime, Duration),
    SelectedRoom = RoomID.

select_room_for_surgery(_, "notPossible", _, _).

update_agenda_with_surgery(Room,(Start, End, OpCode)) :-
    retract(agenda_operation_room_copy(Room, Day, Agenda)),
    insert_agenda((Start, End, OpCode), Agenda, UpdatedAgenda),
    assertz(agenda_operation_room_copy(Room, Day, UpdatedAgenda)).


check_eighty_percent(FreeTime, Duration) :-
    FullDay = 1440,
    MinRequiredTime is 0.2 * FullDay,
    N is FreeTime - Duration,
    N >= MinRequiredTime.


free_time([], 0).
free_time([(Start, End) | Rest], FreeTime) :-
    free_time(Rest, RestFreeTime),
    FreeTime is RestFreeTime + (End - Start).


set_room_free_time(Rooms) :-
    retractall(room_free_time(_, _)),
    forall(member((RoomID, FreeTimeIntervals), Rooms),(free_time(FreeTimeIntervals, TotalFreeTime), assertz(room_free_time(RoomID, TotalFreeTime)))).

sort_room_free_time_desc :-
    findall((RoomID, FreeTime), room_free_time(RoomID, FreeTime), RoomFreeTimeList),
    sort(2, @>=, RoomFreeTimeList, SortedRoomFreeTimeList),
    retractall(room_free_time(_, _)),
    assert_sorted_room_free_times(SortedRoomFreeTimeList).


assert_sorted_room_free_times([]).
assert_sorted_room_free_times([(RoomID, FreeTime) | Rest]) :-
    assertz(room_free_time(RoomID, FreeTime)),
    assert_sorted_room_free_times(Rest).


copy_all_agendas :-
    agenda_operation_room(Room, Day, Agenda),
    assertz(agenda_operation_room_copy(Room, Day, Agenda)),
    fail.
copy_all_agendas.


% parameters initialization (Automatic in the moment)
initialize(Generations,Prob_CrossOver,Prob_Mutation,Base_Pop,Day):-
   % BootLoader memory for now
    (retractall(generations(_));true), asserta(generations(Generations)),

	(retractall(prob_crossover(_));true),	asserta(prob_crossover(Prob_CrossOver)),

	(retractall(prob_mutation(_));true), asserta(prob_mutation(Prob_Mutation)),

    (retractall(best_individual_room(_,_));true),
    (retractall(lastGenerations(_,_));true),

    (retractall(day(_));true), asserta(day(Day)),

    asserta(base_population(Base_Pop)).


generate(Generations,Prob_CrossOver,Prob_Mutation,Base_Pop,Day):-

    initialize(Generations,Prob_CrossOver,Prob_Mutation,Base_Pop,Day),
    assignSurgeriesToRoom,

    findall(RoomId,(agenda_operation_room(RoomId,_,_)),ListOfRooms),

    generate(ListOfRooms).


generate([]):-!.

generate([Room|ListOfRooms]) :-

    % Verifies the number of permutations that can be made
    ((verifyPopulationPermutationsLimit(Room),!) ; 

        (
        
        day(Day),
        surgery_room(OnlySurgery, Room),
        obtain_better_sol(Room,Day,[OnlySurgery],V,_,_),


        assert(best_individual_room(Room,[OnlySurgery]*V)),
        updateStaffTime(Room),
        fail

        )
    ),

    % Create the value for Stopping time
    createNearPerfectTime(Room),

    % Create the values for stabilized generations
    (retractall(stabilizedGenerations(_,_)); true),
    assert(stabilizedGenerations([], 0)),

    % Updates the number of surgeries
    findall(SURGERIES, (surgery_room(SURGERIES, Room)), ListOfSug),
    length(ListOfSug, R),
    retractall(n_surgeries(_)),
    assert(n_surgeries(R)),

    % Create all the individuals in the Population
    generate_population(Pop, Room),

    % Evaluates all the individual in the Population and returns the Result of the evaluation
    
    evaluate_population(Pop, PopValue, Room),

    % Orders the population in ascending order
    order_population(PopValue, PopOrd),

    % Get the number of generations
    generations(NG),

    % Create values for the last generations
    assert(lastGenerations([], 0)),

    % Generate the generations
    (generate_generation(0, NG, PopOrd, Room, []); true),

    % Clean up last generations
    retractall(lastGenerations(_,_)),

    % Update Staff Times
    updateStaffTime(Room),

    % Process the next room
    generate(ListOfRooms).

generate([_|ListOfRooms]) :-
    generate(ListOfRooms).

updateStaffTime(Room):-    
    best_individual_room(Room,R),

    day(Day),
    formatIndividual(R,Ind),

    obtain_better_sol(Room,Day,Ind,_,RoomAg,DoctorsSchedule),

    retract(agenda_operation_room(Room,Day,_)),
    assert(agenda_operation_room(Room,Day,RoomAg)),

    staffAgenda(DoctorsSchedule).

% Pop is the list with PopSize aleatory individuals
generate_population(Pop,Room):-
    population(PopSize),
    n_surgeries(NumT),
    findall(SURGERY_ID,surgery_room(SURGERY_ID,Room),SurgeryList),
    generate_population(PopSize,SurgeryList,NumT,Pop).


generate_population(0,_,_,[]):-!.
generate_population(PopSize,TasksList,NumT,[Ind|Rest]):-
    PopSize1 is PopSize-1,
    generate_population(PopSize1,TasksList,NumT,Rest),
    generate_individual(TasksList,NumT,Ind),
    not(member(Ind,Rest)).
generate_population(PopSize,TasksList,NumT,L):-
    generate_population(PopSize,TasksList,NumT,L).


generate_individual([G],1,[G]):-!.

generate_individual(SurgeryList,NumT,[G|Rest]):-
    NumTemp is NumT + 1, % to use with random
    random(1,NumTemp,N),
    remove(N,SurgeryList,G,NewList),
    NumT1 is NumT-1,
    generate_individual(NewList,NumT1,Rest).

remove(1,[G|Rest],G,Rest).
remove(N,[G1|Rest],G,[G1|Rest1]):- N1 is N-1,
            remove(N1,Rest,G,Rest1).


evaluate_population([],[],_).
evaluate_population([Ind|Rest],[Ind*V|Rest1],Room):-
    day(Day),
    obtain_better_sol(Room,Day,Ind,V,_,_),
    evaluate_population(Rest,Rest1,Room).

order_population(PopValue,PopValueOrd):-
    bsort(PopValue,PopValueOrd).

bsort([X],[X]):-!.
bsort([X|Xs],Ys):-
    bsort(Xs,Zs),
    bchange([X|Zs],Ys).


bchange([X],[X]):-!.

bchange([X*VX,Y*VY|L1],[Y*VY|L2]):-
    VX>VY,!,
    bchange([X*VX|L1],L2).

bchange([X|L1],[X|L2]):-bchange(L1,L2).


generate_generation(G,G,Pop,Room,NextGen):-!,

    ( (is_list_empty(NextGen),!) ;
    (
    findBestIndividual(NextGen,R),
    assert(best_individual_room(Room,R)),!,fail
    )),

    findBestIndividual(Pop,R),
    assert(best_individual_room(Room,R)).

generate_generation(N,G,Pop,Room,NextGen):-

    (

    (is_list_empty(NextGen),!) ;

    (
    N1 is N+1,
    verifyFinalConditions(NextGen,Room),
	generate_generation(N1,G,NextGen,Room,[]),!,fail
    )
    ),
    random_permutation(Pop,RandomPop),
	crossover(RandomPop,NPop1),
	mutation(NPop1,NPop),
	evaluate_population(NPop,NPopValue,Room),
	order_population(NPopValue,NPopOrd),

    ( (updateLastGenerations(NPopOrd),findIndividualsForNextGeneration(NextGeneration),!) ; true),

	N1 is N+1,
    verifyFinalConditions(NPopOrd,Room),

	generate_generation(N1,G,NPopOrd,Room,NextGeneration).

verifyFinalConditions(Pop,Room):-

    % Verify if the best individual is in the near perfect time
    findBestIndividual(Pop,R*T),
    nearPerfectTime(NPT),
    ( (T =< NPT, !, assert(best_individual_room(Room, R*T)), fail) ; true ),

    % Verify if the generations are stabilized
    retract(stabilizedGenerations(L,NG)),
    numberOfGenerationsThatStabilized(N),

    ( ( same(Pop,L),!,Nt is NG + 1,assert(stabilizedGenerations(Pop,Nt)) ) ; (assert(stabilizedGenerations(Pop,1))) ),

    stabilizedGenerations(_,NT2),

    ( (NT2 == N ,!,assert(best_individual_room(Room, R*T)),fail) ; true ).


generate_crossover_points(P1,P2):- generate_crossover_points1(P1,P2).

generate_crossover_points1(P1,P2):-
	n_surgeries(N),
	NTemp is N+1,
	random(1,NTemp,P11),
	random(1,NTemp,P21),
	P11\==P21,!,
	((P11<P21,!,P1=P11,P2=P21);P1=P21,P2=P11).
generate_crossover_points1(P1,P2):-
	generate_crossover_points1(P1,P2).


crossover([ ],[ ]).
crossover([Ind*_],[Ind]).
crossover([Ind1*_,Ind2*_|Rest],[NInd1,NInd2|Rest1]):-
	generate_crossover_points(P1,P2),
	prob_crossover(Pcruz),random(0.0,1.0,Pc),
	((Pc =< Pcruz,!,
        cross(Ind1,Ind2,P1,P2,NInd1),
	  cross(Ind2,Ind1,P1,P2,NInd2))
	;
	(NInd1=Ind1,NInd2=Ind2)),
	crossover(Rest,Rest1).

fillh([ ],[ ]).

fillh([_|R1],[h|R2]):-
	fillh(R1,R2).

sublist(L1,I1,I2,L):-I1 < I2,!,
    sublist1(L1,I1,I2,L).

sublist(L1,I1,I2,L):-sublist1(L1,I2,I1,L).

sublist1([X|R1],1,1,[X|H]):-!, fillh(R1,H).

sublist1([X|R1],1,N2,[X|R2]):-!,N3 is N2 - 1,
	sublist1(R1,1,N3,R2).

sublist1([_|R1],N1,N2,[h|R2]):-N3 is N1 - 1,
		N4 is N2 - 1,
		sublist1(R1,N3,N4,R2).

rotate_right(L,K,L1):- n_surgeries(N),
	T is N - K,
	rr(T,L,L1).

rr(0,L,L):-!.

rr(N,[X|R],R2):- N1 is N - 1,
	append(R,[X],R1),
	rr(N1,R1,R2).

remove([],_,[]):-!.

remove([X|R1],L,[X|R2]):- not(member(X,L)),!,
        remove(R1,L,R2).

remove([_|R1],L,R2):-
    remove(R1,L,R2).

insert([],L,_,L):-!.
insert([X|R],L,N,L2):-
    n_surgeries(T),
    ((N>T,!,N1 is N mod T);N1 = N),
    insert1(X,N1,L,L1),
    N2 is N + 1,
    insert(R,L1,N2,L2).


insert1(X,1,L,[X|L]):-!.
insert1(X,N,[Y|L],[Y|L1]):-
    N1 is N-1,
    insert1(X,N1,L,L1).

cross(Ind1,Ind2,P1,P2,NInd11):-
    sublist(Ind1,P1,P2,Sub1),
    n_surgeries(NumT),
    R is NumT-P2,
    rotate_right(Ind2,R,Ind21),
    remove(Ind21,Sub1,Sub2),
    P3 is P2 + 1,
    insert(Sub2,Sub1,P3,NInd1),
    removeh(NInd1,NInd11).


removeh([],[]).

removeh([h|R1],R2):-!,
    removeh(R1,R2).

removeh([X|R1],[X|R2]):-
    removeh(R1,R2).

mutation([],[]).
mutation([Ind|Rest],[NInd|Rest1]):-
	prob_mutation(Pmut),
	random(0.0,1.0,Pm),
	((Pm < Pmut,!,mutacao1(Ind,NInd));NInd = Ind),
	mutation(Rest,Rest1).

mutacao1(Ind,NInd):-
	generate_crossover_points(P1,P2),
	mutacao22(Ind,P1,P2,NInd).

mutacao22([G1|Ind],1,P2,[G2|NInd]):-
	!, P21 is P2-1,
	mutacao23(G1,P21,Ind,G2,NInd).
mutacao22([G|Ind],P1,P2,[G|NInd]):-
	P11 is P1-1, P21 is P2-1,
	mutacao22(Ind,P11,P21,NInd).

mutacao23(G1,1,[G2|Ind],G2,[G1|Ind]):-!.
mutacao23(G1,P,[G|Ind],G2,[G|NInd]):-
	P1 is P-1,
	mutacao23(G1,P1,Ind,G2,NInd).

findBestIndividual([Ind],Ind).
findBestIndividual([Ind|_],Ind).

verifyPopulationPermutationsLimit(Room):-
    (retractall(population(_));true),

    findall(Op,(surgery_room(Op,Room)),ListOfOp),
    length(ListOfOp,NumberOfOp),
    fact1(NumberOfOp,Res),
    base_population(RecievedValue),

    (Res > 1),

    ((Res < RecievedValue,!,assert(population(Res))) ; (assert(population(RecievedValue)))).

fact1(0,Result) :-
    Result is 1.
fact1(N,Result) :-
    N > 0,
    N1 is N-1,
    fact1(N1,Result1),
    Result is Result1*N.

formatIndividual(Ind*_,Ind).
formatIndividualValue(_*T,T).

% ----------------------------------------------------------------- Fiding the final time of a surgery permutation

% Melhor solu��o
obtain_better_sol(Room,Day,LOpCode,TFinOp,RoomsSChedules,LAgDoctorsBetter):-

    (obtain_better_sol1(Room,Day,LOpCode);true),

    retract(better_sol(Day,Room,RoomsSChedules,LAgDoctorsBetter,TFinOp)).

obtain_better_sol1(Room,Day,LOpCode):-

    % Pegar nas opera��es
    asserta(better_sol(Day,Room,[],[],1441)),

    % Limpar dados dinamicos
    retractall(agenda_staff1(_,_,_)),
    retractall(agenda_operation_room1(_,_,_)),
    retractall(agenda_operation_room2(_,_,_)),
    retractall(availability(_,_,_)),
    retractall(n_staff_op(_,_)),


    % Criar copia dos dados base para as variaveis dinamicas e define o numero de cirurgias de cada staff
    findall(_,(agenda_staff(D,Day,Agenda),assertz(agenda_staff1(D,Day,Agenda)),numberOfOperation(Agenda,N),assertz(n_staff_op(N,D))),_),
    agenda_operation_room(Room,Day,Agenda1),
    assertz(agenda_operation_room1(Room,Day,Agenda1)),
    findall(_,(agenda_staff1(D,Day,L),free_agenda0(L,LFA),adapt_timetable(D,Day,LFA,LFA2),assertz(availability(D,Day,LFA2))),_),

    % Agendar cirurgias
    availability_all_surgeries(LOpCode,Room,Day),

    % Update da melhor solu��o
    agenda_operation_room1(Room,Day,AgendaR),

    update_better_sol(Day,Room,AgendaR,LOpCode).

% D� update a better_sol se a Agenda do agenda_operation_room 1 for melhor que a atual
update_better_sol(Day,Room,Agenda,LOpCode):-

    better_sol(Day,Room,_,_,FinTime),
    reverse(Agenda,AgendaR),
    evaluate_final_time(AgendaR,LOpCode,FinTime1),

    FinTime1<FinTime,

    retract(better_sol(_,_,_,_,_)),

    findall((Doctor,Ag),agenda_staff1(Doctor,Day,Ag),LDAgendas),

    asserta(better_sol(Day,Room,Agenda,LDAgendas,FinTime1)).


evaluate_final_time([],_,1441).
evaluate_final_time([(_,Tfin,OpCode)|_],LOpCode,Tfin):-member(OpCode,LOpCode),!.
evaluate_final_time([_|AgR],LOpCode,Tfin):-evaluate_final_time(AgR,LOpCode,Tfin).

remove_equals([],[]).
remove_equals([X|L],L1):-member(X,L),!,remove_equals(L,L1).
remove_equals([X|L],[X|L1]):-remove_equals(L,L1).

free_agenda0([],[(0,1440)]).
free_agenda0([(0,Tfin,_)|LT],LT1):-
    !,free_agenda1([(0,Tfin,_)|LT],LT1).
free_agenda0([(Tin,Tfin,_)|LT],[(0,T1)|LT1]):-
    T1 is Tin-1,
    free_agenda1([(Tin,Tfin,_)|LT],LT1).

free_agenda1([(_,Tfin,_)],[(T1,1440)]):-
    Tfin\==1440,!,
    T1 is Tfin+1.
free_agenda1([(_,_,_)],[]).
free_agenda1([(_,T,_),(T1,Tfin2,_)|LT],LT1):-
    Tx is T+1,T1==Tx,!,
    free_agenda1([(T1,Tfin2,_)|LT],LT1).
free_agenda1([(_,Tfin1,_),(Tin2,Tfin2,_)|LT],[(T1,T2)|LT1]):-
    T1 is Tfin1+1,
    T2 is Tin2-1,
    free_agenda1([(Tin2,Tfin2,_)|LT],LT1).


adapt_timetable(D,Date,LFA,LFA2):-
    timetable(D,Date,(InTime,FinTime)),
    treatin(InTime,LFA,LFA1),
    treatfin(FinTime,LFA1,LFA2).

treatin(InTime,[(In,Fin)|LFA],[(In,Fin)|LFA]):-InTime=<In,!.
treatin(InTime,[(_,Fin)|LFA],LFA1):-InTime>Fin,!,
    treatin(InTime,LFA,LFA1).
treatin(InTime,[(_,Fin)|LFA],[(InTime,Fin)|LFA]).
treatin(_,[],[]).

treatfin(FinTime,[(In,Fin)|LFA],[(In,Fin)|LFA1]):-FinTime>=Fin,!,
    treatfin(FinTime,LFA,LFA1).
treatfin(FinTime,[(In,_)|_],[]):-FinTime=<In,!.
treatfin(FinTime,[(In,_)|_],[(In,FinTime)]).
treatfin(_,[],[]).

intersect_all_agendas([Name],Date,LA):-!,
    availability(Name,Date,LA).
intersect_all_agendas([Name|LNames],Date,LI):-availability(Name,Date,LA),
    intersect_all_agendas(LNames,Date,LI1),
    intersect_2_agendas(LA,LI1,LI).

intersect_2_agendas([],_,[]).
intersect_2_agendas([D|LD],LA,LIT):-
    intersect_availability(D,LA,LI,LA1),
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
    min_max(Ini,Ini1,_,Imax),min_max(Fim,Fim1,Fmin,_).

intersect_availability((Ini,Fim),[(Ini1,Fim1)|LD],[(Imax,Fmin)|LI],LA):-
    Fim>=Fim1,!,
    min_max(Ini,Ini1,_,Imax),
    min_max(Fim,Fim1,Fmin,_),intersect_availability((Fim1,Fim),LD,LI,LA).

min_max(I,I1,I,I1):- I<I1,!.
min_max(I,I1,I1,I).



availability_all_surgeries([],_,_).
availability_all_surgeries([OpCode|LOpCode],Room,Day):-

    %Part 1 Get necessary Staff for the operation with id OpCode
    surgery_id(OpCode,OpType),surgery(OpType,TAnesthesia,TSurgery,TCleaning),
    TotalTime is TAnesthesia+TSurgery+TCleaning,

    findALLNecessaryStaff(OpType,ListOfStaffsAnesthesia,ListOfStaffsAssistant,ListOfStaffsSurgery),

    agenda_operation_room1(Room,Day,LAgenda),

    asserta(agenda_operation_room2(Room,Day,LAgenda)),

    % Part 2 Trying to find a available slot in room where all staff is available
    (  (findAvailableTimeForStaffAndRoom(TotalTime,OpType,Room,Day,ListOfStaffsAnesthesia,ListOfStaffsAssistant,ListOfStaffsSurgery,TinS,TfinS),! ) ; 

        (
            retract(agenda_operation_room2(Room,Day,_)),
            retract(better_sol(Day,Room,_,_,_)),
            asserta(better_sol(Day,Room,[],[],1441)),
            !,fail

        )
    
    ),

    retract(agenda_operation_room2(Room,Day,_)),
    


    TimeFinalForAnaesthesia is TinS + TAnesthesia + TSurgery - 1,

    SurgeryIntialTIme is TinS + TAnesthesia,

    TInitialForCleaning is TimeFinalForAnaesthesia + 1,

    TimeFinalForCleaning is TinS + TSurgery + TAnesthesia + TCleaning - 1,


    % Part 3 Update all the Staff and room agenda
    retract(agenda_operation_room1(Room,Day,Agenda)),
    insert_agenda((TinS,TfinS,OpCode),Agenda,Agenda1),
    assertz(agenda_operation_room1(Room,Day,Agenda1)),


    addOpCodeToFormat([(TinS,TimeFinalForAnaesthesia)],OpCode,NewFormat),
    insert_agenda_doctors(NewFormat,Day,ListOfStaffsAnesthesia),

    addOpCodeToFormat([(SurgeryIntialTIme,TimeFinalForAnaesthesia)],OpCode,NewFormat2),
    insert_agenda_doctors(NewFormat2,Day,ListOfStaffsSurgery),

    addOpCodeToFormat([(TInitialForCleaning,TimeFinalForCleaning)],OpCode,NewFormat3),
    insert_agenda_doctors(NewFormat3,Day,ListOfStaffsAssistant),

    % Next permutation
    availability_all_surgeries(LOpCode,Room,Day).


findAvailableTimeForStaffAndRoom(TotalTime,OpType,Room,Day,ListOfStaffsAnesthesia,ListOfStaffsAssistant,ListOfStaffsSurgery,TinSF,TfinSF):-

    % Part 1 Find Room first interval
    surgery(OpType,TAnesthesia,TSurgery,TCleaning),
    agenda_operation_room2(Room,Day,Agenda),
    free_agenda0(Agenda,LFAgRoom),
    remove_unf_intervals(TotalTime,LFAgRoom,LRoomAvailability),
    schedule_first_interval(TotalTime,LRoomAvailability,(TinS,TfinS)),

    ( ( TfinS > 1439 , fail) ; true), 

    % Part 2 Find in the Staff is free in the Specific time
    TimeFinalForAnaesthesia is TinS + TAnesthesia + TSurgery - 1,
    SurgeryTotalTime is TSurgery + TAnesthesia,
    availability_staff(Day,AneasthesiaTime,ListOfStaffsAnesthesia,(TinS,TimeFinalForAnaesthesia),SurgeryTotalTime),

    SurgeryIntialTIme is TinS + TAnesthesia,
    availability_staff(Day,SurgeryTime,ListOfStaffsSurgery,(SurgeryIntialTIme,TimeFinalForAnaesthesia),TSurgery),

    TInitialForCleaning is TimeFinalForAnaesthesia + 1,
    TimeFinalForCleaning is TinS + TSurgery + TAnesthesia + TCleaning - 1,
    availability_staff(Day,CleaningTime,ListOfStaffsAssistant,(TInitialForCleaning,TimeFinalForCleaning),TCleaning),



    % Part 3 verify if all the Staff are available
    ( (is_list_empty(AneasthesiaTime) ; is_list_empty(SurgeryTime) ; is_list_empty(CleaningTime)) ->

    retract(agenda_operation_room2(Room,Day,Agenda1)),
    MinutesLater10 is TinS + 10,
    insert_agenda((TinS,MinutesLater10,TotalTime),Agenda1,Agenda2),
    assertz(agenda_operation_room2(Room,Day,Agenda2)),

    ( (findAvailableTimeForStaffAndRoom(TotalTime,OpType,Room,Day,ListOfStaffsAnesthesia,ListOfStaffsAssistant,ListOfStaffsSurgery,TinSF1,TfinSF1)) 
    ; (!,fail) ),

    % Resultado do BackTracking
    TinSF is TinSF1,TfinSF is TfinSF1
    
    ;TinSF is TinS, TfinSF is TfinS,!
    
    ).

% Verifica se alguma se a lista � vazia
is_list_empty([]).
is_list_empty([_|_]) :-fail.

% Encontrar o tempo disponivel para um conjunto de staffs
availability_staff(Day,Result,ListOfStaffs,(TinS,TfinS),TotalTime) :-
    intersect_all_agendas(ListOfStaffs,Day,StaffFreeTime),
    intersect_2_agendas(StaffFreeTime,[(TinS,TfinS)],Result1),
    remove_unf_intervals(TotalTime,Result1,Result).

% Remove intervalos que n�o tenham tempo TSurgery
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

% Formata o a cirurgia para ser inserida na agenda
addOpCodeToFormat([(TinS,TfinS)],OpCode,(TinS,TfinS,OpCode)).

% Retorna o numero de opera��es de uma agenda
numberOfOperation([],0).
numberOfOperation([(_,_,_)| Agenda ],Res):-
    numberOfOperation(Agenda,Res1),
    Res is Res1 + 1.


% Retorna a lista de staffs necessarios para um SurgeryType
findALLNecessaryStaff(SurgeryType,ListOfStaffsAnesthesia,ListOfStaffsCleaning,ListOfStaffsSurgery):-

    % Find the necessary Staff for phase Anesthesia
    findNecessaryStaffByType(SurgeryType,"ANAESTHETIST",ListOfStaffsAnesthesia),

    % Find the necessary Staff for phase Cleaning
    findNecessaryStaffByType(SurgeryType,"ASSISTANT",ListOfStaffsCleaning),

    % Find all the Surgery type for Surgery phase , by removing the types anaesthetis and assistant
    findall(DocType,(surgery_Required_Staff(SurgeryType,_,_,DocType)),ListOfDocTypes),
    delete(ListOfDocTypes,"ANAESTHETIST",ListOfDocTypes1),
    delete(ListOfDocTypes1,"ASSISTANT",ListOfDocTypes2), 

    %Remove duplicates
    remove_equals(ListOfDocTypes2,ListOfDocTypes3),


    % Find the necessary Staff for phase Surgery
    findall(Res,(member(StaffType,ListOfDocTypes3),findNecessaryStaffByType(SurgeryType,StaffType,Res)),ListOfStaffsSurgery1),
    append(ListOfStaffsSurgery1,ListOfStaffsSurgery).

% Finds all the Role and Staff Type for the Specific Surgery
findNecessaryStaffByType(SurgeryType,StaffType,FinalList):-

    findall(Res,(surgery_Required_Staff(SurgeryType,NumberOfStaffs,Role,StaffType) ,
    findByStaff_Role_and_Type(Role,StaffType,Res,NumberOfStaffs)),ListOFStaffs),

    append(ListOFStaffs,FinalList).

% Finds all the Staff with the specific role and type and chooses the
% ones with the lowes Operation count
findByStaff_Role_and_Type(Role,Type,NeededDoctors,NumberLeftOfDoctors):-

    findall(D,staff(D,Role,Type),LOfDoctors),

    findByStaff_Role_and_Type(LOfDoctors,NeededDoctors,NumberLeftOfDoctors).


findByStaff_Role_and_Type(_,[],0).

% Gets all the staff with the lowest number of Surgeries
findByStaff_Role_and_Type(LOfDoctors,[LowDoc|NeededDoctors],NumberLeftOfDoctors):-
    findLowestSurgeryNumber(LOfDoctors,LowDoc,_),
    NumberLeftOfDoctors1 is NumberLeftOfDoctors - 1,
    delete(LOfDoctors,LowDoc,NewList),
    findByStaff_Role_and_Type(NewList,NeededDoctors,NumberLeftOfDoctors1).


findLowestSurgeryNumber([D],D,Number):- n_staff_op(Number,D).

% Encontrar o staff com o menor numero de opera��es
findLowestSurgeryNumber([D|LOfDoctors],Res,Number):-
    n_staff_op(N,D),
    findLowestSurgeryNumber(LOfDoctors,Res1,Number1),
    (N<Number1 -> Res = D, Number = N; Res = Res1, Number = Number1).

createNearPerfectTime(Room):-
    agenda_operation_room(Room,_,Agenda),
    roomAgendaSumTimes(Agenda,SumTimes),
    findall(OpCode,(surgery_room(OpCode,Room)),ListOfOp),
    findall(Time,(member(OpCode,ListOfOp),surgery_id(OpCode,OpType),surgery(OpType,T1,T2,T3),Time is T1+T2+T3),ListOfTimes),
    sum_list(ListOfTimes,SumTimesOp),
    additionToPerfectTime(R),
    NearPerfectTime is SumTimesOp + SumTimes + R,
    retractall(nearPerfectTime(_)),
    assert(nearPerfectTime(NearPerfectTime)).
roomAgendaSumTimes([],0).
roomAgendaSumTimes([(TinS,TfinS,_)|Agenda],SumTimes):-
    roomAgendaSumTimes(Agenda,SumTimes1),
    SumTimes is SumTimes1 + (TfinS - TinS).

same([], []).

same([H1|R1],L):-
    member(H1,L),
    delete(L,H1,L1),
    same(R1, L1).

updateLastGenerations(Pop):-
    retract(lastGenerations(L,N)),
    NumberOfOldGenerations is N + 1,
    append(L,Pop,NewList),
    remove_equals(NewList,NewNewList),
    assert(lastGenerations(NewNewList,NumberOfOldGenerations)),
    NumberOfOldGenerations == 2.


findIndividualsForNextGeneration(NextGeneration):-
    retract(lastGenerations(L,_)),
    order_population(L,OrderedPop),
    length(OrderedPop,Length),
    population(MinimumNumBer),

    ( (Length < MinimumNumBer,! ,assert(lastGenerations([],0)) , empty_list(NextGeneration),fail) ; true),

    P is round(0.2 * MinimumNumBer),

    % Fiding the best/bests individuals
    ((P < 1,!,N_BestInd is 1) ; (N_BestInd is P)),
    n_BestIndividuals_to_list(N_BestInd,OrderedPop,BestMembers,RemovedMembersList),
    % Fiding the remaining individuals
    randomEvaluations(RemovedMembersList,RandomEvaluatedRemovedMembersList),
    order_population(RandomEvaluatedRemovedMembersList,OrderedLast),
    Remaining_Members is MinimumNumBer - N_BestInd,
    n_BestIndividuals_to_list(Remaining_Members,OrderedLast,Remaining_Members_Final,_),
    indivualsOldValues(Remaining_Members_Final,OrderedPop,Remaining_Individuals),

    append(BestMembers,Remaining_Individuals,NextGeneration1),
    order_population(NextGeneration1,NextGeneration),


    assert(lastGenerations([],0)).


empty_list([]).

n_BestIndividuals_to_list(0,D,[],D):-!.
n_BestIndividuals_to_list(Number,[D|List],[D|NewMembersList],RemovedMembersList):-
    N is Number - 1,
    delete(List,D,RemovedD),
    n_BestIndividuals_to_list(N,RemovedD,NewMembersList,RemovedMembersList).

randomEvaluations([],[]).
randomEvaluations([Ind*T|List],[Ind*NewT|NewList]):-
	random(0.0,1.0,Value),
        NewT is round(T * Value),
        randomEvaluations(List,NewList).


indivualsOldValues([],_,[]).
indivualsOldValues([D*_|Final_List],Old_List,[D*TV|ResultList]):-
    memberWithFormat(D,Old_List,TV),
    indivualsOldValues(Final_List,Old_List,ResultList).

memberWithFormat(D,[T*V|_],V):-
    D == T.

memberWithFormat(D,[_|List],V):-
    memberWithFormat(D,List,V).

staffAgenda([]):-!.
staffAgenda([(Doc,Ag)|List]):-
    retract(agenda_staff(Doc,Day,_)),
    assert(agenda_staff(Doc,Day,Ag)),
    staffAgenda(List).
