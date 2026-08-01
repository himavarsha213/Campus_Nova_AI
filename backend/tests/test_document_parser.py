import pytest
from app.services.document_parser import normalize_text, parse_pdf, parse_docx, parse_txt

def test_normalize_text():
    raw = "  CampusNova   AI \n\n  Document   Assistant.  "
    clean = normalize_text(raw)
    assert clean == "CampusNova AI \n Document Assistant."

def test_txt_parser(tmp_path):
    f = tmp_path / "test.txt"
    f.write_text("Hello CampusNova AI. Syllabus content.", encoding="utf-8")
    pages = parse_txt(str(f))
    assert len(pages) == 1
    assert "CampusNova AI" in pages[0]["text"]
