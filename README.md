# 🚀 AWS DMS Automation Script 🎯

## This project is an automation script for managing AWS Database Migration Service (DMS) replication tasks. It is built using TypeScript and utilizes the AWS SDK for JavaScript

### 🚀 Usage

This script helps you start AWS DMS replication tasks with ease. It

- ✅ Validates required environment variables.
- ✅ Initializes the AWS DMS client.
- ✅ Manages the replication tasks automatically.
- ✅ Waits in a loop, while the status is updated to the screen every minute.

### 🚀 Purpose

#### This script exists because I'm cost-conscious. 💰😆 Instead of letting an expensive dms.r5.large instance run indefinitely, I use this automation to start, and manage AWS DMS replication tasks efficiently

- ✅ Transfers data using a dms.r5.large instance for faster migrations.
- ✅ Allows me to manually downgrade the instance after migration to save costs.
- ✅ Prevents unnecessary AWS charges by stopping tasks when not in use.

Because why pay more when a little automation can keep things efficient? 🤖💸

### 🔧 Environment Variables

Set the following environment variables in your .env file

- 🌍 REPLICATION_REGION: AWS region where your DMS replication task is located.
- 🔑 REPLICATION_ACCESS_KEY_ID: Your AWS access key ID.
- 🔒 REPLICATION_SECRET_ACCESS_KEY: Your AWS secret access key.
- 📜 REPLICATION_TASK_ARN: The ARN of the DMS replication task.
- 🖥️ REPLICATION_INSTANCE_ARN: The ARN of the DMS replication instance.

### 📂 Project Structure

```sh
aws-dms-automation
├── src
│   └── index.ts           # 🚀 Entry point of the script
├── package.json           # 📦 npm configuration file
├── tsconfig.json          # ⚙️ TypeScript configuration file
├── README.md              # 📖 Project documentation
└── .env.example           # 🔑 Example .env file
```

### ⚡ Installation

#### Clone the repository

```sh
git clone git@github.com:kcflan/aws-dms-automation.git
cd aws-dms-automation
```

#### Install the dependencies

```sh
npm install
```

#### Run the script

```sh
npm run start
```

### 🐳 Want to run this in  Docker? No problem 🚀

#### Build the Docker image

```sh
npm run docker:build
```

#### Run the Docker container

```sh
npm run docker:run
```

### 📜 License

### This project is licensed under the MIT License. See the LICENSE file for more details

Happy automating! 🎉🚀
