import { PostHog } from 'posthog-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

function requirePostHogConfiguration(
  variableName: string,
  value: string | undefined,
) {
  if (value) {
    return value;
  }

  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    );
  }

  return undefined;
}

export const configuredProjectToken = requirePostHogConfiguration(
  'POSTHOG_PROJECT_TOKEN',
  projectToken,
);
export const configuredHost = requirePostHogConfiguration('POSTHOG_HOST', host);

export const posthog =
  configuredProjectToken && configuredHost
    ? new PostHog(configuredProjectToken, {
        host: configuredHost,
        enableExceptionAutocapture: true,
      })
    : undefined;
