FROM ruby:3.3.6-slim

ENV LANG C.UTF-8
ENV TZ Asia/Tokyo

# 必要なパッケージをインストール
RUN apt-get update -qq && apt-get install -y \
    build-essential \
    libpq-dev \
    git \
    vim \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /rails

# Gemfileを先にコピー（キャッシュ効率化）
COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .

EXPOSE 3000
CMD ["rails", "server", "-b", "0.0.0.0"]
