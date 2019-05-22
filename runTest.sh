#!/bin/bash

#param 1: number of users
NUMBER_USER=$1 || 2

#param 2: dojot host. Eg: http://localhost:8000 OR http://10.202.71.108:8000
DOJOT_HOST=$2 || 'http://localhost:8000'

#param 3: dojot mqtt host. Eg: http://localhost
MQTT_HOST=$3 || 'http://localhost'

#param 4: profile/group of users Eg.: user
PROFILE=$4 || 'user'

echo "Create users."
sh ./tests/acceptance/utils/create_user_loop.sh ${NUMBER_USER} ${DOJOT_HOST} ${PROFILE}
echo "Finish create users."

echo "Iniciate all tests."
for i in $(seq 1 ${NUMBER_USER});
    do
        echo "Test ${i} iniciate"
        docker run   --rm  \
        -e USERNAME=usertest${i} \
        -e PASSWORD=newusrpswd${i} \
        -e TENANT=usertest${i}  \
        -e DOJOT_HOST=${DOJOT_HOST} \
        -e MQTT_HOST=${MQTT_HOST} \
        -v $PWD:/tests \
        codeception/codeceptjs codeceptjs \
        --config=tests/acceptance/custom.conf.js run --grep "ManyTenants"  &
    done

