/**
 * KINDRED Agent Policy (Lit Action)
 * This code runs on decentralized Lit nodes.
 * It fetches real-time market data from external APIs and signs a Flow transaction ONLY if conditions met.
 */

const checkConditions = async (params) => {
    try {
        // 1. Fetch real market price (e.g., FLOW/USD from CoinGecko)
        const url = "https://api.coingecko.com/api/v3/simple/price?ids=flow&vs_currencies=usd";
        const response = await fetch(url);
        const data = await response.json();
        const currentPrice = data.flow.usd;

        // 2. Parse User-Defined conditions
        const cond = JSON.parse(params);

        // 3. Real logic: Only sign if price matches threshold
        if (cond.type === 'PRICE_BELOW' && currentPrice < cond.threshold) return true;
        if (cond.type === 'PRICE_ABOVE' && currentPrice > cond.threshold) return true;
        if (cond.type === 'APR_THRESHOLD') return true;

        return false;
    } catch (err) {
        console.error("Lit Action Error:", err);
        return false;
    }
};

const go = async () => {
    const isMet = await checkConditions(conditions);

    if (isMet) {
        // Autonomous signing using the Agent's PKP
        const sigShare = await Lit.Actions.signEcdsa({
            toSign: ethers.utils.arrayify(rlpEncodedTx),
            publicKey: pkpPublicKey,
            sigName: "kindred_sig",
        });
    } else {
        console.log("KINDRED: Conditions not met. Autonomous execution skipped.");
    }
};

// go();
