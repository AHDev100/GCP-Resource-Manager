import figlet from "figlet";
import { OptionValues, program } from "commander";
import fs from "fs";
// import util from 'util';

console.log(figlet.textSync("Cloud Migration Toolkit"));

type cli_arg = string | undefined;

program
  .name("Cloud Migration Toolkit")
  .description("Automate Infrastructure Creation/Management from CLI")
  .version("0.0.1");

program
  .option("-r, --read <json filepath>", "reads the config defined in the provided json file")
  .action(async () => {
    const options = program.opts<OptionValues>();
    const filepath: cli_arg = options.read;
    if (filepath && filepath.length) {
      if (fs.existsSync(filepath)) {
        // console.log("Read file:", filepath);
        // Process the JSON File - Create main.tf, query for infra parameters, execute terraform commands
      } else {
        console.log("There's no such file to be read!");
        return; 
      }
    } else {
      console.log("File path not given to read from");
    }
  });

program
  .option("-m, --manual", "user will provide the configuration blocks and values manually")
  .action(async () => {

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
