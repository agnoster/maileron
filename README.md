# Postman Pat [![build status](https://secure.travis-ci.org/agnoster/postman-pat.png?branch=master)](http://travis-ci.org/agnoster/postman-pat)

SMTP -> HTTP REST JSON API

## wtf

Stand-alone server for receiving email via SMTP and providing access to it via an HTTP REST JSON API. Useful for automated testing that requires receiving email and doing stuff with it.

## status

FANTASY. None of this is implemented yet.

## install

    npm install -g postman-pat

## setup

    sudo npm start postman-pat

(The `sudo` is required to listen to ports 25 and 80 for SMTP and HTTP, respectively.)

Now, point your MX record for a domain (such as `test.example.com`) to the server running Pat.

## use

Send an email to `example.user.1@test.example.com`, for instance:

```
$ mail example.user.1@test.example.com
Subject: Are you listening to me?
You really should be.
.
```

Then check it out:

    $ curl test.example.com/box/example.user.1
    [{"Subject":"Are you listening to me?","Body":"You really should be.\n"}]

That's really all there is to it. You can `DELETE` a resource to clear its mailbox.

## todo

    GET test.example.com/box/example.user.1/?limit=1&timeout=60

Wait for the next mail to come into this mailbox. This means you can easily do
a `DELETE`, perform an action that should trigger an email, then issue a `GET
?limit&timeout` to wait for the email to show up.
