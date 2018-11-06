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

    # harvest metadata as tags
    try:
        # create a s3_key for this file
        groupName = util.getGroupName(event)
        timeCreated = time.time()
        s3_filename = f"{timeCreated}--{uuid.uuid4()}--{body['filename']}"
        s3_key = f"{groupName}/{s3_filename}"

        # append all metadata harvested to the tags array along with exising user-defined tags
        tags = body["tags"]
        tags.append({'key': 'created', 'value': timeCreated})
        tags.append({'key': 'filename', 'value': body['filename']})
        tags.append({'key': 'filetype', 'value': body['filetype']})
        tags.append({'key': 'author', 'value': util.getUsername(event)})
        return util.buildResponse(200, f"{tags}")
    except Exception as e:
        msg = f"error harvesting metadata: {e}"
        logger.error(msg)
        return util.buildResponse(500, msg)
