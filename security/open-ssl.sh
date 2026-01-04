#!/bin/bash

PRIVATE_KEY_FILE="private_key.pem"
PUBLIC_KEY_FILE="public_key.pem"

KEY_SIZE=2048

init(){
    for item in $(seq 10); do 
        echo "$item : $RANDOM : " >> input.txt
    done

    ln -s ../open-ssl.sh ./util
    keypair
}
clean(){
    rm -f *.pem
    rm -f *.txt
    rm -f *.bin
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
        ENCRYPTED_FILE="encrypted_file.bin"

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
        ENCRYPTED_FILE="encrypted_file.bin"
        DECRYPTED_FILE="decrypted_file.txt"

        openssl pkeyutl -decrypt -inkey "${PRIVATE_KEY_FILE}" -in "${ENCRYPTED_FILE}" -out "${DECRYPTED_FILE}"
    }
    input(){
        # openssl enc -d -aes-256-cbc -in encrypted_message.enc -pass "pass:$@"
        openssl enc -d -aes-256-cbc -pass "pass:$@"
    }
    $@
}

hash(){
    echo $@ | openssl dgst -sha256 -binary
}

$@