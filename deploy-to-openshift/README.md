# 🚀 Deploying Options Dashboard on OpenShift (Red Hat Developer Sandbox)

This guide walks you through deploying the containerized **Options Market Dashboard** application to the [Red Hat Developer Sandbox](https://developers.redhat.com/developer-sandbox), and applying a **Horizontal Pod Autoscaler (HPA)** to enable dynamic scaling.

## 🧰 Prerequisites

- A free account at [developers.redhat.com](https://developers.redhat.com/developer-sandbox)
- Access to OpenShift Web Console or CLI (`oc`)
- A container image pushed to Quay (e.g., `quay.io/ryan_nix/options_demo`)
- A [free API key from Finnhub.io](https://finnhub.io/register)

---

## 🔐 Step 0: Add Your Finnhub API Key as a Secret

Before deploying the app, store your API key securely in OpenShift:

```bash
oc create secret generic finnhub-secret \
  --from-literal=FINNHUB_KEY=your_finnhub_key
```

> Replace `your_finnhub_key` with your actual Finnhub API key.

---

## 🔄 Step 1: Deploy the Container on OpenShift

1. Log into the Developer Sandbox at [https://console.redhat.com/openshift](https://console.redhat.com/openshift)
2. Create or select a project (namespace), e.g. `ryan-nix-dev`
3. Create a deployment using your Quay image:

   ```bash
   oc new-app quay.io/your_repo/options_demo --name=options
   ```

4. Set the secret as an environment variable in your deployment:

   ```bash
   oc set env deployment/options --from=secret/finnhub-secret
   ```

5. Expose the app with a public route:

   ```bash
   oc expose svc/options
   ```

6. View the app by clicking the route in the OpenShift Web Console

---

## 📈 Step 2: Apply the Horizontal Pod Autoscaler (HPA)

To enable automatic scaling based on CPU usage:

1. Review and apply the `hpa.yml` file:

   ```bash
   oc apply -f hpa.yml
   ```

This configuration:
- Scales between **1 and 3 pods**
- Triggers scaling if average CPU usage exceeds **50%**
- Uses **gentle scaling behavior** to avoid rapid fluctuations

---

## 📁 Files

```
openshift/
├── hpa.yml               # Deployment + Horizontal Pod Autoscaler
└── README.md             # This file
```

---

## 💡 Tip

You can monitor HPA status with:
```bash
oc get hpa options-hpa
```

And view live metrics in the **Developer Sandbox Web Console → Observe → Metrics** section.

---

## 🛡️ License

MIT — for demo purposes only.
