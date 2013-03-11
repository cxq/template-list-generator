#!/bin/sh

echo Starting template generator on $1

echo Remove old screenshots
rm -f screenshots/*png

phantomjs template-list-generator.js $1

cd screenshots
if [!$2]
	then
		$2 = "300";
fi

python resize.py $2

echo All right!