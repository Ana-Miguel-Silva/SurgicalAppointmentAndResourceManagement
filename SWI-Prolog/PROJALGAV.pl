% Bibliotecas
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/http_open)).
:- use_module(library(http/http_cors)).
:- use_module(library(date)).
:- use_module(library(random)).
% Bibliotecas JSON
:- use_module(library(http/json_convert)).
:- use_module(library(http/http_json)).
:- use_module(library(http/json)).

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
:- json_object surgeryJson(
    rooms:list(room_json),       % List of room schedules
    doctors:list(surgeryStaffJson), % List of doctor schedules
    day:integer,                  % Date received by better_sol
    room:atom                     % Room received by better_sol
).


:- json_object surgeryJson(array:list(surgeryStaffJson)).
:- json_object surgeryStaffJson(staffId:string,agenda_array:list(agenda_json)).
:- json_object agenda_json(instanteInicial:integer,instanteFinal:integer,idDaOperecao:string).
:- json_object room_json(instanteInicial:integer, instanteFinal:integer, idDaOperacao:string).


% HANDLERS

:- http_handler('/scheduleAllOperationsInADay', get_all_Surgeries, []).
get_all_Surgeries(_Request) :-
    cors_enable,
    (   obtain_better_sol(or1, 20241028, ROOMS, DOCTORS, _TFinOp)
    ->  treatRoomData(ROOMS, RoomRes),
        treatSurgeryData(DOCTORS, DoctorRes),
        SurgeryJsonFinal = surgeryJson(RoomRes, DoctorRes, 20241028, or1), % Pass the date (Day) and room (Room)
        (   prolog_to_json(SurgeryJsonFinal, JSONObject)
        ->  reply_json(JSONObject, [json_object(dict)])
        ;   reply_json(json([error='JSON conversion failed']), [status(500)])
        )
    ;   reply_json(json([error='Internal Server Error']), [status(500)])
    ).

% Methods
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

% Process room data into JSON-compatible format
treatRoomData([], []).
treatRoomData([(Ini, Fin, Id)|Rooms], [Res1|Res]) :-
    atom_string(Id, IdStr),
    Res1 = room_json(Ini, Fin, IdStr),
    treatRoomData(Rooms, Res).

:-dynamic availability/3.
:-dynamic agenda_staff/3.
:-dynamic agenda_staff1/3.
:-dynamic agenda_operation_room/3.
:-dynamic agenda_operation_room1/3.
:-dynamic agenda_operation_room2/3.
:-dynamic better_sol/5.
:-dynamic n_staff_op/2.

% Definir o staff e o seu horario
agenda_staff(d001, 20241028, [(420, 580, so100000),(690, 900, so100099)]).
agenda_staff(d002, 20241028, [(420, 580, so100000),(690, 900, so100099)]).
agenda_staff(d003, 20241028, [(420, 580, so100000),(690, 900, so100099)]).
agenda_staff(d004, 20241028, [(420, 580, so100000),(690, 900, so100099)]).
agenda_staff(d005, 20241028, [(420, 580, so100000),(690, 900, so100099)]).
agenda_staff(d006, 20241028, [(420, 580, so100000),(690, 900, so100099)]).
agenda_staff(d007, 20241028, [(420, 580, so100000),(690, 900, so100099)]).
agenda_staff(d008, 20241028, [(420, 580, so100000),(690, 900, so100099)]).
agenda_staff(d009, 20241028, [(420, 580, so100000),(690, 900, so100099)]).
agenda_staff(d010, 20241028, [(420, 580, so100000),(690, 900, so100099)]).
agenda_staff(d011, 20241028, [(420, 580, so100000),(690, 900, so100099)]).
agenda_staff(d012, 20241028, [(420, 580, so100000),(690, 900, so100099)]).
agenda_staff(d013, 20241028, [(420, 580, so100000),(690, 900, so100099)]).
agenda_staff(d014, 20241028, [(420, 580, so100000),(690, 900, so100099)]).
agenda_staff(d015, 20241028, [(420, 580, so100000),(690, 900, so100099)]).
agenda_staff(d016, 20241028, [(420, 580, so100000),(690, 900, so100099)]).
agenda_staff(d017, 20241028, [(420, 580, so100000),(690, 900, so100099)]).
agenda_staff(d018, 20241028, [(420, 580, so100000),(690, 900, so100099)]).
agenda_staff(d019, 20241028, [(420, 580, so100000),(690, 900, so100099)]).
agenda_staff(d020, 20241028, [(420, 580, so100000),(690, 900, so100099)]).

% Definir o horario de entrada e saida do staff
timetable(d001, 20241028, (260, 1440)).
timetable(d002, 20241028, (260, 1440)).
timetable(d003, 20241028, (260, 1440)).
timetable(d004, 20241028, (260, 1440)).
timetable(d005, 20241028, (260, 1440)).
timetable(d006, 20241028, (260, 1440)).
timetable(d007, 20241028, (260, 1440)).
timetable(d008, 20241028, (260, 1440)).
timetable(d009, 20241028, (260, 1440)).
timetable(d010, 20241028, (260, 1440)).
timetable(d011, 20241028, (260, 1440)).
timetable(d012, 20241028, (260, 1440)).
timetable(d013, 20241028, (260, 1440)).
timetable(d014, 20241028, (260, 1440)).
timetable(d015, 20241028, (260, 1440)).
timetable(d016, 20241028, (260, 1440)).
timetable(d017, 20241028, (260, 1440)).
timetable(d018, 20241028, (260, 1440)).
timetable(d019, 20241028, (260, 1440)).
timetable(d020, 20241028, (260, 1440)).
timetable(d021, 20241028, (260, 1440)).

% Definir a especialidade e role do staff
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

% Definir tempo das etapas
surgery(so2,45,60,45).
surgery(so3,30,40,30).
surgery(so4,45,110,45).

% Definir staff necessario para surgery type so2
surgery_Required_Staff(so2, 3, doctor, orthopaedist). % At least 1 must be an orthopaedist
surgery_Required_Staff(so2, 1, doctor, anaesthetist).
surgery_Required_Staff(so2, 1, nurse, instrumenting).
surgery_Required_Staff(so2, 1, nurse, circulating).
surgery_Required_Staff(so2, 1, nurse, anaesthetist).
surgery_Required_Staff(so2, 1, nurse, assistant).

% Definir staff necessario para surgery type so3
surgery_Required_Staff(so3, 3, doctor, orthopaedist).
surgery_Required_Staff(so3, 1, doctor, anaesthetist).
surgery_Required_Staff(so3, 1, nurse, instrumenting).
surgery_Required_Staff(so3, 1, nurse, circulating).
surgery_Required_Staff(so3, 1, nurse, anaesthetist).
surgery_Required_Staff(so3, 1, nurse, assistant).

% Definir staff necessario para surgery type so4
surgery_Required_Staff(so4, 2, doctor, orthopaedist).
surgery_Required_Staff(so4, 1, doctor, anaesthetist).
surgery_Required_Staff(so4, 1, nurse, instrumenting).
surgery_Required_Staff(so4, 1, nurse, circulating).
surgery_Required_Staff(so4, 1, nurse, anaesthetist).
surgery_Required_Staff(so4, 1, nurse, assistant).

% Definir tipo de operação para cada operação
surgery_id(so100001,so2).
surgery_id(so100002,so3).
surgery_id(so100003,so4).
surgery_id(so100004,so2).

% Definir horario da sala
agenda_operation_room(or1,20241028,[]).


% Melhor solução
obtain_better_sol(Room,Day,AgOpRoomBetter,LAgDoctorsBetter,TFinOp):-
    (obtain_better_sol1(Room,Day);true),

    retract(better_sol(Day,Room,AgOpRoomBetter,LAgDoctorsBetter,TFinOp)),

    debug(http, 'AgOpRoomBetter: ~w', [AgOpRoomBetter]),
    debug(http, 'LAgDoctorsBetter: ~w', [LAgDoctorsBetter]),
    debug(http, 'TFinOp: ~w', [TFinOp]).

obtain_better_sol1(Room,Day):-

    % Pegar nas operações
    asserta(better_sol(Day,Room,_,_,1441)),
    findall(OpCode,surgery_id(OpCode,_),LOC),!,

    % Fazer permutações
    permutation(LOC,LOpCode),

    % Limpar dados dinamicos
    retractall(agenda_staff1(_,_,_)),
    retractall(agenda_operation_room1(_,_,_)),
    retractall(agenda_operation_room2(_,_,_)),
    retractall(availability(_,_,_)),
    retractall(n_staff_op(_,_)),

    % Criar copia dos dados base para as variaveis dinamicas e define o numero de cirurgias de cada staff
    findall(_,(agenda_staff(D,Day,Agenda),assertz(agenda_staff1(D,Day,Agenda)),numberOfOperation(Agenda,N),assertz(n_staff_op(N,D))),_),
    agenda_operation_room(Room,Day,Agenda),assert(agenda_operation_room1(Room,Day,Agenda)),
    findall(_,(agenda_staff1(D,Day,L),free_agenda0(L,LFA),adapt_timetable(D,Day,LFA,LFA2),assertz(availability(D,Day,LFA2))),_),

    % Agendar cirurgias
    availability_all_surgeries(LOpCode,Room,Day),

    % Update da melhor solução
    agenda_operation_room1(Room,Day,AgendaR),
    update_better_sol(Day,Room,AgendaR,LOpCode),

    % Proxima permutação
    fail.

% Dá update a better_sol se a Agenda do agenda_operation_room 1 for melhor que a atual
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

    % Encontrar os tempos das cirurgias
    surgery_id(OpCode,OpType),surgery(OpType,TAnesthesia,TSurgery,TCleaning),
    TotalTime is TAnesthesia+TSurgery+TCleaning,

    % Pegar no Staff necessario para uma operaçao do tipo OpType
    findALLNecessaryStaff(OpType,ListOfStaffsAnesthesia,ListOfStaffsAssistant,ListOfStaffsSurgery),

    agenda_operation_room1(Room,Day,LAgenda),

    % copiar agenda para agenda temporaria 2
    asserta(agenda_operation_room2(Room,Day,LAgenda)),

    % Tenta encontrar um intervalo para a cirurgia onde todos os staffs estão disponiveis para as suas fases
    findAvailableTimeForStaffAndRoom(TotalTime,OpType,Room,Day,ListOfStaffsAnesthesia,ListOfStaffsAssistant,ListOfStaffsSurgery,TinS,TfinS),

    retract(agenda_operation_room2(Room,Day,_)),
    
    TimeFinalForAnaesthesia is TinS + TAnesthesia + TSurgery - 1,

    SurgeryIntialTIme is TinS + TAnesthesia,

    TInitialForCleaning is TimeFinalForAnaesthesia + 1,

    TimeFinalForCleaning is TinS + TSurgery + TAnesthesia + TCleaning - 1,


    % Dar update ao horario de quartos
    retract(agenda_operation_room1(Room,Day,Agenda)),
    insert_agenda((TinS,TfinS,OpCode),Agenda,Agenda1),
    assertz(agenda_operation_room1(Room,Day,Agenda1)),

    
    % Dar update ao horario dos staffs e ao numero de operações
    addOpCodeToFormat([(TinS,TimeFinalForAnaesthesia)],OpCode,NewFormat),
    insert_agenda_doctors(NewFormat,Day,ListOfStaffsAnesthesia),

    addOpCodeToFormat([(SurgeryIntialTIme,TimeFinalForAnaesthesia)],OpCode,NewFormat2),
    insert_agenda_doctors(NewFormat2,Day,ListOfStaffsSurgery),

    addOpCodeToFormat([(TInitialForCleaning,TimeFinalForCleaning)],OpCode,NewFormat3),
    insert_agenda_doctors(NewFormat3,Day,ListOfStaffsAssistant),

    % Proxima cirurgia da permutação atual
    availability_all_surgeries(LOpCode,Room,Day).


findAvailableTimeForStaffAndRoom(TotalTime,OpType,Room,Day,ListOfStaffsAnesthesia,ListOfStaffsAssistant,ListOfStaffsSurgery,TinSF,TfinSF):-

    
    % Pegar no tempo livre da sala
    surgery(OpType,TAnesthesia,TSurgery,TCleaning),
    agenda_operation_room2(Room,Day,Agenda),
    free_agenda0(Agenda,LFAgRoom),
    remove_unf_intervals(TotalTime,LFAgRoom,LRoomAvailability),
    schedule_first_interval(TotalTime,LRoomAvailability,(TinS,TfinS)),

    % Retorna o tempo livre dentro do horario da cirurgia para Aneasthesia
    TimeFinalForAnaesthesia is TinS + TAnesthesia + TSurgery - 1,
    SurgeryTotalTime is TSurgery + TAnesthesia,
    availability_staff(Day,AneasthesiaTime,ListOfStaffsAnesthesia,(TinS,TimeFinalForAnaesthesia),SurgeryTotalTime),

    % Retorna o tempo livre dentro do horario da cirurgia para Surgery    
    SurgeryIntialTIme is TinS + TAnesthesia,
    availability_staff(Day,SurgeryTime,ListOfStaffsSurgery,(SurgeryIntialTIme,TimeFinalForAnaesthesia),TSurgery),

% Retorna o tempo livre dentro do horario da cirurgia para Cleaning
    TInitialForCleaning is TimeFinalForAnaesthesia + 1,
    TimeFinalForCleaning is TinS + TSurgery + TAnesthesia + TCleaning - 1,
    availability_staff(Day,CleaningTime,ListOfStaffsAssistant,(TInitialForCleaning,TimeFinalForCleaning),TCleaning),

    % Verificar se os staff conseguem fazer a cirurgia na hora marcada. Caso não consiga volta a repetir-se o processo de marcação todo

    % Vê se algum dos tempos é vazio (staffs não disponiveis para aquela hora de cirurgia)
    ( (is_list_empty(AneasthesiaTime) ; is_list_empty(SurgeryTime) ; is_list_empty(CleaningTime)) -> 

    % Coloca o inervalo de cirurgia ocupado para tentar o seguinte intervalo possivel
    retract(agenda_operation_room2(Room,Day,Agenda1)),
    insert_agenda((TinS,(TinS + 9),TotalTime),Agenda1,Agenda2),
    assertz(agenda_operation_room2(Room,Day,Agenda2)),

    % Volta a tentar encontrar um intervalo para a cirurgia mas com agenda_operation_room2 atualizada
    findAvailableTimeForStaffAndRoom(TotalTime,OpType,Room,Day,ListOfStaffsAnesthesia,ListOfStaffsAssistant,ListOfStaffsSurgery,TinSF1,TfinSF1),

    % Staff consegue fazer a cirurgia
    TinSF is TinSF1,TfinSF is TfinSF1;
    
    % Staff consegue fazer a cirurgia
    TinSF is TinS, TfinSF is TfinS,!
    ).

% Verifica se alguma se a lista é vazia
is_list_empty([]).
is_list_empty([_|_]) :-fail.

% Encontrar o tempo disponivel para um conjunto de staffs
availability_staff(Day,Result,ListOfStaffs,(TinS,TfinS),TotalTime) :-
    intersect_all_agendas(ListOfStaffs,Day,StaffFreeTime),
    intersect_2_agendas(StaffFreeTime,[(TinS,TfinS)],Result1),
    remove_unf_intervals(TotalTime,Result1,Result).

% Remove intervalos que não tenham tempo TSurgery 
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

% Retorna o numero de operações de uma agenda
numberOfOperation([],0).
numberOfOperation([(_,_,_)| Agenda ],Res):-
    numberOfOperation(Agenda,Res1),
    Res is Res1 + 1.


% Retorna a lista de staffs necessarios para um SurgeryType
findALLNecessaryStaff(SurgeryType,ListOfStaffsAnesthesia,ListOfStaffsCleaning,ListOfStaffsSurgery):-

    % Econtrar os funcionarios da fase Aneasthesia
    findNecessaryStaffByType(SurgeryType,anaesthetist,ListOfStaffsAnesthesia),

    % Econtrar os funcionarios da fase Cleaning
    findNecessaryStaffByType(SurgeryType,assistant,ListOfStaffsCleaning),

    % Pegar em todas as especialidades da fase Surgery
    findall(DocType,(surgery_Required_Staff(SurgeryType,_,_,DocType)),ListOfDocTypes),
    delete(ListOfDocTypes,anaesthetist,ListOfDocTypes1),
    delete(ListOfDocTypes1,assistant,ListOfDocTypes2),

    % Remover especialidades repetidas
    remove_equals(ListOfDocTypes2,ListOfDocTypes3),


    % Encontrar os funcionarios da fase Surgery
    findall(Res,(member(StaffType,ListOfDocTypes3),findNecessaryStaffByType(SurgeryType,StaffType,Res)),ListOfStaffsSurgery1),
    append(ListOfStaffsSurgery1,ListOfStaffsSurgery).

% Coloca os staff necessarios com StaffType em FinalList
findNecessaryStaffByType(SurgeryType,StaffType,FinalList):-

    
    findall(Res,(surgery_Required_Staff(SurgeryType,NumberOfStaffs,Role,StaffType) ,
    findByStaff_Role_and_Type(Role,StaffType,Res,NumberOfStaffs)),ListOFStaffs),
    append(ListOFStaffs,FinalList).

% Encontrar NumberLeft staff com menor numero de operações e com Role e Type
findByStaff_Role_and_Type(Role,Type,NeededDoctors,NumberLeftOfDoctors):-

    % Pega em todos os staff com Role e Type e mete em LOfDoctors
    findall(D,staff(D,Role,Type),LOfDoctors),

    % Coloca o numero de staff preciso e com menos operações em NeededDoctors
    findByStaff_Role_and_Type(LOfDoctors,NeededDoctors,NumberLeftOfDoctors).

% Condição de paragem (ja não é preciso mais deste tipo de staff)
findByStaff_Role_and_Type(_,[],0).

% Pega no numero de staff necessario com menos operações
findByStaff_Role_and_Type(LOfDoctors,[LowDoc|NeededDoctors],NumberLeftOfDoctors):-
    findLowestSurgeryNumber(LOfDoctors,LowDoc,_),
    NumberLeftOfDoctors1 is NumberLeftOfDoctors - 1,
    delete(LOfDoctors,LowDoc,NewList),
    findByStaff_Role_and_Type(NewList,NeededDoctors,NumberLeftOfDoctors1).

% Condição de paragem (ultimo staff da lista)
findLowestSurgeryNumber([D],D,Number):- n_staff_op(Number,D).

% Encontrar o staff com o menor numero de operações
findLowestSurgeryNumber([D|LOfDoctors],Res,Number):-
    n_staff_op(N,D),
    findLowestSurgeryNumber(LOfDoctors,Res1,Number1),
    (N<Number1 -> Res = D, Number = N; Res = Res1, Number = Number1).