import test from 'node:test';
import assert from 'node:assert/strict';

// Mock functions from the biometric system to test
const validateIdNumber = (id) => {
    return /^[A-Za-z0-9-]+$/.test(id) && id.length > 3;
};

const calculateConfidenceScore = (distance) => {
    return parseFloat(((1 - distance) * 100).toFixed(1));
};

const determineAccessStatus = (status, visitValidUntil) => {
    if (status === 'suspended' || status === 'discontinued') return false;
    if (status === 'active' || status === 'graduate') return true;
    if (status === 'visitor') {
        if (!visitValidUntil) return false;
        return new Date(visitValidUntil) >= new Date();
    }
    return false;
};

test('Biometric System Utility Tests', async (t) => {

    await t.test('validateIdNumber should correctly validate student IDs', () => {
        assert.strictEqual(validateIdNumber('STD-2023-001'), true);
        assert.strictEqual(validateIdNumber('ID123'), true);
        assert.strictEqual(validateIdNumber('12'), false); // too short
        assert.strictEqual(validateIdNumber('INV@LID'), false); // invalid characters
    });

    await t.test('calculateConfidenceScore should correct convert Euclidean distance to percentage', () => {
        assert.strictEqual(calculateConfidenceScore(0.35), 65.0);
        assert.strictEqual(calculateConfidenceScore(0.12), 88.0);
        assert.strictEqual(calculateConfidenceScore(0), 100.0);
        assert.strictEqual(calculateConfidenceScore(0.7), 30.0);
    });

    await t.test('determineAccessStatus should evaluate active and suspended users correctly', () => {
        assert.strictEqual(determineAccessStatus('active', null), true);
        assert.strictEqual(determineAccessStatus('suspended', null), false);
        assert.strictEqual(determineAccessStatus('graduate', null), true);
        assert.strictEqual(determineAccessStatus('discontinued', null), false);
    });

    await t.test('determineAccessStatus should evaluate visitor expiration correctly', () => {
        const futureDate = new Date();
        futureDate.setHours(futureDate.getHours() + 2);
        assert.strictEqual(determineAccessStatus('visitor', futureDate.toISOString()), true);

        const pastDate = new Date();
        pastDate.setHours(pastDate.getHours() - 1);
        assert.strictEqual(determineAccessStatus('visitor', pastDate.toISOString()), false);
    });
});
