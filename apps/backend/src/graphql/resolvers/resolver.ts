import { generateTFYAML, generateTFJSON, runTerraformCommand } from "../../utils/cli";
import fs from 'fs';

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
                const stripAnsi = (str: string) => str.replace(/\u001b\[.*?m/g, '');
                const errorMessage = stripAnsi(error.message || 'Unknown error occurred during validation');
                return { isValid: false, errors: [errorMessage] };
            }
        },
        viewPlan: async (_ : any, { config } : { config: string }) : Promise<{}> => {
            return {}
        }, 
        provisionFile: async (_: any, { config, fileType } : { config: string, fileType: string }) : Promise<{ success: boolean; errors: string[] }> => {
            try {
                if (fileType == "JSON"){
                    await generateTFJSON(config);
                } else {
                    await generateTFYAML(config);
                }
                await runTerraformCommand('terraform', ['apply', '-auto-approve']);
                return { success: true, errors: [] };
            } catch (error : any) {
                const stripAnsi = (str: string) => str.replace(/\u001b\[.*?m/g, '');
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
        getResources: () => {

        }
    },  
}; 

export default resolvers;