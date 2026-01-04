
CC=gcc 
CFLAGS=-Wall -Werror #-DDEBUG
TARGET=git-ignore
TESTER=./$(TARGET) --print

.PHONY: all
all: clean $(TARGET)


ignore: $(TARGET)

$(TARGET): git-ignore.c 
	$(CC) $(CFLAGS) git-ignore.c -o $(TARGET)

clean:
	/bin/rm -rf git-ignore .giti* giti* .git-* *.o

test: all
	@printf ":::\t"
	$(TESTER)  --unignore not\ ignored -i ignored "not ignored again" --ignore ignore1 ignore2 
	@printf "\n\n"

	@printf ":::\t"
	$(TESTER)  --ignore not\ ignored -unot_ignored " ignored again" ignore1 ignore2 
	@printf "\n\n"

	@printf ":::\t"
	$(TESTER)  ignored -i ignored "ignored again" --ignore ignore1 ignore2 
	@printf "\n\n"

	@printf "testing if uses env ignore file:::\t"
	GIT_IGNORE_FILE=ignore ./$(TARGET)  ignored -i ignored "ignored again" --ignore ignore1 ignore2 
	@[ -f ignore ] && echo Ignore file exists!! || echo ignore file does not exist
	-@ rm ignore