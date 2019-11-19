# Enable staticmaps on AWS lambda

Deploy npm package `staticmaps` to a nodejs 8.10 lambda in aws.

Because `staticmaps` depends on `sharp` to manipulate images, the trick is to have the `sharp` npm module have the correct 
platform files.

## My windows setup

I work mainly on windows, so a normal `npm install` gives me windows related `sharp` files.

After some struggles, I think these steps were what made my deploy work:

- after a normal `npm install`
- go into the `node_modules` folder, locate the `sharp` folder, and delete it.
- then do `npm install node-gyp --arch=x64 --platform=linux --target=8.10.0`
- this will download `sharp` with the correct dependencies to run on lambda node8.10

# Deployment

## Serverless version

I started with version 1.8 (at least a year old), and that was giving me deployment issues, so I did `npm update serverless -g` and that removed my deployment issues when doing `sls deploy`

To deploy this you should have a recent version of `serverless`.

In `serverless.yml` you can give `service` a different name.

In `serverless.yml` point `provider.profile` to your aws credentials.

In `serverless.yml` use `provider.memorySize` to make your lambda faster at the expense of possibly increasing your costs if the usage goes over the free-tier limits.

do `sls deploy` for your initial deploy, the lambda function is created, and the api gateway is created.

## API Gateway setup

After initial deployment, you need to go into the API Gateway settings and tell it to allow binary data responses (images).

In APIG's backend, go to the API's Settings, and a new **Binary Media Type**.  Click on "Add Binary Media Type" and type in `*/*`.  Then go to the API Resources, and at the top level, do **Deploy API** for the settings to take effect.

## Deploying changes/enhancements

You can do `sls deploy function -f map` after initial deploy to avoid all the cloudformation steps and just update the lambda.

# Querystring parameters

`lat` : latitude

`lng` : longitude

`z` : zoom level, defaults to `15`
