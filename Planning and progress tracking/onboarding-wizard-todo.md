# Company Setup & Onboarding Wizard - To-Do List

## 📊 Completion Status: 100% 🟢

## 📋 Overview
This document outlines the plan for building the multi-step Company Onboarding Wizard. This is a critical feature for our multi-tenant SaaS ERP, enabling new customers to self-serve their initial setup. This workflow will guide a new company's administrator through the essential configuration steps required to start using the Feebee ERP system.

This feature is a prerequisite for any real-world customer deployment.

## 🎯 Objectives
- Create a seamless, user-friendly, multi-step form experience.
- Guide the user through complex but necessary initial data setup.
- Orchestrate multiple backend API calls to configure the new tenant account.
- Provide clear feedback and a confirmation of successful setup.

## 🚀 Wizard Flow & Features

### Phase 1: Core Onboarding Workflow
-   [x] **Create Wizard Shell:** Build the main component to manage steps, state, and navigation (`Next`, `Back`, `Save & Exit`).
-   [x] **Step 1: Company Profile:** Form for basic company information.
    -   Fields: Company Name, Legal Business Name, Address, Country, Tax ID, Default Currency.
-   [x] **Step 2: Fiscal Year Configuration:** Interface to define the company's fiscal calendar.
    -   Fields: Fiscal Year Start Month, Number of Accounting Periods (e.g., 12 for monthly, 4 for quarterly).
-   [x] **Step 3: Chart of Accounts (CoA) Setup:** Allow the user to establish their general ledger.
    -   Options:
        -   Select from pre-defined templates (e.g., "Standard Retail CoA", "Standard Manufacturing CoA").
        -   Upload a CoA from a CSV file.
-   [x] **Step 4: User Invitations:** A simple interface to invite other team members.
    -   Fields: Email Address, Role (e.g., Admin, Standard User).
-   [x] **Step 5: Module Activation & Finalization:** A summary screen showing all configured data.
    -   Display selected modules (based on subscription).
    -   "Complete Setup" button to finalize the onboarding process.

## 🔧 Backend Integration Points

### // API Endpoints for CURSOR
\`\`\`typescript
// Onboarding & Company Setup
POST /api/v1/companies                  // Step 1: Create the company record with profile info
POST /api/v1/companies/{id}/fiscal-year // Step 2: Set the fiscal year configuration
POST /api/v1/companies/{id}/coa         // Step 3: Initialize the Chart of Accounts from a template or upload
POST /api/v1/companies/{id}/invites     // Step 4: Send invitations to new users
POST /api/v1/companies/{id}/finalize    // Step 5: Finalize the setup process, marks tenant as 'active'

// Data for Wizard
GET /api/v1/coa-templates               // Get list of available Chart of Accounts templates
GET /api/v1/countries                   // Get list of countries and their currencies for setup
