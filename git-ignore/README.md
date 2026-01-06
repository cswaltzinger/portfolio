# Git Ignore extension

This is a basic git extension that writes to the `./.gitignore` file from the cli.

To use this extension with git, you need to compile the program using `make` and then put the `git-ignore` executable somewhere in your  `$PATH`.

---

## Example Usage 

![Gif](./demo.gif)

## Example Usage 
(assuming git-ignore is in $PATH)

```bash
$ git ignore makefile main.h -uhello.txt --unignore bye.txt -i3.c
$ cat .gitignore
makefile
main.h
!hello.txt
!bye.txt
3.c
```


