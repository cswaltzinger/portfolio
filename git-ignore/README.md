# Git Ignore extension

This is a basic git ignore extension that writes to the `.gitignore` file from the cli.

Usage as follows
```
Usage: add files to $GIT_IGNORE_FILE (default to ./.gitignore) for git to ignore
git ignore --list                equivilent to `/bin/sh -c 'find . -name .gitignore'`
git ignore [-p|--print] ...      redirect output to stdout instead of to ./.gitignore file

git ignore [--unignore | --ignore] [-i|-u|-l]<file> [-i|-u|-l] <file> ...
         [--unignore | --ignore]       set the ignore mode for subsequent files
         [-u|-i]<file>                 ignore or unignore <file> regardless of mode
         [-u|-i]<file>                 ignore or unignore <file> regardless of mode
         [-l]<file>                    ignore literal file (used when files start with a flag in this command)
                                       not needed when [-u|-i]<file> is specified
```