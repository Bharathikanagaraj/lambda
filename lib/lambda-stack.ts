import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from "@aws-cdk/aws-iam";
import * as apigw from '@aws-cdk/aws-apigateway';
import * as cf from "@aws-cdk/aws-cloudfront"
import * as route53 from "@aws-cdk/aws-route53";
import * as s3 from '@aws-cdk/aws-s3';
import { LogGroup } from "@aws-cdk/aws-logs";
//import path =  require('path');
import * as alias from '@aws-cdk/aws-route53-targets'



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
      code: lambda.Code.fromAsset('lambda'),
      timeout: cdk.Duration.seconds(300),
      
    })

    const helloLambda = new lambda.Function(this, 'helloLambda', {
      functionName: "hello",
      runtime: lambda.Runtime.NODEJS_14_X,
      role: myLamdaRole,
      handler: 'hello.handler',
      code: lambda.Code.fromAsset('lambda'),
      timeout: cdk.Duration.seconds(300)
    })

    const worldLambda = new lambda.Function(this, 'worldLambda', {
      functionName: "world",
      runtime: lambda.Runtime.NODEJS_14_X,
      role: myLamdaRole,
      handler: 'world.handler',
      code: lambda.Code.fromAsset('lambda'),
      timeout: cdk.Duration.seconds(300)
    })
    
    const BharathiApiLog = new LogGroup(this, "BharathiApiLog");

    const apiLambda = new apigw.LambdaRestApi(this, 'MyLambdaEndpoint', {
      handler: myTestLambda,
      endpointConfiguration: {
        types: [apigw.EndpointType.REGIONAL]
      },
      defaultMethodOptions: {
        authorizationType: apigw.AuthorizationType.NONE
      },
      proxy: false,
      deployOptions: {
        accessLogDestination: new apigw.LogGroupLogDestination(BharathiApiLog),
        accessLogFormat: apigw.AccessLogFormat.jsonWithStandardFields(),
        loggingLevel: apigw.MethodLoggingLevel.INFO,
        metricsEnabled: true,
      },
    })

    apiLambda.root.addMethod('ANY');
    const hello = apiLambda.root.addResource("hello")
    hello.addMethod(
      "GET",
      new apigw.LambdaIntegration(helloLambda),   
    )
    hello.addMethod(
      "POST",
      new apigw.LambdaIntegration(helloLambda),   
    )
    const world = apiLambda.root.addResource("world")
    world.addMethod(
      "GET",
      new apigw.LambdaIntegration(worldLambda)
    );
    world.addMethod(
      "POST",
      new apigw.LambdaIntegration(worldLambda)
    )


    const siteDomain = "bharatitypescriptdevops.com"
    const distribution = new cf.CloudFrontWebDistribution(this, "webDistribution", {
      aliasConfiguration: {
        acmCertRef: "arn:aws:acm:us-east-1:814445629751:certificate/c460d9b4-2108-44db-ab98-60490112b4cc",
        securityPolicy: cf.SecurityPolicyProtocol.TLS_V1_2_2018,
        names: [siteDomain],
      },
      loggingConfig: {
        bucket: new s3.Bucket(this, 'logbucket20102021-1', {
          bucketName: "logbucket20102021-1",
          lifecycleRules: [
              {
                enabled: true,
                expiration: cdk.Duration.days(30),
              },
            ],
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
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
              allowedMethods: cf.CloudFrontAllowedMethods.ALL
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
    //Route53
    const myzone = route53.HostedZone.fromHostedZoneAttributes(this, 'ZenithWebFoundryZone', {
      hostedZoneId: 'Z07501213VM01SYPJYZ77',
      zoneName: 'bharatitypescriptdevops.com' // your zone name here
    });
    new route53.ARecord(this, 'AliasRecord', {
      zone:myzone,
      target: route53.RecordTarget.fromAlias(new alias.CloudFrontTarget(distribution)),
    });
     
  }
}