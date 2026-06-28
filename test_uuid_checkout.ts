import crypto from 'crypto';

try {
    const OVALOOP_PUBLIC_KEY = "pk_af490e56df8caf8b5662a0c8b546d153790f338d";
    const OVALOOP_SECRET_KEY = "sk_f614b38540d4e810683115d87406c70a783bd39f16e7f60d6636743626fb51a859064f0f804f7ae6";
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = crypto.createHmac('sha512', OVALOOP_SECRET_KEY).update(timestamp, 'utf8').digest('hex');
    
    // Attempt fetch with documentation UUIDs
    const orderPayload = [{
        business_id: "14c8d30b-c1c3-41c1-8d76-62108fdde5f1",
        customer_firstname: "John",
        customer_lastname: "Doe",
        customer_phone: "08012345678",
        customer_address: "Customer delivery address",
        product_id: "6fd84910-3319-4789-b303-2a4e3ac2fdfe",
        unit_measurement: "Bag",
        quantity: 2,
        price: 5000,
        group_order_reference: `ORD${Date.now()}`
    }];
    
    fetch('https://devapi.ovaloop.app/partner/orders/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-OVALOOP-PARTNER-KEY': OVALOOP_PUBLIC_KEY,
            'X-OVALOOP-TIMESTAMP': timestamp,
            'X-OVALOOP-SIGNATURE': signature
        },
        body: JSON.stringify(orderPayload)
    }).then(res => {
        console.log("Fetch OK, Status:", res.status);
        res.text().then(console.log);
    }).catch(console.error);

} catch (e) {
    console.error("Crash", e);
}
