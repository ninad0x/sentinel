"use server"
import dns from "dns/promises"

function isPrivateIP(ip: string) {
    return /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|127\.|169\.254\.|::1|fc|fd)/.test(ip);
}

export async function validateWebsite(input: string) {
    if (!input) return null

    const result = { 
        valid: false,
        reachable: false,
        status: null,
        message: ""
    };
    
    try {
        const url = new URL(input.startsWith("http") ? input : `https://${input}`);

        if (!["http:", "https:"].includes(url.protocol)) {
            return { ...result, message: "Only HTTP/HTTPS supported." };
        }

        // DNS check
        let address: string;
        try {
            const result = await dns.lookup(url.hostname);
            address = result.address;
        } catch {
            return { ...result, message: "Domain does not exist." };
        }

        // block private/internal IPs
        if (isPrivateIP(address)) {
            return { ...result, message: "Invalid URL." };
        }

        // Check if site is reachable
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 4000);

        const res = await fetch(url.toString(), { method: "HEAD", signal: controller.signal })
            .catch(() => null);

        return {
            valid: true,
            reachable: !!res,
            status: res?.status ?? null,
            message: res?.ok ? "Website is reachable."
                : res ? `Responded with ${res.status}. Can still monitor.`
                : "Site unreachable but domain exists. Can still monitor.",
        };

    } catch {
        return { ...result, message: "Invalid URL." };
    }
}