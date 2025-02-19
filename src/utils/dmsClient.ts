import { DatabaseMigrationServiceClient } from "@aws-sdk/client-database-migration-service";
import dotenv from "dotenv";

dotenv.config();

export const dmsClient = new DatabaseMigrationServiceClient({
  region: process.env.REPLICATION_REGION!,
  credentials: {
    accessKeyId: process.env.REPLICATION_ACCESS_KEY_ID!,
    secretAccessKey: process.env.REPLICATION_SECRET_ACCESS_KEY!,
  },
});
