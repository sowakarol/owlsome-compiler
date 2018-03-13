import { expect } from "chai";
import * as mocha from "mocha";
import { Scanner } from "./scanner";



describe("Scanner", () => {
    describe("NextIndex", () => {
        it("should return a,b,c", () => {
            let scanner = new Scanner("abc");

            expect(scanner.current()).to.equal("a");
            scanner.moveToNext();
            expect(scanner.current()).to.equal("b");
            scanner.moveToNext();
            expect(scanner.current()).to.equal("c");
            scanner.moveToNext();
            expect(scanner.current()).to.equal(undefined);
        });
    })

    describe("getToken", () => {
        it("should return '23' when 23+2", () => {
            let scanner = new Scanner("23+2");

            expect(scanner.getToken()).to.equal("23");

        });

        it("should return '+' after second getToken when 23+2", () => {
            let scanner = new Scanner("23        +2");
            scanner.getToken();
            expect(scanner.getToken()).to.equal("+");

        });


    })
});