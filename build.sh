#!/bin/sh
npm run build
rm -rf docs
mv build docs
