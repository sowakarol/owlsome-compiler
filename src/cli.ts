import { existsSync, readFile, writeFile } from "fs";
import { Scanner } from "./scanner/scanner";

const OWL_EXTENSION = "owl";

process.argv.slice(2).forEach((filename: string) => {

    if (existsSync(filename) && hasCorrectExtension(filename)) {

        readFile(filename, (err, content) => {

            let scanner = new Scanner(content.toString());
            const outputFileName = filename.substr(0, filename.lastIndexOf('.')) + ".tokens";

            //TODO: replace with generated html
            writeFile(outputFileName
                , scanner.tokenize().map(token => token.value).join("\n")
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