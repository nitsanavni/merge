import test from "ava";
import { exec } from "child_process";

test("should", async (t) => {
    const prompt = exec("node ./test/prompt-example.js");

    let dataCount = 0;
    const expectedData = ["? message (Y/n)", "? message Y", "{ name: true }"];
    const inSequence = ["\r\n"];

    prompt.on("error", t.fail);

    await new Promise((resolve) =>
        prompt.stdout!.on("data", (c) => {
            const e = expectedData[dataCount];
            if (!c.includes(e)) {
                return;
            }
            const i = inSequence[dataCount];
            i && prompt.stdin!.write(i);
            dataCount++;
            if (dataCount == expectedData.length) {
                t.pass();
                return resolve();
            }
        })
    );
});
