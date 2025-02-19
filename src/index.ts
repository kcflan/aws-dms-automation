import dotenv from "dotenv";
import { startDMSReplication, stopDMSReplication } from "./tasks/replicationTasks";
import { validateEnv } from "./utils/env";

dotenv.config();
validateEnv();

// Main function to start and stop the replication task
const main = async () => {
  try {
    await startDMSReplication();
    await stopDMSReplication();
    console.log("✅ DMS CDC Task completed and stopped.");
  } catch (error) {
    console.error("❌ Error in DMS automation:", error);
  }
};

main();
