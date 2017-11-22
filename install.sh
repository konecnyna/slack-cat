#!/bin/bash
home=`pwd`

for f in $(find $home/modules/default -maxdepth 1 -name "*" -type d); 
do 
	cd $f; 
	echo $f; 
	if [ -f "package.json" ]
	then
		echo "Found package.json install dependencies"	
		npm install; 
	fi
done