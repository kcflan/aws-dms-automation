# On Migrating Rock RMS SQL Database  

## Using AWS DMS and Azure Data Factory  

---

## Overview  

I recently migrated a Rock RMS SQL database using:  

- **AWS Database Migration Service (DMS)** to Amazon S3  
- **Azure Data Factory** to Azure Data Lake  

This dual approach wasn’t planned. I initially chose AWS DMS after confirming with the team if using AWS was acceptable. However, after completing the migration to **S3**, I learned the team preferred using **Azure**, so to align with the organization’s cloud strategy, I switched to **Azure Data Factory** and moved the data to **Azure Data Lake**.  

---

## Why Two Solutions?  

I started with **AWS DMS** because the plan was to analyze the data in **Athena** after migrating it to **S3**, and I had received approval to use AWS.

Once I discovered that the team preferred Azure and that the original SQL Server was located there, I adjusted the approach to ensure consistency with their cloud strategy. Using **Azure Data Factory**, I moved the data to an **Azure Data Lake**.  

- **AWS DMS → S3**: Cost $77  
- **Azure Data Factory → Data Lake**: Cost $25  

---

## Key Learnings  

### 1. Align Early with Cloud Strategy  

Even when given flexibility in tool choice, it’s crucial to align with the team’s preferred cloud platform. Knowing the organization's strategic direction avoids unnecessary migrations and costs.  

### 2. Cost Efficiency Matters  

Azure Data Factory was nearly three times cheaper than AWS DMS for this migration. Matching the tools to the organization’s primary cloud platform saved both time and money.  

### 3. Familiarity vs. Strategy  

- **AWS DMS**: Easy to set up and reliable for replication, but not the best fit for the organization’s Azure-centric strategy.  
- **Azure Data Factory**: Seamlessly integrated within Azure’s ecosystem, making it a better long-term choice.  

Choosing tools based on organizational strategy, rather than familiarity, led to a more streamlined process.  

---

## What Would I Do Differently?  

- **Confirm the preferred cloud platform** early on, even when tool flexibility is allowed.  
- **Choose tools that align with the team's strategy** to avoid extra migrations.  
- **Plan with the end state in mind**, ensuring data is in the platform where it will be used.  

---

## Final Thoughts  

This migration highlighted the importance of strategic alignment over familiarity with tools. While the dual-cloud approach wasn’t planned, it emphasized the need to understand organizational preferences before choosing solutions.  

Would I do it the same way again? No. But the experience reinforced the value of aligning with team strategies and cost efficiency.  

---

## Recommendations  

1. **Align with Organizational Strategy**: Confirm the team’s preferred cloud platform before selecting tools.  
2. **Evaluate Costs**: Compare pricing between cloud solutions before committing.  
3. **Choose Tools Strategically**: Select tools that align with the organization's long-term strategy for cost and efficiency gains.  

Questions or feedback? Feel free to reach out!  
