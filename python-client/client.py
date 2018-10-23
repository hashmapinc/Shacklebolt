from targets import ENDPOINTS
from endpointProcessor import processEndpoints, getFilepaths
from shacklebolt import processFiles

def main():
    print("PROCESSING ENDPOINTS...")
    processEndpoints(ENDPOINTS)

    print("GETTING FILES...")
    filepaths = getFilepaths()

    print("PROCESSING FILES...")
    processFiles(filepaths)

if __name__ == '__main__':
    main()
