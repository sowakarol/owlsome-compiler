import { expect } from "chai";
import * as mocha from "mocha";
import { TokenType } from "../token";
import { BetterScanner } from "./BetterScanner";


describe("Better scanner", () => {
    it("should extract literal", () => {
        let s = new BetterScanner("qwe");
        let literal = s.extractLiteral();
        expect(literal).to.equal("qwe");
    })
    it("should extract literal token", () => {
        let s = new BetterScanner("qwe");
        let tokens = s.tokenize();
        expect(tokens[0].type).to.equal(TokenType.Literal);
    })

    it("should extract number token", () => {
        let s = new BetterScanner("123.45");
        let tokens = s.tokenize();
        expect(tokens[0].type).to.equal(TokenType.Number);
        expect(tokens[0].value).to.equal("123.45");
    })

    it("should throw error if there's more than one dot in a number", () => {
        let s = new BetterScanner("123..45");
        let tokens = s.tokenize();
        expect(tokens[0].type).to.equal(TokenType.NotSupported);
    })

    describe("tokenize()", () => {
        it("should return tokens ['23', '+', '2'] for 23+2", () => {
            let scanner = new BetterScanner("23+2");
            let tokens = scanner.tokenize();
            expect(tokens.map(token => token.value)).to.contain.ordered.members(["23", "+", "2"]);
        });

        it("should return tokens: [23, +, (, 2, -, 9, *, qwerty666, )] for 23+(2-9*qwerty666)", () => {
            let scanner = new BetterScanner("23+(2-9*qwerty666)");
            let tokens = scanner.tokenize();
            expect(tokens.map(token => token.value))
                .to.contain.ordered
                .members(["23", "+", "(", "2", "-", "9", "*", "qwerty666", ")"]);
        });

        it(`should return tokens: ${["x", "=", "1", "1", "==", "2", "1", "===", "3"]} for x=1 1==2 1===3`, () => {
            let scanner = new BetterScanner("x=1 1==2 1===3");
            let tokens = scanner.tokenize();
            expect(tokens.map(token => token.value))
                .to.contain.ordered
                .members(["x", "=", "1", "1", "==", "2", "1", "===", "3"]);
        });

        it("should mark whole line as comment: '123 // commented out\\n'", () => {
            let scanner = new BetterScanner("123 // commented out\n");
            let tokens = scanner.tokenize();
            expect(tokens).to.have.length(2);
            expect(tokens[0].value).to.be.eq("123");
            expect(tokens[1].value).to.be.eq("// commented out");
        });
    })
})