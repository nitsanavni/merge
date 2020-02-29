import { exec } from "child_process";
import { Given, TableDefinition, When } from "cucumber";
import * as fs from "fs";

Given("cli file {string}", async function(cliFileName: string, fileContents: string) {
    await new Promise((r) => fs.writeFile(`./steps/temp/${cliFileName}`, fileContents, r));
});

When("driving {string} with", async function(scriptDescriptor: string, params: TableDefinition) {
    const child = exec(`node ./utils/our-driver.js ${scriptDescriptor} ${params.raw()[0].join(" ")}`);

    const out = await new Promise((r) => child.stdout!.on("data", r));

    console.log("out!" + out);
});
