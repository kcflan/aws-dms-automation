export const validateEnv = () => {
  const requiredEnvVars = [
    "REPLICATION_ACCESS_KEY_ID",
    "REPLICATION_SECRET_ACCESS_KEY",
    "REPLICATION_TASK_ARN",
    "REPLICATION_REGION",
    "REPLICATION_INSTANCE_ARN",
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`❌ ${envVar} is missing. Please set it in your environment.`);
      process.exit(1);
    }
  }
};
