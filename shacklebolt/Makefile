all: dev 

# run local dev server
dev: 
	npm start

# deploy the build to s3
deploy: build 
	npm run build
	aws s3 cp build s3://shacklebolt.hashmapinc.com --recursive
