export enum TokenType {
    Literal,
    Number,
    Operator,
    LeftParenthesis,
    RightParenthesis,
    EOF
};

export class Token {
    constructor(public type: TokenType, public value: string | null) { }

    toString(): string {
        return `(${this.type}) => ${this.value}`
    }
}