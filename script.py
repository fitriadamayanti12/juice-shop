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
    """Memfilter vulnerabilitas berdasarkan risk code tinggi atau kritis."""
    high_severity_codes = ['4', '5']  # High=4, Critical=5
    filtered_vulns = []

    for site in report.get('site', []):
        for alert in site.get('alerts', []):
            if alert['riskcode'] in high_severity_codes:
                filtered_vulns.append(alert)
    
    return filtered_vulns

def create_case_in_thehive(vulnerability):
    """Membuat kasus baru di TheHive untuk setiap vulnerabilitas."""
    case_data = {
        "title": f"Vulnerability: {vulnerability['name']}",
        "description": vulnerability['desc'],
        "severity": int(vulnerability['riskcode']),  # Menggunakan risk code sebagai severity 
        "tags": ["DAST", "ZAP"]
    }
    
    response = requests.post(f"{THEHIVE_URL}/api/case", headers=THEHIVE_HEADERS, json=case_data)
    
    if response.status_code == 201:
        print(f"Case created for {vulnerability['name']}")
    else:
        print(f"Failed to create case for {vulnerability['name']}: {response.text}")

def block_deployment():
     """Memblokir proses deployment."""
     payload = {
         "action": "block",
         "reason": "High or critical vulnerabilities found"
     }
     
     response = requests.post(DEPLOYMENT_URL, json=payload)
     
     if response.status_code == 200:
         print("Deployment blocked successfully.")
     else:
         print(f"Failed to block deployment: {response.text}")

def main(zap_report_path):
      try:
          # Baca laporan ZAP dengan path yang diberikan sebagai argumen 
          report = read_zap_report(zap_report_path)
          
          # Filter vulberbilitias 
          filtered_vulns = filter_vulnerabilities(report)
          
          # Buat kasus di TheHive dan blokir deployment jika ada vulberbilitias tinggi atau kritis 
          if filtered_vulns:
              for vuln in filtered_vulns:
                  create_case_in_thehive(vuln)  
              block_deployment()
           else: 
               print("No high or critical vulnerabilities found.")
      
      except Exception as e: 
            print(f"An error occurred: {e}")

if __name__ == "__main__":
      import sys
      
      zap_report_file_path=sys.argv[1] if len(sys.argv) > 1 else None
      
      main(zap_report_file_path)
