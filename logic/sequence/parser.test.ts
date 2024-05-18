import { expect, test } from "vitest";
import {
    SequenceDiagramData,
    type Block,
    type Message,
    type SequenceElement,
} from "../../models/SequenceDiagramData";
import { getline, parse } from "./parser";

test("Payment Example", () => {
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

test("Nested Example", () => {
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
