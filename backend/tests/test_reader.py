from pathlib import Path

from app.dataset.reader import DatasetReader


def test_reader_creation():
    reader = DatasetReader()

    assert reader is not None


def test_supported_extensions():

    reader = DatasetReader()

    assert ".csv" in reader.SUPPORTED_EXTENSIONS

    assert ".xlsx" in reader.SUPPORTED_EXTENSIONS


def test_extension_detection():

    reader = DatasetReader()

    assert reader._extension(
        Path("crime.csv")
    ) == ".csv"

    assert reader._extension(
        Path("crime.xlsx")
    ) == ".xlsx"