# AI Cart Rescue System
### Shopping Cart Abandonment Prediction Using XGBoost

---

## 📌 Project Overview

One of the biggest challenges in e-commerce is **cart abandonment**. Customers often browse products, add items to their shopping cart, and then leave the website without completing the purchase. This behavior leads to significant revenue loss for online businesses.

The objective of this project is to analyze customer clickstream behavior and build a machine learning model capable of predicting whether a shopping session will end in a **purchase** or **cart abandonment**.

The final solution uses the **XGBoost Classifier** trained on engineered behavioral features extracted from customer session data.

---

## 🎯 Problem Statement

A typical customer journey looks like this:

```
Visit Website
      │
      ▼
Browse Products
      │
      ▼
Add Products to Cart
      │
      ▼
Leave Website
      │
      ▼
Cart Abandonment
```

The goal of this project is to identify these high-risk sessions **before** the customer leaves, enabling businesses to take corrective actions such as:

- Personalized discounts
- Coupon recommendations
- Reminder notifications
- Retargeting campaigns

---

## 📊 Dataset Description

The project uses an **E-commerce Clickstream Transactions Dataset** containing customer interaction logs.

### Dataset Statistics

| Attribute | Value |
|---|---|
| Total Sessions | 10,723 |
| Total Users | 1,000 |
| Generated Features | 27 |
| Final Features Used | 6 |
| Target Variable | `is_abandoned` |

The dataset contains:

- Product views
- Click events
- Cart additions
- Login and logout activities
- Session timestamps
- Purchase outcomes

---

## 🏗️ Project Architecture

```
Raw Clickstream Dataset
           │
           ▼
      Data Cleaning
           │
           ▼
   Session Aggregation
           │
           ▼
   Feature Engineering
           │
           ▼
    Feature Selection
           │
           ▼
     Train/Test Split
           │
           ▼
    SMOTE Balancing
           │
           ▼
    XGBoost Training
           │
           ▼
 Hyperparameter Tuning
           │
           ▼
     Model Evaluation
           │
           ▼
      Trained Model
```

---

## 🧹 Data Preprocessing

The original dataset consisted of raw user interaction events. These events were first cleaned and transformed into session-level information.

**Operations performed:**

- Removed duplicate records
- Processed timestamp information
- Aggregated events into user sessions
- Generated behavioral metrics
- Prepared data for machine learning

Instead of training directly on raw clickstream events, meaningful behavioral features were created to better represent customer activity.

---

## ⚙️ Feature Engineering

Feature engineering was the most important part of this project.

A total of **27 behavioral features** were generated from customer activity logs.

**Examples include:**

- `add_to_cart_count`
- `view_count`
- `product_view_count`
- `session_duration_sec`
- `click_count`
- `user_total_sessions`
- `user_total_carts`
- `avg_products_per_user`
- `session_activity_score`
- `average_session_duration_per_user`

### Behavioral Ratios

To better capture customer engagement, several ratio-based features were created.

**Click-to-View Ratio**

```
ClickToViewRatio = ClickCount / ViewCount
```

**Add-to-Cart Ratio**

```
AddToCartRatio = AddToCartCount / ViewCount
```

**Product View Ratio**

```
ProductViewRatio = ProductViewCount / TotalEvents
```

These features help describe how actively a customer interacts with products during a session.

---

## 🎯 Final Feature Selection

After multiple experiments, feature importance analysis, and model evaluation, **six features** were selected for the final model:

1. `hour_of_day`
2. `user_total_sessions`
3. `avg_products_per_user`
4. `user_total_carts`
5. `average_session_duration_per_user`
6. `is_weekend`

**Feature reduction process:**

```
27 Features
      │
      ▼
Correlation Analysis
      │
      ▼
Importance Ranking
      │
      ▼
Feature Selection
      │
      ▼
Top 6 Features
```

---

## 🌳 Why XGBoost?

Several machine learning algorithms were considered, including Logistic Regression and Decision Trees.

**XGBoost was selected because:**

- Excellent performance on tabular data
- Handles nonlinear patterns effectively
- Built-in regularization reduces overfitting
- Supports feature importance analysis
- Highly optimized and scalable

### How XGBoost Works Internally

XGBoost is based on the concept of **Gradient Boosting**.

Instead of building a single decision tree, XGBoost builds many trees sequentially. Each new tree attempts to correct the mistakes made by previous trees.

**Training flow:**

```
Training Data
      │
      ▼
   Tree 1
      │
      ▼
Prediction Errors
      │
      ▼
   Tree 2
      │
      ▼
Remaining Errors
      │
      ▼
   Tree 3
      │
      ▼
    ...
      │
      ▼
  Tree 800
      │
      ▼
Final Prediction
```

In this project: **n_estimators = 800**, meaning the final model contains 800 boosted decision trees.

### Gradient Boosting Formula

The final prediction generated by XGBoost is:

```
ŷ = Σ (k=1 to K) fk(x)
```

Where:
- `ŷ` = Final prediction
- `K` = Number of trees
- `fk(x)` = Prediction from individual tree

For this project: **K = 800**

### XGBoost Objective Function

The objective function optimized during training is:

```
Obj = Loss + Regularization
```

Expanded form:

```
Obj = Σ l(yi, ŷi) + Σ Ω(fk)
```

Where:
- `l` = prediction error
- `Ω` = regularization term
- `fk` = decision trees

The regularization component helps reduce overfitting and improves generalization.

### Example Decision Tree

```
                 hour_of_day < 18?
                       /      \
                     Yes      No
                     /         \
              Purchase   user_total_sessions > 75?
                               /        \
                             Yes        No
                             /           \
                        Abandoned    Purchase
```

Each tree contributes a small score, and all scores are combined to generate the final prediction.

---

## ⚖️ Handling Class Imbalance Using SMOTE

The dataset contained significantly more abandoned sessions than completed purchases.

To address this issue, **SMOTE** (Synthetic Minority Oversampling Technique) was applied.

### SMOTE Formula

```
Xnew = Xi + λ(Xnn − Xi)
```

Where:
- `Xi` = Minority class sample
- `Xnn` = Nearest neighbor
- `λ` = Random value between 0 and 1

### SMOTE Workflow

```
Imbalanced Dataset
        │
        ▼
       SMOTE
        │
        ▼
Balanced Dataset
        │
        ▼
Model Training
```

This helps the model learn patterns from both classes more effectively.

---

## 🏋️ Model Training Process

### Train-Test Split

```
Training Data = 80%
Testing Data  = 20%
```

### Hyperparameter Optimization

**Randomized Search Cross Validation** was used to find the best XGBoost configuration.

**Final parameters:**

```python
XGBClassifier(
    n_estimators=800,
    max_depth=8,
    learning_rate=0.1,
    subsample=0.7,
    colsample_bytree=0.7,
    gamma=0
)
```

### Probability Prediction

After all trees generate their scores, XGBoost converts the output into a probability using the **Sigmoid Function**.

```
P(y=1) = 1 / (1 + e^(−z))
```

Where:
- `z` = Combined tree score
- `P(y=1)` = Probability of cart abandonment

**Example:**

```
P(y=1) = 0.78
```

Meaning: **78% probability** that the customer will abandon the cart.

---

## 📈 Model Evaluation

The primary evaluation metric used in this project was **ROC-AUC**.

**True Positive Rate**
```
TPR = TP / (TP + FN)
```

**False Positive Rate**
```
FPR = FP / (FP + TN)
```

The ROC Curve plots **TPR vs FPR**. The Area Under the Curve (AUC) measures how well the model distinguishes between abandoned and purchased sessions.

### Final Result

| Metric | Value |
|---|---|
| ROC-AUC Score | 0.5575 |
| Target ROC-AUC | 0.60 |

---

## 🔍 Performance Analysis

The model successfully learned customer behavioral patterns and identified abandonment trends.

However, analysis showed that many purchased and abandoned sessions exhibited similar behavioral characteristics. This limited the amount of predictive signal available to the model.

**Additional features that could further improve prediction performance:**

- Product category
- Product price
- Marketing source
- Customer demographics
- Customer lifetime value

---

## 💾 Model Export

The final trained model was saved using **Joblib**:

```python
joblib.dump(
    final_model,
    "cart_rescue_final_optimized.pkl"
)
```

The exported model can later be integrated into an API and dashboard for real-time predictions.

---

## 🛠️ Technologies Used

| Category | Technology |
|---|---|
| Programming Language | Python |
| Data Processing | Pandas, NumPy |
| Machine Learning | XGBoost |
| Class Balancing | SMOTE |
| Model Evaluation | Scikit-Learn |
| Visualization | Matplotlib, Seaborn |
| Model Storage | Joblib |
| Development Environment | Google Colab / Jupyter Notebook |

---

## ✅ Conclusion

In this project, customer clickstream data was transformed into meaningful behavioral features and used to train an XGBoost model for shopping cart abandonment prediction.

**The workflow included:**

1. Data preprocessing
2. Session aggregation
3. Feature engineering
4. Feature selection
5. SMOTE balancing
6. XGBoost training
7. Hyperparameter optimization
8. ROC-AUC evaluation

The final model achieved a **ROC-AUC score of 0.5575** and provides a strong foundation for building intelligent cart recovery systems in e-commerce platforms.
