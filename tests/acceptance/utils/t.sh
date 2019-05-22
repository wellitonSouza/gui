#!/bin/bash
echo “Test”
for i in $(seq 1 1);
    do
        echo “$i”
        docker run   --rm  --env DOJOT_HOST=http://10.202.71.108:8000 --env  USERNAME=admin --env MQTT_HOST=http://10.202.71.108   -v $PWD:/tests codeception/codeceptjs codeceptjs --config=/tests/acceptance/custom.conf.js run --grep "ManyTenants"  &
    done


