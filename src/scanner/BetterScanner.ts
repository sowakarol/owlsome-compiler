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
                    this.index++;
                    break;
                case /[a-z]/i.test(char):
                    tokenString += this.extractLiteral();
                    tokens.push(new Token(this.checkKeyword(tokenString), tokenString));
                    break;
                case /\d/.test(char):
                    token = this.extractNumber();
                    tokens.push(token);
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
                    }
                    this.index++;
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
                    tokens.push(new Token(TokenType.NotSupported, char));
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
        let token: Token;
        let tokenString = "";
        let dotOccurences = 0;
        let char = this.text[this.index];
        while (char && /\d|\./.test(char)) {
            if (char == '.') {
                dotOccurences++;
            }
            tokenString += char;
            char = this.text[++this.index];
        }
        if (dotOccurences > 1) {
            token = new Token(TokenType.NotSupported, tokenString);
        } else {
            token = new Token(TokenType.Number, tokenString);
        }
        return token;
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
    checkKeyword(checkKeyword:String) :TokenType{
        switch(checkKeyword){
            case "for": 
                return TokenType.For;
            case "while":
                return TokenType.While;
            case "if" :
                return TokenType.If;
            case "var":
                return TokenType.Variable;
            default:
                return TokenType.Literal;
        }
    }
}
