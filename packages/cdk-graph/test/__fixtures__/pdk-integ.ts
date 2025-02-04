/*! Copyright [Amazon.com](http://amazon.com/), Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0 */
import { PDKNagApp } from "@aws/pdk-nag";
import { PDKPipeline } from "@aws/pipeline";
import { Stack } from "aws-cdk-lib";
import { TestStage } from "./apps";
import { ENVIRONMENTS } from "./env";

export interface PDKIntegAppProps {
  outdir: string;
}

export class PDKPipelineIntegApp extends PDKNagApp {
  constructor(props: PDKIntegAppProps) {
    super({ outdir: props.outdir });

    const pipelineStack = new Stack(this, "PipelineStack", {
      env: ENVIRONMENTS.DEFAULT,
    });
    const pipeline = new PDKPipeline(pipelineStack, "Pipeline", {
      primarySynthDirectory: props.outdir,
      repositoryName: "monorepo",
      crossAccountKeys: true,
      synth: {
        commands: ["npm ci", "npm run build"],
      },
    });

    const devStage = new TestStage(this, "Dev", { env: ENVIRONMENTS.DEV });
    pipeline.addStage(devStage);

    const prodStage = new TestStage(this, "Prod", { env: ENVIRONMENTS.PROD });
    pipeline.addStage(prodStage);

    pipeline.buildPipeline(); // Needed for CDK Nag
  }
}
