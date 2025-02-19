import {
  DatabaseMigrationServiceClient,
  DescribeReplicationTasksCommand,
  StartReplicationTaskCommand,
} from "@aws-sdk/client-database-migration-service";
import { mockClient } from "aws-sdk-client-mock";
import { startDMSReplication } from "./tasks/replicationTasks";

const dmsMock = mockClient(DatabaseMigrationServiceClient);

describe("startDMSReplication", () => {
  beforeEach(() => {
    dmsMock.reset();
    process.env.REPLICATION_TASK_ARN = "test-arn";
    process.env.REPLICATION_REGION = "test-region";
    process.env.REPLICATION_ACCESS_KEY_ID = "test-access-key";
    process.env.REPLICATION_SECRET_ACCESS_KEY = "test-secret-key";
    process.env.REPLICATION_INSTANCE_ARN = "test-instance-arn";
  });

  it("should start the replication task if it is not running", async () => {
    dmsMock.on(DescribeReplicationTasksCommand).resolves({
      ReplicationTasks: [{ Status: "ready" }],
    });

    dmsMock.on(StartReplicationTaskCommand).resolves({});

    await startDMSReplication();

    expect(dmsMock.commandCalls(StartReplicationTaskCommand)).toHaveLength(1);
    const commandCalls = dmsMock.commandCalls(StartReplicationTaskCommand);
    expect(commandCalls[0].args[0].input).toEqual({
      ReplicationTaskArn: "test-arn",
      StartReplicationTaskType: "start-replication",
    });
  });

  it("should resume the replication task if it is not in 'creating' or 'ready' state", async () => {
    dmsMock.on(DescribeReplicationTasksCommand).resolves({
      ReplicationTasks: [{ Status: "stopped" }],
    });

    dmsMock.on(StartReplicationTaskCommand).resolves({});

    await startDMSReplication();

    expect(dmsMock.commandCalls(StartReplicationTaskCommand)).toHaveLength(1);
    const commandCalls = dmsMock.commandCalls(StartReplicationTaskCommand);
    expect(commandCalls[0].args[0].input).toEqual({
      ReplicationTaskArn: "test-arn",
      StartReplicationTaskType: "resume-processing",
    });
  });

  it("should start the replication task if it is already running", async () => {
    dmsMock.on(DescribeReplicationTasksCommand).resolves({
      ReplicationTasks: [{ Status: "running" }],
    });

    await startDMSReplication();

    expect(dmsMock.commandCalls(StartReplicationTaskCommand)).toHaveLength(1);
    const commandCalls = dmsMock.commandCalls(StartReplicationTaskCommand);
    expect(commandCalls[0].args[0].input).toEqual({
      ReplicationTaskArn: "test-arn",
      StartReplicationTaskType: "resume-processing",
    });
  });

  it("should not start the replication task if it is in 'testing' state", async () => {
    dmsMock.on(DescribeReplicationTasksCommand).resolves({
      ReplicationTasks: [{ Status: "testing" }],
    });

    await startDMSReplication();

    expect(dmsMock.commandCalls(StartReplicationTaskCommand)).toHaveLength(0);
  });

  it("should handle errors gracefully", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    dmsMock.on(DescribeReplicationTasksCommand).rejects(new Error("Test error"));

    await startDMSReplication();

    expect(consoleErrorSpy).toHaveBeenCalledWith("❌ Error starting DMS replication task:", expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
});
