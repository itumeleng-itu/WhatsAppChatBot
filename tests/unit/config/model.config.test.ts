import {
  MODEL_CONSTRAINTS,
  getSystemPrompt,
  getUserPromptTemplate,
  isOutOfScope
} from '../../../src/config/model.config';

describe('model.config', () => {

  describe('MODEL_CONSTRAINTS', () => {

    it('should contain exactly 7 in-scope categories', () => {
      expect(MODEL_CONSTRAINTS.inScopeCategories.length).toBe(7);
    });

    it('should include expected real category values', () => {
      expect(MODEL_CONSTRAINTS.inScopeCategories).toContain('faqs');
      expect(MODEL_CONSTRAINTS.inScopeCategories).toContain('eligibility');
      expect(MODEL_CONSTRAINTS.inScopeCategories).toContain('application-process');
    });

    it('should contain real out-of-scope keywords', () => {
      expect(MODEL_CONSTRAINTS.outOfScopeKeywords).toContain('grade');
      expect(MODEL_CONSTRAINTS.outOfScopeKeywords).toContain('update record');
      expect(MODEL_CONSTRAINTS.outOfScopeKeywords).toContain('mark');
    });

  });

  describe('getSystemPrompt', () => {

    it('should include required system instructions', () => {
      const prompt = getSystemPrompt();

      expect(prompt).toContain('CodeTribe Academy');
      expect(prompt).toContain('IN SCOPE');
      expect(prompt).toContain('OUT OF SCOPE');
    });

  });

  describe('getUserPromptTemplate', () => {

    it('should contain {query} and {context} placeholders', () => {
      const template = getUserPromptTemplate();

      expect(template).toContain('{query}');
      expect(template).toContain('{context}');
    });

  });

  describe('isOutOfScope', () => {

    it('should return true for grade-related questions', () => {
      expect(isOutOfScope('What is my grade?')).toBe(true);
    });

    it('should return true for record update questions', () => {
      expect(isOutOfScope('update record')).toBe(true);
    });

    it('should return false for admissions questions', () => {
      expect(isOutOfScope('How do I apply?')).toBe(false);
    });

  });

});
