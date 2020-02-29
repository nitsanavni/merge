import test, { ExecutionContext } from "ava";
import { exec } from "child_process";
import { QnA } from "./types/qa";

test("prompt sequence", async (t) => {
    t.timeout(50000);

    await validateChildCli({
        t,
        childCmd: "node src/prompt.js -R test/emptyRepos",
        QnASequence: [
            { Q: "repo (OWNER/REPO)", A: "nitsanavni/merge" },
            { Q: "(Use arrow keys)", A: "" }
        ]
    });
});

type Params = {
    t: ExecutionContext;
    childCmd: string;
    QnASequence: QnA[];
};

async function validateChildCli({ t, childCmd, QnASequence }: Params) {
    const child = exec(childCmd);

    child.on("error", t.fail);

    let dataCount = 0;

    await new Promise((resolve) =>
        child.stdout!.on("data", (outData) => {
            if (dataCount == QnASequence.length) {
                return;
            }

            const { Q, A } = QnASequence[dataCount];

            if (!outData.toString().includes(Q)) {
                return;
            }

            A && child.stdin!.write(A + "\n");

            dataCount++;

            if (dataCount == QnASequence.length) {
                t.pass();

                return resolve();
            }
        })
    );
}
