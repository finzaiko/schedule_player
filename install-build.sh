#!/bin/bash

IP_ADDRESS=$(hostname  -I | cut -f1 -d' ')
echo "IP_ADDRESS=$IP_ADDRESS"
sed -i 's,http://localhost:3000,'http://${IP_ADDRESS##}:3000',g' 'public/assets/myapp.js'
echo "Ok, setup done'