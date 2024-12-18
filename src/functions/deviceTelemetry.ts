import { app, InvocationContext, output } from '@azure/functions';

export async function deviceTelemetry(
  messages: unknown | unknown[],
  context: InvocationContext
): Promise<void> {
  context.log(`Starting processing of received device messages`);

  if (!Array.isArray(messages)) {
    messages = [messages];
  }

  if (Array.isArray(messages)) {
    context.log(`Processing ${messages.length} device messages`);

    const signalRMessages = messages.map((message) => {
      context.log('Processing message', message);

      return {
        target: 'telemetry',
        arguments: [message],
      };
    });

    context.log('Sending messages to SignalR');

    context.extraOutputs.set('signalRMessages', signalRMessages);

    context.log('Messages queued for sending to SignalR');
  }
}

const signalrOutput = output.generic({
  type: 'signalR',
  name: 'signalRMessages',
  hubName: 'devices',
  connectionStringSetting: 'AzureSignalRConnectionString',
});

app.eventHub('deviceTelemetry', {
  connection: 'IoTHubEndpoint',
  eventHubName: '%IoTHubEventHubName%',
  cardinality: 'many',
  consumerGroup: '%IoTHubConsumerGroup%',
  extraOutputs: [signalrOutput],
  handler: deviceTelemetry,
});
