# Credit Card Fraud Detection System 💳🛡️

This directory contains the production-grade Python scripts for local development, model training, and evaluation. Use these for your GitHub repository and local machine testing.

## Files
- `preprocess.py`: Data cleaning and feature engineering (Dtypes, Scaling, Ratios).
- `train.py`: Model training (XGBoost/LightGBM) with imbalanced handling (SMOTE/Class Weights).
- `evaluate.py`: Detailed metrics (PR-AUC, ROC-AUC, Cost Matrix analysis).
- `simulate.py`: Generating synthetic transactions for the scoring API.
- `requirements.txt`: Python dependencies.

## Local Setup
1. `python -m venv venv`
2. `source venv/bin/activate` or `.\venv\Scripts\activate`
3. `pip install -r requirements.txt`
4. `python train.py`
