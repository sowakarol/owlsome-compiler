import { expect } from "chai";
import * as mocha from "mocha";
import { Scanner } from "./scanner";
import { TokenType } from "../token";

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

        it("should return NotSupported token type, if token is not supperted", () => {
            let scanner = new Scanner("~");
            let tokens = scanner.tokenize();
            expect(tokens[0].type).to.equal(TokenType.NotSupported);
        })
    })

    describe("tokenize()", () => {
        it("should return tokens ['23', '+', '2'] for 23+2", () => {
            let scanner = new Scanner("23+2");
            let tokens = scanner.tokenize();
            expect(tokens.map(token => token.value)).to.contain.ordered.members(["23", "+", "2"]);
        });

        it("should return tokens: [23, +, (, 2, -, 9, *, qwerty666, )] for 23+(2-9*qwerty666)", () => {
            let scanner = new Scanner("23+(2-9*qwerty666)");
            let tokens = scanner.tokenize();
            expect(tokens.map(token => token.value))
                .to.contain.ordered
                .members(["23", "+", "(", "2", "-", "9", "*", "qwerty666", ")"]);
        });

        it("should scan a dot delimited number", () => {
            let tokens = new Scanner("123.45").tokenize();
            expect(tokens).to.have.length(1);
            expect(tokens[0].type).to.equal(TokenType.Number);
            expect(tokens[0].value).to.equal("123.45");
        })

        it("should throw error if there's more than one dot", () => {
            let scanner = new Scanner("123..45");
            expect(() => scanner.tokenize()).to.throw();
        })
    })
});