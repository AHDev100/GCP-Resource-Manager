import figlet from "figlet";
import { OptionValues, program } from "commander";
import fs from "fs";
import inquirer from "inquirer";
// import util from 'util';
import { spawn } from 'child_process';

const gcp_provider : string = `
  terraform {
    required_providers {
      google = {
        source  = "hashicorp/google"
        version = "6.8.0"
      }
    }
  }
`;

async function runTerraformCommand(command : string, args : Array<String>){
  
}

async function spawnTerraformLifeCycle(){
  try {
    await runTerraformCommand("terraform", ["fmt"]);
    await runTerraformCommand("terraform", ["init"]);
    await runTerraformCommand("terraform", ["validate"]);
    await runTerraformCommand("terraform", ["apply"]);
  } catch (err) {
    console.error(err);
  }
}

async function generateTFManual() : Promise<Number> {
  try {
    /* For time being, we're just gonna be using GCP, so just write that terraform block for the time being */
    await fs.promises.writeFile('main.tf', gcp_provider, { flag: 'a+' });
    return 0;
  } catch (err){
    console.error(err);
    return -1;
  }
}

async function generateTFJSON(filepath : String) : Promise<Number> {
  try {
    /* For time being, we're just gonna be using GCP, so just write that terraform block for the time being */
    await fs.promises.writeFile('main.tf', gcp_provider, { flag: 'a+' });
    return 0;
  } catch (err){
    console.error(err);
    return -1;
  }
}

console.log(figlet.textSync("Cloud Migration Toolkit"));

// console.log(gcp_provider);

type cli_arg = string | undefined;

program
  .name("Cloud Migration Toolkit")
  .description("Automate Infrastructure Creation/Management from CLI")
  .version("0.0.1");

program
  .option("-r, --read <jsonFilepath>", "reads the config defined in the provided JSON file")
  .option("-m, --manual", "provide the configuration blocks and values manually")
  .action(async () => {
    const options = program.opts<OptionValues>();
    const filepath : cli_arg = options.read;
    if (filepath && filepath.length) {
      // console.log("Read file:", filepath);
      if (fs.existsSync(filepath)){
        await generateTFJSON(filepath);
        await spawnTerraformLifeCycle();
      } else {
        console.error("File", filepath, "doesn't exist :(");
      }
    } else if (options.manual) {
      console.log("We're in manual mode");
      await generateTFManual();
      await spawnTerraformLifeCycle();
    } else {
      console.error("No valid option provided.");
    }
  });

program.parse(process.argv);

/* FOR REFERENCE: EXECUTE SHELL COMMANDS - FOR TERRAFORM OUTPUTS => Use exec if you want the output buffer returned all at once, use spawn if you want live output*/

// const exec = util.promisify(require('child_process').exec);

// async function ls() {
//   const { stdout, stderr } = await exec('echo 3 + 2');
//   console.log('stdout:', stdout);
//   console.log('stderr:', stderr);
// }
// ls();
