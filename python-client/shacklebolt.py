import boto3

from multiprocessing import Pool
import os

def processFiles(filepaths):
    # parallelize the processing with a pool map of size=os.cpu_count()
    print("STARTING PARALLEL FILE PROCESSING...")
    with Pool() as p:
        p.map(processFile, filepaths)


def processFile(filepath):
    print(f"\tPROCESSING {filepath}...")
