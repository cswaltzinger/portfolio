#!/bin/bash

PRIVATE_KEY_FILE="private_key.pem"
PUBLIC_KEY_FILE="public_key.pem"

KEY_SIZE=2048

## initialize a public/private keypair
init(){
    for item in $(seq 10); do 
        echo "$item : $RANDOM : " >> input.txt
    done

    ln -s ../open-ssl.sh ./util
    keypair
}

## remove a public/private keypair, input texts, excrypted files, decrypted files 
clean(){
    rm -f *.pem *.txt *.enc *.decr
    if [ -f "util" ]; then
        rm util
    fi

}

keypair(){
    # generates an RSA public/private key pair using OpenSSL.
    # add a passphrase to the private key
    #    You will be prompted to enter and verify a passphrase.
    # openssl genrsa -aes256 -out "${PRIVATE_KEY_FILE}" "${KEY_SIZE}" < $(echo password;echo password)


    openssl genrsa -out "${PRIVATE_KEY_FILE}" "${KEY_SIZE}"

    openssl rsa -in "${PRIVATE_KEY_FILE}" -pubout -out "${PUBLIC_KEY_FILE}"
}

encrypt(){
    file(){
         # encrypts a file using the public key.
        INPUT_FILE="input.txt"
        ENCRYPTED_FILE="$INPUT_FILE.enc"
        openssl pkeyutl -encrypt -pubin -inkey "${PUBLIC_KEY_FILE}" -in "${INPUT_FILE}" -out "${ENCRYPTED_FILE}"

    }
    input(){
        # openssl enc -aes-256-cbc -out encrypted_message.enc -pass "pass:$@"
        openssl enc -aes-256-cbc -pass "pass:$@"
    }
    $@
}

decrypt(){
    file(){
        # decrypts a file using the private key.
        INPUT_FILE="input.txt"
        ENCRYPTED_FILE="$INPUT_FILE.enc"
        DECRYPTED_FILE="$ENCRYPTED_FILE.decr"

        openssl pkeyutl -decrypt -inkey "${PRIVATE_KEY_FILE}" -in "${ENCRYPTED_FILE}" -out "${DECRYPTED_FILE}"
    }
    input(){
        # openssl enc -d -aes-256-cbc -in encrypted_message.enc -pass "pass:$@"
        openssl enc -d -aes-256-cbc -pass "pass:$@"
    }
    $@
}

## get a quick sha256 hash of the input 
hash(){
    if [ -z "$@" ];then 
        cat /dev/stdin | openssl dgst -sha256 -binary
    else 
        echo $@ | openssl dgst -sha256 -binary
    fi
}

$@