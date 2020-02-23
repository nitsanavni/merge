import { Given } from "cucumber";

Given("cli file {string}", async function(cliFileName: string, fileContents: string) {
    console.log(cliFileName, fileContents);
});
