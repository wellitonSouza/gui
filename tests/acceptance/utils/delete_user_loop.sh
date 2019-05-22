#!/usr/bin/env bash
#cleanUsers
for i in $(seq 1 2);
    do
        # Request to login with user to get his JWT Token
        LOGIN_USER_RESPONSE=$(curl \
        -H 'Content-Type: application/json' \
        --silent \
        -X POST \
        --data '{"username":"usertest'"$i"'","passwd": "newusrpswd'"$i"'"}' \
        http://localhost:8000/auth/)

        # extract the status
        LOGIN_USER_STATUS=$(echo $LOGIN_USER_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

        # extract the token
        LOGGED_USER_TOKEN=$(echo $LOGIN_USER_RESPONSE | jq '.jwt')

        #request to change password
        DELETE_USER_RESPONSE=$(curl \
        -H "Content-Type:application/json" \
        -H "Connection:keep-alive" \
        -H "Authorization:Bearer '$LOGGED_USER_TOKEN'" \
        --silent \
        -X DELETE \
        http://localhost:8000/auth/user/)


        # extract the status from response to change user pswd
        DELETE_USER_STATUS=$(echo $DELETE_USER_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

        echo "DELETE_USER_RESPONSE";
        echo "$DELETE_USER_RESPONSE";
        echo "DELETE_USER_STATUS";
        echo "$DELETE_USER_STATUS";
    done


