import { Token, TokenType, tokenTypeLength } from "../token"

export class HTMLGenerator {
    private map: Map<number, number>;

    constructor() {
        this.map = new Map<TokenType, number>();

        let difference: number = parseInt("0xffffff") / tokenTypeLength();

        for (let type in TokenType) {
            let number = Number(type);
            if (!isNaN(number)) {
                this.map.set(number, Math.floor(number * difference));
            }
        }
    }

    generatePage(tokens: Token[]): string {
        let page: string;
        page = this.generateHeader();

        tokens.forEach(token => {
            page += this.generateDiv(token);
        });

        page += this.generateFooter();
        return page;
    }

    generateHeader(): string {
        return ` 
        <html>
            <body>`;
    }

    generateFooter(): string {
        return ` 
           </body>
        </html>`
    }

    generateDiv(token: Token): string {
        let colorHex: string = "000000";
        if(token.type === TokenType.NotSupported){
            return `
            <span style="text-decoration: underline overline wavy red;> ${token.value} </span>
            `;
        }

        let tokenNumber = this.map.get(token.type);
        if (tokenNumber) {
            colorHex = tokenNumber.toString(16);
        }
        if(colorHex <= "800000"){
            return `
            <span style="background-color: #${colorHex}; color: #ffffff"> ${token.value} </span>
            `;            
        }

        return `
                <span style="background-color: #${colorHex};"> ${token.value} </span>
            `;
    }
}