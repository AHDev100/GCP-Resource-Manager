import { runTerraformCommand } from "../../utils/cli";
import fs from 'fs';

const resolvers = {
    Mutation: {
        validateConfig: async (_: any, { config }: { config: string }): Promise<{ isValid: boolean; errors: string[] }> => {
            try {
                await fs.promises.writeFile('main.tf', config, { flag: 'w' });
                await runTerraformCommand('terraform', ['init']);
                await runTerraformCommand('terraform', ['validate']);
                return { isValid: true, errors: [] };
            } catch (error: any) {
                await fs.promises.writeFile('main.tf', '', { flag: 'w' });
                const stripAnsi = (str: string) => str.replace(/\u001b\[.*?m/g, '');
                const errorMessage = stripAnsi(error.message || 'Unknown error occurred during validation');
                return { isValid: false, errors: [errorMessage] };
            }
        },
        provisionFile: () => {
        
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
    Subscription: {
        logTerraform: () => {
            
        }
    }, 
}; 

export default resolvers;