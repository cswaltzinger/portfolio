# Git Ignore extension

This is a basic git extension that writes to the `./.gitignore` file from the cli.

To use this extension with git, you need to compile the program using `make` and then put the `git-ignore` executable somewhere in your  `$PATH`.


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


### Full usage as follows:
```
Usage: add files to $GIT_IGNORE_FILE (default to ./.gitignore) for git to ignore
git ignore --list                equivilent to `/bin/sh -c 'find . -name .gitignore'`
git ignore [-p|--print] ...      redirect output to stdout instead of to ./.gitignore file

git ignore [--unignore | --ignore] [-i|-u|-l]<file> [-i|-u|-l] <file> ...
         [--unignore | --ignore]       set the ignore mode for subsequent files
         [-u|-i]<file>                 ignore or unignore <file> regardless of mode
         [-l]<file>                    ignore literal file (used when files start 
                                       with a flag in this command)
                                       not needed when [-u|-i]<file> is specified
```

