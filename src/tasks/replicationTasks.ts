import {
  StartReplicationTaskCommand,
  StartReplicationTaskTypeValue,
  StopReplicationTaskCommand,
} from "@aws-sdk/client-database-migration-service";
import dotenv from "dotenv";
import { dmsClient } from "../utils/dmsClient";
import { getReplicationTaskStatus, waitForTaskCompletion } from "./taskUtils";

dotenv.config();

const determineStartType = async (taskStatus: string): Promise<StartReplicationTaskTypeValue> => {
  if (taskStatus && taskStatus !== "creating" && taskStatus !== "ready") {
    return "resume-processing";
  }
  return "start-replication";
};

export const startDMSReplication = async () => {
  try {
    const taskStatus = (await getReplicationTaskStatus()) ?? "unknown";

    const startType = await determineStartType(taskStatus);

    const invalidStates = ["testing", "unknown", "stopping"];
    if (invalidStates.includes(taskStatus)) {
      console.error(`❌ Task is in "${taskStatus}" state. Cannot start the replication process.`);
      return;
    }

    const validStates = ["creating", "ready", "starting", "running"];
    if (validStates.includes(taskStatus)) {
      console.log(`Task is already in ${taskStatus} state. Entering waiting loop.`);
      await waitForTaskCompletion();
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
    await waitForTaskCompletion();
  } catch (error) {
    console.error("❌ Error starting DMS replication task:", error);
  }
};

export const stopDMSReplication = async () => {
  try {
    const taskStatus = await getReplicationTaskStatus();

    if (taskStatus !== "running") {
      console.log(`Task is currently in "${taskStatus}" state. Skipping stop command.`);
      return;
    }

    console.log("🛑 Stopping DMS Replication Task...");
    await dmsClient.send(
      new StopReplicationTaskCommand({
        ReplicationTaskArn: process.env.REPLICATION_TASK_ARN,
      })
    );
    console.log("✅ DMS Replication Task stopped.");
  } catch (error) {
    console.error("❌ Error stopping DMS replication task:", error);
  }
};
