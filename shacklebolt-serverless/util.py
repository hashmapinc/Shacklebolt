import json

def buildResponse(statusCode, body):
    return {
        "statusCode": statusCode,
        "headers": {
            'Access-Control-Allow-Origin': '*'
        },
        "body": json.dumps(body),
        "isBase64Encoded": True
    }

def getGroupName(event):
    try:
        return event['requestContext']['authorizer']['claims']['cognito:groups']
    except:
        return 'public'
