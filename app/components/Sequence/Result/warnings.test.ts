import type { ValidationError } from "~/logic/sequence/validator.plant";

export const warnings_tst: ValidationError[] = [
    {
        type: 2,
        code_reference: "actor User\n\ntitle User Login Sequence Diagram",
        description: 'Actor: "User" not found in class diagram',
        line_number: 3,
        page: "User Login Sequence Diagram",
        ref: "User",
        id: "QB5NhIyBZ28rkB0Z3eiO",
    },
    {
        type: 2,
        code_reference: "participant LoginView\nactor User\n",
        description: 'Actor: "LoginView" not found in class diagram',
        line_number: 4,
        page: "User Login Sequence Diagram",
        ref: "LoginView",
        id: "rOVOmCD0DcTTBjuX1T0b",
    },
    {
        type: 2,
        code_reference:
            "participant UserAuthenticationViewModel\nparticipant LoginView\nactor User",
        description:
            'Actor: "UserAuthenticationViewModel" not found in class diagram',
        line_number: 5,
        page: "User Login Sequence Diagram",
        ref: "UserAuthenticationViewModel",
        id: "5kkYYqJhS3EQJbOmN0aH",
    },
    {
        type: 2,
        code_reference:
            "participant Server\nparticipant UserAuthenticationViewModel\nparticipant LoginView",
        description: 'Actor: "Server" not found in class diagram',
        line_number: 6,
        page: "User Login Sequence Diagram",
        ref: "Server",
        id: "grfWXXRYDwdg87KK1f5d",
    },
    {
        type: 0,
        description:
            'Method: "Enters Email and Password" not found in class diagram',
        line_number: 8,
        code_reference:
            "User -> LoginView: Enters Email and Password\n\nparticipant Server",
        page: "User Login Sequence Diagram",
        ref: "Enters Email and Password",
        id: "INzGKPj8nN70Cc0rkmKe",
    },
    {
        type: 0,
        description:
            'Method: "signInWithEmail(email, password)" not found in class diagram',
        line_number: 10,
        code_reference:
            "LoginView -> UserAuthenticationViewModel: signInWithEmail(email, password)\nactivate LoginView\nUser -> LoginView: Enters Email and Password",
        page: "User Login Sequence Diagram",
        ref: "signInWithEmail(email, password)",
        id: "V6F98fwsVk9VH8nTuVEK",
    },
    {
        type: 0,
        description: 'Method: "Send SignIn Request" not found in class diagram',
        line_number: 12,
        code_reference:
            "UserAuthenticationViewModel -> Server: Send SignIn Request\nactivate UserAuthenticationViewModel\nLoginView -> UserAuthenticationViewModel: signInWithEmail(email, password)",
        page: "User Login Sequence Diagram",
        ref: "Send SignIn Request",
        id: "jji1gvNMXxFgtmMSy2bp",
    },
    {
        type: 0,
        description:
            'Method: "Returns Authentication Result (Success/Failure)" not found in class diagram',
        line_number: 14,
        code_reference:
            "Server --> UserAuthenticationViewModel: Returns Authentication Result (Success/Failure)\nactivate Server\nUserAuthenticationViewModel -> Server: Send SignIn Request",
        page: "User Login Sequence Diagram",
        ref: "Returns Authentication Result (Success/Failure)",
        id: "wVnJrYBzy7AxK1sKGLWL",
    },
    {
        type: 0,
        description:
            'Method: "Authentication Result" not found in class diagram',
        line_number: 16,
        code_reference:
            "UserAuthenticationViewModel -> LoginView: Authentication Result\ndeactivate Server\nServer --> UserAuthenticationViewModel: Returns Authentication Result (Success/Failure)",
        page: "User Login Sequence Diagram",
        ref: "Authentication Result",
        id: "bibuXF8pt8qZfZQzsiuT",
    },
    {
        type: 0,
        description:
            'Method: "Navigates to Home Screen or Shows Error" not found in class diagram',
        line_number: 18,
        code_reference:
            "LoginView --> User: Navigates to Home Screen or Shows Error\ndeactivate UserAuthenticationViewModel\nUserAuthenticationViewModel -> LoginView: Authentication Result",
        page: "User Login Sequence Diagram",
        ref: "Navigates to Home Screen or Shows Error",
        id: "a0jmQgPVDWL3uuwrF0oI",
    },
    {
        type: 2,
        code_reference: "actor User\n\ntitle User Login Sequence Diagram",
        description: 'Actor: "User" not found in class diagram',
        line_number: 3,
        page: "User Registration Sequence Diagram",
        ref: "User",
        id: "PAlFtaKGBwbmIrOmDjvX",
    },
    {
        type: 2,
        code_reference: "participant LoginView\nactor User\n",
        description: 'Actor: "SignupView" not found in class diagram',
        line_number: 4,
        page: "User Registration Sequence Diagram",
        ref: "SignupView",
        id: "6HyNoDWS3E2qcYeEw1GL",
    },
    {
        type: 2,
        code_reference:
            "participant UserAuthenticationViewModel\nparticipant LoginView\nactor User",
        description:
            'Actor: "UserAuthenticationViewModel" not found in class diagram',
        line_number: 5,
        page: "User Registration Sequence Diagram",
        ref: "UserAuthenticationViewModel",
        id: "5MYz44iCcfgz2C0VA3rB",
    },
    {
        type: 2,
        code_reference:
            "participant Server\nparticipant UserAuthenticationViewModel\nparticipant LoginView",
        description: 'Actor: "Server" not found in class diagram',
        line_number: 6,
        page: "User Registration Sequence Diagram",
        ref: "Server",
        id: "ekeEqdkfUEevUI6iUwA1",
    },
    {
        type: 0,
        description:
            'Method: "Fills Registration Form" not found in class diagram',
        line_number: 8,
        code_reference:
            "User -> LoginView: Enters Email and Password\n\nparticipant Server",
        page: "User Registration Sequence Diagram",
        ref: "Fills Registration Form",
        id: "WUvA5dbgI2DY41FvRaku",
    },
    {
        type: 0,
        description:
            'Method: "signUpWithEmail(email, password)" not found in class diagram',
        line_number: 10,
        code_reference:
            "LoginView -> UserAuthenticationViewModel: signInWithEmail(email, password)\nactivate LoginView\nUser -> LoginView: Enters Email and Password",
        page: "User Registration Sequence Diagram",
        ref: "signUpWithEmail(email, password)",
        id: "DVRLD5R1KjwbB0Ep5xLa",
    },
    {
        type: 0,
        description: 'Method: "Send SignUp Request" not found in class diagram',
        line_number: 12,
        code_reference:
            "UserAuthenticationViewModel -> Server: Send SignIn Request\nactivate UserAuthenticationViewModel\nLoginView -> UserAuthenticationViewModel: signInWithEmail(email, password)",
        page: "User Registration Sequence Diagram",
        ref: "Send SignUp Request",
        id: "SuP4zi62LaHXjulfvqbq",
    },
    {
        type: 0,
        description:
            'Method: "Returns Registration Result (Success/Failure)" not found in class diagram',
        line_number: 14,
        code_reference:
            "Server --> UserAuthenticationViewModel: Returns Authentication Result (Success/Failure)\nactivate Server\nUserAuthenticationViewModel -> Server: Send SignIn Request",
        page: "User Registration Sequence Diagram",
        ref: "Returns Registration Result (Success/Failure)",
        id: "jwO8sbvb2o37pgM9WCYz",
    },
    {
        type: 0,
        description: 'Method: "Registration Result" not found in class diagram',
        line_number: 16,
        code_reference:
            "UserAuthenticationViewModel -> LoginView: Authentication Result\ndeactivate Server\nServer --> UserAuthenticationViewModel: Returns Authentication Result (Success/Failure)",
        page: "User Registration Sequence Diagram",
        ref: "Registration Result",
        id: "5ZRHsKPyI4Eo0GHvLDy5",
    },
    {
        type: 0,
        description:
            'Method: "Shows Success/Failure Message" not found in class diagram',
        line_number: 18,
        code_reference:
            "LoginView --> User: Navigates to Home Screen or Shows Error\ndeactivate UserAuthenticationViewModel\nUserAuthenticationViewModel -> LoginView: Authentication Result",
        page: "User Registration Sequence Diagram",
        ref: "Shows Success/Failure Message",
        id: "5yYoreWL7Kof35Whtokr",
    },
    {
        type: 2,
        code_reference: "actor User\n\ntitle User Login Sequence Diagram",
        description: 'Actor: "User" not found in class diagram',
        line_number: 3,
        page: "Search Word Sequence Diagram",
        ref: "User",
        id: "UdQONsXt2ZFe0iSMQyZz",
    },
    {
        type: 2,
        code_reference: "participant LoginView\nactor User\n",
        description: 'Actor: "DictionaryView" not found in class diagram',
        line_number: 4,
        page: "Search Word Sequence Diagram",
        ref: "DictionaryView",
        id: "sC7KyqKm8qAX2oidfech",
    },
    {
        type: 2,
        code_reference:
            "participant UserAuthenticationViewModel\nparticipant LoginView\nactor User",
        description:
            'Actor: "DictionaryServiceViewModel" not found in class diagram',
        line_number: 5,
        page: "Search Word Sequence Diagram",
        ref: "DictionaryServiceViewModel",
        id: "eRMflaBhyvfYR3WVtnZf",
    },
    {
        type: 2,
        code_reference:
            "participant Server\nparticipant UserAuthenticationViewModel\nparticipant LoginView",
        description: 'Actor: "Server" not found in class diagram',
        line_number: 6,
        page: "Search Word Sequence Diagram",
        ref: "Server",
        id: "n8DCKMxq91HCRoHqq6eI",
    },
    {
        type: 0,
        description: 'Method: "Inputs search term" not found in class diagram',
        line_number: 8,
        code_reference:
            "User -> LoginView: Enters Email and Password\n\nparticipant Server",
        page: "Search Word Sequence Diagram",
        ref: "Inputs search term",
        id: "rAGCd2TIYgG2U3y5XWtB",
    },
    {
        type: 0,
        description:
            'Method: "searchWord(searchTerm)" not found in class diagram',
        line_number: 10,
        code_reference:
            "LoginView -> UserAuthenticationViewModel: signInWithEmail(email, password)\nactivate LoginView\nUser -> LoginView: Enters Email and Password",
        page: "Search Word Sequence Diagram",
        ref: "searchWord(searchTerm)",
        id: "c1WeTAOuUVC7iLMDRWl6",
    },
    {
        type: 0,
        description:
            'Method: "Sends search request" not found in class diagram',
        line_number: 12,
        code_reference:
            "UserAuthenticationViewModel -> Server: Send SignIn Request\nactivate UserAuthenticationViewModel\nLoginView -> UserAuthenticationViewModel: signInWithEmail(email, password)",
        page: "Search Word Sequence Diagram",
        ref: "Sends search request",
        id: "V6AhcqYhNsTeJJIHqxOG",
    },
    {
        type: 0,
        description:
            'Method: "Returns search results" not found in class diagram',
        line_number: 14,
        code_reference:
            "Server --> UserAuthenticationViewModel: Returns Authentication Result (Success/Failure)\nactivate Server\nUserAuthenticationViewModel -> Server: Send SignIn Request",
        page: "Search Word Sequence Diagram",
        ref: "Returns search results",
        id: "K6ohTz03R70nbidV0PYE",
    },
    {
        type: 0,
        description:
            'Method: "Displays search results" not found in class diagram',
        line_number: 16,
        code_reference:
            "UserAuthenticationViewModel -> LoginView: Authentication Result\ndeactivate Server\nServer --> UserAuthenticationViewModel: Returns Authentication Result (Success/Failure)",
        page: "Search Word Sequence Diagram",
        ref: "Displays search results",
        id: "X0PjOSXd6zHan5bDnWJU",
    },
    {
        type: 2,
        code_reference: "actor User\n\ntitle User Login Sequence Diagram",
        description: 'Actor: "User" not found in class diagram',
        line_number: 3,
        page: "Update Profile Sequence Diagram",
        ref: "User",
        id: "PXp8vTt0CpnBpIjjGXym",
    },
    {
        type: 2,
        code_reference: "participant LoginView\nactor User\n",
        description: 'Actor: "AccountView" not found in class diagram',
        line_number: 4,
        page: "Update Profile Sequence Diagram",
        ref: "AccountView",
        id: "JsJFjoznToZSbVfedef2",
    },
    {
        type: 2,
        code_reference:
            "participant UserAuthenticationViewModel\nparticipant LoginView\nactor User",
        description:
            'Actor: "AccountServiceViewModel" not found in class diagram',
        line_number: 5,
        page: "Update Profile Sequence Diagram",
        ref: "AccountServiceViewModel",
        id: "qt5Jj4JRq9JHzlw4B5Q9",
    },
    {
        type: 2,
        code_reference:
            "participant Server\nparticipant UserAuthenticationViewModel\nparticipant LoginView",
        description: 'Actor: "Server" not found in class diagram',
        line_number: 6,
        page: "Update Profile Sequence Diagram",
        ref: "Server",
        id: "MEcjMygE8mQAwOfB71oU",
    },
    {
        type: 0,
        description:
            'Method: "Clicks "Edit Profile"" not found in class diagram',
        line_number: 8,
        code_reference:
            "User -> LoginView: Enters Email and Password\n\nparticipant Server",
        page: "Update Profile Sequence Diagram",
        ref: 'Clicks "Edit Profile"',
        id: "dCxfyOCiFRdMUZPX0ZWm",
    },
    {
        type: 0,
        description: 'Method: "getProfile(userId)" not found in class diagram',
        line_number: 10,
        code_reference:
            "LoginView -> UserAuthenticationViewModel: signInWithEmail(email, password)\nactivate LoginView\nUser -> LoginView: Enters Email and Password",
        page: "Update Profile Sequence Diagram",
        ref: "getProfile(userId)",
        id: "ppxqyZZqVRvDJ8DMBpyM",
    },
    {
        type: 0,
        description:
            'Method: "Sends getProfile request" not found in class diagram',
        line_number: 12,
        code_reference:
            "UserAuthenticationViewModel -> Server: Send SignIn Request\nactivate UserAuthenticationViewModel\nLoginView -> UserAuthenticationViewModel: signInWithEmail(email, password)",
        page: "Update Profile Sequence Diagram",
        ref: "Sends getProfile request",
        id: "vvtFLM8q1pRBgA0ejbyS",
    },
    {
        type: 0,
        description:
            'Method: "Returns Profile data" not found in class diagram',
        line_number: 14,
        code_reference:
            "Server --> UserAuthenticationViewModel: Returns Authentication Result (Success/Failure)\nactivate Server\nUserAuthenticationViewModel -> Server: Send SignIn Request",
        page: "Update Profile Sequence Diagram",
        ref: "Returns Profile data",
        id: "Horf91LyxMKAxrSvxnAW",
    },
    {
        type: 0,
        description:
            'Method: "Populates Profile form" not found in class diagram',
        line_number: 16,
        code_reference:
            "UserAuthenticationViewModel -> LoginView: Authentication Result\ndeactivate Server\nServer --> UserAuthenticationViewModel: Returns Authentication Result (Success/Failure)",
        page: "Update Profile Sequence Diagram",
        ref: "Populates Profile form",
        id: "KJelLlPK4qAFkPsDu75W",
    },
    {
        type: 0,
        description: 'Method: "Edits Profile data" not found in class diagram',
        line_number: 17,
        code_reference:
            "deactivate UserAuthenticationViewModel\nUserAuthenticationViewModel -> LoginView: Authentication Result\ndeactivate Server",
        page: "Update Profile Sequence Diagram",
        ref: "Edits Profile data",
        id: "Kst0hqgER3RLc9OXo7yF",
    },
    {
        type: 0,
        description:
            'Method: "updateUser(updatedProfile)" not found in class diagram',
        line_number: 18,
        code_reference:
            "LoginView --> User: Navigates to Home Screen or Shows Error\ndeactivate UserAuthenticationViewModel\nUserAuthenticationViewModel -> LoginView: Authentication Result",
        page: "Update Profile Sequence Diagram",
        ref: "updateUser(updatedProfile)",
        id: "8e3NhWeYMoCOw5wcFpjw",
    },
    {
        type: 0,
        description:
            'Method: "Sends updateUser request" not found in class diagram',
        line_number: 20,
        code_reference:
            "\ndeactivate LoginView\nLoginView --> User: Navigates to Home Screen or Shows Error",
        page: "Update Profile Sequence Diagram",
        ref: "Sends updateUser request",
        id: "mmRi6UXI2DGaHLrsc8Kx",
    },
    {
        type: 0,
        description:
            'Method: "Returns update result" not found in class diagram',
        line_number: 22,
        code_reference: "```\n@enduml\n",
        page: "Update Profile Sequence Diagram",
        ref: "Returns update result",
        id: "ilpsmspMeO2xobDr0h9a",
    },
    {
        type: 0,
        description:
            'Method: "Shows success/failure message" not found in class diagram',
        line_number: 24,
        code_reference: "```plantuml\n\n```",
        page: "Update Profile Sequence Diagram",
        ref: "Shows success/failure message",
        id: "E7WWwd8dMpXASZWnZ7Pk",
    },
    {
        type: 2,
        code_reference: "actor User\n\ntitle User Login Sequence Diagram",
        description: 'Actor: "User" not found in class diagram',
        line_number: 3,
        page: "Get Exercise Details Sequence Diagram",
        ref: "User",
        id: "6Qj4nGLAffkBe4p3ek2H",
    },
    {
        type: 2,
        code_reference: "participant LoginView\nactor User\n",
        description: 'Actor: "ExerciseTabView" not found in class diagram',
        line_number: 4,
        page: "Get Exercise Details Sequence Diagram",
        ref: "ExerciseTabView",
        id: "dU1OzESx5lOpievIJj5q",
    },
    {
        type: 2,
        code_reference:
            "participant UserAuthenticationViewModel\nparticipant LoginView\nactor User",
        description:
            'Actor: "DictionaryServiceViewModel" not found in class diagram',
        line_number: 5,
        page: "Get Exercise Details Sequence Diagram",
        ref: "DictionaryServiceViewModel",
        id: "5SoSy2Yfs6VuFY0l9yqU",
    },
    {
        type: 2,
        code_reference:
            "participant Server\nparticipant UserAuthenticationViewModel\nparticipant LoginView",
        description: 'Actor: "Server" not found in class diagram',
        line_number: 6,
        page: "Get Exercise Details Sequence Diagram",
        ref: "Server",
        id: "WmES4LolFgJlttKGK5cP",
    },
    {
        type: 0,
        description: 'Method: "Selects an exercise" not found in class diagram',
        line_number: 8,
        code_reference:
            "User -> LoginView: Enters Email and Password\n\nparticipant Server",
        page: "Get Exercise Details Sequence Diagram",
        ref: "Selects an exercise",
        id: "QVCqi8u4kuy8A5Jk3kFL",
    },
    {
        type: 0,
        description:
            'Method: "getExerciseDetails(exerciseId)" not found in class diagram',
        line_number: 10,
        code_reference:
            "LoginView -> UserAuthenticationViewModel: signInWithEmail(email, password)\nactivate LoginView\nUser -> LoginView: Enters Email and Password",
        page: "Get Exercise Details Sequence Diagram",
        ref: "getExerciseDetails(exerciseId)",
        id: "YRxoxNZPAIcH3YN8buHt",
    },
    {
        type: 0,
        description:
            'Method: "Sends getExerciseDetails request" not found in class diagram',
        line_number: 12,
        code_reference:
            "UserAuthenticationViewModel -> Server: Send SignIn Request\nactivate UserAuthenticationViewModel\nLoginView -> UserAuthenticationViewModel: signInWithEmail(email, password)",
        page: "Get Exercise Details Sequence Diagram",
        ref: "Sends getExerciseDetails request",
        id: "ulQIlI1DpJwEsp2709Ur",
    },
    {
        type: 0,
        description:
            'Method: "Returns exercise details" not found in class diagram',
        line_number: 14,
        code_reference:
            "Server --> UserAuthenticationViewModel: Returns Authentication Result (Success/Failure)\nactivate Server\nUserAuthenticationViewModel -> Server: Send SignIn Request",
        page: "Get Exercise Details Sequence Diagram",
        ref: "Returns exercise details",
        id: "fDR68nWWmkajmMzLjTIv",
    },
    {
        type: 0,
        description:
            'Method: "Displays exercise details" not found in class diagram',
        line_number: 16,
        code_reference:
            "UserAuthenticationViewModel -> LoginView: Authentication Result\ndeactivate Server\nServer --> UserAuthenticationViewModel: Returns Authentication Result (Success/Failure)",
        page: "Get Exercise Details Sequence Diagram",
        ref: "Displays exercise details",
        id: "qEKhgJkV79JR2UGTiUxp",
    },
    {
        type: 2,
        code_reference: "actor User\n\ntitle User Login Sequence Diagram",
        description: 'Actor: "User" not found in class diagram',
        line_number: 3,
        page: "Show User Progress Sequence Diagram",
        ref: "User",
        id: "1gsst8tz2Ig0zmcCt7Pf",
    },
    {
        type: 2,
        code_reference: "participant LoginView\nactor User\n",
        description: 'Actor: "UserDashboardView" not found in class diagram',
        line_number: 4,
        page: "Show User Progress Sequence Diagram",
        ref: "UserDashboardView",
        id: "gvw37U6yiSXgRVxffsHt",
    },
    {
        type: 2,
        code_reference:
            "participant UserAuthenticationViewModel\nparticipant LoginView\nactor User",
        description:
            'Actor: "UserDashboardServiceViewModel" not found in class diagram',
        line_number: 5,
        page: "Show User Progress Sequence Diagram",
        ref: "UserDashboardServiceViewModel",
        id: "oFyjFKlpxx3z5vw6HyM4",
    },
    {
        type: 2,
        code_reference:
            "participant Server\nparticipant UserAuthenticationViewModel\nparticipant LoginView",
        description: 'Actor: "Server" not found in class diagram',
        line_number: 6,
        page: "Show User Progress Sequence Diagram",
        ref: "Server",
        id: "lpsFMbIlZDIIFwC8SKpK",
    },
    {
        type: 0,
        description:
            'Method: "Navigates to Dashboard" not found in class diagram',
        line_number: 8,
        code_reference:
            "User -> LoginView: Enters Email and Password\n\nparticipant Server",
        page: "Show User Progress Sequence Diagram",
        ref: "Navigates to Dashboard",
        id: "MlVbXk0ah1tAUuNYQ53r",
    },
    {
        type: 0,
        description:
            'Method: "getUserProgress(userId)" not found in class diagram',
        line_number: 10,
        code_reference:
            "LoginView -> UserAuthenticationViewModel: signInWithEmail(email, password)\nactivate LoginView\nUser -> LoginView: Enters Email and Password",
        page: "Show User Progress Sequence Diagram",
        ref: "getUserProgress(userId)",
        id: "s6VD0nVmtpzCeEesHxzx",
    },
    {
        type: 0,
        description:
            'Method: "Sends getUserProgress request" not found in class diagram',
        line_number: 12,
        code_reference:
            "UserAuthenticationViewModel -> Server: Send SignIn Request\nactivate UserAuthenticationViewModel\nLoginView -> UserAuthenticationViewModel: signInWithEmail(email, password)",
        page: "Show User Progress Sequence Diagram",
        ref: "Sends getUserProgress request",
        id: "fQvzZIEIKQNSISqjXtxY",
    },
    {
        type: 0,
        description:
            'Method: "Returns user progress data" not found in class diagram',
        line_number: 14,
        code_reference:
            "Server --> UserAuthenticationViewModel: Returns Authentication Result (Success/Failure)\nactivate Server\nUserAuthenticationViewModel -> Server: Send SignIn Request",
        page: "Show User Progress Sequence Diagram",
        ref: "Returns user progress data",
        id: "VA4Hk8rkUhoh2XkaqHSZ",
    },
    {
        type: 0,
        description:
            'Method: "Displays user progress" not found in class diagram',
        line_number: 16,
        code_reference:
            "UserAuthenticationViewModel -> LoginView: Authentication Result\ndeactivate Server\nServer --> UserAuthenticationViewModel: Returns Authentication Result (Success/Failure)",
        page: "Show User Progress Sequence Diagram",
        ref: "Displays user progress",
        id: "xcPo0Ri8ETsZymSsGSIa",
    },
];

export const response_tst = `\`\`plantuml
@startuml
title User Login Sequence Diagram

actor User
participant LoginView
participant UserAuthenticationViewModel
participant Server

User -> LoginView: Enters Email and Password
activate LoginView
LoginView -> UserAuthenticationViewModel: signInWithEmail(email, password)
activate UserAuthenticationViewModel
UserAuthenticationViewModel -> Server: Send SignIn Request
activate Server
Server --> UserAuthenticationViewModel: Returns Authentication Result (Success/Failure)
deactivate Server
UserAuthenticationViewModel -> LoginView: Authentication Result
deactivate UserAuthenticationViewModel
LoginView --> User: Navigates to Home Screen or Shows Error
deactivate LoginView

@enduml
\`\`\`

\`\`\`plantuml
@startuml
title User Registration Sequence Diagram

actor User
participant SignupView
participant UserAuthenticationViewModel
participant Server

User -> SignupView: Fills Registration Form
activate SignupView
SignupView -> UserAuthenticationViewModel: signUpWithEmail(email, password)
activate UserAuthenticationViewModel
UserAuthenticationViewModel -> Server: Send SignUp Request
activate Server
Server --> UserAuthenticationViewModel: Returns Registration Result (Success/Failure)
deactivate Server
UserAuthenticationViewModel -> SignupView: Registration Result
deactivate UserAuthenticationViewModel
SignupView --> User: Shows Success/Failure Message
deactivate SignupView

@enduml
\`\`\`

\`\`\`plantuml
@startuml
title Search Word Sequence Diagram

actor User
participant DictionaryView
participant DictionaryServiceViewModel
participant Server

User -> DictionaryView: Inputs search term
activate DictionaryView
DictionaryView -> DictionaryServiceViewModel: searchWord(searchTerm)
activate DictionaryServiceViewModel
DictionaryServiceViewModel -> Server: Sends search request
activate Server
Server --> DictionaryServiceViewModel: Returns search results
deactivate Server
DictionaryServiceViewModel -> DictionaryView: Displays search results
deactivate DictionaryServiceViewModel
deactivate DictionaryView

@enduml
\`\`\`

\`\`\`plantuml
@startuml
title Update Profile Sequence Diagram

actor User
participant AccountView
participant AccountServiceViewModel
participant Server

User -> AccountView: Clicks "Edit Profile"
activate AccountView
AccountView -> AccountServiceViewModel: getProfile(userId)
activate AccountServiceViewModel
AccountServiceViewModel -> Server: Sends getProfile request
activate Server
Server --> AccountServiceViewModel: Returns Profile data
deactivate Server
AccountServiceViewModel -> AccountView: Populates Profile form
AccountView -> User: Edits Profile data
AccountView -> AccountServiceViewModel: updateUser(updatedProfile)
activate AccountServiceViewModel
AccountServiceViewModel -> Server: Sends updateUser request
activate Server
Server --> AccountServiceViewModel: Returns update result
deactivate Server
AccountServiceViewModel -> AccountView: Shows success/failure message
deactivate AccountServiceViewModel
deactivate AccountView

@enduml
\`\`\`

\`\`\`plantuml
@startuml
title Get Exercise Details Sequence Diagram

actor User
participant ExerciseTabView
participant DictionaryServiceViewModel
participant Server

User -> ExerciseTabView: Selects an exercise
activate ExerciseTabView
ExerciseTabView -> DictionaryServiceViewModel: getExerciseDetails(exerciseId)
activate DictionaryServiceViewModel
DictionaryServiceViewModel -> Server: Sends getExerciseDetails request
activate Server
Server --> DictionaryServiceViewModel: Returns exercise details
deactivate Server
DictionaryServiceViewModel -> ExerciseTabView: Displays exercise details
deactivate DictionaryServiceViewModel
deactivate ExerciseTabView

@enduml
\`\`\`

\`\`\`plantuml
@startuml
title Show User Progress Sequence Diagram

actor User
participant UserDashboardView
participant UserDashboardServiceViewModel
participant Server

User -> UserDashboardView: Navigates to Dashboard
activate UserDashboardView
UserDashboardView -> UserDashboardServiceViewModel: getUserProgress(userId)
activate UserDashboardServiceViewModel
UserDashboardServiceViewModel -> Server: Sends getUserProgress request
activate Server
Server --> UserDashboardServiceViewModel: Returns user progress data
deactivate Server
UserDashboardServiceViewModel -> UserDashboardView: Displays user progress
deactivate UserDashboardServiceViewModel
deactivate UserDashboardView

@enduml
\`\``;
