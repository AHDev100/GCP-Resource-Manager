import figlet from "figlet";
import { OptionValues, program } from "commander";
import fs from "fs";
import inquirer from "inquirer";
import { spawn } from 'child_process';

const gcp_provider : string = `
  terraform {
    required_providers {
      google = {
        source  = "hashicorp/google"
        version = "6.8.0"
      }
    }
  }\n
`;

function runTerraformCommand(command : string, args : Array<string>) : Promise<void> {
  let tf = spawn(command, args, { stdio: "inherit", shell: true });
  return new Promise((resolve, reject) => {
    console.log(`Running command: ${command} ${args.join(' ')}`);

    tf.stdout?.on('data', (data) => {
      console.log(data.toString());
    });

    tf.stderr?.on('data', (data) => {
      console.log(data.toString());
      reject();
    });

    tf.on('close', (code) => {
      console.log(`Command completed: ${command} ${args.join(' ')} with exit code ${code}`);
      if (code == 0){
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });  
}

async function spawnTerraformLifeCycle(){
  try {
    await runTerraformCommand("terraform", ["fmt"]);
    await runTerraformCommand("terraform", ["init"]);
    await runTerraformCommand("terraform", ["validate"]);
    await runTerraformCommand("terraform", ["apply"]);
  } catch (err) {
    err && console.error(err);
  }
}

async function handleNestedBlock(blockName: string, indentLevel: number) : Promise<string> {
  let block : string = `${" ".repeat(indentLevel)} ${blockName} {\n`;
  
  let addFieldOrBlock : boolean = true; 

  while(addFieldOrBlock){
    const blockField = await inquirer.prompt([
      {
        type: "list", 
        name: "fieldType", 
        message: "What would you like to specify in the block?",
        choices: ["Key-Value Pair", "Nested Block", "Done With Block"]
      }
    ]);

    if (blockField.fieldType == "Key-Value Pair"){
      const kvpair = await inquirer.prompt([
        {
          type: "input",
          name: "key",
          message: "Enter the key: "
        },
        {
          type: "input",
          name: "value",
          message: "Enter the value"
        }
      ]);

      block += `  ${kvpair.key} = ${kvpair.value}\n`;
    } else if (blockField.fieldType == "Nested Block"){
      const nestedBlockAnswers = await inquirer.prompt([
        {
          type: "input",
          name: "nestedBlockName",
          message: "Enter the name of the nested block:",
        },
      ]);

      block += await handleNestedBlock(nestedBlockAnswers.nestedBlockName, indentLevel + 1);
    } else {
      addFieldOrBlock = false;
    }
  }

  block += `${"  ".repeat(indentLevel)}}\n`;
  return block;
}

async function handleResource() : Promise<void> {
  let addResource : boolean = true;
    
  while (addResource){
    const resourcePrompt = await inquirer.prompt([
      {
        type: "input",
        name: "resourceType",
        message: "Enter the resource type"
      }, 
      {
        type: "input",
        name: "resourceName",
        message: "Enter a name for the resource"
      }
    ]);
    
    let resourceBlock = `\nresource \"${resourcePrompt.resourceType}\" \"${resourcePrompt.resourceName}\" {\n`;

    let addFieldOrBlock : boolean = true; 

    while(addFieldOrBlock){
      const resourceField = await inquirer.prompt([
        {
          type: "list", 
          name: "fieldType", 
          message: "What would you like to specify in the resource?",
          choices: ["Key-Value Pair", "Nested Block", "Done With Resource"]
        }
      ]);

      if (resourceField.fieldType == "Key-Value Pair"){
        const kvpair = await inquirer.prompt([
          {
            type: "input",
            name: "key",
            message: "Enter the key: "
          },
          {
            type: "input",
            name: "value",
            message: "Enter the value"
          }
        ]);

        resourceBlock += `  ${kvpair.key} = ${kvpair.value}\n`; 
      } else if (resourceField.fieldType == "Nested Block"){
        const nestedBlock = await inquirer.prompt([
          {
            type: "input",
            name: "name",
            message: "Enter the name for the nested block"
          }
        ]);
        
        resourceBlock += await handleNestedBlock(nestedBlock.name, 2);
      } else {
        addFieldOrBlock = false;
      }
    }

    resourceBlock += "}\n";

    // console.log(resourceBlock);

    await fs.promises.writeFile('main.tf', resourceBlock, { flag: 'a+' });

    const continueResources = await inquirer.prompt([
      {
        type: "confirm",
        name: "yes",
        message: "Do you want to add another resource?",
        default: false
      }
    ]);

    addResource = continueResources.yes;
  }
}

async function generateTFManual() : Promise<Number> {
  try {
    let addBlock : boolean = true;

    while(addBlock){
      const blockType = await inquirer.prompt([
        {
          type: "list", 
          name: "fieldType", 
          message: "What block would you like to add?",
          choices: ["Provider", "Resource", "Output", "Done"]
        }
      ]);

      if (blockType.fieldType == "Provider"){
        const provider = await inquirer.prompt([
          {
            type: "input",
            name: "name",
            message: "Enter the provider name"
          }
        ]);

        let providerBlock = ` provider ${provider.name} {\n`;

        let collectProducerKVs : boolean = true; 

        while (collectProducerKVs){
          const ready = await inquirer.prompt([
            {
              type: "list",
              name: "yes",
              message: "Do you have a key and value to provide for the block?",
              choices: ["Yes", "No"]
            }
          ]);

          if (ready.yes == "Yes"){
            const kvpair = await inquirer.prompt([
              {
                type: "input",
                name: "key",
                message: "Enter the key: "
              },
              {
                type: "input",
                name: "value",
                message: "Enter the value"
              }
            ]);

            providerBlock += `  ${kvpair.key} = ${kvpair.value}\n`; 
          } else {
            collectProducerKVs = false; 
          }
        }

        providerBlock += "}\n";
        await fs.promises.writeFile('main.tf', providerBlock, { flag: 'a+' });
      } else if (blockType.fieldType == "Resource"){
        await handleResource();
      } else if (blockType.fieldType == "Output"){
        let addOutput : boolean = true; 
        
        while(addOutput){
          const output = await inquirer.prompt([
            {
              type: "input",
              name: "name",
              message: "Provide the name for the output"
            }
          ]);
  
          let outputBlock = `output \"${output.name}\" {\n`; 
  
          let addOutputKVPs : boolean = true; 

          while(addOutputKVPs){
            const kvpair = await inquirer.prompt([
              {
                type: "input",
                name: "key",
                message: "Enter Key:"
              },
              {
                type: "input",
                name: "value",
                message: "Enter Value:"
              }
            ]);

            outputBlock += `  ${kvpair.key} = ${kvpair.value}\n`;

            const continueOutputKVPs = await inquirer.prompt([
              {
                type: "confirm",
                name: "yes",
                message: "Do you want to add another value?",
                default: false
              }
            ]);

            addOutputKVPs = continueOutputKVPs.yes;
          }

          outputBlock += "}\n";

          await fs.promises.writeFile('outputs.tf', outputBlock, { flag: 'a+' });
  
          const continueOutputs = await inquirer.prompt([
            {
              type: "confirm",
              name: "yes",
              message: "Do you want to add another output?",
              default: false
            }
          ]);

          addOutput = continueOutputs.yes;
        }
      } else {
        addBlock = false; 
      }
    }

    return 0;
  } catch (err){
    console.error(err);
    return -1;
  }
}

async function generateTFJSON(filepath: string): Promise<number> {
  try {
    const data = JSON.parse((await fs.promises.readFile(filepath, "utf-8")));
    const provider = data.provider;

    let providerBlock = `provider "${provider.name}" {\n`;
    for (const [key, value] of Object.entries(provider)) {
      if (key !== "name") {
        providerBlock += `  ${key} = ${JSON.stringify(value)}\n`;
      }
    }
    providerBlock += "}\n";
    await fs.promises.writeFile('main.tf', providerBlock, { flag: 'a+' });

    const resources = data.resources;
    for (const resource of resources) {
      let resourceBlock = `resource "${resource.type}" "${resource.name}" {\n`;
      for (const [key, value] of Object.entries(resource.properties)) {
        if (value != null) {
          if (typeof value === "object" && !Array.isArray(value)) {
            resourceBlock += `  ${key} {\n`;
            for (const [nestedKey, nestedValue] of Object.entries(value)) {
              resourceBlock += `    ${nestedKey} = ${JSON.stringify(nestedValue)}\n`;
            }
            resourceBlock += "  }\n";
          } else if (Array.isArray(value)) {
            if (key === "tags") {
              resourceBlock += `  ${key} = ${JSON.stringify(value)}\n`;
            } else {
              value.forEach((nestedObj) => {
                resourceBlock += `  ${key} {\n`;
                for (const [nestedKey, nestedValue] of Object.entries(nestedObj)) {
                  resourceBlock += `    ${nestedKey} = ${JSON.stringify(nestedValue)}\n`;
                }
                resourceBlock += "  }\n";
              });
            }
          } else {
            resourceBlock += `  ${key} = ${JSON.stringify(value)}\n`;
          }
        }
      }
      resourceBlock += "}\n";
      await fs.promises.writeFile('main.tf', resourceBlock, { flag: 'a+' });
    }

    return 0;
  } catch (err) {
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
        /* For time being, we're just gonna be using GCP, so just write that terraform block for the time being - gotta be careful to make sure the block isn't written again tho */
        await fs.promises.writeFile('main.tf', gcp_provider, { flag: 'a+' });
        await generateTFJSON(filepath);
        await spawnTerraformLifeCycle();
      } else {
        console.error("File", filepath, "not found :(");
      }
    } else if (options.manual) {
      // console.log("We're in manual mode");
      /* For time being, we're just gonna be using GCP, so just write that terraform block for the time being - gotta be careful to make sure the block isn't written again tho */
      await fs.promises.writeFile('main.tf', gcp_provider, { flag: 'a+' });
      await generateTFManual();
      await spawnTerraformLifeCycle(); // TODO: Give option to destroy resources immediately after
        // .then(async () => {
        //   await inquirer.prompt([

        //   ]);
        // });
    } else {
      console.error("No valid option provided.");
    }
  });

program.parse(process.argv);