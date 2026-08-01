import pytest
from app.services.rag_generator import calculate_confidence_score

def test_confidence_score_calculation():
    empty_chunks = []
    assert calculate_confidence_score(empty_chunks) == 0.0

    high_confidence_chunks = [{"score": 0.85}, {"score": 0.90}]
    score = calculate_confidence_score(high_confidence_chunks)
    assert score > 80.0
