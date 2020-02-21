import test, { ExecutionContext } from "ava";
import { exec } from "child_process";

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

type QnA = { Q: string; A: string };

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

            console.log("Y " + outData);

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
