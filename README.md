# 🛡️ Credit Card Fraud Detection System

**A production-ready end-to-end Machine Learning system for real-time transaction monitoring.**

---

## 🚀 Project Overview
This project simulates a modern banking fraud detection infrastructure. It handles highly imbalanced transaction data using advanced classification techniques (XGBoost, SMOTE) and serves predictions via a high-performance REST API.

### Key Features
- **Real-time Scoring API**: Built with Express (simulated FastAPI) for <300ms inference.
- **Fraud Ops Dashboard**: Interactive React-based monitoring with live transaction streams and metric visualizations.
- **MLOps Integration**: Dynamic thresholding to balance Precision vs. Recall (Cost Matrix optimization).
- **Explainable AI (XAI)**: Simulation of SHAP-based feature importance for fraud analyst review.

---

## 🛠️ Tech Stack
- **ML / Data Science**: Python, Scikit-learn, XGBoost, Pandas.
- **Handling Imbalance**: SMOTE (Synthetic Minority Oversampling), Class Weights.
- **Backend API**: Node.js / Express (Simulated Production Scoring Gateway).
- **Frontend Dashboard**: React 19, Vite, Tailwind CSS, Recharts, Framer Motion.
- **Visualization**: Precision-Recall Curves, Confusion Matrix, Live Area Charts.

---

## 📊 Project Architecture
1. **Ingestion**: Raw transaction logs (Amount, Location, Time, Device).
2. **Preprocessing**: Scaling numerical values + One-Hot encoding categorical flags.
3. **Classification**: XGBoost Model identifies patterns indicative of fraud.
4. **Decision Engine**: Custom thresholds trigger "ALLOW", "MONITOR", or "REVIEW" alerts.
5. **Dashboard**: Centralized hub for fraud analysts to manage alerts and system quality.

---

## 📁 Repository Structure
```text
/python_project/       # Local Python Environment
  ├── train_eval.py    # Main ML Pipeline (Training/SMOTE/Evaluation)
  ├── requirements.txt # Python dependencies
/src/                  # Dashboard Source Code
/server.ts             # Scoring API Gateway
/package.json          # Node.js dependencies
```

---

## 🚦 How to Run Locally

### 1. The Web Dashboard & API
```bash
npm install
npm run dev
```
Navigate to `http://localhost:3000` to see the Fraud Ops center.

### 2. The ML Pipeline (Python)
```bash
cd python_project
pip install -r requirements.txt
python train_and_evaluate.py
```

---

## 📈 Model Performance Goals
- **PR-AUC**: > 0.85 (Prioritizing Precision-Recall area over simple Accuracy).
- **Recall @ 1% FPR**: Target > 80% (Detecting most fraud with minimal false alarms).
- **Cost Minimization**: Optimized thresholding to reduce financial loss and operational overhead.

---

## 🎓 Student Portfolio Guide
**Interview Pitch**:
> "I built this system to solve the problem of high-imbalance classification in banking. By using SMOTE and XGBoost, I achieved a high Recall for fraud cases while maintaining operational efficiency through a cost-optimized decision threshold. The dashboard I developed provides real-time visibility for analysts, simulating a production-grade MLOps environment."

**Key Skills Demonstrated**: 
`Imbalanced Learning`, `Model Deployment`, `Full-Stack Development`, `Data Visualization`, `Financial Analytics`.
