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

        page += `<div style="width:100%;>`;
        tokens.forEach(token => {
            page += `${this.generateSpan(token)}`;
        });
        page += `</div>`
        page += this.generateTokenTable();
        page += this.generateFooter();
        return page;
    }

    generateHeader(): string {
        return ` 
        <html>
            <head>
            <link rel="stylesheet" href="styles.css">
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

            </head>
            <body>
            <div style="width:100%;">`;
    }

    generateFooter(): string {
        return `</div> 
           </body>
        </html>`
    }

    generateSpan(token: Token): string {
        let colorHex: string = "000000";
        if (token.type === TokenType.NotSupported) {
            return `
            <span style="text-decoration: underline wavy red; margin: 1.5px;"> ${token.value} </span>
            `;
        }

        if (token.type === TokenType.String) {
            console.log(token);
        }

        let tokenNumber = this.map.get(token.type);
        if (tokenNumber) {
            colorHex = tokenNumber.toString(16);
        }
        if (colorHex <= "800000") {
            return `
            <span style="background-color: #${colorHex}; margin: 1.5px; color: #ffffff";> ${token.value} </span>
            `;
        }

        return `
                <span style="background-color: #${colorHex};margin: 1.5px;"> ${token.value} </span>
            `;
    }

    generateTokenTable(): string {

        const tokenTable: any = {
            "z{z}": "Literal",
            "z": "'a'...'Z'",
            "c{c}[.]c{c}": "Number",
            "c": "'0'...'9'",
            "'+'": "OperatorPlus",
            "'-'": "OperatorMinus",
            "'*'": "OperatorMultiplication",
            "'/'": "OperatorObelus",
            "'^'": "OperatorExponentiation",
            "'++'": "OperatorIncrementation",
            "'--'": "OperatorDecrementation",
            "'('": "LeftParenthesis",
            "')'": "RightParenthesis",
            "'for'": "For",
            "'while'": "While",
            '"{*}"': "String",
            "'var'": "Variable",
            "'if'": "If",
            "'=='": "EqualOperator",
            "'='": "AssignOperator",
            "'//'": "SingleLineComment",
            "'EOF'": "EOF",
            "other": "NotSupported"

        }

        let html = `<div><table>`;

        for (const key in tokenTable) {
            if (tokenTable.hasOwnProperty(key)) {
                const desc = tokenTable[key];
                html += `<tr><td>${key}</td><td>${desc}</td></tr>`
            }
        }
        html += `</table></div>`
        return html;
    }
}