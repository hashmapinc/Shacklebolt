all: dev 

# run local dev server
dev: 
	npm start

# build the app
build: 
	npm run build

# deploy the build to s3
deploy: build 
	aws s3 cp build s3://shacklebolt-project --recursive
