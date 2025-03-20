import subprocess
import requests
import json
from urllib.parse import quote

# List of APIs with {url} placeholder
APIS = [
    "https://api.websitecarbon.com/b?url={url}",
    "http://localhost:3000/api/ports?url={ip}",
    "https://api.shodan.io/shodan/host/{ip}?key=undefined",
    "https://ipapi.co/{ip}/json/",
    "http://localhost:3000/api/features?url={url}",
    "http://localhost:3000/api/carbon?url={url}",
    "http://localhost:3000/api/sitemap?url={url}",
    "http://localhost:3000/api/block-lists?url={url}",
    "http://localhost:3000/api/txt-records?url={url}",
    "https://api.whoapi.com/?domain={url}&r=whois&apikey=undefined",
    "http://localhost:3000/api/status?url={url}",
    "http://localhost:3000/api/robots-txt?url={url}",
    "http://localhost:3000/api/linked-pages?url={url}",
    "http://localhost:3000/api/redirects?url={url}",
    "http://localhost:3000/api/tls?url={url}",
    "http://localhost:3000/api/screenshot?url={url}",
    "http://localhost:3000/api/rank?url={url}",
    "http://localhost:3000/api/archives?url={url}",
    "http://localhost:3000/api/mail-config?url={url}",
    "http://localhost:3000/api/threats?url={url}",
    "http://localhost:3000/api/hsts?url={url}",
    "http://localhost:3000/api/dnssec?url={url}",
    "http://localhost:3000/api/firewall?url={url}",
    "http://localhost:3000/api/dns-server?url={url}",
    "http://localhost:3000/api/security-txt?url={url}",
    "http://localhost:3000/api/trace-route?url={url}",
    "http://localhost:3000/api/social-tags?url={url}",
    "http://localhost:3000/api/http-security?url={url}",
    "http://localhost:3000/api/dns?url={url}",
    "http://localhost:3000/api/headers?url={url}",
    "http://localhost:3000/api/cookies?url={url}",
    "http://localhost:3000/api/tech-stack?url={url}",
    "http://localhost:3000/api/quality?url={url}",
    "http://localhost:3000/api/whois?url={url}",
    "http://localhost:3000/api/ssl?url={url}",
    "http://localhost:3000/api/get-ip?url={url}"
]

def get_subdomains(domain):
    """Runs assetfinder and returns a list of subdomains."""
    output = subprocess.check_output(['assetfinder', '--subs-only', domain], text=True)
    # Remove leading "*." from subdomains
    subdomains = {sub.lstrip("*.") for sub in output.strip().split("\n")}
    
    return sorted(subdomains)  # Return sorted list
    # return sorted(set(output.strip().split("\n")))  # Remove duplicates and sort

def get_ip(subdomain):
    """Resolves a domain to its IP address."""
    try:
        import socket
        return socket.gethostbyname(subdomain)
    except:
        return None  # Return None if IP resolution fails

def query_apis(subdomain):
    """Calls each API for a given subdomain and returns the results."""
    ip = get_ip(subdomain)
    data = {"subdomain": subdomain, "ip": ip, "results": {}}

    for api in APIS:
        url = api.format(url=quote(f"https://{subdomain}"), ip=ip or "0.0.0.0")
        try:
            response = requests.get(url, timeout=5)
            data["results"][api] = response.json() if response.headers.get("Content-Type") == "application/json" else response.text
        except Exception as e:
            data["results"][api] = f"Error: {str(e)}"

    return data

def save_results(domain, results):
    """Saves the results to a JSON file."""
    filename = f"{domain}_osint_results.json"
    with open(filename, "w") as f:
        json.dump(results, f, indent=4)
    print(f"Results saved to {filename}")

def main():
    domain = input("Enter the main domain: ").strip()
    subdomains = get_subdomains(domain)
    
    all_results = []
    for sub in subdomains:
        print(f"Scanning: {sub}")
        all_results.append(query_apis(sub))
    
    save_results(domain, all_results)

if __name__ == "__main__":
    main()
