export enum TokenType {
    Literal,
    Number,
    OperatorPlus,
    OperatorMinus,
    OperatorMultiplication,
    OperatorObelus,
    OperatorExponentiation,
    OperatorIncrementation,
    OperatorDecrementation,
    LeftParenthesis,
    RightParenthesis,
    For,
    While,
    If,
    EqualOperator,
    AssignOperator,
    SingleLineComment,
    EOF,
    NotSupported,
    Operator //to be refactored - stays to avoid compilation problems
};

export function tokenTypeLength(): number {
    let length: number = 0;
    for (let type in TokenType) {
        let number = Number(type);
        if (!isNaN(number)) {
            length++;
        }
    }
    return length;
}

export class Token {
    constructor(public type: TokenType, public value: string | null) { }

    toString(): string {
        return `(${this.type}) => ${this.value}`
    }
}