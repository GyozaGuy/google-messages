#!/usr/bin/env bash

cd dist

for dir in *; do
  if [ -d "${dir}" ]; then
    if [ -f "${dir}".tar.gz ]; then
      rm "${dir}".tar.gz
    fi

    tar zcf "${dir}".tar.gz "${dir}"/*
  fi
done
