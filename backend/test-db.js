const mongoose = require('mongoose');
const dns = require('dns');

// Prefer IPv4 first for DNS resolution
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

async function testConnections() {
  const uris = {
    shree_raam: 'mongodb+srv://shree_raam:137HH01nT3AWuWRb@srm.qfmvhaz.mongodb.net/brand-store?retryWrites=true&w=majority&appName=SRM',
    nileshsingh: 'mongodb+srv://nileshsingh:137HH01nT3AWuWRb@srm.qfmvhaz.mongodb.net/brand-store?retryWrites=true&w=majority&appName=SRM'
  };

  for (const [user, uri] of Object.entries(uris)) {
    try {
      console.log(`Testing connection for user: ${user}...`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log(`✅ SUCCESS: User '${user}' connected successfully!`);
      await mongoose.disconnect();
    } catch (err) {
      console.log(`❌ FAILED: User '${user}' failed to connect. Error: ${err.message}`);
    }
  }
  process.exit(0);
}

testConnections();
