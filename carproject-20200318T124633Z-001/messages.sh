#!/bin/bash
#
# we can use a local mosquitto broker OR a web based one (local commented out below)
# the while will stay in the subscribe loop and act on any messages rxed
#
#
# test this script
# ./messages.sh messageapp/sender/createdAt/subject/message -m me,today,subject,message
# pub
# mosquitto_pub -h broker.hivemq.com -t messageapp/sender/createdAt/subject/message -m me,today,subject,message
#
#vars
#
# Firebase Vars - from app settings
PROJECT_ID='car-reviews-406b3'
COLLECTION_ID='categories'
API_KEY='AIzaSyBdHlHn0CYo7HMgF8YuhFfT7UqZRW-lLKo'
TOKEN=''

# Firestore rules to allow read/write
# https://firebase.google.com/docs/firestore/security/get-started

# Build the URL to which data will be sent
# This uses the app settings defined above
FIRESTORE_URL="https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/(default)/documents/$COLLECTION_ID?&key=$API_KEY"
# check url
echo $FIRESTORE_URL

# HTTP Header parameters
# Data will be JSON
REQ_HEADER='content-type: application/json'
# Auth Token if required
AUTH_HEADER="Authorization: Bearer $TOKEN"
# Saving data to API via POST request 
REQ_METHOD='POST'
# mosquitto_sub -v -h localhost -t myapp/# | while read line
mosquitto_sub -v -h broker.hivemq.com -t messageapp/# | while read line
do
        # first all we do is echo the line (topic + message) to the screen
        echo "line: $line\n"

        # assume topic has 4 fields in form field1/field2/field3/field4
        # cut them out of the topic and put into column vars 1-4
        column1=`echo $line|cut -f2 -d/`
        echo "col1: $column1"
        column2=`echo $line|cut -f3 -d/`
        echo "col2: $column2"
        column3=`echo $line|cut -f4 -d/`
        echo "col3: $column3"
        column3=`echo $line|cut -f5 -d/`
        echo "col4: $column4"
        column3=`echo $line|cut -f6 -d/`
        echo "col5: $column5"
        column4=`echo $line|cut -f7 -d/`
        echo -e "col6: $column6\n"            

        # now we work on the message
        # assume message has 5 fields in form field1,field2,field3,field4
        # cut them out of the msg and put into column vars
        msg=`echo "$line"|cut -f2- -d ' '`
        echo -e "msg: $msg\n"
        sender=`echo "$msg"|cut -f1 -d,`
        echo "sender: $sender"
        createdAt=`echo "$msg"|cut -f2 -d,`
        echo "createdAt: $createdAt"
        carbrand=`echo "$msg"|cut -f3 -d,`
        echo "carbrand: $carbrand"
        engine=`echo "$msg"|cut -f4 -d,`
        echo "engine: $engine"
        bodytype=`echo "$msg"|cut -f5 -d,`
        echo "engine: $bodytype"
        rating=`echo "$msg"|cut -f6 -d,`
        echo "rating: $rating"
        price=`echo "$msg"|cut -f7 -d,`
        echo "price: $price"
        #
        # now we work on the DB, we want to out the columns(1-6) into the DB
        #
        # If $createdAt has a value, use it, otherwise generate a timestamp
        if [[ $createdAt ]]
        then
            now=$createdAt
        else
            # generate date stamp
            now=`date`
        fi

        # Data to be sent in JSON format
        JSON='{"fields": {"createdAt": {"stringValue": "'"$now"'"}, "sender": {"stringValue": "'"$sender"'"}, "carbrand": {"stringValue": "'"$carbrand"'"}, "engine": {"stringValue": "'"$engine"'"}, "bodytype": {"stringValue": "'"$bodytype"'"}, "rating": {"stringValue": "'"$rating"'"}, "price": {"stringValue": "'"$price"'"}}}'
        echo $JSON
        # https://askubuntu.com/questions/1162945/how-to-send-json-as-variable-with-bash-curl

        # Use CURL to send POST request + data
        response=$(curl -X $REQ_METHOD  -H "$REQ_HEADER" --data "$JSON" $FIRESTORE_URL)

        # Show response
        echo $response
done