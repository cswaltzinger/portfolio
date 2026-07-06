#!/usr/local/bin/docker build . -t csw:sec

FROM ubuntu:latest
RUN apt-get update && \
    apt-get install -y make gcc \
        netcat-openbsd \
        gcc \
        make \ 
        libgmp-dev  \
        tmux  \
        tshark \
        openssl && \
        rm -rf /var/lib/apt/lists/*

CMD ["tmux"]
