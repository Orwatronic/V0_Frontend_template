### i18n skipped keys log — 2025-08-12

Context: During the i18n scan we filtered out non-translation keys to avoid polluting locale files. Criteria:
- Contains `${...}` (template literals)
- Only whitespace or punctuation
- Not namespaced (no dot), or obvious non-i18n tokens

Skipped keys captured from `i18n-report.json`:

```
.
pseudo
-
Feedback submitted successfully!
 
${prefix}.features.f1
${prefix}.features.f2
${prefix}.features.f3
${prefix}.features.f4
sales.priority.${priority}
Purchase Requisition Submitted Successfully!
materials.types.${material.type.toLowerCase()}
materials.status.${material.status}
financial.status.${entry.status.toLowerCase()}
,
@
common.${goal.status}
common.${goal.priority}
crm.customerMaster.status.${status}
crm.customerMaster.types.${customer.type.toLowerCase()}
T
pdf
excel
common.${review.status}
common.${dept.status}
common.${approval.priority}
activityType
notes
promiseDate
promiseAmount
status.${customer.status}
activity.${log.type}
financial.chartOfAccounts.accountTypes.${account.type}
/
financial.status.${invoice.status.toLowerCase()}
next
solutions.${slug}.title
solutions.${slug}.subtitle
solutions.${slug}.features.${k}
solutions.${slug}.imageAlt
intent
name
email
company
```

Notes:
- These come largely from demo/mocked components and placeholder strings.
- We will revisit template-based keys if refactored to static keys.

To-do:
- Map remaining missing keys to owners per module for proper copy.
- Consider normalizing certain generic tokens (e.g., `pdf`, `excel`) under `common.*` if needed.

