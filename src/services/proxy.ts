import { SocksProxyAgent } from "socks-proxy-agent";

export const proxyUrl = process.env.PROXY || "";

export function getRandomProxy() {
  console.log(`[Proxy] Using proxy: ${proxyUrl}`);
  return new SocksProxyAgent(proxyUrl);
}
