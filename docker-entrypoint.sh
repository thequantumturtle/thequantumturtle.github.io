#!/usr/bin/env sh
set -e

bundle check >/dev/null 2>&1 || bundle install

# Clear cached site output so config changes take effect.
bundle exec jekyll clean

exec bundle exec jekyll serve --host 0.0.0.0 --config _config.yml,_config_local.yml --watch
