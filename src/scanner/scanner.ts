import { Token, TokenType } from "../Token";


class Symbol {
    constructor(private value: string) { }

    public getValue = () => this.value;

    public isLetter = () => /[a-z]/i.test(this.value);
    public isDigit = () => /\d/.test(this.value);
    public isDot = () => /\./.test(this.value);
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
        while (token.type !== TokenType.EOF) {
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
            token = new Token(TokenType.EOF, null);
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
            tokenString += this.currentSymbol.getValue();
            if (this.currentSymbol.isLetter()) {
                tokenString += this.extractLiteral();
                token = new Token(TokenType.Literal, tokenString);
            } else if (this.currentSymbol.isDigit()) {
                tokenString += this.extractNumber();
                token = new Token(TokenType.Number, tokenString);
            } else if (this.currentSymbol.isOperator()) {
                token = new Token(TokenType.Operator, this.currentSymbol.getValue());
            } else if (this.currentSymbol.isLeftParenthesis()) {
                token = new Token(TokenType.LeftParenthesis, this.currentSymbol.getValue());
            } else if (this.currentSymbol.isRightParenthesis()) {
                token = new Token(TokenType.RightParenthesis, this.currentSymbol.getValue());
            } else {
                token = new Token(TokenType.NotSupported, tokenString);
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
        let dotOccurences = 0;
        while (this.nextSymbol && (this.nextSymbol.isDigit() || this.nextSymbol.isDot())) {
            if (this.nextSymbol.isDot()) {
                dotOccurences++;
            }
            if (dotOccurences > 1) {
                throw new Error("More than one dot in a number");
            }
            number += this.nextSymbol.getValue();
            this.moveToNext();
        }
        return number;
    }
}
