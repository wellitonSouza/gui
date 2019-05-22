# Login to get JWT Token
HTTP_RESPONSE=$(curl \
-H 'Content-Type: application/json' \
--silent \
--write-out "HTTPSTATUS:%{http_code}" -X POST \
--data '{"username":"admin","passwd": "admin"}' \
http://localhost:8000/auth/)

echo "\---------------------------------------------------------------------";
echo "Login Admin";
echo "---------------------------------------------------------------------/";
echo "";
echo "";
echo "";

# extract the token
USER_ADMIN_TOKEN=$(echo $HTTP_RESPONSE | jq '.jwt')

echo "\---------------------------------------------------------------------";
echo "Token: $USER_ADMIN_TOKEN";
echo "---------------------------------------------------------------------/";
echo "";
echo "";
echo "";


# extract the status
HTTP_STATUS=$(echo $HTTP_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

echo "\---------------------------------------------------------------------";
echo "Status: $HTTP_STATUS";
echo "---------------------------------------------------------------------/";
echo "";
echo "";
echo "";

CONTADOR=1
while [  $CONTADOR -lt $1 ]; do
    JSON_CREATE_USER='{"username":"usertest'"$CONTADOR"'","service":"usertest'"$CONTADOR"'","email":"usertest'"$CONTADOR"'@noemail.com","name":"test'"$CONTADOR"'","profile":"testuser"}'

    # request to create user
    CREATE_USER_RESPONSE=$( curl \
    -H "Content-Type:application/json" \
    -H "Connection:keep-alive" \
    -H "Authorization:Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJYVFdCWm9vS0w2QmJnSkdjMGx1QmFhTGU4NWF0QVNQUCIsImlhdCI6MTU1ODUzMTA5NiwiZXhwIjoxNTU4NTMxNTE2LCJwcm9maWxlIjoiYWRtaW4iLCJncm91cHMiOlsxXSwidXNlcmlkIjoxLCJqdGkiOiI0OTBkNWU4OTg0MzhkN2I2NmZlZGM2Yjg0OGE3NmEwMiIsInNlcnZpY2UiOiJhZG1pbiIsInVzZXJuYW1lIjoiYWRtaW4ifQ.-PzZR0rUr6wDZ3YaROPpj8Zkd9wv4hti-Zao42-E_j4" \
    --silent \
    --write-out "HTTPSTATUS:%{http_code}" -X POST \
    --data $JSON_CREATE_USER \
    http://localhost:8000/auth/user/)


    # extract the status
    CREATE_USER_STATUS=$(echo $CREATE_USER_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

    # print message based on status
    if [ ! $CREATE_USER_STATUS -eq 200  ]; then
        echo "Error [HTTP status: $CREATE_USER_STATUS]"
        exit 1
    else
        echo "\---------------------------------------------------------------------";
        echo "User Created";
        echo "---------------------------------------------------------------------/";
        echo "";
        echo "";
        echo "";
    fi

    # Request to login with user to get his JWT Token
    LOGIN_USER_RESPONSE=$(curl \
    -H 'Content-Type: application/json' \
    --silent \
    --write-out "HTTPSTATUS:%{http_code}" -X POST \
    --data '{"username":"usertest'"$CONTADOR"'","passwd": "temppwd"}' \
    http://localhost:8000/auth/ | jq '.jwt')

    # extract the status
    LOGIN_USER_STATUS=$(echo $LOGIN_USER_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

    # print message based on status
    if [ ! $LOGIN_USER_STATUS -eq 200  ]; then
        echo "Error [HTTP status: $LOGIN_USER_STATUS]"
        exit 1
    else
        echo "\---------------------------------------------------------------------";
        echo "usertest'"$CONTADOR"' Logged!";
        echo "---------------------------------------------------------------------/";
        echo "";
        echo "";
        echo "";

        # extract the token
        LOGGED_USER_TOKEN=$(echo $HTTP_RESPONSE | jq '.jwt')

        echo "\---------------------------------------------------------------------";
        echo "Token: $LOGGED_USER_TOKEN";
        echo "---------------------------------------------------------------------/";
        echo "";
        echo "";
        echo "";
    fi

    #json object to change password
    JSON_CHANGE_PSWD_OBJ='{"oldpasswd":"temppwd","newpasswd":"newusrpswd'$CONTADOR'"}'

    #request to change password
    CHANGE_USER_PSWD_RESPONSE=$(curl \
    -H "Content-Type:application/json" \
    -H "Connection:keep-alive" \
    -H "Authorization:Bearer '$LOGGED_USER_TOKEN'" \
    --silent \
    --write-out "HTTPSTATUS:%{http_code}" -X POST \
    --data $JSON_CHANGE_PSWD_OBJ \
    http://localhost:8000/auth/password/update/)


    # extract the status from response to change user pswd
    PSWD_USER_STATUS=$(echo $CHANGE_USER_PSWD_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

    # print message based on status
    if [ ! $PSWD_USER_STATUS -eq 200  ]; then
        echo "Error [HTTP status: $PSWD_USER_STATUS]"
        exit 1
    else
        echo "\---------------------------------------------------------------------";
        echo "usertest'"$CONTADOR"' changed his PSWD!";
        echo "---------------------------------------------------------------------/";
        echo "";
        echo "";
        echo "";
    fi

    let CONTADOR=CONTADOR+1;
done
