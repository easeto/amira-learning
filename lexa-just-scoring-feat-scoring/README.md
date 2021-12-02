# frontend
Project Listen Lexa Student App

This version of the Amira app has most aspects removed, except for the current "scoring screen" and "activities screen". 

It is intended as a reference and/or potential building block for work on rescoring infrastructure.

### To Run Front End

 + Install Node.js

 EITHER
 + Install Homebrew
 + Install aws-cli: `brew install awscli`

 OR
 + Install aws-cli: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
 ```
$ aws configure
AWS Access Key ID [None]: <your key id>
AWS Secret Access Key [None]: <your key>
Default region name [None]: us-east-1
Default output format [None]: ENTER

```
For the access Key ID and Secret Access Key, use the information in the credentials csv sent to you by Pete
For default region name: enter us-east-1
Just hit enter for default output format

 + Install project dependencies:


```
npm install node-sass

To use the production backend:
npm run install

To use staging;
npm run install
-THEN-
npm run install-staging


You should only ever need to use the staging backend

```

 + Install Webpack Dev Server:

```
sudo npm i -g webpack-dev-server
```

 + Run Webpack dev server:

```
npm start
```
 + Navigate to [http://localhost:8080](http://localhost:8080)


### Notes

 + Until we modify the build process to do this automatically, it will be necessary to remove the extraneous aws-amplify project after every npm install. Also it is necessary to delete the entire awsmobile directory if you reinit the project.


### Dev Configs
#### API dev flags
In `src/services/API.js`:
- RUN_METADATA_DUMP gets a dump of all the word metadata in the console when you hit "read a story"


### Common errors

 + If you get AWS errors, be sure that you have the following files in your root directory.

# ~/.aws/config
```
[default]
region=us-west-2
output=json
```

# ~/.aws/credentials
```
[default]
aws_secret_key_id=<YOUR KEY ID HERE>
aws_secret_access_key=<YOUR KEY HERE>
region=us-east-1
```

# ~/.awsmobilejs/aws-config.json
```
{
   "accessKeyId":"<YOUR KEY ID HERE>",
   "secretAccessKey":"<YOUR KEY HERE>",
   "region":"us-east-1"
}
```
