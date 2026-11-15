# Paycheck — Payslip Auditor

A static React + TypeScript application for checking payslip arithmetic. Designed to deploy to GitHub Pages; no server, account, or API key is required.

## What it checks

- Calculates ordinary and overtime hours **independently for each week** using the configured weekly threshold.
- Calculates expected ordinary pay (`ordinary hours × hourly rate`).
- Calculates expected overtime pay (`overtime hours × entered overtime hourly rate`). Enter the actual overtime rate (for example, €15.93/hour), not `1.5`.
- Includes public-holiday pay and bonus as separate payment lines in the expected gross calculation. These are not treated as hours worked and are not used to infer an entitlement or holiday rate.
- Compares expected hours/pay against the figures entered from the payslip, with a configurable tolerance for rounding.
- Supports a payslip image upload with in-browser OCR. OCR text is displayed for reference; the user must verify and enter values manually because low-quality scans can be misread.

## Important assumptions and limitations

- Enter **actual hours worked for each individual week**. Do not enter only the pay-period total: overtime thresholds reset each week.
- Public-holiday hours and pay are recorded separately from worked hours. Their legal treatment depends on the employment terms and applicable law; the app does not decide entitlement.
- Bonus and public-holiday amounts are accepted as payslip line items and included in gross pay. Their correct amount cannot be derived without additional rules supplied by the employer/contract.
- The app checks gross payment arithmetic only. It does not validate tax, USC, PRSI, pension deductions, net pay, minimum-wage compliance, breaks, leave entitlement, or employment-law compliance.
- OCR uses Tesseract.js and downloads its language data in the browser on first use. No payslip image is uploaded to an application server; OCR runs on the user's device. A network connection is needed to fetch the OCR engine/language assets.

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

## Tests and production build

```bash
npm test
npm run build
npm run preview
```

## Deploy to GitHub Pages

1. Create a GitHub repository named **payslip-auditor** (or update `base` in `vite.config.ts` if you choose a different repository name).
2. Push this project to the repository's `main` branch.
3. In GitHub, open **Settings → Pages** and select **GitHub Actions** as the build and deployment source.
4. The included `.github/workflows/deploy.yml` runs tests, builds the static site, and deploys `dist` automatically on each push to `main`.
5. Your site will be available at `https://YOUR_GITHUB_USERNAME.github.io/payslip-auditor/`.

For a custom domain or a repository named `<username>.github.io`, adjust the `base` setting in `vite.config.ts` to `/`.
