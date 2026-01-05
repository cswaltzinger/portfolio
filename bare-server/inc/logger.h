#ifndef LOGGER_H
    #define LOGGER_H

    #include <stdlib.h>
    #include <stdio.h>
    #include <stdarg.h>

    
    #ifdef DEBUG
        void my_log(const char *, ...);
        #define logf  my_log
    #else 
        #define my_log(...)
        #define logf(...)  
    #endif

#endif