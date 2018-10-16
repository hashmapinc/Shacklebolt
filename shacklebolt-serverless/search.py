import boto3
from boto3.dynamodb.conditions import Key, Attr

import logging
import os

from util import buildResponse, getGroupName

dynamodb = boto3.resource('dynamodb')

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# search for file metadata in dynamo


def handler(event, context):
    tags = []  # list of dicts where each dict={key, val}

    # parse query string params
    try:
        rawParams = event['queryStringParameters']
        for key in rawParams:
            val = rawParams[key]
            logger.info(f"Key: {key} | Val: {val}")
            tags.append({'key': key, 'val': val})
    except Exception as e:
        msg = f"error parsing query string parameters: {e}"
        logger.error(msg)
        return buildResponse(500, msg)

    # query dynamo
    try:
        groupName = getGroupName(event)
        TAGS_TABLE = os.environ['DYNAMO_TAGS_TABLE']
        FILES_TABLE = os.environ['DYNAMO_FILES_TABLE']

        # get matching keys from the tags table
        logger.info("querying tags table for matching s3Keys")
        table = dynamodb.Table(TAGS_TABLE)
        s3Keys = []
        for tag in tags:
            queryResults = table.query(
                KeyConditionExpression=Key('tag_key').eq(tag['key']) & Key('s3_key').begins_with(groupName),
                FilterExpression=Attr('tag_value').contains(tag['val'])
            )
            [s3Keys.append(item['s3_key']) for item in queryResults['Items']]

        # get matching files from the files table
        logger.info("querying files table for full file index data")
        table = dynamodb.Table(FILES_TABLE)
        files = []
        for s3Key in s3Keys:
            queryResults = table.query(
                KeyConditionExpression=Key('s3_key').eq(s3Key)
            )
            [files.append(item['s3_key']) for item in queryResults['Items']]

        return buildResponse(200, files)
    except Exception as e:
        msg = f"error querying dynamo: {e}"
        logger.error(msg)
        return buildResponse(500, msg)
