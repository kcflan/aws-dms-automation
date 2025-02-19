import { DatabaseMigrationServiceClient } from "@aws-sdk/client-database-migration-service";
import { mockClient } from "aws-sdk-client-mock";
import { main } from "./index";
import { startDMSReplication, stopDMSReplication } from "./tasks/replicationTasks";

const dmsMock = mockClient(DatabaseMigrationServiceClient);

jest.mock("./tasks/replicationTasks");

describe("Main Function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should start and stop the replication task successfully", async () => {
    (startDMSReplication as jest.Mock).mockResolvedValue(undefined);
    (stopDMSReplication as jest.Mock).mockResolvedValue(undefined);

    console.log = jest.fn();
    console.error = jest.fn();

    await main();

    expect(startDMSReplication).toHaveBeenCalled();
    expect(stopDMSReplication).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("✅ DMS CDC Task completed and stopped.");
    expect(console.error).not.toHaveBeenCalled();
  });

  it("should handle errors gracefully", async () => {
    const error = new Error("Test error");
    (startDMSReplication as jest.Mock).mockRejectedValue(error);

    console.log = jest.fn();
    console.error = jest.fn();

    await main();

    expect(startDMSReplication).toHaveBeenCalled();
    expect(stopDMSReplication).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith("❌ Error in DMS automation:", error);
  });
});
