from app.recommendations.alert import (
    AlertGenerator,
)


def test_alert_generator():

    generator = AlertGenerator()

    high = generator.generate(0.9)

    medium = generator.generate(0.6)

    low = generator.generate(0.2)

    assert high["level"] == "HIGH"

    assert medium["level"] == "MEDIUM"

    assert low["level"] == "LOW"