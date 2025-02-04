/*! Copyright [Amazon.com](http://amazon.com/), Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0 */
import { Project, SampleFile } from "projen";
import {
  OpenApiProjectDefinition,
  OpenApiProjectDefinitionOptions,
} from "./open-api-project-definition";

/**
 * Options for the OpenAPI Spec
 */
export interface OpenApiDefinitionOptions
  extends OpenApiProjectDefinitionOptions {}

/**
 * The OpenAPI Spec
 */
export class OpenApiDefinition extends OpenApiProjectDefinition {
  constructor(project: Project, options: OpenApiDefinitionOptions) {
    super(project, options);

    const firstHandlerLanguage = options.handlerLanguages?.[0];

    // Create a sample OpenAPI spec yaml if not defined
    new SampleFile(project, this.openApiSpecificationPath, {
      contents: `openapi: 3.0.3
info:
  version: 1.0.0
  title: ${options.openApiOptions.title}
paths:
  /hello:
    get:
      operationId: sayHello${
        firstHandlerLanguage
          ? `
      x-handler:
        language: ${firstHandlerLanguage}`
          : ""
      }
      parameters:
        - in: query
          name: name
          schema:
            type: string
          required: true
      responses:
        200:
          description: Successful response
          content:
            'application/json':
              schema:
                $ref: '#/components/schemas/SayHelloResponseContent'
        500:
          description: An internal failure at the fault of the server
          content:
            'application/json':
              schema:
                $ref: '#/components/schemas/InternalFailureErrorResponseContent'
        400:
          description: An error at the fault of the client sending invalid input
          content:
            'application/json':
              schema:
                $ref: '#/components/schemas/BadRequestErrorResponseContent'
        403:
          description: An error due to the client not being authorized to access the resource
          content:
            'application/json':
              schema:
                $ref: '#/components/schemas/NotAuthorizedErrorResponseContent'
components:
  schemas:
    SayHelloResponseContent:
      type: object
      properties:
        message:
          type: string
      required:
        - message
    InternalFailureErrorResponseContent:
      type: object
      properties:
        message:
          type: string
      required:
        - message
    BadRequestErrorResponseContent:
      type: object
      properties:
        message:
          type: string
      required:
        - message
    NotAuthorizedErrorResponseContent:
      type: object
      properties:
        message:
          type: string
      required:
        - message
`,
    });
  }
}
