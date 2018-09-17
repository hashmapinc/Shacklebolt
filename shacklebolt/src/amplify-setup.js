import Amplify from 'aws-amplify'; 
import aws_exports from './aws-exports';

export default function init() {
    // auto config
    Amplify.configure(aws_exports);

    // manual config
    Amplify.configure({
        Auth: {
            // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
            mandatorySignIn: true,
        }
    });
}