module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: 'lib/.*spec.ts$',
    collectCoverageFrom: [
        'lib/**/*.{js,jsx,tsx,ts}',
        '!**/node_modules/**',
        '!**/vendor/**',
        '!**/*.spec.ts',
    ],
    coverageDirectory: 'coverage/unit',
};
