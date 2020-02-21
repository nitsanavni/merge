import * as inquirer from "inquirer";

const prompt = async () => {
    console.log(await inquirer.prompt({ type: "confirm", message: "message", name: "name" }));
};

(async () => await prompt())();
