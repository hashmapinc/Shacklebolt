import os
import settings
from multiprocessing import Pool
import targets
from endpointProcessor import processEndpoint, getFilepaths
from shacklebolt import processFiles

def parallelProcess(endpoints):
    # parallelize the processing with a pool map of size=os.cpu_count()
    results = []
    with Pool() as p:
        results = p.map(processEndpoint, endpoints)

    for failure in filter(None, results):  # non-None values are fails
        print(f"FAILED TO PROCESS {failure}.")

    print("GETTING FILEPATHS...")
    filepaths = getFilepaths()
    print(f"FOUND {len(filepaths)} FILES.")

    print("PROCESSING FILES...")
    failedFiles = processFiles(filepaths)

    if len(failedFiles) > 0:
        print(f"FAILED TO PROCESS {len(failedFiles)} FILES.")

def process(endpoint):
    failedEndpoint = processEndpoint(endpoint)
    if failedEndpoint is not None:
        print(f"FAILED TO PROCESS {failedEndpoint}.")
        return
    
    print("GETTING FILEPATHS...")
    filepaths = getFilepaths()
    print(f"FOUND {len(filepaths)} FILES.")

    print("PROCESSING FILES...")
    failedFiles = processFiles(filepaths)

    if len(failedFiles) > 0:
        print(f"FAILED TO PROCESS {len(failedFiles)} FILES.")

def main():
    # create working directory
    print("CREATING WORK DIR...")
    if not os.path.exists(settings.WORK_DIR):
        os.mkdir(settings.WORK_DIR)

    # serial processing of endpoints with multiprocessing of files
    # THIS USES LESS DISK SPACE, BUT TAKES MORE TIME
    #print("PROCESSING ENDPOINTS...")
    #for endpoint in targets.ENDPOINTS:
    #    process(endpoint)
    
    # OR, you can do multiprocessing below if you have a large enough disk
    # THIS USES MORE DISK SPACE, BUT TAKES LESS TIME
    print("STARTING MULTIPROCESS ENDPOINT PROCESSING...")
    parallelProcess(targets.ENDPOINTS)


if __name__ == '__main__':
    main()
