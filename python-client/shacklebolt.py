import boto3, os, queue
from multiprocessing import Pool, Queue

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
        os.remove(filepath)
        return None
    except Exception as e:
        return filepath

