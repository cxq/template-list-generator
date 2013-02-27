#!/bin/sh

echo Starting template generator on $1 with $2px screenshot size

phantomjs template-list-generator.js $1

cd screenshots
python resize.py $2

echo All right!