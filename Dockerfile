# Base image: Ruby with necessary dependencies for Jekyll
FROM ruby:3.2

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy Gemfile into the container for dependency installation.
# This repository does not currently track a Gemfile.lock.
COPY Gemfile ./
COPY docker-entrypoint.sh ./

# Install bundler and dependencies
RUN gem install bundler:2.3.26 && bundle install

# Ensure entrypoint is executable
RUN chmod +x /usr/src/app/docker-entrypoint.sh

# Expose port 4000 for Jekyll server
EXPOSE 4000

# Run bundler on container startup to satisfy platform-specific gems
CMD ["sh", "./docker-entrypoint.sh"]
