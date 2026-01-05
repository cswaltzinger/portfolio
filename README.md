## CSW Portfolio: Systems & Tooling

This repository is a collection of my personal projects focusing on systems programming, CLI productivity tools, and API integrations. Each project is designed to be lightweight, functional, and easy to deploy.

---

### Overview

| Project | Description | Primary Stack |
| --- | --- | --- |
| **`bare-server/`** | A minimalist C web server with `chroot` isolation. | C, POSIX Sockets |
| **`data/`** | A CLI-based key-value and relational data store. | SQLite, Bash |
| **`gemini/`** | A voice-assistant style API wrapper for Google's Generative AI. | HTML, CSS, Javascript, Google Generative AI API |
| **`git-ignore/`** | Custom Git extension for `.gitignore` file management. | Bash / Sh / Zsh |
| **`security/`** | Utility scripts for high level Netcat and OpenSSL workflows. | Bash / Sh / Zsh, OpenSSL, Netcat  |

---



#### 1. Bare-Server

A HTTP server written in C. Unlike standard development servers, this implements a **chroot jail** to ensure the server cannot access files outside of its designated directory, providing a layer of security for static file hosting.

* **Key Feature:** Low-level socket handling and process isolation.

#### 2. Data CLI

This tool allows you to treat your terminal as a database. It uses **SQLite** to ensure data integrity while providing a clean command-line interface for `CRUD` operations.

* **Example:** `data set "api_key" "12345"`

#### 3. Gemini Assistant

A conversational wrapper for the Gemini API. It is designed to function as a minimal digital assistant, processing natural language queries and returning structured data, mimicking the "Siri" user experience for terminal or app integration.

#### 4. Git-Ignore

A workflow tool that allows you to manage `.gitignore` files without manual editing. It enables users to quickly add templates or specific file patterns directly from the command line.

* **Example:** `git ignore node_modules`

#### 5. Security 

A toolkit for network debugging and encryption. These scripts abstract the complex flags of **Netcat** and **OpenSSL** to perform tasks like:

* Generating keypairs for asymetric encryption
* Encrypting files or text 
* Generating a sha256 hash digest.  
* Port scanning and listener setup.
* Socket connection and data transfers.
* Basic MQTT subscription and publishing.

---

### Getting Started

1) clone this repository:
    ```bash 
    git clone origin https://github.com/cswaltzinger/portfolio.git path/to/destination
    ```
2) Then simply go into each repository and follow its README.md instructions to build/run the programs 

### NOTE: 
The following are common dependencies within this project and require thier listed version number or newer:
- Openssl: LibreSSL 3.3.6
- GNU Make: 4.3
- gcc: 13.3.0
- sqlite3: 3.39.5
- GNU bash: 3.2.57