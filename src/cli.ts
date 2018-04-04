import { existsSync, readFile, writeFile } from "fs";
import { Scanner } from "./scanner/scanner";
import {BetterScanner} from './scanner/BetterScanner';
import { HTMLGenerator } from "./html-generator/html-generator";

const OWL_EXTENSION = "owl";

process.argv.slice(2).forEach((filename: string) => {

    if (existsSync(filename) && hasCorrectExtension(filename)) {

        readFile(filename, (err, content) => {

            let scanner = new BetterScanner(content.toString());
            const outputFileName = filename.substr(0, filename.lastIndexOf('.')) + ".html";
            const htmlGenerator = new HTMLGenerator();
            const htmlPage = htmlGenerator.generatePage(scanner.tokenize());
            writeFile(outputFileName
                , htmlPage
                , err => err ? console.log(`uopsssss! \n ${err}`) : console.log(`[${filename}] tokens extracted`));
        })
    } else {
        console.log(`wrong path or file extension: ${filename}`);

    }
});

function hasCorrectExtension(filename: string): boolean {
    return filename.split('.').pop() === OWL_EXTENSION;
}

/**
 * for tests only
 */
export var _hasCorrectExtension = hasCorrectExtension; 