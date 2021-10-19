#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LambdaStack } from '../lib/lambda-stack';
import { ApiDefinition } from '@aws-cdk/aws-apigateway';


const app = new cdk.App();
new LambdaStack(app, 'LambdaStack', {});

