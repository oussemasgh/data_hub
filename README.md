# Large File Uploads PoC (SaaS Video Editor)

I am currently working on a SaaS video editor designed for a specific use case where users frequently need to upload massive raw video files, often reaching sizes up to **12 GB**. 

During early development, I hit a notorious browser limitation: browsers typically struggle, crash, or explicitly block reading single files larger than **2 GB** into memory using standard techniques. I couldn't rely on basic `<input type="file">` and standard HTTP POST requests for files of this magnitude.

I found and implemented a robust solution in this Proof of Concept (PoC) to completely bypass this limitation. 

## The Solution
This project handles 12GB+ files in the browser by orchestrating three key technologies:
- **OPFS (Origin Private File System):** Retrieves and streams the file natively from the user's local disk without loading the entire file into RAM.
- **Web Workers:** Moves the chunking and upload orchestration entirely off the main thread, keeping the UI perfectly smooth.
- **TUS Protocol:** Uses `tus-js-client` to split the file into 5MB chunks and reliably upload them. If the network drops or the tab closes, the upload can be perfectly resumed from the last synced chunk.

## 🤖 AI-Generated "Vibe Coding"
Full disclosure: the code in this specific repository was entirely AI-generated with the help of my assistant. 

I have a strong habit of **"vibe coding."** Whenever I need to solve a complex architectural hurdle for my real project, I extract the problem and test the concept in isolation using AI. This allows me to rapidly prototype, discover nasty edge cases (like OPFS concurrency and browser chunk limitations), and validate the required technologies before doing the actual implementation in my production codebase. 

This repository serves as my successful, working sandbox for reliable large-file uploads. Feel free to use it as a reference!

## Tech Stack
* **Frontend:** Angular, OPFS, Web Workers, `tus-js-client`
* **Backend:** Node.js, Express, `tus-node-server`
