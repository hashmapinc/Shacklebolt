import os, pickle
from targets import ENDPOINTS
from endpointProcessor import processEndpoints, getFilepaths
from shacklebolt import processFiles
from settings import FILE_TODO_PATH, URL_TODO_PATH

def resumeProcessing():
    print("RESUMING UNFINISHED FILE PROCESSING...")
    filepaths = pickle.load(open(FILE_TODO_PATH, 'rb'))
    failedFiles = processFiles(filepaths)
    os.remove(FILE_TODO_PATH)
    if len(failedFiles) > 0:
        print(f"FAILED TO PROCESS {len(failedFiles)} FILES. SEE {FILE_TODO_PATH}.")
        pickle.dump(failedFiles, open(FILE_TODO_PATH, 'wb'))

def main():
    print("CHECKING FOR UNFINISHED BUSINESS...")
    if os.path.exists(FILE_TODO_PATH):
        resumeProcessing()
        return
    
    print("PROCESSING ENDPOINTS...")
    failedEndpoints = processEndpoints(ENDPOINTS)
    if len(failedEndpoints) > 0:
        print(f"FAILED TO PROCESS {len(failedEndpoints)} ENDPOINTS. SEE {URL_TODO_PATH}.")
        pickle.dump(failedEndpoints, open(URL_TODO_PATH, 'wb'))
    else:
        if os.path.exists(URL_TODO_PATH): os.remove(URL_TODO_PATH) 

    print("GETTING FILES...")
    filepaths = getFilepaths()
    print(f"FOUND {len(filepaths)} FILES.")

    print("PERSISTING FOUND FILES TO DISK...")
    pickle.dump(filepaths, open(FILE_TODO_PATH, 'wb'))

    print("PROCESSING FILES...")
    failedFiles = processFiles(filepaths)

    if len(failedFiles) > 0:
        print(f"FAILED TO PROCESS {len(failedFiles)} FILES. SEE {FILE_TODO_PATH}.")
        pickle.dump(failedFiles, open(FILE_TODO_PATH, 'wb'))
    else:
        os.remove(FILE_TODO_PATH)

if __name__ == '__main__':
    main()
