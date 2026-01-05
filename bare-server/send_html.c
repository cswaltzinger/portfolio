#include <unistd.h>
#include <string.h>

#include <fts.h>
#include "logger.h"
#include <errno.h>

int
compare_alphanumeric(const FTSENT **f1, const FTSENT **f2)
{
    if (f1 && f2) {
        return strcmp((*f1)->fts_name, (*f2)->fts_name);
    } else if (f1) {
        return 1;
    } else if (f2) {
        return -1;
    }
    return 0;
}

int 
send_html(int cfd,int dirfd,char * filename)
{

    FTS *fts_dir;
    FTSENT *fts_item;
    char * name;
    int html_pipe[2];
    int the_err;
    
    // struct stat *st = {0};
    char *paths[2];
    paths[0] = filename;
    paths[1] = 0;

    errno = 0;
    if ((fts_dir = fts_open(paths, FTS_NOCHDIR | FTS_PHYSICAL,
                            compare_alphanumeric)) == NULL) {
        
        the_err = errno;
        close(dirfd);
        return the_err;
    }
    
    if (pipe(html_pipe) < 0) {
        the_err = errno;
        fts_close(fts_dir);
        return the_err;
    }


    int write_end = html_pipe[1];

    ssize_t written = 0;
    int result = 0;
    


    result = dprintf(write_end,
                     "<html><head><title>Index of %s</title></head>\n"
                     "\t<body><h1>Index of %s </h1>\n"
                     "\t\t"
                     "<hr><pre>\n",
                     filename, filename);


    if (result < 0) {
        goto close_and_exit;
    }
    written += result;


    while ((fts_item = fts_read(fts_dir)) != NULL) {
        // skip directory traversal
        if (fts_item->fts_info == FTS_DP) {
            continue;
        }
        if (fts_item->fts_level > 0 && fts_item->fts_info == FTS_D) {
            fts_set(fts_dir, fts_item, FTS_SKIP);
        }
        name = fts_item->fts_name;
        // st = fts_item->fts_statp;
        if (name == NULL || name[0] == '.' || fts_item->fts_level == 0) {
            continue;
        }
        char *ending = fts_item->fts_info == FTS_D ? "/" : "";

        // print the filename and link
        result = dprintf(write_end, 
            // "\t\t\t"
            "<a href=\"./%s%s\">%s%s</a> <br>\n", name, ending,
                         name, ending);
        // logf("<a href=\"./%s%s\">%s%s</a> <br>", name, ending,name, ending);
        if (result < 0) {
            the_err = errno;
            goto close_and_exit;
        }

        written += result;

        // if (st == NULL) {
        //     result = dprintf(write_end, "- - <br>\n");
        //     continue;
        // } else {
        //     if(gmtime_r(st->st_mtime,&gmt_time_info))
            
        //     result = print_GMT(fsw, 0, st->st_mtime);
        //     result += fprintf(fsw, "<br>\n");
        // }

        // if (result < 0) {
        //     the_err = errno;
        //     goto close_and_exit;
        // }

        // written += result;
    }

    result = dprintf(write_end, "\t\t</pre><hr>\n\t</body>\n</html>\n");
    if (result < 0) {
        the_err = errno;
        goto close_and_exit;
    }

    written += result;

    fts_close(fts_dir);
    
    dprintf(cfd,
             "HTTP/1.1 200 ok\r\n"
             "Content-Type: text/html\r\n"
             "Content-Length: %ld\r\n"
             "Connection: close\r\n"
             "\r\n",written);

    close(html_pipe[1]);
    char buf[BUFSIZ];
    
    while((written = read(html_pipe[0],buf,BUFSIZ)) == BUFSIZ){
        write(cfd,buf,written);
    }
    if(written > 0){
        write(cfd,buf,written);
    }

    close(html_pipe[0]);
    // logf("finished writing");
    return 0;

close_and_exit:
    close(html_pipe[0]);
    close(html_pipe[1]);
    fts_close(fts_dir);
    if (result < 0) {
        return -1;
    }
    return 0;
}