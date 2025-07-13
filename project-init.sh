#!/bin/bash

set -e

echo "Installing and generating Prisma in root..."
npm install

echo "Moving to libs/db..."
cd libs/db
npm install
npx prisma generate

echo "Moving to apps/gateway..."
cd ../../apps/gateway
npm install

echo "Moving to apps/collector-fb..."
cd ../collector-fb
npm install
npx prisma generate

echo "Moving to apps/collector-ttk..."
cd ../collector-ttk
npm install
npx prisma generate

echo "Moving to apps/reporter..."
cd ../reporter
npm install
npx prisma generate

echo "Done!"
