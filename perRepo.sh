#!/bin/bash

cat results.csv | sed "s/, /~/" | sed "s/^.*~//" | sed "s/, /\//" | sed "s/,.*$//" | tr -d "\"" | sort | uniq -c | sort -rn
