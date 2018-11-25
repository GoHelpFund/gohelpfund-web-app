#!/bin/sh

echo "********************************************************"
echo "Waiting for the ssl to generate"
echo "********************************************************"

openssl aes-256-cbc -d -in /etc/nginx/gohelpfund.com.crt.enc -out /etc/nginx/gohelpfund.com.crt -K $OPENSSL_KEY -iv $OPENSSL_IV
openssl aes-256-cbc -d -in /etc/nginx/gohelpfund.com.key.enc -out /etc/nginx/gohelpfund.com.key -K $OPENSSL_KEY -iv $OPENSSL_IV

echo "******* SSL created"

echo "********************************************************"
echo "NGINX starting"
echo "********************************************************"

nginx -g "daemon off;"
