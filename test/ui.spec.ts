import anyTest, { TestInterface } from "ava";
import * as inquirer from "inquirer";
import { each } from "lodash";
import * as mockStding from "mock-stdin";
import { MockSTDIN } from "mock-stdin";
import { inspect } from "util";

type Context = {
    stdin: MockSTDIN;
    ui: any;
};

const test = anyTest as TestInterface<Context>;

const prompt = () => inquirer.prompt({ type: "confirm", message: "message", name: "name" });

test.beforeEach((t) => {
    t.context.stdin = mockStding.stdin();
    t.context.ui = inquirer.ui;
});

each(
    [
        { ans: "\n", result: { name: true } },
        { ans: "y\n", result: { name: true } },
        { ans: "n\n", result: { name: false } },
        { ans: "hello\n", result: { name: false } }
    ],
    ({ ans, result: ret }) =>
        test.serial(`prompt & answer ${ans}, expect result ${inspect(ret)}`, async (t) => {
            const p$ = prompt();
            t.context.stdin.send(ans);
            t.deepEqual(await p$, ret);
        })
);
