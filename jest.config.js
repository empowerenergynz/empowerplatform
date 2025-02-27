module.exports = {
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/resources/ts/$1',
        '\\.css$': '<rootDir>/resources/ts/jest/__mocks__/styleMock.ts',
    },
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testEnvironment: 'jsdom',
    setupFiles: [],
    setupFilesAfterEnv: [
        '@testing-library/jest-dom/extend-expect',
    ],
    testRegex: 'resources/ts/.*.(test|spec).(ts|tsx)$',
    collectCoverage: false,
    collectCoverageFrom : [
        'resources/ts/**/*.{tsx,ts}',
    ],
    coverageReporters: ['clover', ['html', { 'subdir': 'clover_html' }]],
    coverageDirectory: 'coverage/jest',
    testURL: "http://localhost",
    testTimeout: 30000
};
