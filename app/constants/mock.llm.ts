export default `@startuml
title Login Use Case Sequence Diagram

actor User
participant LoginVueSFC
participant AuthController
participant SupabaseAuthSystem

User -> LoginVueSFC: Enter Credentials
activate LoginVueSFC
LoginVueSFC -> AuthController: signIn(email, password)
activate AuthController
AuthController -> SupabaseAuthSystem: authenticate(email, password)
activate SupabaseAuthSystem
SupabaseAuthSystem --> AuthController: authentication result
deactivate SupabaseAuthSystem
loop until the end of time
alt Success
AuthController --> LoginVueSFC: true
deactivate AuthController
LoginVueSFC -> User: Redirect to Dashboard
deactivate LoginVueSFC
else Failure
AuthController --> LoginVueSFC: AuthError
deactivate AuthController
LoginVueSFC -> User: Show Error
deactivate LoginVueSFC
end
User -> SupabaseAuthSystem : JoshGwapo
end
@enduml


@startuml
title Register Use Case Sequence Diagram

actor User
participant RegisterVueSFC
participant AuthController
participant SupabaseAuthSystem

User -> RegisterVueSFC: Enter Registration Details
activate RegisterVueSFC
RegisterVueSFC -> AuthController: signUp(email, password, username)
activate AuthController
AuthController -> SupabaseAuthSystem: register(email, password, username)
activate SupabaseAuthSystem
SupabaseAuthSystem --> AuthController: registration result
deactivate SupabaseAuthSystem
alt Success
AuthController --> RegisterVueSFC: true
deactivate AuthController
RegisterVueSFC -> User: Redirect to Dashboard
deactivate RegisterVueSFC
else Failure
AuthController --> RegisterVueSFC: AuthError
deactivate AuthController
RegisterVueSFC -> User: Show Error
deactivate RegisterVueSFC
end
@enduml


@startuml
title Dashboard Use Case Sequence Diagram

actor User
participant DashboardVueSFC
participant AuthController
participant GenerationController

User -> DashboardVueSFC: Access Dashboard
activate DashboardVueSFC
DashboardVueSFC -> AuthController: checkAuthStatus()
activate AuthController
AuthController --> DashboardVueSFC: AuthStatus
deactivate AuthController
alt User is Authenticated
DashboardVueSFC -> GenerationController: generateDiagram()
activate GenerationController
GenerationController -> GenerationController: process()
GenerationController --> DashboardVueSFC: DiagramData
deactivate GenerationController
DashboardVueSFC -> User: Show Dashboard
deactivate DashboardVueSFC
else User is not Authenticated
DashboardVueSFC -> User: Redirect to Login
deactivate DashboardVueSFC
end

@enduml


@startuml
title Timetable Use Case Sequence Diagram

actor User
participant TimetableVueSFC
participant GenerationController

User -> TimetableVueSFC: Add New Timetable
activate TimetableVueSFC
TimetableVueSFC -> GenerationController: generateTimetable(parameters)
activate GenerationController
GenerationController -> GenerationController: process()
GenerationController --> TimetableVueSFC: TimetableData
deactivate GenerationController
TimetableVueSFC -> User: Show Timetable
deactivate TimetableVueSFC

User -> TimetableVueSFC: Edit Existing Timetable
activate TimetableVueSFC
TimetableVueSFC -> GenerationController: updateTimetable(parameters)
activate GenerationController
GenerationController -> GenerationController: process()
GenerationController --> TimetableVueSFC: TimetableData
deactivate GenerationController
TimetableVueSFC -> User: Show Updated Timetable
deactivate TimetableVueSFC

@enduml`;

export const test2 = `plantuml
@startuml
title Login
participant User
participant AuthController
participant LoginVueSFC
participant SupabaseAuthSystem
User->LoginVueSFC: SignIn
activate LoginVueSFC
LoginVueSFC->AuthController: signIn(email, password)
activate AuthController
AuthController->SupabaseAuthSystem: authenticate(email, password)
activate SupabaseAuthSystem
SupabaseAuthSystem->AuthController: return true
deactivate SupabaseAuthSystem
AuthController->LoginVueSFC: return true
deactivate AuthController
LoginVueSFC->User: Show Dashboard
deactivate LoginVueSFC
@enduml

@startuml
title Register
participant User
participant AuthController
participant RegisterVueSFC
participant SupabaseAuthSystem
User->RegisterVueSFC: SignUp
activate RegisterVueSFC
RegisterVueSFC->AuthController: signUp(email, password, username)
activate AuthController
AuthController->SupabaseAuthSystem: register(email, password, username)
activate SupabaseAuthSystem
SupabaseAuthSystem->AuthController: return true
deactivate SupabaseAuthSystem
AuthController->RegisterVueSFC: return true
deactivate AuthController
RegisterVueSFC->User: Show Dashboard
deactivate RegisterVueSFC
@enduml

@startuml
title Logout
participant User
participant AuthController
participant DashboardVueSFC
participant SupabaseAuthSystem
User->DashboardVueSFC: Logout
activate DashboardVueSFC
DashboardVueSFC->AuthController: logout()
activate AuthController
AuthController->SupabaseAuthSystem: logout()
activate SupabaseAuthSystem
SupabaseAuthSystem->AuthController: return true
deactivate SupabaseAuthSystem
AuthController->DashboardVueSFC: return true
deactivate AuthController
DashboardVueSFC->User: Show Login
deactivate DashboardVueSFC
@enduml

@startuml
title Generate Class Diagram
participant User
participant GenerationController
participant DrawIOXML
participant ClassDiagramData
participant ProjectController
participant Project
User->GenerationController: Generate Class Diagram
activate GenerationController
GenerationController->ProjectController: sync()
activate ProjectController
ProjectController->GenerationController: return projects
deactivate ProjectController
GenerationController->Project: get(id)
activate Project
Project->GenerationController: return project
deactivate Project
GenerationController->DrawIOXML: xml = project.class
activate DrawIOXML
DrawIOXML->ClassDiagramData: process(xml)
activate ClassDiagramData
ClassDiagramData->DrawIOXML: return JSON
deactivate ClassDiagramData
DrawIOXML->GenerationController: return JSON
deactivate DrawIOXML
GenerationController->User: Show Class Diagram
deactivate GenerationController
@enduml

@startuml
title Generate Use Case Diagram
participant User
participant GenerationController
participant DrawIOXML
participant UseCaseDiagramData
participant ProjectController
participant Project
User->GenerationController: Generate Use Case Diagram
activate GenerationController
GenerationController->ProjectController: sync()
activate ProjectController
ProjectController->GenerationController: return projects
deactivate ProjectController
GenerationController->Project: get(id)
activate Project
Project->GenerationController: return project
deactivate Project
GenerationController->DrawIOXML: xml = project.usecase
activate DrawIOXML
DrawIOXML->UseCaseDiagramData: process(xml)
activate UseCaseDiagramData
UseCaseDiagramData->DrawIOXML: return JSON
deactivate UseCaseDiagramData
DrawIOXML->GenerationController: return JSON
deactivate DrawIOXML
GenerationController->User: Show Use Case Diagram
deactivate GenerationController
@enduml

@startuml
title Generate Sequence Diagram
participant User
participant GenerationController
participant SequenceDiagramData
participant ProjectController
participant Project
User->GenerationController: Generate Sequence Diagram
activate GenerationController
GenerationController->ProjectController: sync()
activate ProjectController
ProjectController->GenerationController: return projects
deactivate ProjectController
GenerationController->Project: get(id)
activate Project
Project->GenerationController: return project
deactivate Project
GenerationController->SequenceDiagramData: process(project.sequence)
activate SequenceDiagramData
SequenceDiagramData->GenerationController: return sequence diagram
deactivate SequenceDiagramData
GenerationController->User: Show Sequence Diagram
deactivate GenerationController
@enduml
`;

export const test3 = `@startuml
title Login
participant User
participant LoginVueSFC
participant AuthController
participant SupabaseAuthSystem
participant Server

User->LoginVueSFC: Open Login Page
LoginVueSFC->LoginVueSFC: Display Login Form
LoginVueSFC->User: Enter email
LoginVueSFC->User: Enter password
LoginVueSFC->AuthController: signIn(email, password)
AuthController->SupabaseAuthSystem: signIn(email, password)
activate SupabaseAuthSystem
SupabaseAuthSystem->Server: Send login request
activate Server
Server->LoginVueSFC: Click "Save Timetable"
TimetableVueSFC->ProjectController: update(project)
activate ProjectController
ProjectController->Server: Send update project request
activate Server
Server->ProjectController: Return response
deactivate Server
ProjectController->TimetableVueSFC: Return result
deactivate ProjectController
alt Successful update
 TimetableVueSFC->TimetableVueSFC: Display success message
else Failed update
 TimetableVueSFC->TimetableVueSFC: Display error message
end
@enduml
`;

export const test4 = `@startuml Login Sequence Diagram  
actor User
participant LoginVueSFC
participant AuthController
participant SupabaseAuthSystem

User -> LoginVueSFC: Submits login credentials
activate LoginVueSFC
LoginVueSFC -> AuthController: signIn(email, password)
activate AuthController
AuthController -> SupabaseAuthSystem: authenticate(email, password)
activate SupabaseAuthSystem
SupabaseAuthSystem --> AuthController: authentication result
deactivate SupabaseAuthSystem
alt Successful Authentication
AuthController --> LoginVueSFC: true
deactivate AuthController
LoginVueSFC -> DashboardVueSFC: Navigate to dashboard
deactivate LoginVueSFC
else Authentication Failure
AuthController --> LoginVueSFC: AuthError
deactivate AuthController
LoginVueSFC -> User: Show error message
deactivate LoginVueSFC
end

@enduml

@startuml Register Sequence Diagram
actor User
participant RegisterVueSFC
participant AuthController
participant SupabaseAuthSystem

User -> RegisterVueSFC: Submits registration details
activate RegisterVueSFC
RegisterVueSFC -> AuthController: signUp(email, password, username)
activate AuthController
AuthController -> SupabaseAuthSystem: register(email, password, username)
activate SupabaseAuthSystem
SupabaseAuthSystem --> AuthController: registration result
deactivate SupabaseAuthSystem
alt Successful Registration
AuthController --> RegisterVueSFC: true
deactivate AuthController
RegisterVueSFC -> DashboardVueSFC: Navigate to dashboard
deactivate RegisterVueSFC
else Registration Failure
AuthController --> RegisterVueSFC: AuthError
deactivate AuthController
RegisterVueSFC -> User: Show error message
deactivate RegisterVueSFC
end

@enduml

@startuml Dashboard Sequence Diagram
actor User
participant DashboardVueSFC
participant AuthController
participant GenerationController

User -> DashboardVueSFC: Accesses the dashboard
activate DashboardVueSFC
DashboardVueSFC -> AuthController: isLoggedIn()
activate AuthController
AuthController --> DashboardVueSFC: true
deactivate AuthController
alt User wants to logout
DashboardVueSFC -> AuthController: logout()
activate AuthController
AuthController -> SupabaseAuthSystem: logout()
activate SupabaseAuthSystem
SupabaseAuthSystem --> AuthController: void
deactivate SupabaseAuthSystem
AuthController --> DashboardVueSFC: void
deactivate AuthController
DashboardVueSFC -> LoginVueSFC: Redirect to login
deactivate DashboardVueSFC
else User interacts with dashboard features
DashboardVueSFC -> GenerationController: generateDiagram()
activate GenerationController
GenerationController -> DrawIOXML: process()
activate DrawIOXML
DrawIOXML --> GenerationController: processed data
deactivate DrawIOXML
GenerationController --> DashboardVueSFC: diagram data
deactivate GenerationController
DashboardVueSFC -> User: Displays dashboard
deactivate DashboardVueSFC
end


@enduml

@startuml Timetable Sequence Diagram
actor User
participant TimetableVueSFC
participant GenerationController
participant ProjectController
participant Server


User -> TimetableVueSFC: Adds new timetable
activate TimetableVueSFC
TimetableVueSFC -> GenerationController: generateTimetable(parameters)
activate GenerationController
GenerationController -> ProjectController: add(name, class, usecase)
activate ProjectController
ProjectController -> Server: Save Project
activate Server
Server --> ProjectController: Project ID
deactivate Server
ProjectController --> GenerationController: Project ID
deactivate ProjectController
GenerationController -> Server: Generate Timetable
activate Server
Server --> GenerationController: Timetable Data
deactivate Server
GenerationController --> TimetableVueSFC: Timetable Data
deactivate GenerationController
TimetableVueSFC -> User: Displays Timetable
deactivate TimetableVueSFC

@enduml`;
