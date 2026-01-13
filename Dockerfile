FROM ruby:3.3-slim

RUN apt-get update -y && apt-get install -y --no-install-recommends \
  build-essential \
  git \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /site

ENV BUNDLE_PATH=/usr/local/bundle \
    BUNDLE_JOBS=4 \
    BUNDLE_RETRY=3

COPY Gemfile Gemfile.lock* ./
RUN gem update --system && gem install bundler && bundle install

COPY . .

EXPOSE 4000 35729

CMD ["bundle","exec","jekyll","serve","--host","0.0.0.0","--port","4000","--livereload","--watch","--force_polling","--config","_config.yml,_config-dev.yml"]


