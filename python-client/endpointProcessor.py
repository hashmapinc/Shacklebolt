from multiprocessing import Pool
from zipfile import ZipFile
import os
import requests

WORK_DIR = './in-progress'

def processEndpoints(endpoints):
    # create working directory
    print("CREATING WORK DIR...")
    if not os.path.exists(WORK_DIR): os.mkdir(WORK_DIR) 

    # parallelize the processing with a pool map of size=os.cpu_count()
    print("STARTING PARALLEL ENDPOINT PROCESSING...")
    with Pool() as p:
        p.map(processEndpoint, endpoints)

def processEndpoint(endpoint):
    print(f"\tGETTING {endpoint}...")
    # get file name
    filename = f"{WORK_DIR}/{endpoint.split('/')[-1]}"

    # download file
    r = requests.get(endpoint, stream=True)
    with open(filename, "wb") as f:
        for chunk in r.iter_content(chunk_size=1024):
            # writing one chunk at a time to file
            if chunk:
                f.write(chunk)
    
    # extract zip if file is zip file
    splitFilename = filename.split('.')
    if splitFilename[-1] == 'zip':
        print(f"\t\t EXTRACTING {filename}...")
        # create a folder to unzip to
        dirName = '.'.join(splitFilename[:-1]) # recombine the filename without the .zip
        os.mkdir(dirName)

        # unzip
        zip = ZipFile(filename)
        zip.extractall(path=dirName)
        zip.close()

        # delete the zip file
        os.remove(filename)

    print(f"\tFINISHED PROCESSING {endpoint}...")


def getFileList():
    fileList = []
    # recursively search with os.walk for files in the working dir
    for root, _, files in os.walk(WORK_DIR):
        for file in files:
            fileList.append(os.path.join(root, file))
    
    return fileList

