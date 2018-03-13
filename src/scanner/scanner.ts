import { Token } from "../Token";

export class Scanner {

    private index: number = 0;

    constructor(private text: string) { }

    current(): string {
        return this.text[this.index];
    }

    getNext(): string {
        return this.text[this.index + 1];
    }

    moveToNext(): void {
        this.index++;
    }

    tokenize(): Token[] {
        let tokens = new Array<Token>();
        let tokenBufor = "";

        for (let i = 0; i < this.text.length; i++) {
            const current = this.text[i];

            if (this.isNumber(current)) {
                tokenBufor += current;
            }
        }


        return tokens;
    }

    getToken(): string {
        let character = this.current();
        let token = "";

        if (character !== undefined) {
            if (this.isNumber(character)) {
                token += character;

                while (this.isNumber(this.getNext())) {
                    token += this.getNext();
                    this.moveToNext();
                }

            } else if (character === "+") {
                token += "+";
            } else if( character === " ") {
                this.moveToNext();
                return this.getToken();
            }
        }

        this.moveToNext();
        return token;
    }

    isNumber(character: string): boolean {
        return !isNaN(+character);
    }
}