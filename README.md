# 🎯 PlacementCopilot AI — Campus Placement & ATS Interview Accelerator
*Engineered for Lovely Professional University — Edu Revolution 2026*

An in-situ, zero-dependency local-first AI platform built to solve the #1 hurdle of engineering college students: **Passing company ATS screening and clearing technical campus interviews for TCS, Amazon, Accenture, Infosys, and Google.**

---

## 🌟 Key Modules

1. **📄 ATS Resume Matcher & Diagnostic Engine:**
   - Evaluates student resumes against verified recruitment criteria of top campus recruiters.
   - Computes quantified **0–100% Match Scores**, highlights critical missing skills, and flags weak action verbs.
   - 1-Click **Google X-Y-Z Bullet Point Rewriter** (*"Accomplished [X] as measured by [Y], by doing [Z]"*).

2. **🎙️ Live AI Mock Interview Simulator:**
   - Generates real company-specific DSA, System Design, and Behavioral/HR questions.
   - Built-in **Web Speech Voice Synthesizer** (interviewer reads questions aloud).
   - Real-time evaluation grading: Technical Correctness (1–10), Communication (1–10), Identified Gaps, and Staff Engineer Benchmark answers.

3. **🏢 Campus Placement Rounds Vault:**
   - Curated hiring blueprints, CTC packages, round structures, and focus areas for top campus recruiters.

4. **📊 Performance Report & CSV Exporter:**
   - Generates instant downloadable diagnostic summaries for placement coordinators and students.

---

## 🚀 How to Run in VS Code on macOS

1. Open **Visual Studio Code**.
2. Press `Cmd + O` and open this folder:
   ```
   /Users/priyanshuyadav/.gemini/antigravity/scratch/placement-copilot
   ```
3. Open the Integrated Terminal in VS Code (`Ctrl + ~` or top menu `Terminal -> New Terminal`).
4. Run the local dashboard:
   ```bash
   python3 main.py --web
   ```
5. Open your browser at:
   ```
   http://localhost:8080
   ```

---

## 📊 Running in Terminal CLI Mode
If you prefer running diagnostics directly inside your command line:
```bash
python3 main.py --cli
```

---

## 🔒 Privacy & Architecture
- **Zero External Dependencies:** Runs on pure Python 3 standard library.
- **Dual-Inference Engine:** Sub-second Groq LPU inference with resilient deterministic offline fallbacks.
- **Client-Side Privacy:** Student resume data never leaves the local machine.
