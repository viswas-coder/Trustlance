# TrustLance - Demo Guide

## Overview

TrustLance is a freelancer platform that solves the problem of freelancers disappearing mid-project after receiving partial payments. The platform uses milestone-based escrow payments to protect both clients and freelancers.

## Demo Credentials

### Client Account
- **Email:** sarah@example.com
- **Password:** any password
- **Role:** Client

### Freelancer Account
- **Email:** alex@example.com
- **Password:** any password
- **Role:** Freelancer

### Admin Account
- **Email:** admin@trustlance.com
- **Password:** any password
- **Role:** Admin

> **Note:** This is a demo application. You can also create new accounts with any email/password combination.

## Key Features

### For Clients
1. **Post Projects** - Create projects with detailed milestones
2. **Escrow Protection** - Funds are locked and released milestone by milestone
3. **Review & Approve** - Approve or reject submitted work
4. **Dispute Resolution** - Raise disputes if work is abandoned

### For Freelancers
1. **View Assignments** - See all assigned projects and milestones
2. **Submit Work** - Upload deliverables for each milestone
3. **Track Earnings** - Monitor approved payments
4. **Reliability Score** - Build trust with on-time delivery

### For Admins
1. **Manage Disputes** - Review and resolve client-freelancer disputes
2. **Monitor Platform** - Track all projects and escrow balances
3. **System Overview** - View platform statistics

## How to Use

### As a Client

1. **Login** with client credentials
2. **Create a Project:**
   - Click "Post New Project"
   - Enter project details
   - Add milestones with amounts and due dates
   - Submit to lock funds in escrow

3. **Review Submissions:**
   - Navigate to project details
   - Review submitted milestones
   - Approve to release payment or request changes

4. **Raise Disputes:**
   - Go to project escrow tab
   - Click "Raise a Dispute" if needed

### As a Freelancer

1. **Login** with freelancer credentials
2. **View Projects** on your dashboard
3. **Submit Work:**
   - Go to project details
   - Click "Submit Work" on pending milestones
   - Add notes and files
   - Submit for client review

4. **Track Performance:**
   - View reliability score
   - Monitor earnings

### As an Admin

1. **Login** with admin credentials
2. **Review Disputes:**
   - See all active disputes
   - Resolve with fair decisions
3. **Monitor Platform** health and activity

## User Flows

### Happy Path (No Issues)
1. Client posts project → Escrow locked
2. Freelancer submits milestone 1 → Client approves → Payment released
3. Freelancer submits milestone 2 → Client approves → Payment released
4. Project completes successfully

### Dispute Path
1. Client posts project → Escrow locked
2. Freelancer abandons work
3. Client raises dispute
4. Admin reviews and resolves
5. Escrow handled per admin decision

## Technical Details

- **Frontend:** React, TypeScript, Tailwind CSS
- **State Management:** React Context API
- **Persistence:** LocalStorage (simulated backend)
- **Routing:** React Router
- **UI Components:** Radix UI + shadcn/ui

## Important Notes

⚠️ **This is a portfolio prototype**
- Payment system is simulated
- No real money transactions
- Demo purposes only
- Not meant for production use with real PII or sensitive data

## Features Demonstrated

✅ Authentication (role-based)
✅ Dashboard (Client, Freelancer, Admin)
✅ Project creation with milestones
✅ Escrow status tracking
✅ Milestone submission & approval
✅ Progress tracking
✅ Dispute management
✅ Chat interface
✅ Responsive design
✅ Professional SaaS UI
✅ Status badges & tooltips
✅ Empty states
✅ Form validation

## Next Steps (For Production)

If this were a real platform, you would need:

1. **Backend API** - Node.js/Express or similar
2. **Database** - PostgreSQL for relational data
3. **Real Payment Processing** - Stripe Connect for escrow
4. **File Storage** - AWS S3 for deliverables
5. **Authentication** - JWT with secure sessions
6. **Email Notifications** - SendGrid or similar
7. **Real-time Chat** - WebSockets or Firebase
8. **Compliance** - Legal review for escrow handling
9. **KYC/Verification** - Identity verification for users
10. **Dispute Mediation** - Human review process
