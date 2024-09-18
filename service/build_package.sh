#!/bin/bash
# build_package.sh

# Load metadata from YAML
metadata_file="package_metadata.yml"

name=$(yq eval '.name' $metadata_file)
version=$(yq eval '.version' $metadata_file)
description=$(yq eval '.description' $metadata_file)
maintainer=$(yq eval '.maintainer' $metadata_file)
url=$(yq eval '.url' $metadata_file)
license=$(yq eval '.license' $metadata_file)
#dependencies=$(yq eval '.dependencies | join(", ")' $metadata_file)

# Build the .deb package
fpm -s dir -t deb \
  -n "$name" \
  -v "$version" \
  --description "$description" \
  --maintainer "$maintainer" \
  --url "$url" \
  --license "$license" \
  --depends "$dependencies" \
  --prefix /usr/local/bin \
  ./pgc

# Build the .rpm package
fpm --verbose \
  -s dir -t rpm \
  -n "$name" \
  -v "$version" \
  --description "$description" \
  --maintainer "$maintainer" \
  --url "$url" \
  --license "$license" \
  --rpm-os linux \
  --architecture x86_64 \
  --prefix /usr/local/bin \
  ./pgc \



