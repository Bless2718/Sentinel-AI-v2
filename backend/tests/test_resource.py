from app.recommendations.resource import (
    ResourceAllocator,
)


def test_resource_allocator():

    allocator = ResourceAllocator()

    high = allocator.allocate(0.9)

    medium = allocator.allocate(0.6)

    low = allocator.allocate(0.2)

    assert high["officers"] == 10
    assert medium["officers"] == 6
    assert low["officers"] == 2