import { expect } from "chai";
import * as mocha from "mocha";
import { Scanner } from "./scanner";



describe("Scanner", () => {
    describe("NextIndex", () => {
        it("should return a,b,c", () => {
            let scanner = new Scanner("abc");

            expect(scanner.currentSymbol.getValue()).to.equal("a");
            scanner.moveToNext();
            expect(scanner.currentSymbol.getValue()).to.equal("b");
            scanner.moveToNext();
            expect(scanner.currentSymbol.getValue()).to.equal("c");
            scanner.moveToNext();
            expect(scanner.currentSymbol).to.be.undefined;
        });
    })

    describe("getToken", () => {
        it("should return '23' for 23+2", () => {
            let scanner = new Scanner("23+2");
            expect(scanner.getToken().value).to.equal("23");

        });

        it("should return '+' as second getToken for 23+2", () => {
            let scanner = new Scanner("23        +2");
            scanner.getToken();
            expect(scanner.getToken().value).to.equal("+");

        });

        it("tokenize() should return tokens ['23', '+', '2'] for 23+2", () => {
            let scanner = new Scanner("23+2");
            let tokens = scanner.tokenize();
            expect(tokens.map(token => token.value)).to.contain.ordered.members(["23", "+", "2"]);
        });

        it("tokenize() should return tokens: [23, +, (, 2, -, 9, *, qwerty666, )] for 23+(2-9*qwerty666)", () => {
            let scanner = new Scanner("23+(2-9*qwerty666)");
            let tokens = scanner.tokenize();
            expect(tokens.map(token => token.value))
                .to.contain.ordered
                .members(["23", "+", "(", "2", "-", "9", "*", "qwerty666", ")"]);
        });
    })
});