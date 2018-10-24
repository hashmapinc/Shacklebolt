all: run 

# install requirements
install:
	pipenv install;

# get venv-activated python shell
shell:
	pipenv run python;

# run the client
run: 
	export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES; \ # weird macOS High Sierra workaround for multithreading
	pipenv run python ./client.py;