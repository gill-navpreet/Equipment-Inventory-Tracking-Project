#!/bin/bash

#TODO: Need to modify the paths

# go to the directory where mongo database is
cd $HOME/Downloads/mongodb.2/bin 2> /dev/null #redirect error
if [ $? -ne 0 ] ; then
	echo "ERROR: can't cd to the directory \"$HOME/Desktop/EquipmentInventoryTrackingProject\""
fi

# Run the mongo database if not already running
ps -ef | grep "./mongod" | grep -v "grep"
if [ $? -ne 0 ] ; then # if the database server is not running already then start it and run it in the background
	./mongod&
	if [ $? -ne 0 ] ; then
		echo "ERROR: can't run the mongo database command"
	fi
else
	echo "NOTE: The database server is already running"
fi


# go to the directory where the project files are
cd $HOME/Desktop/EquipmentInventoryTrackingProject &> /dev/null
if [ $? -ne 0 ] ; then
	echo "ERROR: can't cd to the directory \"$HOME/Desktop/EquipmentInventoryTrackingProject\""
fi

# Run the server
npm start server.js 2> /dev/null 
if [ $? -ne 0 ] ; then
	echo "ERROR: can't start the server"
fi
