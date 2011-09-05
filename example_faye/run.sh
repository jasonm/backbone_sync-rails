#!/usr/bin/env bash
BASEDIR=$(dirname $0)
BUNDLE_GEMFILE=$BASEDIR/Gemfile bundle exec rackup $BASEDIR/config.ru -s thin -E production
