from util import getGroupName, buildResponse

# return the groups that the user belongs to
def handler(event, context):
    return buildResponse(200, getGroupName(event))
