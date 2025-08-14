import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('LocusController (e2e)', () => {
    let app: INestApplication;
    let token: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ username: 'admin', password: 'admin123' })
            .expect(201);

        token = loginRes.body.access_token;
        expect(token).toBeDefined();
    });

    afterAll(async () => {
        await app.close();
    });

    it('1. получение locus с пагинацией по умолчанию (1000)', async () => {
        const res = await request(app.getHttpServer())
            .get('/locus')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeLessThanOrEqual(1000);
    });

    it('2. получение locus с sideloading locusMembers', async () => {
        const res = await request(app.getHttpServer())
            .get('/locus?sideload=locusMembers&limit=10')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        res.body.forEach((item) => {
            expect(item).toHaveProperty('locusMembers');
            expect(Array.isArray(item.locusMembers)).toBe(true);
        });
    });

    it('3. должен фильтровать locus по id', async () => {
        const targetId = 1878818;
        const res = await request(app.getHttpServer())
            .get(`/locus?id=${targetId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body.length).toBeGreaterThan(0);
        res.body.forEach((item) => {
            expect(item.id).toBe(targetId);
        });
    });

    it('4. должен фильтровать locus по regionId (включает sideload)', async () => {
        const regionIds = [29047304, 31570902];
        const res = await request(app.getHttpServer())
            .get(`/locus?regionId=${regionIds.join(',')}&sideload=locusMembers`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body.length).toBeGreaterThan(0);
        res.body.forEach((item) => {
            expect(item.locusMembers.some((m) => regionIds.includes(m.regionId))).toBe(true);
        });
    });

    it('5. должен применять limit и offset', async () => {
        const resLimit = await request(app.getHttpServer())
            .get('/locus?limit=5')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(resLimit.body.length).toBeLessThanOrEqual(5);

        const resOffset = await request(app.getHttpServer())
            .get('/locus?limit=5&offset=5')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(resOffset.body.length).toBeLessThanOrEqual(5);

        if (resLimit.body.length > 0 && resOffset.body.length > 0) {
            expect(resLimit.body[0].id).not.toBe(resOffset.body[0].id);
        }
    });
});
