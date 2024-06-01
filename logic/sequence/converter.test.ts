// Create tests for the converter object

import { expect, test } from "vitest";
import { parse } from "./parser";
import { ConvertUtil, convert } from "./converter";
import type { SequenceDiagramData } from "~/models/SequenceDiagramData";
import type { DIOMxCell } from "~/models/DrawIOXML";
import getCells from "../getCells";
import makeMXCell from "./makeMXCell";
import createActor from "./createActor";

const _ = makeMXCell({ id: 0 });
const rootcell = makeMXCell({ id: 1, parent: 0 });

test("Actor Test", () => {
    const prompt = `Participants:\nUser Server LLM API Database`;
    const parsed = parse(prompt);
    const [jsoned] = convert(parsed).elements;

    const cells = getCells(jsoned);

    ConvertUtil.reset();

    const expected: DIOMxCell[] = [
        _,
        rootcell,
        ..."User Server LLM API Database"
            .split(" ")
            .map((actor, i) => createActor({ value: actor, index: i })),
    ];

    expect(cells).toStrictEqual(expected);
});

test("Underscored Actors", () => {
    const prompt = `Participants:
  User Server LLM_API Database

User -> Server: Login(email, password)
Server -> Database: CheckCredentials(email, password)
Database --> Server: CredentialsValid

alt CredentialsValid
  Server --> User: ShowDashboard
else CredentialsInvalid
  Server --> User: ShowLoginError
end

User -> Server: Register(email, password, username)
Server -> Database: CheckExistingUser(email, username)
Database --> Server: UserExists

alt UserExists
  Server --> User: ShowError
else !UserExists
  Server -> Database: CreateNewUser(email, password, username)
  Database --> Server: UserCreated
  Server --> User: ShowSuccess
end

User -> Server: UploadDocument(document)
Server -> Database: StoreDocument(document)
Database --> Server: DocumentStored

alt DocumentStored
  Server --> User: ShowDocumentUploaded
else DocumentNotStored
  Server --> User: ShowUploadError
end

User -> Server: GenerateResult(document)
Server -> LLM_API: ProcessDocument(document)
LLM_API --> Server: ResultGenerated

alt ResultGenerated
  Server -> Database: StoreResult(result)
  Database --> Server: ResultStored
  Server --> User: ShowResult
else ResultNotGenerated
  Server --> User: ShowGenerationError
end
`;

    const parsed = parse(prompt);
    const [jsoned] = convert(parsed).elements;

    const cells = getCells(jsoned);

    ConvertUtil.reset();

    const expected: DIOMxCell[] = [
        _,
        rootcell,
        ..."User Server LLM_API Database"
            .split(" ")
            .map((actor, i) => createActor({ value: actor, index: i })),
    ];

    expect(cells).toStrictEqual(expected);
});

test("Another Long Test Check for Errors", () => {
    const prompt = `Participants:    
      User Server LLM_API Database EmailService    
      
      User -> Server: Login(email, password)
      Server -> Database: CheckCredentials(email, password)
      Database --> Server: CredentialsValid    
      
      alt CredentialsValid    
        Server --> User: ShowDashboard    
        User -> Server: UploadDocument(document)    
        Server -> Database: StoreDocument(document)    
        Database --> Server: DocumentStored    
        alt DocumentStored        
          Server -> User: ShowDocumentUploaded        
          User -> Server: GenerateResult(document)        
          Server -> LLM_API: ProcessDocument(document)        
          LLM_API --> Server: ResultGenerated        
          alt ResultGenerated            
            Server -> Database: StoreResult(result)            
            Database --> Server: ResultStored            
            Server -> User: ShowResult(result)        
          else ResultNotGenerated            
            Server -> User: ShowError(error)        
          end    
        else DocumentNotStored        
          Server -> User: ShowError(error)    
        end
      else CredentialsInvalid    
        Server --> User: ShowLoginError
      end
    
      User -> Server: Register(email, password, username)
      Server -> Database: CheckEmailExists(email)
      Database --> Server: EmailExists    
      
      alt EmailExists    
        Server -> User: ShowEmailExistsError
      else EmailNotExists    
        Server -> Database: StoreUser(email, password, username)    
        Database --> Server: UserStored    
        alt UserStored        
          Server -> EmailService: SendWelcomeEmail(email)        
          EmailService --> Server: EmailSent        
          Server -> User: ShowRegistrationSuccess    
        else UserNotStored        
          Server -> User: ShowRegistrationError    
        end
      end
      
      User -> Server: Logout
      Server -> User: ClearSession
      Server --> User: ShowLogin`;
    const parsed = parse(prompt);
    const [jsoned] = convert(parsed).elements;

    expect(true).toBe(true);
});

test("Check for error test", () => {
    const prompt = `Sequence: CodeGenApp
    Participants:
        User Server Database LLMAPI
    
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
      Server -> LLMAPI: ProcessDocument(document)
      LLMAPI --> Server: Result
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
      end`;
    const parsed = parse(prompt);
    const [jsoned] = convert(parsed).elements;

    expect(true).toBe(true);
});
