#!/bin/sh

# Hard-code the path since I can't work out how to pass it in using docker-entrypoint.d in the nginx container
# Completly hardcoded in commands since I can't get variable substitution working....
output_dir=`/usr/share/nginx/html`

echo "window.env = {" >> /usr/share/nginx/html/window.js

env_vars=`env | grep VITE_`

echo "[env]: Checking for env variables"

for env_key_val in $env_vars; do
  parsed=`echo "$env_key_val" | sed 's/=/: "/g'`
  withQuotes=`echo $parsed\", `
  echo $withQuotes >> /usr/share/nginx/html/window.js

  echo "[env]: Adding $env_key_val"
done

echo "}" >> /usr/share/nginx/html/window.js

echo "[env]: Finished"

