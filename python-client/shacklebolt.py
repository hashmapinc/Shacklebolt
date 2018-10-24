import boto3, os, time
from multiprocessing import Pool
import settings

# creates and s3 key and creates metadata for the file
def extractShackleboltData(filepath):
    # generate metadata
    groupName = settings.GROUP_NAME
    filename = os.path.basename(filepath)
    (_, filetype) = os.path.splitext(filepath)  # filetype = extension
    author = "PYTHON_CLIENT"
    created = int(time.time()*1000.0)
    s3_key = f"public/{groupName}/{filename}-{created}"
    metadata = {
        'filename': filename,
        'filetype': filetype,
        'created': created,
        'author': author,
    }

    return (s3_key, metadata)

def uploadToS3(filepath, s3_key):
    print(f"\t\tUPLOADING {filepath} TO S3...")
    # Create an S3 client
    s3 = boto3.client('s3')

    # Uploads the given file using a managed uploader, which will split up large
    # files automatically and upload parts in parallel.
    s3.upload_file(filepath, settings.S3_BUCKETNAME, s3_key)

def indexTags(s3_key, metadata):
    print(f"\t\tINDEXING TAGS FOR {s3_key} INTO DYNAMO...")

    # get table
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(settings.TAGS_TABLENAME)

    # batch put each tag into dynamo
    with table.batch_writer() as batch:
        for tag_key in metadata:
            tag_value = metadata[tag_key]
            item = {
                'tag_key': tag_key,
                's3_key': s3_key,
                'tag_value': tag_value,
            }
            batch.put_item(Item=item)

def indexFile(s3_key, metadata):
    print(f"\t\tINDEXING FILE FOR {s3_key} INTO DYNAMO...")

    # create table entry
    metadata['s3_key'] = s3_key

    # upload to dynamo
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(settings.FILES_TABLENAME)
    table.put_item(Item=metadata)

def processFiles(filepaths):
    # parallelize the processing with a pool map of size=os.cpu_count()
    print("STARTING MULTIPROCESSOR FILE PROCESSING...")
    results = []
    with Pool() as p:
        results = p.map(processFile, filepaths)

    failures = []
    for failure in filter(None, results): # non-none values are failures
        failures.append(failure)
    
    return failures

def processFile(filepath):
    print(f"\tPROCESSING {filepath}...")
    try:
        (s3_key, metadata) = extractShackleboltData(filepath)

        # index tags in dynamo
        indexTags(s3_key, metadata)

        # index file in dynamo
        indexFile(s3_key, metadata)

        # upload to s3
        uploadToS3(filepath, s3_key)

        # clean up and return
        os.remove(filepath)
        return None

    except Exception as e:
        # an error occurred. Return the filepath so it can be handled later
        print(f"Error processing {filepath}: {e}")
        return filepath

