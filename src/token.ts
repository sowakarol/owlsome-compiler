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
    Semicolon,
    Function,
    While,
    If,
    EqualOperator,
    AssignOperator,
    SingleLineComment,
    EOF,
    NotSupported,
    String,
    Variable
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