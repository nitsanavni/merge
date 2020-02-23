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