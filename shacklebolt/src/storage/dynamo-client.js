import DynamoDB from 'aws-sdk/clients/dynamodb';
import { Auth } from 'aws-amplify'; 

import ENV from '../environment-variables';

/**
 * async function that uses amplify cognito credentials to 
 * create a dynamo client object
 */
export async function getDynamoClient() {
    const creds = Auth.essentialCredentials(
        await Auth.currentCredentials()
    );

    return new DynamoDB.DocumentClient({
        credentials: creds,
        region: ENV.REGION,
    });
}