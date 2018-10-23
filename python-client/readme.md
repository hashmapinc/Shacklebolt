# Python Client
This client performs `GET` requests to a list of endpoint targets, extracts any ZIP artifacts, and recursively uploads all files into Shacklebolt.

## Permissions:
Run this application in an EC2 instance with the `arn:aws:iam::660239660726:role/shacklebolt-pythonClient-ec2Role` role.

## Config:
To configure the client, update the values in `settings.py`.

## Usage:
1. Create an array of rest endpoints called ENDPOINTS in the `targets.py` file. The client will send `GET` requests to these endpoints.
2. The client will store file responses from each target in an `in-progress` directory that it will create. Any `*.zip` files will be unzipped here.
3. The client will then individually process unzipped files by generating metadata and uploading the files into shacklebolt and indexing the generated tag metadata.
4. Files will be deleted as they are successfully processed.

