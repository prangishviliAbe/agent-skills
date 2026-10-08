# Security Audit Playbook & Vulnerability Hunting

Read when: You are reviewing code for security vulnerabilities, hunting secrets, auditing SQL queries, or checking for command execution sinks.

---

## 1. Ripgrep Vulnerability Detection Patterns

Run these targeted queries to find high-risk code patterns across a codebase:

```bash partial
# 1. Potential SQL Injection (string concatenation in queries)
rg -i "(query|execute|raw)\s*\(\s*[\`\"'].*\$\{" --type ts --type js

# 2. Command Injection & Arbitrary Shell Execution
rg -i "(exec|execSync|spawn|spawnSync|popen|system)\s*\(" --type ts --type js --type py

# 3. Insecure Cryptography & Timing Attacks
rg -i "===\s*(token|secret|signature|hash|apiKey)" --type ts --type js

# 4. Dangerous SSRF / Unvalidated URL Fetching
rg -i "fetch\s*\(\s*(req\.|params\.|body\.)" --type ts --type js

# 5. Hardcoded API Keys & Tokens
rg -i "(api[_-]?key|secret|password|bearer|jwt)\s*[:=]\s*[\"'][a-zA-Z0-9_\-\.]{16,}[\"']"
```

---

## 2. Hardening Insecure Endpoints

When auditing an endpoint, verify:
1. Is authentication enforced on the route middleware?
2. Are input parameters parsed and constrained with Zod?
3. Does the database query check both `id` and `tenantId`?
4. Are security headers (CSP, CORS, HSTS) actively returned?
