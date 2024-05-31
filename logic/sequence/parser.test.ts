import { expect, test } from "vitest";
import {
    SequenceDiagramData,
    type Activation,
    type Block,
    type Message,
    type SequenceElement,
} from "../../models/SequenceDiagramData";
import { getline, parse } from "./parser";

test("Payment Example", async () => {
    const altpayment = <Block>{
        type: "alt",
        conditions: ["PaymentSuccessful", "PaymentFailed"],
        elements: [],
    };

    const condpaymentsuccess = <Block>{
        type: "block",
        parent: altpayment,
        elements: [
            <Message>{
                type: "async",
                sender: "PaymentGateway",
                receiver: "WebShop",
                content: "PaymentConfirmation",
            },
            <Message>{
                type: "async",
                sender: "WebShop",
                receiver: "Customer",
                content: "OrderConfirmation",
            },
        ],
        conditions: [],
    };

    const condpaymentfailed = <Block>{
        type: "block",
        elements: [
            <Message>{
                type: "async",
                sender: "PaymentGateway",
                receiver: "WebShop",
                content: "PaymentFailure",
            },
            <Message>{
                type: "async",
                sender: "WebShop",
                receiver: "Customer",
                content: "PaymentError",
            },
        ],
        parent: altpayment,
        conditions: [],
    };

    altpayment.elements.push(condpaymentsuccess, condpaymentfailed);
    expect(
        parse(`Sequence: PlaceOrder
    Participants:
      Customer
      WebShop
      PaymentGateway
    
    Customer -> WebShop: SelectProduct
    WebShop --> Customer: DisplayProductDetails
    
    Customer -> WebShop: PlaceOrder
    WebShop -> PaymentGateway: ProcessPayment
    
    alt PaymentSuccessful
      PaymentGateway --> WebShop: PaymentConfirmation
      WebShop --> Customer: OrderConfirmation
    else PaymentFailed
      PaymentGateway --> WebShop: PaymentFailure
      WebShop --> Customer: PaymentError
    end`)
    ).toStrictEqual(<SequenceDiagramData>{
        title: "PlaceOrder",
        actors: ["Customer", "WebShop", "PaymentGateway"],
        elements: [
            <Message>{
                type: "sync",
                sender: "Customer",
                receiver: "WebShop",
                content: "SelectProduct",
            },
            <Message>{
                type: "async",
                sender: "WebShop",
                receiver: "Customer",
                content: "DisplayProductDetails",
            },
            <Message>{
                type: "sync",
                sender: "Customer",
                receiver: "WebShop",
                content: "PlaceOrder",
            },
            <Message>{
                type: "sync",
                sender: "WebShop",
                receiver: "PaymentGateway",
                content: "ProcessPayment",
            },
            altpayment,
        ],
    });
});

test("Nested Example", async () => {
    const alt = <Block>{
        type: "alt",
        elements: [],
        conditions: ["Condition1", "Condition2"],
    };

    const cond1 = <Block>{
        type: "block",
        elements: [
            // Message2
            {
                type: "sync",
                sender: "B",
                receiver: "C",
                content: "Message2",
            },
            // par block
        ],
        parent: alt,
        conditions: [],
    };

    const par = <Block>{
        type: "par",
        conditions: [],
        elements: [],
        parent: cond1,
    };

    cond1.elements.push(par);

    const par1: Block = {
        elements: [
            // Message3
            {
                type: "sync",
                sender: "B",
                receiver: "A",
                content: "Message3",
            },
        ],
        type: "block",
        conditions: [],
        parent: par,
    };

    const par2: Block = {
        type: "block",
        elements: [
            // Message4
            {
                type: "sync",
                sender: "C",
                receiver: "A",
                content: "Message4",
            },
        ],
        conditions: [],
        parent: par,
    };

    par.elements.push(par1, par2);

    const cond2 = <Block>{
        type: "block",
        elements: [
            // Message5
            {
                type: "sync",
                sender: "B",
                receiver: "A",
                content: "Message5",
            },
            // opt block
        ],
        parent: alt,
        conditions: [],
    };

    const opt = <Block>{
        type: "opt",
        conditions: ["OptionalCondition"],
        elements: [
            // Message6
            {
                type: "sync",
                sender: "A",
                receiver: "C",
                content: "Message6",
            },
        ],
        parent: cond2,
    };

    cond2.elements.push(opt);

    alt.elements.push(cond1, cond2);

    const output = parse(`Sequence: NestedExample
Participants:
  A B C

A -> B: Message1

alt Condition1
  B -> C: Message2
  par
    B -> A: Message3
    ||
    C -> A: Message4
  end
else Condition2
  B -> A: Message5
  opt OptionalCondition
    A -> C: Message6
  end
end

A --> B: Message7`);
    expect(output).toStrictEqual(<SequenceDiagramData>{
        title: "NestedExample",
        actors: ["A", "B", "C"],
        elements: [
            // Message1
            <Message>{
                type: "sync",
                sender: "A",
                receiver: "B",
                content: "Message1",
            },
            // alt block
            alt,
            // Message7
            <Message>{
                type: "async",
                sender: "A",
                receiver: "B",
                content: "Message7",
            },
        ],
    });
});

test("Activation Example", async () => {
    const output = parse(`Sequence: ActivationExample
Participants:
    A B C

A -> B: Message1
activate B
B -> C: Message2
C --> B: Message3
deactivate B

A -> B: Message4
activate B
B --> C: Message5
activate C
C --> B: Message6
deactivate C
B --> A: Message7
deactivate B`);

    const data = {
        elements: <SequenceElement[]>[],
        actors: ["A", "B", "C"],
        title: "ActivationExample",
    };

    const msg1 = <Message>{
        content: "Message1",
        type: "sync",
        sender: "A",
        receiver: "B",
    };

    const msg2 = <Message>{
        content: "Message2",
        type: "sync",
        sender: "B",
        receiver: "C",
    };

    const msg3 = <Message>{
        content: "Message3",
        type: "async",
        sender: "C",
        receiver: "B",
    };

    const act1 = <Activation>{
        actor: "B",
        start: msg1,
        end: msg3,
    };

    const msg4 = <Message>{
        content: "Message4",
        type: "sync",
        sender: "A",
        receiver: "B",
    };

    const msg5 = <Message>{
        content: "Message5",
        type: "async",
        sender: "B",
        receiver: "C",
    };

    const msg6 = <Message>{
        content: "Message6",
        type: "async",
        sender: "C",
        receiver: "B",
    };

    const msg7 = <Message>{
        content: "Message7",
        type: "async",
        sender: "B",
        receiver: "A",
    };

    const act2 = <Activation>{
        actor: "B",
        start: msg4,
        end: msg7,
    };

    const act3 = <Activation>{
        actor: "C",
        start: msg5,
        end: msg6,
    };

    data.elements.push(
        msg1,
        act1,
        msg2,
        msg3,
        msg4,
        act2,
        msg5,
        act3,
        msg6,
        msg7
    );

    expect(output).toStrictEqual(data);
});

test("Non-Ending Loop Test", async () => {
    const output = parse(`Sequence: ActivationExample
    Participants:
        A B C
    `);

    expect(true).toBe(true);
}, 50);

test("Actual Gemini Result", async () => {
    const prompt = `Sequence: GenerateSequenceDiagram
    Participants:
    User GenerationController DrawIOXML ClassDiagramData UseCaseDiagramData SequenceDiagramData
    User -> GenerationController: Generate Sequence Diagram
    activate User
    activate GenerationController
    GenerationController -> ClassDiagramData: Process Class Diagram
    activate ClassDiagramData
    ClassDiagramData --> GenerationController: Class Diagram Data
    deactivate ClassDiagramData
    GenerationController -> UseCaseDiagramData: Process Use Case Diagram
    activate UseCaseDiagramData
    UseCaseDiagramData --> GenerationController: Use Case Diagram Data
    deactivate UseCaseDiagramData
    GenerationController -> SequenceDiagramData: Process Sequence Diagram
    activate SequenceDiagramData
    SequenceDiagramData --> GenerationController: Sequence Diagram Data
    deactivate SequenceDiagramData
    GenerationController --> User: Show Sequence Diagram
    deactivate GenerationController
    deactivate User`;

    const output = parse(prompt);

    console.log(output);

    expect(true).toBe(true);
});

test("Actual Gemini Result Long", async () => {
    const prompt = `Sequence: CodeGenApp
    Participants:
        User Server Database LLM API
    
      User -> Server: Login(email, password)
      Server -> Database: CheckCredentials(email, password)
      Database --> Server: CredentialsValid
    
      alt CredentialsValid
        Server --> User: ShowDashboard
      else CredentialsInvalid
        Server --> User: ShowLoginError
      end
    
      User -> Server: Register(email, password, username)
      Server -> Database: CheckExistingUser(email)
      Database --> Server: UserExists
    
      alt UserExists
        Server --> User: ShowRegistrationError
      else !UserExists
        Server -> Database: CreateUser(email, password, username)
        Database --> Server: UserCreated
        Server --> User: ShowLogin
      end
    
      User -> Server: UploadDocument(document)
      Server -> Database: StoreDocument(document)
      Database --> Server: DocumentStored
      Server -> LLM API: ProcessDocument(document)
      LLM API --> Server: Result
      Server -> Database: StoreResult(result)
      Database --> Server: ResultStored
      Server -> User: ShowResult(result)
    
      alt ResultError
        Server -> User: ShowParsingError
        alt Back
          User -> Server: GoBack
        else Again
          User -> Server: ReUploadDocument
        end
      end
    `;

    const output = parse(prompt);

    console.log(output);

    expect(true).toBe(true);
});

/*

System Instruction with Activations

Providing a text representations of class and use case diagrams.
Create a text representation of a sequence diagram based on the provided class and use case diagrams with this specification format:
  - Sequence Format:
  Sequence: Sequence Name
      * The name of the sequence diagram. Should only happen once and the sequence output should start with this.
      * The sequence name is what you think the name of the app is, based on the context.
  
  - Participants format:
  Participants: 
      Participant1 Participant2
      * A list of participants/actors in the diagram, separated by space
  
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
  
  - Activation Points:
  A -> B: Message1
  activate A
  activate B
  B -> C: Message2
  activate C
  C --> B: Message3
  deactivate B
      * Each actor have activation points that is defined after a message that it participates with. 
      * An actor that is activated but not deactivated means it activates all through out the diagram starting from the part it is activated.
      * Just like the Message format, only refer to actors/participants that is defined in the participant format above.
      * Only deactivate when an actor/participant is activated. When an actor/participant is deactivated, it should be re-activated again before deactivating it. 
      * It is recommended to only deactivate when an actor is not needed anymore within a feature.
      * Take not that activations happen linearly in a sequence diagram so you don't have to take into account logical activations caused by blocks with conditions.
      
- Additional Rules
* Make use of the provided class and use case diagrams. Try to generate the features they are trying to represent.
* Group messages and blocks in their own feature.
* Group features with high cohesion and low coupling in mind. This means that each feature is interdependent with each other and should only do a specific task. A login will only do login, a register will only do register
* Arrange features in a logical way with chronological sense. Example would be is that a user should login (or register if no account) first before accessing the main application.
* Separate features with new lines between them, for readability.
* Put an indentation (4 spaces) in every block body, for readability.
* The output should strictly follow the format

  Here is an example:

  Sequence: ComplexExample
  Participants:
    User WebApp Database EmailService
  
  User -> WebApp: Login(username, password)
  activate User
  activate WebApp
  WebApp -> Database: CheckCredentials(username, password)
  activate Database
  Database --> WebApp: CredentialsValid
  deactivate Database
  
  alt CredentialsValid
    WebApp --> User: ShowDashboard
    par
      User -> WebApp: UpdateProfile
      ||
      WebApp -> Database: UpdateProfileData
      activate Database
      Database --> WebApp: ProfileUpdated
      deactivate Database
    end
    WebApp -> EmailService: SendWelcomeEmail
    activate EmailService
    EmailService --> WebApp: EmailSent
  else CredentialsInvalid
    WebApp --> User: ShowLoginError
  end
  
  loop EveryWeek
    EmailService -> User: SendWeeklyReport
    deactivate EmailService
  end
  
  WebApp --> User: Logout
  deactivate WebApp
  deactivate User

*/
