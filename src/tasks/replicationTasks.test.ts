import { StopReplicationTaskCommand } from "@aws-sdk/client-database-migration-service";
import { startDMSReplication, stopDMSReplication } from "../../src/tasks/replicationTasks";
import { getReplicationTaskStatus, waitForTaskCompletion } from "../../src/tasks/taskUtils";
import { dmsClient } from "../../src/utils/dmsClient";

jest.mock("@aws-sdk/client-database-migration-service");
jest.mock("../../src/utils/dmsClient");
jest.mock("../../src/tasks/taskUtils");

describe("DMS Replication Tasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REPLICATION_TASK_ARN = "test-arn";
  });

  describe("startDMSReplication", () => {
    it("should start the replication task if the task status is valid", async () => {
      (getReplicationTaskStatus as jest.Mock).mockResolvedValue("ready");
      (dmsClient.send as jest.Mock).mockResolvedValue({});
      (waitForTaskCompletion as jest.Mock).mockResolvedValue({});

      await startDMSReplication();

      expect(waitForTaskCompletion).toHaveBeenCalled();
    });

    it("should not start the replication task if the task status is invalid", async () => {
      (getReplicationTaskStatus as jest.Mock).mockResolvedValue("testing");

      await startDMSReplication();

      expect(dmsClient.send).not.toHaveBeenCalled();
    });

    it("should handle errors gracefully", async () => {
      (getReplicationTaskStatus as jest.Mock).mockRejectedValue(new Error("Test error"));

      await startDMSReplication();

      expect(dmsClient.send).not.toHaveBeenCalled();
    });
  });

  describe("stopDMSReplication", () => {
    it("should stop the replication task if it is running", async () => {
      (getReplicationTaskStatus as jest.Mock).mockResolvedValue("running");
      (dmsClient.send as jest.Mock).mockResolvedValue({});

      await stopDMSReplication();

      expect(dmsClient.send).toHaveBeenCalledWith(expect.any(StopReplicationTaskCommand));
    });

    it("should not stop the replication task if it is not running", async () => {
      (getReplicationTaskStatus as jest.Mock).mockResolvedValue("ready");

      await stopDMSReplication();

      expect(dmsClient.send).not.toHaveBeenCalled();
    });

    it("should handle errors gracefully", async () => {
      (getReplicationTaskStatus as jest.Mock).mockRejectedValue(new Error("Test error"));

      await stopDMSReplication();

      expect(dmsClient.send).not.toHaveBeenCalled();
    });
  });
});
