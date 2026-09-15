#!/usr/bin/env python3
"""
PlacementCopilot AI — Campus Placement & ATS Interview Accelerator
Entrypoint for Web Server and Terminal CLI.
"""

import sys
import os
import argparse

# Ensure root directory is in python module search path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from web.server import run_server
from core.ats_engine import ATSEngine
from core.company_intel import get_all_companies, get_company_intel

def run_cli():
    print("\n=======================================================")
    print("🎯 PlacementCopilot AI — Terminal Diagnostic Engine")
    print("=======================================================\n")
    
    companies = get_all_companies()
    print("Available Campus Recruiters:")
    for idx, c in enumerate(companies, 1):
        print(f"  [{idx}] {c['name']} - {c['role']} ({c['ctc_range']})")
    
    try:
        choice = int(input("\nSelect company number [default 2 - TCS]: ") or "2")
        selected = companies[choice - 1]
    except (ValueError, IndexError):
        selected = companies[1]

    print(f"\n[✓] Target Selected: {selected['name']} ({selected['role']})")
    print("\nEnter/Paste your resume text (type 'END' on a new line when done):")
    
    lines = []
    while True:
        try:
            line = input()
            if line.strip() == "END":
                break
            lines.append(line)
        except EOFError:
            break
    
    resume_text = "\n".join(lines).strip()
    if not resume_text:
        print("[!] No resume text provided. Using sample benchmark profile.")
        resume_text = "Student at LPU with Python, SQL, C++, web development and database projects."

    print("\n[⏳] Running ATS Analysis & Skill Gap Audit...")
    engine = ATSEngine()
    result = engine.analyze(resume_text, selected["id"])

    print("\n" + "="*50)
    print(f"📊 ATS MATCH SCORE: {result['overall_score']}%")
    print(f"Status: {result['summary']['status']}")
    print("="*50)
    print(f"\n💡 Critique:\n  {result['summary']['critique']}")
    print(f"\n⚠️ Action Item:\n  {result['summary']['top_action_item']}")
    
    print("\n🔍 Missing Critical Keywords:")
    for kw in result['missing_keywords'][:6]:
        print(f"  [-] {kw}")

    print("\n✨ Google X-Y-Z Bullet Point Upgrade Recommendation:")
    for rew in result['bullet_rewrites'][:2]:
        print(f"  • Before: {rew['original']}")
        print(f"    After : {rew['improved']}")
        print()

def main():
    parser = argparse.ArgumentParser(description="PlacementCopilot AI")
    parser.add_argument("--web", action="store_true", help="Launch the local interactive Web Dashboard")
    parser.add_argument("--cli", action="store_true", help="Run interactive terminal diagnostics")
    parser.add_argument("--port", type=int, default=8080, help="Web server port (default: 8080)")
    
    args = parser.parse_args()

    if args.cli:
        run_cli()
    else:
        port = int(os.environ.get("PORT", args.port))
        run_server(port=port)

if __name__ == "__main__":
    main()
