from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import numpy as np
from datetime import datetime

app = FastAPI(
    title="Budget Assets Analytics Service",
    description="Python analytics microservice for Budgeting & Assets Management System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TransactionItem(BaseModel):
    type: str  # income or expense
    amount: float
    category: str
    date: str


class ForecastRequest(BaseModel):
    transactions: List[TransactionItem]
    months_ahead: int = 3


class AssetItem(BaseModel):
    name: str
    type: str
    current_value: float
    purchase_price: float = 0
    depreciation_rate: float = 0  # annual %


class ProjectionRequest(BaseModel):
    assets: List[AssetItem]
    years: int = 5


@app.get("/")
def root():
    return {"message": "Budget Assets Python Analytics Service is running", "status": "ok"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/api/forecast")
def forecast_spending(data: ForecastRequest):
    """
    Simple linear trend forecast for monthly expenses and income.
    Uses average of last available months + simple growth.
    """
    if not data.transactions:
        raise HTTPException(status_code=400, detail="No transactions provided")

    # Group by month
    monthly: Dict[str, Dict[str, float]] = {}
    for t in data.transactions:
        try:
            dt = datetime.fromisoformat(t.date.replace("Z", "+00:00"))
            key = f"{dt.year}-{dt.month:02d}"
        except:
            key = t.date[:7]

        if key not in monthly:
            monthly[key] = {"income": 0.0, "expense": 0.0}
        if t.type == "income":
            monthly[key]["income"] += t.amount
        else:
            monthly[key]["expense"] += t.amount

    if not monthly:
        return {"forecast": [], "message": "Insufficient data"}

    sorted_months = sorted(monthly.keys())
    incomes = [monthly[m]["income"] for m in sorted_months]
    expenses = [monthly[m]["expense"] for m in sorted_months]

    avg_income = float(np.mean(incomes)) if incomes else 0
    avg_expense = float(np.mean(expenses)) if expenses else 0

    # Simple growth rate (last vs first)
    income_growth = 0.0
    expense_growth = 0.0
    if len(incomes) >= 2:
        income_growth = (incomes[-1] - incomes[0]) / max(abs(incomes[0]), 1) / len(incomes)
        expense_growth = (expenses[-1] - expenses[0]) / max(abs(expenses[0]), 1) / len(expenses)

    forecast = []
    last_year, last_month = map(int, sorted_months[-1].split("-"))

    for i in range(1, data.months_ahead + 1):
        m = last_month + i
        y = last_year
        while m > 12:
            m -= 12
            y += 1
        pred_income = avg_income * (1 + income_growth * i)
        pred_expense = avg_expense * (1 + expense_growth * i)
        forecast.append({
            "month": f"{y}-{m:02d}",
            "predicted_income": round(max(0, pred_income), 2),
            "predicted_expense": round(max(0, pred_expense), 2),
            "predicted_balance": round(pred_income - pred_expense, 2)
        })

    return {
        "historical_months": len(sorted_months),
        "avg_income": round(avg_income, 2),
        "avg_expense": round(avg_expense, 2),
        "forecast": forecast
    }


@app.post("/api/asset-projection")
def project_assets(data: ProjectionRequest):
    """
    Project future asset values using depreciation rate.
    """
    projections = []
    total_current = 0
    total_projected = 0

    for asset in data.assets:
        total_current += asset.current_value
        yearly_values = [asset.current_value]
        value = asset.current_value
        rate = asset.depreciation_rate / 100.0

        for year in range(1, data.years + 1):
            # Simple depreciation (or growth if negative rate)
            value = value * (1 - rate)
            yearly_values.append(round(max(0, value), 2))

        total_projected += yearly_values[-1]
        projections.append({
            "name": asset.name,
            "type": asset.type,
            "current_value": asset.current_value,
            "purchase_price": asset.purchase_price,
            "depreciation_rate": asset.depreciation_rate,
            "projected_values": yearly_values,
            "final_value": yearly_values[-1],
            "total_change": round(yearly_values[-1] - asset.current_value, 2)
        })

    return {
        "years": data.years,
        "total_current_value": round(total_current, 2),
        "total_projected_value": round(total_projected, 2),
        "net_change": round(total_projected - total_current, 2),
        "assets": projections
    }


@app.post("/api/budget-health")
def budget_health(data: dict):
    """
    Simple budget health score based on spending vs budget and savings rate.
    """
    income = data.get("income", 0)
    expense = data.get("expense", 0)
    budgets = data.get("budgets", [])  # list of {amount, spent}

    if income <= 0:
        return {"score": 0, "status": "No income data", "tips": ["Add income transactions"]}

    savings_rate = (income - expense) / income * 100
    over_budget_count = sum(1 for b in budgets if b.get("spent", 0) > b.get("amount", 0))

    score = 50
    tips = []

    if savings_rate >= 20:
        score += 25
        tips.append("Great savings rate! Keep it up.")
    elif savings_rate >= 10:
        score += 15
        tips.append("Good savings. Aim for 20%+.")
    elif savings_rate > 0:
        score += 5
        tips.append("You're saving, but try to increase the rate.")
    else:
        score -= 20
        tips.append("Spending exceeds income. Review expenses urgently.")

    if over_budget_count == 0 and budgets:
        score += 20
        tips.append("All budgets under control!")
    elif over_budget_count > 0:
        score -= min(20, over_budget_count * 5)
        tips.append(f"{over_budget_count} category(ies) over budget.")

    score = max(0, min(100, score))

    status = "Excellent" if score >= 80 else "Good" if score >= 60 else "Fair" if score >= 40 else "Needs Attention"

    return {
        "score": score,
        "status": status,
        "savings_rate": round(savings_rate, 1),
        "over_budget_categories": over_budget_count,
        "tips": tips
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
