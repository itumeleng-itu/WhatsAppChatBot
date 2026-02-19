import { FAQData } from '../../src/services/business-api.service';

export const mockFAQs: FAQData[] = [
  {
    id: '1',
    category: 'financial',
    question: 'What is the stipend?',
    answer: 'The stipend is R3,000 per month.',
    tags: ['money', 'stipend'],
  },
  {
    id: '2',
    category: 'application',
    question: 'How do I apply?',
    answer: 'You can apply online via the official website.',
    tags: ['apply', 'registration'],
  },
  {
    id: '3',
    category: 'eligibility',
    question: 'Who is eligible?',
    answer: 'South African youth between 18 and 35.',
    tags: ['age', 'requirements'],
  },
];

export const mockEmptyFAQs: FAQData[] = [];