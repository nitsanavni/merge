import { drop } from "lodash";

(async () => {
    const modName = process.argv[2].split(".")[0];
    // TODO - mod path should be injected; we shouldn't assume `steps/temp/`
    const modPath = `../steps/temp/${modName}`;
    const mod = await import(modPath);
    const fnName = process.argv[2].split("#")[1];
    const fn = mod[fnName];
    const args = drop(process.argv, 3);
    await fn(...args);
})();
