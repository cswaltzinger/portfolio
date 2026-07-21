## Chris Waltzinger Portfolio: Systems & Tooling

This repository is a collection of my personal projects focusing on systems programming, CLI productivity tools, and API integrations. Each project is designed to be lightweight, functional, and easy to deploy.

---

### Overview

| Project | Description | Primary Stack  |
| :--- | :--- | :---  |
| [**`bare-server/`**](./bare-server/) | A minimalist C web server with `chroot` isolation. | C, POSIX Sockets |
| [**`chart-converter/`**](./chart-converter/) |  A simple AI chat interface to help nurses create/transpose patient charts.  | HTML, CSS, Javascript, Docker Model Runner |
| [**`data/`**](./data/) | A CLI-based key-value and relational data store. | SQLite, Bash |
| [**`gemeni/`**](./gemeni/) | A voice-assistant style API wrapper for Google's Generative AI. | HTML, CSS, Javascript, Google Generative AI API |
| [**`git-ignore/`**](./git-ignore/) | Custom Git extension for `.gitignore` file management. | Bash / Sh / Zsh , C |
| [**`security/`**](./security/) | Utility scripts for high level Netcat and OpenSSL workflows. | Bash / Sh / Zsh, OpenSSL, Netcat |
| [**`pawk/`**](./pawk/) | A Python interpretation of the unix `awk` utility | python, bash, data parsing |
| [**`simple-problems/`**](./simple-problems/) | HTML documents that are designed to solve one specific problem | HTML, CSS, Javascript |


---



#### 1. Bare Server

A HTTP server written in C. Unlike standard development servers, this implements a **chroot jail** to ensure the server cannot access files outside of its designated directory, providing a layer of security for static file hosting.

* **Key Feature:** Low-level socket handling and process isolation.

---

#### 2. Chart Converter

A simple chart conversion software written in nodejs  to help nurses convert patient charts for different doctors.  By handing off a large part of the chart generation to AI, we can effectively transpose the data from one doctor's form to another in seconds.  

* **Key Feature:** Applies secure coding practices to secure patient medical data.   

---

#### 3. CLI Data store

This tool allows you to treat your terminal as a database. It uses **SQLite** to ensure data integrity while providing a clean command-line interface for `CRUD` operations.

* **Key Feature:** Uses SQLite under the hood to guarantee data integrity for stored values.
* **Example:** `data set "api_key" "12345"`

---

#### 4. Gemeni API

A conversational wrapper for the Gemini API. It is designed to function as a minimal digital assistant, processing natural language queries and returning structured data, mimicking the "Siri" user experience for terminal or app integration.

* **Key Feature:** Implements exponential backoff with jitter when retrying rate-limited API calls.

---

#### 5. Git Ignore extension

A workflow tool that allows you to manage `.gitignore` files without manual editing. It enables users to quickly add templates or specific file patterns directly from the command line.

* **Example:** `git ignore node_modules`

---

#### 6. Security

A toolkit for network debugging and encryption. These scripts abstract the complex flags of **Netcat** and **OpenSSL** to perform tasks like:

* **Key Feature:** Generating keypairs for asymmetric encryption
* **Key Feature:** Encrypting files or text
* **Key Feature:** Generating a sha256 hash digest.
* **Key Feature:** Port scanning and listener setup.
* **Key Feature:** Socket connection and data transfers.
* **Key Feature:** Basic MQTT subscription and publishing.

---

#### 7. Pawk Utility

`pawk` is a python interpretation of the standard unix tool `awk`. It allows users to parse large files with a faster learning curve than the traditional `awk` utility as it is based in python.

* **Example:** see [`pawk/README.md`](./pawk/README.md)

---

#### 8. Simple-Problems

HTML documents that are designed to solve one specific problem. They are mostly intuitive GUIs and should be easily usable in a browser.

---

### Getting Started

1) clone this repository:
    ```bash 
    git clone https://github.com/cswaltzinger/portfolio.git path/to/destination
    ```
2) Then simply go into each repository and follow its README.md instructions to build/run the programs 

### NOTE:
The following are common dependencies within this project and require thier listed version number or newer:
- Openssl: LibreSSL 3.3.6
- GNU Make: 4.3
- gcc: 13.3.0
- sqlite3: 3.39.5
- GNU bash: 3.2.57
- Docker Desktop: 4.79.0
- Docker Model Runner: 1.2.1
- NodeJS: 20.11.0
- Npm: 10.2.4
- Python: 3.9.6
