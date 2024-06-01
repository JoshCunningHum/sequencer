export const useSystemInstructions = (
    classdiag?: string,
    usecasediag?: string
) => {
    const sysinstruct = `Providing a text representations of class and use case diagrams.
    Create a text representation of a sequence diagram based on the provided class and use case diagrams with this specification format:
      - Participants format:
      Participants: 
          Participant1 Participant2
          * A list of participants/actors in the diagram, separated by space. If an actor consist of multiple words, use underscores instead of spaces.
      
      - Message Format:
      Participant1 -> Participant2: Message1
          * A message between participants. A single dashed arrow [->] represents synchronous message sent between participants. A double dashed arrow [-->] represents asynchronous message
          * Should only refer to actors/participants defined in the participant definition above.
          * Be logical on where actor send messages to, based on the name of the actor.
      
      - Block Format:
      alt Condition
          User --> Server: OptionalTask
      end
          * A format for sequence diagram blocks. Other block keywords are alt, loop, par, opt. A block is ended by the keyword 'end' except for alt which is ended by its own else block.
          * All things between it is inside the said block.
           * alt, loop, and opt blocks have a condition in them
      
      - Extended Block Format (alt):
      alt SuccessCondition
          Server -> Database: StoreData
          Server -> User: SuccessMessage
      else FailedCondition
          Server -> User: FailedMessage
      end
          * The alt block should be ended with an else block which can hold a condition. Only use else when there is an un-ended alt block before it. else blocks should be ended. 
      
      - Extended Block Format (par):
      par ParallelBlockName
          P1 -> P2: M1
          ||
          p3 -> P1: M2
          p2 -> p3: M3
          ||
          p4 -> P1: M4
      end
          * The parallel tasks inside the par block is seperated by a '||'. The example have 3 parallel tasks with the 2nd task having 2 messages happening
          
    - Additional Rules
    * Make use of the provided class and use case diagrams. Try to generate the features they are trying to define. Try to use the different blocks when necessary.
    * Group messages and blocks in their own feature.
    * Group features with high cohesion and low coupling in mind. This means that each feature is interdependent with each other and should only do a specific task. A login will only do login, a register will only do register
    * Arrange features in a logical way with chronological sense. Example would be is that a user should login (or register if no account) first before accessing the main application.
    * Separate features with new lines between them, for readability.
    * Put an indentation (4 spaces) in every block body, for readability.
    * The output should strictly follow the format since your output is passed into a parser. Any misalign with the format will cause an error in the parser.
    
      Here is an example:
      
      Participants:
        User WebApp Database EmailService
      
      User -> WebApp: Login(username, password)
      WebApp -> Database: CheckCredentials(username, password)
      Database --> WebApp: CredentialsValid
      
      alt CredentialsValid
        WebApp --> User: ShowDashboard
        par
          User -> WebApp: UpdateProfile
          ||
          WebApp -> Database: UpdateProfileData
          Database --> WebApp: ProfileUpdated
        end
        WebApp -> EmailService: SendWelcomeEmail
        EmailService --> WebApp: EmailSent
      else CredentialsInvalid
        WebApp --> User: ShowLoginError
      end
      
      loop EveryWeek
        EmailService -> User: SendWeeklyReport
      end
      
      WebApp --> User: Logout`;

    return !classdiag || !usecasediag
        ? sysinstruct
        : `--- Class Diagram ---\n${classdiag}\n--- Usecase Diagram ---\n${usecasediag}`;
};
