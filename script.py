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
    """Memfilter vulnerabilitas berdasarkan riskcode tinggi atau kritis."""
    high_risk_codes = ['1', '2']  # Misalkan 1=Critical, 2=High sesuai dengan riskcode di ZAP.
    
    filtered_alerts = []
    
    for site in report.get('site', []):
        for alert in site.get('alerts', []):
            if alert['riskcode'] in high_risk_codes:
                filtered_alerts.append(alert)
                
    return filtered_alerts

def create_case_in_thehive(alert):
    """Membuat kasus baru di TheHive untuk setiap alert."""
    
    case_data = {
        "title": f"Vulnerability: {alert['name']}",
        "description": alert['desc'],
        "severity": int(alert['riskcode']),  # Menggunakan riskcode sebagai severity.
        "tags": ["DAST", "ZAP"]
    }
    
    response = requests.post(f"{THEHIVE_URL}/api/case", headers=THEHIVE_HEADERS, json=case_data)
    
    if response.status_code == 201:
        print(f"Case created for {alert['name']}")
        
def block_deployment():
   """Memblokir proses deployment menggunakan URL biasa."""
   payload = {
       "action": "block",
       "reason": "High or critical vulnerabilities found"
   }
   
   response = requests.post(DEPLOYMENT_BLOCKER_URL, json=payload)
   
   if response.status_code == 200:
       print("Deployment blocked successfully.")
   else:
       print(f"Failed to block deployment: {response.text}")

def main():
   parser = argparse.ArgumentParser(description='Process ZAP report and manage vulnerabilities.')
   parser.add_argument('--zap-report', required=True, help='Path to the zap_report.json file')
   
   args = parser.parse_args()
   
   try:
       # Baca laporan ZAP
       report = read_zap_report(args.zap_report)
       
       # Filter vulnerabilitas
       filtered_alerts = filter_vulnerabilities(report)
       
       # Buat kasus di TheHive dan blokir deployment jika ada vulberbilitias tinggi atau kritis 
       if filtered_alerts:
           for alert in filtered_alerts:
               create_case_in_thehive(alert)
           block_deployment()
       else: 
           print("No high or critical vulnerabilities found.")
           
   except Exception as e: 
      print(f"An error occurred: {e}")

if __name__ == "__main__":
      main()
