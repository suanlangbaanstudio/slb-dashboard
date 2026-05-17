const NOTION_KEY = process.env.NOTION_KEY;
const DBS = {
  projects: process.env.NOTION_PROJECTS_DB,
  payments: process.env.NOTION_PAYMENTS_DB,
  expenses: process.env.NOTION_EXPENSES_DB,
  contacts: process.env.NOTION_CONTACTS_DB,
  tax:      process.env.NOTION_TAX_DB,
};

async function queryDB(id) {
  const res = await fetch(`https://api.notion.com/v1/databases/${id}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page_size: 100 }),
  });
  const data = await res.json();
  return data.results || [];
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const [projects, payments, expenses, contacts, tax] = await Promise.all([
      queryDB(DBS.projects),
      queryDB(DBS.payments),
      queryDB(DBS.expenses),
      queryDB(DBS.contacts),
      queryDB(DBS.tax),
    ]);
    res.json({ success: true, data: { projects, payments, expenses, contacts, tax } });
  } catch(e) {
    res.status(500).json({ success: false, error: e.message });
  }
}
