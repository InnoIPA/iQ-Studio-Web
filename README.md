# iQ-Studio

**Show Performance, Spark Imagination.**

iQ-Studio is Innodisk's edge AI platform, built with Qualcomm. It puts ready-to-run applications — vision, generative AI and multi-stream video perception — directly on Innodisk Qualcomm Dragonwing hardware, so you can see them working on a real board in minutes instead of assembling a stack yourself.

This repository contains the source of the iQ-Studio website and its documentation.

## What is iQ-Studio?

- **Ready-to-run applications.** Pick an application, run one launcher command, and watch it work on real hardware.
- **Everything pre-integrated.** Models, pipelines and drivers come together — no model conversion, no chip-level code.
- **Backed by Innodisk hardware.** Innodisk peripherals, starting with industrial cameras, work out of the box.
- **Portable demos.** The same launcher tag gives the same result on any supported board.

## What's in the documentation?

| Section | What you'll find |
|---|---|
| **Starting Guides** | Power on, flash and connect to your device (Q911 Quick Start, image flashing, Windows flashing, Qualcomm OTA) |
| **Applications** | Ready-to-run apps such as iQS-VLM, iQS-Streampipe, iQS-QVADK and YOLOv10n, plus the iQS launcher |
| **SDKs** | GenieX, iQS-QVADK, iQS-Streampipe and iQS-VLM Open WebUI |
| **Model Deploy** | Deploying your own models, including YOLO26 and iQ-Foundry model selection |
| **Benchmarks** | Multi-stream, multistream scaling, perception and iQ-Foundry model results, with the test method attached |
| **AVL** | Approved camera (MIPI and GMSL) and vendor lists |

Not sure where to begin? The **Get Started** page routes you to the right guide based on what you want to do.

## Viewing the site locally

Every page is a self-contained HTML file. No installation or build step is needed:

1. Clone or download this repository.
2. Open `index.html` in your browser.

You can also serve the folder with any static web server.

## Repository layout

```
index.html       Home page
*.html           Other top-level pages (Get Started, Benchmarks, Architecture, In the News)
docs/            Documentation, grouped by topic
                 starting-guides/  avl/  applications/  model-deploy/  sdks/  benchmarks/
assets/          Logos (logo/), styles (css/) and scripts (js/)
shared/          Shared navigation bar and footer
```

## About

© 2026 Innodisk Corporation. iQ-Studio runs on Innodisk Qualcomm Dragonwing platforms.
