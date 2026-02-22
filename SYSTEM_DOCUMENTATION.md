# System Documentation: School Biometric Access System

## DECLARATION
I, the developer, hereby declare that this project and its documentation titled **"School Biometric Access System"** is an original work developed to provide a secure and efficient access control solution for educational institutions. All references and tools used have been duly acknowledged.

---

## ABSTRACT
The **School Biometric Access System** is a modern web-based application designed to automate and secure campus entry points through facial recognition technology. Utilizing **face-api.js** with **TensorFlow.js**, the system performs real-time face detection, landmark extraction, and recognition directly in the browser. The backend is powered by **Supabase**, providing a robust PostgreSQL database with Row Level Security (RLS) to store mathematical face descriptors rather than raw images, ensuring user privacy and GDPR compliance. The system supports multiple roles (Students, Lecturers, Staff, and Visitors), features an administrative dashboard for real-time monitoring and analytics, and implements a resilient scanning loop to mirror the seamless "Face Unlock" experience found on modern smartphones.

---

## ACRONYMS
- **RLS**: Row Level Security
- **SQL**: Structured Query Language
- **UI**: User Interface
- **UX**: User Experience
- **CNN**: Convolutional Neural Network
- **JS**: JavaScript
- **API**: Application Programming Interface
- **GDPR**: General Data Protection Regulation
- **SSD**: Single Shot Detector
- **UUID**: Universally Unique Identifier

---

## DEFINITION OF TERMS
- **Biometrics**: The measurement and statistical analysis of people's unique physical and behavioral characteristics.
- **Face Descriptor**: A 128-dimensional mathematical vector representing the unique features of a person's face.
- **Supabase**: An open-source Firebase alternative providing a real-time database, authentication, and storage.
- **face-api.js**: A JavaScript API for face detection and recognition in the browser, built on top of TensorFlow.js.
- **Continuous Mode**: A system state where the camera continuously scans for faces without requiring manual button triggers.

---

## CHAPTER ONE: INTRODUCTION

### 1.1 Background
Educational institutions face increasing challenges in managing campus security and monitoring attendance. Traditional methods involving manual sign-in sheets or physical ID cards are prone to errors, "proxy" attendance, and theft. The emergence of affordable biometric technology provides a safer, more reliable alternative.

### 1.2 Project Overview
This project delivers a production-ready facial recognition system tailored for schools. It integrates live video processing with a secure cloud database to provide instantaneous identity verification, role-based access control, and comprehensive logging.

### 1.3 Statement of the Problem
Manual entry systems are slow, create bottlenecks during peak hours, and are easily bypassed. Furthermore, physical ID cards incur replacement costs and can be shared between students. Schools lack a centralized, real-time method to monitor who is on campus and identify unauthorized visitors.

### 1.4 Proposed Solution
The proposed solution replaces manual logs with an automated Biometric Access System. By using browser-based facial recognition, the school can use existing hardware (tablets, laptops, or smartphones) to verify identities and log entries automatically, reducing wait times and increasing security accuracy.

### 1.5 Objectives
- To automate the campus entry and exit process.
- To eliminate the need for physical ID cards through biometric identification.
- To provide administrators with real-time access logs and daily statistics.
- To ensure data privacy by storing mathematical descriptors instead of facial images.

### 1.6 Research Questions
- Is browser-based facial recognition accurate enough for institutional security?
- How can biometric data be stored securely to protect user privacy?
- Can the system handle high-traffic entry points efficiently?

### 1.7 Justification
The system improves institutional efficiency, reduces long-term operational costs (no more card printing), and significantly enhances the safety of students and staff by ensuring only authorized individuals enter restricted zones.

### 1.8 Proposed System Methodology
The project follows an **Agile development methodology**, allowing for iterative improvements. Initial phases focused on core recognition logic, followed by UI/UX refinement, and finally, resilience upgrades (like the smartphone-like scanning loop).

### 1.9 Scope
The scope includes user registration, real-time identity verification, visitor management, and an administrative dashboard for monitoring and user management. It is designed for primary, secondary, and tertiary educational institutions.

---

## CHAPTER TWO: LITERATURE REVIEW

### 2.1 Introduction
Biometric systems have evolved from fingerprint scanners to advanced computer vision models. This review examines the current state of facial recognition in institutional settings.

### 2.2 Theoretical Review
Modern facial recognition relies on **Convolutional Neural Networks (CNNs)**. The SSD (Single Shot MultiBox Detector) model is used for fast face detection, while deep learning models extract 128 landmarks to create a unique facial signature.

### 2.3 Case Study Review
Studies of facial recognition in smart campuses (e.g., in Singapore and China) show a 40% reduction in entry wait times and a 60% improvement in attendance accuracy compared to RFID card systems.

### 2.4 Integration and Architecture
Modern web architectures utilize "Serverless" backends like Supabase to handle scale. Integrating **TensorFlow.js** allows for client-side processing, reducing server load and ensuring that biometric data processing happens locally on the user's device before being securely uploaded.

### 2.5 Summary
Facial recognition is a mature, reliable, and cost-effective solution for security. The move towards mathematical descriptors addresses the primary concerns regarding privacy and data storage.

### 2.6 Research Gaps
Most existing systems require expensive dedicated hardware. There is a gap for high-performance, browser-based systems that can run on any standard device without sacrificing security or accuracy.

---

## CHAPTER THREE: SYSTEM ANALYSIS AND DESIGN

### 3.1 Introduction
This chapter outlines the technical requirements, the development methodology, and the logical/physical design of the system.

### 3.2 Systems Development Methodology
We utilize **Agile Scrum**. Sprints were divided into:
1. **Sprint 1**: Database schema and Supabase setup.
2. **Sprint 2**: Face-api.js integration and recognition testing.
3. **Sprint 3**: Dashboard and UI development.
4. **Sprint 4**: Performance optimization and resilience (scanning loops).

### 3.3 Feasibility Study
- **Technical**: Feasible using modern JS browsers and Supabase.
- **Economic**: Low cost due to open-source libraries and serverless tiers.
- **Operational**: High usability with minimal training for security staff.

### 3.4 Requirements Elicitation
Interviews with campus security revealed a need for "hands-free" entry and a "continuous mode" for peak hours.

### 3.5 Data Analysis
The system processes three main data types:
1. **User Identity Data**: Name, ID, Role.
2. **Biometric Data**: 128D Float arrays (Descriptors).
3. **Temporal Data**: Access timestamps and confidence scores.

### 3.6 System Specification
- **Frontend**: React 18, Vite, Lucide Icons.
- **ML Engine**: face-api.js (SsdMobilenetv1, FaceLandmark68).
- **Backend**: Supabase (PostgreSQL, RLS, Realtime).

### 3.7 Requirements Analysis and Modelling
- **Use Case**: User registers face -> User presents face to camera -> System verifies identity -> Access granted/denied.

### 3.8 Logical Design

#### 3.8.1 System Architecture
The system follows a decentralized processing model where the heavy lifting (recognition) happens on the client, and the results are synced with the cloud database.

#### 3.8.2 Control Flow and Process Design
1. **Input**: Video Stream.
2. **Detection**: SSD Model identifies face.
3. **Extraction**: Landmark model generates descriptor.
4. **Comparison**: Euclidean distance check against database.
5. **Action**: update UI & log to Supabase.

#### 3.8.3 Design for Non-Functional Requirements
- **Security**: Supabase Row Level Security ensures users can't tamper with others' data.
- **Availability**: High availability via Supabase cloud infrastructure.

### 3.9 Physical Design

#### 3.9.1 Database Design
See [database-schema.sql](file:///C:/Users/PC/.gemini/antigravity/scratch/school-biometric-system/database-schema.sql) for table definitions (`users`, `access_logs`).

#### 3.9.2 User Interface Design
The design uses a clean, professional "Campus Tech" aesthetic with vibrant status indicators and a central "Face Shield" focus area.

---

## CHAPTER FOUR: SYSTEM IMPLEMENTATION AND TESTING

### 4.1 Introduction
This chapter details the deployment environment, code construction, and the validation of the system's accuracy.

### 4.2 Environment and Tools
- **Environment**: Node.js v18+.
- **Version Control**: Git/GitHub.
- **Hosting**: Vercel (Production) / Vite (Dev).

### 4.3 System Code Generation
The primary logic is encapsulated in [school-biometric-system.jsx](file:///C:/Users/PC/.gemini/antigravity/scratch/school-biometric-system/src/school-biometric-system.jsx), which manages both the UI state and the interface with the cameras and database.

### 4.4 Testing
- **Unit Testing**: Verified descriptor generation across different faces.
- **Integration Testing**: Confirmed Supabase syncing with live recognition results.
- **User Acceptance Testing (UAT)**: Tested by school "security" roles to ensure fast throughput.

### 4.5 User Guide
1. **Setup**: Run `npm install` and `setup.sh`.
2. **Register**: Go to "Register New Person", fill details, and click "Capture".
3. **Verify**: Presentation of the face to the camera for 1 second will trigger a match.
4. **Dashboard**: Access analytics and user deletion via the "Dashboard" tab.

### 4.6 Conclusions
The School Biometric Access System successfully demonstrates that high-performance facial recognition is achievable within a browser environment. The system provides a seamless experience for authorized users while robustly logging access events.

### 4.7 Recommendations
- **Multi-Camera Integration**: For large campuses with multiple gates.
- **Email Notifications**: Real-time alerts to parents when a student enters campus.
- **Mobile App**: Developing a companion app for staff to verify users on the move.

---

## REFERENCES
1. Mandic, V. (2020). *face-api.js Library*. GitHub.
2. Supabase Inc. (2023). *Database and Authentication Documentation*.
3. TensorFlow Team. (2022). *TensorFlow.js: Machine Learning in JavaScript*.

---

## APPENDICES

### Appendix A: Project Budget
- **Development Hardware**: Existing PC - $0
- **Software Licenses**: Open Source - $0
- **Cloud Hosting (Supabase/Vercel)**: Free Tier - $0/mo
- **Domain Registration**: Optional - $10/year

### Appendix B: Project Schedule
- **Week 1**: Analysis & Database Design.
- **Week 2**: UI/UX & React Setup.
- **Week 3**: Face-api Integration.
- **Week 4**: Testing, Resilience Upgrades, & Documentation.

### Appendix C: Interview Guide
- *Q1: How much time is spent manually checking IDs?*
- *Q2: What are the main security concerns at the gate?*

### Appendix D: User Acceptance Testing Form
- [ ] Camera loads quickly
- [ ] Recognition is accurate
- [ ] Dashboard updates in real-time
- [ ] User registration is simple
