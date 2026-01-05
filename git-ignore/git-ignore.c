#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>
const char * DEFAULT_IGNORE_FILENAME = "./.gitignore";


enum IGNORE_MODE {
    IGNORE,
    UNIGNORE,
};
int usage(){
    fprintf(stderr,
        "Usage: add files to $GIT_IGNORE_FILE (default to ./.gitignore) for git to ignore\n"
        "git ignore --list                equivilent to `/bin/sh -c 'find . -name .gitignore'`\n"
        "git ignore [-p|--print] ...      redirect output to stdout instead of to ./.gitignore file\n\n"
        "git ignore [--unignore | --ignore] [-i|-u|-l]<file> [-i|-u|-l] <file> ...\n"
        "\t [--unignore | --ignore]       set the ignore mode for subsequent files\n"
        "\t [-u|-i]<file>                 ignore or unignore <file> regardless of mode\n"
        "\t [-u|-i]<file>                 ignore or unignore <file> regardless of mode\n"
        "\t [-l]<file>                    ignore literal file (used when files start with a flag in this command)\n"
        "\t                               not needed when [-u|-i]<file> is specified\n"
    );
    return 0;
}

FILE * get_ignore_file(char * first_arg){
    char * ignore_file_name;
    if(strcmp(first_arg,"--print") == 0 || strcmp(first_arg,"-p") == 0){
        return stdout;
    }
    ignore_file_name = getenv("GIT_IGNORE_FILE");
    if(ignore_file_name){
        return  fopen(ignore_file_name,"a");
    }
    return  fopen(DEFAULT_IGNORE_FILENAME,"a");
}


int writeignore(FILE* f, char * name,enum IGNORE_MODE mode){
     return fprintf(f,"%s%s\n",
            mode == UNIGNORE ? "!" : "",
            name
        );
}



int main(int argc, char* argv[]){

    
    FILE * ignore_file;
    enum IGNORE_MODE mode;
    if (argc == 1){
        return usage();
    }
    if (argc == 2){
        if(strcmp(argv[1],"-h") == 0 || strcmp(argv[1],"--help")==0  ){
            return usage();
        }
        if( strcmp(argv[1],"--list") == 0  ){
            return execl("/bin/sh","sh","-c","find . -name .gitignore",(char *)0);
        }
    }

    ignore_file = get_ignore_file(argv[1]);
    mode = IGNORE;

    //ignores first program name 
    for(int i = ignore_file == stdout ? 2 : 1; i <  argc; i++){
        char * name = argv[i];
        int len = strlen(name);
        if(len == 0){
            continue;
        }
        if(name[0] != '-'){
            goto default_write;
        }
        if(len >= 2){
            if(name[1] == '-'){
                // not a file, but a mode specifier
                if(strncmp(name,"--unignore",len) == 0){
                    mode = UNIGNORE;
                    continue;
                }else if(strncmp(name,"--ignore",len) == 0){
                    mode = IGNORE;
                    continue;
                }else{
                    goto default_write;
                }
            }else{
                //do this operation for a single file 
                if(strncmp(name,"-u",2) == 0){
                    if(len > 2){
                        writeignore(ignore_file,name+2,UNIGNORE);
                    }else{
                        writeignore(ignore_file,argv[i+1],UNIGNORE);
                        i++;
                    }
                    continue;
                }else if(strncmp(name,"-i",2) == 0){
                    if(len > 2){
                        writeignore(ignore_file,name+2,IGNORE);
                    }else{
                        writeignore(ignore_file,argv[i+1],IGNORE);
                        i++;
                    }
                    continue;
                }else if(strncmp(name,"-l",2) == 0 ){
                    //literal file that shares the same start with flag
                    if(len > 2){
                        writeignore(ignore_file,name+2,mode);
                    }else{
                        writeignore(ignore_file,argv[i+1],mode);
                        i++;
                    }
                    continue;
                }else{
                    goto default_write;
                }

            }
        }

        default_write:
        writeignore(ignore_file,name,mode);
            
    }

    if(ignore_file != stdout){
        fclose(ignore_file);
    }

    return 0;
    
}