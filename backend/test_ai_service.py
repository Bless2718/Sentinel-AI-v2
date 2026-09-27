from app.ai.ai_service import AIService


service = AIService()


context = {
    "total_crimes": 425200,
    "hotspot_count": 15947,
    "highest_risk_score": 1.0,
    "cluster_count": 1,
    "top_hotspots": [
        {
            "latitude": 49.282761,
            "longitude": -123.117618,
            "crime_count": 2374,
        },
        {
            "latitude": 49.281843,
            "longitude": -123.099582,
            "crime_count": 2114,
        },
    ],
}


result = service.generate_executive_summary(
    context
)


print("\n========== AI RESULT ==========\n")

print("Title:")
print(result.title)

print("\nSummary:")
print(result.summary)

print("\nKey Findings:")

for finding in result.key_findings:
    print("-", finding)

print("\nRecommendations:")

for recommendation in result.recommendations:
    print("-", recommendation)

print("\nConfidence:")
print(result.confidence)