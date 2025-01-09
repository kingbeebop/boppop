from fastapi.testclient import TestClient
from api2.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_graphql_endpoint():
    query = """
    query {
        artists {
            items {
                id
                username
            }
            pageInfo {
                totalItems
            }
        }
    }
    """
    response = client.post("/graphql", json={"query": query})
    assert response.status_code == 200 