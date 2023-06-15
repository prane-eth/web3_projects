#!/bin/bash

# This file pushes latest code from laptop to GitHub

# ignore if message is "-f"
if [ "$1" == "-f" ]; then
    message='Updated code'
else
    message=${1:-'Updated code'}
fi

git add .
git commit -m "$message"
if [ "$1" == "-f" ]; then
    git push -f ${@:2}
else
    git push ${@:2}
fi