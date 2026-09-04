import 'dotenv/config';

import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../src/app.js';
import { Project } from '../src/models/Project.js';
import { Report } from '../src/models/Report.js';
import { User } from '../src/models/User.js';

const PASSWORD = 'Password123';

function testDatabaseUri() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('Missing MONGO_URI in backend/.env');
  }

  return uri.replace(/\/([^/?]*)(\?|$)/, '/weeklog_test$2');
}

async function createUser(name, email, role) {
  return User.create({
    name,
    email,
    role,
    passwordHash: await bcrypt.hash(PASSWORD, 4)
  });
}

async function signIn(email) {
  const agent = request.agent(app);

  await agent.post('/api/auth/login').send({ email, password: PASSWORD }).expect(200);

  return agent;
}

describe('role based access control', () => {
  let owner;
  let intruder;
  let manager;
  let ownerReport;

  before(async () => {
    await mongoose.connect(testDatabaseUri());
    await Promise.all([User.deleteMany({}), Project.deleteMany({}), Report.deleteMany({})]);

    manager = await createUser('Test Manager', 'manager@rbac.test', 'manager');
    owner = await createUser('Report Owner', 'owner@rbac.test', 'member');
    intruder = await createUser('Other Member', 'intruder@rbac.test', 'member');

    const project = await Project.create({
      name: 'RBAC Project',
      createdBy: manager._id
    });

    ownerReport = await Report.create({
      userId: owner._id,
      projectId: project._id,
      weekStart: new Date('2026-08-31T00:00:00Z'),
      weekEnd: new Date('2026-09-06T00:00:00Z'),
      status: 'submitted',
      submittedAt: new Date('2026-09-04T09:00:00Z')
    });
  });

  after(async () => {
    await Promise.all([User.deleteMany({}), Project.deleteMany({}), Report.deleteMany({})]);
    await mongoose.connection.close();
  });

  describe('a team member cannot reach another member\'s report', () => {
    it('refuses to read it', async () => {
      const agent = await signIn(intruder.email);
      const response = await agent.get(`/api/reports/mine/${ownerReport._id}`);

      assert.equal(response.status, 403);
      assert.equal(response.body.data, undefined);
    });

    it('refuses to edit it', async () => {
      const agent = await signIn(intruder.email);
      const response = await agent
        .put(`/api/reports/${ownerReport._id}`)
        .send({ projectId: ownerReport.projectId.toString() });

      assert.equal(response.status, 403);
    });

    it('refuses to read its version history', async () => {
      const agent = await signIn(intruder.email);
      const response = await agent.get(`/api/reports/${ownerReport._id}/versions`);

      assert.equal(response.status, 403);
    });

    it('still lets the owner read their own report', async () => {
      const agent = await signIn(owner.email);
      const response = await agent.get(`/api/reports/mine/${ownerReport._id}`);

      assert.equal(response.status, 200);
      assert.equal(response.body.data.report.id, ownerReport._id.toString());
    });
  });

  describe('a team member cannot reach a manager only endpoint', () => {
    const managerOnly = [
      ['get', '/api/users'],
      ['get', '/api/reports'],
      ['get', '/api/dashboard/summary'],
      ['get', '/api/dashboard/charts?type=tasksTrend'],
      ['get', '/api/dashboard/activity']
    ];

    for (const [method, url] of managerOnly) {
      it(`refuses ${method.toUpperCase()} ${url}`, async () => {
        const agent = await signIn(intruder.email);
        const response = await agent[method](url);

        assert.equal(response.status, 403);
      });
    }

    it('refuses to review a report', async () => {
      const agent = await signIn(intruder.email);
      const response = await agent
        .post(`/api/reports/${ownerReport._id}/review`)
        .send({ action: 'approve' });

      assert.equal(response.status, 403);
    });

    it('refuses to change a role', async () => {
      const agent = await signIn(intruder.email);
      const response = await agent
        .patch(`/api/users/${owner._id}/role`)
        .send({ role: 'manager' });

      assert.equal(response.status, 403);
    });

    it('still lets a manager through', async () => {
      const agent = await signIn(manager.email);

      await agent.get('/api/users').expect(200);
      await agent.get('/api/reports').expect(200);
      await agent.get('/api/dashboard/summary').expect(200);
    });
  });

  describe('signed out requests are rejected', () => {
    it('refuses a report list with no session', async () => {
      const response = await request(app).get('/api/reports/mine');

      assert.equal(response.status, 401);
    });

    it('refuses a manager endpoint with no session', async () => {
      const response = await request(app).get('/api/users');

      assert.equal(response.status, 401);
    });
  });
});
