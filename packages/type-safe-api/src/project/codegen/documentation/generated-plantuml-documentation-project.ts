/*! Copyright [Amazon.com](http://amazon.com/), Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0 */
import { Project, ProjectOptions, Task } from "projen";
import { GeneratedPlantumlDocumentationOptions } from "../../types";
import { TypeSafeApiCommandEnvironment } from "../components/type-safe-api-command-environment";
import {
  buildCodegenCommandArgs,
  buildTypeSafeApiExecCommand,
  TypeSafeApiScript,
} from "../components/utils";

export interface GeneratedPlantumlDocumentationProjectOptions
  extends ProjectOptions,
    GeneratedPlantumlDocumentationOptions {
  /**
   * Path to the OpenAPI Specification for which to generate docs, relative to the project outdir
   */
  readonly specPath: string;
}

export class GeneratedPlantumlDocumentationProject extends Project {
  private readonly generateTask: Task;

  constructor(options: GeneratedPlantumlDocumentationProjectOptions) {
    super(options);
    TypeSafeApiCommandEnvironment.ensure(this);

    this.generateTask = this.addTask("generate");
    this.generateTask.exec(
      buildTypeSafeApiExecCommand(
        TypeSafeApiScript.GENERATE_NEXT,
        buildCodegenCommandArgs({
          specPath: options.specPath,
          templateDirs: ["docs/templates/plantuml"],
        })
      )
    );

    this.compileTask.spawn(this.generateTask);

    if (!options.commitGeneratedCode) {
      this.gitignore.addPatterns("schemas.plantuml");
    }

    this.gitignore.addPatterns(".openapi-generator", ".tsapi-manifest");
  }
}
