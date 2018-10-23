from targets import ENDPOINTS
from endpointProcessor import processEndpoints, getFileList

def main():
    print("PROCESSING ENDPOINTS...")
    processEndpoints(ENDPOINTS)

    print("GETTING FILES...")
    files = getFileList()
    [print(file) for file in files]

if __name__ == '__main__':
    main()
