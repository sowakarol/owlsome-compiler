import { Token } from "../Token";


class Symbol {
    constructor(private value: string) { }

    public getValue = () => this.value;

    public isLetter = () => /[a-z]/i.test(this.value);
    public isDigit = () => /\d/.test(this.value);
    public isLeftParenthesis = () => this.value === '(';
    public isRightParenthesis = () => this.value === ')';
    public isLeftBracket = () => this.value === '[';
    public isRightBracket = () => this.value === ']';
    public isWhitespace = () => /\s/.test(this.value);
    public isOperator = () => /\+|-|\*|\/|\^/.test(this.value);
}


export class Scanner {

    private index: number = 0;
    private symbols = new Array<Symbol>();

    constructor(text: string) {
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            this.symbols.push(new Symbol(char));
        }
    }

    get currentSymbol(): Symbol {
        return this.symbols[this.index];
    }

    get nextSymbol(): Symbol {
        return this.symbols[this.index + 1];
    }

    moveToNext(): void {
        this.index++;
    }

    tokenize(): Token[] {
        let tokens = new Array<Token>();
        let token = this.getToken();
        while (token.type !== "EOF") {
            tokens.push(token);
            token = this.getToken();
        }
        return tokens;
    }

    getToken(): Token {
        let token: Token;

        if (this.currentSymbol !== undefined) {
            token = this.extractToken();
        } else {
            token = new Token("EOF", null);
        }

        this.moveToNext();
        return token;
    }

    extractToken(): Token {
        let tokenString: string = "";
        let token: Token;

        if (this.currentSymbol.isWhitespace()) {
            this.moveToNext();
            return this.getToken();
        }
        else {
            // literal
            tokenString += this.currentSymbol.getValue();
            if (this.currentSymbol.isLetter()) {
                tokenString += this.extractLiteral();
                token = new Token("Literal", tokenString);
            } else if (this.currentSymbol.isDigit()) {
                tokenString += this.extractNumber();
                token = new Token("Number", tokenString);
            } else if (this.currentSymbol.isOperator()) {
                token = new Token("Operator", this.currentSymbol.getValue());
            } else if (this.currentSymbol.isLeftParenthesis()) {
                token = new Token("LeftParenthesis", this.currentSymbol.getValue());
            } else if (this.currentSymbol.isRightParenthesis()) {
                token = new Token("RightParenthesis", this.currentSymbol.getValue());
            } else {
                throw new Error("unexpected symbol");
            }
        }
        return token;
    }

    extractLiteral(): string {
        let literal = "";
        while (this.nextSymbol && (this.nextSymbol.isLetter() || this.nextSymbol.isDigit())) {
            literal += this.nextSymbol.getValue();
            this.moveToNext();
        }
        return literal;
    }

    extractNumber(): string {
        let number = "";
        while (this.nextSymbol && this.nextSymbol.isDigit()) {
            number += this.nextSymbol.getValue();
            this.moveToNext();
        }
        return number;
    }
}
