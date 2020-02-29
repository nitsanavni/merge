import { expect } from "chai";
import { exec } from "child_process";
import { After, Before, Given, TableDefinition, Then, When } from "cucumber";
import * as fs from "fs";

const shell = (cmd: string) => new Promise((r) => exec(cmd).on("close", r));
const cleanTempFiles = () => shell("git clean -dfxq -- steps/temp/");
const build = () => shell("npm run build");

Before(cleanTempFiles);

After(cleanTempFiles);

Given("cli file {string}", async function(cliFileName: string, fileContents: string) {
    await new Promise((r) => fs.writeFile(`./steps/temp/${cliFileName}`, fileContents, r));
    await build();
});

When("driving {string} with", async function(scriptDescriptor: string, params: TableDefinition) {
    const child = exec(`node ./utils/our-driver.js ${scriptDescriptor} ${params.raw()[0].join(" ")}`);

    this.output = await new Promise((resolve) => child.stdout!.on("data", resolve));
});

Then("output is", function(expectedOutput: string) {
    expect(this.output).to.include(expectedOutput);
});
