#!/bin/bash

cat results.csv | sed "s/,.*$//" | sort | uniq -c | sort -nr | tr -d "\""
