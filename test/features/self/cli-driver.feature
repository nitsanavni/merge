Feature: CLI Driver

    Scenario: Test a CLI Script
        Given cli file "test-cli.ts"
            """
            export const someCli = (param: string) => console.log("hello " + param);
            """
        When  driving "test-cli.ts#someCli" with
            | world |
        Then  output is
            """
            hello world
            """

    Scenario: Test an Interactive Script
        Given cli file "test-interactive-cli.ts"
            """
            import { prompt } from "inquirer";
            import { inspect } from "util";

            export const ask = async () => {
            /**/ const ans = await prompt({
            /**//**/type: "list",
            /**//**/choices: ["option a", "option b", "option c"],
            /**//**/name: "ourQ",
            /**//**/message: "which option?"
            /**/});

            /**/console.log(`your choice: ${inspect(ans)}`);
            };

            """
        When  driving "test-interactive-cli.ts#ask"
        Then  expect back and forth
            | Q                                 | A        |
            | which option?                     | option b |
            | your choice: { ourQ: 'option b' } |          |
