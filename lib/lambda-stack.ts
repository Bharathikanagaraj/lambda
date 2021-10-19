import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
//import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import * as iam from '@aws-cdk/aws-iam'
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import { CloudFrontToApiGateway } from '@aws-solutions-constructs/aws-cloudfront-apigateway';


// export class LambdaStack extends cdk.Stack {
//   constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
//     super(scope, id, props);

//     // The code that defines your stack goes here
//     //IAM Creation
//     const myLamdaRole = new iam.Role(this, 'myLambdaRole',{
//       assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
//     })

//     myLamdaRole.addManagedPolicy(
//       iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')
//     )
    
//     // defines an AWS Lambda resource
//     const apidefault = new lambda.Function(this, 'DefaultHandler', {
//       runtime: lambda.Runtime.NODEJS_14_X,    // execution environment
//       code: lambda.Code.fromAsset('lambda'),  // code loaded from "lambda" directory
//       handler: 'default.handler',             // file is "hello", function is "handler"
//       role: myLamdaRole,               
//     });
//     const hello = new lambda.Function(this, 'HelloHandler', {
//       runtime: lambda.Runtime.NODEJS_14_X,    // execution environment
//       code: lambda.Code.fromAsset('lambda'),  // code loaded from "lambda" directory
//       handler: 'hello.handler' ,               // file is "hello", function is "handler"
//       role: myLamdaRole
//     });
//     const world = new lambda.Function(this, 'WorldHandler', {
//       runtime: lambda.Runtime.NODEJS_14_X,    // execution environment
//       code: lambda.Code.fromAsset('lambda'),  // code loaded from "lambda" directory
//       handler: 'world.handler',                // file is "hello", function is "handler"
//       role: myLamdaRole, 
//     });
//     // defines an API Gateway REST API resource backed by our "hello" function.
//     const myApiGw=new apigw.LambdaRestApi(this, 'MyApi', {
//       handler: apidefault,
//       endpointConfiguration: {
//         types: [apigw.EndpointType.REGIONAL]
//       },
//       defaultMethodOptions: {
//         authorizationType: apigw.AuthorizationType.NONE
//       },
//     });

    
//     //CloudFront distribution
//     const distribution = new cloudfront.CloudFrontWebDistribution(this, "webDistribution", {
//       loggingConfig: {
//         bucket: new s3.Bucket(this, 'logbucket19102021', {
//           bucketName: "logbucket19102021",
//           lifecycleRules: [
//             {
//               enabled: true,
//               expiration: cdk.Duration.days(30),
//             },
//           ],
//         }),
//         includeCookies: true,
//       },
//       originConfigs: [
//         {
//           customOriginSource: {
//             domainName: `${myApiGw.restApiId}.execute-api.${this.region}.${this.urlSuffix}`,
//             originPath: `/${myApiGw.deploymentStage.stageName}`
//           },
//           behaviors: [
//             {
//               isDefaultBehavior: true,
//               allowedMethods: cloudfront.CloudFrontAllowedMethods.ALL,
//             },
//           ],
//         },
//         {
//           behaviors: [
//             {
//               allowedMethods: cloudfront.CloudFrontAllowedMethods.ALL,
//               pathPattern: '/hello'
//             },
//           ],
//           customOriginSource: {
//             domainName: `${myApiGw.restApiId}.execute-api.${this.region}.${this.urlSuffix}`,
//             originPath: `/${myApiGw.deploymentStage.stageName}`
//           },
//         },
//         {
//           behaviors: [
//             {
//               allowedMethods: cloudfront.CloudFrontAllowedMethods.ALL,
//               pathPattern: '/world'
//             },
//           ],
//           customOriginSource: {
//             domainName: `${myApiGw.restApiId}.execute-api.${this.region}.${this.urlSuffix}`,
//             originPath: `/${myApiGw.deploymentStage.stageName}`
//           },
//         }
//       ],
//       defaultRootObject: "",
//       comment: "Bharathi CF" 
//     } 
//     );
//     new cdk.CfnOutput(this, "distributionDomainName", { value: distribution.distributionDomainName });
//   }
// }

////new
//import * as cdk from '@aws-cdk/core';
//import * as lambda from '@aws-cdk/aws-lambda';
//import * as iam from "@aws-cdk/aws-iam";
//import path =  require('path');
//import * as apigw from '@aws-cdk/aws-apigateway';
import * as cf from "@aws-cdk/aws-cloudfront"
// import * as route53 from "@aws-cdk/aws-route53";
//import * as s3 from '@aws-cdk/aws-s3';


export class LambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myLamdaRole = new iam.Role(this, 'myLambdaRole',{
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
    })

    myLamdaRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')
    )
    
    const myTestLambda = new lambda.Function(this, 'myTestLambda', {
      functionName: "default",
      runtime: lambda.Runtime.NODEJS_14_X,
      role: myLamdaRole,
      handler: 'default.handler',
      code: lambda.Code.fromAsset('lambda')
      // code: lambda.Code.fromAsset(path.join(__dirname,'../lambda/')),
      // timeout: cdk.Duration.seconds(300)
    })

    const helloLambda = new lambda.Function(this, 'helloLambda', {
      functionName: "hello",
      runtime: lambda.Runtime.NODEJS_14_X,
      role: myLamdaRole,
      handler: 'hello.handler',
      //code: lambda.Code.fromAsset(path.join(__dirname,'../lambda/')),
      code: lambda.Code.fromAsset('lambda')
      //timeout: cdk.Duration.seconds(300)
    })

    const worldLambda = new lambda.Function(this, 'worldLambda', {
      functionName: "world",
      runtime: lambda.Runtime.NODEJS_14_X,
      role: myLamdaRole,
      handler: 'world.handler',
      code: lambda.Code.fromAsset('lambda')
      // code: lambda.Code.fromAsset(path.join(__dirname,'../lambda/')),
      // timeout: cdk.Duration.seconds(300)
    })
    
    const apiLambda = new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: myTestLambda,
      
      endpointConfiguration: {
        types: [apigw.EndpointType.REGIONAL]
      },
      defaultMethodOptions: {
        authorizationType: apigw.AuthorizationType.NONE
      },
    })

    // const apiRoute = apiLambda.root.addResource("hello")
    // apiRoute.addMethod(
    //     "GET",
    //     new apigw.LambdaIntegration(helloLambda),   
    //   )
    // const apiRoute1 = apiLambda.root.addResource("world")
    // apiRoute1.addMethod(
    //     "GET",
    //     new apigw.LambdaIntegration(worldLambda)
    //   );

    // const distribution = new cf.Distribution(this, 'myCloudFront',{
    //   defaultBehavior: {
    //     origin: new origins.HttpOrigin(`${apiLambda.restApiId}.execute-api.${this.region}.${this.urlSuffix}`),
    //   },
    //   comment: "RAM lambda Api" 
    // })
    
    const distribution = new cf.CloudFrontWebDistribution(this, "webDistribution", {
      loggingConfig: {
        bucket: new s3.Bucket(this, 'logbucket19102021', {
          bucketName: 'logbucket19102021',
          lifecycleRules: [
              {
                enabled: true,
                expiration: cdk.Duration.days(30),
              },
            ],
          }),
          includeCookies: true,
        },
      originConfigs: [
        {
          customOriginSource: {
            domainName: `${apiLambda.restApiId}.execute-api.${this.region}.${this.urlSuffix}`,
            originPath: `/${apiLambda.deploymentStage.stageName}`,
            
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              allowedMethods: cf.CloudFrontAllowedMethods.ALL,
            },
          ],   
        },
        {
          behaviors: [
            {
              allowedMethods: cf.CloudFrontAllowedMethods.ALL,
              pathPattern: "/hello",
            }
          ],
           customOriginSource: {
            domainName: `${apiLambda.restApiId}.execute-api.${this.region}.${this.urlSuffix}`,
            originPath: `/${apiLambda.deploymentStage.stageName}`
          },
        },
        {
          behaviors: [
            {
              allowedMethods: cf.CloudFrontAllowedMethods.ALL,
              pathPattern: "/world",
            }
          ],
           customOriginSource: {
            domainName: `${apiLambda.restApiId}.execute-api.${this.region}.${this.urlSuffix}`,
            originPath: `/${apiLambda.deploymentStage.stageName}`
          },
        },
      ],
      
      defaultRootObject: "",
      
      comment: "Bharathi lambda Api" 
    });
    new cdk.CfnOutput(this, "distributionDomainName", { value: distribution.distributionDomainName });
    // new route53.ARecord(this, 'CloudfrontAlias', {
    //   zone: externalHostedZone,
    //   target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    //   recordName: 'ramtypescriptdevops.com'
    // });

    // The code that defines your stack goes here
  }
}