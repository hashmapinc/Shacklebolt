# Python Client
This client reads environment variables to gather credentials and endpoints to upload files into Shacklebolt.

##Environment Variables:
- `SB_USERNAME` => username for authentication
- `SB_PASSWORD` => password for authentication
- `SB_API_ENDPOINT` => endpoint to direct rest calls to

## Usage:
1. Provide a file called `TARGETS.CSV` in the same directory as `client.py`. This file should contain a list (single column, so no commas, just newline separated) of URLs that the client will send GET requests to.
2. The client will store file responses from each target in a `in-progress` directory that it will create. Any `*.zip` files will be unzipped here.
3. The client will then individually process unzipped files by generating metadata and uploading the files into shacklebolt and indexing the generated tag metadata.
4. Files will be deleted as they are successfully processed.

