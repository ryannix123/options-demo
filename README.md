# 🧪 Options Market Dashboard – Containerized Node.js Demo

Containerizing your applications gives you **portability**, **consistency**, and **speed**. With a containerized Node.js app like this one, you can:
- 🚀 Run your app the same way on your laptop, on a server, or in the cloud
- 📦 Package dependencies and configuration into a single reproducible unit
- 🔐 Improve security by running as a non-root user
- 🛠️ Deploy faster and more reliably on platforms like Kubernetes and OpenShift

---

This is a simple, containerized **Node.js + Express** application that displays real-time market data using the [Finnhub.io](https://finnhub.io) API. It's designed to demonstrate best practices for containerizing a Node.js app using Podman and deploying it to a container registry like Quay.io.

## 🔍 Features

- Built on **Red Hat UBI 9 + Node.js 18** (non-root friendly for OpenShift)
- Uses **EJS templates** for rendering a dynamic dashboard
- Fetches real-time stock, futures, and ETF data from Finnhub
- Logo display and layout formatting for demo polish
- Configurable via `FINNHUB_KEY` environment variable

---

## 🚀 Demo Steps

### 1. 🔨 Build the container
```bash
podman build -t nt-demo -f Dockerfile .
```

### 2. 📦 List your images
```bash
podman images
```

### 3. 🌍 Run the container with your API key
```bash
podman run -d -it --name nt-demo \
  -p 8080:8080 \
  -e FINNHUB_KEY=your_finnhub_key \
  localhost/nt-demo
```

Visit [http://localhost:8080](http://localhost:8080) in your browser to view the dashboard.

> 📝 Replace `your_finnhub_key` with your actual Finnhub API key. You can obtain a free API key by registering at [https://finnhub.io/register](https://finnhub.io/register).

### 4. 🛑 Stop the container
```bash
podman stop nt-demo
```

### 5. 🏷️ Tag the image for pushing to Quay.io
```bash
podman tag nt-demo:latest quay.io/your_repo/options_demo:latest
```

### 6. 🚀 Push to Quay.io
```bash
podman push quay.io/your_repo/options_demo:latest
```

> 📝 Replace `your_repo` with your Quay.io username or organization.

---

## 📁 Project Structure

```
.
├── Dockerfile         # Container definition
├── index.js           # Express server
├── views/             # EJS template
│   └── index.ejs
├── imgs/              # Static assets (e.g., logo.jpg)
├── package.json
└── README.md
```

---

## 🛡️ License

MIT — for demo purposes only.
