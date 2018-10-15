import json

# return the groups that the user belongs to
def handler(event, context):
    group = ''
    try:
        group = event['requestContext']['authorizer']['claims']['cognito:groups']
    except:
        group = 'public'
    
    return {
        "statusCode": 200,
        "headers": {
            'Access-Control-Allow-Origin':'*'
        },
        "body": group, 
        "isBase64Encoded": True
    }
