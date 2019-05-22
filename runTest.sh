#!/bin/bash

#param 1: token JWT
[[ ! -z "$1" ]] && JWT=$1 || JWT=''

#param 2: initial range of user
[[ ! -z "$2" ]] && RANGE_USERS_INIT=$2 || RANGE_USERS_INIT=1

#param 3: end range of user
[[ ! -z "$3" ]] && RANGE_USERS_END=$3 || RANGE_USERS_END=3

#param 4: dojot host. Eg:  http://10.202.71.108:8000
[[ ! -z "$4" ]] && DOJOT_HOST=$4 || DOJOT_HOST='http://10.202.71.108:8000'

#param 5: dojot mqtt host. Eg: http://10.202.71.108
[[ ! -z "$5" ]] && MQTT_HOST=$5 || MQTT_HOST='http://10.202.71.108'

#param 6: profile/group of users Eg.: user
[[ ! -z "$6" ]] && PROFILE=$6 || PROFILE='user'

echo "Create users."
sh ./tests/acceptance/utils/create_user_loop.sh ${RANGE_USERS_END} ${DOJOT_HOST} ${PROFILE}
echo "Finish create users."

echo "Iniciate all tests."
for i in $(seq ${RANGE_USERS_INIT} ${RANGE_USERS_END});
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

