import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# search for file metadata in dynamo
def handler(event, context):
    queryStringParams = {}
    statusCode = 200
    body = ''
    try:
        queryStringParams = event['queryStringParameters']
        logger.info("successfully parsed queryStringParams: " + json.dumps(queryStringParams))
    except Exception as e:
        logger.error(f"could not parse queryStringParameters: {e}")
        body = f"{e}"
        statusCode = 500
    
    params = []
    try:
        for key in queryStringParams:
            val = queryStringParams[key]
            logger.info(f"Key: {key} | Val: {val}")
            params.append((key, val))

        params = json.dumps(params)
    except Exception as e:
        logger.error(f"error iterating through queryStringParams: {e}")
        body=f"{e}"
        statusCode=500
    
    if body is '':
        body = params
    
    return {
        "statusCode": statusCode,
        "headers": {
            'Access-Control-Allow-Origin':'*'
        },
        "body": body, 
        "isBase64Encoded": True
    }
