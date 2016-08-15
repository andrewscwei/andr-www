#!/bin/bash

set -e

docker run -it -p 3000:3000 -v $(pwd)/app:/src/app -v $(pwd)/config:/src/config --env-file .secrets andr.mu
