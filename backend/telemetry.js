//telemetry.js

// npm install @opentelemetry/sdk-node \
//             @opentelemetry/auto-instrumentations-node \
//             @opentelemetry/exporter-metrics-otlp-http \
//             @opentelemetry/resources \
//             @opentelemetry/semantic-conventions \
//             @opentelemetry/host-metrics

import 'dotenv/config';

import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";

//in the .env file, add the following variables
// OTEL_EXPORTER_OTLP_ENDPOINT=https://otlp-gateway-prod-ap-south-1.grafana.net/otlp
// OTEL_EXPORTER_OTLP_HEADERS=Authorization=Basic%20MTY5OTE0MzpnbGNfZXlKdklqb2lNVGd5TURBNE1TSXNJbTRpT2lKelpXNTBhVzVsYkNJc0ltc2lPaUpXWlVSUU1EZzBSVEV6VVU5dk1EbFBkR3cwWW1seE1qRWlMQ0p0SWpwN0luSWlPaUp3Y205a0xXRndMWE52ZFhSb0xURWlmWDA9

const sdk = new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations()],

   resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "educat-backend-api",
    [ATTR_SERVICE_VERSION]: "1.0.0",
  }),
});
try {
  await sdk.start();
  console.log("OpenTelemetry started");
} catch (err) {
  console.error("Failed to start OpenTelemetry", err);

  // this is for checking the the webhook works or not 
}

