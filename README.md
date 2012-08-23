# Postman Pat [![build
status](https://secure.travis-ci.org/agnoster/postman-pat.png?branch=master)](http://travis-ci.org/agnoster/postman-pat)

SMTP ==> HTTP REST JSON API

## wtf

Stand-alone server for receiving email via SMTP and providing access to it via
an HTTP REST JSON API. Useful for automated testing that requires receiving
email and doing stuff with it. I wanted to be able to test things like the
"forgot password" flow, or "email confirmation", from automated tests.

Currently has no persistence or notification. It just receives mail, serves up
a mailbox as a JSON array, and lets you clear a mailbox with `DELETE`. That's
it.

## status

Prototype. Not ready for production use, but could be used for basic testing
purposes.

## install

    npm install -g postman-pat

## setup

    sudo postman-pat

(The `sudo` is required to listen to ports 25 and 80 for SMTP and HTTP,
respectively. Without sudo, Pat will run on ports 9025 and 9080.)

Now, point your MX record for a domain (such as `test.example.com`) to the
server running Pat.

## use

Send an email to `example.user.1@test.example.com`, for instance:

```
$ mail example.user.1@test.example.com
Subject: Are you listening to me?
You really should be.
.
```

Then check it out:

    $ curl test.example.com/inbox/example.user.1 [{"subject":"Are you listening
    to me?","text":"You really should be.\n"}]

That's really all there is to it. You can `DELETE` a mailbox to clear it.

## ideas

    GET test.example.com/inbox/example.user.1/?limit=1&timeout=60

Wait for the next mail to come into this mailbox. This means you can easily do
a `DELETE`, perform an action that should trigger an email, then issue a `GET
?limit&timeout` to wait for the email to show up.

## license = MIT
