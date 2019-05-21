#!/bin/bash
echo “Test”
for i in $(seq 1 10);
    do
        echo “$i”
        docker run   --rm  --env DOJOT_HOST=http://iotmid03.cpqd.com.br:8000 --env  USERNAME=admin --env MQTT_HOST=https://iotmid03.cpqd.com.br   -v $PWD:/tests codeception/codeceptjs codeceptjs --config=tests/acceptance/custom.conf.js run --grep "Para"  &
    done


