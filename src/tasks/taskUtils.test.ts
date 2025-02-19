import { dmsClient } from "../utils/dmsClient";
import { getReplicationTaskStatus, waitForTaskCompletion } from "./taskUtils";

jest.mock("@aws-sdk/client-database-migration-service");
jest.mock("../utils/dmsClient");

describe("taskUtils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getReplicationTaskStatus", () => {
    it("should return the replication task status", async () => {
      const mockStatus = "running";
      (dmsClient.send as jest.Mock).mockResolvedValue({
        ReplicationTasks: [{ Status: mockStatus }],
      });

      const status = await getReplicationTaskStatus();
      expect(status).toBe(mockStatus);
    });

    it("should return undefined if no replication tasks are found", async () => {
      (dmsClient.send as jest.Mock).mockResolvedValue({
        ReplicationTasks: [],
      });

      const status = await getReplicationTaskStatus();
      expect(status).toBeUndefined();
    });

    it("should throw an error if the request fails", async () => {
      const mockError = new Error("Request failed");
      (dmsClient.send as jest.Mock).mockRejectedValue(mockError);

      await expect(getReplicationTaskStatus()).rejects.toThrow(mockError);
    });
  });

  describe("waitForTaskCompletion", () => {
    it("should wait until the task is no longer running or starting", async () => {
      const mockStatusSequence = ["starting", "running", "completed"];
      let callCount = 0;

      (dmsClient.send as jest.Mock).mockImplementation(() => {
        return Promise.resolve({
          ReplicationTasks: [{ Status: mockStatusSequence[callCount++] }],
        });
      });

      const delaySpy = jest.spyOn(global, "setTimeout").mockImplementation((fn, timeout) => {
        fn();
        return {} as any;
      });

      await waitForTaskCompletion();

      expect(callCount).toBe(3);
      expect(delaySpy).toHaveBeenCalledTimes(2);

      delaySpy.mockRestore();
    });

    it("should handle errors during status checks", async () => {
      const mockError = new Error("Request failed");
      (dmsClient.send as jest.Mock).mockRejectedValue(mockError);

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      await waitForTaskCompletion();

      expect(consoleErrorSpy).toHaveBeenCalledWith("❌ Error checking task status:", mockError);
    });
  });
});
