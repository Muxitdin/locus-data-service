import { Injectable } from '@nestjs/common';

type User = { username: string; password: string; role: string };

@Injectable()
export class UsersService {
    // pre-defined users
    private readonly users: User[] = [
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'normal', password: 'normal123', role: 'normal' },
        { username: 'limited', password: 'limited123', role: 'limited' },
    ];

    async findByUsername(username: string) {
        return this.users.find((u) => u.username === username);
    }
}
