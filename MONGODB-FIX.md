# MongoDB Connection Fix Guide

## Problem: DNS Resolution Failed

Your computer cannot resolve `cluster0.awgnnjp.mongodb.net`

## Solutions (try in order):

### ✅ Solution 1: Change DNS to Google DNS

**Windows GUI Method:**

1. Press `Win + R`, type `ncpa.cpl`, press Enter
2. Right-click your active network adapter → Properties
3. Select "Internet Protocol Version 4 (TCP/IPv4)" → Properties
4. Select "Use the following DNS server addresses"
5. Preferred DNS: `8.8.8.8`
6. Alternate DNS: `8.8.4.4`
7. Click OK, OK

**OR Use the automated script:**

```batch
Right-click fix-dns.bat → Run as Administrator
```

### ✅ Solution 2: Flush DNS Cache

```powershell
ipconfig /flushdns
Clear-DnsClientCache
```

### ✅ Solution 3: Disable VPN/Proxy

If you're using a VPN or proxy, temporarily disable it and try again.

### ✅ Solution 4: Use Mobile Hotspot

Connect to your mobile phone's hotspot and test the connection.

### ✅ Solution 5: Check Firewall

```powershell
# Temporarily disable Windows Firewall to test
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False

# Re-enable after testing
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
```

### ✅ Solution 6: Use Local MongoDB (Development Only)

**Install MongoDB locally:**

1. Download MongoDB Community from: https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Change `.env` to:

```
MONGO_URI=mongodb://localhost:27017/interviewprepai
```

## After applying a fix:

Test the connection:

```bash
node test-connection.js
```

Then start your server:

```bash
npm run dev
```

## Still not working?

Contact your network administrator - your network may be blocking MongoDB Atlas (port 27017).
