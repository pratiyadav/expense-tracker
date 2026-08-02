# N100 Financial Intelligence Platform

## Overview

The N100 Financial Intelligence Platform is an end-to-end financial analytics project built on SQLite, Python and Streamlit.

The project performs ETL, financial ratio analysis, valuation, financial health analysis, NLP based company analysis, report generation, clustering and dashboard visualization for Nifty 100 companies.

---

## Features

- ETL Pipeline
- SQLite Database
- Financial Ratio Engine
- Growth Analysis
- Financial Health Analysis
- Valuation Engine
- DCF Valuation
- Cash Flow Intelligence
- Distress Alert Detection
- NLP Pros & Cons Generator
- Company Tearsheets
- Sector Reports
- Portfolio Reports
- Company Clustering
- FastAPI REST API
- Streamlit Dashboard

---

## Technologies

- Python
- SQLite
- Pandas
- NumPy
- Streamlit
- FastAPI
- ReportLab
- Scikit-Learn
- Matplotlib

---

## Project Structure

```
src/
analytics/
api/
clustering/
dashboard/
etl/
nlp/
reports/
```

---

## Outputs

```
reports/tearsheets/
reports/sector/
reports/portfolio/
output/
```

---

## Run Dashboard

```
streamlit run src/dashboard/app.py
```

---

## Run API

```
uvicorn src.api.main:app --reload
```

---

## Generate Reports

```
python src/reports/company_tearsheet.py

python src/reports/sector_report.py

python src/reports/portfolio_report.py
```

---
