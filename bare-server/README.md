# Bare Server 

This is a basic http server similar to the `python -m http.server` command.  
In addition to handeling GET methods, it also handles PUT and POST for writing files.  


# Example usage: (within this repository)

---

![Gif](demo.gif)

---


NOTE: chroot is used as a security mechanism for this program so it will not be able to change its root directory for the duration of its lifetime.  In the example above, the root directory is now the `./inc` directory.