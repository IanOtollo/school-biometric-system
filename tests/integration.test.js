import test from 'node:test';
import assert from 'node:assert/strict';

// Mock database
const mockDb = {
    users: [],
    logs: []
};

// Simulated integration functions
const registerUser = async (user) => {
    mockDb.users.push({
        ...user,
        id: `USR-${Date.now()}`,
        registered_at: new Date().toISOString()
    });
    return true;
};

const verifyEntry = async (faceDescriptor) => {
    if (!faceDescriptor) throw new Error("No face descriptor provided");

    // Simulate finding the registered user by descriptor match
    const user = mockDb.users.find(u => u.name === "Jane Doe");
    const isMatch = !!user;

    if (isMatch) {
        let granted = user.status === 'active';
        mockDb.logs.push({
            user_id: user.id_number,
            action: granted ? 'access_granted' : 'access_denied',
            confidence: 96.5,
            timestamp: new Date().toISOString()
        });
        return { success: granted, user };
    } else {
        mockDb.logs.push({ user_id: 'unknown', action: 'access_denied', timestamp: new Date().toISOString() });
        return { success: false, message: "Face not recognized" };
    }
};

const getDashboardStats = async () => {
    return {
        totalUsers: mockDb.users.length,
        totalLogs: mockDb.logs.length,
        activeUsers: mockDb.users.filter(u => u.status === 'active').length
    };
};

test('Full System Integration Workflow', async (t) => {

    await t.test('[Step 1] Initial Database State is empty', async () => {
        const stats = await getDashboardStats();
        assert.strictEqual(stats.totalUsers, 0);
        assert.strictEqual(stats.totalLogs, 0);
    });

    await t.test('[Step 2] User Registration (Staff)', async () => {
        const success = await registerUser({
            name: "Jane Doe",
            id_number: "EMP-2024",
            role: "staff",
            status: "active",
            face_descriptor: [0.1, 0.4, 0.5] // mock descriptor
        });
        assert.strictEqual(success, true);

        const stats = await getDashboardStats();
        assert.strictEqual(stats.totalUsers, 1);
    });

    await t.test('[Step 3] Face Verification (Access Granted)', async () => {
        const result = await verifyEntry([0.11, 0.42, 0.49]); // close match
        assert.strictEqual(result.success, true);
        assert.strictEqual(result.user.name, "Jane Doe");

        const stats = await getDashboardStats();
        assert.strictEqual(stats.totalLogs, 1);
        assert.strictEqual(mockDb.logs[0].action, 'access_granted');
    });

    await t.test('[Step 4] Admin Dashboard Status Update', async () => {
        // Simulate admin suspending the user
        mockDb.users[0].status = 'suspended';

        const stats = await getDashboardStats();
        assert.strictEqual(stats.activeUsers, 0);
    });

    await t.test('[Step 5] Face Verification (Access Denied due to Suspended Status)', async () => {
        const result = await verifyEntry([0.11, 0.42, 0.49]);
        assert.strictEqual(result.success, false);
        assert.strictEqual(mockDb.logs[1].action, 'access_denied');
    });
});
