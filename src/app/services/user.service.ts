import { Injectable } from '@angular/core';

import userData from '../mocks/user.json';

import type { User } from '../types/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  async getUserData(): Promise<User> {
    return new Promise((resolve) => {
      resolve(userData);
    });
  }
}
