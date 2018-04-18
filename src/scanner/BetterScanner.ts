import { Token, TokenType } from "../Token";


export class BetterScanner {
    private index: number = 0;
    private text: string;

    constructor(text: string) {
        this.text = text;
    }

    tokenize(): Token[] {
        const tokens = new Array<Token>();
        let tokenString;
        let token: Token;
        while (this.index < this.text.length) {
            const char = this.text[this.index];
            tokenString = "";

            switch (true) {
                case /\s/.test(char):
                    tokens.push(this.scanWhitespaces());
                    break;
                case /[a-z]/i.test(char):
                    tokenString += this.extractLiteral();
                    tokens.push(new Token(this.checkKeyword(tokenString), tokenString));
                    break;
                case /\d/.test(char):
                    token = this.extractNumber();
                    tokens.push(token);
                    break;
                case char === ';':
                    tokens.push(new Token(TokenType.Semicolon, char));
                    this.index++;
                    break;
                case char === '(':
                    tokens.push(new Token(TokenType.LeftParenthesis, char));
                    this.index++;
                    break;
                case char === ')':
                    tokens.push(new Token(TokenType.RightParenthesis, char));
                    this.index++;
                    break;
                case char === '/':
                    if (this.isNextSymbolEqual('/')) {
                        let line = this.scanUntilEOL();
                        tokens.push(new Token(TokenType.SingleLineComment, `${line}`));
                    }
                    else {
                        tokens.push(new Token(TokenType.OperatorObelus, char));
                        this.index++;

                    }
                    break;
                case char === '^':
                    tokens.push(new Token(TokenType.OperatorExponentiation, char));
                    this.index++;
                    break;

                case char === '+':
                    if (this.isNextSymbolEqual('+')) {
                        tokenString = char + this.text[++this.index];
                        tokens.push(new Token(TokenType.OperatorIncrementation, tokenString));
                    }
                    else {
                        tokens.push(new Token(TokenType.OperatorPlus, char));
                    }
                    this.index++;
                    break;

                case char === '-':
                    if (this.isNextSymbolEqual('-')) {
                        tokenString = char + this.text[++this.index];
                        tokens.push(new Token(TokenType.OperatorDecrementation, tokenString));
                    }
                    else {
                        tokens.push(new Token(TokenType.OperatorMinus, char));
                    }
                    this.index++;
                    break;

                case char === '*':
                    tokens.push(new Token(TokenType.OperatorMultiplication, char));
                    this.index++;
                    break;
                case char === '=':
                    tokens.push(this.scanEqualSigns());
                    break;
                case char === '"':
                    tokens.push(this.scanString());
                    this.index++;
                    break;
                default:
                    tokens.push(this.extractNotSupported());
                    this.index++;
                    break;
            }
        }
        return tokens;
    }

    scanString(): Token {
        let token: Token;
        let quotedString = '"';
        let char = this.text[++this.index];
        let closingCharFound = false;
        do {
            quotedString += char;
            if (char === '"') {
                closingCharFound = true;
                return new Token(TokenType.String, quotedString)
            }
            char = this.text[++this.index];
        } while (char != null || char != '"')
        token = new Token(TokenType.NotSupported, quotedString);
        return token;
    }

    scanUntilEOL(): string {
        let line = "";
        let char = this.text[this.index];
        while (char !== '\n' && char != null) {
            line += char;
            char = this.text[++this.index];
        }
        return line;
    }

    isNextSymbolEqual(symbol: string): boolean {
        return this.text[this.index + 1] === symbol;
    }

    extractLiteral(): string {
        // TODO: add checking for keywords
        let token = "";
        let char = this.text[this.index];
        while (char && /[a-z]|\d/i.test(char)) {
            token += char;
            char = this.text[++this.index];
        }
        return token;
    }

    extractNumber(): Token {
        let tokenString = "";
        let char = this.text[this.index];

        const digitRegex = new RegExp(/\d/);
        const decimalRegex = new RegExp(/\d|\./);
        let matcher = decimalRegex;

        while (char && matcher.test(char)) {
            if (char == '.') {
                matcher = digitRegex;
            }
            tokenString += char;
            char = this.text[++this.index];
        }
        return new Token(TokenType.Number, tokenString);
    }

    extractNotSupported(): Token {
        let tokenString = "";
        let char = this.text[this.index];

        while (char && !/\s/.test(char)) {
            tokenString += char;
            char = this.text[++this.index];
        }

        return new Token(TokenType.NotSupported, tokenString);
    }

    scanEqualSigns(): Token {
        const currentChar = "=";
        const nextChar = this.text[this.index + 1];
        const nextNextChar = this.text[this.index + 2];

        this.index++;
        if (nextChar === '=') {
            this.index++;
            if (/[a-z]|\d|\(|\s/.test(nextNextChar)) {
                return new Token(TokenType.EqualOperator, currentChar + nextChar);
            } else {
                this.index++;
                return new Token(TokenType.NotSupported, [currentChar, nextChar, nextNextChar].join(""));
            }
        } else {
            return new Token(TokenType.AssignOperator, currentChar);
        }
    }
    checkKeyword(checkKeyword: String): TokenType {
        switch (checkKeyword) {
            case "for":
                return TokenType.For;
            case "while":
                return TokenType.While;
            case "if":
                return TokenType.If;
            case "var":
                return TokenType.Variable;
            case "function":
                return TokenType.Function;
            default:
                return TokenType.Literal;
        }
    }
    scanWhitespaces(): Token {
        let char: string = this.text[this.index];
        let tokenString = "";
        while (/\s/.test(char)) {
            tokenString += char;
            char = this.text[++this.index];
        }
        return new Token(TokenType.Whitespace, tokenString);
    }
}
