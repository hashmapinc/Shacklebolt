import Amplify from 'aws-amplify';

export default function init() {
    Amplify.configure({
        Auth: {
            // REQUIRED - Amazon Cognito Region
            region: 'us-east-1',

            // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
            userPoolWebClientId: '1pfggmkjhucteosf2ss96132br',

            // OPTIONAL - Amazon Cognito User Pool ID
            userPoolId: 'us-east-1_9Z6hQe34K',

            // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
            mandatorySignIn: true,
        }
    });
}