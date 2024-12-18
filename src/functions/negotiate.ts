import {
  app,
  HttpRequest,
  HttpResponseInit,
  input,
  InvocationContext,
} from '@azure/functions';

export async function negotiate(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const connInfo = context.extraInputs.get('connectionInfo');

  return { body: JSON.stringify(connInfo) };
}

const signalRInput = input.generic({
  type: 'signalRConnectionInfo',
  name: 'connectionInfo',
  hubName: 'devices',
});

app.http('negotiate', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  extraInputs: [signalRInput],
  handler: negotiate,
});
