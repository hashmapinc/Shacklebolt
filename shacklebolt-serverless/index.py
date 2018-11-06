import json, logging, os, time, uuid

import boto3
from boto3.dynamodb.conditions import Key, Attr

import util

dynamodb = boto3.resource('dynamodb')

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    body = {}
    try:
        body = json.loads(event["body"])
        logger.info(f"Successfully parsed body:\n{body}")
    except Exception as e:
        msg = f"error parsing post body: {e}"
        logger.error(msg)
        return util.buildResponse(500, msg)

    # harvest metadata
    try:
        timeCreated = time.time()
        groupName = util.getGroupName(event)
        author = util.getUsername(event)
        filename = ""
        filetype = ""
        s3_filename = f"{timeCreated}.{uuid.uuid4()}.jpg"
        s3_key = f"{groupName}/{s3_filename}"
        res = [timeCreated, groupName, author, filename, filetype, s3_filename, s3_key]
        return util.buildResponse(200, f"{res}")
    except Exception as e:
        msg = f"error harvesting metadata: {e}"
        logger.error(msg)
        return util.buildResponse(500, msg)
