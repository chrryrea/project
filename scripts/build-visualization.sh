#!/bin/bash

cd ../endangered-species-vis-master
npm install
npm run build
cd ../portfolio

# Copy the built visualization to public directory
mkdir -p public/visualization
cp -r ../endangered-species-vis-master/public/* public/visualization/
