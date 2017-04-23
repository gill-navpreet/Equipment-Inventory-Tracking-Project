#!/bin/bash

# Kill the mongo db server
kill $(ps -ef | grep "./mongod" | grep -v "grep"| awk '{print $2}')

# Kill the server
kill $(ps -ef | grep "node server.js server.js" | grep -v "grep" | awk '{print $2}')

# Wait for 3 seconds because it takes time to kill teh databse server
sleep 3