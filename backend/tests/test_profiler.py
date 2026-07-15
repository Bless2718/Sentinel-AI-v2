import pandas as pd

from app.dataset.profiler import DatasetProfiler


def test_dataset_profile():

    df = pd.read_csv("tests/data/sample.csv")

    profiler = DatasetProfiler()

    profile = profiler.profile(df)

    assert profile.rows == 4

    assert profile.columns == 5

    assert profile.duplicate_rows == 1

    assert profile.missing_values == 0

    assert len(profile.numeric_columns) == 2

    assert len(profile.categorical_columns) == 3