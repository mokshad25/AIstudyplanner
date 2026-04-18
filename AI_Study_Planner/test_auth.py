import requests
import uuid

BASE_URL = "http://localhost:8080/auth"

def test_auth():
    print("Running Auth Tests...")
    
    unique_email = f"test_{uuid.uuid4().hex[:6]}@example.com"
    long_password = "A" * 80  # >72 bytes
    normal_password = "password123"
    
    # 1. Normal signup
    res1 = requests.post(f"{BASE_URL}/register", json={
        "name": "Test User",
        "email": unique_email,
        "password": normal_password
    })
    assert res1.status_code == 200, f"Normal signup failed: {res1.text}"
    print("✔ Normal signup passed")
    
    # 2. Duplicate email
    res2 = requests.post(f"{BASE_URL}/register", json={
        "name": "Test User",
        "email": unique_email,
        "password": normal_password
    })
    assert res2.status_code == 400 and "Email already exists" in res2.text, f"Duplicate email failed: {res2.text}"
    print("✔ Duplicate email passed")
    
    # 3. Normal login
    res3 = requests.post(f"{BASE_URL}/login", data={
        "username": unique_email,
        "password": normal_password
    })
    assert res3.status_code == 200 and "access_token" in res3.json(), f"Normal login failed: {res3.text}"
    print("✔ Normal login passed")
    
    # 4. Long password (>72 bytes) signup & login
    unique_email_long = f"long_{uuid.uuid4().hex[:6]}@example.com"
    res4_signup = requests.post(f"{BASE_URL}/register", json={
        "name": "Long Pass User",
        "email": unique_email_long,
        "password": long_password
    })
    assert res4_signup.status_code == 200, f"Long password signup failed: {res4_signup.text}"
    
    res4_login = requests.post(f"{BASE_URL}/login", data={
        "username": unique_email_long,
        "password": long_password
    })
    assert res4_login.status_code == 200, f"Long password login failed: {res4_login.text}"
    print("✔ Long password (>72 bytes) passed")
    
    # 5. Invalid password
    res5 = requests.post(f"{BASE_URL}/login", data={
        "username": unique_email,
        "password": "wrongpassword"
    })
    assert res5.status_code == 401 and "Invalid credentials" in res5.text, f"Invalid password failed: {res5.text}"
    print("✔ Invalid password passed")
    
    # 6. Empty fields
    res6 = requests.post(f"{BASE_URL}/register", json={
        "name": "",
        "email": "empty@example.com",
        "password": ""
    })
    assert res6.status_code == 422, f"Empty fields failed to reject: {res6.text}"
    print("✔ Empty fields passed")
    
    print("All tests passed successfully!")

if __name__ == "__main__":
    try:
        test_auth()
    except Exception as e:
        print(f"Test Execution Failed: {e}")
