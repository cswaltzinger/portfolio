#!/usr/bin/env docker build . -t csw:sec
FROM ubuntu:latest
RUN apt-get update && \
    apt-get install -y make gcc \
        netcat-openbsd \
        libgmp-dev  \
        tmux  \
        openssl && \
        rm -rf /var/lib/apt/lists/*

CMD ["bash"]