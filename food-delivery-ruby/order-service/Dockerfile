FROM ruby:3.2-slim

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev

WORKDIR /app

COPY Gemfile ./
RUN bundle install

COPY . .

EXPOSE 3001

CMD ["sh", "-c", "bundle exec rake db:migrate && ruby app.rb"]