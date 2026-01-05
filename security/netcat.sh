#!/bin/bash
 
## use basic GET requests to query a host and port 
web(){
    get(){
        local url="${1:-localhost}"
        local port="${2:-80}"
        local loc="${3:-/}"
        echo -e "GET $loc HTTP/1.1\r\nHost: $url\r\nConnection: close\r\n\r\n" | nc "$url" "$port"
    }
    $@
}

## use basic mqtt requests follow and/or publish content 
mqtt(){

    follow(){
        local broker="${1:-localhost}"
        local port="${2:-1883}"
        
        echo -e "CONNECT mqtt\r\n" | nc "$broker" "$port"
    }

    publish(){
        local broker="${1:-localhost}"
        local port="${2:-1883}"
        local topic="$2"
        local message="$3"
        
        echo -e "PUBLISH $topic\r\n$message\r\n" | nc "$broker" "$port"
    }
    $@

}





$@