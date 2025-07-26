# Local AI - Simple Setup for Users

This guide helps you set up and run your local Artificial Intelligence with ease, even without technical knowledge.

---

## 🛠️ Requirements

- **Windows 10/11**
- Internet connection to download the model
- Sufficient disk space (minimum 4GB recommended)

---

## 📁 Project Structure

```
/your-folder/
├── config/
│   └── config.json
├── scripts/
│   ├── configure.bat
│   └── install_model.bat
├── app/
│   └── (chatbot files)
└── README.md
```

---

## ⚙️ Initial Setup

1. **Configure the AI name and behavior**

   Run the script below to define these preferences:

   ```bat
   scripts\configure.bat
   ```

   It will ask:
   - Your AI's name (e.g., "Sophia")
   - How it should behave (e.g., "You are a kind and curious assistant.")

   This information will be saved in `config/config.json`.

---

## ⬇️ Model and Ollama Installation

1. Run the script:

   ```bat
   scripts\install_model.bat
   ```

   This command:
   - Downloads and installs Ollama, if needed
   - Checks if the model is already installed
   - If not, it downloads it (example: `llama3`)
   - Everything is done automatically!

---

## 🚀 Run the Chatbot

After configuring, just start the app:

```bash
npm install
npm start
```

---

## 📂 Advanced Configuration (optional)

You can edit the `config/config.json` file directly if you want to manually change the settings saved by the `.bat` file.

```json
{
  "botName": "Sophia",
  "prompt": "You are a kind and curious assistant."
}
```

---

## ❓ Common Issues

- **Terminal closes immediately**: try running the `.bat` file by right-clicking and choosing *Run as administrator*.
- **Model takes time to load**: the first use may take a while as Ollama downloads and prepares the files.

---

## 🧠 About the Model

The model used in this example is `llama3` via [Ollama](https://ollama.com/). You can replace it with another compatible one by adjusting the `install_model.bat` script.

---

## 📃 License

This project is free for personal and educational use. For commercial uses, check the licenses of the models used.