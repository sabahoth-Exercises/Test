## Test

Task for a web developer position

## Task
[task](https://github.com/sabahoth01/Test/blob/master/task.txt)

## Techno
- NodeJs
- Express
- MongoDB

## Content

I've supposed that I had a perfectly working and configured frontend for a e-commerce web app.</br>
And I'm working on a part of backend: authorization.<br/>
I've:
- created 2 routes: public(home page, where you can see stuffs or available articles) and private (for enregistered user who can delete, publish, modify a article or stuff that he wants(is)to sell (selling)).
- implemented the auth middleware to work only on home page.
- made the generated token to be stored on .env for only 2 hours.
- implemented a rate limiter and set limit according to the task

## Other techno used

- Mongoose: will help to connect with db (easy to use).
- dotenv: get password vars from .env file.
- bcryptjs: will encrypt our passwords.
- express rate limiter: 
- express-unless: to conditionally skip a middleware when a condition is met.<br/>This is particularly helpful when used in conjunction with custom authentication middleware.



