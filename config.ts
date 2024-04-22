const getEnvironmentVariable = (environmentVariable: string): string => {
  const unvalidatedEnvironmentVariable = process.env[environmentVariable];
  if (!unvalidatedEnvironmentVariable) {
    throw new Error(`Couldn't find environment variable: ${environmentVariable}`);
  } else {
    return unvalidatedEnvironmentVariable;
  }
};

export const config = {
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: getEnvironmentVariable("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"),
  CLERK_SECRET_KEY: getEnvironmentVariable("CLERK_SECRET_KEY"),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: getEnvironmentVariable("NEXT_PUBLIC_CLERK_SIGN_IN_URL"),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: getEnvironmentVariable("NEXT_PUBLIC_CLERK_SIGN_UP_URL"),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: getEnvironmentVariable("NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL"),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: getEnvironmentVariable("NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL"),
  MONGODB_URL: getEnvironmentVariable("MONGODB_URL"),
  UPLOADTHING_SECRET: getEnvironmentVariable("UPLOADTHING_SECRET"),
  UPLOADTHING_APP_ID: getEnvironmentVariable("UPLOADTHING_APP_ID"),
};
