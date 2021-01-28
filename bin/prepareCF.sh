#!/bin/sh
CLOUDFLARED_IMAGE="kristianfoss/programs-cloudflared:cloudflared-main-scratch"
CLOUDFLARED_DATA="ts-smarthome-cfdata"

docker volume create ${CLOUDFLARED_DATA}

docker run -it --rm -v ${CLOUDFLARED_DATA}:/tmp/data alpine touch /tmp/data/helloWorld
docker run -it --rm -v ${CLOUDFLARED_DATA}:/tmp/data alpine chown -R 1000:1000 /tmp 

docker run -it --rm -v ${CLOUDFLARED_DATA}:/nonexistent/.cloudflared ${CLOUDFLARED_IMAGE} tunnel login