CC=gcc 
CFLAGS=-Iinc --std=gnu99 -Wall -Werror -Wextra  #-DDEBUG

%.o: %.c 
	$(CC) -c $(CFLAGS) $^ -o $@

.PHONY: bsrv clean

bsrv: logger.o handle_request.o main.c
	$(CC) $(CFLAGS) $^ -o bsrv -static
	
run: clean bsrv
	@clear
	@./bsrv


clean:
	rm -f ./dsym *.o bsrv