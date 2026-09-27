from app.ai.intelligence_context import (
    IntelligenceContextBuilder,
)

from app.geospatial.models import (
    Cluster,
    GeoPoint,
    GeospatialStatisticsModel,
    GeospatialSummaryModel,
    Hotspot,
)


builder = IntelligenceContextBuilder()


summary = GeospatialSummaryModel(
    hotspot_count=15947,
    cluster_count=1,
    highest_risk_score=1.0,
    average_density=0.5,
    maximum_density=0.999979,
    heatmap_points=90156,
)


statistics = GeospatialStatisticsModel(
    total_clusters=2,
    active_clusters=1,
    isolated_points=1,
    total_crimes=425200,
    average_cluster_size=212600,
    largest_cluster_size=425191,
    average_risk_score=0.5,
    highest_risk_score=1.0,
)


hotspots = [
    Hotspot(
        location=GeoPoint(
            latitude=49.282761,
            longitude=-123.117618,
        ),
        crime_count=2374,
    ),
    Hotspot(
        location=GeoPoint(
            latitude=49.281843,
            longitude=-123.099582,
        ),
        crime_count=2114,
    ),
]


clusters = [
    Cluster(
        cluster_id=0,
        crime_count=425191,
        density=0.999979,
        risk_score=1.0,
    ),
    Cluster(
        cluster_id=-1,
        crime_count=9,
        density=0.000021,
        risk_score=0.0,
    ),
]


context = builder.build(
    summary=summary,
    statistics=statistics,
    hotspots=hotspots,
    clusters=clusters,
)


print(
    "\n========== INTELLIGENCE CONTEXT ==========\n"
)

print(context)

print(
    "\n========== CONTEXT BUILT SUCCESSFULLY ==========\n"
)