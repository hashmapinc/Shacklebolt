from zipfile import ZipFile
import os, requests, shutil
from settings import WORK_DIR

def processEndpoint(endpoint):
    print(f"\tGETTING {endpoint}...")
    try:
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
            # recombine the filename without the .zip
            dirName = '.'.join(splitFilename[:-1])
            shutil.rmtree(dirName, ignore_errors=True) # clear the way for the dir
            os.mkdir(dirName)

            # unzip
            zip = ZipFile(filename)
            zip.extractall(path=dirName)
            zip.close()

            # delete the zip file
            os.remove(filename)

        return None
    except Exception as e:
        return endpoint
    
def getFilepaths():
    filepaths = []
    # recursively search with os.walk for files in the working dir
    for root, _, files in os.walk(WORK_DIR):
        for file in files: 
            # ignore 'dot' files
            if not file.startswith('.'): filepaths.append(os.path.join(root, file))
    
    return filepaths

