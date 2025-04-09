import json
import requests
import argparse

# Konfigurasi API TheHive
THEHIVE_URL = 'https://3ad0ecb1a8aa1ba179710fefc63652cb.serveo.net'
THEHIVE_API_KEY = 'RmAfOa6miYBQdgTGE12x8JyQ09DNt+bq'
THEHIVE_HEADERS = {
    'Authorization': f'Bearer {THEHIVE_API_KEY}',
    'Content-Type': 'application/json'
}

# Konfigurasi API Deployment Blocker
DEPLOYMENT_BLOCKER_URL = 'https://juice-shop-production-e00a.up.railway.app'

def read_zap_report(file_path):
    """Membaca dan mengembalikan isi file laporan ZAP."""
    with open(file_path, 'r') as file:
        return json.load(file)

def filter_vulnerabilities(report):
    """Memfilter vulnerabilitas berdasarkan severity tinggi atau kritis."""
    severity = ['High', 'Critical']
    filtered_vulns = [vuln for vuln in report['vulnerabilities'] if vuln['severity'] in high_severity]
    return filtered_vulns

def create_case_in_thehive(vulnerability):
    """Membuat kasus baru di TheHive untuk setiap vulnerabilitas."""
    case_data = {
        "title": f"Vulnerability: {vulnerability['name']}",
        "description": vulnerability['description'],
        "severity": 2 if vulnerability['severity'] == 'High' else 3,  # 2=High, 3=Critical
        "tags": ["DAST", "ZAP"]
    }
    response = requests.post(f"{THEHIVE_URL}/api/case", headers=THEHIVE_HEADERS, json=case_data)
    if response.status_code == 201:
        print(f"Case created for {vulnerability['name']}")
    else:
        print(f"Failed to create case for {vulnerability['name']}: {response.text}")

def block_deployment():
    """Memblokir proses deployment."""
    response = requests.post(DEPLOYMENT_BLOCKER_URL)
    if response.status_code == 200:
        print("Deployment blocked successfully.")
    else:
        print(f"Failed to block deployment: {response.text}")

def main(zap_report_path):
    try:
        # Baca laporan ZAP
        report = read_zap_report(zap_report_path)
        
        # Filter vulnerabilitas
        filtered_vulns = filter_vulnerabilities(report)
        
        # Buat kasus di TheHive dan blokir deployment jika ada vulnerabilitas tinggi atau kritis
        if filtered_vulns:
            for vuln in filtered_vulns:
                create_case_in_thehive(vuln)
            block_deployment()
        else:
            print("No high or critical vulnerabilities found.")
    
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Process ZAP report and create TheHive cases.')
    parser.add_argument('--zap-report', type=str, required=True, help='Path to the ZAP report JSON file')
    args = parser.parse_args()
    main(args.zap_report)
