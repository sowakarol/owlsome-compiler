import {expect} from "chai";
import * as mocha from "mocha";
import { Scanner } from "./scanner";



describe("Scanner", () => {
    describe("NextIndex", () => {
        it("should return a,b,c", () => {
            let scanner = new Scanner("abc");

            expect(scanner.next()).to.equal("a");
            expect(scanner.next()).to.equal("b");
            expect(scanner.next()).to.equal("c");

        });
    })
});