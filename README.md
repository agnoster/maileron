# Maileron [![build status](https://secure.travis-ci.org/agnoster/maileron.png?branch=master)](http://travis-ci.org/agnoster/maileron)

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

    npm install -g maileron

## setup

    sudo maileron

The `sudo` is required to listen to ports 25 and 80 for SMTP and HTTP,
respectively. Without sudo, maileron will run on ports 9025 and 9080, which means it
would only work with specially-configured mail clients.

Now, point your MX record for a domain (in my case, `pat.agnoster.net`) to the
server running maileron (which for me is also `pat.agnoster.net`).

## use

Send an email to `example@pat.agnoster.net`, for instance:

```
MAIL example@pat.agnoster.net
Subject: Hello World

How are you?
```

Then hit the webserver (in this example, `pat.agnoster.net`) and check it out
(some values elided for clarity):

```
GET /inbox/example
```

```
200 OK
Content-type: application/json

[
  {
    "text": "How are you?",
    "headers": { ... },
    "subject": "Hello World",
    "from": [
      {
        "address": "i@agnoster.net",
        "name": "Isaac Wolkerstorfer"
      }
    ],
    "to": "example",
    "envelope": {
      "from": "agnoster@gmail.com",
      "to": ["example@pat.agnoster.net"],
      "date": "2012-08-23T17:50:20.013Z"
    }
  },
  ...
]
```

That's really all there is to it. You can `DELETE` a mailbox to clear it.

## ideas

    GET test.example.com/inbox/example.user.1/?limit=1&timeout=60

Wait for the next mail to come into this mailbox. This means you can easily do
a `DELETE`, perform an action that should trigger an email, then issue a `GET
?limit&timeout` to wait for the email to show up.

## license = MIT
