#!/bin/bash

#TODO: Need to modify the paths

# Kill the mongo db server
kill $(ps -ef | grep "./mongod" | grep -v "grep"| awk '{print $2}')
# Wait for 3 seconds because it takes time to kill teh databse server
sleep 3
# Kill the server
kill $(ps -ef | grep "node server.js server.js" | grep -v "grep" | awk '{print $2}')


# go to the directory where the project files are
cd $HOME/Desktop/EquipmentInventoryTrackingProject &> /dev/null
if [ $? -ne 0 ] ; then
	echo "ERROR: can't cd to the directory \"$HOME/Desktop/EquipmentInventoryTrackingProject\""
fi

# Run the server and databse
./run.sh 2> /dev/null 
if [ $? -ne 0 ] ; then
	echo "ERROR: Unable to execute the file run.sh successfully"
fi
