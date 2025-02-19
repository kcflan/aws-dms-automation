import { DescribeReplicationTasksCommand } from "@aws-sdk/client-database-migration-service";
import dotenv from "dotenv";
import { dmsClient } from "../utils/dmsClient";

dotenv.config();

export const getReplicationTaskStatus = async (): Promise<string | undefined> => {
  try {
    const describeResponse = await dmsClient.send(
      new DescribeReplicationTasksCommand({
        Filters: [{ Name: "replication-task-arn", Values: [process.env.REPLICATION_TASK_ARN!] }],
      })
    );
    return describeResponse.ReplicationTasks?.[0]?.Status;
  } catch (error) {
    console.error("❌ Error describing replication task:", error);
    throw error;
  }
};

const delay = async (seconds: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

export const waitForTaskCompletion = async () => {
  const delaySeconds = process.env.DELAY_SECONDS ? parseInt(process.env.DELAY_SECONDS) : 60;
  let taskStatus = "running";
  while (taskStatus === "running" || taskStatus === "starting") {
    try {
      console.log("🔍 Checking task status...");
      taskStatus = (await getReplicationTaskStatus()) ?? "unknown";
      console.log(`⏳ Current task status: ${taskStatus}`);

      if (taskStatus !== "running" && taskStatus !== "starting") break;
      await delay(delaySeconds); // Wait for the specified delay time before checking again
    } catch (error) {
      console.error("❌ Error checking task status:", error);
      break;
    }
  }
};
