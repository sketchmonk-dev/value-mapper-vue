# Contributing to Value Mapper Vue

Thank you for your interest in contributing to Value Mapper Vue! We welcome contributions from the community and are grateful for any help you can provide.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and constructive in all interactions.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your feature or bug fix
4. Make your changes
5. Test your changes
6. Submit a pull request

## Development Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Git

### Setup Instructions

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/value-mapper-vue.git
cd value-mapper-vue

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build the library
npm run build
```

### Project Structure

```
src/
├── components/           # Vue components
├── composables/         # Vue composables
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── stories/            # Storybook stories
```

## How to Contribute

### Types of Contributions

We welcome several types of contributions:

- **Bug fixes** - Fix issues in the existing codebase
- **Feature additions** - Add new functionality to the library
- **Documentation improvements** - Enhance README, API docs, or examples
- **Performance improvements** - Optimize existing code
- **Testing** - Add or improve test coverage
- **Examples** - Create new usage examples or demos

### Before You Start

1. **Check existing issues** - Look for existing issues that match your intended contribution
2. **Create an issue** - If no issue exists, create one to discuss your proposed changes
3. **Get feedback** - Wait for maintainer feedback before starting significant work

## Pull Request Process

### Before Submitting

1. **Ensure tests pass** - Run `npm run test` and ensure all tests pass
2. **Run linting** - Run `npm run lint` and fix any issues
3. **Update documentation** - Update README, JSDoc comments, or other docs as needed
4. **Add tests** - Include tests for new functionality
5. **Test examples** - Ensure any examples still work with your changes

### PR Guidelines

1. **Use descriptive titles** - Clearly describe what your PR does
2. **Provide context** - Explain why the change is needed
3. **Reference issues** - Link to related issues using `Fixes #123` or `Closes #123`
4. **Keep changes focused** - One feature or fix per PR
5. **Update CHANGELOG** - Add an entry to the unreleased section

### PR Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings introduced
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Provide proper type annotations
- Avoid `any` types when possible
- Use interfaces for object shapes

### Vue Components

- Use Composition API with `<script setup>`
- Follow Vue 3 best practices
- Use props validation and defaults
- Provide proper slot documentation

### Code Style

- Use Prettier for code formatting
- Follow ESLint rules
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Example Code Style

```typescript
/**
 * Creates a connection between two nodes
 * @param source - The source node identifier
 * @param target - The target node identifier
 * @returns The created connection object
 */
export function createConnection(source: string, target: string): Connection {
  return {
    id: `${source}-${target}`,
    source,
    target
  };
}
```

## Testing

### Test Requirements

- Write unit tests for new functionality
- Maintain or improve test coverage
- Use Vue Test Utils for component testing
- Test both happy path and edge cases

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { ValueMapperNode } from '../ValueMapperNode.vue';

describe('ValueMapperNode', () => {
  it('should render with correct identifier', () => {
    const wrapper = mount(ValueMapperNode, {
      props: {
        identifier: 'test-node',
        type: 'source'
      }
    });
    
    expect(wrapper.exists()).toBe(true);
  });
});
```

## Documentation

### Documentation Standards

- Use clear, concise language
- Provide code examples for all features
- Include TypeScript types in examples
- Update README for new features
- Add JSDoc comments for all public APIs

### Documentation Files

- `README.md` - Main documentation
- Component files - JSDoc comments
- `docs/` - Additional documentation
- `CHANGELOG.md` - Version history

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

1. **Environment details** - OS, Node version, Vue version
2. **Steps to reproduce** - Clear steps to reproduce the issue
3. **Expected behavior** - What you expected to happen
4. **Actual behavior** - What actually happened
5. **Code examples** - Minimal reproduction case
6. **Screenshots** - If applicable

### Feature Requests

When requesting features, please include:

1. **Use case** - Why you need this feature
2. **Proposed solution** - How you think it should work
3. **Alternatives** - Other solutions you've considered
4. **Examples** - Code examples of desired API

### Issue Template

```markdown
## Bug Report / Feature Request

### Environment
- OS: [e.g. macOS 12.0]
- Node: [e.g. 18.0.0]
- Vue: [e.g. 3.3.0]
- Package Version: [e.g. 1.0.0]

### Description
Clear description of the issue or feature request.

### Steps to Reproduce (for bugs)
1. Step one
2. Step two
3. See error

### Expected Behavior
What should happen.

### Actual Behavior
What actually happens.

### Code Example
```vue
<!-- Minimal reproduction case -->
```

## Release Process

Releases are handled by maintainers and follow semantic versioning:

- **Patch** (1.0.x) - Bug fixes
- **Minor** (1.x.0) - New features, backward compatible
- **Major** (x.0.0) - Breaking changes

## Getting Help

- **GitHub Issues** - For bug reports and feature requests
- **GitHub Discussions** - For questions and community discussion
- **Documentation** - Check the README and API docs first

## Recognition

Contributors will be recognized in:

- CHANGELOG.md for their contributions
- GitHub contributors list
- Special recognition for significant contributions

Thank you for contributing to Value Mapper Vue! 🎉
