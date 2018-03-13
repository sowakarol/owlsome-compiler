type TokenType = "Number" | "PlusSign"

export class Token {
    constructor(private type: TokenType, private value: string | undefined) { }
}