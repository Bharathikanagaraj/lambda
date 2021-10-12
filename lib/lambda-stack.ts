import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import { CloudFrontToApiGateway } from '@aws-solutions-constructs/aws-cloudfront-apigateway';

export class LambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // defines an AWS Lambda resource
    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,    // execution environment
      code: lambda.Code.fromAsset('lambda'),  // code loaded from "lambda" directory
      handler: 'hello.handler'                // file is "hello", function is "handler"
    });
    // defines an API Gateway REST API resource backed by our "hello" function.
    const myApiGw=new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: hello
    });
    //CloudFront distribution
    const myDistribution=new cloudfront.Distribution(this, 'myDistribution', {
      defaultBehavior: { origin: new origins.HttpOrigin(`${myApiGw.restApiId}.execute-api.${this.region}.${this.urlSuffix}`),
      //.....    
    },
    //myDistribution.addBehavior('/prod', new origins.HttpOrigin('15rb80ghsc.execute-api.ap-southeast-2.amazonaws.com'))
      
      
    });
    // new CloudFrontToApiGateway(this, 'cdn',{
    // })
      // const myCUstomDistribution=new cloudfront.Distribution(this, 'myCloudFront',{
      //   defaultBehavior: {
      //     // origin: new origins.HttpOrigin('https://e2pm0uo42m.execute-api.ap-southeast-2.amazonaws.com/prod/'), '
      //     origin: new origins.HttpOrigin('https://e2pm0uo42m.execute-api.ap-southeast-2.amazonaws.com/prod/') 
      //   } 
      // });
    // myCUstomDistribution.addBehavior()
  }
}
