import { expect, assert } from "chai";
import * as mocha from "mocha";
import { HTMLGenerator } from "./html-generator";
import { Token, TokenType } from '../token'

const openingSpanTag = "<span";
const htmlTag = "html";
const closingSpanTag = "</span>"

var count: ((str: string, separator: string) => number) =
    (str: string, separator: string) => str.split(separator).length - 1;

var getColors: ((str: string) => string[]) =
    (str: string) => {
        let colors: string[] = [];
        let fragments: string[] = str.split('#').splice(1);
        for (let color of fragments) {
            colors.push(color.substring(1, 6));
        }
        return colors;
    }

describe("HtmlGenerator", () => {

    describe("No Tokens = Keine Tokens", () => {
        it("Should return empty page = es sollte eine leere Webseite zurückgeben", () => {
            let generator = new HTMLGenerator();
            let page: string = generator.generatePage([]);
            assert(page.indexOf(openingSpanTag) < 0);
            assert(page.indexOf(htmlTag) >= 0);
        })
    })

    describe("One Token = Ein Token", () => {
        it("Should return page with one div = es sollte eine Webseite mit ein div zurückgeben", () => {
            let generator = new HTMLGenerator();
            let page: string = generator.generatePage([new Token(TokenType.Number, '12')]);
            console.log(count(page, openingSpanTag))
            assert(count(page, openingSpanTag) == 1);
            assert(count(page, closingSpanTag) == 1);
            assert(page.indexOf(htmlTag) >= 0);
        })
    })

    describe("Two Tokens = Zwei Tokens", () => {
        it("Should return page with two divs - different colors = es sollte eine Webseite mit zwei divs zurückgeben - anderen Farben", () => {
            let generator = new HTMLGenerator();
            let page: string = generator.generatePage([new Token(TokenType.Number, '12'), new Token(TokenType.Literal, "aaa")]);
            console.log(count(page, openingSpanTag))

            assert(count(page, openingSpanTag) == 2);
            assert(count(page, closingSpanTag) == 2);
            let colors: string[] = getColors(page);
            assert(colors[0] != colors[1]);
            assert(page.indexOf(htmlTag) >= 0);
        })
    })
});