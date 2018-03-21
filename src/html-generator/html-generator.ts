import {Token,TokenType} from "../token"

export class HtmlGenerator{
    private fs = require('fs');



    generatePage(tokens: Token[]): string{
        let page: string;
        page = this.generateHeader();

        tokens.forEach(token => {
            page += this.generateDiv(token);
        });

        page += this.generateFooter();
        return page;
    }

    generateHeader():string{
        return `<html>
                    <body>`;
    }

    generateFooter():string{
        return      `</body>
                </html>`
    }

    generateDiv(token:Token):string{
        var colorHex:string = '';
        return `<div style="${colorHex}"> ${token.value} </div>`;
    }

    //TODO 
    //generate colorHex


}