import type { Meta, StoryObj } from '@storybook/vue3';

import ValueMapper from './ValueMapper.vue';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Sketchmonk/Value Mapper Vue',
  component: ValueMapper,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof ValueMapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {},
};

