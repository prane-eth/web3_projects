#!/bin/bash

# This file pushes latest code from laptop to GitHub

message=${1:-'Updated code'}    

git add .
git commit -m "$message"
if [ "$2" == "-f" ]; then
	git push -f
else
	git push
fi

