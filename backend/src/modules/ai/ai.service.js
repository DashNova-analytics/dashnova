import { GoogleGenAI } from "@google/genai";

export async function fetchAIInsight() {
  return { message: "DashNova AI Executive Intelligence Operational" };
}

export async function generateAIChatResponse(message, history = [], contextData = null) {
  const apiKey = process.env.GEMINI_API_KEY;

  // Use provided contextData or default enterprise sample context
  const dataset = (contextData && contextData.hasData) ? contextData : {
    hasData: true,
    isSampleMode: true,
    kpis: {
      totalRevenue: '$1,248,500',
      activeCustomers: '3,420',
      averageOrderValue: '$365.05',
      salesCount: '3,420'
    },
    products: [
      { name: 'Nova Cloud Pro Enterprise', category: 'SaaS / Software', revenue: '$485,000' },
      { name: 'DashNova AI Analytics Suite', category: 'AI Tools', revenue: '$320,000' },
      { name: 'Enterprise API Gateway License', category: 'Infrastructure', revenue: '$210,000' }
    ],
    customers: [
      { name: 'Acme Global Holdings', volume: '$125,000', tier: 'Enterprise' },
      { name: 'Apex Innovations Ltd', volume: '$98,000', tier: 'Enterprise' },
      { name: 'Vanguard Logistics', volume: '$74,500', tier: 'Mid-Market' }
    ]
  };

  const topProduct = dataset.products?.[0]?.name || 'Nova Cloud Pro Enterprise';
  const topCust = dataset.customers?.[0]?.name || 'Acme Global Holdings';

  const dataContextStr = `
ORGANIZATION BUSINESS LEDGER CONTEXT (${dataset.isSampleMode ? 'Sample Mode' : 'Active Dataset'}):
- Total Gross Revenue: ${dataset.kpis?.totalRevenue || '$1,248,500'}
- Active Customer Accounts: ${dataset.kpis?.activeCustomers || '3,420'}
- Average Order Value (AOV): ${dataset.kpis?.averageOrderValue || '$365.05'}
- Total Completed Transactions: ${dataset.kpis?.salesCount || '3,420'}
- Flagship Top Revenue SKU: ${topProduct}
- Key Anchor Customer: ${topCust}
- Product Catalog Size: ${dataset.products?.length || 3} SKUs
- Customer Ledger Size: ${dataset.customers?.length || 3} Core Accounts
`;

  const systemInstruction = `You are DashNova AI Executive Strategic Analyst — a top-tier business intelligence, analytics, and growth strategist.
Your mission is to provide deeply insightful, high-value analytics, strategic forecasts, and future enhancement recommendations tailored to the organization's dataset.

When responding to queries:
1. Executive Summary & Key Metric Context: Briefly summarize current performance using the numbers provided.
2. Future Analytics & Strategic Enhancement Ideas: Provide 3-4 specific, high-impact growth levers and future analytics features (e.g., Predictive Churn Modeling, Automated Tiered Pricing & Bundling, Customer Lifetime Value Cohort Tracking, Demand Forecasting Optimization).
3. Actionable Next Steps / Execution Roadmap: Give clean, practical, step-by-step recommendations for implementation.

Use clean Markdown formatting with bold metrics, bullet points, headers, and code/metric tags. Keep the tone professional, authoritative, and strategic.`;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const contents = [];
      let fullPrompt = `${dataContextStr}\n\nUser Question: ${message}`;

      if (history && Array.isArray(history) && history.length > 0) {
        history.forEach(item => {
          if (item.sender === 'user') {
            contents.push({ role: 'user', parts: [{ text: item.text }] });
          } else if (item.sender === 'ai' || item.sender === 'model') {
            contents.push({ role: 'model', parts: [{ text: item.text }] });
          }
        });
      }

      contents.push({ role: 'user', parts: [{ text: fullPrompt }] });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      if (response && response.text) {
        return {
          reply: response.text,
          source: 'gemini-3.6-flash',
          timestamp: new Date().toISOString()
        };
      }
    } catch (err) {
      console.warn("Gemini API call warning:", err.message);
    }
  }

  // Fallback when Gemini API key is missing or offline
  const isEnhancementQuery = /enhancement|future|growth|recommend|idea|strategy|pricing|bundle|forecast/i.test(message);

  let reply = '';
  if (isEnhancementQuery) {
    reply = `### 🚀 **DashNova Strategic Future Enhancement Analytics**

Based on your current workspace dataset (**${dataset.kpis?.totalRevenue || '$1,248,500'}** Total Revenue across **${dataset.kpis?.activeCustomers || '3,420'}** active customer accounts), here are 4 future analytics & growth enhancement ideas:

---

#### 1. 📊 **Predictive Customer Churn & Expansion Scoring**
- **Opportunity**: Identify high-value enterprise accounts (e.g. \`${topCust}\`) nearing renewal or at risk of volume reduction.
- **Projected Impact**: **+12% to +18%** retention lift by triggering automated customer success alerts when engagement drops below baseline.

#### 2. 💡 **Dynamic Product Bundling & Cross-Sell Engine**
- **Opportunity**: Pair your flagship product (\`${topProduct}\`) with complementary catalog SKUs into tiered annual subscription packages.
- **Projected Impact**: Expected Average Order Value (AOV) growth from **${dataset.kpis?.averageOrderValue || '$365'}** to **$450+** per account.

#### 3. 🔮 **AI Demand Forecasting & Inventory Buffer Optimization**
- **Opportunity**: Deploy 90-day time-series forecasting models to auto-calculate reorder safety stocks and prevent stockouts or over-allocated capacity.
- **Projected Impact**: **15% reduction** in holding costs and eliminated stockout revenue loss.

#### 4. 🎯 **Cohort LTV & Margin Contribution Tracking**
- **Opportunity**: Transition from gross revenue tracking to net contribution margin per customer acquisition channel.
- **Projected Impact**: Redirect marketing spend away from low-margin segments toward high-margin enterprise cohorts.

---

### 📋 **Recommended Actionable Roadmap**
1. **Short-Term (1-2 Weeks)**: Enable automated weekly executive email digests with churn risk flags.
2. **Mid-Term (3-4 Weeks)**: Test tiered SKU bundles on top 20% accounts.
3. **Long-Term (Q3/Q4)**: Integrate real-time API telemetry to feed predictive LTV models.`;
  } else {
    reply = `### 📊 **DashNova AI Executive Business Intelligence**

Analyzing query: **"${message}"** against active ledger context:

- **Total Gross Revenue**: \`${dataset.kpis?.totalRevenue || '$1,248,500'}\`
- **Active Accounts**: \`${dataset.kpis?.activeCustomers || '3,420'}\`
- **Average Order Value**: \`${dataset.kpis?.averageOrderValue || '$365.05'}\`
- **Top Product SKUs**: \`${topProduct}\`
- **Anchor Client Account**: \`${topCust}\`

---

### 💡 **Strategic Recommendations & Growth Opportunities**
- **Revenue Expansion**: Current AOV stands at **${dataset.kpis?.averageOrderValue || '$365.05'}**. Introducing premium feature add-ons or volume discounts could expand customer lifetime value by **15-20%**.
- **Customer Concentration**: Ensure diversification across accounts to reduce reliance on top-tier buyers.
- **Predictive Analytics**: Leverage DashNova forecasting tools to model Q3 revenue trajectories.`;
  }

  return {
    reply,
    source: 'dashnova-analytics-engine',
    timestamp: new Date().toISOString()
  };
}



