This documentation outlines the complete technical and strategic blueprint for **Ourlens**, the AI-powered Home Hazard Perception PWA.

---

## **Project Overview: Ourlens**

* **Goal:** A mobile-first PWA that identifies household hazards for elderly safety using AI.
* **Target Device:** iOS and Android (via browser).
* **Core Logic:** Capture video/images → Extract frames → Analyze via Multimodal AI → Generate Report.
* **Budget:** $250 USD | **Timeline:** 6 Weeks.

---

## **1. System Architecture**

We are using a **"Thin Client, Heavy Engine"** model to keep the app fast and secure.

* **Frontend:** **Astro** (Base) + **React** (Interactive Camera Island).
* **Backend / Orchestration:** **n8n** (Self-hosted on Docker/Hetzner).
* **AI Engine:** **OpenRouter** (calling **Gemini 1.5 Flash**).
* **Storage:** `localStorage` (Client-side) for session/history.

---

## **2. Detailed Project Screens**

| Screen | Technical Focus | Description |
| --- | --- | --- |
| **Access Control** | Astro + API Fetch | Form to validate the **Invitation Code** against n8n. |
| **Instructional Home** | Astro Static | High-contrast UI explaining "How to scan your home." |
| **Camera Scanner** | **React + WebRTC** | The "React Island." Live view with frame extraction logic. |
| **Processing** | CSS Animation | "Scanning..." overlay while awaiting n8n response. |
| **Safety Report** | Astro + JSON | Displaying hazards with "Hazard Name" and "Fix Recommendation." |

---

## **3. Technical Implementation Details**

### **A. The Camera Logic (React Island)**

To avoid crashing your n8n instance with 50MB video files, the React component uses a **"Snapshot Strategy"**:

1. Access the camera via `navigator.mediaDevices.getUserMedia`.
2. If the user chooses "Video," the app records for 3 seconds.
3. Every 0.75 seconds, a frame is drawn to a hidden `<canvas>`.
4. The canvas is resized to **1024px width** and compressed to **JPEG (0.7 quality)**.
5. All frames are converted to **Base64 strings** and sent as a single JSON array to n8n.

### **B. The n8n Workflow**

Your n8n instance (hosted on your Hetzner VPS) will follow this flow:

1. **Webhook Node:** Receives the code and image array.
2. **IF Node:** Checks the invitation code.
3. **HTTP Request Node (OpenRouter):**
* **Model:** `google/gemini-flash-1.5`.
* **Prompt:** A "Hidden System Prompt" instructing the AI to act as a Safety Consultant.


4. **Data Transformation Node:** Clean the AI output into a standard JSON format.
5. **Respond to Webhook:** Send the clean report back to Astro.

### **C. PWA Configuration**

To make it feel like a real app:

* **Manifest.json:** Set `display: standalone` and `orientation: portrait`.
* **Service Worker:** Cache the logo and basic UI so it loads instantly even on weak 4G/5G connections.
* **iOS Fix:** Include a manual "Add to Home Screen" pop-up for iPhone users to ensure full camera permissions.

---

## **4. The "Hidden Prompt" (The Intelligence)**

This is the secret sauce you are providing. The AI will receive this prompt along with the images:

> "Analyze these photos of a home interior. Identify physical objects that pose a high fall or injury risk for an elderly person with limited mobility. Ignore people or pets. Format your response exactly as: 1. Hazard Name, 2. Risk Level (Low/High), 3. Actionable Recommendation."

---

## **5. Security & Privacy Strategy**

* **No Image Storage:** Configure n8n to **NOT** save binary files to the disk. Images exist only in RAM during the analysis and are deleted immediately after.
* **Access Codes:** Simple per-client codes managed via a Static Data node in n8n. No database required.

---

## **6. Development Timeline (6 Weeks)**

* **Week 1-2: Frontend Base & PWA.** Setup Astro, Tailwind, and the "Invitation" logic.
* **Week 3: The Camera Island.** Build the React component for frame extraction and compression.
* **Week 4: n8n & AI Integration.** Build the workflow, test OpenRouter prompts, and optimize latency.
* **Week 5: UI/UX Polishing.** Add the "Processing" animations and the "Safety Report" card designs.
* **Week 6: Testing & Delivery.** Test on Android/iOS, fix bugs, and hand over the "members area" link to the client.

---

## **7. Key Considerations for the Client**

* **Privacy:** The app is "stateless"—we don't store their home's photos.
* **Compatibility:** Works on any smartphone with a modern browser.
* **Future-Proof:** Using n8n allows us to add the "Future Self" video project next month using the same infrastructure.

**Does this documentation cover everything you need to start the coding phase, or should I detail the React "Capture" code specifically?**
