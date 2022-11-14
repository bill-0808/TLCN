const app = require('../../app');
const req = require('supertest');

describe('test', () => {
    it('test get planets', async () => {
        const res = await req(app).get('/planets').send();
        expect(res.statusCode).toEqual(200);
    })

    it('test get launches', async () => {
        const res = await req(app).get('/launches').send();
        expect(res.statusCode).toEqual(200);
    })

    it('test add new launches', async () => {
        const res = await req(app).post('/launches').send({
            mission: "ZTM155",
            rocket: "ZTM Experimental IS1",
            target: "Kepler-186 f",
            launchDate: "January 17, 2030"
        });
        expect(res.statusCode).toEqual(201);
    })

    it('test add new launches', async () => {
        const res = await req(app).post('/launches').send({
            mission: "ZTM155",
            rocket: "ZTM Experimental IS1",
            target: "Kepler-186 f",
            launchDate: "17, 2030"
        });
        expect(res.statusCode).toEqual(400);
    })

    it('test add new launches', async () => {
        const res = await req(app).post('/launches').send({
            mission: "ZTM155",
            target: "Kepler-186 f",
            launchDate: "January 17, 2030"
        });
        expect(res.statusCode).toEqual(400);
    })

    it('test delete launches', async () => {
        const res = await req(app).delete('/launches/1000').send();
        expect(res.statusCode).toEqual(404);
    })

    it('test delete launches', async () => {
        const res = await req(app).delete('/launches/100').send();
        expect(res.statusCode).toEqual(200);
    })
})