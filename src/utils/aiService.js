import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * AI Service for README generation and improvements
 * Uses Google Gemini API
 */

class AIService {
    constructor() {
        this.genAI = null;
        this.model = null;
        this.isConfigured = false;
    }

    /**
     * Initialize the AI service with API key
     * @param {string} apiKey - Google Gemini API key
     */
    configure(apiKey) {
        if (!apiKey) {
            console.warn('AI Service: No API key provided');
            this.isConfigured = false;
            return false;
        }

        try {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
            this.isConfigured = true;
            console.log('AI Service: Configured successfully');
            return true;
        } catch (error) {
            console.error('AI Service: Configuration failed', error);
            this.isConfigured = false;
            return false;
        }
    }

    /**
     * Check if AI service is ready to use
     */
    isReady() {
        return this.isConfigured && this.model !== null;
    }

    /**
     * Generate a complete README from scratch
     * @param {string} projectDescription - Brief description of the project
     */
    async generateReadme(projectDescription) {
        if (!this.isReady()) {
            throw new Error('AI Service not configured. Please add your API key.');
        }

        const prompt = `Generate a professional, comprehensive README.md file for a project with the following description:

${projectDescription}

Include these sections:
- Title and description
- Features
- Installation
- Usage examples
- Configuration (if applicable)
- Contributing guidelines
- License

Use proper markdown formatting, badges, and make it visually appealing.`;

        const result = await this.model.generateContent(prompt);
        return result.response.text();
    }

    /**
     * Improve selected text
     * @param {string} text - Text to improve
     */
    async improveText(text) {
        if (!this.isReady()) {
            throw new Error('AI Service not configured. Please add your API key.');
        }

        const prompt = `Improve the following README.md text. Make it more professional, clear, and engaging while maintaining the same meaning. Keep the markdown formatting:

${text}

Return only the improved text, nothing else.`;

        const result = await this.model.generateContent(prompt);
        return result.response.text();
    }

    /**
     * Generate installation instructions
     * @param {string} context - Current README content for context
     */
    async generateInstallation(context = '') {
        if (!this.isReady()) {
            throw new Error('AI Service not configured. Please add your API key.');
        }

        const prompt = `Generate a comprehensive "Installation" section for a README.md file.

${context ? `Context from existing README:\n${context}\n\n` : ''}

Include:
- Prerequisites
- Step-by-step installation instructions
- Common installation methods (npm, yarn, git clone, etc.)
- Verification steps

Use proper markdown formatting.`;

        const result = await this.model.generateContent(prompt);
        return result.response.text();
    }

    /**
     * Generate usage examples
     * @param {string} context - Current README content for context
     */
    async generateUsage(context = '') {
        if (!this.isReady()) {
            throw new Error('AI Service not configured. Please add your API key.');
        }

        const prompt = `Generate a "Usage" section with code examples for a README.md file.

${context ? `Context from existing README:\n${context}\n\n` : ''}

Include:
- Basic usage example
- Advanced usage examples
- Code snippets with syntax highlighting
- Common use cases

Use proper markdown formatting with code blocks.`;

        const result = await this.model.generateContent(prompt);
        return result.response.text();
    }

    /**
     * Fix grammar and spelling
     * @param {string} text - Text to fix
     */
    async fixGrammar(text) {
        if (!this.isReady()) {
            throw new Error('AI Service not configured. Please add your API key.');
        }

        const prompt = `Fix any grammar, spelling, or punctuation errors in the following text. Keep the markdown formatting intact:

${text}

Return only the corrected text, nothing else.`;

        const result = await this.model.generateContent(prompt);
        return result.response.text();
    }

    /**
     * Generate a specific section
     * @param {string} sectionName - Name of the section to generate
     * @param {string} context - Current README content for context
     */
    async generateSection(sectionName, context = '') {
        if (!this.isReady()) {
            throw new Error('AI Service not configured. Please add your API key.');
        }

        const prompt = `Generate a "${sectionName}" section for a README.md file.

${context ? `Context from existing README:\n${context}\n\n` : ''}

Make it professional, comprehensive, and well-formatted with proper markdown.`;

        const result = await this.model.generateContent(prompt);
        return result.response.text();
    }

    /**
     * Get custom suggestion based on user prompt
     * @param {string} userPrompt - User's custom request
     * @param {string} context - Current README content for context
     */
    async getCustomSuggestion(userPrompt, context = '') {
        if (!this.isReady()) {
            throw new Error('AI Service not configured. Please add your API key.');
        }

        const prompt = `You are a README.md expert. Help with the following request:

${userPrompt}

${context ? `Current README content:\n${context}` : ''}

Provide a helpful response in markdown format.`;

        const result = await this.model.generateContent(prompt);
        return result.response.text();
    }
}

// Export singleton instance
export const aiService = new AIService();

// Try to configure from environment variable or localStorage
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key');
if (apiKey) {
    aiService.configure(apiKey);
}

export default aiService;
