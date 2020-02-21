import { exec } from "child_process";
import { prompt } from "inquirer";

(async () => {
    const { repo } = await prompt({ type: "input", message: "repo (OWNER/REPO)", name: "repo" });

    const child = exec(`gh pr status -R ${repo}`);

    let out = "";
    child.stdout!.on("data", (d) => (out = out + d));

    await new Promise((resolve) => child.stdout!.on("end", resolve));

    const { pr } = await prompt({ type: "list", choices: ["a", "b", "c"], message: out, name: "pr" });
})();
