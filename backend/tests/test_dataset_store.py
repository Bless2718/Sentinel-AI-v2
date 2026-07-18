from pathlib import Path

from app.storage.dataset_store import DatasetStore


def test_dataset_store(tmp_path):

    source = tmp_path / "sample.csv"

    source.write_text(
        "a,b\n1,2\n"
    )

    store = DatasetStore()

    dataset_id = store.save(source,"sample.csv",)

    stored = store.path(dataset_id)

    assert stored is not None

    assert stored.exists()