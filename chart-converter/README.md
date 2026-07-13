# Chart Converter 

### Context
---
In the medical industry, each doctor or nurse practitioner has their own format that they require their charts or patient data to be in.  The task to transpose this data from one chart format to another is put on nurses in addition to thier already overwelming patient workload.  

### Objective
---
This application is desgined to help nurses convert patient charts for different doctors.  By handing off a large part of the chart generation to AI, we can effectivly transpose the data from one doctor's form to another in seconds.  

### Important Note 
---
AI is far from perfect at follwing prompts.  Nurses will still need to check the transposed chart for accuracy and edit accordingly.  

This application is not a full replacement for charting, but is meant to help shorten the amount of work needed to be done by the nurse.  

## HIPPA Compliance and Security 
This application attempts to be HIPPA complient by using the following practices:
 - No patient data is being collected or stored on the server.  
 - All patient data stored in memory and fed into the model is overwritten when the client closes the connection.  
 - All network communications have transport layer security using id-ecPublicKey-384 (better than the military grade AES-256).
 
 - A firewall (in production) only allows connections from the local area network (LAN).  


