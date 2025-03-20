import subprocess

url='mfi.org.ph'

output = subprocess.check_output(['assetfinder' , '--subs-only' , url] , text=True)
files = set(output.strip().split('\n'))
for file in files:
    print(file)

    