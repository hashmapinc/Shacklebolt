import json, decimal

def decimal_default(obj):
    if isinstance(obj, decimal.Decimal):
        return float(obj)
    raise TypeError

def buildResponse(statusCode, body):
    return {
        "statusCode": statusCode,
        "headers": {
            'Access-Control-Allow-Origin': '*'
        },
        "body": json.dumps(body, default=decimal_default),
        "isBase64Encoded": True
    }

def getGroupName(event):
    try:
        return event['requestContext']['authorizer']['claims']['cognito:groups']
    except:
        return 'public'


def getUsername(event):
    return event['requestContext']['authorizer']['claims']['cognito:username']