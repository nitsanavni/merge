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
            import { map, range } from "lodash";

            export const ask = async () => {
            /**/ const ans = await prompt({
            /**//**/type: "list",
            /**//**/choices: map(range(100), (i) => `${i}`),
            /**//**/name: "life",
            /**//**/message: "answer to life"
            /**/});

            /**/console.log(`answer to: ${inspect(ans)}`);
            };

            """
        When  driving "test-interactive-cli.ts#ask"
        Then  expect back and forth
            | Q                         | A  |
            | answer to life            | 42 |
            | answer to: { life: '42' } |    |
