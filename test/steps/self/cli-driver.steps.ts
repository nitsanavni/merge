import { expect } from "chai";
import { exec } from "child_process";
import { After, Before, Given, TableDefinition, Then, When } from "cucumber";
import * as fs from "fs";
import { QnA } from "../../types/qa";

const shell = (cmd: string) => new Promise((r) => exec(cmd).on("close", r));
const cleanTempFiles = () => shell("git clean -dfxq -- test/steps/temp/");
const build = () => shell("npm run build");

Before(cleanTempFiles);

After(cleanTempFiles);

const drive = (scriptDescriptor: string, params?: string) => {
    const child = exec(`node ./test/utils/our-driver.js ${scriptDescriptor} ${params || ""}`);

    const onFail = (cb: () => void) => child.on("error", cb);
    const expectQnA = (QnASequence: QnA[], verbose = false) => {
        let dataCount = 0;

        return new Promise((resolve) =>
            child.stdout!.on("data", (outData) => {
                if (dataCount == QnASequence.length) {
                    return;
                }

                const { Q, A } = QnASequence[dataCount];

                const out = outData.toString();

                if (verbose) {
                    console.log("got " + out);
                }

                if (!out.includes(Q)) {
                    return;
                }

                if (out.includes("(Use arrow keys)")) {
                    if (new RegExp(`❯ .*${A}`).test(out)) {
                        child.stdin!.write("\r\n");
                    } else {
                        const downKey = "\x1B[B";
                        child.stdin!.write(downKey);

                        return;
                    }
                } else {
                    A && child.stdin!.write(A + "\n");
                }

                dataCount++;

                if (dataCount == QnASequence.length) {
                    resolve();
                }
            })
        );
    };

    return {
        child,
        onFail,
        expectQnA
    };
};

Given("cli file {string}", async function(cliFileName: string, fileContents: string) {
    await new Promise((r) => fs.writeFile(`./test/steps/temp/${cliFileName}`, fileContents, r));
    await build();
});

When("driving {string} with", async function(scriptDescriptor: string, params: TableDefinition) {
    const child = exec(`node ./test/utils/our-driver.js ${scriptDescriptor} ${params.raw()[0].join(" ")}`);

    this.output = await new Promise((resolve) => child.stdout!.on("data", resolve));
});

When("driving {string}", function(scriptDescriptor: string) {
    this.driverChild = drive(scriptDescriptor);
});

Then("expect back and forth", async function(backAndForth: TableDefinition) {
    await this.driverChild.expectQnA(backAndForth.hashes());
});

Then("output is", function(expectedOutput: string) {
    expect(this.output).to.include(expectedOutput);
});
