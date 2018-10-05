import Amplify, {Auth} from 'aws-amplify'; 
import aws_exports from './aws-exports';

export default function init() {
    // auto config
    Amplify.configure(aws_exports);

    // manual config
    Amplify.configure({
        Auth: {
            // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
            mandatorySignIn: true,
        },
        API: {
            endpoints: [
                {
                    name: "shacklebolt",
                    endpoint: "https://oy82vobhd6.execute-api.us-east-1.amazonaws.com/dev",
                    custom_header: async () => {
                        let auth = (await Auth.currentSession()).idToken.jwtToken;
                        return { Authorization: auth}
                    }
                }
            ]
        }
    });
}