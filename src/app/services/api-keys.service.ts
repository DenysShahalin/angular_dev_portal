import { Injectable } from '@angular/core';

import keysData from '../mocks/keys.json';

import type { ApiKey } from '../types/keys';

@Injectable({ providedIn: 'root' })
export class ApiKeysService {
  keys: ApiKey[] = keysData;

  async getAllApiKeys(): Promise<ApiKey[]> {
    return new Promise((resolve) => {
      resolve(this.keys);
    });
  }

  async getApiKey(key: string): Promise<ApiKey | null> {
    return new Promise((resolve) => {
      const apiKey = this.keys.find((k) => k.key === key);
      resolve(apiKey || null);
    });
  }

  async createApiKey(newKey: Omit<ApiKey, 'createdAt' | 'lastUsedAt' | 'usage'>): Promise<ApiKey> {
    return new Promise((resolve) => {
      const apiKey: ApiKey = {
        ...newKey,
        createdAt: new Date().toISOString(),
        lastUsedAt: new Date().toISOString(),
        overallUsage: 0,
        usage: [],
      };
      this.keys.push(apiKey);
      resolve(apiKey);
    });
  }

  async deleteApiKey(name: string): Promise<null> {
    return new Promise((resolve) => {
      this.keys = this.keys.filter((k) => k.name !== name);
      resolve(null);
    });
  }

  async updateApiKey(
    name: string,
    updatedData: Partial<Omit<ApiKey, 'createdAt' | 'lastUsedAt' | 'usage'>>,
  ): Promise<ApiKey | null> {
    return new Promise((resolve) => {
      const index = this.keys.findIndex((k) => k.name === name);
      if (index === -1) {
        resolve(null);
        return;
      }
      this.keys[index] = { ...this.keys[index], ...updatedData };
      resolve(this.keys[index]);
    });
  }
}
