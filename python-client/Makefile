all: run 

# create venv
venv:
	-python3 -m virtualenv env

# install requirements
install: venv
	source env/bin/activate; \
	pip install -r ./requirements.txt

# get venv-activated shell
shell:
	source env/bin/activate; \
	python;

# run the client
run: 
	source env/bin/activate; \
	python ./client.py;