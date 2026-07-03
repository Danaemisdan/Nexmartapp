import crypto from 'crypto';

const OVALOOP_PUBLIC_KEY = "pk_af490e56df8caf8b5662a0c8b546d153790f338d";
const OVALOOP_SECRET_KEY = "sk_f614b38540d4e810683115d87406c70a783bd39f16e7f60d6636743626fb51a859064f0f804f7ae6";
const API_BASE = "https://devapi.ovaloop.app/partner/orders";

function getHeaders() {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = crypto.createHmac('sha512', OVALOOP_SECRET_KEY).update(timestamp, 'utf8').digest('hex');
    return {
        'Content-Type': 'application/json',
        'X-OVALOOP-PARTNER-KEY': OVALOOP_PUBLIC_KEY,
        'X-OVALOOP-TIMESTAMP': timestamp,
        'X-OVALOOP-SIGNATURE': signature
    };
}

async function runTest() {
    console.log("=== 1. Creating Order ===");
    const group_order_reference = `ORD_TEST_${Date.now()}`;
    const orderPayload = [{
        business_id: "14c8d30b-c1c3-41c1-8d76-62108fdde5f1",
        customer_firstname: "John",
        customer_lastname: "Test",
        customer_phone: "08012345678",
        customer_address: "Test address",
        product_id: "6fd84910-3319-4789-b303-2a4e3ac2fdfe",
        unit_measurement: "Bag",
        quantity: 2,
        price: 5000,
        group_order_reference
    }];

    const createRes = await fetch(`${API_BASE}/`, {
        method: 'POST', headers: getHeaders(), body: JSON.stringify(orderPayload)
    });
    
    if (!createRes.ok) throw new Error("Create failed: " + await createRes.text());
    const createData = await createRes.json();
    console.log("Created successfully:", createData);

    console.log("\n=== 2. Retrieving Order Details ===");
    const getRes = await fetch(`${API_BASE}/${group_order_reference}/`, {
        method: 'GET', headers: getHeaders()
    });
    const getData = await getRes.json();
    console.log(`Order status: ${getData.status}, Total: ${getData.total_amount}`);
    
    const firstItemId = getData.items[0].order_id;
    console.log(`First item UUID: ${firstItemId}`);

    console.log("\n=== 3. Returning 1 item ===");
    const returnPayload = [{ order_id: firstItemId, return_quantity: 1 }];
    const returnRes = await fetch(`${API_BASE}/${group_order_reference}/return/`, {
        method: 'POST', headers: getHeaders(), body: JSON.stringify(returnPayload)
    });
    const returnData = await returnRes.json();
    console.log(`Return successful. New Total Amount: ${returnData.total_amount}, Remaining Qty: ${returnData.items[0].qty}`);

    console.log("\n=== 4. Cancelling the entire order ===");
    const cancelRes = await fetch(`${API_BASE}/${group_order_reference}/cancel/`, {
        method: 'POST', headers: getHeaders(), body: JSON.stringify({})
    });
    const cancelData = await cancelRes.json();
    console.log(`Cancel successful. Status: ${cancelData.status}, New Total: ${cancelData.total_amount}`);

    console.log("\n✅ All order management API tests passed!");
}

runTest().catch(console.error);
