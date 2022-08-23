import fs from 'fs';

import axios from 'axios';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

import { getChainId, getForkedAtBlock } from './fork';

import { getNetworkInfo } from '~common/functions';

const PRICE_CACHE_FILE = 'test/helpers/price_cache.json';

interface PriceCache {
  [network: number]: {
    [blockNumber: number]: {
      [tokenAddress: string]: string;
    };
  };
}

const priceCache: PriceCache | null = null;

function getPriceCache(): PriceCache {
  if (priceCache != null) return priceCache;
  let cache: PriceCache;
  try {
    const file = fs.readFileSync(PRICE_CACHE_FILE, 'utf-8');
    cache = JSON.parse(file) as unknown as PriceCache;
  } catch (e) {
    cache = {};
  }
  return cache;
}

function getCachedPrice(network: number, blocknumber: number, token: string): BigNumber {
  try {
    const cachedValue = getPriceCache()[network][blocknumber][token];
    return BigNumber.from(cachedValue);
  } catch (e) {
    throw new Error('No cached value');
  }
}

function savePriceCache(priceCache: PriceCache): void {
  fs.writeFileSync(PRICE_CACHE_FILE, JSON.stringify(priceCache), 'utf-8');
}

function cachePrice(network: number, blocknumber: number, token: string, price: BigNumber): void {
  const priceCache = getPriceCache();
  const networkCache = priceCache[network] ?? {};
  const blockCache = networkCache[blocknumber] ?? {};
  blockCache[token] = price.toString();
  networkCache[blocknumber] = blockCache;
  priceCache[network] = networkCache;
  savePriceCache(priceCache);
}

interface CoinGeckoSimpleTokenPriceResponse {
  [address: string]: { usd: number };
}

export async function getCGTokenPrice(tokenAddr: string, decimals?: number): Promise<BigNumber> {
  const networkName = getNetworkInfo(getChainId())?.name ?? 'local';
  const apiUrl = `https://api.coingecko.com/api/v3/simple/token_price/${networkName}?contract_addresses=${tokenAddr}&vs_currencies=usd`;
  const response = await axios.get<CoinGeckoSimpleTokenPriceResponse>(apiUrl);
  const price = response.data[tokenAddr.toLocaleLowerCase()].usd;
  return parseUnits(price.toString(), decimals ?? 'ether');
}

export async function getCGTokenPriceDenominatedBy(token0: string, token1: string, decimals?: number): Promise<BigNumber> {
  const price0 = await getCGTokenPrice(token0);
  const price1 = await getCGTokenPrice(token1);
  return price0.mul(decimals ?? parseUnits('1', 'ether')).div(price1);
}

export async function getPrice(token: string): Promise<BigNumber> {
  let price: BigNumber;
  try {
    price = getCachedPrice(getChainId(), getForkedAtBlock(), token);
  } catch (e) {
    price = await getCGTokenPrice(token);
    cachePrice(getChainId(), getForkedAtBlock(), token, price);
  }
  return price;
}

export async function getPriceDenominatedIn(token0: string, token1: string): Promise<BigNumber> {
  const price0 = await getPrice(token0);
  const price1 = await getPrice(token1);
  return price0.mul(parseUnits('1', 'ether')).div(price1);
}
