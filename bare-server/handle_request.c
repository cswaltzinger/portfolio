#include <stdio.h>
#include <fcntl.h>
#include <limits.h>

#include <sys/stat.h>
#include <sys/sendfile.h>

#include "send_html.c"

struct client_req_t {
    int cfd;
    char * addr_str;
    union {
        char * req_line;
        char * raw;
    };
    ssize_t size;

    char * method;
    char * uri;

    char * headers;
    char * body;  
};



void send_headers(
    struct client_req_t req, 
    const char *status_code, 
    const char *content_type,
    int content_length
){

    int client_socket = req.cfd;
    if(client_socket < 0){
        return;
    }
    if(status_code){
         dprintf(client_socket, "HTTP/1.1 %s\r\n",status_code);
    }else{
        return;
    }
    if(content_type){
        dprintf(client_socket,"Content-Type: %s\r\n", content_type);
    }
    if(content_length >= 0){
        dprintf(client_socket,"Content-Length: %d\r\n", content_length);
    }
    dprintf(client_socket, "Connection: close\r\n\r\n");
    //::ffff:127.0.0.1 - - [05/Jan/2026 15:32:11] "GET / HTTP/1.1" 200 -
    fprintf(stderr,"%s - - - [%s %s ] %c%c%c\n",
        req.addr_str,
        req.method,
        req.uri,
        status_code[0],
        status_code[1],
        status_code[2]
    );
    fflush(stderr);


}

void send_response(
    struct client_req_t req, 
    const char *status_code, 
    const char *content, 
    const char *content_type
) {
    logf("sending response");
    int client_socket = req.cfd;
    int content_length = content ? strlen(content) : 0;
    // Format the HTTP headers
    /*
    dprintf(client_socket,
             "HTTP/1.1 %s\r\n"
             "Content-Type: %s\r\n"
             "Content-Length: %d\r\n"
             "Connection: close\r\n"
             "\r\n",
             status_code, content_type, content_length);
             */
    send_headers(req,status_code,content_type,content_length);
    if (content) {
        write(client_socket, content, content_length);
    }
}

void handle_GET(struct client_req_t req){

    int client_socket = req.cfd;
    char * filename = req.uri;
    #ifdef DEBUG
        const char * SLEEP_URI = "/sleep";
        if(strncmp(filename,SLEEP_URI,strlen(SLEEP_URI)) == 0){
            sleep(3);
            filename += strlen(SLEEP_URI);
            logf(filename);

        }

    #endif

    int fd = open(filename, O_RDONLY);
    int written ;
    struct stat st = {0};

    if (fd < 0) {
        perror("open failed");
        send_response(req, "404 Not Found", "File not found.", "text/plain");
        return;
    }

    if (fstat(fd, &st) == -1) {
        perror("couldnt get contents");
        close(fd);
        return ;
    }

    if((st.st_mode & S_IFMT )== S_IFDIR){
        send_html(client_socket,fd,filename);
        close(fd);
        return ;
    }

    send_headers(req,"200 ok","text/plain",st.st_size);
    do{
        written = sendfile(client_socket, fd, 0, BUFSIZ);

    }while(written == BUFSIZ);
    close(fd);
}
void show_request(char * request_buffer,ssize_t valread){
    int i = 0 ;
    while( i < valread && request_buffer[i] != '\0'){
        if(request_buffer[i] == '\r')
            fprintf(stderr,"\\r");
        else if(request_buffer[i] == '\n')
            fprintf(stderr,"\\n\n");
        else
            fprintf(stderr,"%c",request_buffer[i]);
        i++;
    }
}


void handle_request(char* addr,int client_socket) {
    char request_buffer[BUFSIZ] = {0};
    ssize_t valread;

    valread = read(client_socket, request_buffer, BUFSIZ);
    if (valread <= 0) {
        close(client_socket);
        return;
    }
    
    logf("\tReceived %ld bytes", valread);
    
    if(0){
        show_request(request_buffer,valread);
    }
    
        
    

    // Null-terminate the buffer
    request_buffer[valread] = 0;
    char method[10];
    char uri[PATH_MAX ]; 
    // URI can be longer than final file path
    char *body_start = NULL;
    sscanf(request_buffer, "%9s %499s", method, uri);

    struct client_req_t req ={
        .cfd = client_socket,
        .addr_str = addr,
        .raw = request_buffer,
        .size = valread,
        .body = 0,
        .headers = 0,
        .method = method,
        .uri = uri 
    };

    // Only process PUT and POST
    if (strcmp(method, "PUT") != 0 && strcmp(method, "POST") != 0 && strcmp(method, "GET") != 0) {
        send_response(req, 
            "405 Method Not Allowed", 
            "Only PUT and POST are supported.",
            "text/plain");
        return;
    }

    if(strcmp(method, "GET") ==0){
        handle_GET(req);
        return;
    }

    

    // --- 2. Parse Headers to find Content-Length and Body Start ---
    body_start = request_buffer;
    while(strncmp(body_start, "\r\n\r\n", 4) != 0 && *body_start != '\0'){
        body_start++;
    }
    // Find the end of headers (empty line: "\r\n\r\n")
    // body_start = strstr(request_buffer, "\r\n\r\n");

    if (*body_start == '\0') {
        send_response(req, "400 Bad Request", "could not find start of body", "text/plain");
        return;
    }
    body_start += 4; // Move past "\r\n\r\n"
    logf("\n\n%s\n\n",body_start);
    req.body = body_start;

    


    // --- 4. Write Data to File ---
    logf("Writing to file: %s", uri);

    int fd = open(uri, O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (fd < 0) {
        perror("open failed");
        send_response(req, "500 Internal Server Error", "Could not open file for writing.", "text/plain");

        return;
    }


    /*
    struct stat st = {0};
    if (fstat(fd, &st) == -1) {
        perror("fstat");
        send_headers(req,"200 ok","text/plain",-1);
    }else{
        send_headers(req,"200 ok","text/plain",st.st_size);
    }
        */

    int written = write(fd, body_start, strlen(body_start));
    // Write the part of the body that was already read
    int max = 20;
    do{
        written = sendfile(fd, client_socket, 0, BUFSIZ);
    }while(written == BUFSIZ && max--);
    close(fd);



    // --- 5. Send Success Response ---
    send_headers(req, "201 Created", "text/plain", 100);
    written = dprintf(client_socket,"Successfully stored %d bytes to file: %s",written,uri);
    while(100 - written > 0){
        written+=dprintf(client_socket," ");
    }
}

