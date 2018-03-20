import { expect } from "chai";
import * as mocha from "mocha";
import { _hasCorrectExtension } from "./cli";

describe("CLI", () => {
    describe("extension checking", () => {
        it("should return true for file.owl", () => {
            expect(_hasCorrectExtension("file.owl")).to.be.true;
        })

        it("should return false for file.owll", () => {
            expect(_hasCorrectExtension("file.owll")).to.be.false;
        })
        it("shouldn't change incoming string", () => {
            let name = "file.owl";
            _hasCorrectExtension(name);
            expect(name).to.eq("file.owl");
        })

    })
});