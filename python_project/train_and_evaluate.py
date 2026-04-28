import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    precision_recall_curve, average_precision_score, 
    confusion_matrix, classification_report, roc_auc_score
)
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE
import joblib

"""
CREDIT CARD FRAUD DETECTION - ML PIPELINE
-----------------------------------------
Author: Fraud Alchemists (Student Project)
Purpose: Binary classification for imbalanced fraud data
"""

# 1. SYNTHETIC DATA GENERATION (Simulating Kaggle's Credit Card Data)
def generate_synthetic_data(n_samples=10000):
    print(f"[*] Generating {n_samples} synthetic transactions...")
    np.random.seed(42)
    
    # Feature engineering simulation (V1-V28 are usually PCA components)
    data = np.random.randn(n_samples, 28)
    columns = [f'V{i}' for i in range(1, 29)]
    df = pd.DataFrame(data, columns=columns)
    
    # Adding Amount and Time
    df['Time'] = np.linspace(0, 100000, n_samples)
    df['Amount'] = np.random.exponential(scale=100, size=n_samples)
    
    # Target: 1% Fraud cases
    df['Class'] = 0
    fraud_indices = np.random.choice(df.index, size=int(n_samples * 0.01), replace=False)
    df.loc[fraud_indices, 'Class'] = 1
    
    # Add fraud patterns: Higher amount, specific PCA shifts
    df.loc[df['Class'] == 1, 'Amount'] *= 5
    df.loc[df['Class'] == 1, 'V1'] += 2.0
    
    return df

# 2. PREPROCESSING & SPLITTING
def preprocess_data(df):
    print("[*] Preprocessing data...")
    X = df.drop('Class', axis=1)
    y = df['Class']
    
    # Normalize amount and time
    scaler = StandardScaler()
    X[['Amount', 'Time']] = scaler.fit_transform(X[['Amount', 'Time']])
    
    return train_test_split(X, y, test_size=0.2, random_state=42, stratify=y), scaler

# 3. HANDLING IMBALANCE & TRAINING
def train_model(X_train, y_train):
    print("[*] Applying SMOTE for class imbalance...")
    smote = SMOTE(random_state=42)
    X_res, y_res = smote.fit_resample(X_train, y_train)
    
    print("[*] Training XGBoost Classifier...")
    model = XGBClassifier(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
        scale_pos_weight=1, # Not needed if using SMOTE, but useful for raw training
        use_label_encoder=False,
        eval_metric='logloss'
    )
    model.fit(X_res, y_res)
    return model

# 4. EVALUATION & VISUALIZATION
def evaluate_model(model, X_test, y_test):
    print("[*] Evaluating performance...")
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
    
    # Metrics
    print("\n--- PERFORMANCE REPORT ---")
    print(classification_report(y_test, y_pred))
    print(f"ROC-AUC: {roc_auc_score(y_test, y_prob):.4f}")
    print(f"Avg Precision-Recall Score: {average_precision_score(y_test, y_prob):.4f}")
    
    # Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(6, 4))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
    plt.title('Confusion Matrix')
    plt.ylabel('Actual')
    plt.xlabel('Predicted')
    plt.savefig('confusion_matrix.png')
    
    # PR Curve
    precision, recall, _ = precision_recall_curve(y_test, y_prob)
    plt.figure(figsize=(8, 6))
    plt.step(recall, precision, color='b', alpha=0.2, where='post')
    plt.fill_between(recall, precision, step='post', alpha=0.2, color='b')
    plt.xlabel('Recall')
    plt.ylabel('Precision')
    plt.title('2-class Precision-Recall Curve')
    plt.savefig('precision_recall_curve.png')
    print("[+] Plots saved as PNG files.")

if __name__ == "__main__":
    df = generate_synthetic_data(20000)
    (X_train, X_test, y_train, y_test), scaler = preprocess_data(df)
    model = train_model(X_train, y_train)
    evaluate_model(model, X_test, y_test)
    
    # Save assets
    joblib.dump(model, 'fraud_model.pkl')
    joblib.dump(scaler, 'scaler.pkl')
    print("[+] Model and Scaler saved successfully.")
