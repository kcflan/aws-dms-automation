# 🚀 AWS DMS Automation Script 🎯

Effortlessly manage your AWS Database Migration Service (DMS) replication tasks using this automation script, built with TypeScript and the AWS SDK for JavaScript. Save costs and streamline your data migrations!

---

## 📋 Features

- ✅ Validates Required Environment Variables – Ensures all necessary configurations are set.
- ✅ Initializes AWS DMS Client – Seamless integration with AWS.
- ✅ Manages Replication Tasks – Automates the start and stop of tasks efficiently.
- ✅ Real-Time Status Updates – Monitors and updates the task status every 60 seconds (configurable).

---

## 🎯 Purpose

[My $77 lesson](./MIGRATION.md). I had to start replication instance's task over and over, so I automated it from the command line instead of watching the UI.

### 💰 Cost-Effective Migration Management

Why let an expensive **dms.r6i.32xlarge** instance run indefinitely? This script automates the start and stop of DMS replication tasks, allowing you to:

- 🚀 Use a **dms.r6i.32xlarge** instance for faster data transfers if you fancy.
- 🔄 Manually downgrade the instance post-migration to minimize costs.
- 💸 Avoid unnecessary charges by stopping tasks when not needed.

Because a little automation goes a long way in saving costs! 🤖💵

---

## 🚀 Getting Started

### 1. Clone the repository

```sh
git clone git@github.com:kcflan/aws-dms-automation.git
cd aws-dms-automation
```

### 2. Install the dependencies

```sh
npm install
```

### 3. Configure Environment Variables

Create an .env file in the root directory and fill it out using the .env.example as a guide.

Required Environment Variables:

```env
🌍 REPLICATION_REGION: AWS region where your DMS replication task is located.
🔑 REPLICATION_ACCESS_KEY_ID: Your AWS access key ID.
🔒 REPLICATION_SECRET_ACCESS_KEY: Your AWS secret access key.
📜 REPLICATION_TASK_ARN: The ARN of the DMS replication task.
🖥️ REPLICATION_INSTANCE_ARN: The ARN of the DMS replication instance.
```

Optional Environment Variables:

```env
🕰️ DELAY_SECONDS: (default every 60 seconds for a display message)
🔄 RESTART_AFTER_FAILURE: (default false, set true if you want the script to keep going and retry on a failed task)
```

## 🛠️ Build and Run

### 4. Build the Project

```sh
npm run build
```

### 5. Run the Script

```sh
npm run start
```

### 🐳 Docker Support

Build the Docker Image

```sh
npm run docker:build
```

Run the Docker Container

```sh
npm run docker:run
```

### 📜 License

This project is licensed under the MIT License. See the LICENSE file for more details.

Happy automating, you frugal bees! 🎉🚀🪙🐝
