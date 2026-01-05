#include "logger.h"

//basic debug print
#ifdef DEBUG    
void 
my_log(const char *fmt, ...)
{
        va_list args;
        va_start(args, fmt);
        int ret = vfprintf(stderr, fmt, args);
        va_end(args);
        ret += fprintf(stderr,"\n");
        fflush(stderr);
}
#endif