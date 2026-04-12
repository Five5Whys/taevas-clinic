-- Tech Stack reference table
CREATE TABLE tech_stacks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL,
    category    VARCHAR(50)  NOT NULL,
    version     VARCHAR(50),
    description VARCHAR(500),
    status      VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    usage_area  VARCHAR(200),
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    created_by  VARCHAR(255)
);

CREATE INDEX idx_tech_stacks_category ON tech_stacks(category);
CREATE INDEX idx_tech_stacks_status   ON tech_stacks(status);

-- Seed with actual project technologies
INSERT INTO tech_stacks (name, category, version, description, status, usage_area) VALUES
('Java',         'Backend',   '17',      'Primary backend language',                    'ACTIVE', 'Application Logic'),
('Spring Boot',  'Backend',   '3.2.4',   'Backend framework',                           'ACTIVE', 'REST API & DI'),
('Spring Security','Backend', '6.x',     'Authentication & authorization framework',    'ACTIVE', 'Security'),
('JWT',          'Security',  '0.12.3',  'JSON Web Tokens for stateless auth',          'ACTIVE', 'Authentication'),
('PostgreSQL',   'Database',  '17.6',    'Primary relational database',                 'ACTIVE', 'Data Storage'),
('Redis',        'Database',  '7.x',     'In-memory store for token caching',           'ACTIVE', 'Token Caching'),
('Flyway',       'Backend',   '10.x',    'Database migration tool',                     'ACTIVE', 'Schema Migrations'),
('MapStruct',    'Backend',   '1.5.5',   'Compile-time DTO mapper',                     'ACTIVE', 'Object Mapping'),
('Lombok',       'Backend',   '1.18.x',  'Boilerplate code reduction',                  'ACTIVE', 'Code Generation'),
('React',        'Frontend',  '18',      'UI component library',                        'ACTIVE', 'UI Framework'),
('TypeScript',   'Frontend',  '5.3',     'Typed JavaScript superset',                   'ACTIVE', 'Type Safety'),
('Vite',         'Frontend',  '8.0',     'Fast frontend build tool',                    'ACTIVE', 'Build & Dev Server'),
('MUI',          'Frontend',  '5.14',    'Material UI component library',               'ACTIVE', 'UI Components'),
('React Query',  'Frontend',  '5.28',    'Server state management',                     'ACTIVE', 'Data Fetching'),
('Zustand',      'Frontend',  '4.x',     'Lightweight state management',                'ACTIVE', 'Client State'),
('React Router', 'Frontend',  '6.x',     'Client-side routing',                         'ACTIVE', 'Navigation'),
('Docker',       'DevOps',    'latest',  'Containerization platform',                   'ACTIVE', 'Deployment'),
('Playwright',   'DevOps',    '1.x',     'End-to-end testing framework',                'ACTIVE', 'E2E Testing');
