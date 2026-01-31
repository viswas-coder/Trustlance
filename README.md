# Trustlance
Trustlance is a portfolio prototype that addresses freelancer ghosting by simulating escrow-based payments and milestone-driven work. Funds are released only after approval, with dispute handling to protect businesses and freelancers. Built to demonstrate real-world trust systems.
📌 Problem

Many businesses hire freelancers through informal channels like WhatsApp, social media, or referrals. In such setups, freelancers may disappear mid-project after receiving partial payments, leaving businesses with unfinished work, financial loss, and no clear way to recover damages or enforce accountability.

Existing platforms solve this partially but are often complex, expensive, or unsuitable for small businesses and student freelancers.

💡 Solution

Trustlance is a prototype web platform that demonstrates how escrow-based payments, milestone-driven work, and dispute resolution can reduce freelancer ghosting and protect both clients and freelancers.

Instead of paying upfront, payments are locked in escrow (simulated) and released only after milestone approval. If a project is abandoned, a dispute can be raised and funds can be refunded or reassigned.

This project focuses on system design, trust mechanisms, and real-world product thinking, not real money handling.

✨ Key Features

👤 Role-based authentication (Client / Freelancer)

📁 Project posting and assignment

🧩 Milestone-based work breakdown

🔐 Escrow payment simulation (Locked / Released / Refunded)

💬 In-project chat and file sharing

⚠️ Dispute resolution workflow

📊 Basic reliability indicators

🛠️ Minimal admin controls

🧠 How Escrow Works (Simulated)

Client “pays” → funds are marked as LOCKED

Freelancer submits milestone work

Client approves → funds marked RELEASED

Freelancer becomes inactive → dispute raised → funds REFUNDED

⚠️ No real payments are processed. This logic is implemented to demonstrate how escrow systems function in real platforms.

🧱 Tech Stack

Frontend: React / Next.js, Tailwind CSS

Backend: Supabase (Auth + Database + Storage)

Database: PostgreSQL

Hosting: Vercel (Frontend)

Design: Figma

🎯 Purpose of This Project

This project was built as:

A portfolio project to demonstrate real-world problem solving

A product thinking exercise under ₹0 budget constraints

A prototype showing how trust-based systems can be designed

⚠️ Limitations

No real payment or legal enforcement

Manual dispute resolution

Not production-ready

Built for demonstration and learning purposes only

🚀 Future Improvements

Real payment gateway integration

Automated dispute mediation

Freelancer verification & reputation scoring

Notifications & inactivity detection

Mobile responsiveness improvements
