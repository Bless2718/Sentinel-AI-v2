"""
Resource Allocation
"""


class ResourceAllocator:
    """
    Recommends police resource allocation
    based on geographic risk.
    """

    def allocate(
        self,
        risk_score: float,
    ) -> dict:

        if risk_score >= 0.8:
            return {
                "officers": 10,
                "vehicles": 3,
            }

        if risk_score >= 0.5:
            return {
                "officers": 6,
                "vehicles": 2,
            }

        return {
            "officers": 2,
            "vehicles": 1,
        }