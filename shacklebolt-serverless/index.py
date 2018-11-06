import datetime, json, logging, os, uuid

import boto3

import util

logger = logging.getLogger()
logger.setLevel(logging.INFO)

RESERVED_KEYS = [
    'filename',
    'filetype',
    'dateCreated',
    'author',
    'uploadValidated'
]

def handler(event, context):
    # parse post information
    body = {}
    try:
        # parse the body
        body = json.loads(event["body"])
        logger.info(f"Successfully parsed body:\n{body}")

        # create an s3 key for this file from the parsed body
        groupName = util.getGroupName(event)
        timeCreated = datetime.datetime.utcnow()
        s3_filename = f"{timeCreated.timestamp()}--{uuid.uuid4()}--{body['filename']}"
        s3_key = f"{groupName}/{s3_filename}"

        # validate the tags
        for tag in body['tags']:
            if tag['key'] in RESERVED_KEYS: raise Exception(f"{tag['key']} is a reserved tag key.")
    except Exception as e:
        msg = f"error parsing post body: {e}"
        logger.error(msg)
        return util.buildResponse(500, msg)

    # harvest metadata as tags
    try:
        # append all metadata harvested to the tags array along with exising user-defined tags
        tags = body["tags"]
        tags.append({'key': 'dateCreated', 'value': timeCreated.isoformat()})
        tags.append({'key': 'uploadValidated', 'value': False})
        tags.append({'key': 'filename', 'value': body['filename']})
        tags.append({'key': 'filetype', 'value': body['filetype']})
        tags.append({'key': 'author', 'value': util.getUsername(event)})
    except Exception as e:
        msg = f"error harvesting metadata: {e}"
        logger.error(msg)
        return util.buildResponse(500, msg)

    # index tags into the tags table
    dynamodb = boto3.resource('dynamodb')
    try:
        # get dynamo table
        TAGS_TABLE = os.environ['DYNAMO_TAGS_TABLE']
        tags_table = dynamodb.Table(TAGS_TABLE)

        # batch put each tag into dynamo
        with tags_table.batch_writer() as batch:
            for tag in tags:
                item = {
                    'tag_key': tag['key'],
                    's3_key': s3_key,
                    'tag_value': str(tag['value']),
                }
                batch.put_item(Item=item)
    except Exception as e:
        msg = f"error indexing tags: {e}"
        logger.error(msg)
        return util.buildResponse(500, msg)

    # index file into the files table
    try:
        # get dynamo table
        FILES_TABLE = os.environ['DYNAMO_FILES_TABLE']
        files_table = dynamodb.Table(FILES_TABLE)

        # create the putable item
        item = {'s3_key': s3_key}
        for tag in tags:
            item[tag['key']] = tag['value']
        
        # write the item to the table
        files_table.put_item(Item=item)
    except Exception as e:
        msg = f"error indexing file: {e}"
        logger.error(msg)
        return util.buildResponse(500, msg)

    # get a presignedPOST url for client-side file upload to s3
    try:
        # Generate the POST
        s3 = boto3.client('s3')
        presignedPOST = s3.generate_presigned_post(
            Bucket=os.environ["S3_STORAGE_BUCKETNAME"],
            Key=s3_key
        )
        return util.buildResponse(200, presignedPOST)
    except Exception as e:
        msg = f"error generating presignedPOST: {e}"
        logger.error(msg)
        return util.buildResponse(500, msg)
