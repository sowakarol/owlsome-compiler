import { expect, assert } from "chai";
import * as mocha from "mocha";
import { HTMLGenerator } from "./html-generator";
import {Token, TokenType} from '../token'

const openingDivTag = "<div";
const htmlTag = "html";
const closingDivTag = "</div>"

var count:((str:string, separator:string) => number) = 
    (str:string, separator:string) => str.split(separator).length - 1;

var getColors:((str:string) => string[]) = 
    (str:string) => {
        console.log(str);
        let colors:string[] = [];
        let fragments:string[] = str.split('#').splice(1);
        console.log(fragments);
        for(let color of fragments){
            console.log(color);
            colors.push(color.substring(1,6));
        }
        return colors;
    }

describe("HtmlGenerator", () => {

    describe("No Tokens = Keine Tokens", () => {
        it("Should return empty page = es sollte eine leere Webseite zurückgeben", () => {
            let generator = new HTMLGenerator();
            let page: string = generator.generatePage([]);
            assert(page.indexOf(openingDivTag) < 0);
            assert(page.indexOf(htmlTag) >= 0);
        })
    })

    describe("One Token = Ein Token", () => {
        it("Should return page with one div = es sollte eine Webseite mit ein div zurückgeben", () => {
            let generator = new HTMLGenerator();
            let page: string = generator.generatePage([new Token(TokenType.Number, '12')]);
            assert(count(page,openingDivTag) ==  1);
            assert(count(page,closingDivTag) ==  1);
            assert(page.indexOf(htmlTag) >= 0);
        })
    }) 

    describe("Two Tokens = Zwei Tokens", () => {
        it("Should return page with two divs - different colors = es sollte eine Webseite mit zwei divs zurückgeben - anderen Farben", () => {
            let generator = new HTMLGenerator();
            let page: string = generator.generatePage([new Token(TokenType.Number, '12'), new Token(TokenType.Literal,"aaa")]);
            assert(count(page,openingDivTag) ==  2);
            assert(count(page,closingDivTag) ==  2);
            let colors:string[] = getColors(page);
            assert(colors[0] != colors[1]);
            assert(page.indexOf(htmlTag) >= 0);
        })
    }) 
    

});