#!/bin/bash

# This file pushes latest code from laptop to GitHub

message=${1:-'Updated'}    

git add .
git commit -m "$message"
git push
