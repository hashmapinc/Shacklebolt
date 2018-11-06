import json, logging, os

import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    # get s3_key from event
    try:
        # TODO: get s3_key from event
        return
    except Exception as e:
        msg = f"error getting s3 key from event: {e}"
        logger.error(msg)
        return 

    # update uploadValidated field in the file index
    dynamodb = boto3.resource('dynamodb')
    try:
        # get dynamo table
        FILES_TABLE = os.environ['DYNAMO_FILES_TABLE']
        files_table = dynamodb.Table(FILES_TABLE)

        # update
        {'key': 'uploadValidated', 'value': False}
        
    except Exception as e:
        msg = f"error updating file validation: {e}"
        logger.error(msg)
        return
