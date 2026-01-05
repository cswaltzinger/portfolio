# Bare Server 

This is a basic http server similar to the `python -m http.server` command.  
In addition to handeling GET methods, it also handles PUT and POST for writing files.  


# Example usage: (within this repository)
```bash 
$ ./bsrv inc 8080
Serving HTTP on :: port 8080 (http://[::]:8080/) ...
 - - - [GET /logger.h ] 200
 - - - [PUT /little.txt ] 201
 - - - [GET /little.txt ] 200
 ...
```


NOTE: chroot is used as a security mechanism for this program so it will not be able to change its root directory for the duration of its lifetime.  In the example above, the root directory is now the `./inc` directory.