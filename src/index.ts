import {
  DatabaseMigrationServiceClient,
  DescribeReplicationTasksCommand,
  StartReplicationTaskCommand,
  StartReplicationTaskTypeValue,
  StopReplicationTaskCommand,
} from "@aws-sdk/client-database-migration-service";
import dotenv from "dotenv";

// Validate environment variables
export const validateEnv = () => {
  const requiredEnvVars = [
    "REPLICATION_ACCESS_KEY_ID",
    "REPLICATION_SECRET_ACCESS_KEY",
    "REPLICATION_TASK_ARN",
    "REPLICATION_REGION",
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`❌ ${envVar} is missing. Please set it in your environment.`);
      process.exit(1);
    }
  }
};

dotenv.config();
validateEnv();

// Initialize DMS client
const dmsClient = new DatabaseMigrationServiceClient({
  region: process.env.REPLICATION_REGION!,
  credentials: {
    accessKeyId: process.env.REPLICATION_ACCESS_KEY_ID!,
    secretAccessKey: process.env.REPLICATION_SECRET_ACCESS_KEY!,
  },
});

// Start DMS replication task
export async function startDMSReplication() {
  try {
    const taskStatus = await getReplicationTaskStatus();
    let startType: StartReplicationTaskTypeValue = "start-replication";

    if (taskStatus && taskStatus !== "creating" && taskStatus !== "ready") {
      startType = "resume-processing";
    }

    if (taskStatus === "running" || taskStatus === "starting") {
      console.log(`Task is already in "${taskStatus}" state. Skipping start command.`);
      return;
    }

    if (taskStatus === "testing") {
      console.error(`❌ Task is in "testing" state. Cannot start the replication process.`);
      return;
    }

    console.log(`🚀 Starting CDC Replication Task with type: ${startType}...`);
    await dmsClient.send(
      new StartReplicationTaskCommand({
        ReplicationTaskArn: process.env.REPLICATION_TASK_ARN,
        StartReplicationTaskType: startType,
      })
    );

    console.log("⏳ Replication task started. Waiting for completion...");
    await waitForTaskCompletion(process.env.REPLICATION_TASK_ARN!);
  } catch (error) {
    console.error("❌ Error starting DMS replication task:", error);
  }
}

// Stop DMS replication task
async function stopDMSReplication() {
  try {
    const taskStatus = await getReplicationTaskStatus();

    if (taskStatus !== "running") {
      console.log(`Task is currently in "${taskStatus}" state. Skipping stop command.`);
      return;
    }

    console.log("🛑 Stopping DMS Replication Task...");
    await dmsClient.send(new StopReplicationTaskCommand({
      ReplicationTaskArn: process.env.REPLICATION_TASK_ARN,
    }));
    console.log("✅ DMS Replication Task stopped.");
  } catch (error) {
    console.error("❌ Error stopping DMS replication task:", error);
  }
}

// Get the current status of the replication task
async function getReplicationTaskStatus(): Promise<string | undefined> {
  try {
    const describeResponse = await dmsClient.send(new DescribeReplicationTasksCommand({
      Filters: [{ Name: "replication-task-arn", Values: [process.env.REPLICATION_TASK_ARN!] }]
    }));
    return describeResponse.ReplicationTasks?.[0]?.Status;
  } catch (error) {
    console.error("❌ Error describing replication task:", error);
    throw error;
  }
}

// Wait for the replication task to complete
async function waitForTaskCompletion(taskArn: string) {
  let taskStatus = "running";
  while (taskStatus === "running" || taskStatus === "starting") {
    try {
      console.log("🔍 Checking task status...");
      taskStatus = await getReplicationTaskStatus() ?? "unknown";
      console.log(`⏳ Current task status: ${taskStatus}`);

      if (taskStatus !== "running" && taskStatus !== "starting") break;
      await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait 1 minute before checking again
    } catch (error) {
      console.error("❌ Error checking task status:", error);
      break;
    }
  }
}

// Main function to start and stop the replication task
async function main() {
  try {
    await startDMSReplication();
    await stopDMSReplication();
    console.log("✅ DMS CDC Task completed and stopped.");
  } catch (error) {
    console.error("❌ Error in DMS automation:", error);
  }
}

main();