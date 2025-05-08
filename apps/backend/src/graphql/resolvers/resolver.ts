import { generateTFYAML, generateTFJSON, runTerraformCommand, runTerraformShow, runTerraformPlan } from "../../utils/cli";
import fs from 'fs';

const stripAnsi = (str: string) => str.replace(/\u001b(?:\[\d{1,2}(?:;\d{1,2})*m|[A-Za-z])/g, '');

const resolvers = {
    Mutation: {
        validateConfig: async (_: any, { config }: { config: string }): Promise<{ isValid: boolean; errors: string[] }> => {
            try {
                await fs.promises.writeFile('main.tf', config, { flag: 'w' });
                await runTerraformCommand('terraform', ['init']);
                await runTerraformCommand('terraform', ['fmt']);
                await runTerraformCommand('terraform', ['validate']);
                return { isValid: true, errors: [] };
            } catch (error: any) {
                await fs.promises.writeFile('main.tf', '', { flag: 'w' });
                const errorMessage = stripAnsi(error.message || 'Unknown error occurred during validation');
                return { isValid: false, errors: [errorMessage] };
            }
        },
        validateFile: async (_: any, { config, fileType }: { config: string, fileType: string }): Promise<{ isValid: boolean; errors: string[] }> => {
            try {
                if (fileType == "JSON"){
                    await generateTFJSON(config);
                } else {
                    await generateTFYAML(config);
                }
                await runTerraformCommand('terraform', ['init']);
                await runTerraformCommand('terraform', ['fmt']);
                await runTerraformCommand('terraform', ['validate']);
                return { isValid: true, errors: [] };
            } catch (error: any) {
                await fs.promises.writeFile('main.tf', '', { flag: 'w' });
                const errorMessage = stripAnsi(error.message || 'Unknown error occurred during validation');
                return { isValid: false, errors: [errorMessage] };
            }
        }, 
        provisionFile: async (_: any, { config, fileType, validated } : { config: string, fileType: string, validated: boolean }) : Promise<{ success: boolean; errors: string[] }> => {
            try {
                if (!validated){
                    if (fileType == "JSON"){
                        await generateTFJSON(config);
                    } else {
                        await generateTFYAML(config);
                    }
                }
                await runTerraformCommand('terraform', ['apply', '-auto-approve']);
                // console.log("SUCCESS IN APPLYING");
                return { success: true, errors: [] };
            } catch (error : any) {
                const errorMessage = stripAnsi(error.message || 'Unknown error occurred during validation');
                return { success: false, errors: [errorMessage] }
            }
        }, 
        provisionForm: () => {
    
        }, 
        provisionCode: () => {
    
        }, 
    }, 
    Query: {
        getResources: async () : Promise<string> => {
            try {
                const resources = await runTerraformShow();
                return stripAnsi(resources);
            } catch (error: any) {
                const errorMessage = error.message; 
                return errorMessage; 
            }
        }, 
        viewPlan: async () : Promise<string> => {
            try {
                const plan = await runTerraformPlan();
                return stripAnsi(plan);
            } catch (error: any){
                const errorMessage = error.message; 
                return errorMessage;
            }
        },
    },  
}; 

export default resolvers;