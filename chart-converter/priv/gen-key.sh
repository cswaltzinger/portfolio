#!/bin/bash

### 2048 key (not AES)
###openssl req -nodes -new -x509 -keyout server.key -out server.cert
### read key
### openssl x509 -in server.cert -text -noout 
openssl req -x509 -nodes -newkey ec:<(openssl ecparam -name secp384r1) \
  -keyout server.key \
  -out server.cert \
  -days 365 \
  -sha384