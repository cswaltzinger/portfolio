#include "main.h"
#include "logger.h"


int init_bound_socket(
    int * ,
    struct sockaddr_storage *,
    socklen_t*
);
void sprint_serving_info( char** ip_str,struct sockaddr *addr, int port);

int main(int argc, char *argv[]) {
    int server_fd, new_socket;
    struct sockaddr_storage address;
    socklen_t addrlen = sizeof(address);
    // int opt = 1;

    if(signal(SIGCHLD, SIG_IGN) == SIG_ERR){
        perror("could not ignore signals");
        exit(EXIT_FAILURE);
    }
    

    if(argc ==2){
        root_dir = argv[1];
    }else if (argc == 3){
        root_dir = argv[1];
        PORT = atoi(argv[2]);
    }else if (argc > 3){
        fprintf(stderr, "Usage: %s [root_directory] [port]\n", argv[0]);
        exit(EXIT_FAILURE);
    }

    // Change working directory to root_dir
    if(chroot(root_dir) != 0){
        perror("chroot failed");
        exit(EXIT_FAILURE);
    }


    if((server_fd = init_bound_socket(&PORT,&address,&addrlen)) < 0){
        exit(EXIT_FAILURE);
    }

    if (listen(server_fd, 10) < 0) {
        perror("listen failed");
        close(server_fd);
        exit(EXIT_FAILURE);
    }


    logf("--- Simple C HTTP File Server ---");
    logf("Listening on port %d\n", PORT);
    logf("Files will be stored in the root directory.\n");

    sprint_serving_info(0,(struct sockaddr *)&address,PORT);
    struct sockaddr_storage client_addr;
    socklen_t client_addr_len = sizeof(struct sockaddr_storage);
    // Main loop to accept and handle connections
    while (1) {
        logf("Waiting for a connection...");
        memset(&client_addr,0,sizeof(struct sockaddr_storage));
        new_socket = 0;
        if ((new_socket = accept(server_fd, (struct sockaddr *)&client_addr,&client_addr_len)) < 0) {
            perror("accept failed");
            close(server_fd);
            exit(0);
            continue; 
        }



        if(fork()){
            // parent process
            close(new_socket);
        }else{
            //child process
            char ip_str[INET6_ADDRSTRLEN] = {0};
                sprint_serving_info((char**)&ip_str,(struct sockaddr *)&client_addr,htons(((struct sockaddr_in6 *)&client_addr)->sin6_port));
            handle_request(ip_str,new_socket);
            close(new_socket);
            close(server_fd);
            exit(0);
        }
    }

    // Should not be reached, but good practice
    close(server_fd);
    return 0;
}



void sprint_serving_info( char** ip_str,struct sockaddr *addr, int port) {
    char ip_str2[INET6_ADDRSTRLEN];
    
    if(ip_str == 0){
        ip_str = (char**)&ip_str2;
    }
    if (addr->sa_family == AF_INET6 || 1) {
        // Handle IPv6
        struct sockaddr_in6 *addr6 = (struct sockaddr_in6 *)addr;
        const char * result = inet_ntop(AF_INET6, &(addr6->sin6_addr), *ip_str, sizeof(*ip_str));
        
        if(result == 0){
            // perror("could not get str");
            return;
        }
        if(ip_str == (char**)&ip_str2){
            printf("Serving HTTP on %s port %d (http://[%s]:%d/) ...\n", *ip_str, port, *ip_str, port);
        }
    } else {
        // Handle IPv4
        struct sockaddr_in *addr4 = (struct sockaddr_in *)addr;
        const char * result = inet_ntop(AF_INET, &(addr4->sin_addr), *ip_str, sizeof(*ip_str));

        if(result == 0){
            // perror("could not get str");
            return;
        }
        if(ip_str == (char**)&ip_str2 ){
            printf("Serving HTTP on %s port %d (http://%s:%d/) ...\n", *ip_str, port, *ip_str, port);
        }
        // 
    }
}

int
init_bound_socket(
    int * portp,
    struct sockaddr_storage * sin,
    socklen_t* addrlen
)
{
    int sock;
    int port = (portp && *portp > 0 )? *portp : 0 ;
    port = htons(port);
    struct sockaddr_in6 *sin6;
    


    if ((sock = socket(PF_INET6, SOCK_STREAM, 0)) < 0) {
        perror("cannot open stream socket");
        return -1;
    }
    int opt=1;
    if (setsockopt(sock, SOL_SOCKET, SO_REUSEADDR | SO_REUSEPORT, &opt, sizeof(opt))) {
        perror("setsockopt");
        close(sock);
        exit(EXIT_FAILURE);
    }
    sin6 = (struct sockaddr_in6 *)sin;
    *addrlen = sizeof(*sin6);

    sin6->sin6_family = PF_INET6;
    sin6->sin6_addr =  in6addr_any;
    sin6->sin6_port = port;

    

    if (bind(sock, (struct sockaddr *)sin6, *addrlen) != 0){
        perror("failed to bind socket");
        return -1;
    }

    if(portp){
        *portp = htons(sin6->sin6_port);
    }

    return sock;
}