import { drop } from "lodash";

(async () => {
    await (await import(`../steps/temp/${process.argv[2].split(".")[0]}`))[process.argv[2].split("#")[1]](
        ...drop(process.argv, 3)
    );
})();
