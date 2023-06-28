#!/bin/bash

echo What should the version be?
read VERSION

docker build -t rhunce/lireddit:$VERSION .
docker push rhunce/lireddit:$VERSION
# TODO: I believe `docker tag rhunce/lireddit:$VERSION dokku/api:latest` is useless here and can be removed. Test this.
ssh root@159.223.98.194 "docker pull rhunce/lireddit:$VERSION && docker tag rhunce/lireddit:$VERSION dokku/api:latest && dokku git:from-image api rhunce/lireddit:$VERSION"

