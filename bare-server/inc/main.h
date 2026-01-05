#ifndef MAIN_H
    #define MAIN_H
    #include <dirent.h>
    #include <errno.h>
    #include <fcntl.h>
    #include <fts.h>
    #include <netinet/in.h>
    #include <arpa/inet.h>

    #include <signal.h>
    #include <stdio.h>
    #include <stdlib.h>
    #include <string.h>

    #include <sys/sendfile.h>
    #include <sys/socket.h>
    #include <sys/stat.h>
    #include <unistd.h>

    #define BUFFER_SIZE 4096
    #define MAX_PATH_LEN 256

    int PORT = 8080;
    char* root_dir = ".";

    void handle_request(char* addr, int client_socket);
#endif