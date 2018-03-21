import { expect, assert } from "chai";
import * as mocha from "mocha";
import { HtmlGenerator } from "./html-generator";
import {Token, TokenType} from '../token'

const openingDivTag = "<div";
const htmlTag = "html";
const closingDivTag = "</div>"
var count = (str:string, separator:string) => str.split(separator).length - 1;

describe("HtmlGenerator", () => {


    describe("No Tokens = Keine Tokens", () => {
        it("Should return empty page = es sollte eine leere Webseite zurückgeben", () => {
            let generator = new HtmlGenerator();
            let page: string = generator.generatePage([]);
            assert(page.indexOf(openingDivTag) < 0);
            assert(page.indexOf(htmlTag) >= 0);
        })
    })

    describe("One Tokens = Ein Token", () => {
        it("Should return page with one div = es sollte eine Webseite mit ein div zurückgeben", () => {

            let generator = new HtmlGenerator();
            let page: string = generator.generatePage([new Token(TokenType.Number, '12')]);
            assert(count(page,openingDivTag) ==  1);
            assert(count(page,closingDivTag) ==  1);
            assert(page.indexOf(htmlTag) >= 0);
        })
    }) 


    

});