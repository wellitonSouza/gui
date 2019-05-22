#!/bin/bash
echo "This script is about to run another script."
#sh ./tests/acceptance/utils/create_user_loop.sh 3
echo "This script has just run another script."
for i in $(seq 1 1);
    do
        echo “$i”
        docker run   --rm  \
        -e USERNAME=usertest${i} \
        -e PASSWORD=newusrpswd${i} \
        -e TENANT=usertest${i}  \
        -e DOJOT_HOST=http://10.202.71.108:8000 \
        -e MQTT_HOST=http://10.202.71.108 \
        -v $PWD:/tests \
        codeception/codeceptjs codeceptjs \
        --config=tests/acceptance/custom.conf.js run --grep "ManyTenants"  &
    done


