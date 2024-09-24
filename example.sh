#!/bin/bash

FILE_NAME="new_malicous_file.txt"
FILE_CONTENT="Hello, this is a new file created by a shell script. It demonstrates a vulnerabilty"

echo "$FILE_CONTENT" > "$FILE_NAME"

if [ -f "$FILE_NAME" ]; then
    echo "File '$FILE_NAME' created successfully with content:"
    cat "$FILE_NAME"
else
    echo "Failed to create file '$FILE_NAME'."
fi
