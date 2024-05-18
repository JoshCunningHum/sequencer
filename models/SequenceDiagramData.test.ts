import { expect, test } from "vitest";
import {
    SequenceDiagramData,
    type Block,
    type Message,
    type SequenceElement,
} from "./SequenceDiagramData";

test("Payment Example", () => {
    const data = new SequenceDiagramData();
    data.process(`Sequence: PlaceOrder
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
    end`);

    const { actors, elements, title } = data;

    const altpayment = <Block>{
        type: "alt",
        conditions: ["PaymentSuccessful", "PaymentFailed"],
        elements: [],
        parent: undefined,
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
    };

    altpayment.elements.push(condpaymentsuccess, condpaymentfailed);

    expect({ actors, elements, title }).toBe(<SequenceDiagramData>{
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
    const data = new SequenceDiagramData();
    data.process(`Sequence: NestedExample
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

    const { actors, elements, title } = data;

    expect({ actors, elements, title }).toBe(<SequenceDiagramData>{
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
            <Block>{
                type: "alt",
                elements: [
                    // Condition1 block
                    <Block>{
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
                            {
                                type: "par",
                                elements: [
                                    <Block>{
                                        elements: [
                                            // Message3
                                            {
                                                type: "sync",
                                                sender: "B",
                                                receiver: "A",
                                                content: "Message3",
                                            },
                                        ],
                                    },

                                    <Block>{
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
                                    },
                                ],
                            },
                        ],
                    },
                    // Condition2 block
                    {
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
                            {
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
                            },
                        ],
                    },
                ],
                conditions: ["Condition1", "Conditionh2"],
            },
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
