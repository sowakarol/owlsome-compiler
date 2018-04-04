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
                    tokens.push(new Token(TokenType.Literal, tokenString));
                    break;
                case /\d/.test(char):
                    tokenString += this.extractNumber();
                    tokens.push(new Token(TokenType.Number, tokenString));
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
                        tokens.push(new Token(TokenType.Operator, char));
                    }
                    this.index++;
                    break;


                case /\+|-|\*|\^/.test(char):
                    tokens.push(new Token(TokenType.Operator, char));
                    this.index++;
                    break;
                case char === '=':
                    tokens.push(this.scanEqualSigns());
                    break;
                default:
                    tokens.push(new Token(TokenType.NotSupported, char));
                    this.index++;
                    break;
            }
        }
        return tokens;
    }

    scanUntilEOL(): string {
        let line = "";
        let char = this.text[this.index];
        while (char !== '\n') {
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

    extractNumber(): string {
        let token = "";
        let dotOccurences = 0;
        let char = this.text[this.index];
        while (char && /\d|\./.test(char)) {
            if (char == '.' && ++dotOccurences > 1) {
                throw new Error("More than one dot in a number!");
            } else {
                token += char;
                char = this.text[++this.index];
            }
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
            if (/[a-z]|\d|\(/.test(nextNextChar)) {
                return new Token(TokenType.EqualOperator, currentChar + nextChar);
            } else {
                this.index++;
                return new Token(TokenType.NotSupported, [currentChar, nextChar, nextNextChar].join(""));
            }
        } else {
            return new Token(TokenType.AssignOperator, currentChar);
        }
    }
}