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
